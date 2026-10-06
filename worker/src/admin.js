// =============================================================================
// Founder admin (/admin/audits/) and audit report pages (/audit/<token>/).
// Auth: worker secret ADMIN_KEY, passed once as ?key=... (or via the sign-in
// form) and then kept in an HttpOnly, Secure, SameSite=Strict cookie holding a
// SHA-256 derivative of the key (never the key itself).
// =============================================================================
import { adminList, adminReview, adminLogin, reportPage } from './audit/render.js';
import { getLead, getAudit, putAudit, approveAndSend, discardAudit, buildAudit, applyAi, config } from './audit/pipeline.js';
import { slugToLeadId, leadSlug, normaliseUrl } from './audit/util.js';
import { AREAS } from './audit/score.js';

const COOKIE = 'sm_admin';
// Founder-chosen password; 16+ characters recommended, 10 is the floor.
const MIN_KEY_LEN = 10;

// ---- Sign-in brute-force protection ----------------------------------------
// Failed sign-ins are counted per client IP (adminfail:<ip>, 15-minute TTL) and
// globally per UTC hour (adminfail:global:<YYYY-MM-DDTHH>). 5 failures lock that
// IP for 15 minutes; more than 50 failures in an hour lock all sign-ins for the
// rest of that hour. Cookie sessions are not affected.
const FAIL_IP_LIMIT = 5;
const FAIL_IP_TTL = 15 * 60;
const FAIL_GLOBAL_LIMIT = 50;

function clientIp(request) {
  return (request.headers.get('cf-connecting-ip') || 'unknown').slice(0, 64);
}
function globalFailKey() {
  return 'adminfail:global:' + new Date().toISOString().slice(0, 13);
}
async function readCount(env, key) {
  try { return parseInt((await env.LEADS.get(key)) || '0', 10) || 0; } catch { return 0; }
}
async function signInLocked(env, ip) {
  const [mine, all] = await Promise.all([readCount(env, 'adminfail:' + ip), readCount(env, globalFailKey())]);
  if (all > FAIL_GLOBAL_LIMIT) return 'Too many failed sign-in attempts. Admin sign-in is locked for the rest of this hour.';
  if (mine >= FAIL_IP_LIMIT) return 'Too many failed sign-in attempts from your network. Try again in 15 minutes.';
  return null;
}
async function recordFailure(env, ip) {
  const gk = globalFailKey();
  const [mine, all] = await Promise.all([readCount(env, 'adminfail:' + ip), readCount(env, gk)]);
  await Promise.all([
    env.LEADS.put('adminfail:' + ip, String(mine + 1), { expirationTtl: FAIL_IP_TTL }),
    env.LEADS.put(gk, String(all + 1), { expirationTtl: 2 * 3600 })
  ]);
}
async function clearFailures(env, ip) {
  try { await env.LEADS.delete('adminfail:' + ip); } catch { /* ignore */ }
}
function lockedResponse(message) {
  return new Response(message + '\n', { status: 429, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex', 'Retry-After': '900' } });
}
const PRIVATE_HEADERS = {
  'Content-Type': 'text/html; charset=utf-8',
  'Cache-Control': 'private, no-store',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'same-origin',
  'X-Frame-Options': 'DENY'
};

function html(body, status = 200, extra = {}) {
  return new Response(body, { status, headers: { ...PRIVATE_HEADERS, ...extra } });
}
function redirect(location, extra = {}) {
  return new Response(null, { status: 303, headers: { Location: location, 'Cache-Control': 'no-store', ...extra } });
}

async function sha256Hex(s) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}
function safeEqual(a, b) {
  a = String(a || ''); b = String(b || '');
  if (!a || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
async function cookieValue(env) { return sha256Hex('showme-admin-v1:' + env.ADMIN_KEY); }
function readCookie(request, name) {
  const m = new RegExp('(?:^|;\\s*)' + name + '=([^;]+)').exec(request.headers.get('cookie') || '');
  return m ? m[1] : '';
}
export async function isAdmin(request, env) {
  if (!env.ADMIN_KEY || env.ADMIN_KEY.length < MIN_KEY_LEN) return false;
  return safeEqual(readCookie(request, COOKIE), await cookieValue(env));
}
async function setCookieHeader(env) {
  return `${COOKIE}=${await cookieValue(env)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${60 * 60 * 24 * 30}`;
}
function sameOrigin(request, url) {
  // Safari sends "Origin: null" on form posts from no-referrer pages, so fall back
  // to Sec-Fetch-Site / Referer. The SameSite admin cookie is a second CSRF guard.
  const o = request.headers.get('origin');
  if (o && o !== 'null') return o === url.origin;
  const site = request.headers.get('sec-fetch-site');
  if (site) return site === 'same-origin';
  const ref = request.headers.get('referer') || '';
  if (ref) return ref === url.origin || ref.startsWith(url.origin + '/');
  return o === 'null';
}

async function listRecent(env, cursorPage = 1) {
  // Leads are keyed lead:<epoch-ms>:<rand>, so key order == time order.
  const keys = [];
  let cursor;
  for (let i = 0; i < 5; i++) {
    const page = await env.LEADS.list({ prefix: 'lead:', cursor, limit: 1000 });
    keys.push(...page.keys);
    if (page.list_complete) break;
    cursor = page.cursor;
  }
  keys.sort((a, b) => (a.name < b.name ? 1 : -1));
  const per = 50;
  const slice = keys.slice((cursorPage - 1) * per, cursorPage * per);
  const audits = new Map();
  let ac;
  for (let i = 0; i < 5; i++) {
    const page = await env.LEADS.list({ prefix: 'audit:lead:', cursor: ac, limit: 1000 });
    for (const k of page.keys) audits.set(k.name.slice(6), k.metadata || {});
    if (page.list_complete) break;
    ac = page.cursor;
  }
  const rows = await Promise.all(slice.map(async k => {
    const lead = (await getLead(env, k.name)) || { id: k.name };
    const am = audits.get(k.name);
    let audit = null;
    if (am) audit = { status: am.s || 'draft', result: am.t != null ? { total: am.t } : null };
    return { lead, audit };
  }));
  return { rows, more: keys.length > cursorPage * per ? String(cursorPage + 1) : null };
}

function readEdits(form, audit) {
  const c = audit.copy || {};
  const prios = [0, 1, 2].map(i => ({
    area: String(form.get(`p${i}_area`) || (c.priorities?.[i]?.area) || ''),
    title: String(form.get(`p${i}_title`) || '').trim().slice(0, 120),
    why: String(form.get(`p${i}_why`) || '').trim().slice(0, 800),
    action: String(form.get(`p${i}_action`) || '').trim().slice(0, 800)
  })).filter(p => p.title || p.why || p.action);
  const rec = {};
  for (const a of AREAS) rec[a.key] = String(form.get('rec_' + a.key) || '').trim().slice(0, 1200);
  return { summary: String(form.get('summary') || '').trim().slice(0, 1200), priorities: prios, recommendations: rec };
}

export async function handleAdmin(request, env, url, ctx) {
  const { pathname } = url;
  if (!env.ADMIN_KEY) return html('<h1>Admin not configured</h1>', 503);

  // Sign in via ?key= (link from the alert email) or the login form.
  const qKey = url.searchParams.get('key');
  const isFormLogin = pathname === '/admin/login' && request.method === 'POST';
  if (qKey || isFormLogin) {
    const ip = clientIp(request);
    const locked = await signInLocked(env, ip);
    if (locked) return lockedResponse(locked);
    let candidate = qKey;
    if (!candidate) {
      const form = await request.formData().catch(() => null);
      candidate = form ? String(form.get('key') || '') : '';
    }
    if (env.ADMIN_KEY.length < MIN_KEY_LEN || !safeEqual(candidate, env.ADMIN_KEY)) {
      await recordFailure(env, ip);
      return html(adminLogin(true), 401);
    }
    await clearFailures(env, ip);
    const cookie = { 'Set-Cookie': await setCookieHeader(env) };
    if (qKey) {
      url.searchParams.delete('key');
      return redirect(url.pathname + (url.search || ''), cookie);
    }
    return redirect('/admin/audits/', cookie);
  }
  if (!(await isAdmin(request, env))) return html(adminLogin(false), 401);
  if (pathname === '/admin' || pathname === '/admin/' || pathname === '/admin/audits') return redirect('/admin/audits/');

  if (pathname === '/admin/audits/' && request.method === 'GET') {
    const pg = Math.max(1, parseInt(url.searchParams.get('cursor') || '1', 10) || 1);
    const { rows, more } = await listRecent(env, pg);
    return html(adminList(rows, { flash: url.searchParams.get('msg'), cursorNext: more }));
  }

  const m = /^\/admin\/audits\/([0-9]+_[a-z0-9]+)\/(save|approve|discard|rescan)?$/.exec(pathname);
  if (!m) return html('<h1>Not found</h1>', 404);
  const leadId = slugToLeadId(m[1]);
  const action = m[2];
  const lead = leadId && (await getLead(env, leadId));
  if (!lead) return html('<h1>Lead not found</h1>', 404);
  lead.id = leadId;
  const back = '/admin/audits/' + leadSlug(leadId) + '/';

  if (!action) {
    if (request.method !== 'GET') return html('Method not allowed', 405);
    const audit = await getAudit(env, leadId);
    return html(adminReview(lead, audit, { flash: url.searchParams.get('msg'), error: url.searchParams.get('err'), config: config(env) }));
  }

  if (request.method !== 'POST') return html('Method not allowed', 405);
  if (!sameOrigin(request, url)) return html('Bad origin', 403);
  const form = await request.formData().catch(() => new FormData());
  const audit = await getAudit(env, leadId);

  if (action === 'save' || action === 'approve') {
    if (!audit || !audit.result) return redirect(back + '?err=' + encodeURIComponent('No draft to save'));
    if (audit.status === 'draft') {
      const edits = readEdits(form, audit);
      const changed = JSON.stringify(edits) !== JSON.stringify({ summary: audit.copy.summary, priorities: audit.copy.priorities, recommendations: audit.copy.recommendations });
      if (changed) {
        audit.copy = edits;
        audit.copy_source = 'edited';
        audit.edited_at = new Date().toISOString();
        audit.needs_ai = false;
        await putAudit(env, audit);
      }
    }
    if (action === 'save') return redirect(back + '?msg=' + encodeURIComponent('Saved'));
    const r = await approveAndSend(env, leadId);
    return redirect(back + (r.ok ? '?msg=' + encodeURIComponent('Approved and sent to ' + lead.email) : '?err=' + encodeURIComponent(r.error)));
  }
  if (action === 'discard') {
    const r = await discardAudit(env, leadId);
    return redirect(r.ok ? '/admin/audits/?msg=' + encodeURIComponent('Discarded audit for ' + (lead.name || leadId)) : back + '?err=' + encodeURIComponent(r.error));
  }
  if (action === 'rescan') {
    if (audit && audit.status === 'sent') return redirect(back + '?err=' + encodeURIComponent('Already sent; cannot re-scan'));
    const target = normaliseUrl(String(form.get('url') || lead.website || ''));
    if (!target) return redirect(back + '?err=' + encodeURIComponent('Enter a valid website'));
    const base = audit && audit.status !== 'discarded' ? audit : null;
    const built = await buildAudit(env, lead, target, { mode: 'cron', existing: base });
    if (built.status === 'draft') ctx.waitUntil(applyAi(env, built, lead, 20000));
    return redirect(back + (built.status === 'draft' ? '?msg=' + encodeURIComponent('Scan complete (' + built.result.total + '/60). AI wording is being applied; refresh in up to a minute.') : '?err=' + encodeURIComponent(built.error || 'Scan failed')));
  }
  return html('<h1>Not found</h1>', 404);
}

export async function handleReport(request, env, url) {
  const m = /^\/audit\/([A-Za-z0-9_-]{24,64})(\/)?$/.exec(url.pathname);
  if (!m) return html('<h1>Not found</h1>', 404);
  if (!m[2]) return new Response(null, { status: 301, headers: { Location: '/audit/' + m[1] + '/', 'X-Robots-Tag': 'noindex' } });
  if (request.method !== 'GET' && request.method !== 'HEAD') return html('Method not allowed', 405);
  const leadId = await env.LEADS.get('audittoken:' + m[1]);
  const audit = leadId && (await getAudit(env, leadId));
  if (!audit || audit.token !== m[1] || !audit.result) return notFound();
  const admin = await isAdmin(request, env);
  if (audit.status !== 'sent' && !admin) return notFound();
  if (audit.status === 'discarded' && !admin) return notFound();
  const lead = (await getLead(env, leadId)) || {};
  return html(reportPage(audit, lead, { preview: audit.status !== 'sent', replyTo: config(env).REPLY_TO }));
}

function notFound() {
  return html('<!doctype html><meta name="robots" content="noindex"><title>Not found</title><link rel="stylesheet" href="/styles.css"><main style="padding:80px 20px;text-align:center"><h1>Report not found</h1><p>This link is not valid or has not been released yet. <a href="/free-audit/">Request a free audit</a>.</p></main>', 404);
}
