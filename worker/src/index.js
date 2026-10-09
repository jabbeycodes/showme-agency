// =============================================================================
// ShowMe Digital Agency — Cloudflare Worker
//
// Responsibilities:
//   POST /api/lead   -> validate + store a lead in KV (binding: LEADS), then (in
//                       ctx.waitUntil) alert the founder and run the free audit
//   POST /api/event  -> increment a daily counter for an allowed event in KV
//   GET  /audit/<token>/  -> approved audit report (noindex; drafts admin-only)
//   /admin/audits/   -> founder review/approval (ADMIN_KEY secret)
//   scheduled        -> cron: finish pending alerts/scans, due follow-ups
//   everything else  -> serve the generated static site (binding: ASSETS),
//                       with region pricing: United States / USD by default,
//                       Ghana / GHS for visitors in Ghana (request.cf.country)
//                       or anyone who picks it (?region=gh / sm_region cookie)
//
// PREVIEW mode (env.PREVIEW === "1", see wrangler.preview.toml): no KV, no
// email, no audits, no admin; /api/* return a harmless 200; pages carry a
// "PREVIEW — proposed prices" banner and noindex.
//
// This reproduces the behaviour of the previous inline worker while adding
// multi-page static-asset serving. It is intentionally dependency-free.
// =============================================================================

import { enqueueLead, processLead, runScheduled } from './audit/pipeline.js';
import { setSelfRoute } from './audit/util.js';

const SELF_HOSTS = ['agency.showmeworld.app', 'showme-agency.codeproject1111.workers.dev'];
function registerSelfRoute(env) {
  if (env.ASSETS) setSelfRoute(SELF_HOSTS, req => env.ASSETS.fetch(req));
}
import { handleAdmin, handleReport } from './admin.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_EVENTS = new Set(['pageview', 'lead_submitted', 'whatsapp_click']);

const JSON_HEADERS = { 'Content-Type': 'application/json' };

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

/** Trim to a string and cap its length. */
function clamp(value, max) {
  return String(value == null ? '' : value).slice(0, max);
}

async function handleLead(request, env, ctx) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }

  const name = clamp(data.name, 120).trim();
  const email = clamp(data.email, 160).trim();

  if (!name) return json({ ok: false, error: 'name_required' }, 400);
  if (!email || !EMAIL_RE.test(email)) return json({ ok: false, error: 'email_invalid' }, 400);

  const id = 'lead:' + Date.now() + ':' + Math.random().toString(36).slice(2, 10);
  const lead = {
    id,
    name,
    business: clamp(data.business, 200).trim(),
    email,
    phone: clamp(data.phone, 40).trim(),
    need: clamp(data.need, 80).trim(),
    message: clamp(data.message, 2000).trim(),
    // Free-audit fields (optional). Note: `website` in the form is a honeypot,
    // so the real site URL arrives as `site_url`.
    website: clamp(data.site_url, 300).trim(),
    found_via: clamp(data.found_via, 80).trim(),
    time_waster: clamp(data.time_waster, 500).trim(),
    page: clamp(data.page, 80).trim(),
    created_at: new Date().toISOString(),
    ua: clamp(request.headers.get('user-agent') || '', 200),
    notified: false
  };

  // Drop empty optional fields so legacy-shaped records stay the same.
  for (const k of ['website', 'found_via', 'time_waster', 'page']) if (!lead[k]) delete lead[k];

  try {
    await env.LEADS.put(id, JSON.stringify(lead), {
      metadata: { n: name.slice(0, 80), b: lead.business.slice(0, 80), w: (lead.website || '').slice(0, 120) }
    });
  } catch (err) {
    return json({ ok: false, error: 'storage_error' }, 500);
  }

  // Founder alert + automated audit run after the response is sent. The job
  // marker lets the cron finish anything the waitUntil budget cuts short.
  try {
    await enqueueLead(env, lead);
    if (ctx && ctx.waitUntil) ctx.waitUntil(processLead(env, id, 'inline'));
  } catch {
    // Never fail the form because of the follow-on pipeline.
  }

  return json({ ok: true, id });
}

async function handleEvent(request, env) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }

  const event = clamp(data.event, 40);
  if (!ALLOWED_EVENTS.has(event)) return json({ ok: false, error: 'event_not_allowed' }, 400);

  const day = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const key = 'stats:' + day + ':' + event;

  try {
    const current = parseInt((await env.LEADS.get(key)) || '0', 10) || 0;
    await env.LEADS.put(key, String(current + 1));
  } catch {
    // Analytics must never surface an error to the client.
    return json({ ok: true });
  }

  return json({ ok: true });
}

export default {
  async fetch(request, env, ctx) {
    registerSelfRoute(env);
    const url = new URL(request.url);
    const { pathname } = url;

    if (isPreview(env)) {
      // Preview: never store, email, audit or expose admin. Forms "succeed".
      if (pathname === '/api/lead' || pathname === '/api/event') {
        if (request.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);
        return json({ ok: true, preview: true });
      }
      if (pathname.startsWith('/api/')) return json({ ok: false, error: 'not_found' }, 404);
      if (pathname === '/admin' || pathname.startsWith('/admin/') || pathname.startsWith('/audit/')) {
        return notFoundResponse(request, env, url);
      }
      if (pathname === '/robots.txt') {
        return new Response('User-agent: *\nDisallow: /\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Robots-Tag': 'noindex' } });
      }
      return serveAsset(request, env, url);
    }

    if (pathname === '/api/lead') {
      if (request.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);
      return handleLead(request, env, ctx);
    }

    if (pathname === '/admin' || pathname.startsWith('/admin/')) return handleAdmin(request, env, url, ctx);
    if (pathname.startsWith('/audit/')) return handleReport(request, env, url);

    if (pathname === '/api/event') {
      if (request.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);
      return handleEvent(request, env);
    }

    // Any other /api/* path is unknown.
    if (pathname.startsWith('/api/')) return json({ ok: false, error: 'not_found' }, 404);

    // Everything else: serve the generated static site, with SEO-safe tweaks.
    return serveAsset(request, env, url);
  },

  async scheduled(event, env, ctx) {
    if (isPreview(env)) return; // preview has no cron, but never run the pipeline there
    registerSelfRoute(env);
    ctx.waitUntil(runScheduled(env).then(r => console.log('audit-cron', JSON.stringify(r).slice(0, 2000))));
  }
};

// ---- Static assets ----------------------------------------------------------
// The Worker runs first for every request (run_worker_first = true) so it can:
//  - turn the asset layer's 307 "clean URL" redirects (/services -> /services/,
//    /about/index.html -> /about/) into permanent 301s for search engines;
//  - return a real 404 status for /404 and /404.html (no soft-404 duplicate);
//  - set explicit charsets and cache lifetimes per file type.
const ONE_YEAR = 31536000;
const ONE_WEEK = 604800;

function cacheControlFor(pathname, search) {
  // Versioned CSS/JS (?v=<content hash>) never change at a given URL.
  if (/\.(css|js)$/.test(pathname) && /(^|[?&])v=[0-9a-f]{6,}/.test(search)) {
    return `public, max-age=${ONE_YEAR}, immutable`;
  }
  if (/\.(css|js)$/.test(pathname)) return 'public, max-age=3600, stale-while-revalidate=86400';
  if (pathname.startsWith('/assets/') || /\.(png|jpe?g|webp|avif|gif|svg|ico|woff2?)$/.test(pathname)) {
    return `public, max-age=${ONE_WEEK}, stale-while-revalidate=86400`;
  }
  if (pathname === '/robots.txt' || pathname === '/sitemap.xml' || pathname === '/site.webmanifest') {
    return 'public, max-age=3600';
  }
  if (/^\/google[a-f0-9]+\.html$/i.test(pathname)) {
    return 'public, max-age=0, must-revalidate';
  }
  // HTML: always revalidate so content updates show immediately.
  return 'public, max-age=0, must-revalidate';
}

function contentTypeFix(pathname, current) {
  if (pathname === '/robots.txt') return 'text/plain; charset=utf-8';
  if (/^\/google[a-f0-9]+\.html$/i.test(pathname)) return 'text/plain; charset=utf-8';
  if (pathname === '/sitemap.xml') return 'application/xml; charset=utf-8';
  if (current && /^text\/(html|plain|css|javascript)$/.test(current.trim())) return current.trim() + '; charset=utf-8';
  return null;
}

async function notFoundResponse(request, env, url) {
  const res = await env.ASSETS.fetch(new Request(new URL('/404.html', url), { method: 'GET', headers: request.headers }));
  // Follow the asset layer's own /404.html -> /404 clean-URL redirect, if any.
  let page = res;
  if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
    page = await env.ASSETS.fetch(new Request(new URL(res.headers.get('location'), url), { method: 'GET', headers: request.headers }));
  }
  const headers = new Headers(page.headers);
  headers.set('Content-Type', 'text/html; charset=utf-8');
  headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
  headers.set('X-Robots-Tag', 'noindex');
  headers.delete('ETag');
  return localize(request, env, url, new Response(request.method === 'HEAD' ? null : page.body, { status: 404, headers }));
}

async function serveAsset(request, env, url) {
  const { pathname, search } = url;

  // HTML differs per region, but the asset layer's ETag does not, so never
  // let a conditional request return a 304 for the other region's page.
  if (looksLikeHtml(pathname)) {
    const h = new Headers(request.headers);
    h.delete('If-None-Match');
    h.delete('If-Modified-Since');
    request = new Request(request, { headers: h });
  }

  if (pathname === '/404' || pathname === '/404.html' || pathname === '/404/') {
    return notFoundResponse(request, env, url);
  }

  // Google Search Console HTML verification must return 200 at the exact
  // /google*.html path (no clean-URL redirect to the extensionless form).
  const isGscVerify = /^\/google[a-f0-9]+\.html$/i.test(pathname);

  const res = await env.ASSETS.fetch(request);

  // Clean-URL redirects from the asset layer are 307; make them permanent.
  // Exception: GSC verify files — follow internally and serve 200 at .html.
  if (res.status === 307 || res.status === 308) {
    const location = res.headers.get('location');
    if (location) {
      const target = new URL(location, url);
      if (target.origin === url.origin) target.search = search; // keep query string
      if (isGscVerify) {
        const page = await env.ASSETS.fetch(new Request(target, { method: 'GET', headers: request.headers }));
        const headers = new Headers(page.headers);
        headers.set('Content-Type', 'text/plain; charset=utf-8');
        headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
        headers.set('X-Content-Type-Options', 'nosniff');
        headers.delete('ETag');
        const ok = page.status === 200 || page.status === 304;
        return new Response(request.method === 'HEAD' ? null : page.body, { status: ok ? page.status : 200, headers });
      }
      return new Response(null, {
        status: 301,
        headers: { Location: target.origin === url.origin ? target.pathname + target.search : target.href, 'Cache-Control': 'public, max-age=3600' }
      });
    }
  }

  if (res.status === 404) {
    const headers = new Headers(res.headers);
    headers.set('Content-Type', 'text/html; charset=utf-8');
    headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
    headers.set('X-Robots-Tag', 'noindex');
    return localize(request, env, url, new Response(res.body, { status: 404, headers }));
  }

  if (res.status !== 200 && res.status !== 304) return res;

  const headers = new Headers(res.headers);
  headers.set('Cache-Control', cacheControlFor(pathname, search));
  const ct = contentTypeFix(pathname, headers.get('content-type'));
  if (ct) headers.set('Content-Type', ct);
  headers.set('X-Content-Type-Options', 'nosniff');
  return localize(request, env, url, new Response(res.body, { status: res.status, headers }));
}

// ---- Region pricing ---------------------------------------------------------
// Pages are built with United States / USD prices as the visible default and
// every regional value duplicated in data-us / data-gh attributes (one
// canonical URL; crawlers, including Googlebot, see USD). Choice order:
//   1. ?region=us|gh   (also stored in the sm_region cookie)
//   2. sm_region cookie (set by the switcher)
//   3. request.cf.country === 'GH' -> Ghana; every other country -> US/USD
function isPreview(env) { return env && env.PREVIEW === '1'; }

function looksLikeHtml(pathname) {
  return pathname.endsWith('/') || pathname.endsWith('.html') || !/\.[a-z0-9]+$/i.test(pathname);
}

function pickRegion(request, url) {
  const q = url.searchParams.get('region');
  if (q === 'us' || q === 'gh') return { region: q, fromQuery: true };
  const m = (request.headers.get('cookie') || '').match(/(?:^|;\s*)sm_region=(us|gh)\b/);
  if (m) return { region: m[1] };
  const country = request.cf && request.cf.country;
  return { region: country === 'GH' ? 'gh' : 'us' };
}

const PREVIEW_BANNER = '<div class="preview-banner" role="note">PREVIEW &mdash; proposed prices (not live). US prices are proposals awaiting approval.</div>';

function localize(request, env, url, res) {
  const type = res.headers.get('content-type') || '';
  if (!/^text\/html/i.test(type) || !res.body) return res;
  const { region, fromQuery } = pickRegion(request, url);
  const headers = new Headers(res.headers);
  headers.delete('ETag');
  headers.delete('Last-Modified');
  const vary = headers.get('Vary');
  headers.set('Vary', vary ? vary + ', Cookie' : 'Cookie');
  if (fromQuery) {
    headers.append('Set-Cookie', `sm_region=${region}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`);
  }
  const preview = isPreview(env);
  if (preview) headers.set('X-Robots-Tag', 'noindex, nofollow');
  if (region === 'us' && !preview) return new Response(res.body, { status: res.status, headers });

  let rw = new HTMLRewriter();
  if (region === 'gh') {
    rw = rw
      .on('html', { element(el) { el.setAttribute('data-region', 'gh'); } })
      // data-gh values are built from trusted, entity-encoded build output.
      .on('[data-gh]', { element(el) { el.setInnerContent(el.getAttribute('data-gh'), { html: true }); } })
      .on('[data-set-region]', { element(el) { el.setAttribute('aria-pressed', String(el.getAttribute('data-set-region') === 'gh')); } });
  }
  if (preview) {
    rw = rw
      .on('head', { element(el) { el.append('<meta name="robots" content="noindex,nofollow" />', { html: true }); } })
      .on('body', { element(el) { el.prepend(PREVIEW_BANNER, { html: true }); } });
  }
  return rw.transform(new Response(res.body, { status: res.status, headers }));
}
