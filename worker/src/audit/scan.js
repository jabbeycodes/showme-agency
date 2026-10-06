// =============================================================================
// Free Digital Audit — automated scanner.
// Pure fetch-based checks that run in Cloudflare Workers and in Node 20.
// Every network call is time-boxed and every check is wrapped so a bad or slow
// site can never crash the scan: failures become { status: 'error' } entries.
// =============================================================================
import { timedFetch, readCapped, withTimeout, normaliseUrl, baseDomain, FREE_MAIL, emailDomain } from './util.js';

const UA = 'Mozilla/5.0 (compatible; ShowMeAuditBot/1.0; +https://agency.showmeworld.app/free-audit/)';
const HTML_HEADERS = { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8', 'Accept-Language': 'en' };

// ---- HTML helpers (regex-based; no DOM in Workers) --------------------------
function attr(tag, name) {
  const re = new RegExp('\\s' + name + '\\s*=\\s*(?:"([^"]*)"|\'([^\']*)\'|([^\\s>]+))', 'i');
  const m = re.exec(tag);
  return m ? (m[1] ?? m[2] ?? m[3] ?? '').trim() : null;
}
function decode(s) {
  return String(s || '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/\s+/g, ' ').trim();
}
function stripTags(s) { return decode(String(s || '').replace(/<[^>]*>/g, ' ')); }
function tags(html, name) { return html.match(new RegExp('<' + name + '\\b[^>]*>', 'gi')) || []; }
function metaContent(html, key) {
  for (const t of tags(html, 'meta')) {
    const n = (attr(t, 'name') || attr(t, 'property') || '').toLowerCase();
    if (n === key) return decode(attr(t, 'content') || '');
  }
  return null;
}
function linkRel(html, relWanted) {
  const out = [];
  for (const t of tags(html, 'link')) {
    const rel = (attr(t, 'rel') || '').toLowerCase().split(/\s+/);
    if (rel.includes(relWanted)) out.push(attr(t, 'href'));
  }
  return out.filter(Boolean);
}
function abs(href, base) { try { return new URL(decode(href), base).href; } catch { return null; } }

// ---- Pattern libraries -------------------------------------------------------
const SOCIAL = [
  ['facebook', /^https?:\/\/(www\.|m\.|web\.)?(facebook|fb)\.(com|me)\/(?!sharer|share|dialog|plugins|tr\b|events\/?$)[^"'\s?#]+/i],
  ['instagram', /^https?:\/\/(www\.)?instagram\.com\/(?!p\/|reel\/|explore\/|share)[A-Za-z0-9_.]+/i],
  ['tiktok', /^https?:\/\/(www\.)?tiktok\.com\/@[A-Za-z0-9_.]+/i],
  ['linkedin', /^https?:\/\/([a-z]{2,3}\.)?linkedin\.com\/(company|in|school|showcase)\/[^"'\s?#]+/i],
  ['x', /^https?:\/\/(www\.|mobile\.)?(twitter|x)\.com\/(?!intent|share|home|search|hashtag)[A-Za-z0-9_]{1,30}\/?$/i],
  ['youtube', /^https?:\/\/(www\.|m\.)?(youtube\.com\/(@|channel\/|c\/|user\/)[^"'\s?#]+|youtube\.com\/[A-Za-z0-9_-]+\/?$)/i],
  ['whatsapp', /^https?:\/\/(wa\.me\/\d+|api\.whatsapp\.com\/send|chat\.whatsapp\.com\/|wa\.link\/|(www\.)?whatsapp\.com\/(channel|catalog)\/)/i]
];
const SIGNALS = {
  booking: [
    ['Calendly', /calendly\.com/i], ['Acuity', /acuityscheduling\.com|as\.me\//i], ['Setmore', /setmore\.com/i], ['Square Appointments', /squareup\.com\/appointments|square\.site\/book/i],
    ['Booksy', /booksy\.com/i], ['Fresha', /fresha\.com/i], ['SimplyBook', /simplybook\.(me|it)/i], ['YouCanBookMe', /youcanbook\.me/i], ['Cal.com', /\bcal\.com\//i],
    ['TidyCal', /tidycal\.com/i], ['HubSpot Meetings', /meetings\.hubspot\.com/i], ['OpenTable', /opentable\.(com|co\.uk)/i], ['Resy', /resy\.com/i], ['Mindbody', /mindbodyonline\.com/i],
    ['Booking.com', /booking\.com\/hotel/i], ['Google Calendar booking', /calendar\.app\.google|calendar\.google\.com\/calendar\/appointments/i], ['Zcal', /zcal\.co/i], ['Vagaro', /vagaro\.com/i]
  ],
  ordering: [
    ['Shopify', /cdn\.shopify\.com|myshopify\.com/i], ['WooCommerce', /woocommerce|wc-ajax|add-to-cart=/i], ['Ecwid', /ecwid\.com/i], ['Square Online', /square\.site|squarespace-commerce/i],
    ['ChowNow', /chownow\.com/i], ['Toast', /toasttab\.com/i], ['Uber Eats', /ubereats\.com/i], ['Glovo', /glovoapp\.com/i], ['Bolt Food', /food\.bolt\.eu/i],
    ['Wix Stores', /wixstores|wix-ecommerce/i], ['Selar', /selar\.co/i], ['Jumia', /jumia\.com\.gh/i], ['Cart / checkout', /\/(cart|checkout)\b["'\/?]/i]
  ],
  chat: [
    ['Tawk.to', /tawk\.to/i], ['Intercom', /intercom(cdn)?\.(io|com)|widget\.intercom/i], ['Crisp', /crisp\.chat/i], ['Drift', /drift\.com|js\.driftt\.com/i], ['Tidio', /tidio(chat)?\.co/i],
    ['Zendesk', /zdassets\.com|zopim/i], ['LiveChat', /livechatinc\.com/i], ['HubSpot chat', /js\.usemessages\.com|hs-scripts\.com/i], ['Freshchat', /wchat\.freshchat|freshworks\.com\/live-chat/i],
    ['Messenger', /connect\.facebook\.net\/[^"']*customerchat|m\.me\//i], ['WhatsApp widget', /getbutton\.io|elfsight\.com[^"']*whatsapp|whatsapp-widget|wa-widget|joinchat|click-to-chat/i]
  ],
  payments: [
    ['Paystack', /paystack\.(com|co)/i], ['Flutterwave', /flutterwave\.com|ravepay/i], ['Stripe', /js\.stripe\.com|buy\.stripe\.com|checkout\.stripe\.com/i], ['PayPal', /paypal\.com|paypalobjects\.com/i],
    ['Hubtel', /hubtel\.com/i], ['ExpressPay', /expresspaygh\.com/i], ['Square checkout', /square\.link|checkout\.square/i], ['Mobile Money (mentioned)', /mobile money|\bmomo\b/i]
  ],
  analytics: [
    ['Google Analytics', /googletagmanager\.com\/gtag|google-analytics\.com|gtag\(/i], ['Google Tag Manager', /googletagmanager\.com\/gtm\.js|GTM-[A-Z0-9]+/i], ['Meta Pixel', /connect\.facebook\.net\/[^"']*fbevents|fbq\(/i],
    ['Cloudflare Web Analytics', /static\.cloudflareinsights\.com/i], ['Plausible', /plausible\.io/i], ['Microsoft Clarity', /clarity\.ms/i], ['Hotjar', /hotjar\.com/i]
  ],
  platform: [
    ['WordPress', /wp-content|wp-includes/i], ['Wix', /wixstatic\.com|wix\.com/i], ['Squarespace', /squarespace\.com|static1\.squarespace/i], ['Shopify', /cdn\.shopify\.com/i],
    ['Webflow', /webflow\.(com|io)|assets\.website-files\.com/i], ['GoDaddy builder', /img1\.wsimg\.com/i], ['Framer', /framerusercontent\.com/i], ['Next.js', /\/_next\/static/i]
  ]
};

function detect(list, haystack) {
  const found = [];
  for (const [label, re] of list) if (re.test(haystack)) found.push(label);
  return found;
}

// ---- Individual checks ------------------------------------------------------
async function fetchHomepage(url) {
  const r = await timedFetch(url, { headers: HTML_HEADERS, redirect: 'follow' }, 12000);
  if (!r.ok) return { reachable: false, error: r.error };
  const res = r.res;
  const ct = res.headers.get('content-type') || '';
  const html = /html|xml|text\/plain/i.test(ct) || !ct ? await readCapped(res, 400000, 8000) : '';
  return {
    reachable: res.status < 500,
    status: res.status,
    finalUrl: res.url || url,
    contentType: ct,
    responseMs: r.ms,
    htmlBytes: html.length,
    xRobots: res.headers.get('x-robots-tag') || '',
    server: res.headers.get('server') || '',
    html
  };
}

async function checkHttpRedirect(host) {
  const r = await timedFetch('http://' + host + '/', { headers: HTML_HEADERS, redirect: 'manual' }, 7000);
  if (!r.ok) return { checked: false, error: r.error };
  const loc = r.res.headers.get('location') || '';
  try { await r.res.body?.cancel(); } catch { /* ignore */ }
  const redirects = r.res.status >= 300 && r.res.status < 400;
  return { checked: true, status: r.res.status, location: loc.slice(0, 200), redirectsToHttps: redirects && /^https:\/\//i.test(loc) };
}

const PSI_FIELDS = 'lighthouseResult(finalUrl,runtimeError,categories(performance(score),accessibility(score),best-practices(score),seo(score)),audits(largest-contentful-paint(numericValue,displayValue),cumulative-layout-shift(numericValue,displayValue)))';

export async function runPsi(url, strategy, { apiKey, timeoutMs = 25000 } = {}) {
  const q = new URLSearchParams({ url, strategy });
  for (const c of ['performance', 'accessibility', 'best-practices', 'seo']) q.append('category', c);
  q.set('fields', PSI_FIELDS);
  if (apiKey) q.set('key', apiKey);
  const r = await timedFetch('https://www.googleapis.com/pagespeedonline/v5/runPagespeed?' + q, { headers: { Accept: 'application/json' } }, timeoutMs);
  if (!r.ok) return { status: r.error === 'timeout' ? 'timeout' : 'error', error: r.error };
  let data;
  try { data = await r.res.json(); } catch { return { status: 'error', error: 'bad_json' }; }
  if (!r.res.ok) {
    const quota = r.res.status === 429 || /quota/i.test(JSON.stringify(data.error || ''));
    return { status: quota ? 'quota' : 'error', error: quota ? 'PageSpeed API quota (set PSI_API_KEY)' : String(data?.error?.message || r.res.status).slice(0, 160) };
  }
  const lh = data.lighthouseResult || {};
  if (lh.runtimeError && lh.runtimeError.code && lh.runtimeError.code !== 'NO_ERROR') return { status: 'error', error: String(lh.runtimeError.code) };
  const c = lh.categories || {};
  const a = lh.audits || {};
  const sc = v => (typeof v === 'number' ? Math.round(v * 100) : null);
  return {
    status: 'ok',
    performance: sc(c.performance?.score),
    accessibility: sc(c.accessibility?.score),
    bestPractices: sc(c['best-practices']?.score),
    seo: sc(c.seo?.score),
    lcpMs: typeof a['largest-contentful-paint']?.numericValue === 'number' ? Math.round(a['largest-contentful-paint'].numericValue) : null,
    cls: typeof a['cumulative-layout-shift']?.numericValue === 'number' ? Math.round(a['cumulative-layout-shift'].numericValue * 1000) / 1000 : null,
    ms: r.ms
  };
}

async function fetchText(url, ms = 6000, max = 60000) {
  const r = await timedFetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' }, ms);
  if (!r.ok) return { ok: false, error: r.error };
  const text = r.res.ok ? await readCapped(r.res, max, ms) : '';
  if (!r.res.ok) { try { await r.res.body?.cancel(); } catch { /* ignore */ } }
  return { ok: r.res.ok, status: r.res.status, text, contentType: r.res.headers.get('content-type') || '', finalUrl: r.res.url || url };
}

async function checkRobotsAndSitemap(origin) {
  const robots = await fetchText(origin + '/robots.txt', 6000, 40000);
  const out = { robotsFound: false, blocksAll: false, sitemapUrls: [], sitemapFound: false };
  if (robots.ok && /user-agent|disallow|allow|sitemap/i.test(robots.text) && !/<html/i.test(robots.text)) {
    out.robotsFound = true;
    // "Disallow: /" inside the "User-agent: *" group means the whole site is blocked.
    const groups = robots.text.split(/(?=^\s*user-agent\s*:)/im);
    for (const g of groups) {
      if (/^\s*user-agent\s*:\s*\*\s*$/im.test(g) && /^\s*disallow\s*:\s*\/\s*$/im.test(g)) out.blocksAll = true;
    }
    out.sitemapUrls = [...robots.text.matchAll(/^\s*sitemap\s*:\s*(\S+)/gim)].map(m => m[1]).slice(0, 5);
  }
  const candidates = out.sitemapUrls.length ? out.sitemapUrls.slice(0, 2) : [origin + '/sitemap.xml', origin + '/sitemap_index.xml'];
  for (const sm of candidates) {
    const r = await fetchText(sm, 6000, 4000);
    if (r.ok && /<(urlset|sitemapindex)\b/i.test(r.text)) { out.sitemapFound = true; out.sitemapChecked = sm; break; }
  }
  return out;
}

async function doh(name, type) {
  const first = await dohOnce(name, type);
  return first.ok ? first : dohOnce(name, type);
}

async function dohOnce(name, type) {
  const r = await timedFetch('https://cloudflare-dns.com/dns-query?name=' + encodeURIComponent(name) + '&type=' + type, { headers: { Accept: 'application/dns-json' } }, 4000);
  if (!r.ok) return { ok: false, error: r.error, answers: [] };
  try {
    const j = await r.res.json();
    return { ok: true, rcode: j.Status, answers: (j.Answer || []).filter(a => a.type === { MX: 15, TXT: 16, A: 1 }[type]).map(a => String(a.data)) };
  } catch { return { ok: false, error: 'bad_json', answers: [] }; }
}

function mxProvider(hosts) {
  const s = hosts.join(' ').toLowerCase();
  if (!hosts.length) return 'none';
  if (/google\.com|googlemail\.com/.test(s)) return 'Google Workspace';
  if (/outlook\.com|protection\.outlook|microsoft/.test(s)) return 'Microsoft 365';
  if (/zoho\./.test(s)) return 'Zoho Mail';
  if (/secureserver\.net/.test(s)) return 'GoDaddy email';
  if (/titan\.email/.test(s)) return 'Titan email';
  if (/hostinger\./.test(s)) return 'Hostinger email';
  if (/namecheap|privateemail\.com/.test(s)) return 'Namecheap email';
  if (/mx\.cloudflare\.net/.test(s)) return 'Cloudflare Email Routing';
  if (/protonmail/.test(s)) return 'Proton Mail';
  if (/improvmx|forwardemail|mailgun|sendgrid|amazonses/.test(s)) return 'Forwarding/transactional service';
  return 'Other (' + hosts[0].replace(/\.$/, '').split(' ').pop() + ')';
}

const SECOND_LEVEL = /^(com|co|org|net|gov|edu|ac|ltd|plc|me|sch)\.[a-z]{2}$/;
function parentDomain(d) {
  const parts = d.split('.');
  if (parts.length < 3) return null;
  const parent = parts.slice(1).join('.');
  return SECOND_LEVEL.test(parent) ? null : parent;
}

async function checkDns(domain) {
  // Subdomain sites (shop.example.com) usually receive mail on the parent domain.
  const first = await checkDnsOne(domain);
  const parent = parentDomain(domain);
  if (parent && first.mxProvider === 'none') {
    const second = await checkDnsOne(parent);
    if (second.mxProvider !== 'none') return { ...second, checkedSubdomain: domain };
  }
  return first;
}

async function checkDnsOne(domain) {
  const [mx, txt, dmarc] = await Promise.all([doh(domain, 'MX'), doh(domain, 'TXT'), doh('_dmarc.' + domain, 'TXT')]);
  const mxHosts = mx.answers.map(a => a.split(/\s+/).pop()).filter(Boolean);
  const txts = txt.answers.map(t => t.replace(/"\s*"/g, '').replace(/^"|"$/g, ''));
  const spf = txts.find(t => /^v=spf1/i.test(t)) || null;
  const dm = dmarc.answers.map(t => t.replace(/"\s*"/g, '').replace(/^"|"$/g, '')).find(t => /^v=DMARC1/i.test(t)) || null;
  const policy = dm ? ((/;\s*p\s*=\s*(\w+)/i.exec(dm) || [])[1] || 'none').toLowerCase() : null;
  return {
    checked: mx.ok || txt.ok,
    domain,
    mxHosts: mxHosts.slice(0, 5),
    mxProvider: mx.ok ? mxProvider(mxHosts) : 'unknown',
    spf: spf ? spf.slice(0, 200) : null,
    dmarc: dm ? dm.slice(0, 200) : null,
    dmarcPolicy: policy
  };
}

async function checkUrlExists(url, ms = 5000) {
  if (!url) return false;
  const r = await timedFetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' }, ms);
  if (!r.ok) return false;
  const ok = r.res.ok && !/text\/html/i.test(r.res.headers.get('content-type') || '');
  try { await r.res.body?.cancel(); } catch { /* ignore */ }
  return ok;
}

/** Google Business Profile lookup via Places API (New) Text Search. Only runs when a key is configured. */
export async function checkPlaces({ apiKey, business, domain, timeoutMs = 8000 }) {
  if (!apiKey) return { status: 'manual', note: 'Needs manual check (no Places API key configured)' };
  if (!business) return { status: 'manual', note: 'Needs manual check (no business name given)' };
  const r = await timedFetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'places.displayName,places.websiteUri,places.googleMapsUri,places.rating,places.userRatingCount,places.businessStatus,places.formattedAddress'
    },
    body: JSON.stringify({ textQuery: business, pageSize: 5 })
  }, timeoutMs);
  if (!r.ok) return { status: 'error', note: 'Places lookup failed: ' + r.error };
  let j;
  try { j = await r.res.json(); } catch { return { status: 'error', note: 'Places lookup returned bad JSON' }; }
  if (!r.res.ok) return { status: 'error', note: 'Places API error: ' + String(j?.error?.message || r.res.status).slice(0, 120) };
  const places = j.places || [];
  const host = h => { try { return baseDomain(new URL(h).hostname); } catch { return ''; } };
  const match = places.find(p => p.websiteUri && host(p.websiteUri) === domain);
  if (match) {
    return {
      status: 'found', name: match.displayName?.text || '', mapsUrl: match.googleMapsUri || '', address: match.formattedAddress || '',
      rating: match.rating ?? null, reviews: match.userRatingCount ?? 0, businessStatus: match.businessStatus || ''
    };
  }
  return { status: places.length ? 'unmatched' : 'not_found', note: places.length ? 'Profiles found for the name, but none link to this website — needs manual check' : 'No Google Business Profile found for this name' };
}

// ---- Page analysis ----------------------------------------------------------
export function analyseHtml(html, pageUrl) {
  const head = (/<head\b[\s\S]*?<\/head>/i.exec(html) || [html.slice(0, 60000)])[0];
  const title = stripTags((/<title\b[^>]*>([\s\S]*?)<\/title>/i.exec(head) || /<title\b[^>]*>([\s\S]*?)<\/title>/i.exec(html) || [])[1] || '');
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => stripTags(m[1])).filter(Boolean);
  const robotsMeta = (metaContent(head, 'robots') || '') + ' ' + (metaContent(head, 'googlebot') || '');
  const viewport = metaContent(head, 'viewport');
  const canonical = linkRel(head, 'canonical')[0] || null;
  const og = {
    title: metaContent(head, 'og:title'), description: metaContent(head, 'og:description'), image: metaContent(head, 'og:image'),
    siteName: metaContent(head, 'og:site_name'), type: metaContent(head, 'og:type')
  };
  const twitterCard = metaContent(head, 'twitter:card');
  const lang = attr((/<html\b[^>]*>/i.exec(html) || [''])[0], 'lang');

  // JSON-LD
  const ldTypes = new Set();
  let ldName = null; let ldLogo = null; const ldSameAs = [];
  for (const m of html.matchAll(/<script\b[^>]*type\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(m[1].trim());
      const stack = Array.isArray(data) ? [...data] : [data];
      let guard = 0;
      while (stack.length && guard++ < 200) {
        const o = stack.pop();
        if (!o || typeof o !== 'object') continue;
        if (Array.isArray(o)) { stack.push(...o); continue; }
        const t = o['@type'];
        (Array.isArray(t) ? t : t ? [t] : []).forEach(x => ldTypes.add(String(x)));
        if (/Organization|LocalBusiness|Store|Restaurant|ProfessionalService|Corporation/i.test(String(t || '')) || ldName == null) {
          if (typeof o.name === 'string' && /Organization|Business|Store|Restaurant|Service|Corporation/i.test(String(t || ''))) ldName = o.name;
          if (o.logo) ldLogo = typeof o.logo === 'string' ? o.logo : o.logo.url || null;
          if (Array.isArray(o.sameAs)) ldSameAs.push(...o.sameAs.map(String));
        }
        if (o['@graph']) stack.push(o['@graph']);
      }
    } catch { /* invalid JSON-LD is reported as absent */ }
  }

  // Links
  const hrefs = [];
  for (const t of tags(html, 'a')) { const h = attr(t, 'href'); if (h) hrefs.push(decode(h)); }
  const absHrefs = hrefs.map(h => abs(h, pageUrl)).filter(Boolean);
  const social = {};
  for (const h of [...absHrefs, ...ldSameAs]) {
    for (const [name, re] of SOCIAL) if (!social[name] && re.test(h)) social[name] = h.slice(0, 200);
  }
  const mailtos = [...new Set(hrefs.filter(h => /^mailto:/i.test(h)).map(h => h.replace(/^mailto:/i, '').split('?')[0].trim().toLowerCase()))];
  const textEmails = [...new Set((stripTags(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ')).match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) || []).map(e => e.toLowerCase()))]
    .filter(e => !/\.(png|jpe?g|webp|gif|svg)$/i.test(e) && !/sentry|wixpress|example\.|domain\.com|email\.com/i.test(e));
  const emails = [...new Set([...mailtos, ...textEmails])].filter(e => /@/.test(e)).slice(0, 6);
  const tel = hrefs.some(h => /^tel:/i.test(h));
  const contactLink = hrefs.some(h => /(^|\/)(contact|contact-us|get-in-touch|enquir|book|appointment)/i.test(h));

  // Images
  const imgs = tags(html, 'img');
  const imgsWithAlt = imgs.filter(t => attr(t, 'alt') !== null).length;
  const logo = imgs.find(t => /logo/i.test((attr(t, 'src') || '') + ' ' + (attr(t, 'alt') || '') + ' ' + (attr(t, 'class') || '') + ' ' + (attr(t, 'id') || '')))
    || (/<svg\b[^>]*(class|id|aria-label)\s*=\s*["'][^"']*logo/i.test(html) ? '<svg logo>' : null)
    || (/class\s*=\s*["'][^"']*(logo|brand)[^"']*["']/i.test(html) ? '<logo class>' : null);
  const icons = [...linkRel(head, 'icon'), ...linkRel(head, 'shortcut'), ...linkRel(head, 'apple-touch-icon')];

  // Forms
  const forms = tags(html, 'form').length;
  const emailInputs = (html.match(/<input\b[^>]*type\s*=\s*["']?email/gi) || []).length;
  const embeddedForms = detect([['Google Forms', /docs\.google\.com\/forms|forms\.gle/i], ['Typeform', /typeform\.com/i], ['Jotform', /jotform\.com/i], ['HubSpot form', /hsforms\.(net|com)/i], ['Tally', /tally\.so/i], ['Formspree', /formspree\.io/i], ['Wix form', /wix-forms|form-app/i], ['Contact Form 7', /wpcf7/i], ['Elementor form', /elementor-form/i]], html);

  const signals = {};
  for (const [k, list] of Object.entries(SIGNALS)) signals[k] = detect(list, html);
  const scripts = tags(html, 'script').filter(t => attr(t, 'src')).length;

  return {
    title, titleLength: title.length,
    metaDescription: metaContent(head, 'description'),
    h1Count: h1s.length, h1: h1s[0] ? h1s[0].slice(0, 160) : null,
    canonical: canonical ? abs(canonical, pageUrl) : null,
    noindexMeta: /noindex/i.test(robotsMeta),
    viewport: viewport || null,
    mobileViewport: !!viewport && /width\s*=\s*device-width/i.test(viewport),
    lang: lang || null,
    og, twitterCard,
    jsonLdTypes: [...ldTypes].slice(0, 15), jsonLdName: ldName, jsonLdLogo: ldLogo,
    social, socialCount: Object.keys(social).filter(k => k !== 'whatsapp').length,
    whatsapp: !!social.whatsapp || /wa\.me\/|api\.whatsapp\.com|whatsapp:\/\//i.test(html),
    emails, freeMailOnSite: emails.filter(e => FREE_MAIL.has(emailDomain(e))), tel, contactLink,
    images: imgs.length, imagesWithAlt: imgsWithAlt,
    logo: !!logo, iconHrefs: icons.slice(0, 4).map(h => abs(h, pageUrl)).filter(Boolean),
    forms, emailInputs, embeddedForms,
    booking: signals.booking, ordering: signals.ordering, chat: signals.chat, payments: signals.payments,
    analytics: signals.analytics, platform: signals.platform,
    scriptCount: scripts
  };
}

// ---- Orchestrator -----------------------------------------------------------
/**
 * Scan a website. Never throws.
 * @param {string} inputUrl user-entered website
 * @param {object} opts { business, psiKey, placesKey, psiTimeoutMs }
 */
export async function scanSite(inputUrl, opts = {}) {
  const started = Date.now();
  const url = normaliseUrl(inputUrl);
  const scan = { version: 1, input: String(inputUrl || '').slice(0, 300), url, scannedAt: new Date().toISOString(), errors: [] };
  if (!url) { scan.status = 'invalid_url'; return scan; }
  const u = new URL(url);
  const host = u.hostname;
  const domain = baseDomain(host);
  scan.host = host; scan.domain = domain;

  const safe = (name, p, ms, fb) => withTimeout(p, ms, fb).catch(err => { scan.errors.push(name + ': ' + String(err).slice(0, 100)); return fb; });
  const psiTimeout = opts.psiTimeoutMs || 25000;

  // Network work in parallel: homepage, http->https, PSI x2, DNS.
  const [home, redirect, psiMobile, psiDesktop, dns] = await Promise.all([
    safe('homepage', fetchHomepage(url), 22000, { reachable: false, error: 'timeout' }),
    safe('redirect', checkHttpRedirect(host), 9000, { checked: false, error: 'timeout' }),
    opts.skipPsi ? { status: 'skipped' } : safe('psi_mobile', runPsi(url, 'mobile', { apiKey: opts.psiKey, timeoutMs: psiTimeout }), psiTimeout + 2000, { status: 'timeout' }),
    opts.skipPsi ? { status: 'skipped' } : safe('psi_desktop', runPsi(url, 'desktop', { apiKey: opts.psiKey, timeoutMs: psiTimeout }), psiTimeout + 2000, { status: 'timeout' }),
    safe('dns', checkDns(domain), 12000, { checked: false })
  ]);

  const html = home.html || '';
  const finalUrl = home.finalUrl || url;
  let origin = u.origin;
  try { origin = new URL(finalUrl).origin; } catch { /* keep */ }
  const page = html ? analyseHtml(html, finalUrl) : null;

  const [crawl, faviconOk, places] = await Promise.all([
    home.reachable ? safe('robots', checkRobotsAndSitemap(origin), 14000, { robotsFound: false, sitemapFound: false, error: 'timeout' }) : { robotsFound: false, sitemapFound: false, skipped: true },
    home.reachable ? safe('favicon', (async () => {
      if (page && page.iconHrefs.length && page.iconHrefs.some(h => /^data:/.test(h))) return true;
      for (const h of [...(page ? page.iconHrefs : []), origin + '/favicon.ico'].slice(0, 3)) if (await checkUrlExists(h)) return true;
      return false;
    })(), 10000, false) : false,
    safe('places', checkPlaces({ apiKey: opts.placesKey, business: opts.business, domain }), 9000, { status: 'error', note: 'Places lookup timed out' })
  ]);

  delete home.html;
  scan.status = home.reachable ? 'ok' : 'unreachable';
  scan.website = {
    reachable: !!home.reachable, status: home.status ?? null, error: home.error || null, finalUrl,
    https: /^https:/i.test(finalUrl) && !!home.reachable,
    httpRedirect: redirect, responseMs: home.responseMs ?? null, htmlBytes: home.htmlBytes ?? 0,
    psi: { mobile: psiMobile, desktop: psiDesktop }
  };
  scan.page = page;
  scan.xRobotsNoindex = /noindex/i.test(home.xRobots || '');
  scan.crawl = crawl;
  scan.favicon = !!faviconOk;
  scan.dns = dns;
  scan.places = places;
  scan.durationMs = Date.now() - started;
  return scan;
}
