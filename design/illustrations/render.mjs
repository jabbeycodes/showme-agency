import { chromium } from 'playwright'; // npm i -D playwright (not a site dependency)
import { scenes } from './scenes.mjs';
import { mkdirSync } from 'node:fs';
const only = process.argv.slice(2);
mkdirSync('./out', { recursive: true });
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
for (const [name, fn] of Object.entries(scenes)) {
  if (only.length && !only.some(o => name.includes(o))) continue;
  await p.setContent(fn(), { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: `./out/${name}.png` });
  console.log(name);
}
await b.close();
