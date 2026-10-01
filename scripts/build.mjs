// ============================================================================
// Static site generator for ShowMe Digital Agency.
// Renders every page to /public, copies /static assets, and writes sitemap.xml
// + robots.txt. Output is plain static HTML/CSS/JS — no runtime dependency.
// ============================================================================
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { site, services, industries, insights } from './data.mjs';
import { serviceDetail, industryDetail } from './templates.mjs';
import * as pages from './pages.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public');
const STATIC = path.join(ROOT, 'static');

// Pages that change more/less often, for sitemap priority hints.
const routes = []; // { path: '/services/', file: 'services/index.html', priority, changefreq }

function reg(routePath, html, priority = 0.7, changefreq = 'monthly') {
  const file = routePath === '/'
    ? 'index.html'
    : routePath.replace(/^\//, '').replace(/\/$/, '') + '/index.html';
  routes.push({ path: routePath, file, html, priority, changefreq });
}

// ---- Register every page ----------------------------------------------------
reg('/', pages.home(), 1.0, 'weekly');
reg('/services/', pages.servicesHub(), 0.9, 'monthly');
for (const s of services) reg('/services/' + s.slug + '/', serviceDetail(s), 0.8, 'monthly');
reg('/industries/', pages.industriesHub(), 0.9, 'monthly');
for (const i of industries) reg('/industries/' + i.slug + '/', industryDetail(i), 0.7, 'monthly');
reg('/pricing/', pages.pricing(), 0.9, 'monthly');
reg('/process/', pages.process(), 0.6, 'yearly');
reg('/work/', pages.work(), 0.7, 'monthly');
reg('/free-audit/', pages.freeAudit(), 0.9, 'monthly');
reg('/about/', pages.about(), 0.6, 'yearly');
reg('/faq/', pages.faqPage(), 0.7, 'monthly');
reg('/contact/', pages.contact(), 0.8, 'yearly');
reg('/insights/', pages.insightsIndex(), 0.6, 'weekly');
for (const a of insights) reg('/insights/' + a.slug + '/', pages.insightArticle(a), 0.4, 'monthly');
reg('/privacy/', pages.privacy(), 0.3, 'yearly');
reg('/terms/', pages.terms(), 0.3, 'yearly');

// ---- Filesystem helpers -----------------------------------------------------
async function rimraf(dir) {
  await fs.rm(dir, { recursive: true, force: true });
}
async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) await copyDir(s, d);
    else await fs.copyFile(s, d);
  }
}
async function writeFile(rel, content) {
  const full = path.join(OUT, rel);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, content, 'utf8');
}

// ---- Sitemap + robots -------------------------------------------------------
function sitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = routes.map(r =>
    `  <url>\n    <loc>${site.origin}${r.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority.toFixed(1)}</priority>\n  </url>`
  ).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
function robots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${site.origin}/sitemap.xml\n`;
}

// ---- Build ------------------------------------------------------------------
async function build() {
  await rimraf(OUT);
  await fs.mkdir(OUT, { recursive: true });

  // Copy static assets (styles.css, site.js, assets/, og-image.png)
  await copyDir(STATIC, OUT);

  // Write pages
  for (const r of routes) await writeFile(r.file, r.html);

  // 404 (served at /404.html by the worker)
  await writeFile('404.html', pages.notFound());

  // sitemap + robots
  await writeFile('sitemap.xml', sitemap());
  await writeFile('robots.txt', robots());

  console.log(`Built ${routes.length + 1} pages into ${path.relative(ROOT, OUT)}/`);
  console.log(`  - ${services.length} service pages`);
  console.log(`  - ${industries.length} industry pages`);
  console.log(`  - sitemap.xml (${routes.length} URLs), robots.txt, 404.html`);
}

build().catch(err => { console.error(err); process.exit(1); });
