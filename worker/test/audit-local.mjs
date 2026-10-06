// Local scanner + scoring check against real public sites (Node 20).
// Usage: node worker/test/audit-local.mjs [outDir]
// Writes sample report pages and emails, and asserts basic invariants.
import { writeFileSync, mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';
import { scanSite } from '../src/audit/scan.js';
import { scoreAudit, templatedPriorities, templatedRecommendations, templatedSummary, AREAS } from '../src/audit/score.js';
import { reportPage, leadReportEmail, alertEmail, adminReview } from '../src/audit/render.js';
import { validateAi, buildAiInput } from '../src/audit/ai.js';
import { normaliseUrl, waNumber } from '../src/audit/util.js';

const out = process.argv[2] || '/workspace/audit-samples';
mkdirSync(out, { recursive: true });

// --- unit checks -------------------------------------------------------------
assert.equal(normaliseUrl('example.org'), 'https://example.org/');
assert.equal(normaliseUrl(' http://Shop.Example.org/menu '), 'https://shop.example.org/menu');
assert.equal(normaliseUrl('localhost'), null);
assert.equal(normaliseUrl('http://192.168.0.1'), null);
assert.equal(normaliseUrl('javascript:alert(1)'), null);
assert.equal(normaliseUrl(''), null);
assert.deepEqual(waNumber('024 123 4567'), { digits: '233241234567', assumed: true });
assert.deepEqual(waNumber('+1 (336) 457-2361'), { digits: '13364572361', assumed: false });

const SITES = [
  { url: 'https://agency.showmeworld.app', lead: { id: 'lead:1700000000000:sample1', name: 'Sample — ShowMe', business: 'ShowMe Digital Agency', email: 'info@showmeworld.app', phone: '+1 336 457 2361', message: 'We want more enquiries from Google.', time_waster: 'Replying to the same WhatsApp questions', found_via: 'Google search', created_at: new Date().toISOString() } },
  { url: 'https://www.kfc.com.gh', lead: { id: 'lead:1700000000001:sample2', name: 'Sample — KFC', business: 'KFC Ghana', email: 'sample@kfc.example', phone: '0241234567', message: 'Need online ordering and bookings.', created_at: new Date().toISOString() } },
  { url: 'https://stripe.com', lead: { id: 'lead:1700000000002:sample3', name: 'Sample — Stripe', business: 'Stripe', email: 'someone@gmail.com', phone: '', message: '', created_at: new Date().toISOString() } },
  { url: 'https://this-domain-should-not-exist-showme-test.com', lead: { id: 'lead:1700000000003:sample4', name: 'Sample — Broken', business: 'Broken Site Ltd', email: 'x@gmail.com', created_at: new Date().toISOString() } }
];

const summary = [];
for (const [i, s] of SITES.entries()) {
  const t0 = Date.now();
  const scan = await scanSite(s.url, { business: s.lead.business, psiKey: process.env.PSI_API_KEY, psiTimeoutMs: 30000 });
  const result = scoreAudit(scan, s.lead);
  // Invariants
  assert.equal(result.outOf, 60);
  let sum = 0;
  for (const a of AREAS) { const sc = result.areas[a.key].score; assert.ok(sc >= 0 && sc <= 10, a.key + ' in range'); sum += sc; }
  assert.equal(sum, result.total);
  assert.ok(result.topIssues.length <= 3);
  const audit = {
    leadId: s.lead.id, token: 'SAMPLE-token-' + i + '-xxxxxxxxxxxxxxxx', status: 'draft', created_at: new Date().toISOString(), scan, result,
    copy: { summary: templatedSummary(result, s.lead), priorities: templatedPriorities(result), recommendations: templatedRecommendations(result) }, copy_source: 'template'
  };
  // The AI validator must reject invented numbers and accept faithful rewrites.
  const input = buildAiInput(result, s.lead);
  if (input.priorities.length) {
    const good = { summary: 'Clear next steps.', priorities: input.priorities.map(p => ({ title: 'Fix this', why: p.finding, action: p.suggested_action })) };
    assert.ok(validateAi(good, input), 'faithful AI output accepted');
    const bad = { summary: 'This will boost sales by 47% like our client Acme.', priorities: good.priorities };
    assert.equal(validateAi(bad, input), null, 'invented stat rejected');
  }
  const slug = s.url.replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/-$/, '');
  const base = '<base href="https://agency.showmeworld.app/">';
  writeFileSync(`${out}/report-${slug}.html`, reportPage(audit, s.lead, { preview: false }).replace('<head>', '<head>\n  ' + base));
  writeFileSync(`${out}/email-lead-${slug}.html`, leadReportEmail(audit, s.lead).html);
  writeFileSync(`${out}/email-alert-${slug}.html`, alertEmail(s.lead, audit).html);
  writeFileSync(`${out}/admin-review-${slug}.html`, adminReview(s.lead, audit, { config: { ALERT_TO: 'info@showmeworld.app' } }).replace('<head>', '<head>\n  ' + base));
  writeFileSync(`${out}/scan-${slug}.json`, JSON.stringify({ scan, result }, null, 2));
  summary.push({ site: s.url, status: scan.status, total: result.total, areas: Object.fromEntries(AREAS.map(a => [a.key, result.areas[a.key].score])), psi: scan.website?.psi?.mobile?.status, priorities: audit.copy.priorities.map(p => p.title), ms: Date.now() - t0 });
}
console.log(JSON.stringify(summary, null, 2));
console.log('All local audit checks passed. Samples in ' + out);
