// ============================================================================
// Static site generator for ShowMe Digital Agency.
// Renders every page to /public, copies /static assets, and writes sitemap.xml
// + robots.txt. Output is plain static HTML/CSS/JS — no runtime dependency.
// ============================================================================
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

import { site, services, insights } from './data.mjs';
import { serviceDetail, pillarPage, industryPage, ghIndustryPage } from './templates.mjs';
import * as pages from './pages.mjs';
import { PLACEHOLDERS } from './render.mjs';
import { regionize } from './region.mjs';
import { PILLARS, INDUSTRIES, GH_INDUSTRIES, GH_ONLY, REDIRECTS } from './content.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public');
const STATIC = path.join(ROOT, 'static');

const routes = []; // { path, file, html, priority, changefreq, ghOnly }

function reg(routePath, html, priority = 0.7, changefreq = 'monthly') {
  const file = routePath === '/'
    ? 'index.html'
    : routePath.replace(/^\//, '').replace(/\/$/, '') + '/index.html';
  if (routes.some(r => r.path === routePath)) throw new Error('Duplicate route ' + routePath);
  if (REDIRECTS[routePath]) throw new Error('Route is also a redirect source: ' + routePath);
  const tbcIds = [...html.matchAll(/<!--tbc:(\d+)-->/g)].map(m => +m[1]);
  html = html.replace(/<!--tbc:\d+-->/g, '');
  routes.push({ path: routePath, file, html: regionize(html), priority, changefreq, ghOnly: !!GH_ONLY[routePath], tbcIds });
}

// ---- Register every page ----------------------------------------------------
reg('/', pages.home(), 1.0, 'weekly');
reg('/solutions/', pages.solutionsHub(), 0.9);
for (const p of PILLARS) reg('/solutions/' + p.slug + '/', pillarPage(p, p.slug === 'digital-marketing' ? pages.marketingPackages() : ''), 0.9);
reg('/managed-it-services/', pages.managedIt(), 1.0);
for (const s of services) reg('/services/' + s.slug + '/', serviceDetail(s), 0.7);
reg('/industries/', pages.industriesHub(), 0.8);
for (const i of INDUSTRIES) reg('/industries/' + i.slug + '/', industryPage(i), 0.7);
for (const i of GH_INDUSTRIES) reg('/industries/' + i.slug + '/', ghIndustryPage(i), 0.4);
reg('/how-we-work/', pages.howWeWork(), 0.7, 'yearly');
reg('/pricing/', pages.pricing(), 0.6);
reg('/about/', pages.about(), 0.7, 'yearly');
reg('/capabilities/', pages.capabilities(), 0.6);
reg('/trust/', pages.trust(), 0.5, 'yearly');
reg('/insights/', pages.insightsIndex(), 0.6, 'weekly');
for (const a of insights) reg('/insights/' + a.slug + '/', pages.insightArticle(a), 0.4);
reg('/contact/', pages.contact(), 0.9, 'yearly');
reg('/technology-assessment/', pages.technologyAssessment(), 0.9);
reg('/faq/', pages.faqPage(), 0.5);
reg('/privacy/', pages.privacy(), 0.3, 'yearly');
reg('/terms/', pages.terms(), 0.3, 'yearly');
for (const p of Object.keys(GH_ONLY)) if (!routes.some(r => r.path === p)) throw new Error('GH_ONLY path has no page: ' + p);

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
// lastmod is per page and only moves when that page's rendered HTML actually
// changes. Hashes + dates are tracked in scripts/lastmod.json (committed), so
// rebuilding unchanged content does not bump every URL's lastmod.
const LASTMOD_FILE = path.join(__dirname, 'lastmod.json');
async function computeLastmod() {
  let prev = {};
  try { prev = JSON.parse(await fs.readFile(LASTMOD_FILE, 'utf8')); } catch {}
  const today = new Date().toISOString().slice(0, 10);
  const next = {};
  for (const r of routes.filter(r => !r.ghOnly)) {
    // Ignore cache-busting asset versions so CSS/JS tweaks don't touch lastmod.
    const normalized = r.html.replace(/\?v=[0-9a-f]{10}/g, '');
    const hash = createHash('sha256').update(normalized).digest('hex').slice(0, 16);
    const old = prev[r.path];
    next[r.path] = old && old.hash === hash ? old : { hash, date: today };
    r.lastmod = next[r.path].date;
  }
  await fs.writeFile(LASTMOD_FILE, JSON.stringify(next, null, 2) + '\n', 'utf8');
}
function sitemap() {
  const urls = routes.filter(r => !r.ghOnly).map(r =>
    `  <url>\n    <loc>${site.origin}${r.path}</loc>\n    <lastmod>${r.lastmod}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority.toFixed(1)}</priority>\n  </url>`
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
  await writeFile('404.html', regionize(pages.notFound().replace(/<!--tbc:\d+-->/g, '')));

  // sitemap + robots (Ghana-only pages are not listed)
  await computeLastmod();
  await writeFile('sitemap.xml', sitemap());
  await writeFile('robots.txt', robots());

  // security.txt (RFC 9116), served at /.well-known/security.txt
  const expires = new Date(Date.now() + 330 * 864e5).toISOString().slice(0, 10) + 'T00:00:00.000Z';
  const securityTxt = `Contact: mailto:${site.email}\nExpires: ${expires}\nPreferred-Languages: en\nCanonical: ${site.origin}/.well-known/security.txt\n`;
  await writeFile('.well-known/security.txt', securityTxt);

  // Worker route data (Ghana-only gating + permanent redirects)
  await fs.mkdir(path.join(ROOT, 'worker/src/generated'), { recursive: true });
  await fs.writeFile(path.join(ROOT, 'worker/src/generated/routes.js'),
    '// GENERATED by scripts/build.mjs from scripts/content.mjs. Do not edit.\n' +
    'export const GH_ONLY = ' + JSON.stringify(GH_ONLY, null, 2) + ';\n' +
    'export const REDIRECTS = ' + JSON.stringify(REDIRECTS, null, 2) + ';\n' +
    'export const SECURITY_TXT = ' + JSON.stringify(securityTxt) + ';\n', 'utf8');

  // Placeholder register for Josh
  await writePlaceholders();

  const shown = routes.filter(r => !r.ghOnly).length;
  console.log(`Built ${routes.length + 1} pages into ${path.relative(ROOT, OUT)}/ (${shown} in sitemap, ${routes.length - shown} Ghana-view only)`);
  console.log(`  - ${services.length} service pages, ${PILLARS.length} pillar pages, ${INDUSTRIES.length + GH_INDUSTRIES.length} industry pages`);
  console.log(`  - ${Object.keys(REDIRECTS).length} redirects, ${Object.keys(GH_ONLY).length} Ghana-only routes`);
}

async function writePlaceholders() {
  const found = new Map(); // id -> Set(paths)
  for (const r of routes) for (const id of r.tbcIds) {
    if (!found.has(id)) found.set(id, new Set());
    found.get(id).add(r.path);
  }
  const cell = t => t ? t.replace(/\|/g, '\\|') : '_(nothing shown until confirmed)_';
  const lines = ['# Placeholders awaiting Josh (generated by `npm run build`)', '',
    'Production shows safe, general wording for each item below (no invented facts, figures or commitments).',
    'When Josh confirms the real detail, replace the `live` text of the matching tbc() call in scripts/ and rebuild.',
    'The check fails the build if "TO CONFIRM" ever appears on a page. Regenerated on each build.', '',
    '| # | To confirm | Live wording used | Pages |', '|---|---|---|---|'];
  let n = 0;
  for (const [id, paths] of [...found].sort((x, y) => x[0] - y[0])) {
    const { question, live } = PLACEHOLDERS[id];
    lines.push(`| ${++n} | ${cell(question)} | ${cell(live)} | ${paths.size > 20 ? `every page (${paths.size}; site footer)` : [...paths].join(', ')} |`);
  }
  lines.push('', '## Also open (not shown on the site)', '',
    '- Legal review of the US-default privacy policy and terms (see the PENDING LEGAL REVIEW comment in scripts/pages.mjs). They currently name no legal entity or state.',
    '- Managed IT plan names: Essentials / Business / Complete IT Department, taken from repositioning/managed-it-packages.md (Josh may still rename them).',
    '- Proposed managed IT response figures in managed-it-packages.md are deliberately NOT published until Josh confirms them.',
    '- Hero headline and supporting line are set from the 2026-10-15 marketing input (confirmed wording).',
    '- Whether Ghana-only pages stay (real estate, diaspora property, WhatsApp ordering, photography, 4 Ghana guides).', '');
  await fs.writeFile(path.join(ROOT, 'repositioning/placeholders.md'), lines.join('\n'), 'utf8');
  console.log(`  - repositioning/placeholders.md (${n} placeholders, live wording on site)`);
}

build().catch(err => { console.error(err); process.exit(1); });
