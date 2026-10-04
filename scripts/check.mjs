// ============================================================================
// Build validator: checks the generated /public site for
//  - broken internal links (href/src) that don't resolve to a built file
//  - one <h1> per page, a <title>, meta description and canonical
//  - a skip link and main landmark
//  - sitemap.xml references only existing pages
// Exits non-zero on any error so it can gate CI / npm run build.
// ============================================================================
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public');

const errors = [];
const warnings = [];

async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full));
    else out.push(full);
  }
  return out;
}

// Map a site-absolute link to a file path in /public. Returns candidate paths.
function resolveLink(link) {
  let p = link.split('#')[0].split('?')[0];
  if (!p) return null; // pure fragment / query
  if (!p.startsWith('/')) return null; // external or relative (we only emit absolute)
  const rel = p.replace(/^\//, '');
  if (p.endsWith('/')) return [path.join(OUT, rel, 'index.html')];
  return [path.join(OUT, rel), path.join(OUT, rel, 'index.html')];
}

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function main() {
  if (!await exists(OUT)) {
    console.error('No /public directory. Run `npm run build:site` first.');
    process.exit(1);
  }
  const files = (await walk(OUT)).filter(f => f.endsWith('.html'));
  const htmlByRoute = new Set(files.map(f => '/' + path.relative(OUT, f).replace(/\\/g, '/')));

  for (const file of files) {
    const rel = '/' + path.relative(OUT, file).replace(/\\/g, '/');
    const html = await fs.readFile(file, 'utf8');

    // Structure checks
    const h1s = (html.match(/<h1[\s>]/g) || []).length;
    if (h1s !== 1) errors.push(`${rel}: expected exactly one <h1>, found ${h1s}`);
    if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${rel}: missing <title>`);
    if (!/<meta name="description" content="[^"]+"/.test(html)) errors.push(`${rel}: missing meta description`);
    const is404 = rel === '/404.html';
    if (!is404 && !/<link rel="canonical"/.test(html)) errors.push(`${rel}: missing canonical`);
    if (!/id="main"/.test(html)) errors.push(`${rel}: missing <main id="main">`);
    if (!/class="skip-link"/.test(html)) errors.push(`${rel}: missing skip link`);

    // Internal link checks (href="/..." and src="/...")
    const linkRe = /(?:href|src)="(\/[^"]*)"/g;
    let m;
    while ((m = linkRe.exec(html)) !== null) {
      const link = m[1];
      if (link.startsWith('//')) continue; // protocol-relative external
      if (link === '/sitemap.xml' || link === '/robots.txt') continue;
      const candidates = resolveLink(link);
      if (!candidates) continue;
      let ok = false;
      for (const c of candidates) { if (await exists(c)) { ok = true; break; } }
      if (!ok) errors.push(`${rel}: broken internal link -> ${link}`);
    }
  }

  // Sitemap validation
  const sitemapPath = path.join(OUT, 'sitemap.xml');
  if (!await exists(sitemapPath)) errors.push('sitemap.xml missing');
  else {
    const xml = await fs.readFile(sitemapPath, 'utf8');
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x => x[1]);
    if (locs.length === 0) errors.push('sitemap.xml has no <loc> entries');
    for (const loc of locs) {
      const p = loc.replace(/^https?:\/\/[^/]+/, '');
      const route = p === '/' ? '/index.html' : p.replace(/\/$/, '') + '/index.html';
      if (!htmlByRoute.has(route)) errors.push(`sitemap.xml references missing page: ${p}`);
    }
    // Every indexable page should be in the sitemap
    for (const route of htmlByRoute) {
      if (route === '/404.html') continue;
      const asUrl = route === '/index.html' ? '/' : route.replace(/index\.html$/, '');
      if (!locs.some(l => l.endsWith(asUrl))) warnings.push(`page not in sitemap: ${asUrl}`);
    }
  }

  if (!await exists(path.join(OUT, 'robots.txt'))) errors.push('robots.txt missing');
  if (!await exists(path.join(OUT, 'styles.css'))) errors.push('styles.css missing');
  if (!await exists(path.join(OUT, 'site.js'))) errors.push('site.js missing');

  console.log(`Checked ${files.length} HTML pages.`);
  if (warnings.length) { console.log(`\nWarnings (${warnings.length}):`); warnings.forEach(w => console.log('  ! ' + w)); }
  if (errors.length) {
    console.error(`\nErrors (${errors.length}):`);
    errors.forEach(e => console.error('  ✗ ' + e));
    process.exit(1);
  }
  console.log('\nAll checks passed.');
}

main().catch(err => { console.error(err); process.exit(1); });
