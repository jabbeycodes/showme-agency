// ============================================================================
// Detail-page templates: service pages and industry pages (shared layout)
// ============================================================================
import { site, divisionBySlug, serviceBySlug } from './data.mjs';
import {
  esc, page, breadcrumb, ctaBand, faqAccordion,
  breadcrumbLd, serviceLd, faqLd, orgLd
} from './render.mjs';

function waLink(text) { return 'https://wa.me/' + site.whatsappNumber + '?text=' + encodeURIComponent(text); }

function priceBlock(pricing) {
  const isPlaceholder = pricing.placeholder;
  const priceHtml = isPlaceholder
    ? `<!-- TODO(founder): confirm pricing / replace "From GHS [TBD]" with a real starting figure -->
       <div class="placeholder"><p><strong>${esc(pricing.price)}</strong><br>${esc(pricing.note)}</p></div>`
    : `<div class="price">${esc(pricing.price)}</div><p style="color:var(--text-muted);font-size:14px;margin:0">${esc(pricing.note)}</p>`;
  return priceHtml;
}

export function serviceDetail(s) {
  const division = divisionBySlug[s.division];
  const path = '/services/' + s.slug + '/';
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services/' },
    { name: s.title, path }
  ];

  const deliverables = `<ul class="ticklist">${s.deliverables.map(d => `<li>${esc(d)}</li>`).join('')}</ul>`;
  const whoFor = `<ul class="ticklist">${s.whoFor.map(d => `<li>${esc(d)}</li>`).join('')}</ul>`;
  const outcomes = `<ul class="ticklist">${s.outcomes.map(d => `<li>${esc(d)}</li>`).join('')}</ul>`;
  const process = `<ol class="numsteps">${s.process.map(p => `<li><strong>${esc(p.t)}</strong>${esc(p.d)}</li>`).join('')}</ol>`;

  const related = s.related.map(slug => serviceBySlug[slug]).filter(Boolean);
  const relatedList = related.length
    ? `<div class="side-card"><h3>Related services</h3><ul class="related-list">${related.map(r => `<li><a href="/services/${r.slug}/">${esc(r.title)}<span aria-hidden="true">→</span></a></li>`).join('')}</ul></div>`
    : '';

  const main = `    <section class="page-hero">
      <div class="wrap">
        ${breadcrumb(crumbs)}
        <p class="kicker">${esc(division.title)}</p>
        <h1>${esc(s.title)}</h1>
        <p class="lead">${esc(s.summary)}</p>
        <div class="btn-row">
          <a class="btn" href="/free-audit/"><span>Get a free audit →</span></a>
          <a class="btn secondary" href="/contact/"><span>Request a quote</span></a>
        </div>
      </div>
    </section>

    <section>
      <div class="wrap detail-grid">
        <div class="detail-main">
          <div class="detail-block" data-reveal>
            <h2>The problem it solves</h2>
            <p style="color:var(--text-muted);max-width:60ch">${esc(s.problem)}</p>
          </div>
          <div class="detail-block" data-reveal>
            <h2>What's included</h2>
            ${deliverables}
          </div>
          <div class="detail-block" data-reveal>
            <h2>Who it's for</h2>
            ${whoFor}
          </div>
          <div class="detail-block" data-reveal>
            <h2>The outcomes</h2>
            ${outcomes}
          </div>
          <div class="detail-block" data-reveal>
            <h2>How we work</h2>
            ${process}
          </div>
          <div class="detail-block" data-reveal>
            <h2>How pricing works</h2>
            ${priceBlock(s.pricing)}
          </div>
          <div class="detail-block" data-reveal>
            <h2>Frequently asked questions</h2>
            ${faqAccordion(s.faqs, s.slug)}
          </div>
        </div>
        <aside class="detail-side">
          <div class="side-card">
            <h3>Start here</h3>
            ${s.pricing.placeholder ? '' : `<div class="price">${esc(s.pricing.price)}</div>`}
            <p style="color:var(--text-muted);font-size:14px;margin:0 0 16px">${s.slug === 'growth-retainer' ? esc(s.pricing.note) : 'Book a free audit or request a custom quote — we reply ' + site.facts.responsePromise + '.'}</p>
            <div class="btn-row" style="display:grid">
              <a class="btn" href="/free-audit/"><span>Get a free audit →</span></a>
              <a class="btn whatsapp" href="${waLink('Hi ShowMe, I\'m interested in ' + s.title + '.')}" target="_blank" rel="noopener"><span>Ask on WhatsApp</span></a>
            </div>
          </div>
          ${relatedList}
        </aside>
      </div>
    </section>

    ${ctaBand()}`;

  return page({
    title: (s.metaTitle || s.title) + ' — ' + site.name,
    description: s.metaDescription,
    path,
    jsonLd: [orgLd(), serviceLd(s), breadcrumbLd(crumbs), faqLd(s.faqs)],
    main
  });
}

export function industryDetail(i) {
  const path = '/industries/' + i.slug + '/';
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Industries', path: '/industries/' },
    { name: i.title, path }
  ];

  const problems = `<ul class="ticklist">${i.problems.map(p => `<li>${esc(p)}</li>`).join('')}</ul>`;
  const build = `<ul class="ticklist">${i.whatWeBuild.map(p => `<li>${esc(p)}</li>`).join('')}</ul>`;
  const related = (i.relatedServices || []).map(slug => serviceBySlug[slug]).filter(Boolean);
  const relatedGrid = related.length
    ? `<div class="grid grid-2">${related.map(r => `<a class="card" href="/services/${r.slug}/" data-reveal><h3>${esc(r.title)}</h3><p>${esc(r.summary)}</p><span class="card-cta">Learn more →</span></a>`).join('')}</div>`
    : '';

  const todo = i.todo
    ? `<!-- TODO(founder): ${esc(i.todo)} -->\n          <div class="placeholder" data-reveal><p>${esc(i.todo)}</p></div>`
    : '';

  const main = `    <section class="page-hero">
      <div class="wrap">
        ${breadcrumb(crumbs)}
        <p class="kicker">Industries</p>
        <h1>${esc(i.title)}</h1>
        <p class="lead">${esc(i.summary)}</p>
        <div class="btn-row">
          <a class="btn" href="/free-audit/"><span>Get a free audit →</span></a>
          <a class="btn secondary" href="/contact/"><span>Talk to us</span></a>
        </div>
      </div>
    </section>

    <section>
      <div class="wrap detail-grid">
        <div class="detail-main">
          <div class="detail-block" data-reveal>
            <h2>Typical problems</h2>
            ${problems}
          </div>
          <div class="detail-block" data-reveal>
            <h2>What we build</h2>
            ${build}
          </div>
          <div class="detail-block" data-reveal>
            <h2>Where we start</h2>
            <p style="color:var(--text-muted);max-width:60ch">${esc(i.starter)}</p>
            ${todo}
          </div>
          <div class="detail-block" data-reveal>
            <h2>Relevant services</h2>
            ${relatedGrid}
          </div>
        </div>
        <aside class="detail-side">
          <div class="side-card">
            <h3>Recommended starter</h3>
            <p style="color:var(--text-muted);font-size:14px;margin:0 0 16px">${esc(i.starter)}</p>
            <div class="btn-row" style="display:grid">
              <a class="btn" href="/free-audit/"><span>Get a free audit →</span></a>
              <a class="btn whatsapp" href="${waLink('Hi ShowMe, I run a business in ' + i.title + ' and would like to chat.')}" target="_blank" rel="noopener"><span>Ask on WhatsApp</span></a>
            </div>
          </div>
          <div class="side-card">
            <h3>Don't see your fit?</h3>
            <p style="color:var(--text-muted);font-size:14px;margin:0 0 16px">We work across many sectors. Tell us your situation and we'll map the right approach.</p>
            <a class="btn secondary" href="/contact/" style="width:100%"><span>Contact us</span></a>
          </div>
        </aside>
      </div>
    </section>

    ${ctaBand()}`;

  return page({
    title: i.title + ' — Digital Solutions in Ghana | ' + site.name,
    description: i.metaDescription,
    path,
    jsonLd: [orgLd(), breadcrumbLd(crumbs)],
    main
  });
}
