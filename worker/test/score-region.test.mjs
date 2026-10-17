// Region-aware scoring: the same website scored for a US lead and a Ghana lead.
// Run: node --test worker/test/   (or: npm run test:audit)
import test from 'node:test';
import assert from 'node:assert/strict';
import { analyseHtml } from '../src/audit/scan.js';
import { scoreAudit, templatedPriorities, templatedRecommendations, templatedSummary, AREAS, US_BANNED } from '../src/audit/score.js';
import { buildAiInput, validateAi } from '../src/audit/ai.js';

// A small business homepage with no WhatsApp, chat, booking, payments, reviews or map.
const PLAIN = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Oak Street Plumbing | Plumber in Greensboro</title></head>
<body><h1>Oak Street Plumbing</h1><p>Call 336 555 0100.</p><img src="/logo.png" alt="Oak Street Plumbing logo"></body></html>`;

// A US-style site that has the US signals.
const US_READY = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Oak Street Plumbing | Plumber in Greensboro</title><meta name="description" content="Licensed plumbing repairs, water heaters and drain cleaning in Greensboro, with upfront quotes and same-week appointments.">
<script src="https://js.stripe.com/v3/"></script><script src="https://www.googletagmanager.com/gtag/js?id=G-X"></script></head>
<body><h1>Oak Street Plumbing</h1><a href="tel:+13365550100">Call</a> <a href="sms:+13365550100">Text us</a>
<a href="https://calendly.com/oakstreet">Book online</a> <a href="https://www.yelp.com/biz/oak-street-plumbing">Yelp reviews</a>
<a href="https://maps.app.goo.gl/abc">Directions</a><form><input type="email" name="email"></form></body></html>`;

function scanFor(html) {
  return {
    status: 'ok', host: 'oakstreet.example', input: 'oakstreet.example',
    website: { https: true, httpRedirect: { checked: true, redirectsToHttps: true, status: 301 }, psi: {}, responseMs: 400, htmlBytes: html.length },
    page: analyseHtml(html, 'https://oakstreet.example/'),
    crawl: { robotsFound: true, sitemapFound: false }, places: { status: 'not_found' }, favicon: false,
    dns: { checked: true, domain: 'oakstreet.example', mxProvider: 'Google Workspace', spf: 'v=spf1 include:_spf.google.com ~all', dmarc: 'v=DMARC1; p=none', dmarcPolicy: 'none' }
  };
}
const lead = region => ({ business: 'Oak Street Plumbing', email: 'owner@oakstreet.example', region, message: 'Customers message us and we miss bookings' });
const copyText = (r, l) => JSON.stringify([templatedPriorities(r), templatedRecommendations(r), templatedSummary(r, l), r.issues.map(i => [i.finding, i.action]), AREAS.map(a => r.areas[a.key].rules.map(x => x.label + ' ' + x.detail))]);

test('US lead: no WhatsApp / MoMo / Paystack / Ghana rules or advice', () => {
  for (const region of ['us', undefined]) {
    const l = lead(region);
    const r = scoreAudit(scanFor(PLAIN), l);
    assert.equal(r.outOf, 60);
    assert.deepEqual(Object.keys(r.areas), AREAS.map(a => a.key));
    const t = copyText(r, l);
    assert.ok(!US_BANNED.test(t), 'US copy mentions a banned term: ' + (t.match(US_BANNED) || [])[0]);
    const ids = r.issues.map(i => i.id);
    for (const id of ['no_tel', 'no_reviews_link', 'no_map', 'no_payments', 'no_chat', 'no_booking', 'no_form']) assert.ok(ids.includes(id), 'missing US issue ' + id);
    assert.ok(!ids.includes('no_whatsapp'));
  }
});

test('Ghana lead keeps the original WhatsApp / MoMo behaviour', () => {
  const r = scoreAudit(scanFor(PLAIN), lead('gh'));
  const ids = r.issues.map(i => i.id);
  assert.ok(ids.includes('no_whatsapp'));
  assert.ok(!ids.includes('no_tel') && !ids.includes('no_reviews_link') && !ids.includes('no_map'));
  assert.match(r.issues.find(i => i.id === 'no_payments').action, /Paystack\/Hubtel/);
  assert.equal(r.outOf, 60);
});

test('US signals are rewarded for US leads', () => {
  const plain = scoreAudit(scanFor(PLAIN), lead('us'));
  const ready = scoreAudit(scanFor(US_READY), lead('us'));
  const ids = ready.issues.map(i => i.id);
  for (const id of ['no_tel', 'no_reviews_link', 'no_map', 'no_payments', 'no_chat', 'no_booking', 'no_form', 'no_analytics']) assert.ok(!ids.includes(id), 'should not flag ' + id);
  assert.ok(ready.total > plain.total, `ready ${ready.total} should beat plain ${plain.total}`);
  for (const a of AREAS) assert.ok(ready.areas[a.key].score >= 0 && ready.areas[a.key].score <= 10);
});

test('AI input carries region; US output suggesting WhatsApp/MoMo is rejected', () => {
  const r = scoreAudit(scanFor(PLAIN), lead('us'));
  const input = buildAiInput(r, lead('us'));
  assert.equal(input.region, 'United States');
  assert.equal(buildAiInput(r, lead('gh')).region, 'Ghana');
  const mk = action => ({ summary: 'A short summary.', priorities: input.priorities.map(() => ({ title: 'Do this next', why: 'We found a gap.', action })) });
  assert.ok(validateAi(mk('Add a tap-to-call link.'), input));
  assert.equal(validateAi(mk('Add a WhatsApp button.'), input), null);
  assert.equal(validateAi(mk('Accept MoMo payments.'), input), null);
  assert.equal(validateAi(mk('Use Paystack links.'), input), null);
  const ghIn = buildAiInput(scoreAudit(scanFor(PLAIN), lead('gh')), lead('gh'));
  assert.ok(validateAi({ summary: 'A short summary.', priorities: ghIn.priorities.map(() => ({ title: 'Do this next', why: 'We found a gap.', action: 'Add a WhatsApp button.' })) }, ghIn));
});

test('side-by-side summary (printed for review)', () => {
  for (const region of ['us', 'gh']) {
    const r = scoreAudit(scanFor(PLAIN), lead(region));
    console.log(`\n[${region}] total ${r.total}/60 · ` + AREAS.map(a => `${a.label} ${r.areas[a.key].score}`).join(', '));
    for (const p of templatedPriorities(r)) console.log(`  - ${p.title}: ${p.action}`);
  }
});
