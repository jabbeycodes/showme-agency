// Shared helpers for the audit pipeline (runs in Workers and in Node 20).

export function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// A Worker cannot fetch its own custom domain over the network (Cloudflare
// returns 522 for same-zone loops), so the worker registers a local fetcher
// (its static-assets binding) for its own hostnames.
let selfRoute = null;
export function setSelfRoute(hosts, fetcher) { selfRoute = hosts && fetcher ? { hosts: new Set(hosts), fetcher } : null; }
export function isSelfHost(host) { return !!(selfRoute && selfRoute.hosts.has(String(host).toLowerCase())); }

/** fetch() with a hard timeout. Never throws: returns { ok:false, error } on failure. */
export async function timedFetch(url, opts = {}, ms = 8000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort('timeout'), ms);
  const started = Date.now();
  try {
    let self = false;
    try { self = isSelfHost(new URL(url).hostname); } catch { /* ignore */ }
    const res = self
      ? await selfRoute.fetcher(new Request(String(url).replace(/^http:/, 'https:'), { method: opts.method || 'GET', headers: opts.headers }))
      : await fetch(url, { ...opts, signal: ctrl.signal });
    return { ok: true, res, ms: Date.now() - started };
  } catch (err) {
    const timedOut = ctrl.signal.aborted;
    return { ok: false, error: timedOut ? 'timeout' : String((err && err.message) || err).slice(0, 160), ms: Date.now() - started };
  } finally {
    clearTimeout(timer);
  }
}

/** Read at most `max` bytes of a response body as text (protects CPU/memory on huge pages). */
export async function readCapped(res, max = 400000, ms = 8000) {
  if (!res.body) return '';
  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: false });
  let out = '';
  let bytes = 0;
  const deadline = Date.now() + ms;
  try {
    while (bytes < max) {
      if (Date.now() > deadline) break;
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      out += decoder.decode(value, { stream: true });
    }
  } catch { /* partial body is fine */ }
  try { await reader.cancel(); } catch { /* ignore */ }
  return out.slice(0, max);
}

/** Run a promise with a timeout; resolves to `fallback` instead of throwing. */
export async function withTimeout(promise, ms, fallback) {
  let timer;
  const t = new Promise(resolve => { timer = setTimeout(() => resolve(fallback), ms); });
  try {
    return await Promise.race([promise.catch(() => fallback), t]);
  } finally {
    clearTimeout(timer);
  }
}

/** Unguessable URL-safe random token. */
export function randomToken(bytes = 24) {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  let s = '';
  for (const b of buf) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Normalise a user-entered website into a safe absolute https URL, or null. */
export function normaliseUrl(input) {
  let s = String(input || '').trim();
  if (!s) return null;
  s = s.replace(/^[<("'\s]+|[>)"'\s.,;]+$/g, '');
  if (/^\/\//.test(s)) s = 'https:' + s;
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(s)) s = 'https://' + s;
  let u;
  try { u = new URL(s); } catch { return null; }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
  const host = u.hostname.toLowerCase().replace(/\.$/, '');
  if (!host.includes('.') || host.length > 253) return null;
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host) || host.includes(':')) return null; // no IP literals
  if (/(^|\.)(localhost|local|internal|lan|home|test|invalid|example)$/.test(host)) return null;
  if (u.username || u.password) return null;
  if (u.port && u.port !== '80' && u.port !== '443') return null;
  // Social/profile links are not a website we can audit as a site.
  u.protocol = 'https:';
  u.port = '';
  u.hash = '';
  return u.origin + (u.pathname || '/') + u.search;
}

/** Registrable-ish domain for DNS checks (strips a leading www.). */
export function baseDomain(host) {
  return String(host || '').toLowerCase().replace(/^www\./, '');
}

export const FREE_MAIL = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.uk', 'ymail.com', 'rocketmail.com', 'hotmail.com', 'hotmail.co.uk',
  'outlook.com', 'live.com', 'msn.com', 'aol.com', 'icloud.com', 'me.com', 'mac.com', 'proton.me', 'protonmail.com',
  'gmx.com', 'gmx.net', 'mail.com', 'zoho.com', 'yandex.com', 'qq.com', '163.com'
]);

export function emailDomain(email) {
  const m = /@([^\s@>]+)$/.exec(String(email || '').trim().toLowerCase());
  return m ? m[1] : '';
}

/** Digits for a wa.me link. Local Ghana numbers (0XXXXXXXXX) are assumed +233. */
export function waNumber(phone) {
  const raw = String(phone || '').trim();
  if (!raw) return { digits: '', assumed: false };
  let digits = raw.replace(/[^\d]/g, '');
  if (raw.startsWith('00')) digits = digits.slice(2);
  let assumed = false;
  if (!raw.startsWith('+') && !raw.startsWith('00') && /^0\d{9}$/.test(digits)) { digits = '233' + digits.slice(1); assumed = true; }
  if (digits.length < 8 || digits.length > 15) return { digits: '', assumed: false };
  return { digits, assumed };
}

export function leadSlug(leadId) {
  return String(leadId).replace(/^lead:/, '').replace(/:/g, '_');
}
export function slugToLeadId(slug) {
  if (!/^\d{10,16}_[a-z0-9]{1,16}$/.test(slug || '')) return null;
  return 'lead:' + slug.replace('_', ':');
}
