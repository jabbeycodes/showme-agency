// ============================================================================
// Standalone pages for the repositioned site (2026-10). Every page returns a
// full HTML document string. Region differences use usOnly/ghOnly/byRegion
// (see render.mjs); placeholders awaiting Josh use tbc()/tbcBlock().
// ============================================================================
import { site, serviceBySlug, insights as ALL_INSIGHTS } from './data.mjs';
import { BUNDLES, PAYMENT } from './prices.mjs';
import {
  PILLARS, TIERS, TIER_MATRIX, BOUNDARIES, ADDONS, CLIENT_RESPONSIBILITIES, RESPONSE_ROWS, ONBOARDING,
  INDUSTRIES, GH_INDUSTRIES, JOURNEY, ENGAGEMENTS, INSIGHTS_US, INSIGHTS_GH
} from './content.mjs';
import {
  esc, url, page, breadcrumb, ctaBand, faqList, icon, tbc, tbcBlock, ghOnly, byRegion,
  orgLd, professionalServiceLd, breadcrumbLd, faqLd, serviceLd, founderPhoto
} from './render.mjs';
import { ghPrivacyBody, ghTermsBody } from './legal-gh.mjs';

const WA = 'https://wa.me/' + site.whatsappNumber;
const list = (items, cls = 'ticklist') => `<ul class="${cls}">${items.map(d => `<li>${esc(d)}</li>`).join('')}</ul>`;
export const HERO = {
  h1: 'Technology That Runs Your Business. Solutions That Power Its Growth.',
  sub: 'From managed IT and cloud infrastructure to AI automation, software development, and digital marketing, ShowMe Digital Agency helps ambitious businesses operate efficiently, reliably, and competitively.',
  positioning: 'Your Business. Our Technology Expertise. Unlimited Possibilities.',
  supporting: 'From running your systems day to day to accelerating your growth, ShowMe Digital Agency brings your IT, digital marketing, AI automation, and software together under one trusted partner.'
};

function pageHero({ crumbs, eyebrow, h1, lead, ctas = true, iconName }) {
  return `    <section class="page-hero">
      <div class="wrap${iconName ? ' page-hero-grid' : ''}">
        <div>
          ${breadcrumb(crumbs)}
          ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
          <h1>${esc(h1)}</h1>
          ${lead ? `<p class="lead">${lead}</p>` : ''}
          ${ctas ? `<div class="btn-row"><a class="btn" href="/contact/">Book a Technology Consultation</a><a class="btn secondary" href="/solutions/">Explore Our Solutions</a></div>` : ''}
        </div>
        ${iconName ? icon(iconName, 'page-hero-icon') : ''}
      </div>
    </section>`;
}

// Abstract geometric hero visual (no people, no currency, no place cues).
const HERO_SVG = `<svg class="hero-visual" viewBox="0 0 400 400" role="img" aria-label="Abstract diagram of connected business systems">
  <rect x="20" y="20" width="360" height="360" rx="28" fill="#fff" stroke="#dfe5ee"/>
  <g stroke="#c3ccd9" stroke-width="1.5" fill="none">
    <path d="M110 120L200 200L290 120M110 280L200 200L290 280M200 70V200M200 200V330"/>
    <circle cx="200" cy="200" r="118" stroke-dasharray="4 7"/>
  </g>
  <g fill="#fff" stroke="#0a58a8" stroke-width="2">
    <rect x="168" y="168" width="64" height="64" rx="14" fill="#0b1b33" stroke="#0b1b33"/>
    <rect x="84" y="94" width="52" height="52" rx="12"/><rect x="264" y="94" width="52" height="52" rx="12"/>
    <rect x="84" y="254" width="52" height="52" rx="12"/><rect x="264" y="254" width="52" height="52" rx="12"/>
  </g>
  <g fill="none" stroke="#0a58a8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M98 112h24v15H98zM104 133h12"/>
    <path d="M276 132l8-8 6 6 10-12"/>
    <path d="M98 270h24v20H98zM104 266v4M116 266v4M110 290v4"/>
    <path d="M282 270l-6 10 6 10M298 270l6 10-6 10"/>
  </g>
  <path d="M186 200h28M200 186v28" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
  <g fill="#0f6e66"><circle cx="200" cy="70" r="6"/><circle cx="200" cy="330" r="6"/><circle cx="82" cy="200" r="6"/><circle cx="318" cy="200" r="6"/></g>
</svg>`;

function pillarCards() {
  return PILLARS.map(p => `<a class="card pillar-card" href="/solutions/${p.slug}/" data-reveal>${icon(p.icon)}<h3>${esc(p.title)}</h3><p>${esc(p.summary)}</p><ul>${p.items.slice(0, 4).map(i => `<li>${esc(i.t)}</li>`).join('')}</ul><span class="card-cta">Explore</span></a>`).join('');
}
function industryCards() {
  return INDUSTRIES.map(i => `<a class="card" href="/industries/${i.slug}/" data-reveal>${icon(i.icon)}<h3>${esc(i.title)}</h3><p>${esc(i.summary)}</p><span class="card-cta">Read more</span></a>`).join('');
}
function insightCard(a, label = '') {
  return `<a class="card" href="/insights/${a.slug}/" data-reveal><p class="card-kicker">${esc(label || a.topic)} · ${a.readMins} min read</p><h3>${esc(a.title)}</h3><p>${esc(a.excerpt)}</p><span class="card-cta">Read the guide</span></a>`;
}
function insightCards() {
  return INSIGHTS_US.map(a => insightCard(a)).join('') + ghOnly(INSIGHTS_GH.map(a => insightCard(a, 'Ghana guide')).join(''));
}
function stepsRow(items) {
  return `<ol class="steps-row">${items.map(s => `<li><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></li>`).join('')}</ol>`;
}

// ---- Forms ----------------------------------------------------------------------
function fieldText(id, name, label, { type = 'text', required = false, auto = 'off', full = false, extra = '' } = {}) {
  const err = required ? `<p class="field-error" id="${id}Err" aria-live="polite"></p>` : '';
  return `<div class="field${full ? ' full' : ''}"><label for="${id}">${esc(label)}${required ? '' : ' <span class="hint">(optional)</span>'}</label><input id="${id}" name="${name}" type="${type}" autocomplete="${auto}"${required ? ` required aria-describedby="${id}Err"` : ''}${extra}>${err}</div>`;
}
function fieldSelect(id, name, label, options, { full = false } = {}) {
  return `<div class="field${full ? ' full' : ''}"><label for="${id}">${esc(label)} <span class="hint">(optional)</span></label><select id="${id}" name="${name}"><option value="">Select…</option>${options.map(o => `<option>${esc(o)}</option>`).join('')}</select></div>`;
}
function formShell({ id, kind, fields, submit }) {
  return `<form class="form-card" id="${id}" data-lead-form data-kind="${esc(kind)}" novalidate>
      <div class="honeypot" aria-hidden="true"><label for="${id}Website">Website</label><input id="${id}Website" name="website" type="text" autocomplete="off" tabindex="-1"></div>
      <div class="form-grid">
        ${fields}
      </div>
      <div class="form-actions"><button class="btn" type="submit">${esc(submit)}</button></div>
      <p class="form-status" role="alert"></p>
      <p class="form-alt">Prefer to talk? Call or text <a href="tel:${site.phoneE164}">${esc(site.phoneDisplay)}</a>, or <a class="email-alternative" href="mailto:${site.email}">email ${esc(site.email)}</a>. WhatsApp also works: <a class="whatsapp-alternative" href="${WA}" target="_blank" rel="noopener">message us on WhatsApp</a>.</p>
      <p class="form-note">We use your details only to reply to this request. See our <a href="/privacy/">privacy policy</a>.</p>
    </form>`;
}
function consultationForm() {
  const id = 'consult';
  const interests = [...PILLARS.map(p => p.title), 'Not sure yet'];
  const fields = [
    fieldText(id + 'Name', 'name', 'Your name', { required: true, auto: 'name' }),
    fieldText(id + 'Business', 'business', 'Company', { auto: 'organization' }),
    fieldText(id + 'Email', 'email', 'Work email', { type: 'email', required: true, auto: 'email' }),
    fieldText(id + 'Phone', 'phone', 'Phone', { type: 'tel', auto: 'tel' }),
    fieldSelect(id + 'Size', 'company_size', 'Company size', ['1–10 people', '11–50 people', '51–200 people', '201+ people']),
    fieldSelect(id + 'Timeline', 'timeline', 'Timeline', ['As soon as possible', 'Within 1–3 months', 'Within 3–6 months', 'Planning for later', 'Just exploring']),
    `<fieldset class="field full"><legend class="legend">Areas of interest <span class="hint">(optional, choose any)</span></legend><div class="checks">${interests.map((t, i) => `<label class="check" for="${id}Int${i}"><input type="checkbox" id="${id}Int${i}" name="interests" value="${esc(t)}"> ${esc(t)}</label>`).join('')}</div></fieldset>`,
    fieldSelect(id + 'Setup', 'it_setup', 'Current IT setup', ['No dedicated IT: we handle it ourselves', 'One person looks after IT part-time', 'In-house IT team', 'An outside IT provider', 'Not sure'], { full: true }),
    `<div class="field full"><label for="${id}Message">What would you like to discuss? <span class="hint">(optional)</span></label><textarea id="${id}Message" name="message" placeholder="Your goals, current tools and anything that is not working well"></textarea></div>`
  ].join('\n        ');
  return formShell({ id, kind: 'Technology consultation request', fields, submit: 'Request a consultation' });
}
// Free Technology Assessment intake (repositioning/assessment-offers.md §1.1,
// shortened). Field names map onto the existing /api/lead record: site_url ->
// website (runs the existing website scan when given), found_via, time_waster
// (= biggest technology headache); everything else is folded into `message`.
function fieldChecks(id, name, legend, options) {
  return `<fieldset class="field full"><legend class="legend">${esc(legend)} <span class="hint">(optional, choose any)</span></legend><div class="checks">${options.map((t, i) => `<label class="check" for="${id}${i}"><input type="checkbox" id="${id}${i}" name="${name}" value="${esc(t)}"> ${esc(t)}</label>`).join('')}</div></fieldset>`;
}
function assessmentForm() {
  const id = 'assess';
  const fields = [
    fieldText(id + 'Name', 'name', 'Your name', { required: true, auto: 'name' }),
    fieldText(id + 'Role', 'role', 'Your role', { auto: 'organization-title' }),
    fieldText(id + 'Business', 'business', 'Business name', { auto: 'organization' }),
    fieldText(id + 'Email', 'email', 'Work email', { type: 'email', required: true, auto: 'email' }),
    fieldText(id + 'Phone', 'phone', 'Phone', { type: 'tel', auto: 'tel' }),
    fieldText(id + 'SiteUrl', 'site_url', 'Your website', { auto: 'url', extra: ' inputmode="url" spellcheck="false" autocapitalize="off" placeholder="yourcompany.com"' }),
    fieldSelect(id + 'Industry', 'industry', 'Industry', ['Medical or dental clinic', 'Professional services', 'Home services or contractor', 'Salon, barber or spa', 'Auto services', 'Fitness', 'Restaurant, retail or hospitality', 'School or education', 'Nonprofit', 'Startup or small business', 'Other']),
    fieldSelect(id + 'Staff', 'company_size', 'Staff who use a computer or company email', ['1–2', '3–10', '11–25', '26–50', '51–100', '100+']),
    fieldSelect(id + 'ItToday', 'it_setup', 'Who looks after your IT today?', ['Nobody in particular', 'A staff member', 'A freelancer', 'An IT company', 'Other']),
    fieldSelect(id + 'Tools', 'office_tools', 'Email and office tools', ['Microsoft 365', 'Google Workspace', 'Other', 'Not sure']),
    fieldChecks(id + 'Int', 'interests', 'What should we look at?', ['IT support, devices, email and backups', 'Website, search and marketing', 'AI, automation and reporting', 'Software, integrations and a technology roadmap']),
    fieldSelect(id + 'Found', 'found_via', 'How do most new customers find you?', ['Google search', 'Google Maps', 'Social media', 'Referrals', 'Walk-ins', 'Advertising', 'Other'], { full: true }),
    fieldText(id + 'Headache', 'time_waster', 'Biggest technology headache right now', { full: true }),
    `<div class="field full"><label for="${id}Message">Anything else we should know? <span class="hint">(optional)</span></label><textarea id="${id}Message" name="message" placeholder="Upcoming changes, important systems, what you would like technology to do better"></textarea></div>`,
    `<div class="field full"><label class="check" for="${id}Consent"><input type="checkbox" id="${id}Consent" name="consent" value="yes" required aria-describedby="${id}ConsentErr"> I am happy for ShowMe to look at our public website and domain information.</label><p class="field-error" id="${id}ConsentErr" aria-live="polite"></p></div>`
  ].join('\n        ');
  return formShell({ id, kind: 'Free Technology Assessment', fields, submit: 'Request my free assessment' });
}

// ---- Home ----------------------------------------------------------------------
export function home() {
  const flagshipPoints = ['Help desk and user support for your team', 'Microsoft 365 or Google Workspace administration', 'Device inventory, updates and backup monitoring', 'Onboarding and offboarding, vendor coordination and regular reviews'];
  const commitments = [
    ['A written proposal before any work', 'Scope, deliverables, exclusions, timeline and price are agreed in writing before we start.'],
    ['You own your accounts and assets', 'Domains, licenses, accounts, content and code we create for you are set up in your name.'],
    ['Preview before final payment', 'On projects you approve a working preview before the final payment is due.'],
    ['Plain-English reporting', 'Regular summaries of what we did, what we found and what we recommend next.'],
    ['A reply within one business day', 'Send a request or a question and we will reply within one business day.'],
    ['30 days of launch support', 'Every project includes 30 days of support after launch to fix defects in what we delivered.']
  ];
  const main = `    <section class="hero">
      <div class="wrap hero-grid">
        <div>
          <p class="eyebrow">Technology &amp; digital transformation partner</p>
          <h1>${esc(HERO.h1)}</h1>
          <p class="lead">${esc(HERO.sub)}</p>
          <div class="btn-row">
            <a class="btn" href="/contact/">Book a Technology Consultation</a>
            <a class="btn secondary" href="/solutions/">Explore Our Solutions</a>
          </div>
          <p class="hero-alt">Not sure where to start? <a class="text-link" href="/technology-assessment/">Get a Free Technology Assessment</a></p>
          <div class="hero-facts">
            <div><strong>${esc(site.facts.experience)}</strong><span>of experience</span></div>
            <div><strong>${esc(site.facts.businessesHelped)}</strong><span>businesses helped</span></div>
            <div><strong>4</strong><span>solution areas, one partner</span></div>
          </div>
        </div>
        ${HERO_SVG}
      </div>
    </section>

    <section class="section-dark section-tight">
      <div class="wrap split center-y">
        <p class="quote-band">${esc(HERO.positioning)}</p>
        <p>${esc(HERO.supporting)}</p>
      </div>
    </section>

    <section>
      <div class="wrap">
        <div class="section-head"><p class="eyebrow">Solutions</p><h2>Four connected solution areas</h2><p class="lead">Start with the area that matters most today. Because one team understands all four, the pieces fit together as you grow.</p></div>
        <div class="grid grid-2">${pillarCards()}</div>
        <p style="margin-top:28px"><a class="text-link" href="/solutions/">See all solutions</a></p>
      </div>
    </section>

    <section class="section-alt">
      <div class="wrap split center-y">
        <div>
          <p class="eyebrow">Flagship service</p>
          <h2>Your Complete IT Department. Without the Cost of Building One.</h2>
          <p class="lead">A managed monthly service that looks after your people, accounts, devices and systems, with a clear scope, regular reporting and a roadmap for what comes next.</p>
          <div class="btn-row"><a class="btn" href="/managed-it-services/">See how it works</a><a class="btn secondary" href="/contact/">Request pricing</a></div>
        </div>
        <div class="panel">${icon('flagship')}<h3>What a typical month includes</h3>${list(flagshipPoints)}<p class="hint">Exact inclusions depend on the package you choose.</p></div>
      </div>
    </section>

    <section>
      <div class="wrap">
        <div class="section-head"><p class="eyebrow">Industries</p><h2>Built around how your sector works</h2></div>
        <div class="grid grid-3">${industryCards()}</div>
      </div>
    </section>

    <section class="section-dark">
      <div class="wrap">
        <div class="section-head"><p class="eyebrow">How we work</p><h2>A clear path from first conversation to ongoing service</h2></div>
        ${stepsRow(JOURNEY.slice(0, 5))}
        <p style="margin-top:32px"><a class="text-link" href="/how-we-work/">Our engagement model</a></p>
      </div>
    </section>

    <section>
      <div class="wrap split">
        <div>
          <p class="eyebrow">Working with us</p>
          <h2>Commitments you can hold us to</h2>
          <p class="lead">${esc(site.facts.experience)} of experience and ${esc(site.facts.businessesHelped)} businesses helped. No jargon, and no lock-in beyond any agreed minimum term.</p>
          <p><a class="text-link" href="/trust/">How we work with your data</a></p>
        </div>
        <div class="grid grid-2">${commitments.map(c => `<div class="panel" data-reveal><h3>${esc(c[0])}</h3><p class="hint">${esc(c[1])}</p></div>`).join('')}</div>
      </div>
    </section>

    <section class="section-alt">
      <div class="wrap split center-y">
        <div class="leader">
          ${founderPhoto({ size: 160 })}
          <div>
            <h2 style="font-size:1.5rem;margin-bottom:4px">${esc(site.founder)}</h2>
            <p class="role">Founder</p>
            <p>Joshua founded ShowMe to give growing businesses one accountable partner for the technology they run on and the digital work that grows them.</p>
            <a class="text-link" href="/about/#leadership">Leadership</a>
          </div>
        </div>
        <div>
          <p class="eyebrow">Insights</p>
          <h2>Practical guidance</h2>
          <div class="grid">${INSIGHTS_US.slice(0, 2).map(a => `<a class="card" href="/insights/${a.slug}/" data-reveal><h3>${esc(a.title)}</h3><span class="card-cta">Read the guide</span></a>`).join('')}</div>
        </div>
      </div>
    </section>

    ${ctaBand()}`;
  return page({
    title: 'Managed IT, AI Automation, Software & Digital Marketing | ' + site.name,
    description: 'Managed IT services, AI and automation, software development and digital marketing from one accountable technology partner. Book a technology consultation.',
    path: '/', jsonLd: [orgLd(), professionalServiceLd()], main
  });
}

// ---- Solutions hub ---------------------------------------------------------------
export function solutionsHub() {
  const path = '/solutions/';
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Solutions', path }];
  const main = `${pageHero({ crumbs, eyebrow: 'Solutions', h1: 'Technology and growth solutions under one partner.', lead: esc(HERO.supporting), iconName: 'roadmap' })}

    <section>
      <div class="wrap">
        <a class="card" href="/managed-it-services/" style="margin-bottom:28px" data-reveal>${icon('flagship')}<p class="card-kicker">Flagship service</p><h2 style="font-size:1.45rem">Your Complete IT Department. Without the Cost of Building One.</h2><p>Managed IT as a monthly service: support, administration, devices, backups and planning.</p><span class="card-cta">See the managed IT packages</span></a>
        <div class="grid grid-2">${pillarCards()}</div>
      </div>
    </section>

    <section class="section-alt">
      <div class="wrap split center-y">
        <div><p class="eyebrow">Not sure where to start?</p><h2>Start with a Free Technology Assessment.</h2><p>We look at how your business runs its computers, email, files and tools, then give you a written summary of your top priorities, whether or not you work with us.</p></div>
        <div class="btn-row"><a class="btn" href="/technology-assessment/">Get a Free Technology Assessment</a><a class="btn secondary" href="/contact/">Book a Technology Consultation</a></div>
      </div>
    </section>

    ${ctaBand()}`;
  return page({
    title: 'Solutions: Managed IT, AI, Software & Digital Marketing | ' + site.name,
    description: 'ShowMe solutions: managed IT and infrastructure, digital marketing and brand growth, AI and automation, and software development and technology consulting.',
    path, jsonLd: [orgLd(), breadcrumbLd(crumbs)], main
  });
}

// Digital marketing pillar extra: packages without prices, de-emphasized.
export function marketingPackages() {
  const retainer = serviceBySlug['growth-retainer'];
  return `
    <section class="section-alt">
      <div class="wrap">
        <div class="section-head"><p class="eyebrow">Packages</p><h2>Marketing packages</h2><p>For businesses that prefer a ready-made combination. Each is quoted for your scope.</p></div>
        <div class="grid grid-4">
          <a class="card" href="/services/growth-retainer/" data-reveal><h3>${esc(retainer.title)}</h3><p>${esc(retainer.summary)}</p><span class="card-cta">Details</span></a>
          ${BUNDLES.map(b => `<div class="card" data-reveal><h3>${esc(b.name)}</h3><p>${esc(b.tagline)} ${esc(b.forWho)}</p><p class="hint">Typical timeline: ${esc(b.timeline)}</p></div>`).join('')}
        </div>
        <p style="margin-top:22px"><a class="text-link" href="/contact/">Request pricing</a></p>
      </div>
    </section>`;
}

// ---- Flagship: managed IT ----------------------------------------------------------
// Plans follow repositioning/managed-it-packages.md; [CONFIRM WITH JOSH] /
// [PRICE TBD] items there are shown as placeholders here.
const tbcText = v => (v && typeof v === 'object') ? tbc(v.tbc, v.live ?? v.t ?? '') : esc(v);
export function managedIt() {
  const path = '/managed-it-services/';
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Solutions', path: '/solutions/' }, { name: 'Managed IT Services', path }];
  const faqs = [
    { q: 'Who is this for?', a: 'Businesses with roughly 3 to 100 staff and no full-time IT person, or with an IT lead who needs support. It suits teams that want day-to-day IT handled properly and planned ahead.' },
    { q: 'How do we start?', a: 'With a Free Technology Assessment. We learn how your business uses technology today, give you a written summary of priorities, and only then recommend a plan, or tell you if you do not need one.' },
    { q: 'Do you replace our current IT provider?', a: 'Only if you want us to. We can take over fully, work alongside an internal IT person, or start with an assessment and a handover plan.' },
    { q: 'How is it priced?', a: 'As a monthly fee for the plan and the size of your team, plus a one-time onboarding fee, quoted in writing after the assessment. Hardware, software licenses and third-party tools are billed separately.' },
    { q: 'Is there a minimum term?', a: 'Any minimum term and notice period are stated in your proposal before you sign.' },
    { q: 'Is this a security service?', a: 'No. The plans cover IT support and administration, including routine settings such as backups, updates and multi-factor sign-in inside Microsoft 365 or Google Workspace. Security assessments, testing, training and compliance work are not offered at present.' }
  ];
  const main = `    <section class="page-hero">
      <div class="wrap page-hero-grid">
        <div>
          ${breadcrumb(crumbs)}
          <p class="eyebrow">Managed IT Services</p>
          <h1>Your Complete IT Department. Without the Cost of Building One.</h1>
          <p class="lead">A monthly plan for your people, accounts, devices and systems: help desk support, Microsoft 365 or Google Workspace administration, device management, backups and a technology advisor, for a predictable monthly fee instead of a full-time hire.</p>
          <div class="btn-row"><a class="btn" href="/contact/">Book a Technology Consultation</a><a class="btn secondary" href="/technology-assessment/">Get a Free Technology Assessment</a></div>
          <p class="hero-alt"><a class="text-link" href="#plans">Compare the plans</a></p>
        </div>
        ${icon('flagship', 'page-hero-icon')}
      </div>
    </section>

    <section>
      <div class="wrap split">
        <div>
          <p class="eyebrow">The problem</p>
          <h2>Stop being your own IT department</h2>
          <p>In many small and mid-sized businesses, the technology is spread across several people: whoever set up the email, a freelancer who built the website, a vendor for the network, and the owner filling the gaps at night. When something breaks, nobody owns it.</p>
          <p>A managed plan makes one partner responsible for the routine work, with documentation, reporting and planning, for a predictable monthly fee.</p>
        </div>
        <div class="panel">
          <h3>Every plan includes</h3>
          ${list(['A written scope that says what is included and what is not', 'One point of contact who answers for the work', 'A regular plain-English report of what we did and what we recommend'])}
        </div>
      </div>
    </section>

    <section class="section-alt" id="plans">
      <div class="wrap">
        <div class="section-head"><p class="eyebrow">Plans</p><h2>Three monthly plans</h2><p>Every plan starts with a <a href="/technology-assessment/">Free Technology Assessment</a> and is quoted for your team after it. ${tbc('pricing unit (per user, per device or per site), minimum users, onboarding fee and prices', 'Pricing depends on your team, devices and plan, and is set out in your written proposal.')} ${tbc('delivery model and tools per plan', 'Your proposal also sets out who delivers each item and which tools we use.')}</p></div>
        <div class="tiers">
          ${TIERS.map(t => `<div class="tier${t.featured ? ' featured' : ''}" data-reveal>${t.featured ? '<span class="tier-badge">A common starting point</span>' : ''}<h3>${esc(t.name)}</h3><p class="tier-tagline">${esc(t.tagline)}</p><p class="tier-for">${esc(t.forWho)}</p><ul class="ticklist">${t.items.map(x => `<li>${tbcText(x)}</li>`).join('')}</ul><a class="btn${t.featured ? '' : ' secondary'}" href="/contact/">Request pricing</a></div>`).join('')}
        </div>
        <h3 style="margin-top:48px">Compare plans</h3>
        <div class="table-wrap"><table class="compare">
          <caption class="visually-hidden">What each managed IT plan includes</caption>
          <thead><tr><th scope="col">Area</th>${TIERS.map(t => `<th scope="col">${esc(t.name)}</th>`).join('')}</tr></thead>
          <tbody>${TIER_MATRIX.map(r => `<tr><th scope="row">${esc(r[0])}</th>${r.slice(1).map(v => `<td>${tbcText(v)}</td>`).join('')}</tr>`).join('')}</tbody>
        </table></div>
        <p class="hint" style="margin-top:14px">${tbc('backup tool and retention', 'Backup tools and retention periods are agreed for your business.')} Hardware, software licenses and third-party tools are billed separately${tbc('pass-through at cost or with a markup', ', as set out in your proposal')}.</p>
      </div>
    </section>

    <section>
      <div class="wrap">
        <div class="section-head"><p class="eyebrow">How support works</p><h2>Priorities and response</h2><p>Requests are logged, given a priority and tracked to resolution. Response targets are for first response (a person acknowledges the request, starts work and gives you an update time), not fix times. We will only publish targets we can consistently meet.</p></div>
        ${tbcBlock('support hours and time zone, how to log a request, and first-response targets per priority and plan. No out-of-hours cover is offered unless confirmed.', 'Response targets are agreed in your service agreement. Support hours and how to log a request are set out there too.')}
        <div class="table-wrap" style="margin-top:18px"><table>
          <caption class="visually-hidden">Request priorities and response targets</caption>
          <thead><tr><th scope="col">Priority</th><th scope="col">Example</th><th scope="col">Target first response</th></tr></thead>
          <tbody>${RESPONSE_ROWS.map(r => `<tr><th scope="row">${esc(r[0])}</th><td>${esc(r[1])}</td><td>${tbc('response target', 'Agreed in your service agreement')}</td></tr>`).join('')}</tbody>
        </table></div>
        <p class="hint" style="margin-top:14px">Escalation: your named contact, then our founder. Response performance is included in your monthly report.</p>
      </div>
    </section>

    <section class="section-alt">
      <div class="wrap grid grid-2">
        <div class="panel"><h2 style="font-size:1.35rem">Not included</h2><p class="hint">Clear boundaries keep the service predictable.</p>${list(BOUNDARIES, 'crosslist')}</div>
        <div class="panel"><h2 style="font-size:1.35rem">What we need from you</h2>${list(CLIENT_RESPONSIBILITIES)}<h2 style="font-size:1.35rem;margin-top:26px">Service agreement</h2><p>Each plan is covered by a written agreement setting out scope, exclusions, response targets, reporting and how either side can end the service. ${tbc('month-to-month, 3, 6 or 12 months, and notice period', 'The term and notice period are set out in your agreement.')}</p></div>
      </div>
      <div class="wrap" style="margin-top:28px">
        <h2 style="font-size:1.35rem">Optional add-ons (any plan)</h2>
        <div class="table-wrap"><table>
          <caption class="visually-hidden">Optional add-ons</caption>
          <thead><tr><th scope="col">Add-on</th><th scope="col">What you get</th><th scope="col">Notes</th></tr></thead>
          <tbody>${ADDONS.map(a => `<tr><th scope="row">${esc(a[0])}</th><td>${esc(a[1])}</td><td>${tbcText(a[2])}</td></tr>`).join('')}</tbody>
        </table></div>
      </div>
    </section>

    <section>
      <div class="wrap">
        <div class="section-head"><p class="eyebrow">Onboarding</p><h2>How we take over your IT</h2></div>
        <ol class="steps steps-grid">${ONBOARDING.map(s => `<li><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></li>`).join('')}</ol>
      </div>
    </section>

    <section class="section-alt">
      <div class="wrap-narrow"><h2>Frequently asked questions</h2>${faqList(faqs)}</div>
    </section>

    ${ctaBand({ heading: 'Find out what your IT really needs.', text: 'Start with a Free Technology Assessment or book a technology consultation. We will recommend the right plan, or tell you if you do not need one.', secondaryHref: '/technology-assessment/', secondaryLabel: 'Free Technology Assessment' })}`;
  return page({
    title: 'Managed IT Services: Your Complete IT Department | ' + site.name,
    description: 'Managed IT plans (Essentials, Business, Complete IT Department): help desk, Microsoft 365 and Google Workspace admin, devices, backups and IT planning.',
    path,
    jsonLd: [orgLd(), serviceLd({ name: 'Managed IT Services', description: 'Monthly managed IT plans: help desk, workspace administration, device management, backup and IT planning.', path, serviceType: 'Managed IT services' }), breadcrumbLd(crumbs), faqLd(faqs)],
    main
  });
}

// ---- Industries hub -------------------------------------------------------------
export function industriesHub() {
  const path = '/industries/';
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Industries', path }];
  const gh = ghOnly(`<div class="section-head" style="margin-top:48px"><h2>Ghana-focused sectors</h2></div><div class="grid grid-3">${GH_INDUSTRIES.map(i => `<a class="card" href="/industries/${i.slug}/">${icon('realestate')}<h3>${esc(i.title)}</h3><p>${esc(i.summary)}</p><span class="card-cta">Read more</span></a>`).join('')}</div>`);
  const main = `${pageHero({ crumbs, eyebrow: 'Industries', h1: 'Technology shaped around how your sector works.', lead: 'The same four solution areas, applied to the realities of your industry: the systems you rely on, the people you serve and the rules you work within.', iconName: 'professional' })}
    <section>
      <div class="wrap">
        <div class="grid grid-3">${industryCards()}</div>
        ${gh}
        <p style="margin-top:28px">Do not see your sector? Most of what we do applies across industries. <a href="/contact/">Tell us about your organization</a>.</p>
      </div>
    </section>
    ${ctaBand()}`;
  return page({
    title: 'Industries We Serve | ' + site.name,
    description: 'IT, automation, software and marketing for clinics, professional services, contractors, salons, auto services, fitness, restaurants, retail, schools and nonprofits.',
    path, jsonLd: [orgLd(), breadcrumbLd(crumbs)], main
  });
}

// ---- How we work -----------------------------------------------------------------
export function howWeWork() {
  const path = '/how-we-work/';
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'How we work', path }];
  const main = `${pageHero({ crumbs, eyebrow: 'How we work', h1: 'A clear engagement model, from first conversation to ongoing service.', lead: 'You always know what happens next, what it costs and what you will receive. Nothing starts until you approve it in writing.', iconName: 'roadmap' })}

    <section>
      <div class="wrap split">
        <div><p class="eyebrow">The process</p><h2>Six steps</h2><p>Whether you need a single project or an ongoing service, every engagement follows the same path.</p></div>
        <ol class="steps">${JOURNEY.map(s => `<li><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></li>`).join('')}</ol>
      </div>
    </section>

    <section class="section-alt">
      <div class="wrap">
        <div class="section-head"><p class="eyebrow">Engagement models</p><h2>Three ways to work with us</h2></div>
        <div class="grid grid-3">${ENGAGEMENTS.map(e => `<div class="panel" data-reveal><h3>${esc(e.t)}</h3><p>${esc(e.d)}</p>${list(e.points)}</div>`).join('')}</div>
      </div>
    </section>

    <section>
      <div class="wrap grid grid-2">
        <div class="panel"><h2 style="font-size:1.35rem">Communication and reporting</h2>${list(['A named contact for your account', 'Requests and decisions recorded in writing', 'Regular service summaries for monthly services', 'Reviews against your technology roadmap'])}<p class="hint">${tbc('standard reporting cadence and communication channels', 'Reporting cadence and communication channels are agreed at the start of each engagement.')}</p></div>
        <div class="panel"><h2 style="font-size:1.35rem">Payment terms</h2>${list(['Projects: 50% to start and 50% on launch, after you approve a working preview', 'Monthly services: billed monthly in advance', 'Advisory: fixed fee agreed up front'])}<p><a class="text-link" href="/pricing/">How pricing works</a></p></div>
      </div>
    </section>

    ${ctaBand()}`;
  return page({
    title: 'How We Work: Engagement Model & Process | ' + site.name,
    description: 'How ShowMe engagements work: consultation, assessment, roadmap, proposal, onboarding and ongoing service, with project, managed monthly and advisory models.',
    path, jsonLd: [orgLd(), breadcrumbLd(crumbs)], main
  });
}

// ---- Pricing ---------------------------------------------------------------------
export function pricing() {
  const path = '/pricing/';
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'How pricing works', path }];
  const faqs = [
    { q: 'Why are prices not listed?', a: 'Because scope drives cost. A five-person office and a fifty-person organization need different things, so we quote a fixed price for your agreed scope after a short assessment.' },
    { q: 'Which currency do you quote in?', a: '{{faq_usd}}' },
    { q: 'How can I pay?', a: '{{faq_pay}}' },
    { q: 'Are there hidden costs?', a: 'No. Third-party costs such as licenses, hardware, ad spend or hosting are listed in your proposal and passed through or paid by you directly.' }
  ];
  const main = `${pageHero({ crumbs, eyebrow: 'Pricing', h1: 'How pricing works.', lead: 'Every engagement is quoted in writing for your agreed scope. No surprises, and nothing starts until you approve the proposal.', ctas: false })}

    <section>
      <div class="wrap grid grid-3">
        <div class="panel"><h2 style="font-size:1.3rem">Projects</h2><p>A fixed quote for a defined outcome, such as a website, a migration, an automation or an application.</p>${list(['Fixed price for the agreed scope', 'Changes quoted before any extra work', '50% to start, 50% on launch after preview approval'])}</div>
        <div class="panel"><h2 style="font-size:1.3rem">Managed monthly services</h2><p>A predictable monthly fee for ongoing IT support and administration, marketing or application maintenance.</p>${list(['Clear inclusions and exclusions', 'Billed monthly in advance', 'Any minimum term stated in your proposal'])}<p class="hint">${tbc('per user, per device or per package', 'The pricing basis for managed IT is set out in your proposal.')}</p></div>
        <div class="panel"><h2 style="font-size:1.3rem">Advisory</h2><p>Fixed-fee consultations, assessments, workshops and technology roadmaps.</p>${list(['Fee agreed up front', 'Written recommendations you keep', 'No obligation to buy implementation'])}</div>
      </div>
    </section>

    <section class="section-alt">
      <div class="wrap split">
        <div><h2>Payment</h2>${list(PAYMENT.methods)}<p>${esc(PAYMENT.preview)}</p></div>
        <div><h2>Frequently asked questions</h2>${faqList(faqs)}</div>
      </div>
    </section>

    ${ctaBand({ heading: 'Request pricing for your scope.', text: 'Tell us what you need. We reply within one business day with next steps and, after a short assessment, a fixed written quote.' })}`;
  return page({
    title: 'How Pricing Works | ' + site.name,
    description: 'How ShowMe prices projects, managed monthly services and advisory work: fixed written quotes for your scope, clear payment terms and no hidden costs.',
    path, jsonLd: [orgLd(), breadcrumbLd(crumbs), faqLd(faqs)], main
  });
}

// ---- About -------------------------------------------------------------------------
export function about() {
  const path = '/about/';
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'About', path }];
  const personLd = { '@context': 'https://schema.org', '@type': 'Person', name: site.founder, jobTitle: 'Founder', image: site.founderImage, worksFor: { '@id': site.origin + '/#organization' }, url: url(path) };
  const principles = [
    ['One accountable partner', 'Technology, automation and marketing decisions affect each other. One team looking at all of them avoids gaps and finger-pointing.'],
    ['Plain English', 'Recommendations, proposals and reports you can read without a glossary.'],
    ['You stay in control', 'Accounts, licenses, domains and code are set up in your name. You can leave with everything.'],
    ['Honest scope', 'We say what is included, what is not, and when something is not worth doing.']
  ];
  const main = `${pageHero({ crumbs, eyebrow: 'About', h1: 'One partner for the technology you run on and the digital work that grows you.', lead: `ShowMe Digital Agency brings ${esc(site.facts.experience)} of experience and ${esc(site.facts.businessesHelped)} businesses helped across websites, marketing, automation and software. We are building on that to give growing organizations a complete technology partner.`, ctas: false })}

    <section>
      <div class="wrap split">
        <div><p class="eyebrow">Our approach</p><h2>What we believe</h2><p>Growing organizations should not have to coordinate an IT provider, a marketing agency, a developer and an automation consultant who never speak to each other.</p>${byRegion(`<p>Our founder, ${esc(site.founder)}, is based in the United States and leads every engagement, with delivery by our team.</p>`, `<p>${esc(site.locationLine)}.</p>`)}</div>
        <div class="grid grid-2">${principles.map(p => `<div class="panel" data-reveal><h3>${esc(p[0])}</h3><p class="hint">${esc(p[1])}</p></div>`).join('')}</div>
      </div>
    </section>

    <section class="section-alt" id="leadership">
      <div class="wrap">
        <div class="section-head"><p class="eyebrow">Leadership</p><h2>Who is accountable for your work</h2></div>
        <div style="max-width:820px">
          <div class="panel leader">
            ${founderPhoto({ size: 160 })}
            <div><h3>${esc(site.founder)}</h3><p class="role">Founder</p><p>Joshua founded ShowMe to give growing businesses one accountable partner across technology and growth, and he leads client relationships and delivery.</p>${byRegion('<p>US-based, Joshua has more than 7 years of experience and has helped over 50 businesses, working with an experienced delivery team.</p>', '<p>US-based, Joshua has more than 7 years of experience and has helped over 50 businesses, working with an experienced team in Accra.</p>')}${tbc('full bio and LinkedIn link', '')}</div>
          </div>
          ${tbc('additional leadership profiles', '')}
        </div>
      </div>
    </section>

    <section>
      <div class="wrap split">
        <div><p class="eyebrow">Delivery</p><h2>How our services are delivered</h2>${byRegion(`<p>${tbc('who delivers managed IT services: in-house team, contractors or partners, and their experience', 'Joshua leads every engagement, working with an experienced delivery team. Your proposal sets out who delivers each part of your service.')}</p>`, '<p>Joshua leads every engagement, working with an experienced team in Accra. Your proposal sets out who delivers each part of your service.</p>')}</div>
        <div class="panel"><h3>Get in touch</h3><p>Call or text <a href="tel:${site.phoneE164}">${esc(site.phoneDisplay)}</a>, or email <a href="mailto:${site.email}">${esc(site.email)}</a>.</p><a class="btn" href="/contact/">Book a Technology Consultation</a></div>
      </div>
    </section>

    ${ctaBand()}`;
  return page({
    title: 'About Us & Leadership | ' + site.name,
    description: 'About ShowMe Digital Agency: one accountable partner for managed IT, AI and automation, software and digital marketing. Meet our founder, Joshua Abbey.',
    path, jsonLd: [orgLd(), breadcrumbLd(crumbs), personLd], main
  });
}

// ---- Capabilities ---------------------------------------------------------------
export function capabilities() {
  const path = '/capabilities/';
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Capabilities', path }];
  const caps = PILLARS.map(p => `<div class="panel" data-reveal>${icon(p.icon)}<h2 style="font-size:1.3rem">${esc(p.title)}</h2>${list(p.items.map(i => i.t))}<a class="text-link" href="/solutions/${p.slug}/">Details</a></div>`).join('');
  const main = `${pageHero({ crumbs, eyebrow: 'Capabilities', h1: 'What we build, and how.', lead: 'An overview of what our team delivers. Client examples will be published here only with written client permission.' })}
    <section>
      <div class="wrap grid grid-2">${caps}</div>
    </section>
    ${tbc('which demonstrations are ready to show', '')}${tbc('client examples with written consent: the problem, what we did, the outcome and the date', '')}
    ${ctaBand()}`;
  return page({
    title: 'Capabilities | ' + site.name,
    description: 'What ShowMe builds and delivers across managed IT, digital marketing, AI and automation, and software development, with demonstrations available on request.',
    path, jsonLd: [orgLd(), breadcrumbLd(crumbs)], main
  });
}

// ---- Trust & data handling (not a security service page) ------------------------
export function trust() {
  const path = '/trust/';
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Trust & data handling', path }];
  const card = (h, body) => `<div class="panel"><h2 style="font-size:1.3rem">${esc(h)}</h2>${body}</div>`;
  const main = `${pageHero({ crumbs, eyebrow: 'Trust & data handling', h1: 'How we work with your data.', lead: 'What we ask for, how we handle access to your systems and what you can expect from us. This page describes what we do today; items still being confirmed are marked.', ctas: false })}
    <section>
      <div class="wrap grid grid-2">
        ${card('Your accounts stay yours', '<p>Domains, licenses, workspace tenants, ad accounts, app-store listings and code repositories are set up in your name wherever possible. When an engagement ends, you keep everything.</p>')}
        ${card('Access on a need-to-know basis', `<p>Access to client data and systems is limited to the people who need it to deliver your work, and we use strong authentication on our own accounts.</p>${tbc('written access policy, password manager and staff confidentiality agreements', '')}`)}
        ${card('Confidentiality', '<p>Both parties keep each other\'s confidential information private and use it only for the engagement, during and after it. This is part of our <a href="/terms/">terms</a>.</p>')}
        ${card('Where data is handled', `<p>We use reputable cloud providers. ${tbc('where client systems are accessed from and where client data is stored', 'Where your data is stored is set out in your service agreement.')}</p>`)}
        ${card('When we process data for you', '<p>When we build or run systems for you, you remain in control of your customers\' data and we process it only on your instructions, as described in our <a href="/privacy/">privacy policy</a>.</p>')}
        ${card('If something goes wrong', `<p>If an issue affects your data, we tell you promptly and work with you on next steps. ${tbc('notification timeframe and contact process', 'The notification process is set out in your service agreement.')}</p>`)}
        ${card('This website', '<p>Our site uses no advertising or third-party tracking cookies. Requests you send are stored with our hosting provider and used only to reply to you.</p>')}
        ${card('Questions', `<p>Ask anything about how we handle data at <a href="mailto:${site.email}">${esc(site.email)}</a>.</p>`)}
      </div>
    </section>
    ${ctaBand()}`;
  return page({
    title: 'Trust & Data Handling | ' + site.name,
    description: 'How ShowMe works with your data: accounts in your name, need-to-know access, confidentiality, processing only on your instructions and clear communication.',
    path, jsonLd: [orgLd(), breadcrumbLd(crumbs)], main
  });
}

// ---- Insights ------------------------------------------------------------------
export function insightsIndex() {
  const path = '/insights/';
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Insights', path }];
  const blogLd = {
    '@context': 'https://schema.org', '@type': 'Blog', name: 'ShowMe Insights', url: url(path),
    publisher: { '@id': site.origin + '/#organization' },
    blogPost: INSIGHTS_US.map(a => ({ '@type': 'BlogPosting', headline: a.title, url: url('/insights/' + a.slug + '/'), datePublished: a.published }))
  };
  const main = `${pageHero({ crumbs, eyebrow: 'Insights', h1: 'Practical guidance on technology and growth.', lead: 'Plain-English guides for business owners and managers. More guides on IT, automation and AI are on the way.', ctas: false })}
    <section><div class="wrap"><div class="grid grid-3">${insightCards()}</div></div></section>
    ${ctaBand()}`;
  return page({
    title: 'Insights & Guides | ' + site.name,
    description: 'Practical, plain-English guides from ShowMe Digital Agency on AI, automation, lead follow-up and digital growth for business owners and managers.',
    path, jsonLd: [orgLd(), breadcrumbLd(crumbs), blogLd], main
  });
}
export function insightArticle(a) {
  const path = '/insights/' + a.slug + '/';
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Insights', path: '/insights/' }, { name: a.title, path }];
  const articleLd = {
    '@context': 'https://schema.org', '@type': 'BlogPosting', headline: a.title, description: a.excerpt,
    datePublished: a.published, dateModified: a.published, wordCount: a.wordCount,
    author: { '@type': 'Person', name: site.founder, jobTitle: 'Founder', url: site.origin + '/about/' },
    publisher: { '@id': site.origin + '/#organization', '@type': 'Organization', name: site.name }, mainEntityOfPage: url(path)
  };
  const isGh = INSIGHTS_GH.some(x => x.slug === a.slug);
  const more = (isGh ? ALL_INSIGHTS : INSIGHTS_US).filter(x => x.slug !== a.slug).slice(0, 3);
  const main = `    <section class="page-hero">
      <div class="wrap-narrow">
        ${breadcrumb(crumbs)}
        <p class="eyebrow">${isGh ? 'Ghana guide' : 'Insights'} · ${esc(a.topic)}</p>
        <h1>${esc(a.title)}</h1>
        <p class="lead">${esc(a.excerpt)}</p>
        <p class="article-meta byline">${founderPhoto({ size: 40, small: true, lazy: false })}<span>By <a href="/about/">${esc(site.founder)}</a>, Founder · <time datetime="${a.published}">${esc(a.publishedLabel)}</time> · ${a.readMins} min read</span></p>
      </div>
    </section>
    <section>
      <div class="wrap-narrow">
        <article class="prose">
${a.body}
        </article>
      </div>
    </section>
    ${more.length ? `<section class="section-alt"><div class="wrap"><h2>More guides</h2><div class="grid grid-3" style="margin-top:24px">${more.map(m => insightCard(m)).join('')}</div></div></section>` : ''}
    ${ctaBand()}`;
  return page({
    title: a.title + ' | ' + site.name, description: a.excerpt, path,
    jsonLd: [orgLd(), breadcrumbLd(crumbs), articleLd], main, ogType: 'article'
  });
}

// ---- Contact (consultation request) ---------------------------------------------
// US-friendly order: form first, then booking (placeholder), then call or
// text, email, and WhatsApp last.
function contactOptions() {
  return `<div class="side-card"><h2 style="font-size:1.1rem">Book a time</h2><p class="hint">${tbc('booking calendar link (for example a 20-minute call)', 'Send the form on this page or call or text us, and we will arrange a time that suits you.')}</p></div>
          <div class="side-card"><h2 style="font-size:1.1rem">Call or text</h2><p><a class="btn small" href="tel:${site.phoneE164}">Call ${esc(site.phoneDisplay)}</a> <a class="btn small secondary" href="sms:${site.phoneE164}">Text us</a></p>${tbc('phone and text hours and time zone', '')}</div>
          <div class="side-card"><h2 style="font-size:1.1rem">Email</h2><p><a href="mailto:${site.email}">${esc(site.email)}</a></p></div>
          <div class="side-card"><h2 style="font-size:1.1rem">WhatsApp</h2><p><a href="${WA}" target="_blank" rel="noopener">Message us on WhatsApp</a></p></div>`;
}
export function contact() {
  const path = '/contact/';
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Book a Technology Consultation', path }];
  const main = `    <section class="page-hero">
      <div class="wrap">
        ${breadcrumb(crumbs)}
        <p class="eyebrow">Contact</p>
        <h1>Book a Technology Consultation.</h1>
        <p class="lead">Tell us a little about your business and what you want to improve. We reply ${esc(site.facts.responsePromise)} to arrange a time to talk.</p>
      </div>
    </section>
    <section>
      <div class="wrap detail-grid">
        <div>${consultationForm()}
          <div class="panel" style="margin-top:28px"><h2 style="font-size:1.1rem">What happens next</h2><ol class="steps">${JOURNEY.slice(0, 3).map(s => `<li><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></li>`).join('')}</ol></div>
        </div>
        <aside class="detail-side" aria-label="Other ways to reach us">
          ${contactOptions()}
          <div class="side-card"><h2 style="font-size:1.1rem">Prefer a written review first?</h2><p>Request a <a href="/technology-assessment/">Free Technology Assessment</a>.</p></div>
        </aside>
      </div>
    </section>`;
  return page({
    title: 'Book a Technology Consultation | ' + site.name,
    description: 'Request a technology consultation with ShowMe Digital Agency, or call or text ' + site.phoneDisplay + '. Tell us your priorities; we reply within one business day.',
    path, jsonLd: [orgLd(), breadcrumbLd(crumbs)], main
  });
}

// ---- Free Technology Assessment (canonical; /free-audit/ redirects here) ----------
export function technologyAssessment() {
  const path = '/technology-assessment/';
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Free Technology Assessment', path }];
  const areas = [
    ['Email & office tools', 'Microsoft 365 or Google Workspace: accounts, sharing and email delivery settings.'],
    ['Devices & updates', 'What you have, how old it is and whether it is kept up to date.'],
    ['Files & backup', 'Where important files live and what you would lose if a laptop died today.'],
    ['Internet & Wi-Fi', 'How reliable your connection and office network are.'],
    ['Staff setup & accounts', 'How long it takes to get a new person working, and to close accounts when someone leaves.'],
    ['Software & subscriptions', 'What you pay for, who tracks renewals and what overlaps.'],
    ['Website & online presence', 'How customers find you and what your website does for you.'],
    ['Processes & automation', 'The repetitive tasks that take your team the most time.']
  ];
  const steps = [
    { t: 'Short intake form', d: 'About 5 to 7 minutes, below.' },
    { t: 'Public checks', d: 'Website status, domain renewal date and whether your email delivery settings are in place. We never ask for passwords.' },
    { t: 'A 45-minute call', d: 'With our founder, by video or phone, about how your business uses technology day to day.' },
    { t: 'Written report', d: 'Top priorities by area, quick wins you can do yourself and a 30/90/180-day roadmap.' },
    { t: 'Optional review call', d: '20 minutes to go through the report and answer questions.' }
  ];
  const faqs = [
    { q: 'Is it really free?', a: 'Yes. There is no obligation, and the report is yours to keep whether or not you work with us.' },
    { q: 'How long does it take?', a: 'The intake form takes about 5 to 7 minutes and the call about 45 minutes. Report turnaround is confirmed when we book your call.' },
    { q: 'Do you need access to our systems?', a: 'No. We only look at public information such as your website and domain records unless you invite us to look at more. We never ask for passwords; if you want us to see an admin screen, you share your screen.' },
    { q: 'Is this a security audit?', a: 'No. It is a point-in-time review of how your technology is set up and used, not a security audit or compliance review.' }
  ];
  const main = `${pageHero({ crumbs, eyebrow: 'Free Technology Assessment', h1: 'See your whole technology setup on one page, and what to fix first.', lead: 'A free, no-obligation review of how your business runs its computers, email, files and tools, across IT, marketing, automation and software. You get a written report in plain English with your top priorities, whether or not you work with us.', ctas: false })}
    <section>
      <div class="wrap detail-grid">
        <div>
          <h2>What we look at</h2>
          <div class="grid grid-2" style="margin:20px 0 36px">${areas.map(p => `<div class="panel"><h3>${esc(p[0])}</h3><p class="hint">${esc(p[1])}</p></div>`).join('')}</div>
          <h2>How it works</h2>
          <ol class="steps" style="margin-top:20px">${steps.map(x => `<li><h3>${esc(x.t)}</h3><p>${esc(x.d)}</p></li>`).join('')}</ol>
          <p class="hint">${tbc('report turnaround, for example within 5 business days', 'We will confirm when to expect your report when we schedule your assessment.')} ${tbc('whether in-person assessments are offered, and where', 'Assessments are carried out remotely unless we agree otherwise.')}</p>
          <div style="margin-top:32px">${faqList(faqs)}</div>
        </div>
        <aside class="detail-side" aria-label="Request your assessment">
          <h2 style="font-size:1.25rem;margin-bottom:14px">Request your free assessment</h2>
          ${assessmentForm()}
        </aside>
      </div>
    </section>
    ${ctaBand()}`;
  return page({
    title: 'Free Technology Assessment | ' + site.name,
    description: 'A free, no-obligation review of your IT, email, files, devices, website and processes, with a plain-English report of your top priorities. No passwords needed.',
    path, jsonLd: [orgLd(), breadcrumbLd(crumbs), faqLd(faqs)], main
  });
}

// ---- FAQ ----------------------------------------------------------------------
export const FAQ_GROUPS = [
  { title: 'Working with us', items: [
    { q: 'What does ShowMe Digital Agency do?', a: 'We are a technology and digital transformation partner. We provide managed IT services and infrastructure, digital marketing and brand growth, AI and automation, and software development and technology consulting.' },
    { q: 'How do engagements start?', a: 'With a technology consultation, followed by a short assessment and a written proposal. Nothing starts until you approve the proposal.' },
    { q: 'Do I have to buy everything from you?', a: 'No. Many clients start with one area. Because one team understands all four, it is easier to add more later.' },
    { q: 'Do I own what you build?', a: 'Yes. Accounts, domains, licenses, content, brand assets and the code written for you are yours once paid for.' },
    { q: 'Where is ShowMe based?', a: 'Our founder, Joshua Abbey, is based in the United States and leads every engagement. We work with clients by video, phone and shared workspaces.' },
    { q: 'What time zone do you work in?', a: 'We schedule calls in your local time zone, including US Central and Eastern time. Support hours for managed IT are set out in your service agreement.', aHtml: 'We schedule calls in your local time zone, including US Central and Eastern time. Support hours for managed IT are set out in your service agreement.' + tbc('standard support hours and time zone', '') },
    { q: 'Do you require long contracts?', a: 'Projects are fixed-scope, with no ongoing commitment. Any minimum term and notice period for a monthly service are stated in your proposal before you sign.' },
    { q: 'How does the Free Technology Assessment work?', a: 'You fill in a short intake form, we check public basics such as your website and domain, and then we have a 45-minute call about how your business uses technology. You receive a written report with your top priorities. It is free and there is no obligation.' }
  ] },
  { title: 'Managed IT', items: [
    { q: 'What is included in managed IT?', a: 'Day-to-day user support, Microsoft 365 or Google Workspace administration, device inventory and updates, backup monitoring and regular reporting. Higher packages add onboarding and offboarding, network management, vendor coordination and planning.' },
    { q: 'What are your support hours and response times?', a: 'These are being finalized and will be set out in your service agreement. We only publish targets we can consistently meet.' },
    { q: 'Can you work with our existing IT person or provider?', a: 'Yes. We can support an internal IT lead, take over from a previous provider with a documented handover, or start with an assessment.' }
  ] },
  { title: 'Projects and pricing', items: [
    { q: 'How is pricing set?', a: 'Projects get a fixed quote for the agreed scope; monthly services have a predictable monthly fee; advisory work is a fixed fee.' },
    { q: 'Which currency do you quote in?', a: '{{faq_usd}}' },
    { q: 'How can I pay?', a: '{{faq_pay}}' },
    { q: 'Can you promise rankings or a number of leads?', a: 'No honest agency can. We commit to the agreed work, transparency and clear reporting.' }
  ] },
  { title: 'AI and automation', items: [
    { q: 'Will an AI assistant replace my staff?', a: 'No. It handles repetitive questions and routine steps, then hands off to a person for anything that needs judgment.' },
    { q: 'Where should we start with automation?', a: 'Usually with an automation review that identifies the workflows that waste the most time, so the first build pays off quickly.' }
  ] }
];
export function faqPage() {
  const path = '/faq/';
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'FAQ', path }];
  const all = FAQ_GROUPS.flatMap(g => g.items);
  const main = `${pageHero({ crumbs, eyebrow: 'FAQ', h1: 'Frequently asked questions.', lead: 'Straight answers about how we work. If your question is not here, <a href="/contact/">ask us</a>.', ctas: false })}
    <section><div class="wrap-narrow">${FAQ_GROUPS.map(g => `<div class="faq-group"><h2>${esc(g.title)}</h2>${faqList(g.items)}</div>`).join('')}</div></section>
    ${ctaBand()}`;
  return page({ title: 'Frequently Asked Questions | ' + site.name, description: 'Answers about ShowMe engagements, managed IT, projects and pricing, payment, and AI and automation.', path, jsonLd: [orgLd(), breadcrumbLd(crumbs), faqLd(all)], main });
}

// ---- Legal --------------------------------------------------------------------
// PENDING LEGAL REVIEW: the US-default privacy policy and terms below are
// plain-English drafts not yet reviewed by counsel (legal entity, governing
// law and US state privacy notices to be confirmed). Ghana-view text, which
// keeps the Act 843 / Act 772 references: scripts/legal-gh.mjs.
const LEGAL_UPDATED = '15 October 2026';
function usPrivacyBody(mail) {
  return `
        <h2>1. Who we are</h2>
        <p>This policy applies to ShowMe Digital Agency ("ShowMe", "we", "us") and to this website at agency.showmeworld.app. You can contact us about privacy at any time at ${mail}.</p>
        <h2>2. The information we collect</h2>
        <h3>Information you give us</h3>
        <ul>
          <li><strong>Consultation, assessment and contact requests:</strong> your name, role, company, email address, phone number, website, industry, company size, areas of interest, current IT setup and tools, timeline, how customers find you and your message.</li>
          <li><strong>Conversations:</strong> emails, messages and notes from calls with you.</li>
          <li><strong>Client information:</strong> if you become a client, contact and billing details, materials you provide and the access we need to deliver the agreed services.</li>
        </ul>
        <h3>Information collected automatically</h3>
        <ul>
          <li><strong>Anonymous usage counts:</strong> simple daily totals of page views and form submissions, recorded without cookies and without identifying you.</li>
          <li><strong>Form metadata:</strong> the time and your browser type, stored with your request to help prevent spam.</li>
          <li><strong>Hosting logs:</strong> our hosting provider processes technical data such as IP addresses to deliver the site and protect it from abuse.</li>
        </ul>
        <h3>Cookies</h3>
        <p>We do not use advertising or tracking cookies on this website. One functional cookie remembers the region you choose on the site, if you choose one.</p>
        <h2>3. How we use information</h2>
        <ul>
          <li>To reply to your request and arrange a consultation.</li>
          <li>To scope, deliver, bill for and support the services you buy.</li>
          <li>To keep our website working properly and understand overall usage.</li>
          <li>To meet legal and accounting obligations.</li>
        </ul>
        <p>We only send marketing emails if you have agreed to receive them. Every marketing email identifies us, includes our postal address and a working unsubscribe link, as required by the CAN-SPAM Act, and we honor opt-out requests promptly. ${tbc('business postal address', '')}</p>
        <h2>4. Who we share information with</h2>
        <p>We do not sell your personal information, and we do not share it for cross-context behavioral advertising. We share it only with service providers that help us run the business, such as website hosting, email and messaging providers, payment processors and the productivity tools we use to deliver your work, under appropriate confidentiality terms. We may also disclose information where required by law.</p>
        <h2>5. Where information is processed</h2>
        <p>Our service providers and team members may process information in countries other than the one you live in. We choose reputable providers and take reasonable steps to protect information wherever it is processed.</p>
        <h2>6. How long we keep information</h2>
        <ul>
          <li><strong>Requests that do not become engagements:</strong> up to 24 months, then deleted.</li>
          <li><strong>Client records:</strong> for the engagement and up to 6 years afterwards for accounting, tax and legal purposes.</li>
        </ul>
        <h2>7. How we protect information</h2>
        <p>We use access controls, strong authentication on our accounts, encrypted connections and reputable providers. Access is limited to the people who need it. No system is perfect; if an incident affects your personal information, we will notify you as required by law.</p>
        <h2>8. Your choices and rights</h2>
        <p>Depending on where you live, you may have the right to know what personal information we hold about you, to receive a copy, and to ask us to correct or delete it. You may opt out of marketing at any time. To make a request, email ${mail}. We will verify your request and respond within the time required by applicable law, and we will not discriminate against you for exercising your rights.</p>
        <h2>9. When we process data for clients</h2>
        <p>When we build or run systems for a client, the client controls their customers' data and we process it only on the client's instructions, keep it confidential and return or delete it when the engagement ends.</p>
        <h2>10. Children</h2>
        <p>Our services are for businesses. We do not knowingly collect personal information from children under 13 through this website.</p>
        <h2>11. Changes</h2>
        <p>We may update this policy. The date at the top shows the latest revision.</p>
        <h2>12. Contact</h2>
        <p>Email ${mail}. See also our <a href="/terms/">Terms of Service</a>.</p>`;
}
function usTermsBody(mail) {
  return `
        <h2>1. About these terms</h2>
        <p>These terms apply between ShowMe Digital Agency ("ShowMe", "we", "us") and you, the client. They apply to every engagement together with your written proposal or service agreement; if they conflict, the proposal or agreement wins for that engagement. ${tbc('legal entity name and state', '')}</p>
        <h2>2. Proposals and scope</h2>
        <ul>
          <li>Every engagement starts with a written proposal setting out scope, deliverables, exclusions, price, timeline and what we need from you.</li>
          <li>Work outside the agreed scope is quoted in writing before we start it.</li>
        </ul>
        <h2>3. Prices and quotes</h2>
        <ul>
          <li>Prices are given in your quote or proposal, which fixes the price for the scope described. Quotes are valid for 30 days and are in US dollars (USD) unless your proposal states otherwise.</li>
          <li>Third-party costs such as hardware, software licenses, ad spend, domains, hosting, payment-processing fees, usage fees and travel are not included unless stated, and are listed in your proposal.</li>
        </ul>
        <h2>4. Payment terms</h2>
        <ul>
          <li><strong>Projects:</strong> 50% before work starts and 50% on launch, after you approve a working preview.</li>
          <li><strong>Monthly services:</strong> billed monthly in advance.</li>
          <li><strong>Methods:</strong> {{faq_pay}}</li>
          <li><strong>Late payment:</strong> invoices are due within 7 days unless agreed otherwise. We may pause work or services if payment is more than 7 days late.</li>
        </ul>
        <h2>5. Preview before final payment</h2>
        <p>On every project we show you a working preview before the final payment is due. If it does not match the agreed scope, we fix it before asking for payment.</p>
        <h2>6. Managed monthly services</h2>
        <ul>
          <li>Your service agreement sets out what is included and excluded, support channels, response targets, reporting and any minimum term.</li>
          <li>We work to restore and maintain service promptly, but we do not warrant that systems will be uninterrupted or error-free, and we are not responsible for faults in third-party products or services outside our control.</li>
          <li>You remain responsible for your licenses and for approving changes that affect how your team works.</li>
        </ul>
        <h2>7. Launch dates</h2>
        <p>Launch dates are agreed in your proposal or onboarding plan. They depend on receiving your first payment and the access, information and approvals in your onboarding checklist; delays caused by late information, approvals or third-party reviews move the date. Ad spend is paid directly to the platforms.</p>
        <h2>8. Your responsibilities</h2>
        <ul>
          <li>Provide accurate information, access and approvals on time.</li>
          <li>Make sure you have the rights to content, data and materials you give us.</li>
          <li>Comply with the laws that apply to your business, including privacy laws for your customers' data.</li>
        </ul>
        <h2>9. Ownership</h2>
        <ul>
          <li>Once paid in full, you own the final deliverables created for you, including code written specifically for you.</li>
          <li>Accounts are set up in your name wherever possible.</li>
          <li>We keep our pre-existing tools, templates and know-how, and grant you a permanent license to use them as part of your deliverables.</li>
          <li>We only publish a write-up of your project with your written permission.</li>
        </ul>
        <h2>10. Confidentiality</h2>
        <p>Both parties keep the other's confidential information private and use it only for the engagement, during and after it.</p>
        <h2>11. Third-party platforms and results</h2>
        <p>Much of our work relies on platforms we do not control. We cannot promise specific rankings, approvals, lead volumes or sales.</p>
        <h2>12. Support after launch</h2>
        <p>Every project includes 30 days of post-launch support to fix defects in what we delivered. After that, support is available through a monthly plan or quoted per request.</p>
        <h2>13. Cancellation</h2>
        <ul>
          <li><strong>Projects:</strong> you may cancel by written notice and pay for work completed; any excess deposit is refunded.</li>
          <li><strong>Monthly services:</strong> fees for a month that has started are not refundable; notice periods are in your agreement.</li>
          <li>Either party may end an engagement if the other seriously breaches these terms and does not fix the breach within 14 days of notice.</li>
        </ul>
        <h2>14. Liability</h2>
        <p>We carry out our work with reasonable skill and care. To the extent the law allows, our total liability under an engagement is limited to the fees you paid for that engagement in the 3 months before the claim, and we are not liable for indirect or consequential losses. Nothing limits liability that cannot be limited under applicable law.</p>
        <h2>15. Electronic communications</h2>
        <p>Proposals, approvals and notices may be given by email or electronic signature and are valid to the same extent as signed paper documents under applicable law.</p>
        <h2>16. Using this website</h2>
        <p>Content on this website is general information, not legal, financial or tax advice. Please do not misuse the site or its forms.</p>
        <h2>17. Governing law and disputes</h2>
        <p>The governing law and jurisdiction for an engagement are stated in your proposal or service agreement.${tbc('governing-law state', '')} We will first try to resolve any dispute in good faith.</p>
        <h2>18. Changes and contact</h2>
        <p>We may update these terms; the version in force when you approve a proposal applies to that engagement. Questions: ${mail}.</p>`;
}
function legalPage({ path, name, h1, leadUs, leadGh, usBody, ghBody, title, description }) {
  const crumbs = [{ name: 'Home', path: '/' }, { name, path }];
  const main = `    <section class="page-hero">
      <div class="wrap-narrow">
        ${breadcrumb(crumbs)}
        <p class="eyebrow">${esc(name)}</p>
        <h1>${esc(h1)}</h1>
        ${byRegion(`<p class="lead">${leadUs}</p>`, `<p class="lead">${leadGh}</p>`)}
        <p class="article-meta">Last updated: ${LEGAL_UPDATED}</p>
      </div>
    </section>
    <section>
      <div class="wrap-narrow prose">
        ${byRegion(usBody, ghBody)}
      </div>
    </section>`;
  return page({ title, description, path, jsonLd: [orgLd(), breadcrumbLd(crumbs)], main });
}
export function privacy() {
  const mail = `<a href="mailto:${site.email}">${esc(site.email)}</a>`;
  return legalPage({
    path: '/privacy/', name: 'Privacy Policy', h1: 'Privacy, plainly stated.',
    leadUs: 'How ShowMe Digital Agency collects, uses and protects personal information. We never sell your data.',
    leadGh: 'How ShowMe Digital Agency collects, uses and protects personal data, in line with Ghana\u2019s Data Protection Act, 2012 (Act 843).',
    usBody: usPrivacyBody(mail), ghBody: ghPrivacyBody(mail),
    title: 'Privacy Policy | ' + site.name,
    description: 'How ShowMe Digital Agency collects, uses and protects personal information. No advertising or tracking cookies, and we never sell your data.'
  });
}
export function terms() {
  const mail = `<a href="mailto:${site.email}">${esc(site.email)}</a>`;
  return legalPage({
    path: '/terms/', name: 'Terms of Service', h1: 'Terms of service.',
    leadUs: 'The terms that apply when you use this website or work with ShowMe Digital Agency.',
    leadGh: 'The terms that apply when you use this website or work with ShowMe Digital Agency. Written to be read, not skimmed.',
    usBody: usTermsBody(mail), ghBody: ghTermsBody(mail),
    title: 'Terms of Service | ' + site.name,
    description: 'ShowMe Digital Agency terms: proposals and scope, payment, preview before final payment, managed services, ownership, confidentiality and liability.'
  });
}

// ---- 404 ----------------------------------------------------------------------
export function notFound() {
  const main = `    <section class="page-hero">
      <div class="wrap-narrow center">
        <p class="eyebrow">404</p>
        <h1 style="margin-inline:auto">Page not found.</h1>
        <p class="lead" style="margin-inline:auto">The page you are looking for has moved or does not exist.</p>
        <div class="btn-row" style="justify-content:center"><a class="btn" href="/">Back to home</a><a class="btn secondary" href="/solutions/">Explore Our Solutions</a></div>
      </div>
    </section>`;
  return page({ title: 'Page not found | ' + site.name, description: 'The page you were looking for could not be found.', path: '/404.html', jsonLd: [orgLd()], main, noindex: true });
}
