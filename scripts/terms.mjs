// ============================================================================
// Shared term lists for the build checks (check.mjs) and the US-view count
// report (us-report.mjs). All patterns are global + case-insensitive.
// ============================================================================

// Africa / Ghana terms that must never appear in the server-rendered US view
// (text, meta, OG, alt text, JSON-LD, nav, footer). Source: us/site-audit-us.md
// acceptance regex, with word boundaries, plus local networks and places.
export const AFRICA_TERMS = /\b(Ghana|Ghanaian|Ghanaians|Accra|Africa|African|cedis?|GHS|MoMo|Mobile Money|Telecel|MTN|AT Money|Paystack|Kumasi|Takoradi|Tamale|Tema|Osu|East Legon|Legon|Cantonments|diaspora|Act 843)\b|GH₵|₵|\+233/gi;

// Removed for now (Josh, 2026-10-15). US view only.
export const CYBER_TERMS = /\bcyber ?security\b|\bcyber\b/gi;

// Claims we may not make, in any view.
export const BANNED_CLAIMS = /\bguarantee[ds]?\b|\bguaranteeing\b|month (1|one)( of the retainer)? (is )?free|proof, not promises|work (&amp;|&|and) results|\bproven\b|high-converting|\btestimonials?\b|\bcase stud(y|ies)\b|\bcertified\b|\bSOC ?2?\b|24\/7|24x7|round-the-clock|\bjosh@showmeworld\.app\b/gi;

// British spellings -> US spellings. Checked in both views (the site uses US
// spelling everywhere; that is simpler than keeping two spellings).
export const UK_SPELLING = new RegExp('\\b(' + [
  'programmes?', 'organis(e|es|ed|ing|ation|ations|ational)', 'optimis(e|es|ed|ing|ation|ations)',
  'colou?rs?(?<=colours?)', 'colour(ed|ful|ing)', 'centres?', 'centred', 'enrol', 'enrols', 'enrolment', 'enrolments',
  'licences?', 'licenced', 'behaviours?', 'favourites?', 'catalogues?', 'analys(e|es|ed|ing)', 'prioritis(e|es|ed|ing|ation)',
  'recognis(e|es|ed|ing)', 'minimis(e|es|ed|ing)', 'maximis(e|es|ed|ing)', 'customis(e|es|ed|ing|ation)',
  'personalis(e|es|ed|ing|ation)', 'specialis(e|es|ed|ing)', 'utilis(e|es|ed|ing)', 'summaris(e|es|ed|ing)',
  'standardis(e|es|ed|ing|ation)', 'finalis(e|es|ed|ing)', 'centralis(e|es|ed|ing)', 'digitalis(e|es|ed|ing|ation)',
  'authoris(e|es|ed|ing|ation)', 'apologis(e|es|ed|ing)', 'realis(e|es|ed|ing)', 'modernis(e|es|ed|ing)',
  'synchronis(e|es|ed|ing)', 'categoris(e|es|ed|ing)', 'criticis(e|es|ed|ing)', 'emphasis(e|es|ed|ing)',
  'familiaris(e|es|ed|ing)', 'visualis(e|es|ed|ing)', 'monetis(e|es|ed|ing)', 'capitalis(e|es|ed|ing)',
  'harmonis(e|es|ed|ing)', 'stabilis(e|es|ed|ing)', 'mobilis(e|es|ed|ing)', 'jeopardis(e|es|ed|ing)',
  'fulfil', 'fulfils', 'fulfilment', 'enquir(y|ies|e|es|ed|ing)', 'practis(e|es|ed|ing)', 'defence', 'labour',
  'honour(s|ed)?', 'neighbourhoods?', 'humour', 'flavours?', 'endeavours?', 'judgement', 'ageing', 'grey',
  'cheques?', 'storeys?', 'whilst', 'amongst', 'learnt', 'travell(ed|ing|er|ers)', 'cancell(ed|ing)',
  'modell(ed|ing)', 'labell(ed|ing)', 'signall(ed|ing)', 'counsellors?', 'jewellery', 'aluminium', 'tyres?',
  'paediatric', 'orthopaedic', 'anaesthe\\w*', 'haemo\\w*', 'oestrogen', 'manoeuvre', 'kerb', 'plough',
  'sceptical', 'artefacts?', 'pyjamas', 'cosy', 'postcode'
].join('|') + ')\\b', 'gi');

export function hits(re, text) {
  re.lastIndex = 0;
  return [...text.matchAll(re)];
}

// ---- The two views, exactly as the edge worker serves them -----------------
// Remove every element carrying `attr`, including nested same-name children.
export function removeElementsWithAttr(html, attr, onError = () => {}) {
  const open = new RegExp(`<([a-z][a-z0-9]*)\\b[^>]*\\s${attr}(?:[\\s=>/])`, 'i');
  let guard = 0;
  for (;;) {
    const m = open.exec(html);
    if (!m || ++guard > 5000) break;
    const tag = m[1].toLowerCase();
    const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'gi');
    re.lastIndex = m.index;
    let depth = 0, end = -1, t;
    while ((t = re.exec(html))) {
      depth += t[1] ? -1 : 1;
      if (depth === 0) { end = re.lastIndex; break; }
    }
    if (end < 0) { onError('unbalanced element with ' + attr); break; }
    html = html.slice(0, m.index) + html.slice(end);
  }
  return html;
}
export function usView(html) {
  return html
    .replace(/<template data-gh-block>[\s\S]*?<\/template>/g, '')
    .replace(/ data-gh="[^"]*"/g, '');
}
export function ghView(html, onError) {
  let h = removeElementsWithAttr(html, 'data-us-only', onError);
  h = h.replace(/<template data-gh-block>([\s\S]*?)<\/template>/g, '$1');
  h = h.replace(/(<(span|option)\b[^>]*?) data-us="[^"]*" data-gh="([^"]*)"([^>]*>)[^<]*/g, (x, a, tag, gh, b) => a + b + gh);
  return h;
}
// What a reader or crawler sees: drop comments (source notes), the region
// switcher (it names "Ghana" by design) and external script tags.
export const scanable = h => h
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<nav class="region"[\s\S]*?<\/nav>/g, ' ')
  .replace(/<script src="[^"]*"[^>]*><\/script>/g, ' ');
