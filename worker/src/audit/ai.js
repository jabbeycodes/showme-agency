// =============================================================================
// Optional Workers AI phrasing. The model only rewrites the structured findings
// (never adds facts). Output is validated; anything suspicious -> null so the
// caller falls back to the templated copy.
// =============================================================================
import { withTimeout } from './util.js';

export const AI_MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';

const SYSTEM = `You write short, plain-English website audit priorities for a small business owner.
Rules (strict):
- Use ONLY the findings provided. Do not invent statistics, percentages, prices, competitors, client names, testimonials or results.
- Only use numbers that appear in the findings.
- Be specific to their findings, warm and direct. No jargon without a short explanation. No hype, no exclamation marks.
- Do not mention the agency, do not promise outcomes, do not say "guarantee".
- Keep the finding's certainty: if it says "we could not find/detect", keep that wording; never state as fact something we only failed to detect.
- Titles in sentence case. Address the owner as "you".
- Return ONLY valid JSON, no markdown, in exactly this shape:
{"summary":"2 sentences max","priorities":[{"title":"max 8 words","why":"1-2 sentences: what we found and why it matters to customers","action":"1-2 sentences: the concrete next step"}]}
- Return exactly as many priorities as given (same count), in the same order.`;

const BANNED = /first client|testimonial|guarantee|award|trusted by|clients like|case study|\bROI\b|revenue increase|double your|triple your|\d+\s?%/i;

function numbersIn(s) { return (String(s).match(/\d+(?:[.,]\d+)?/g) || []).map(n => n.replace(',', '.')); }

export function buildAiInput(result, lead) {
  return {
    business: lead.business || null,
    customer_said: [lead.message, lead.time_waster ? 'Biggest time-waster: ' + lead.time_waster : '', lead.found_via ? 'Customers mostly find them via: ' + lead.found_via : ''].filter(Boolean).join(' | ').slice(0, 600) || null,
    overall: result.total + '/60',
    area_scores: Object.fromEntries(Object.values(result.areas).map(a => [a.label, a.score + '/10'])),
    priorities: result.topIssues.map(i => ({ area: i.area, finding: i.finding, suggested_action: i.action }))
  };
}

export function validateAi(out, input) {
  if (!out || typeof out !== 'object') return null;
  const pr = Array.isArray(out.priorities) ? out.priorities : null;
  if (!pr || pr.length !== input.priorities.length) return null;
  const allowed = new Set(numbersIn(JSON.stringify(input)));
  const clean = s => String(s || '').replace(/\s+/g, ' ').trim();
  const items = pr.map((p, i) => ({ area: input.priorities[i].area, title: clean(p.title).slice(0, 90), why: clean(p.why).slice(0, 420), action: clean(p.action).slice(0, 420) }));
  const summary = clean(out.summary).slice(0, 420);
  const text = summary + ' ' + items.map(i => i.title + ' ' + i.why + ' ' + i.action).join(' ');
  if (items.some(i => !i.title || !i.why || !i.action)) return null;
  if (BANNED.test(text)) return null;
  for (const n of numbersIn(text)) if (!allowed.has(n) && !['1', '2', '3'].includes(n)) return null;
  return { summary, priorities: items };
}

function parseJson(raw) {
  if (raw && typeof raw === 'object') return raw;
  const s = String(raw || '');
  const start = s.indexOf('{');
  const end = s.lastIndexOf('}');
  if (start < 0 || end <= start) return null;
  try { return JSON.parse(s.slice(start, end + 1)); } catch { return null; }
}

/** Returns { summary, priorities, model } or { error } — never throws. */
export async function phraseWithAi(env, result, lead, timeoutMs = 20000) {
  if (!env || !env.AI || typeof env.AI.run !== 'function') return { error: 'ai_unavailable' };
  if (!result.topIssues.length) return { error: 'no_issues' };
  const input = buildAiInput(result, lead);
  const run = (async () => {
    const res = await env.AI.run(AI_MODEL, {
      messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: `Rewrite these ${input.priorities.length} priorit${input.priorities.length === 1 ? 'y' : 'ies'} (return exactly ${input.priorities.length}). Findings JSON:\n` + JSON.stringify(input) }],
      max_tokens: 900,
      temperature: 0.3
    });
    return res && (res.response ?? res.result?.response ?? res);
  })().catch(err => ({ __error: String((err && err.message) || err).slice(0, 200) }));
  const raw = await withTimeout(run, timeoutMs, { __error: 'timeout' });
  if (raw && raw.__error) return { error: raw.__error };
  const parsed = parseJson(raw);
  const valid = validateAi(parsed, input);
  if (!valid) return { error: parsed ? 'validation_failed' : 'unparseable_output', raw: String(typeof raw === 'string' ? raw : JSON.stringify(raw)).slice(0, 600) };
  return { ...valid, model: AI_MODEL };
}
