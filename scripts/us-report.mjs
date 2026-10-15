// Counts every Africa term, cybersecurity term, banned claim and UK spelling in
// the US view (all pages US visitors can reach) and in the Ghana view.
// Usage: node scripts/us-report.mjs [--list]
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GH_ONLY } from './content.mjs';
import { AFRICA_TERMS, CYBER_TERMS, BANNED_CLAIMS, UK_SPELLING, hits, usView, ghView, scanable } from './terms.mjs';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');
const list = process.argv.includes('--list');
async function walk(d) { const o = []; for (const e of await fs.readdir(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) o.push(...await walk(f)); else if (f.endsWith('.html')) o.push(f); } return o; }
const cats = { africa: AFRICA_TERMS, cyber: CYBER_TERMS, claims: BANNED_CLAIMS, ukSpelling: UK_SPELLING };
const tot = { us: {}, gh: {} }, pages = { us: {}, gh: {} }, words = { us: {}, gh: {} };
for (const v of ['us', 'gh']) for (const c in cats) { tot[v][c] = 0; pages[v][c] = new Set(); words[v][c] = {}; }
let usPages = 0;
const extra = ['site.webmanifest', 'robots.txt', 'sitemap.xml', '.well-known/security.txt', 'site.js'];
for (const f of await walk(OUT)) {
  const rel = '/' + path.relative(OUT, f); const route = rel.replace(/index\.html$/, '');
  const raw = await fs.readFile(f, 'utf8');
  const views = { gh: scanable(ghView(raw)) };
  if (!GH_ONLY[route]) { views.us = scanable(usView(raw)); usPages++; }
  for (const [v, text] of Object.entries(views)) for (const [c, re] of Object.entries(cats)) {
    if (v === 'gh' && (c === 'africa' || c === 'cyber')) continue;
    for (const m of hits(re, text)) { tot[v][c]++; pages[v][c].add(route); const w = m[0].toLowerCase(); words[v][c][w] = (words[v][c][w] || 0) + 1; if (list && v === 'us') console.log(`${route} [${c}] …${text.slice(Math.max(0, m.index - 60), m.index + 40).replace(/\s+/g, ' ')}…`); }
  }
}
for (const f of extra) {
  const t = await fs.readFile(path.join(OUT, f), 'utf8').catch(() => '');
  for (const [c, re] of Object.entries(cats)) for (const m of hits(re, t)) { tot.us[c]++; pages.us[c].add(f); const w = m[0].toLowerCase(); words.us[c][w] = (words.us[c][w] || 0) + 1; }
}
console.log(`US view: ${usPages} pages + ${extra.length} site files`);
for (const v of ['us', 'gh']) for (const c in cats) {
  if (v === 'gh' && (c === 'africa' || c === 'cyber')) continue;
  console.log(`${v.toUpperCase()} ${c}: ${tot[v][c]} hits on ${pages[v][c].size} pages ${JSON.stringify(words[v][c])}`);
}
