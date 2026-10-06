// =============================================================================
// Free Digital Audit pipeline: lead alert -> scan -> draft -> founder approval
// -> send -> optional follow-up. All state lives in the LEADS KV namespace
// under NEW key prefixes only (existing lead:/stats: keys are never touched,
// except that a new lead's own record is written once at creation).
//
//   audit:<leadId>                 audit record (scan, scores, copy, status)
//   audittoken:<token>             -> leadId (for /audit/<token>/)
//   audit:pending:<leadId>         job marker: alert and/or scan still to do (TTL 7d)
//   audit:pending:followup:<leadId> follow-up job after an approved send (TTL 30d)
//   alert:<leadId>                 record of the founder alert email
//   auditcount:<YYYY-MM-DD>        daily scan counter (abuse guard)
// =============================================================================
import { scanSite } from './scan.js';
import { scoreAudit, templatedPriorities, templatedRecommendations, templatedSummary } from './score.js';
import { phraseWithAi } from './ai.js';
import { alertEmail, leadReportEmail, followupEmail, ackEmail, draftReadyEmail } from './render.js';
import { randomToken, normaliseUrl, withTimeout } from './util.js';

export const PENDING = 'audit:pending:';
export const PENDING_FOLLOWUP = 'audit:pending:followup:';
const DAY = 86400;

export function config(env) {
  return {
    ALERT_TO: env.ALERT_TO || 'info@showmeworld.app',
    MAIL_FROM: env.MAIL_FROM || 'ShowMe Agency <info@showmeworld.app>',
    REPLY_TO: env.REPLY_TO || 'info@showmeworld.app',
    AUTO_ACK: (env.AUTO_ACK || 'off').toLowerCase(),
    FOLLOWUP: (env.FOLLOWUP || 'off').toLowerCase(),
    MAX_AUDITS_PER_DAY: parseInt(env.MAX_AUDITS_PER_DAY || '40', 10) || 40
  };
}

// ---- Email ------------------------------------------------------------------
export async function sendEmail(env, { to, subject, html, text, replyTo, idempotencyKey, tags }) {
  if (!env.RESEND_API_KEY) return { ok: false, error: 'RESEND_API_KEY not set' };
  const cfg = config(env);
  const headers = { Authorization: 'Bearer ' + env.RESEND_API_KEY, 'Content-Type': 'application/json' };
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey.slice(0, 256);
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers,
      body: JSON.stringify({ from: cfg.MAIL_FROM, to: [to], subject, html, text, reply_to: replyTo || cfg.REPLY_TO, tags })
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: (body && (body.message || body.name)) || 'HTTP ' + res.status };
    return { ok: true, id: body.id };
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err).slice(0, 200) };
  }
}

// ---- KV helpers -------------------------------------------------------------
async function getJson(env, key) {
  try { const v = await env.LEADS.get(key); return v ? JSON.parse(v) : null; } catch { return null; }
}
export async function getLead(env, leadId) { return getJson(env, leadId); }
export async function getAudit(env, leadId) { return getJson(env, 'audit:' + leadId); }
export async function putAudit(env, audit) {
  audit.updated_at = new Date().toISOString();
  await env.LEADS.put('audit:' + audit.leadId, JSON.stringify(audit), {
    metadata: { s: audit.status, t: audit.result ? audit.result.total : null }
  });
}

async function bumpDailyCount(env) {
  const key = 'auditcount:' + new Date().toISOString().slice(0, 10);
  const n = (parseInt((await env.LEADS.get(key)) || '0', 10) || 0) + 1;
  await env.LEADS.put(key, String(n), { expirationTtl: 3 * DAY });
  return n;
}

// ---- Build an audit ---------------------------------------------------------
/** Scan + score + copy. mode 'inline' keeps within the waitUntil budget. */
export async function buildAudit(env, lead, url, { mode = 'cron', existing = null, useAi = true } = {}) {
  const inline = mode === 'inline';
  const audit = existing && existing.status !== 'sent' ? existing : {
    leadId: lead.id, token: randomToken(24), created_at: new Date().toISOString(), status: 'scanning'
  };
  if (!existing) {
    await putAudit(env, audit);
    await env.LEADS.put('audittoken:' + audit.token, lead.id);
  }
  audit.status = 'scanning';
  try {
    const scan = await scanSite(url, {
      business: lead.business, psiKey: env.PSI_API_KEY, placesKey: env.GOOGLE_PLACES_API_KEY,
      psiTimeoutMs: inline ? 15000 : 40000
    });
    if (scan.status === 'invalid_url') {
      audit.status = 'error'; audit.error = 'Website URL is not valid: ' + scan.input; audit.scan = scan;
      await putAudit(env, audit);
      return audit;
    }
    const result = scoreAudit(scan, lead);
    audit.scan = scan;
    audit.url = scan.url;
    audit.result = result;
    audit.copy = { summary: templatedSummary(result, lead), priorities: templatedPriorities(result), recommendations: templatedRecommendations(result) };
    audit.copy_source = 'template';
    audit.status = 'draft';
    audit.needs_ai = !!useAi;
    audit.psi_incomplete = scan.website?.psi?.mobile?.status === 'timeout';
    delete audit.error;
    await putAudit(env, audit);
  } catch (err) {
    audit.status = 'error';
    audit.error = String((err && err.message) || err).slice(0, 300);
    await putAudit(env, audit);
  }
  return audit;
}

export async function applyAi(env, audit, lead, timeoutMs) {
  if (!audit || !audit.result || audit.status !== 'draft' || audit.copy_source === 'edited') return audit;
  const ai = await phraseWithAi(env, audit.result, lead, timeoutMs);
  audit.needs_ai = false;
  if (ai.error) {
    audit.ai = { error: ai.error, raw: ai.raw || null, at: new Date().toISOString() };
  } else {
    audit.copy.summary = ai.summary || audit.copy.summary;
    audit.copy.priorities = ai.priorities;
    audit.copy_source = 'ai';
    audit.ai = { model: ai.model, at: new Date().toISOString() };
  }
  // Re-read so we never clobber edits/approval that happened meanwhile.
  const fresh = await getAudit(env, audit.leadId);
  if (fresh && (fresh.status !== 'draft' || fresh.copy_source === 'edited')) return fresh;
  await putAudit(env, audit);
  return audit;
}

// ---- Lead processing --------------------------------------------------------
export async function enqueueLead(env, lead) {
  const job = { leadId: lead.id, created_at: lead.created_at, attempts: 0, needs_alert: true, needs_scan: !!normaliseUrl(lead.website), locked_until: Date.now() + 120000 };
  await env.LEADS.put(PENDING + lead.id, JSON.stringify(job), { expirationTtl: 7 * DAY, metadata: { lu: job.locked_until } });
  return job;
}

async function sendAlert(env, lead, audit) {
  const cfg = config(env);
  const mail = alertEmail(lead, audit && audit.result ? audit : null);
  const r = await sendEmail(env, { to: cfg.ALERT_TO, ...mail, replyTo: cfg.REPLY_TO, idempotencyKey: 'alert-' + lead.id, tags: [{ name: 'type', value: 'lead_alert' }] });
  await env.LEADS.put('alert:' + lead.id, JSON.stringify({ sent_at: new Date().toISOString(), ok: r.ok, id: r.id || null, error: r.error || null, with_scores: !!(audit && audit.result), to: cfg.ALERT_TO }));
  return r;
}

/** Do whatever is outstanding for one lead. Never throws. */
export async function processLead(env, leadId, mode = 'inline') {
  const log = { leadId, mode, steps: [] };
  try {
    const lead = await getLead(env, leadId);
    if (!lead) { log.steps.push('lead_missing'); await env.LEADS.delete(PENDING + leadId); return log; }
    const job = (await getJson(env, PENDING + leadId)) || { leadId, needs_alert: false, needs_scan: false, attempts: 0 };
    const cfg = config(env);
    job.attempts = (job.attempts || 0) + 1;

    let audit = await getAudit(env, leadId);
    const url = normaliseUrl(lead.website);
    const startedAt = Date.now();

    // Optional acknowledgement to the lead (off by default).
    if (mode === 'inline' && job.attempts === 1 && cfg.AUTO_ACK === 'on' && !lead.test) {
      const r = await sendEmail(env, { to: lead.email, ...ackEmail(lead), idempotencyKey: 'ack-' + leadId, tags: [{ name: 'type', value: 'lead_ack' }] });
      log.steps.push('ack:' + (r.ok ? 'sent' : r.error));
    }

    const prevAlert = await getJson(env, 'alert:' + leadId);
    const alertDone = !!(prevAlert && prevAlert.ok);
    // Scan first (bounded) so the founder alert can carry the draft scores.
    if (job.needs_scan && url && (!audit || audit.status === 'scanning' || audit.status === 'error')) {
      const count = await bumpDailyCount(env);
      if (count > cfg.MAX_AUDITS_PER_DAY) {
        log.steps.push('scan_skipped_daily_cap');
      } else {
        const building = buildAudit(env, lead, url, { mode, existing: audit });
        // Inline (waitUntil) runs must leave time to send the alert; a slow scan
        // keeps running in the background and the cron finishes anything left.
        const built = mode === 'inline' ? await withTimeout(building, 20000, null) : await building;
        if (built) audit = built;
        log.steps.push('scan:' + (built ? audit.status : 'still_running'));
      }
    }
    if (job.needs_alert && !alertDone) {
      const r = await sendAlert(env, lead, audit);
      log.steps.push('alert:' + (r.ok ? 'sent' : r.error));
      if (r.ok) job.needs_alert = false;
    } else if (alertDone && audit && audit.status === 'draft' && job.needs_scan) {
      // Alert went out before the scan finished: tell the founder the draft is ready.
      const prev = prevAlert;
      if (prev && !prev.with_scores && !prev.draft_ready_sent) {
        const r = await sendEmail(env, { to: cfg.ALERT_TO, ...draftReadyEmail(lead, audit), idempotencyKey: 'draft-' + leadId, tags: [{ name: 'type', value: 'draft_ready' }] });
        prev.draft_ready_sent = r.ok ? new Date().toISOString() : null;
        await env.LEADS.put('alert:' + leadId, JSON.stringify(prev));
        log.steps.push('draft_ready:' + (r.ok ? 'sent' : r.error));
      }
    }
    if (audit && audit.status === 'draft') job.needs_scan = false;

    // AI phrasing last (inline budget permitting; otherwise the cron does it).
    if (audit && audit.status === 'draft' && audit.needs_ai) {
      const left = mode === 'inline' ? 28000 - (Date.now() - startedAt) : 30000;
      if (left > 4000) {
        audit = await applyAi(env, audit, lead, Math.min(left - 1000, 20000));
        log.steps.push('ai:' + (audit.ai?.error || 'ok'));
      }
    }

    const done = !job.needs_alert && !job.needs_scan && !(audit && audit.status === 'draft' && audit.needs_ai);
    const gaveUp = job.attempts >= 4;
    if (done || gaveUp || (!url && !job.needs_alert)) {
      await env.LEADS.delete(PENDING + leadId);
      log.steps.push(done ? 'job_done' : 'job_gave_up');
    } else {
      job.locked_until = 0;
      await env.LEADS.put(PENDING + leadId, JSON.stringify(job), { expirationTtl: 7 * DAY, metadata: { lu: 0 } });
      log.steps.push('job_kept');
    }
  } catch (err) {
    log.error = String((err && err.message) || err).slice(0, 300);
  }
  return log;
}

// ---- Approval + send --------------------------------------------------------
export async function approveAndSend(env, leadId) {
  const lead = await getLead(env, leadId);
  const audit = await getAudit(env, leadId);
  if (!lead || !audit) return { ok: false, error: 'Lead or audit not found' };
  if (audit.status === 'sent') return { ok: false, error: 'Already sent on ' + audit.sent_at };
  if (audit.status !== 'draft' || !audit.result) return { ok: false, error: 'Audit is not a draft (status: ' + audit.status + ')' };
  const cfg = config(env);
  // Claim the send first so a double-click cannot send twice.
  audit.status = 'sending';
  await putAudit(env, audit);
  const mail = leadReportEmail(audit, lead);
  const r = await sendEmail(env, { to: lead.email, ...mail, replyTo: cfg.REPLY_TO, idempotencyKey: 'report-' + leadId + '-' + audit.token, tags: [{ name: 'type', value: 'audit_report' }] });
  if (!r.ok) {
    audit.status = 'draft';
    audit.last_send_error = r.error;
    await putAudit(env, audit);
    return { ok: false, error: 'Send failed: ' + r.error };
  }
  audit.status = 'sent';
  audit.sent_at = new Date().toISOString();
  audit.sent_email_id = r.id;
  audit.sent_to = lead.email;
  const due = Date.now() + 3 * DAY * 1000;
  audit.followup = { status: 'scheduled', due_at: new Date(due).toISOString(), gated_by: 'FOLLOWUP var' };
  await putAudit(env, audit);
  await env.LEADS.put(PENDING_FOLLOWUP + leadId, JSON.stringify({ leadId, due }), { expirationTtl: 30 * DAY, metadata: { due } });
  return { ok: true, id: r.id };
}

export async function discardAudit(env, leadId) {
  const audit = await getAudit(env, leadId);
  if (!audit) return { ok: false, error: 'No audit' };
  if (audit.status === 'sent') return { ok: false, error: 'Already sent' };
  audit.status = 'discarded';
  audit.discarded_at = new Date().toISOString();
  await putAudit(env, audit);
  await env.LEADS.delete(PENDING + leadId);
  return { ok: true };
}

// ---- Scheduled job ----------------------------------------------------------
export async function runScheduled(env) {
  const out = { processed: [], followups: [] };
  const cfg = config(env);
  const list = await env.LEADS.list({ prefix: PENDING, limit: 200 });
  const now = Date.now();
  let budget = 2; // scans per run (each can take ~40s)
  for (const k of list.keys) {
    if (k.name.startsWith(PENDING_FOLLOWUP)) {
      const due = k.metadata && k.metadata.due;
      if (cfg.FOLLOWUP !== 'on' || !due || due > now) continue;
      const leadId = k.name.slice(PENDING_FOLLOWUP.length);
      out.followups.push(await sendFollowup(env, leadId));
      continue;
    }
    if (budget <= 0) continue;
    const lu = (k.metadata && k.metadata.lu) || 0;
    if (lu > now) continue;
    const leadId = k.name.slice(PENDING.length);
    budget--;
    await env.LEADS.put(k.name, (await env.LEADS.get(k.name)) || JSON.stringify({ leadId }), { expirationTtl: 7 * DAY, metadata: { lu: now + 5 * 60000 } });
    out.processed.push(await processLead(env, leadId, 'cron'));
  }
  return out;
}

async function sendFollowup(env, leadId) {
  const audit = await getAudit(env, leadId);
  const lead = await getLead(env, leadId);
  if (!audit || !lead || audit.status !== 'sent' || !audit.followup || audit.followup.status !== 'scheduled') {
    await env.LEADS.delete(PENDING_FOLLOWUP + leadId);
    return { leadId, skipped: true };
  }
  const cfg = config(env);
  const r = await sendEmail(env, { to: lead.email, ...followupEmail(audit, lead), replyTo: cfg.REPLY_TO, idempotencyKey: 'followup-' + leadId, tags: [{ name: 'type', value: 'audit_followup' }] });
  if (r.ok) {
    audit.followup.status = 'sent';
    audit.followup.sent_at = new Date().toISOString();
    audit.followup.email_id = r.id;
    await putAudit(env, audit);
    await env.LEADS.delete(PENDING_FOLLOWUP + leadId);
  }
  return { leadId, ok: r.ok, error: r.error };
}
