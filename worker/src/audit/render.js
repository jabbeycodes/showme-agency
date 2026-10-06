// =============================================================================
// HTML for the audit report page, emails, and admin screens.
// =============================================================================
import { esc, waNumber, leadSlug } from './util.js';
import { AREAS } from './score.js';

export const ORIGIN = 'https://agency.showmeworld.app';
export const BOOK_WA = 'https://wa.me/13364572361';
const ABOUT = 'ShowMe Digital Agency is US-led, with our team on the ground in Accra, Ghana. We bring 7+ years of experience and have helped 50+ businesses with websites, growth and automation.';

function fmtDate(iso) {
  try { return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Accra' }); } catch { return ''; }
}
function fmtDateTime(iso) {
  try { return new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Accra' }) + ' GMT'; } catch { return ''; }
}
function scoreColor(s, max = 10) {
  const r = s / max;
  return r >= 0.75 ? 'var(--mint)' : r >= 0.5 ? 'var(--gold)' : 'var(--coral)';
}
export function bookWaUrl(business) {
  return BOOK_WA + '?text=' + encodeURIComponent(`Hi Josh, I've read my free digital audit${business ? ' for ' + business : ''} and I'd like to book a call about the priorities.`);
}

const AUDIT_CSS = `
.audit-score{display:flex;gap:28px;align-items:center;flex-wrap:wrap;margin-top:22px}
.audit-total{font-family:'Anton',Impact,sans-serif;font-size:clamp(64px,10vw,104px);line-height:1;color:var(--text)}
.audit-total small{font-size:.35em;color:var(--text-muted);margin-left:6px}
.audit-bars{display:grid;gap:12px;flex:1;min-width:260px}
.audit-bar{display:grid;grid-template-columns:150px 1fr 48px;gap:12px;align-items:center;font-size:15px}
.audit-bar .track{height:10px;border-radius:99px;background:var(--surface-2);overflow:hidden}
.audit-bar .fill{display:block;height:100%;border-radius:99px}
.audit-bar b{text-align:right;font-family:'Archivo',sans-serif}
.audit-prio{counter-reset:p;display:grid;gap:16px;padding:0;margin:20px 0 0;list-style:none}
.audit-prio li{position:relative;padding:22px 22px 22px 70px;border:1px solid var(--night-line);border-radius:16px;background:var(--surface)}
.audit-prio li:before{counter-increment:p;content:counter(p);position:absolute;left:22px;top:20px;width:32px;height:32px;border-radius:50%;background:var(--coral);color:#fff;display:grid;place-items:center;font-weight:800;font-family:'Archivo',sans-serif}
.audit-prio h3{margin:0 0 8px;font-size:19px}.audit-prio p{margin:6px 0 0;color:var(--text-muted)}
.audit-prio .tag{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--mint);font-weight:700}
.audit-area{border:1px solid var(--night-line);border-radius:16px;background:var(--surface);padding:22px;margin-top:16px}
.audit-area header{display:flex;justify-content:space-between;align-items:baseline;gap:12px}
.audit-area h3{margin:0;font-size:20px}.audit-area .s{font-family:'Archivo',sans-serif;font-weight:800;font-size:20px}
.audit-area p{color:var(--text-muted);margin:10px 0 0}
.audit-area details{margin-top:12px}.audit-area summary{cursor:pointer;color:var(--text);font-weight:600;font-size:14px}
.audit-checks{list-style:none;padding:0;margin:10px 0 0;display:grid;gap:6px;font-size:14px}
.audit-checks li{display:grid;grid-template-columns:22px 1fr;gap:8px;color:var(--text-muted)}
.audit-checks li span.i{font-weight:800}.audit-checks .pass span.i{color:var(--mint)}.audit-checks .fail span.i{color:var(--coral)}.audit-checks .partial span.i{color:var(--gold)}.audit-checks .unknown span.i{color:var(--text-muted)}
.audit-checks em{font-style:normal;opacity:.8}
.audit-banner{background:var(--gold);color:#111;padding:10px 16px;text-align:center;font-weight:700;font-size:14px}
.audit-meta{color:var(--text-muted);font-size:14px;margin-top:10px}
.audit-simple-top{border-bottom:1px solid var(--night-line);padding:16px 0}
.audit-simple-top .wrap{display:flex;justify-content:space-between;align-items:center;gap:12px}
.audit-foot{border-top:1px solid var(--night-line);padding:28px 0 48px;color:var(--text-muted);font-size:14px}
@media (max-width:620px){.audit-bar{grid-template-columns:110px 1fr 40px;font-size:14px}.audit-prio li{padding-left:62px}}
`;

function docHead(title, extraCss = '') {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="robots" content="noindex,nofollow,noarchive" />
  <meta name="referrer" content="no-referrer" />
  <meta name="color-scheme" content="dark light" />
  <meta name="theme-color" content="#07111f" />
  <link rel="icon" href="/favicon.ico" sizes="32x32" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <title>${esc(title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@500;600;700;800&family=Public+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles.css" />
  <style>${AUDIT_CSS}${extraCss}</style>
</head>`;
}

function topBar(right = '') {
  return `<div class="audit-simple-top"><div class="wrap"><a class="brand" href="/"><span>ShowMe<span class="dot">.</span></span><small>Digital Agency</small></a>${right}</div></div>`;
}

function checksList(rules) {
  const icon = { pass: '✓', fail: '✕', partial: '◐', unknown: '–' };
  return `<ul class="audit-checks">${rules.map(r => `<li class="${r.status}"><span class="i" aria-label="${r.status}">${icon[r.status] || '–'}</span><span>${esc(r.label)}${r.detail ? ` <em>· ${esc(r.detail)}</em>` : ''}${r.status === 'unknown' && r.max === 0 ? '' : ''}</span></li>`).join('')}</ul>`;
}

export function scoreBars(result) {
  return `<div class="audit-bars">${AREAS.map(a => {
    const s = result.areas[a.key].score;
    return `<div class="audit-bar"><span>${esc(a.label)}</span><span class="track"><span class="fill" style="width:${s * 10}%;background:${scoreColor(s)}"></span></span><b>${s}/10</b></div>`;
  }).join('')}</div>`;
}

/** Public (or admin-preview) report page. */
export function reportPage(audit, lead, { preview = false, replyTo = 'info@showmeworld.app' } = {}) {
  const r = audit.result;
  const c = audit.copy;
  const business = lead.business || audit.scan?.host || 'Your business';
  const date = fmtDate(audit.scan?.scannedAt || audit.created_at);
  const site = audit.scan?.url || '';
  const areaBlocks = AREAS.map(a => {
    const ar = r.areas[a.key];
    const rules = ar.rules.filter(x => !(x.max === 0 && x.earned == null && !x.detail));
    return `<div class="audit-area"><header><h3>${esc(a.label)}</h3><span class="s" style="color:${scoreColor(ar.score)}">${ar.score}/10</span></header>
      <p>${esc(c.recommendations?.[a.key] || '')}</p>
      <details><summary>What we checked (${ar.measured} automated check${ar.measured === 1 ? '' : 's'})</summary>${checksList(rules)}</details></div>`;
  }).join('');
  const prio = (c.priorities || []).map(p => `<li><span class="tag">${esc((AREAS.find(a => a.key === p.area) || {}).label || '')}</span><h3>${esc(p.title)}</h3><p>${esc(p.why)}</p><p><strong style="color:var(--text)">Next step:</strong> ${esc(p.action)}</p></li>`).join('');

  return `${docHead('Digital audit: ' + business + ' | ShowMe Agency')}
<body>
  ${preview ? `<div class="audit-banner">DRAFT PREVIEW — not yet sent to the lead (status: ${esc(audit.status)})</div>` : ''}
  ${topBar(`<a class="btn whatsapp" href="${esc(bookWaUrl(lead.business))}" target="_blank" rel="noopener"><span>Book a free call</span></a>`)}
  <main id="main">
    <section class="page-hero">
      <div class="wrap">
        <p class="kicker">Free digital audit</p>
        <h1>${esc(business)}: your digital audit</h1>
        <p class="lead">${esc(c.summary || '')}</p>
        <p class="audit-meta">${site ? `Website checked: ${esc(site)} · ` : ''}${esc(date)}</p>
        <div class="audit-score">
          <div class="audit-total" aria-label="Overall score ${r.total} out of 60">${r.total}<small>/60</small></div>
          ${scoreBars(r)}
        </div>
      </div>
    </section>
    <section>
      <div class="wrap wrap-narrow">
        <h2>Your three highest-impact priorities</h2>
        <ol class="audit-prio">${prio}</ol>
      </div>
    </section>
    <section class="section-alt">
      <div class="wrap wrap-narrow">
        <h2>Area by area</h2>
        ${areaBlocks}
        <p class="audit-meta" style="margin-top:20px">Some things can't be judged by an automated check — like how active your social profiles are, your Google Business Profile, how your brand looks next to competitors, and the day-to-day workflows behind your business. We'll go through those with you on a call.</p>
      </div>
    </section>
    <section class="cta-band">
      <div class="wrap inner">
        <div>
          <h2>Want help with these priorities?</h2>
          <p>Book a free 20-minute call on WhatsApp and we'll walk through your report together. The priorities are yours to keep, whether or not you work with us.</p>
        </div>
        <div class="btn-row">
          <a class="btn whatsapp" href="${esc(bookWaUrl(lead.business))}" target="_blank" rel="noopener"><span>Book a call on WhatsApp</span></a>
          <a class="btn secondary" href="mailto:${esc(replyTo)}?subject=${encodeURIComponent('My digital audit' + (lead.business ? ' — ' + lead.business : ''))}"><span>Reply by email</span></a>
        </div>
      </div>
    </section>
  </main>
  <footer class="audit-foot"><div class="wrap">
    <p>${esc(ABOUT)}</p>
    <p>How we scored: automated checks of your public website and domain on ${esc(date)}. Each area is scored 0–10 from fixed, transparent rules (listed under “What we checked”); checks we couldn't run are marked “–” and left out of the score rather than guessed.</p>
    <p><a href="/">agency.showmeworld.app</a> · <a href="/privacy/">Privacy</a></p>
  </div></footer>
</body>
</html>`;
}

// ---- Emails -----------------------------------------------------------------
const E = {
  wrap: 'margin:0;padding:0;background:#f4f1ec;',
  card: 'max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;color:#10243f;',
  head: 'background:#07111f;color:#ffffff;padding:22px 28px;font-size:20px;font-weight:bold;',
  body: 'padding:24px 28px;font-size:15px;line-height:1.6;',
  btn: 'display:inline-block;background:#f2654b;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:bold;',
  btn2: 'display:inline-block;background:#24bda4;color:#07111f;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:bold;',
  muted: 'color:#5b6b80;font-size:13px;',
  td: 'padding:6px 8px;border-bottom:1px solid #eee;vertical-align:top;font-size:14px;'
};
function emailShell(inner, pre = '') {
  return `<!doctype html><html><body style="${E.wrap}"><div style="display:none;max-height:0;overflow:hidden">${esc(pre)}</div><div style="padding:20px 10px"><div style="${E.card}"><div style="${E.head}">ShowMe<span style="color:#f2654b">.</span> <span style="font-size:13px;font-weight:normal;opacity:.8">Digital Agency</span></div><div style="${E.body}">${inner}</div></div></div></body></html>`;
}
function scoreTable(result) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:8px 0 16px">${AREAS.map(a => {
    const s = result.areas[a.key].score;
    const col = s >= 7.5 ? '#1c9c87' : s >= 5 ? '#b9861c' : '#d94d36';
    return `<tr><td style="${E.td}">${esc(a.label)}</td><td style="${E.td}text-align:right;font-weight:bold;color:${col}">${s}/10</td></tr>`;
  }).join('')}<tr><td style="${E.td}font-weight:bold">Overall</td><td style="${E.td}text-align:right;font-weight:bold">${result.total}/60</td></tr></table>`;
}

export function leadReportEmail(audit, lead) {
  const first = String(lead.name || '').trim().split(/\s+/)[0] || 'there';
  const link = ORIGIN + '/audit/' + audit.token + '/';
  const c = audit.copy;
  const prio = (c.priorities || []).map((p, i) => `<p style="margin:0 0 12px"><strong>${i + 1}. ${esc(p.title)}</strong><br>${esc(p.why)}<br><span style="color:#173657">Next step: ${esc(p.action)}</span></p>`).join('');
  const html = emailShell(`
    <p>Hi ${esc(first)},</p>
    <p>Thanks for requesting a free digital audit${lead.business ? ' for <strong>' + esc(lead.business) + '</strong>' : ''}. Here is your report.</p>
    <p>${esc(c.summary || '')}</p>
    ${scoreTable(audit.result)}
    <h3 style="margin:18px 0 10px;font-size:17px">Your three highest-impact priorities</h3>
    ${prio}
    <p style="margin:22px 0"><a href="${esc(link)}" style="${E.btn}">View your full report</a></p>
    <p>If you'd like help with any of these, book a free 20-minute call with me on WhatsApp — the priorities are yours to keep either way.</p>
    <p style="margin:18px 0"><a href="${esc(bookWaUrl(lead.business))}" style="${E.btn2}">Book a call on WhatsApp</a></p>
    <p>Or simply reply to this email.</p>
    <p>Josh Abbey<br>Founder, ShowMe Digital Agency</p>
    <p style="${E.muted}">${esc(ABOUT)}</p>`, 'Your free digital audit: ' + audit.result.total + '/60 and three priorities');
  const text = `Hi ${first},\n\nThanks for requesting a free digital audit${lead.business ? ' for ' + lead.business : ''}. Here is your report.\n\n${c.summary || ''}\n\n` +
    AREAS.map(a => `${a.label}: ${audit.result.areas[a.key].score}/10`).join('\n') + `\nOverall: ${audit.result.total}/60\n\nYour three highest-impact priorities:\n` +
    (c.priorities || []).map((p, i) => `${i + 1}. ${p.title}\n   ${p.why}\n   Next step: ${p.action}`).join('\n') +
    `\n\nFull report: ${link}\n\nBook a free 20-minute call on WhatsApp: ${bookWaUrl(lead.business)}\nOr just reply to this email.\n\nJosh Abbey\nFounder, ShowMe Digital Agency\n\n${ABOUT}\n`;
  return { subject: `Your free digital audit${lead.business ? ': ' + lead.business : ''} (${audit.result.total}/60)`, html, text };
}

export function followupEmail(audit, lead) {
  const first = String(lead.name || '').trim().split(/\s+/)[0] || 'there';
  const link = ORIGIN + '/audit/' + audit.token + '/';
  const p1 = audit.copy?.priorities?.[0];
  const html = emailShell(`
    <p>Hi ${esc(first)},</p>
    <p>Just checking you received your free digital audit${lead.business ? ' for ' + esc(lead.business) : ''}. ${p1 ? 'The first priority we flagged was <strong>' + esc(p1.title.toLowerCase()) + '</strong>.' : ''}</p>
    <p>Happy to talk it through on a free 20-minute call if useful — no obligation.</p>
    <p style="margin:18px 0"><a href="${esc(bookWaUrl(lead.business))}" style="${E.btn2}">Book a call on WhatsApp</a> &nbsp; <a href="${esc(link)}" style="color:#d94d36">View your report</a></p>
    <p>Josh Abbey<br>Founder, ShowMe Digital Agency</p>`, 'Quick follow-up on your digital audit');
  const text = `Hi ${first},\n\nJust checking you received your free digital audit${lead.business ? ' for ' + lead.business : ''}.${p1 ? ' The first priority we flagged was: ' + p1.title + '.' : ''}\n\nHappy to talk it through on a free 20-minute call if useful.\nBook on WhatsApp: ${bookWaUrl(lead.business)}\nYour report: ${link}\n\nJosh Abbey\nFounder, ShowMe Digital Agency\n`;
  return { subject: 'Following up on your digital audit', html, text };
}

export function ackEmail(lead) {
  const first = String(lead.name || '').trim().split(/\s+/)[0] || 'there';
  const html = emailShell(`<p>Hi ${esc(first)},</p><p>Thanks for getting in touch with ShowMe Digital Agency — we've received your ${lead.website ? 'audit request' : 'enquiry'} and will reply within one business day.</p><p>If it's urgent, message us on WhatsApp: <a href="${BOOK_WA}">+1 336 457 2361</a>.</p><p>Josh Abbey<br>Founder, ShowMe Digital Agency</p>`, 'We received your request');
  const text = `Hi ${first},\n\nThanks for getting in touch with ShowMe Digital Agency — we've received your ${lead.website ? 'audit request' : 'enquiry'} and will reply within one business day.\n\nUrgent? WhatsApp: ${BOOK_WA}\n\nJosh Abbey\nFounder, ShowMe Digital Agency\n`;
  return { subject: 'We received your request — ShowMe Digital Agency', html, text };
}

export function alertEmail(lead, audit) {
  const wa = waNumber(lead.phone);
  const review = ORIGIN + '/admin/audits/' + leadSlug(lead.id) + '/';
  const rows = [
    ['Name', lead.name], ['Business', lead.business], ['Email', lead.email], ['Phone / WhatsApp', lead.phone], ['Website', lead.website],
    ['Need', lead.need], ['Customers find them via', lead.found_via], ['Biggest time-waster', lead.time_waster], ['Message', lead.message],
    ['Page', lead.page], ['Received', fmtDateTime(lead.created_at)], ['Lead ID', lead.id]
  ].filter(r => r[1]);
  const waLink = wa.digits ? 'https://wa.me/' + wa.digits + '?text=' + encodeURIComponent(`Hi ${String(lead.name || '').split(' ')[0]}, this is Josh from ShowMe Digital Agency — thanks for your request${lead.business ? ' for ' + lead.business : ''}.`) : '';
  let auditBlock = '';
  if (audit && audit.result) {
    auditBlock = `<h3 style="margin:20px 0 6px;font-size:17px">Draft audit: ${audit.result.total}/60</h3>${scoreTable(audit.result)}
      <p style="margin:0 0 6px"><strong>Draft priorities:</strong></p><ol style="margin:0 0 12px;padding-left:20px">${(audit.copy?.priorities || []).map(p => `<li>${esc(p.title)}</li>`).join('')}</ol>
      <p style="${E.muted}">Nothing is sent to the lead until you click Approve &amp; send.</p>`;
  } else if (lead.website) {
    auditBlock = `<p><strong>Audit:</strong> the automated scan is still running (or failed); it will appear on the review page shortly.</p>`;
  } else {
    auditBlock = `<p><strong>Audit:</strong> no website given, so no automated scan. You can run one from the review page if you find their site.</p>`;
  }
  const html = emailShell(`
    <p style="margin-top:0"><strong>New ${lead.website ? 'free audit request' : 'lead'}${lead.test ? ' (TEST)' : ''}</strong> from the website.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">${rows.map(r => `<tr><td style="${E.td}width:34%;color:#5b6b80">${esc(r[0])}</td><td style="${E.td}">${esc(r[1]).replace(/\n/g, '<br>')}</td></tr>`).join('')}</table>
    <p style="margin:18px 0 8px">${waLink ? `<a href="${esc(waLink)}" style="${E.btn2}">WhatsApp ${esc(lead.name || 'lead')}</a> ` : ''}<a href="mailto:${esc(lead.email)}" style="color:#d94d36;margin-left:8px">Email ${esc(lead.email)}</a></p>
    ${wa.assumed ? `<p style="${E.muted}">WhatsApp link assumes a Ghana (+233) number.</p>` : ''}
    ${auditBlock}
    <p style="margin:18px 0"><a href="${esc(review)}" style="${E.btn}">Review &amp; approve</a></p>
    <p style="${E.muted}">Admin: ${esc(ORIGIN)}/admin/audits/ (sign in with your admin key)</p>`, `${lead.name}${lead.business ? ' — ' + lead.business : ''}`);
  const text = `New ${lead.website ? 'free audit request' : 'lead'}${lead.test ? ' (TEST)' : ''}\n\n` + rows.map(r => `${r[0]}: ${r[1]}`).join('\n') +
    (waLink ? `\n\nWhatsApp: ${waLink}` : '') + `\nEmail: ${lead.email}\n` +
    (audit && audit.result ? `\nDraft audit: ${audit.result.total}/60\n` + AREAS.map(a => `  ${a.label}: ${audit.result.areas[a.key].score}/10`).join('\n') + '\n' : '') +
    `\nReview & approve: ${review}\n`;
  const subj = `${lead.test ? '[TEST] ' : ''}New ${lead.website ? 'audit request' : 'lead'}: ${lead.name}${lead.business ? ' — ' + lead.business : ''}${audit && audit.result ? ' (draft ' + audit.result.total + '/60)' : ''}`;
  return { subject: subj.slice(0, 200), html, text };
}

export function draftReadyEmail(lead, audit) {
  const review = ORIGIN + '/admin/audits/' + leadSlug(lead.id) + '/';
  const html = emailShell(`<p style="margin-top:0"><strong>Audit draft ready</strong> for ${esc(lead.name)}${lead.business ? ' — ' + esc(lead.business) : ''}: ${audit.result.total}/60.</p>${scoreTable(audit.result)}<p><a href="${esc(review)}" style="${E.btn}">Review &amp; approve</a></p>`, 'Audit draft ready');
  return { subject: `${lead.test ? '[TEST] ' : ''}Audit draft ready: ${lead.business || lead.name} (${audit.result.total}/60)`, html, text: `Audit draft ready for ${lead.name}: ${audit.result.total}/60\nReview: ${review}\n` };
}

// ---- Admin ------------------------------------------------------------------
const ADMIN_CSS = `
.adm{padding:28px 0 60px}.adm h1{font-size:30px;margin:0 0 6px}.adm table{width:100%;border-collapse:collapse;font-size:14px;margin-top:18px}
.adm th,.adm td{padding:10px 8px;border-bottom:1px solid var(--night-line);text-align:left;vertical-align:top}.adm th{color:var(--text-muted);font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:.06em}
.adm a{color:var(--text)}.adm .muted{color:var(--text-muted)}
.st{display:inline-block;padding:2px 9px;border-radius:99px;font-size:12px;font-weight:700;background:var(--surface-2)}
.st-draft{background:var(--gold);color:#111}.st-sent{background:var(--mint);color:#07111f}.st-discarded{opacity:.6}.st-error{background:var(--coral);color:#fff}.st-scanning{background:var(--ink2)}
.adm-grid{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:28px;margin-top:20px}@media(max-width:960px){.adm-grid{grid-template-columns:1fr}}
.adm-card{border:1px solid var(--night-line);border-radius:14px;background:var(--surface);padding:18px;margin-bottom:16px}
.adm-card h2{font-size:18px;margin:0 0 10px}.adm label{display:block;font-size:13px;color:var(--text-muted);margin:10px 0 4px}
.adm input[type=text],.adm textarea{width:100%;background:var(--night-2);color:var(--text);border:1px solid var(--night-line);border-radius:8px;padding:9px 10px;font:inherit;font-size:14px}
.adm textarea{min-height:76px;resize:vertical}.adm .row{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}
.adm button{font:inherit;font-weight:700;border:0;border-radius:10px;padding:11px 16px;cursor:pointer}
.b-save{background:var(--surface-2);color:var(--text);border:1px solid var(--night-line)!important}.b-send{background:var(--coral);color:#fff}.b-discard{background:transparent;color:var(--text-muted);border:1px solid var(--night-line)!important}
.kv{display:grid;grid-template-columns:120px 1fr;gap:4px 10px;font-size:14px}.kv dt{color:var(--text-muted)}.kv dd{margin:0;word-break:break-word}
.flash{background:var(--mint);color:#07111f;padding:10px 14px;border-radius:10px;font-weight:700;margin-top:12px}
.flash.err{background:var(--coral);color:#fff}
`;

function adminShell(title, inner) {
  return `${docHead(title, ADMIN_CSS)}
<body>
  ${topBar('<span class="muted" style="font-size:13px">Admin · Free audits</span>')}
  <main id="main" class="adm"><div class="wrap">${inner}</div></main>
</body></html>`;
}

export function adminLogin(error) {
  return adminShell('Admin sign-in | ShowMe', `<h1>Admin sign-in</h1>${error ? '<p class="flash err">That key was not accepted.</p>' : ''}
    <form method="post" action="/admin/login" class="adm-card" style="max-width:480px;margin-top:18px"><label for="k">Admin key</label><input id="k" type="text" name="key" autocomplete="off" required><div class="row"><button class="b-send" type="submit">Sign in</button></div></form>`);
}

export function adminList(rows, { flash, cursorNext } = {}) {
  const tr = rows.map(r => {
    const st = r.audit ? r.audit.status : (r.lead.website ? 'pending' : 'no website');
    return `<tr>
      <td class="muted">${esc(fmtDateTime(r.lead.created_at))}</td>
      <td><a href="/admin/audits/${esc(leadSlug(r.lead.id))}/"><strong>${esc(r.lead.name || '(no name)')}</strong></a>${r.lead.test ? ' <span class="st">TEST</span>' : ''}<br><span class="muted">${esc(r.lead.business || '')}</span></td>
      <td>${esc(r.lead.email || '')}<br><span class="muted">${esc(r.lead.phone || '')}</span></td>
      <td>${r.lead.website ? esc(String(r.lead.website).replace(/^https?:\/\//, '').slice(0, 40)) : '<span class="muted">—</span>'}</td>
      <td><span class="st st-${esc(String(st).split(' ')[0])}">${esc(st)}</span></td>
      <td>${r.audit && r.audit.result ? '<strong>' + r.audit.result.total + '</strong>/60' : '<span class="muted">—</span>'}</td>
    </tr>`;
  }).join('');
  return adminShell('Free audits | ShowMe admin', `<h1>Leads &amp; audits</h1><p class="muted">Most recent first. Nothing is emailed to a lead until you open an audit and click Approve &amp; send.</p>
    ${flash ? `<p class="flash">${esc(flash)}</p>` : ''}
    <div class="table-wrap"><table><thead><tr><th>Received</th><th>Lead</th><th>Contact</th><th>Website</th><th>Audit</th><th>Score</th></tr></thead><tbody>${tr || '<tr><td colspan="6" class="muted">No leads yet.</td></tr>'}</tbody></table></div>
    ${cursorNext ? `<p style="margin-top:16px"><a href="/admin/audits/?cursor=${encodeURIComponent(cursorNext)}">Older leads →</a></p>` : ''}`);
}

export function adminReview(lead, audit, { flash, error, config = {} } = {}) {
  const slug = leadSlug(lead.id);
  const wa = waNumber(lead.phone);
  const kv = [['Email', lead.email], ['Phone', lead.phone], ['Website', lead.website], ['Need', lead.need], ['Found via', lead.found_via], ['Time-waster', lead.time_waster], ['Message', lead.message], ['Received', fmtDateTime(lead.created_at)], ['Lead ID', lead.id]]
    .filter(r => r[1]).map(r => `<dt>${esc(r[0])}</dt><dd>${esc(r[1])}</dd>`).join('');
  let main = '';
  if (audit && audit.result) {
    const c = audit.copy || {};
    const locked = audit.status === 'sent' || audit.status === 'discarded';
    const dis = locked ? ' disabled' : '';
    const prioFields = [0, 1, 2].map(i => {
      const p = (c.priorities || [])[i] || {};
      return `<div class="adm-card"><h2>Priority ${i + 1} <span class="muted" style="font-size:13px">(${esc((AREAS.find(a => a.key === p.area) || {}).label || '')})</span></h2>
        <input type="hidden" name="p${i}_area" value="${esc(p.area || '')}">
        <label for="p${i}t">Title</label><input id="p${i}t" type="text" name="p${i}_title" value="${esc(p.title || '')}"${dis}>
        <label for="p${i}w">What we found / why it matters</label><textarea id="p${i}w" name="p${i}_why"${dis}>${esc(p.why || '')}</textarea>
        <label for="p${i}a">Next step</label><textarea id="p${i}a" name="p${i}_action"${dis}>${esc(p.action || '')}</textarea></div>`;
    }).join('');
    const recFields = AREAS.map(a => `<label for="r_${a.key}">${esc(a.label)} — ${audit.result.areas[a.key].score}/10</label><textarea id="r_${a.key}" name="rec_${a.key}"${dis}>${esc(c.recommendations?.[a.key] || '')}</textarea>`).join('');
    const manualList = AREAS.flatMap(a => audit.result.areas[a.key].manual.map(m => `<li><strong>${esc(a.label)}:</strong> ${esc(m)}</li>`)).join('');
    const ruleDetail = AREAS.map(a => `<details style="margin-top:8px"><summary>${esc(a.label)}: ${audit.result.areas[a.key].score}/10 (${audit.result.areas[a.key].earned}/${audit.result.areas[a.key].max} pts)</summary>${checksList(audit.result.areas[a.key].rules)}</details>`).join('');
    main = `
      <div class="adm-card"><h2>Draft score: ${audit.result.total}/60 <span class="st st-${esc(audit.status)}">${esc(audit.status)}</span></h2>
        ${scoreBars(audit.result)}
        <p class="muted" style="font-size:13px;margin-top:12px">Copy source: ${esc(audit.copy_source || 'template')}${audit.ai?.error ? ' · AI: ' + esc(audit.ai.error) : ''}${audit.ai?.model ? ' · ' + esc(audit.ai.model) : ''} · scanned ${esc(fmtDateTime(audit.scan?.scannedAt))} in ${Math.round((audit.scan?.durationMs || 0) / 100) / 10}s${audit.sent_at ? ' · sent ' + esc(fmtDateTime(audit.sent_at)) : ''}</p>
        <p style="margin-top:10px"><a class="btn secondary" href="/audit/${esc(audit.token)}/" target="_blank" rel="noopener"><span>Preview report page</span></a></p>
      </div>
      <form method="post" action="/admin/audits/${esc(slug)}/save">
        <div class="adm-card"><h2>Summary</h2><textarea name="summary" style="min-height:96px"${dis}>${esc(c.summary || '')}</textarea></div>
        ${prioFields}
        <div class="adm-card"><h2>Area recommendations</h2>${recFields}</div>
        ${locked ? '' : `<div class="row"><button class="b-save" type="submit">Save edits</button>
          <button class="b-send" type="submit" formaction="/admin/audits/${esc(slug)}/approve" onclick="return confirm('Email this report to ${esc(lead.email).replace(/'/g, '')} now?')">Approve &amp; send to ${esc(lead.email)}</button>
          <button class="b-discard" type="submit" formaction="/admin/audits/${esc(slug)}/discard" onclick="return confirm('Discard this audit? Nothing will be sent.')">Discard</button></div>`}
      </form>
      <div class="adm-card" style="margin-top:16px"><h2>Needs a human look</h2><ul style="margin:0;padding-left:18px;color:var(--text-muted);font-size:14px;display:grid;gap:6px">${manualList}</ul></div>
      <div class="adm-card"><h2>Scoring detail</h2>${ruleDetail}</div>`;
  } else if (audit && audit.status === 'error') {
    main = `<div class="adm-card"><h2>Scan failed</h2><p class="muted">${esc(audit.error || 'Unknown error')}</p></div>`;
  } else if (audit) {
    main = `<div class="adm-card"><h2>Scan in progress</h2><p class="muted">Started ${esc(fmtDateTime(audit.created_at))}. Refresh in a minute; the scheduled job finishes any scan that runs long.</p></div>`;
  } else {
    main = `<div class="adm-card"><h2>No audit yet</h2><p class="muted">${lead.website ? 'The scan has not started yet; it will run within 10 minutes.' : 'This lead did not give a website.'}</p></div>`;
  }
  const rescan = `<form method="post" action="/admin/audits/${esc(slug)}/rescan" class="adm-card"><h2>${audit ? 'Re-run scan' : 'Run a scan'}</h2>
    <label for="u">Website</label><input id="u" type="text" name="url" value="${esc(lead.website || audit?.scan?.url || '')}" placeholder="example.com">
    <p class="muted" style="font-size:12px">Replaces the draft scores and copy${audit && audit.status === 'sent' ? ' (disabled: already sent)' : ''}.</p>
    <div class="row"><button class="b-save" type="submit"${audit && audit.status === 'sent' ? ' disabled' : ''}>Scan now</button></div></form>`;
  return adminShell('Review: ' + (lead.name || lead.id) + ' | ShowMe admin', `
    <p><a href="/admin/audits/" class="muted">← All leads</a></p>
    <h1>${esc(lead.name || '(no name)')}${lead.test ? ' <span class="st">TEST</span>' : ''}</h1><p class="muted">${esc(lead.business || '')}</p>
    ${flash ? `<p class="flash">${esc(flash)}</p>` : ''}${error ? `<p class="flash err">${esc(error)}</p>` : ''}
    <div class="adm-grid"><div>${main}</div>
      <aside><div class="adm-card"><h2>Lead</h2><dl class="kv">${kv}</dl>
        <div class="row">${wa.digits ? `<a class="btn whatsapp" href="https://wa.me/${wa.digits}" target="_blank" rel="noopener"><span>WhatsApp</span></a>` : ''}<a class="btn secondary" href="mailto:${esc(lead.email)}"><span>Email</span></a></div></div>
        ${rescan}
        <div class="adm-card"><h2>Settings</h2><dl class="kv"><dt>Auto-ack</dt><dd>${esc(config.AUTO_ACK || 'off')}</dd><dt>Follow-up</dt><dd>${esc(config.FOLLOWUP || 'off')}${audit?.followup ? ' · ' + esc(audit.followup.status) + ' (due ' + esc(fmtDateTime(audit.followup.due_at)) + ')' : ''}</dd><dt>Alerts to</dt><dd>${esc(config.ALERT_TO || '')}</dd></dl></div>
      </aside></div>`);
}
