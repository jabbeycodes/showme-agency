// ============================================================================
// Detail-page templates: service pages, pillar pages, industry pages.
// ============================================================================
import { site, serviceBySlug } from './data.mjs';
import { SHOW_PRICES } from './money.mjs';
import { PILLARS, pillarBySlug, SERVICE_PILLAR, GH_SERVICES, INDUSTRIES } from './content.mjs';
import {
  esc, page, breadcrumb, ctaBand, faqList, icon, ghOnly, usOnly,
  breadcrumbLd, serviceLd, faqLd, orgLd
} from './render.mjs';

const list = (items, cls = 'ticklist') => `<ul class="${cls}">${items.map(d => `<li>${esc(d)}</li>`).join('')}</ul>`;
const svcLink = s => `<li><a href="/services/${s.slug}/">${esc(s.title)}<span aria-hidden="true">&rarr;</span></a></li>`;

// Related-service list where Ghana-only services only appear in the Ghana view.
function relatedList(slugs) {
  const items = slugs.map(s => serviceBySlug[s]).filter(Boolean);
  const us = items.filter(s => !GH_SERVICES.has(s.slug));
  const gh = items.filter(s => GH_SERVICES.has(s.slug));
  if (!items.length) return '';
  return `<div class="side-card"><h3>Related services</h3><ul class="related-list">${us.map(svcLink).join('')}${ghOnly(gh.map(svcLink).join(''))}</ul></div>`;
}

// ---- Service page -----------------------------------------------------------
export function serviceDetail(s) {
  const pillar = pillarBySlug[SERVICE_PILLAR[s.slug]];
  if (!pillar) throw new Error('Service without pillar: ' + s.slug);
  const path = '/services/' + s.slug + '/';
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Solutions', path: '/solutions/' },
    { name: pillar.short, path: '/solutions/' + pillar.slug + '/' },
    { name: s.title, path }
  ];
  const pricing = SHOW_PRICES && s.pricing.price
    ? `<p><strong>${esc(s.pricing.price)}</strong></p><p class="lead" style="font-size:1rem">${esc(s.pricing.note)}</p>`
    : `<p>${esc(s.pricing.note)}</p><p>Every engagement starts with a fixed quote for the agreed scope. Projects are billed 50% to start and 50% on launch, after you approve a working preview; monthly services are billed in advance. <a href="/pricing/">How pricing works</a>.</p>`;

  const main = `    <section class="page-hero">
      <div class="wrap page-hero-grid">
        <div>
          ${breadcrumb(crumbs)}
          <p class="eyebrow">${esc(pillar.title)}</p>
          <h1>${esc(s.title)}</h1>
          <p class="lead">${esc(s.summary)}</p>
          <div class="btn-row">
            <a class="btn" href="/contact/">Book a Technology Consultation</a>
            <a class="btn secondary" href="/contact/">Request pricing</a>
          </div>
        </div>
        ${icon(pillar.icon, 'page-hero-icon')}
      </div>
    </section>

    <section>
      <div class="wrap detail-grid">
        <div class="detail-main">
          <div class="detail-block" data-reveal><h2>The problem it solves</h2><p>${esc(s.problem)}</p></div>
          <div class="detail-block" data-reveal><h2>What's included</h2>${list(s.deliverables)}</div>
          <div class="detail-block" data-reveal><h2>Who it's for</h2>${list(s.whoFor)}</div>
          <div class="detail-block" data-reveal><h2>What you can expect</h2>${list(s.outcomes)}</div>
          <div class="detail-block" data-reveal><h2>How we deliver it</h2><ol class="steps">${s.process.map(p => `<li><h3>${esc(p.t)}</h3><p>${esc(p.d)}</p></li>`).join('')}</ol></div>
          <div class="detail-block" data-reveal><h2>Pricing</h2>${pricing}</div>
          <div class="detail-block" data-reveal><h2>Frequently asked questions</h2>${faqList(s.faqs)}</div>
        </div>
        <aside class="detail-side" aria-label="Next steps">
          <div class="side-card">
            <h3>Discuss this service</h3>
            <p>Tell us what you need and we will reply ${esc(site.facts.responsePromise)} with next steps and a fixed quote.</p>
            <a class="btn" href="/contact/">Book a Technology Consultation</a>
            <a class="btn secondary" href="/contact/">Request pricing</a>
          </div>
          ${relatedList(s.related)}
          <div class="side-card"><h3>Part of</h3><ul class="related-list"><li><a href="/solutions/${pillar.slug}/">${esc(pillar.title)}<span aria-hidden="true">&rarr;</span></a></li></ul></div>
        </aside>
      </div>
    </section>

    ${ctaBand()}`;

  return page({
    title: (s.metaTitle || s.title) + ' | ' + site.name,
    description: s.metaDescription,
    path,
    jsonLd: [orgLd(), serviceLd({ name: s.title, description: s.metaDescription, path }), breadcrumbLd(crumbs), faqLd(s.faqs)],
    main
  });
}

// ---- Pillar page ------------------------------------------------------------
export function pillarPage(p, extra = '') {
  const path = '/solutions/' + p.slug + '/';
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Solutions', path: '/solutions/' }, { name: p.short, path }];
  const cards = p.items.map(it => {
    const s = it.link && serviceBySlug[it.link];
    const inner = `<h3>${esc(it.t)}</h3><p>${esc(it.d)}</p>`;
    return s
      ? `<a class="card" href="/services/${s.slug}/" data-reveal>${inner}<span class="card-cta">${esc(s.title)}</span></a>`
      : `<div class="card" data-reveal>${inner}</div>`;
  }).join('');
  const svc = p.services.map(x => serviceBySlug[x]).filter(Boolean);
  const ghSvc = p.ghServices.map(x => serviceBySlug[x]).filter(Boolean);
  const inds = INDUSTRIES.filter(i => i.help.some(h => h[0] === p.slug)).slice(0, 6);

  const main = `    <section class="page-hero">
      <div class="wrap page-hero-grid">
        <div>
          ${breadcrumb(crumbs)}
          <p class="eyebrow">Solution ${esc(p.letter)}</p>
          <h1>${esc(p.title)}</h1>
          <p class="lead">${esc(p.intro)}</p>
          <div class="btn-row">
            <a class="btn" href="/contact/">Book a Technology Consultation</a>
            ${p.slug === 'managed-it' ? '<a class="btn secondary" href="/managed-it-services/">See the managed IT packages</a>' : '<a class="btn secondary" href="/contact/">Request pricing</a>'}
          </div>
        </div>
        ${icon(p.icon, 'page-hero-icon')}
      </div>
    </section>

    <section>
      <div class="wrap">
        <div class="section-head"><p class="eyebrow">What we deliver</p><h2>Services in this area</h2></div>
        <div class="grid grid-3">${cards}</div>
      </div>
    </section>
${extra}
    <section class="section-alt">
      <div class="wrap split">
        <div>
          <p class="eyebrow">How an engagement starts</p>
          <h2>Assessment first. Then a plan you approve.</h2>
          <p>Every engagement begins with a consultation and a short assessment. You receive written recommendations and a fixed proposal before any work starts. <a href="/how-we-work/">How we work</a>.</p>
        </div>
        <div class="panel">
          <h3>All services in this area</h3>
          <ul class="related-list">${svc.map(svcLink).join('')}${ghOnly(ghSvc.map(svcLink).join(''))}</ul>
        </div>
      </div>
    </section>

    <section>
      <div class="wrap">
        <div class="section-head"><p class="eyebrow">Industries</p><h2>Where this makes a difference</h2></div>
        <div class="grid grid-3">${inds.map(i => `<a class="card" href="/industries/${i.slug}/" data-reveal>${icon(i.icon)}<h3>${esc(i.title)}</h3><p>${esc(i.help.find(h => h[0] === p.slug)[1])}</p><span class="card-cta">Read more</span></a>`).join('')}</div>
      </div>
    </section>

    ${ctaBand()}`;

  return page({
    title: p.metaTitle + ' | ' + site.name,
    description: p.metaDescription,
    path,
    jsonLd: [orgLd(), serviceLd({ name: p.title, description: p.metaDescription, path }), breadcrumbLd(crumbs)],
    main
  });
}

// ---- Industry page (new, US-neutral) ---------------------------------------
export function industryPage(i) {
  const path = '/industries/' + i.slug + '/';
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Industries', path: '/industries/' }, { name: i.title, path }];
  const help = i.help.map(([slug, text]) => {
    const p = pillarBySlug[slug];
    return `<a class="card" href="/solutions/${p.slug}/" data-reveal>${icon(p.icon)}<p class="card-kicker">${esc(p.short)}</p><p>${esc(text)}</p><span class="card-cta">Explore</span></a>`;
  }).join('');
  const svc = i.services.map(x => serviceBySlug[x]).filter(Boolean);
  const main = `    <section class="page-hero">
      <div class="wrap page-hero-grid">
        <div>
          ${breadcrumb(crumbs)}
          <p class="eyebrow">Industries</p>
          <h1>${esc(i.title)}</h1>
          <p class="lead">${esc(i.summary)}</p>
          <div class="btn-row"><a class="btn" href="/contact/">Book a Technology Consultation</a><a class="btn secondary" href="/solutions/">Explore Our Solutions</a></div>
        </div>
        ${icon(i.icon, 'page-hero-icon')}
      </div>
    </section>

    <section>
      <div class="wrap split">
        <div>
          <p class="eyebrow">Common challenges</p>
          <h2>What we often hear</h2>
          ${list(i.challenges, 'crosslist')}
          ${i.note ? `<p class="note">${esc(i.note)}</p>` : ''}
        </div>
        <div class="panel">
          <h3>Where to start</h3>
          <p>A technology consultation and short assessment of your current setup. You get a prioritised list of recommendations and a fixed proposal for anything you want us to take on.</p>
          <h3 style="margin-top:22px">Relevant services</h3>
          <ul class="related-list">${svc.map(svcLink).join('')}</ul>
        </div>
      </div>
    </section>

    <section class="section-alt">
      <div class="wrap">
        <div class="section-head"><p class="eyebrow">How we help</p><h2>One partner across your technology</h2></div>
        <div class="grid grid-2">${help}</div>
      </div>
    </section>

    ${ctaBand()}`;
  return page({
    title: i.metaTitle + ' | ' + site.name,
    description: i.metaDescription,
    path,
    jsonLd: [orgLd(), breadcrumbLd(crumbs)],
    main
  });
}

// ---- Ghana-view-only legacy industry pages ---------------------------------
export function ghIndustryPage(i) {
  const path = '/industries/' + i.slug + '/';
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Industries', path: '/industries/' }, { name: i.title, path }];
  const svc = (i.relatedServices || []).map(x => serviceBySlug[x]).filter(Boolean);
  const main = `    <section class="page-hero">
      <div class="wrap page-hero-grid">
        <div>
          ${breadcrumb(crumbs)}
          <p class="eyebrow">Industries · Ghana</p>
          <h1>${esc(i.title)}</h1>
          <p class="lead">${esc(i.summary)}</p>
          <div class="btn-row"><a class="btn" href="/contact/">Book a Technology Consultation</a><a class="btn secondary" href="/industries/">All industries</a></div>
        </div>
        ${icon('realestate', 'page-hero-icon')}
      </div>
    </section>
    <section>
      <div class="wrap split">
        <div>
          <h2>Typical problems</h2>${list(i.problems, 'crosslist')}
          <h2 style="margin-top:28px">What we build</h2>${list(i.whatWeBuild)}
          ${i.note ? `<p class="note">${esc(i.note)}</p>` : ''}
        </div>
        <div class="panel">
          <h3>Where we start</h3><p>${esc(i.starter)}</p>
          <h3 style="margin-top:22px">Relevant services</h3>
          <ul class="related-list">${svc.map(svcLink).join('')}</ul>
        </div>
      </div>
    </section>
    ${ctaBand()}`;
  return page({ title: i.title + ' in Ghana | ' + site.name, description: i.metaDescription, path, jsonLd: [orgLd(), breadcrumbLd(crumbs)], main });
}
