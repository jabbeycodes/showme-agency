// ============================================================================
// Build-time region resolution for {{token}} prices/wording (see money.mjs).
//   - Inside tags (attribute values), <title>, <script> (JSON-LD) and <style>:
//     tokens resolve to the US value (canonical default; crawlers see US).
//   - Visible text nodes containing tokens become
//       <span data-us="…" data-gh="…">US text</span>
//     (or, inside <option>, the attributes go on the <option> itself) so the
//     edge worker / switcher can show Ghana prices without a second URL.
// ============================================================================
import { ALL } from './money.mjs';

const TOKEN = /\{\{([a-z0-9_]+)\}\}/g;

function resolve(s, idx) {
  return s.replace(TOKEN, (m, k) => {
    if (!ALL[k]) throw new Error('Unknown price/wording token {{' + k + '}}');
    return ALL[k][idx];
  });
}
export const usText = s => resolve(String(s), 1);
export const ghText = s => resolve(String(s), 0);
const attr = s => s.replace(/"/g, '&quot;');

export function regionize(html) {
  if (!html.includes('{{')) return html;
  // Split into raw-text elements, tags and text.
  const re = /(<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<title\b[\s\S]*?<\/title>|<!--[\s\S]*?-->|<[^>]+>)/gi;
  const parts = html.split(re);
  let lastOpenTagIdx = -1;
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (!p) continue;
    if (i % 2 === 1) {
      // A tag or raw-text element: US only.
      parts[i] = usText(p);
      if (/^<[a-z]/i.test(p)) lastOpenTagIdx = i;
      continue;
    }
    if (!p.includes('{{')) continue;
    const us = usText(p);
    const gh = ghText(p);
    const lead = us.match(/^\s*/)[0];
    const trail = us.match(/\s*$/)[0];
    const usCore = us.trim();
    const ghCore = gh.trim();
    const prevTag = lastOpenTagIdx >= 0 ? parts[lastOpenTagIdx] : '';
    if (/^<option\b/i.test(prevTag) && lastOpenTagIdx === i - 1) {
      parts[i - 1] = prevTag.replace(/^<option\b/i, `<option data-us="${attr(usCore)}" data-gh="${attr(ghCore)}"`);
      parts[i] = us;
    } else {
      parts[i] = `${lead}<span data-us="${attr(usCore)}" data-gh="${attr(ghCore)}">${usCore}</span>${trail}`;
    }
  }
  const out = parts.join('');
  if (out.includes('{{')) throw new Error('Unresolved {{token}} left in output');
  return out;
}
