// =============================================================================
// ShowMe Digital Agency — Cloudflare Worker
//
// Responsibilities:
//   POST /api/lead   -> validate + store a lead in KV (binding: LEADS)
//   POST /api/event  -> increment a daily counter for an allowed event in KV
//   everything else  -> serve the generated static site (binding: ASSETS)
//
// This reproduces the behaviour of the previous inline worker while adding
// multi-page static-asset serving. It is intentionally dependency-free.
// =============================================================================

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

async function handleLead(request, env) {
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
    created_at: new Date().toISOString(),
    ua: clamp(request.headers.get('user-agent') || '', 200),
    notified: false
  };

  try {
    await env.LEADS.put(id, JSON.stringify(lead));
  } catch (err) {
    return json({ ok: false, error: 'storage_error' }, 500);
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
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    if (pathname === '/api/lead') {
      if (request.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);
      return handleLead(request, env);
    }

    if (pathname === '/api/event') {
      if (request.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);
      return handleEvent(request, env);
    }

    // Any other /api/* path is unknown.
    if (pathname.startsWith('/api/')) return json({ ok: false, error: 'not_found' }, 404);

    // Everything else: serve the generated static site, with SEO-safe tweaks.
    return serveAsset(request, env, url);
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
  return new Response(request.method === 'HEAD' ? null : page.body, { status: 404, headers });
}

async function serveAsset(request, env, url) {
  const { pathname, search } = url;

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
    return new Response(res.body, { status: 404, headers });
  }

  if (res.status !== 200 && res.status !== 304) return res;

  const headers = new Headers(res.headers);
  headers.set('Cache-Control', cacheControlFor(pathname, search));
  const ct = contentTypeFix(pathname, headers.get('content-type'));
  if (ct) headers.set('Content-Type', ct);
  headers.set('X-Content-Type-Options', 'nosniff');
  return new Response(res.body, { status: res.status, headers });
}
