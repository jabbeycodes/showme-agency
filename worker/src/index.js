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

    // Everything else: serve the generated static site.
    return env.ASSETS.fetch(request);
  }
};
