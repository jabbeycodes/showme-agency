// ============================================================================
// ShowMe Digital Agency — rendering helpers and shared partials (2026-10
// repositioning). Pure string templates; output is plain static HTML with no
// inline scripts (CSP script-src 'self').
//
// REGION MODEL (United States default, Ghana alternate):
//   - usOnly(html)  -> <div data-us-only>…</div>: shown by default, removed by
//                      the edge worker for Ghana visitors.
//   - ghOnly(html)  -> <template data-gh-block>…</template>: inert (not
//                      rendered, not in the accessibility tree) by default;
//                      the worker unwraps it for Ghana visitors.
//   - {{token}} wording -> <span data-us data-gh> (scripts/region.mjs).
// check.mjs builds both views and fails if the US view mentions Ghana terms.
// ============================================================================
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { site } from './data.mjs';
import { PILLARS, INDUSTRIES, GH_INDUSTRIES } from './content.mjs';

export function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function assetVersion(file) {
  const buf = readFileSync(new URL('../static/' + file, import.meta.url));
  return createHash('sha256').update(buf).digest('hex').slice(0, 10);
}
export const ASSET_V = { css: assetVersion('styles.css'), js: assetVersion('site.js') };

const SHORT_BRAND = 'ShowMe Agency';
export function seoTitle(title) {
  if (title.length <= 65) return title;
  for (const sep of [' | ', ' — ']) {
    const suffix = sep + site.name;
    if (title.endsWith(suffix)) {
      const base = title.slice(0, -suffix.length);
      return base.length + 3 + SHORT_BRAND.length <= 68 ? base + ' | ' + SHORT_BRAND : base;
    }
  }
  return title;
}
export function url(path) { return site.origin + path; }

// ---- Region helpers ---------------------------------------------------------
export function usOnly(html, tag = 'div') { return html ? `<${tag} data-us-only>${html}</${tag}>` : ''; }
export function ghOnly(html) { return html ? `<template data-gh-block>${html}</template>` : ''; }
export function byRegion(us, gh, tag = 'div') { return usOnly(us, tag) + ghOnly(gh); }

// ---- Placeholders awaiting Josh's confirmation -----------------------------
// Rendered visibly so nobody mistakes them for confirmed facts; the build
// lists every one in repositioning/placeholders.md.
export function tbc(text) { return `<span class="tbc">[TO CONFIRM: ${esc(text)}]</span>`; }
export function tbcBlock(text) { return `<p class="tbc-block">[TO CONFIRM: ${esc(text)}]</p>`; }

// ---- Icons (single consistent line set, 24px grid) -------------------------
const ICON_PATHS = {
  'managed-it': '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4M7 8h4M7 11h7"/>',
  'digital-marketing': '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/><path d="M15 8h4v4"/>',
  'ai-automation': '<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/>',
  'software-consulting': '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>',
  flagship: '<path d="M4 14a8 8 0 0116 0"/><rect x="2.5" y="13" width="4" height="6" rx="1.5"/><rect x="17.5" y="13" width="4" height="6" rx="1.5"/><path d="M19.5 19c0 1.4-1.3 2-2.8 2H14"/>',
  healthcare: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M12 8v8M8 12h8"/>',
  professional: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18"/>',
  schools: '<path d="M2 9l10-5 10 5-10 5-10-5z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>',
  nonprofits: '<path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z"/>',
  retail: '<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 016 0v2"/>',
  startups: '<path d="M12 2c3 2 5 5.5 5 10l-2.5 4h-5L7 12c0-4.5 2-8 5-10z"/><circle cx="12" cy="9" r="1.8"/><path d="M9.5 16l-2 4M14.5 16l2 4"/>',
  realestate: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',
  assess: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  roadmap: '<path d="M4 6h10M4 12h16M4 18h7"/><circle cx="17" cy="6" r="2"/><circle cx="14" cy="18" r="2"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
  doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3"/>'
};
export function icon(name, cls = 'icon') {
  const p = ICON_PATHS[name];
  if (!p) throw new Error('Unknown icon ' + name);
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${p}</svg>`;
}

const BRAND_MARK = '<svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><rect x="1" y="1" width="30" height="30" rx="7" fill="#0b1b33"/><path d="M9 11.5h9.5a3.5 3.5 0 010 7H13a3.5 3.5 0 000 7h9.5" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><circle cx="23" cy="9" r="2.2" fill="#3b8fe0"/></svg>';

// ---- Head / SEO -------------------------------------------------------------
export const DEFAULT_OG = { url: site.origin + '/og-image.png', w: 1200, h: 630, alt: 'ShowMe Digital Agency: managed IT, AI automation, software development and digital marketing for growing businesses.' };

export function head({ title, description, path, jsonLd = [], noindex = false, ogType = 'website', ogImage = null }) {
  title = seoTitle(title);
  const og = ogImage || DEFAULT_OG;
  const canonical = url(path);
  const ld = jsonLd.map(obj => `\n  <script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`).join('');
  return `<!doctype html>
<html lang="en" data-region="us">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="color-scheme" content="light" />
  <meta name="theme-color" content="#0b1b33" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />${noindex ? '\n  <meta name="robots" content="noindex,follow" />' : ''}
  <link rel="canonical" href="${esc(canonical)}" />
  <link rel="stylesheet" href="/styles.css?v=${ASSET_V.css}" />
  <link rel="icon" href="/favicon.ico" sizes="32x32" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <meta name="google-site-verification" content="o66F5PoD6Zr5UhiTewAyqd8GuqF-CE_62HYBbjvLxN8" />
  <meta property="og:type" content="${esc(ogType)}" />
  <meta property="og:site_name" content="${esc(site.name)}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${esc(canonical)}" />
  <meta property="og:image" content="${esc(og.url)}" />
  <meta property="og:image:width" content="${og.w}" />
  <meta property="og:image:height" content="${og.h}" />
  <meta property="og:image:alt" content="${esc(og.alt)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${esc(og.url)}" />
  <script src="/site.js?v=${ASSET_V.js}" defer></script>${ld}
</head>`;
}

// ---- Founder photo ----------------------------------------------------------
export const FOUNDER_ALT = 'Joshua Abbey, founder of ShowMe Digital Agency';
export function founderPhoto({ size = 160, lazy = true, small = false } = {}) {
  const load = lazy ? ' loading="lazy" decoding="async"' : ' decoding="async"';
  if (small) return `<picture><source type="image/webp" srcset="/assets/joshua-abbey-192.webp"><img src="/assets/joshua-abbey-192.jpg" width="${size}" height="${size}" alt="${FOUNDER_ALT}"${load}></picture>`;
  return `<picture><source type="image/webp" srcset="/assets/joshua-abbey-400.webp 400w, /assets/joshua-abbey.webp 800w" sizes="${size}px"><img src="/assets/joshua-abbey-400.jpg" srcset="/assets/joshua-abbey-400.jpg 400w, /assets/joshua-abbey.jpg 800w" sizes="${size}px" width="${size}" height="${size}" alt="${FOUNDER_ALT}"${load}></picture>`;
}

// ---- Structured data --------------------------------------------------------
// No ratings, reviews, awards or invented facts. Head/JSON-LD always carry the
// US (default) view, so no location beyond the country is given.
export function orgLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': site.origin + '/#organization',
    name: site.name,
    url: site.origin + '/',
    logo: site.origin + '/icon-512.png',
    email: site.email,
    description: 'Technology and digital transformation partner: managed IT and infrastructure, AI and automation, software development and digital marketing for growing businesses.',
    founder: { '@type': 'Person', name: site.founder, image: site.founderImage, url: site.origin + '/about/' },
    contactPoint: [{ '@type': 'ContactPoint', contactType: 'sales', email: site.email, telephone: '+' + site.whatsappNumber, availableLanguage: ['English'] }],
    knowsAbout: PILLARS.map(p => p.title),
    sameAs: []
  };
}
export function professionalServiceLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': site.origin + '/#service',
    name: site.name,
    url: site.origin + '/',
    image: DEFAULT_OG.url,
    email: site.email,
    telephone: '+' + site.whatsappNumber,
    description: 'Managed IT services, AI and automation, software development and digital marketing, delivered as one accountable technology partner.',
    address: { '@type': 'PostalAddress', addressCountry: 'US' },
    areaServed: { '@type': 'Country', name: 'United States' },
    parentOrganization: { '@id': site.origin + '/#organization' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog', name: 'Solutions',
      itemListElement: PILLARS.map(p => ({ '@type': 'OfferCatalog', name: p.title, url: url('/solutions/' + p.slug + '/') }))
    }
  };
}
export function breadcrumbLd(items) {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: url(it.path) }))
  };
}
export function faqLd(faqs) {
  const strip = s => String(s).replace(/<[^>]+>/g, '');
  return {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: strip(f.q), acceptedAnswer: { '@type': 'Answer', text: strip(f.a) } }))
  };
}
export function serviceLd({ name, description, path, serviceType }) {
  return {
    '@context': 'https://schema.org', '@type': 'Service', name, description,
    serviceType: serviceType || name,
    provider: { '@id': site.origin + '/#organization', '@type': 'Organization', name: site.name, url: site.origin + '/' },
    url: url(path)
  };
}

// ---- Header / navigation ----------------------------------------------------
const CARET = '<svg class="caret" viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M1.5 3.5L5 7l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
function menu(id, label, items, foot) {
  const li = items.map(i => `<li><a href="${i.href}">${esc(i.label)}${i.small ? `<small>${esc(i.small)}</small>` : ''}</a></li>`).join('');
  return `<li class="has-menu">
        <button class="nav-trigger" type="button" aria-expanded="false" aria-controls="${id}">${esc(label)} ${CARET}</button>
        <div class="menu" id="${id}"><ul>${li}</ul>${foot || ''}</div>
      </li>`;
}
export function header() {
  const solutions = [
    { href: '/managed-it-services/', label: 'Managed IT Services', small: 'Your complete IT department, as a monthly service' },
    ...PILLARS.map(p => ({ href: '/solutions/' + p.slug + '/', label: p.title }))
  ];
  const inds = INDUSTRIES.map(i => ({ href: '/industries/' + i.slug + '/', label: i.title }));
  const ghInds = ghOnly(GH_INDUSTRIES.map(i => `<li><a href="/industries/${i.slug}/">${esc(i.title)}</a></li>`).join(''));
  return `<a class="skip-link" href="#main">Skip to content</a>
<header class="topbar">
  <nav class="wrap nav" aria-label="Primary">
    <a class="brand" href="/">${BRAND_MARK}<span>ShowMe <small>Digital Agency</small></span></a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="navPanel" aria-label="Menu"><span></span></button>
    <div class="nav-panel" id="navPanel">
      <ul class="nav-links">
      ${menu('menuSolutions', 'Solutions', solutions, '<div class="menu-foot"><a href="/solutions/">All solutions</a></div>')}
      ${menu('menuIndustries', 'Industries', inds, `<div class="menu-foot">${ghInds ? `<ul>${ghInds}</ul>` : ''}<a href="/industries/">All industries</a></div>`)}
      <li><a href="/how-we-work/">How we work</a></li>
      <li><a href="/insights/">Insights</a></li>
      ${menu('menuCompany', 'Company', [
        { href: '/about/', label: 'About us' },
        { href: '/about/#leadership', label: 'Leadership' },
        { href: '/capabilities/', label: 'Capabilities' },
        { href: '/trust/', label: 'Trust & data handling' },
        { href: '/pricing/', label: 'How pricing works' },
        { href: '/faq/', label: 'FAQ' }
      ])}
      </ul>
      <a class="btn small" href="/contact/">Book a Technology Consultation</a>
    </div>
  </nav>
</header>`;
}

// ---- Footer -----------------------------------------------------------------
export function regionSwitch() {
  return `<nav class="region" aria-label="Region"><span>Region:</span> <a href="?region=us" data-set-region="us" aria-current="true">United States</a><span class="region-sep" aria-hidden="true">|</span><a href="?region=gh" data-set-region="gh" aria-current="false">Ghana</a></nav>`;
}
export function footer() {
  const col = (title, links, extra = '') =>
    `<div><h2>${esc(title)}</h2><ul>${links.map(l => `<li><a href="${l.href}"${l.ext ? ' target="_blank" rel="noopener"' : ''}>${esc(l.label)}</a></li>`).join('')}${extra}</ul></div>`;
  const ghServices = ghOnly(`<li><a href="/services/whatsapp-ordering-booking/">WhatsApp ordering &amp; booking</a></li><li><a href="/services/photography-video/">Photography &amp; video</a></li>` +
    GH_INDUSTRIES.map(i => `<li><a href="/industries/${i.slug}/">${esc(i.title)}</a></li>`).join(''));
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="brand" href="/">${BRAND_MARK}<span>ShowMe <small>Digital Agency</small></span></a>
        <p>Managed IT, AI and automation, software and digital marketing from one accountable technology partner. ${esc(site.facts.experience)} of experience and ${esc(site.facts.businessesHelped)} businesses helped.</p>
        ${ghOnly(`<p>${esc(site.locationLine)}.</p>`)}
        ${regionSwitch()}
      </div>
      ${col('Solutions', [{ href: '/managed-it-services/', label: 'Managed IT Services' }, ...PILLARS.map(p => ({ href: '/solutions/' + p.slug + '/', label: p.short }))], ghServices)}
      ${col('Industries', INDUSTRIES.map(i => ({ href: '/industries/' + i.slug + '/', label: i.title })))}
      ${col('Company', [
        { href: '/about/', label: 'About' },
        { href: '/how-we-work/', label: 'How we work' },
        { href: '/capabilities/', label: 'Capabilities' },
        { href: '/trust/', label: 'Trust & data handling' },
        { href: '/pricing/', label: 'How pricing works' },
        { href: '/insights/', label: 'Insights' },
        { href: '/faq/', label: 'FAQ' }
      ])}
      ${col('Contact', [
        { href: '/contact/', label: 'Book a Technology Consultation' },
        { href: '/free-audit/', label: 'Free digital presence check' },
        { href: 'mailto:' + site.email, label: site.email },
        { href: 'https://wa.me/' + site.whatsappNumber, label: 'WhatsApp ' + site.whatsappDisplay, ext: true }
      ])}
    </div>
    <div class="footer-bottom">
      <span>&copy; <span data-year>2026</span> ${esc(site.name)}</span>
      <span class="footer-legal"><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="/trust/">Data handling</a><a href="/sitemap.xml">Sitemap</a></span>
    </div>
  </div>
</footer>`;
}

// ---- Breadcrumb -------------------------------------------------------------
export function breadcrumb(items) {
  const li = items.map((it, i) => i === items.length - 1
    ? `<li><span aria-current="page">${esc(it.name)}</span></li>`
    : `<li><a href="${it.path}">${esc(it.name)}</a></li>`).join('');
  return `<nav class="breadcrumb" aria-label="Breadcrumb"><ol>${li}</ol></nav>`;
}

// ---- CTA band ---------------------------------------------------------------
export function ctaBand(opts = {}) {
  const heading = opts.heading || 'Talk to us about your technology priorities.';
  const text = opts.text || 'Book a technology consultation. We listen first, then recommend the next practical step, whether or not it involves us.';
  return `<section class="cta-band" aria-labelledby="cta-heading">
    <div class="wrap inner">
      <div>
        <h2 id="cta-heading">${esc(heading)}</h2>
        <p>${esc(text)}</p>
      </div>
      <div class="btn-row">
        <a class="btn on-dark" href="/contact/">Book a Technology Consultation</a>
        <a class="btn ghost-dark" href="${opts.secondaryHref || '/solutions/'}">${esc(opts.secondaryLabel || 'Explore Our Solutions')}</a>
      </div>
    </div>
  </section>`;
}

// ---- FAQ (native details/summary: works without JS) ------------------------
export function faqList(faqs) {
  return `<div class="faq">${faqs.map(f => `<details><summary>${f.qHtml || esc(f.q)}</summary><div class="faq-a"><p>${f.aHtml || esc(f.a)}</p></div></details>`).join('')}</div>`;
}

// ---- Cards ------------------------------------------------------------------
export function serviceCard(s) {
  return `<a class="card" href="/services/${s.slug}/" data-reveal>
    <h3>${esc(s.title)}</h3>
    <p>${esc(s.summary)}</p>
    <span class="card-cta">Learn more</span>
  </a>`;
}

// ---- Page assembly ----------------------------------------------------------
export function page({ title, description, path, jsonLd = [], main, noindex, ogType, ogImage }) {
  return `${head({ title, description, path, jsonLd, noindex, ogType, ogImage })}
<body>
  ${header()}
  <main id="main">
${main}
  </main>
  ${footer()}
</body>
</html>`;
}
