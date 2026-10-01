// ============================================================================
// ShowMe Digital Agency — rendering helpers and shared partials
// Pure string templates. No framework, output is plain static HTML.
// ============================================================================
import { site, divisions, services, servicesByDivision, industries, serviceBySlug, bookCallUrl, bookCallMailto } from './data.mjs';

export function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function url(path) {
  return site.origin + path;
}

// ---- Head / SEO -------------------------------------------------------------
export function head({ title, description, path, jsonLd = [], noindex = false, ogType = 'website' }) {
  const canonical = url(path);
  const ld = jsonLd.map(obj => `\n  <script type="application/ld+json">${JSON.stringify(obj)}</script>`).join('');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="color-scheme" content="dark light" />
  <meta name="theme-color" content="#07111f" />
  <link rel="icon" href="/favicon.ico" sizes="32x32" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />${noindex ? '\n  <meta name="robots" content="noindex,follow" />' : ''}
  <link rel="canonical" href="${esc(canonical)}" />
  <meta property="og:type" content="${esc(ogType)}" />
  <meta property="og:site_name" content="${esc(site.name)}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${esc(canonical)}" />
  <meta property="og:image" content="${esc(site.ogImage)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="ShowMe Digital Agency: Build. Grow. Automate. Websites, growth and automation for Ghanaian businesses." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${esc(site.ogImage)}" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@500;600;700;800&family=Public+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles.css" />${ld}
</head>`;
}

// ---- Structured data helpers ------------------------------------------------
export function orgLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: site.origin + '/',
    email: site.email,
    founder: { '@type': 'Person', name: site.founder },
    address: { '@type': 'PostalAddress', addressLocality: 'Accra', addressCountry: 'GH' },
    sameAs: []
  };
}

export function breadcrumbLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem', position: i + 1, name: it.name, item: url(it.path)
    }))
  };
}

export function faqLd(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question', name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  };
}

export function serviceLd(service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.metaDescription,
    serviceType: service.title,
    provider: { '@type': 'Organization', name: site.name, url: site.origin + '/' },
    areaServed: { '@type': 'Country', name: 'Ghana' },
    url: url('/services/' + service.slug + '/')
  };
}

// ---- Header / navigation ----------------------------------------------------
export function header() {
  const megaCols = divisions.map(d => {
    const items = servicesByDivision(d.slug).map(s =>
      `<a href="/services/${s.slug}/">${esc(s.title)}<small>${esc(s.summary)}</small></a>`
    ).join('');
    return `<div class="mega-col"><p class="mega-division">${esc(d.title)}</p>${items}</div>`;
  }).join('');

  return `<a class="skip-link" href="#main">Skip to content</a>
<div class="scroll-progress" aria-hidden="true"></div>
<header class="topbar">
  <nav class="wrap nav" aria-label="Primary">
    <a class="brand" href="/"><span>ShowMe<span class="dot">.</span></span><small>Digital Agency</small></a>
    <ul class="nav-links" id="navLinks">
      <li>
        <button class="nav-trigger" type="button" aria-expanded="false" aria-controls="megaServices" aria-haspopup="true">Services <span class="caret" aria-hidden="true">▾</span></button>
        <div class="mega" id="megaServices" role="menu" aria-label="Services">
          <p class="mega-group-title">Services by division</p>
          ${megaCols}
          <p class="mega-group-title"><a href="/services/">View all services →</a></p>
        </div>
      </li>
      <li><a href="/industries/">Industries</a></li>
      <li><a href="/pricing/">Pricing</a></li>
      <li><a href="/work/">Work</a></li>
      <li><a href="/about/">About</a></li>
      <li><a href="/contact/">Contact</a></li>
      <li><a class="nav-cta" href="/free-audit/">Free audit</a></li>
    </ul>
    <a class="nav-cta desktop-cta" href="/free-audit/">Free audit</a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="navLinks" aria-label="Menu"><span></span></button>
  </nav>
</header>`;
}

// ---- Footer -----------------------------------------------------------------
export function footer() {
  const col = (title, links) =>
    `<div class="footer-col"><h4>${esc(title)}</h4><ul>${links.map(l => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join('')}</ul></div>`;

  const featuredServices = ['growth-retainer', 'business-websites', 'ecommerce-momo', 'whatsapp-ai-assistant', 'seo-programme', 'ai-search-visibility']
    .map(slug => serviceBySlug[slug]).filter(Boolean)
    .map(s => ({ href: '/services/' + s.slug + '/', label: s.title }));

  return `<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="brand" href="/"><span>ShowMe<span class="dot">.</span></span></a>
        <p>${esc(site.strapline)}. We build websites, grow demand and automate the systems behind your customer journey — from ${esc(site.location)}.</p>
        <p style="margin-top:14px"><a href="mailto:${site.email}">${esc(site.email)}</a><br><a href="${'https://wa.me/' + site.whatsappNumber}" target="_blank" rel="noopener">WhatsApp ${esc(site.whatsappDisplay)}</a></p>
      </div>
      ${col('Services', [{ href: '/services/', label: 'All services' }, ...featuredServices])}
      ${col('Explore', [
        { href: '/industries/', label: 'Industries' },
        { href: '/pricing/', label: 'Pricing' },
        { href: '/process/', label: 'Process' },
        { href: '/work/', label: 'Work & results' },
        { href: '/insights/', label: 'Insights' }
      ])}
      ${col('Company', [
        { href: '/about/', label: 'About' },
        { href: '/free-audit/', label: 'Free audit' },
        { href: '/contact/', label: 'Contact & booking' },
        { href: '/faq/', label: 'FAQ' },
        { href: '/about/#partners', label: 'Partners & careers' }
      ])}
      ${col('Legal', [
        { href: '/privacy/', label: 'Privacy' },
        { href: '/terms/', label: 'Terms' }
      ])}
    </div>
    <div class="footer-bottom">
      <span>&copy; <span data-year>2026</span> ${esc(site.name)} · ${esc(site.location)} · Founded by ${esc(site.founder)}</span>
      <span class="footer-legal"><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="/sitemap.xml">Sitemap</a></span>
    </div>
  </div>
</footer>`;
}

// ---- Sticky mobile CTA ------------------------------------------------------
export function mobileCta() {
  return `<div class="mobile-cta">
    <a class="btn secondary" href="${'https://wa.me/' + site.whatsappNumber}" target="_blank" rel="noopener"><span>WhatsApp</span></a>
    <a class="btn" href="/free-audit/"><span>Free audit</span></a>
  </div>`;
}

// ---- Breadcrumb -------------------------------------------------------------
export function breadcrumb(items) {
  const li = items.map((it, i) => {
    const last = i === items.length - 1;
    return `<li>${last ? `<span aria-current="page">${esc(it.name)}</span>` : `<a href="${it.path}">${esc(it.name)}</a>`}</li>`;
  }).join('');
  return `<nav class="breadcrumb" aria-label="Breadcrumb"><ol>${li}</ol></nav>`;
}

// ---- CTA band ---------------------------------------------------------------
export function ctaBand(opts = {}) {
  const heading = opts.heading || 'Start with a free digital audit';
  const text = opts.text || `Tell us about your business — we'll reply ${site.facts.responsePromise} with a clear score and three priorities to keep.`;
  return `<section class="cta-band">
    <div class="wrap inner">
      <div>
        <h2 data-reveal>${esc(heading)}</h2>
        <p data-reveal>${esc(text)}</p>
      </div>
      <div class="btn-row" data-reveal>
        <a class="btn" href="/free-audit/"><span>Get your free audit →</span></a>
        <a class="btn whatsapp" href="${esc(bookCallUrl)}" target="_blank" rel="noopener"><span>Book a free call</span></a>
      </div>
      <p class="cta-fallback" data-reveal>Not on WhatsApp? <a href="${esc(bookCallMailto)}">Email ${esc(site.email)}</a> to book instead.</p>
    </div>
  </section>`;
}

// ---- FAQ accordion ----------------------------------------------------------
export function faqAccordion(faqs, idPrefix) {
  return `<div class="faq">` + faqs.map((f, i) => {
    const qid = `${idPrefix}-q${i}`;
    const aid = `${idPrefix}-a${i}`;
    return `<div class="faq-item">
      <h3 style="margin:0"><button class="faq-q" id="${qid}" type="button" aria-expanded="false" aria-controls="${aid}">${esc(f.q)}<span class="icon" aria-hidden="true"></span></button></h3>
      <div class="faq-a" id="${aid}" role="region" aria-labelledby="${qid}"><p>${esc(f.a)}</p></div>
    </div>`;
  }).join('') + `</div>`;
}

// ---- Cards ------------------------------------------------------------------
export function serviceCard(s) {
  const priceLine = `<span class="price-from">${esc(s.pricing.price)}</span>`;
  return `<a class="card" href="/services/${s.slug}/" data-reveal>
    <h3>${esc(s.title)}</h3>
    <p>${esc(s.summary)}</p>
    ${priceLine}
    <span class="card-cta">Learn more →</span>
  </a>`;
}

export function industryCard(i) {
  return `<a class="card" href="/industries/${i.slug}/" data-reveal>
    <h3>${esc(i.title)}</h3>
    <p>${esc(i.summary)}</p>
    <span class="card-cta">See what we build →</span>
  </a>`;
}

// ---- Full page assembly -----------------------------------------------------
export function page({ title, description, path, jsonLd, main, noindex, ogType }) {
  return `${head({ title, description, path, jsonLd, noindex, ogType })}
<body>
  ${header()}
  <main id="main">
${main}
  </main>
  ${footer()}
  ${mobileCta()}
  <script src="/site.js" defer></script>
</body>
</html>`;
}
