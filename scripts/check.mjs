// ============================================================================
// Build validator for the generated /public site. Exits non-zero on any error
// so it gates `npm run build`.
//
// Builds two views of every page, exactly as the edge worker serves them:
//   US view (default)  : <template data-gh-block> removed, data-gh values dropped
//   Ghana view         : [data-us-only] elements removed, templates unwrapped,
//                        data-gh values swapped in
// and checks:
//  - US view contains no Africa/Ghana/Accra/cedi/MoMo/... terms and no
//    "cybersecurity" in text, meta, OG, alt, JSON-LD, nav or footer
//    (allow-list: the Ghana-only pages in content.mjs GH_ONLY, and the
//    "Region: United States | Ghana" switcher itself); every hit is reported
//  - no banned claims in either view: any "guarantee" wording, "month 1 is
//    free", "Proof, not promises", "Work & results", proven, high-converting,
//    testimonial, case study, certified, SOC, 24/7; no josh@ address
//  - US spelling in both views (programme, organise, optimise, colour,
//    centre, enrolment, licence, enquiry, ...): see scripts/terms.mjs
//  - internal links resolve in both views; US view never links to a
//    Ghana-only page or to a retired (redirected) URL; redirect targets exist
//  - one <h1>, <title>, meta description, canonical, OG tags, lang, skip link
//  - unique titles and descriptions; valid JSON-LD, no ratings/reviews;
//    BreadcrumbList on every non-home page
//  - alt text on every <img>; decorative SVGs aria-hidden, others labelled
//  - no inline scripts (CSP script-src 'self'), no third-party fonts
//  - no price figures while SHOW_PRICES=false
//  - sitemap lists exactly the non-Ghana-only pages; security.txt present
// ============================================================================
import { SHOW_PRICES } from './money.mjs';
import { GH_ONLY, REDIRECTS } from './content.mjs';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public');
const ORIGIN = 'https://agency.showmeworld.app';

const errors = [];
const warnings = [];

import { AFRICA_TERMS, CYBER_TERMS, BANNED_CLAIMS, UK_SPELLING, hits, usView as usViewOf, ghView as ghViewOf, scanable } from './terms.mjs';
export const GHANA_TERMS = AFRICA_TERMS;
async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full));
    else out.push(full);
  }
  return out;
}
async function exists(p) { try { await fs.access(p); return true; } catch { return false; } }
function resolveLink(link) {
  const p = link.split('#')[0].split('?')[0];
  if (!p || !p.startsWith('/')) return null;
  const rel = p.replace(/^\//, '');
  if (p.endsWith('/')) return [path.join(OUT, rel, 'index.html')];
  return [path.join(OUT, rel), path.join(OUT, rel, 'index.html')];
}

const usView = h => usViewOf(h);
const ghView = h => ghViewOf(h, e => errors.push(e));
const context = (s, m) => s.slice(Math.max(0, m.index - 50), m.index + 40).replace(/\s+/g, ' ');

function linksIn(html) {
  return [...html.matchAll(/(?:href|src|srcset)="(\/[^"]*)"/g)].flatMap(m => m[1].split(',').map(x => x.trim().split(' ')[0])).filter(Boolean);
}

async function main() {
  if (!await exists(OUT)) { console.error('No /public directory. Run `npm run build:site` first.'); process.exit(1); }
  const allHtml = (await walk(OUT)).filter(f => f.endsWith('.html'));
  const isGsc = rel => /^\/google[a-f0-9]+\.html$/i.test(rel);
  const files = allHtml.filter(f => !isGsc('/' + path.relative(OUT, f)));
  const htmlByRoute = new Set(files.map(f => '/' + path.relative(OUT, f)));
  const routeOf = rel => rel === '/index.html' ? '/' : rel.replace(/index\.html$/, '');

  for (const [from, to] of Object.entries(REDIRECTS)) {
    if (htmlByRoute.has(from + 'index.html')) errors.push(`redirect source still has a page: ${from}`);
    if (!htmlByRoute.has(to + 'index.html')) errors.push(`redirect target missing: ${from} -> ${to}`);
  }
  for (const [p, fb] of Object.entries(GH_ONLY)) {
    if (!htmlByRoute.has(p + 'index.html')) errors.push(`Ghana-only page missing: ${p}`);
    if (!htmlByRoute.has(fb + 'index.html') || GH_ONLY[fb]) errors.push(`Ghana-only fallback invalid: ${p} -> ${fb}`);
  }

  const seenTitles = new Map();
  const seenDescs = new Map();
  let tbcCount = 0;
  for (const file of files) {
    const rel = '/' + path.relative(OUT, file);
    const route = routeOf(rel);
    const raw = await fs.readFile(file, 'utf8');
    const is404 = rel === '/404.html';
    const ghOnlyPage = !!GH_ONLY[route];
    const US = usView(raw);
    const GH = ghView(raw);
    tbcCount += (raw.match(/\[TO CONFIRM:/g) || []).length;

    // ---- Region, claims and spelling (every hit is reported)
    const report = (re, text, label) => { for (const m of hits(re, text)) errors.push(`${rel}: ${label} "${m[0]}": …${context(text, m)}…`); };
    if (!ghOnlyPage) {
      const s = scanable(US);
      report(AFRICA_TERMS, s, 'Africa/Ghana term in US view');
      report(CYBER_TERMS, s, 'cybersecurity wording in US view');
    }
    for (const [name, view] of [['US', US], ['Ghana', GH]]) {
      if (name === 'US' && ghOnlyPage) continue;
      const s = scanable(view);
      report(BANNED_CLAIMS, s, `banned claim in ${name} view`);
      report(UK_SPELLING, s, `UK spelling in ${name} view`);
    }
    if (raw.includes('{{')) errors.push(`${rel}: unresolved {{token}}`);
    if (!/<html lang="en" data-region="us"/.test(raw)) errors.push(`${rel}: <html> must default to data-region="us"`);
    if (!raw.includes('data-set-region="gh"')) errors.push(`${rel}: missing region switcher`);

    // ---- Scripts / third parties
    for (const m of raw.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
      if (/application\/ld\+json/.test(m[1])) continue;
      if (m[2].trim()) errors.push(`${rel}: inline <script> (blocked by CSP)`);
    }
    if (/fonts\.googleapis|fonts\.gstatic/.test(raw)) errors.push(`${rel}: third-party font request`);
    if (/<[a-z]+[^>]*\son[a-z]+="/i.test(raw)) errors.push(`${rel}: inline event handler`);

    // ---- Structure and meta (US view = what crawlers get)
    const h1s = (US.match(/<h1[\s>]/g) || []).length;
    if (h1s !== 1) errors.push(`${rel}: expected exactly one <h1>, found ${h1s}`);
    const title = (raw.match(/<title>([^<]+)<\/title>/) || [])[1];
    const desc = (raw.match(/<meta name="description" content="([^"]+)"/) || [])[1];
    if (!title) errors.push(`${rel}: missing <title>`);
    if (!desc) errors.push(`${rel}: missing meta description`);
    if (!/id="main"/.test(raw)) errors.push(`${rel}: missing <main id="main">`);
    if (!/class="skip-link"/.test(raw)) errors.push(`${rel}: missing skip link`);
    if (!/<meta name="viewport"/.test(raw)) errors.push(`${rel}: missing viewport meta`);
    if (!is404) {
      if (title) { if (seenTitles.has(title)) errors.push(`${rel}: duplicate <title> (also ${seenTitles.get(title)})`); else seenTitles.set(title, rel); }
      if (desc) { if (seenDescs.has(desc)) errors.push(`${rel}: duplicate meta description (also ${seenDescs.get(desc)})`); else seenDescs.set(desc, rel); }
      if (title && title.length > 70) warnings.push(`${rel}: title is ${title.length} chars`);
      if (desc && (desc.length > 170 || desc.length < 70)) warnings.push(`${rel}: meta description is ${desc.length} chars`);
      const canon = (raw.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
      if (!canon) errors.push(`${rel}: missing canonical`);
      else if (canon !== ORIGIN + route) errors.push(`${rel}: canonical ${canon} != ${ORIGIN + route}`);
      if (/<meta name="robots" content="[^"]*noindex/i.test(raw)) errors.push(`${rel}: unexpected noindex`);
      for (const og of ['og:title', 'og:description', 'og:url', 'og:image', 'og:type', 'og:image:alt']) {
        if (!raw.includes(`property="${og}"`)) errors.push(`${rel}: missing ${og}`);
      }
    } else if (!/<meta name="robots" content="noindex/.test(raw)) errors.push(`${rel}: 404 page should be noindex`);

    const ldTypes = [];
    for (const [, json] of raw.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try { ldTypes.push(JSON.parse(json)['@type']); } catch (e) { errors.push(`${rel}: invalid JSON-LD (${e.message})`); }
      if (/aggregateRating|"@type":"Review"|"review"/i.test(json)) errors.push(`${rel}: JSON-LD must not contain ratings/reviews`);
    }
    if (!is404 && route !== '/' && !ldTypes.includes('BreadcrumbList')) errors.push(`${rel}: missing BreadcrumbList JSON-LD`);

    // ---- Accessibility basics
    for (const m of GH.matchAll(/<img\b[^>]*>/g)) {
      if (!/\salt="[^"]+"/.test(m[0])) errors.push(`${rel}: <img> without alt text: ${m[0].slice(0, 80)}`);
      if (!/\swidth="\d+"/.test(m[0]) || !/\sheight="\d+"/.test(m[0])) errors.push(`${rel}: <img> without width/height`);
    }
    for (const m of GH.matchAll(/<svg\b[^>]*>/g)) {
      if (!/aria-hidden="true"/.test(m[0]) && !(/role="img"/.test(m[0]) && /aria-label="[^"]+"/.test(m[0]))) errors.push(`${rel}: <svg> must be aria-hidden or role="img" with aria-label`);
    }
    for (const m of GH.matchAll(/<input\b[^>]*>/g)) {
      if (/type="(hidden|submit)"/.test(m[0])) continue;
      const id = (m[0].match(/\sid="([^"]+)"/) || [])[1];
      if (!id || !GH.includes(`for="${id}"`)) errors.push(`${rel}: input without a label: ${m[0].slice(0, 80)}`);
    }
    if (/target="_blank"(?![^>]*rel="noopener)/.test(raw)) errors.push(`${rel}: target=_blank without rel=noopener`);

    // ---- Prices hidden
    if (!SHOW_PRICES) {
      const scan = raw.replace(/<script(?![^>]*application\/ld\+json)[\s\S]*?<\/script>/g, ' ');
      const PRICE_RE = /(\$\s?[0-9]|USD\s?[0-9]|[0-9][0-9,.]*\s?(USD|GHS|cedis?\b)|GHS\s?[0-9]|GH₵|₵\s?[0-9])/i;
      const m = PRICE_RE.exec(scan);
      if (m) errors.push(`${rel}: price figure while SHOW_PRICES=false: …${context(scan, m)}…`);
    }

    // ---- Internal links, both views
    for (const [name, view] of [['US', US], ['Ghana', GH]]) {
      if (name === 'US' && ghOnlyPage) continue; // never served to US visitors
      for (const link of linksIn(view)) {
        if (link.startsWith('//') || link === '/sitemap.xml' || link === '/robots.txt') continue;
        const candidates = resolveLink(link);
        if (!candidates) continue;
        let ok = false;
        for (const c of candidates) if (await exists(c)) { ok = true; break; }
        if (!ok) errors.push(`${rel}: broken internal link (${name} view) -> ${link}`);
        const bare = link.split('#')[0].split('?')[0];
        if (REDIRECTS[bare]) errors.push(`${rel}: links to retired URL ${bare} (use ${REDIRECTS[bare]})`);
        if (name === 'US' && GH_ONLY[bare]) errors.push(`${rel}: US view links to Ghana-only page ${bare}`);
      }
    }
  }

  // ---- Sitemap: exactly the non-Ghana-only pages
  const sitemapPath = path.join(OUT, 'sitemap.xml');
  if (!await exists(sitemapPath)) errors.push('sitemap.xml missing');
  else {
    const xml = await fs.readFile(sitemapPath, 'utf8');
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x => x[1].replace(ORIGIN, ''));
    for (const p of locs) {
      if (!htmlByRoute.has((p === '/' ? '/' : p) + 'index.html') && !(p === '/' && htmlByRoute.has('/index.html'))) errors.push(`sitemap.xml references missing page: ${p}`);
      if (GH_ONLY[p]) errors.push(`sitemap.xml lists Ghana-only page: ${p}`);
    }
    for (const r of htmlByRoute) {
      if (r === '/404.html') continue;
      const p = routeOf(r);
      if (!GH_ONLY[p] && !locs.includes(p)) errors.push(`page missing from sitemap: ${p}`);
    }
  }
  for (const f of ['robots.txt', 'styles.css', 'site.js', '.well-known/security.txt', 'og-image.png']) {
    if (!await exists(path.join(OUT, f))) errors.push(f + ' missing');
  }
  for (const f of ['site.webmanifest', 'robots.txt', 'sitemap.xml', '.well-known/security.txt', 'site.js', 'styles.css']) {
    const t = await fs.readFile(path.join(OUT, f), 'utf8').catch(() => '');
    for (const re of [AFRICA_TERMS, CYBER_TERMS, BANNED_CLAIMS, UK_SPELLING]) for (const m of hits(re, t)) errors.push(`${f}: banned term "${m[0]}"`);
  }
  const js = await fs.readFile(path.join(OUT, 'site.js'), 'utf8');
  if (/josh@/.test(js) || !/info@showmeworld\.app/.test(js)) errors.push('site.js must use info@showmeworld.app');
  // info@ everywhere: no josh@ address in the built site or the worker source.
  for (const dir of [OUT, path.join(ROOT, 'worker', 'src'), path.join(ROOT, 'static')]) {
    for (const f of await walk(dir)) {
      if (!/\.(html|js|mjs|txt|xml|json|webmanifest|css)$/.test(f)) continue;
      if (/josh@showmeworld/i.test(await fs.readFile(f, 'utf8'))) errors.push(`${path.relative(ROOT, f)}: uses josh@ (use info@showmeworld.app)`);
    }
  }

  console.log(`Checked ${files.length} HTML pages in US and Ghana views (${tbcCount} TO CONFIRM placeholders rendered).`);
  if (warnings.length) { console.log(`\nWarnings (${warnings.length}):`); warnings.forEach(w => console.log('  ! ' + w)); }
  if (errors.length) {
    console.error(`\nErrors (${errors.length}):`);
    errors.slice(0, 200).forEach(e => console.error('  ✗ ' + e));
    process.exit(1);
  }
  console.log('\nAll checks passed.');
}
main().catch(err => { console.error(err); process.exit(1); });
