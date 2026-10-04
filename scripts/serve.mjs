// ============================================================================
// Minimal static preview server for /public. Mirrors the production worker's
// asset routing: clean directory URLs -> index.html, unknown paths -> 404.html.
// For local preview/screenshots only — production is the Cloudflare Worker.
// ============================================================================
import http from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '..', 'public');
const PORT = process.env.PORT || 4321;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json',
  '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon'
};

async function readIfExists(p) {
  try { const st = await fs.stat(p); if (st.isFile()) return await fs.readFile(p); } catch {}
  return null;
}

const server = http.createServer(async (req, res) => {
  let pathname = decodeURIComponent(req.url.split('?')[0]);
  const candidates = [];
  if (pathname.endsWith('/')) candidates.push(path.join(OUT, pathname, 'index.html'));
  else {
    candidates.push(path.join(OUT, pathname));
    candidates.push(path.join(OUT, pathname, 'index.html'));
    candidates.push(path.join(OUT, pathname + '.html'));
  }
  for (const c of candidates) {
    const buf = await readIfExists(c);
    if (buf) {
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(c)] || 'application/octet-stream' });
      return res.end(buf);
    }
  }
  const nf = await readIfExists(path.join(OUT, '404.html'));
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(nf || 'Not found');
});

server.listen(PORT, () => console.log(`Preview: http://localhost:${PORT}`));
