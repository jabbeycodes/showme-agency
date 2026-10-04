// ============================================================================
// Standalone pages (one-off layouts). Service/industry detail pages live in
// templates.mjs. Every page returns a full HTML document string.
// ============================================================================
import {
  site, wa, divisions, services, servicesByDivision, serviceBySlug,
  industries, faqGroups, insights, bookCallUrl, bookCallMailto
} from './data.mjs';
import { BUNDLES, PAYMENT, USD_NOTE } from './prices.mjs';
import {
  esc, url, page, breadcrumb, ctaBand, faqAccordion, serviceCard, industryCard,
  orgLd, breadcrumbLd, faqLd, founderPhoto, AREA_SERVED
} from './render.mjs';
import { illo, illoUrl, ILLO_ALT, ARTICLE_IMAGE } from './images.mjs';

const WA = 'https://wa.me/' + site.whatsappNumber;

// ---- Reusable lead form -----------------------------------------------------
function leadForm({ full = false, id = 'leadForm', submitLabel = 'Request my free audit' } = {}) {
  const needOptions = [
    'Website & online store', 'Marketing & growth', 'Branding',
    'Business systems & IT', 'AI & automation', 'Custom software'
  ];
  const servicesOptions = divisions.map(d => d.title);
  const extra = full ? `
        <div class="field full">
          <label for="${id}Services">Services of interest</label>
          <select id="${id}Services" name="services">
            <option value="">Select an area…</option>
            ${servicesOptions.map(o => `<option>${esc(o)}</option>`).join('')}
            <option>Not sure — free audit</option>
          </select>
          <p class="field-error" aria-hidden="true"></p>
        </div>
        <div class="field full">
          <label for="${id}Challenge">Your biggest challenge right now</label>
          <input id="${id}Challenge" name="challenge" type="text" autocomplete="off">
          <p class="field-error" aria-hidden="true"></p>
        </div>
        <div class="field">
          <label for="${id}Budget">Budget band (optional)</label>
          <select id="${id}Budget" name="budget">
            <option value="">Prefer not to say</option>
            <option>Just exploring</option>
            <option>Up to GHS 5,000</option>
            <option>GHS 5,000–15,000</option>
            <option>GHS 15,000+</option>
            <option>Monthly retainer</option>
          </select>
          <p class="field-error" aria-hidden="true"></p>
        </div>
        <div class="field">
          <label for="${id}Timeline">Timeline (optional)</label>
          <select id="${id}Timeline" name="timeline">
            <option value="">Not sure</option>
            <option>As soon as possible</option>
            <option>Within a month</option>
            <option>1–3 months</option>
            <option>Just researching</option>
          </select>
          <p class="field-error" aria-hidden="true"></p>
        </div>` : `
        <div class="field full">
          <label for="${id}Need">What do you need?</label>
          <select id="${id}Need" name="need">
            ${needOptions.map(o => `<option>${esc(o)}</option>`).join('')}
            <option selected>Not sure — free audit</option>
          </select>
          <p class="field-error" aria-hidden="true"></p>
        </div>`;

  return `<form class="contact-form" id="${id}" data-lead-form novalidate>
    <div class="honeypot" aria-hidden="true">
      <label for="${id}Website">Website</label>
      <input id="${id}Website" name="website" type="text" autocomplete="off" tabindex="-1">
    </div>
    <div class="form-grid">
      <div class="field">
        <label for="${id}Name">Your name</label>
        <input id="${id}Name" name="name" type="text" autocomplete="name" required aria-describedby="${id}NameError">
        <p class="field-error" id="${id}NameError" aria-live="polite"></p>
      </div>
      <div class="field">
        <label for="${id}Business">Business name</label>
        <input id="${id}Business" name="business" type="text" autocomplete="organization">
        <p class="field-error" aria-hidden="true"></p>
      </div>
      <div class="field">
        <label for="${id}Email">Email</label>
        <input id="${id}Email" name="email" type="email" autocomplete="email" required aria-describedby="${id}EmailError">
        <p class="field-error" id="${id}EmailError" aria-live="polite"></p>
      </div>
      <div class="field">
        <label for="${id}Phone">Phone / WhatsApp</label>
        <input id="${id}Phone" name="phone" type="tel" autocomplete="tel">
        <p class="field-error" aria-hidden="true"></p>
      </div>
      ${extra}
      <div class="field full">
        <label for="${id}Message">Message</label>
        <textarea id="${id}Message" name="message" placeholder="Tell us about your business and goals"></textarea>
        <p class="field-error" aria-hidden="true"></p>
      </div>
    </div>
    <div class="form-actions">
      <button class="btn" type="submit"><span>${esc(submitLabel)} →</span></button>
      <a class="email-alternative" href="mailto:${site.email}">Prefer email? Send it by email instead</a>
    </div>
    <p class="form-status" role="status" aria-live="polite"></p>
    <div class="contact-details">
      <a href="mailto:${site.email}">${esc(site.email)}</a>
      <a href="${WA}" target="_blank" rel="noopener">Chat on WhatsApp</a>
    </div>
  </form>`;
}

// ---- Shared trust content ---------------------------------------------------
const GUARANTEES = [
  ['Live in 7 days', site.facts.guarantee + ' Applies to the ShowMe Growth retainer.'],
  ['Preview before final payment', 'You approve a working preview of every project before the final 50% is due. If it does not match the agreed scope, we fix it first.'],
  ['Fixed scope, fixed price', 'Your proposal lists exactly what is included and what it costs. Changes are quoted before any extra work starts.'],
  ['You own everything', 'Your domain, content, brand files, accounts and, for software, your code are yours when the project is paid.'],
  ['A reply within one business day', 'Every enquiry and client message gets a real answer ' + site.facts.responsePromise + ', by WhatsApp or email.'],
  ['30 days of launch support', 'Every project includes 30 days of post-launch fixes and help, so launch day is not the last you hear from us.']
];

function guaranteeGrid() {
  return `<div class="guarantee-grid">${GUARANTEES.map((g, i) => `<div class="guarantee" data-reveal><span class="g-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><h3>${esc(g[0])}</h3><p>${esc(g[1])}</p></div>`).join('')}</div>`;
}

function bookCallButtons({ label = 'Book a free call', full = false } = {}) {
  return `<a class="btn whatsapp"${full ? ' style="width:100%"' : ''} href="${esc(bookCallUrl)}" target="_blank" rel="noopener"><span>${esc(label)}</span></a>
            <p class="book-fallback">Opens WhatsApp with a short message ready to send. Not on WhatsApp? <a href="${esc(bookCallMailto)}">Email ${esc(site.email)}</a>.</p>`;
}

// ---- Home -------------------------------------------------------------------
export function home() {
  const path = '/';
  const divisionOverview = divisions.map(d => {
    const items = servicesByDivision(d.slug).map(s => `<a href="/services/${s.slug}/">${esc(s.title)}</a>`).join('');
    return `<div class="division" data-reveal>
      <div class="division-head"><span class="num">${d.num}</span><h3><a href="/services/#${d.slug}" style="text-decoration:none;color:inherit">ShowMe ${esc(d.title)}</a></h3><p>${esc(d.blurb)}</p></div>
      <div class="grid grid-3" style="gap:8px 24px">${items}</div>
    </div>`;
  }).join('');

  const industryStrip = industries.slice(0, 8).map(i => `<a class="pill" href="/industries/${i.slug}/"><span class="dot" aria-hidden="true"></span>${esc(i.title)}</a>`).join('');

  const localBusinessLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: site.name,
    description: 'US-led digital agency with its delivery team on the ground in Accra, Ghana, with ' + site.facts.experience + ' of experience and ' + site.facts.businessesHelped + ' businesses helped, offering web, growth, brand, business technology, AI and software services to businesses in Ghana and to diaspora and international clients in the US, UK and Canada.',
    url: site.origin + '/',
    email: site.email,
    image: site.ogImage,
    areaServed: AREA_SERVED,
    address: { '@type': 'PostalAddress', addressLocality: 'Accra', addressCountry: 'GH' },
    founder: { '@type': 'Person', name: site.founder, image: site.founderImage, url: site.origin + '/about/', address: { '@type': 'PostalAddress', addressCountry: 'US' } },
    slogan: site.tagline
  };

  const teaserFaqs = faqGroups[0].items.concat(faqGroups[1].items.slice(0, 1));

  const main = `    <section class="hero">
      <div class="wrap hero-grid">
        <div class="hero-copy">
          <p class="eyebrow">${esc(site.strapline)}</p>
          <h1><span>Build.</span> <span>Grow.</span> <em>Automate.</em></h1>
          <p class="lead">For ${esc(site.facts.experience)}, our team has helped ${esc(site.facts.businessesHelped)} businesses across Ghana and abroad use technology to work smarter, reach more customers and grow — from brand and website to software, AI and everyday operations.</p>
          <div class="btn-row">
            <a class="btn" href="/free-audit/"><span>Get your free digital audit →</span></a>
            <a class="btn secondary" href="${esc(bookCallUrl)}" target="_blank" rel="noopener"><span>Book a free call</span></a>
          </div>
          <div class="pill-row">
            <span class="pill"><span class="dot" aria-hidden="true"></span>${esc(site.facts.experience)} of experience</span>
            <span class="pill"><span class="dot" aria-hidden="true"></span>${esc(site.facts.businessesHelped)} businesses helped</span>
            <span class="pill"><span class="dot" aria-hidden="true"></span>US-led · team in Accra</span>
            <span class="pill"><span class="dot" aria-hidden="true"></span>Live in 7 days or month 1 is free</span>
            <span class="pill"><span class="dot" aria-hidden="true"></span>Preview before final payment</span>
            <span class="pill"><span class="dot" aria-hidden="true"></span>One partner, six divisions</span>
          </div>
        </div>
        <div class="hero-art">
          <img src="/assets/hero-owner.webp" width="1200" height="900" alt="A Ghanaian business owner managing advertising and customer conversations on her phone" fetchpriority="high">
          <div class="hero-note">Build → grow → automate</div>
        </div>
      </div>
    </section>

    <section class="section-alt">
      <div class="wrap">
        <p class="kicker" data-reveal>Three things, done properly</p>
        <h2 data-reveal>One partner for the systems behind your business.</h2>
        <div class="grid grid-3" style="margin-top:40px">
          <div class="card" data-reveal><div class="card-division">Build</div><h3>Websites, stores &amp; software</h3><p>Fast, mobile-first sites, online stores with MoMo, booking systems and custom apps — built to convert and easy to run.</p></div>
          <div class="card" data-reveal><div class="card-division">Grow</div><h3>Demand &amp; visibility</h3><p>Search, AI visibility, Google &amp; Meta ads, social and content that bring qualified enquiries — with weekly reporting.</p></div>
          <div class="card" data-reveal><div class="card-division">Automate</div><h3>AI &amp; operations</h3><p>WhatsApp assistants, ordering flows and process automation that follow up leads and take routine work off your team.</p></div>
        </div>
      </div>
    </section>

    <section>
      <div class="wrap">
        <p class="kicker" data-reveal>Six focused divisions</p>
        <h2 data-reveal>Everything your business needs to move forward digitally.</h2>
        <p class="section-lead" data-reveal>Pick a single service or a full programme. One accountable partner, no juggling freelancers.</p>
        ${divisionOverview}
        <div style="margin-top:36px" data-reveal><a class="btn secondary" href="/services/"><span>View all services →</span></a></div>
      </div>
    </section>

    <section class="section-alt">
      <div class="wrap">
        <p class="kicker" data-reveal>Who we work with</p>
        <h2 data-reveal>Built for ambitious businesses across Ghana.</h2>
        <p class="section-lead" data-reveal>From getting online to modernising operations — with starter packages for the sectors we know best.</p>
        <div class="pill-row" style="margin-top:28px">${industryStrip}</div>
        <div style="margin-top:26px" data-reveal><a class="btn secondary" href="/industries/"><span>See all industries →</span></a></div>
      </div>
    </section>

    <section>
      <div class="wrap">
        <p class="kicker" data-reveal>How it works</p>
        <h2 data-reveal>From first audit to steady growth in four steps.</h2>
        <ol class="numsteps" style="margin-top:36px;max-width:760px">
          <li data-reveal><strong>Free audit</strong>We review your website, visibility and systems, then hand you a clear score and three priorities.</li>
          <li data-reveal><strong>Growth plan</strong>You get a plain-English plan: what we build, what it costs and what changes first.</li>
          <li data-reveal><strong>Launch in 7 days</strong>Your site, lead system and reporting go live within 7 days of onboarding — or month 1 is free.</li>
          <li data-reveal><strong>Grow monthly</strong>We run your demand, follow up every lead and report weekly.</li>
        </ol>
        <div style="margin-top:30px" data-reveal><a class="btn secondary" href="/process/"><span>See the full process →</span></a></div>
      </div>
    </section>

    <section class="section-alt">
      <div class="wrap">
        <p class="kicker" data-reveal>A practical place to start</p>
        <h2 data-reveal>Start with growth. Add what your business needs.</h2>
        <div class="grid grid-2" style="margin-top:40px;align-items:start">
          <div class="price-card featured" data-reveal>
            <span class="badge">Core offer</span>
            <div class="amount">${esc(site.facts.retainerPrice)} <small>/ month</small></div>
            <p style="color:var(--text-muted);margin:0">ShowMe Growth retainer · ${esc(site.facts.retainerMinimum)}</p>
            <ul>
              <li>Managed ads and a high-converting landing page</li>
              <li>WhatsApp lead system and weekly reporting</li>
              <li>Ad spend separate, prepaid in cedis (from ${esc(site.facts.adSpendMin)}/mo)</li>
              <li>${esc(site.facts.guarantee)}</li>
            </ul>
            <div style="margin-top:24px"><a class="btn" href="/pricing/"><span>See pricing &amp; packages →</span></a></div>
          </div>
          <div style="display:grid;gap:18px">
            <div class="promise-block highlight" data-reveal><span class="label">Start small</span><strong>Automation Audit: GHS 1,500.</strong><p>A fixed-fee roadmap of what to automate first, from our team. The full fee is credited toward your build if you go ahead within 60 days.</p></div>
            <div class="promise-block" data-reveal><span class="label">Published prices</span><strong>Websites from GHS 7,500. Bundles from GHS 11,500.</strong><p>Every service has a "from" price in GHS (with a USD guide). Projects are 50% to start and 50% on launch, after you approve a working preview.</p></div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="wrap">
        <p class="kicker" data-reveal>Proof, not promises</p>
        <h2 data-reveal>Our guarantees, in writing.</h2>
        <p class="section-lead" data-reveal>Our team stands behind its work. Here's what we put in writing in every proposal.</p>
        ${guaranteeGrid()}
        <div class="proof-strip" data-reveal>
          <div>
            <strong>See what we build.</strong>
            <p>Solutions we deliver: a restaurant ordering system, a real-estate listing platform, a clinic WhatsApp assistant and invoice automation.</p>
          </div>
          <div class="btn-row" style="margin:0">
            <a class="btn secondary" href="/work/"><span>See what we build →</span></a>
            <a class="btn secondary" href="/process/"><span>Our proven process →</span></a>
          </div>
        </div>
        <div class="founder-note" data-reveal>
          ${founderPhoto({ size: 96, cls: 'founder-photo sm' })}
          <div>
            <strong>${esc(site.facts.experience)} of experience, ${esc(site.facts.businessesHelped)} businesses helped. US-led, with our team on the ground in Accra.</strong>
            <p>Joshua (Josh) Abbey leads every engagement and stays your direct point of contact, while our delivery team in Accra builds, launches and supports your systems through launch and beyond.</p>
            <a href="/about/">Meet Josh →</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section-alt">
      <div class="wrap">
        <p class="kicker" data-reveal>Questions</p>
        <h2 data-reveal>Answers, up front.</h2>
        <div style="margin-top:32px">${faqAccordion(teaserFaqs, 'home-faq')}</div>
        <div style="margin-top:26px" data-reveal><a class="btn secondary" href="/faq/"><span>Read all FAQs →</span></a></div>
      </div>
    </section>

    ${ctaBand()}`;

  return page({
    title: site.name + ' — ' + site.tagline,
    description: 'ShowMe Digital Agency is your digital business partner, with ' + site.facts.experience + ' of experience and ' + site.facts.businessesHelped + ' businesses helped: US-led, with our team on the ground in Accra, serving businesses in Ghana and clients in the US, UK and Canada. We build websites, grow demand and automate the systems behind your customer journey. Start with a free digital audit.',
    path,
    jsonLd: [orgLd(), localBusinessLd],
    main
  });
}

// ---- Services hub -----------------------------------------------------------
export function servicesHub() {
  const path = '/services/';
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Services', path }];
  const sections = divisions.map(d => {
    const cards = servicesByDivision(d.slug).map(serviceCard).join('');
    return `<section id="${d.slug}"${d.num === '01' ? '' : ' class="section-alt"'}>
      <div class="wrap">
        <div class="division-intro" data-reveal>
          <div class="division-head"><span class="num">${d.num}</span><h3>ShowMe ${esc(d.title)}</h3><p>${esc(d.blurb)}</p></div>
          ${illo('division-' + d.slug, { lazy: d.num !== '01', cls: 'illo division-illo', sizes: '(max-width: 820px) 100vw, 440px' })}
        </div>
        <div class="grid grid-3">${cards}</div>
      </div>
    </section>`;
  }).join('\n');

  const main = `    <section class="page-hero">
      <div class="wrap">
        ${breadcrumb(crumbs)}
        <p class="kicker">Services</p>
        <h1>Everything your business needs, in one place.</h1>
        <p class="lead">Thirty-plus services across six divisions — from websites and stores to growth, brand, business technology, AI and custom software. Start with one, or run a full programme.</p>
        <div class="btn-row">
          <a class="btn" href="/free-audit/"><span>Get a free audit →</span></a>
          <a class="btn secondary" href="/pricing/"><span>See pricing</span></a>
        </div>
      </div>
    </section>
${sections}
    ${ctaBand()}`;

  return page({
    title: 'Services — Web, Growth, Brand, AI & Software | ' + site.name,
    description: 'Explore ShowMe Digital Agency\u2019s services across six divisions: web & commerce, growth, brand, business technology, AI & automation and custom software.',
    path,
    jsonLd: [orgLd(), breadcrumbLd(crumbs)],
    main
  });
}

// ---- Industries hub ---------------------------------------------------------
export function industriesHub() {
  const path = '/industries/';
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Industries', path }];
  const cards = industries.map(industryCard).join('');
  const main = `    <section class="page-hero">
      <div class="wrap">
        ${breadcrumb(crumbs)}
        <p class="kicker">Industries</p>
        <h1>Digital solutions for your sector.</h1>
        <p class="lead">We tailor websites, growth and automation to how your industry actually works — with a recommended starter package for each.</p>
      </div>
    </section>

    <section>
      <div class="wrap">
        <div class="grid grid-3">${cards}</div>
        <div class="card" data-reveal style="margin-top:24px;border-style:dashed">
          <h3>Don't see yours?</h3>
          <p>We work across many more sectors. Tell us your situation and we'll map the right approach.</p>
          <a class="card-cta" href="/contact/">Contact us →</a>
        </div>
      </div>
    </section>

    ${ctaBand()}`;

  return page({
    title: 'Industries We Serve in Ghana | ' + site.name,
    description: 'ShowMe Digital Agency serves real estate, healthcare, schools, restaurants, hospitality, churches, fashion, events, professional services and more across Ghana.',
    path,
    jsonLd: [orgLd(), breadcrumbLd(crumbs)],
    main
  });
}

// ---- Pricing ----------------------------------------------------------------
export function pricing() {
  const path = '/pricing/';
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Pricing', path }];
  const pricingFaqs = faqGroups[1].items.concat([
    { q: 'Is the Automation Audit fee credited toward a build?', a: 'Yes. The Automation Audit is a fixed GHS 1,500, and the full amount is credited toward any automation build you start with us within 60 days.' },
    { q: 'What does a "from" price mean?', a: 'It is the starting price for the scope described next to it. Your fixed quote follows a free call and depends on things like page count, number of products or workflows, and integrations. You will always see the full price before you commit.' },
    { q: 'What is not included in your prices?', a: 'Third-party costs are separate and paid at cost: ad spend, Microsoft or software licences, domain and payment-provider fees, WhatsApp and AI usage fees, printing and travel outside Greater Accra. We list any that apply in your proposal.' },
    { q: 'What if I need to pause or cancel?', a: 'Monthly plans run month to month after any minimum term; give us notice at least 14 days before your next billing date. For projects, you pay for the work completed to date. Full details are in our Terms of Service.' }
  ]);

  const waAbout = (what) => wa("Hi Josh, I'm interested in the " + what + '. Could we have a quick chat about it?');

  const bundleCards = BUNDLES.map(b => `<div class="price-card${b.featured ? ' featured' : ''}" data-reveal>
            ${b.featured ? '<span class="badge">Most popular</span>' : '<span class="badge badge-quiet">Bundle</span>'}
            <h3 class="bundle-name">${esc(b.name)}</h3>
            <p style="color:var(--text-muted);margin:0">${esc(b.tagline)}</p>
            <div class="amount amount-sm">${esc(b.price)}</div>
            <p class="price-usd">${esc(b.usd)} · ${esc(b.unit)}</p>
            ${b.monthly ? `<p class="bundle-monthly">${esc(b.monthly)}</p>` : ''}
            <ul>${b.includes.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
            <p class="bundle-meta"><strong>Timeline:</strong> ${esc(b.timeline)}<br><strong>Best for:</strong> ${esc(b.forWho)}</p>
            <p class="bundle-saving">${esc(b.saving)}</p>
            <div style="margin-top:20px"><a class="btn${b.featured ? '' : ' secondary'}" href="${esc(waAbout(b.name + ' bundle'))}" target="_blank" rel="noopener"><span>Ask about ${esc(b.name)} →</span></a></div>
          </div>`).join('');

  const yes = '<span class="yes" aria-label="Included">✓</span>';
  const no = '<span class="no" aria-label="Not included">–</span>';
  const compareRows = [
    ['Business website (mobile-first, SEO-ready)', 'Up to 6 pages', 'Up to 8 pages', 'Full online store'],
    ['MoMo, card &amp; bank checkout', no, no, yes],
    ['Brand identity', 'Essentials', no, 'Full identity system'],
    ['Google Business Profile optimisation', yes, yes, no],
    ['WhatsApp enquiry capture', yes, yes, yes],
    ['WhatsApp AI assistant', no, yes, no],
    ['WhatsApp reordering', no, no, yes],
    ['Managed ads &amp; landing page (Growth retainer)', no, yes, no],
    ['Automated workflows', no, no, 'Up to 3'],
    ['Website Care included', '3 months', 'Add from GHS 750/mo', '3 months'],
    ['Preview before final payment', yes, yes, yes],
    ['Typical timeline', '3–5 weeks', '7 days to first leads', '6–9 weeks'],
    ['Starting price', 'GHS 11,500', 'GHS 12,500 + GHS 3,200/mo', 'GHS 24,500']
  ];

  const priceTables = divisions.map(d => `<div class="price-division" data-reveal>
          <h3><span class="num">${d.num}</span> ShowMe ${esc(d.title)}</h3>
          <div class="table-wrap">
            <table class="compare price-list">
              <thead><tr><th scope="col">Service</th><th scope="col">From (GHS)</th><th scope="col">USD guide</th></tr></thead>
              <tbody>
                ${servicesByDivision(d.slug).map(s => `<tr><td><a href="/services/${s.slug}/">${esc(s.title)}</a><span class="price-note">${esc(s.pricing.note)}</span></td><td class="nowrap">${esc(s.pricing.price.replace(/^From /, ''))}</td><td class="nowrap">${esc((s.pricing.usd || '').replace(/^(From|About) /, ''))}</td></tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>`).join('');

  const main = `    <section class="page-hero">
      <div class="wrap">
        ${breadcrumb(crumbs)}
        <p class="kicker">Pricing</p>
        <h1>Published prices. Fixed quotes. No surprises.</h1>
        <p class="lead">Every service has a starting price you can see before we talk. After a free call you get a fixed quote, and on projects you approve a working preview before the final payment.</p>
        <div class="btn-row">
          <a class="btn" href="#price-list"><span>See every price ↓</span></a>
          <a class="btn whatsapp" href="${esc(bookCallUrl)}" target="_blank" rel="noopener"><span>Book a free call</span></a>
        </div>
      </div>
    </section>

    <section>
      <div class="wrap">
        <div class="grid grid-2" style="align-items:start">
          <div class="price-card featured" data-reveal>
            <span class="badge">Core offer</span>
            <div class="amount">${esc(site.facts.retainerPrice)} <small>/ month</small></div>
            <p style="color:var(--text-muted);margin:0">ShowMe Growth retainer · ${esc(site.facts.retainerMinimum)} · about USD 280/month</p>
            <ul>
              <li>Managed advertising and a high-converting landing page</li>
              <li>WhatsApp lead system that captures every enquiry</li>
              <li>Weekly reporting on what the spend returns</li>
              <li>Ad spend separate, prepaid in cedis (recommended from ${esc(site.facts.adSpendMin)}/month)</li>
              <li>${esc(site.facts.guarantee)}</li>
            </ul>
            <div style="margin-top:24px"><a class="btn" href="/services/growth-retainer/"><span>See what's included →</span></a></div>
          </div>
          <div style="display:grid;gap:18px">
            <div class="promise-block highlight" data-reveal><span class="label">Start small</span><strong>Automation Audit: GHS 1,500.</strong><p>A fixed-fee roadmap of what to automate first. The full fee is credited toward your build if you go ahead within 60 days.</p></div>
            <div class="promise-block" data-reveal><span class="label">Everything else</span><strong>A published "from" price for every service.</strong><p>Websites from GHS 7,500, stores from GHS 13,500, WhatsApp AI assistants from GHS 6,000. <a href="#price-list" style="color:var(--mint)">Full price list ↓</a></p></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section-alt" id="bundles">
      <div class="wrap">
        <p class="kicker" data-reveal>Bundles</p>
        <h2 data-reveal>Launch, Grow or Scale.</h2>
        <p class="section-lead" data-reveal>Three proven combinations, priced below the cost of buying each part separately. Every bundle includes a preview before final payment and 30 days of launch support.</p>
        <div class="grid grid-3 bundle-grid" style="margin-top:36px">
          ${bundleCards}
        </div>
      </div>
    </section>

    <section>
      <div class="wrap">
        <p class="kicker" data-reveal>Compare bundles</p>
        <h2 data-reveal>What's in each bundle.</h2>
        <div class="table-wrap" data-reveal>
          <table class="compare bundle-compare">
            <thead><tr><th scope="col">Included</th><th scope="col">Launch</th><th scope="col">Grow</th><th scope="col">Scale</th></tr></thead>
            <tbody>
              ${compareRows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="section-alt" id="price-list">
      <div class="wrap">
        <p class="kicker" data-reveal>À la carte</p>
        <h2 data-reveal>Every service, every starting price.</h2>
        <p class="section-lead" data-reveal>Buy any service on its own. Prices are in Ghana cedis, with an indicative US dollar guide for clients in the US, UK and Canada. ${esc(USD_NOTE)}</p>
        ${priceTables}
      </div>
    </section>

    <section>
      <div class="wrap">
        <div class="grid grid-2" style="align-items:start">
          <div data-reveal>
            <p class="kicker">Payment terms &amp; methods</p>
            <h2>Simple, upfront terms.</h2>
            <ul class="ticklist" style="margin-top:20px">
              <li><span><strong>Projects:</strong> ${esc(PAYMENT.projectSplit)}. The final payment is only due after you approve a working preview.</span></li>
              <li><span><strong>Retainers &amp; monthly plans:</strong> billed monthly in advance. The Growth retainer has a ${esc(site.facts.retainerMinimum)}.</span></li>
              <li><span><strong>Ad spend:</strong> separate, prepaid in cedis and paid directly to the ad platforms (recommended from ${esc(site.facts.adSpendMin)}/month).</span></li>
              <li><span><strong>Diaspora clients:</strong> ${esc(PAYMENT.usd)}.</span></li>
              <li><span><strong>Quotes</strong> are valid for 30 days and list any third-party costs (licences, ad spend, payment fees) separately.</span></li>
            </ul>
            <h3 style="margin-top:28px">Ways to pay</h3>
            <ul class="method-list">
              ${PAYMENT.methods.map(m => `<li>${esc(m)}</li>`).join('')}
            </ul>
          </div>
          <div data-reveal>
            <p class="kicker">Risk reversal</p>
            <h2>Why it's safe to start.</h2>
            <div class="promise-formal">
              <span class="label">Our formal promise</span>
              <strong>Preview before final payment.</strong>
              <p>On every project, you see and approve a working preview before the final 50% is due. If it does not match the scope we agreed in writing, we fix it first, at no extra cost.</p>
            </div>
            <ul class="ticklist" style="margin-top:20px">
              <li><span><strong>The 7-day guarantee.</strong> ${esc(site.facts.guarantee)}</span></li>
              <li><span><strong>Fixed scope, fixed price.</strong> We agree exactly what's included before we start.</span></li>
              <li><span><strong>You own your assets.</strong> Domain, content, brand files and, for software, your code.</span></li>
              <li><span><strong>30 days of launch support</strong> on every project.</span></li>
              <li><span><strong>No lock-in</strong> beyond any minimum term you agreed to.</span></li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="section-alt">
      <div class="wrap">
        <div class="grid grid-2" style="align-items:start">
          <div data-reveal>
            <p class="kicker">How we set our prices</p>
            <h2>Mid-market price, premium on what's included.</h2>
          </div>
          <div data-reveal>
            <p class="section-lead" style="margin-top:0">Our starting prices sit in the middle of the Ghanaian market. What sets them apart is everything included as standard: WhatsApp lead capture on every build, analytics from day one, training and handover, 30 days of launch support, a preview before final payment and full ownership of what we build. You won't find those listed as extras on your invoice.</p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="wrap">
        <p class="kicker" data-reveal>Pricing FAQ</p>
        <h2 data-reveal>Money questions, answered.</h2>
        <div style="margin-top:32px">${faqAccordion(pricingFaqs, 'pricing-faq')}</div>
      </div>
    </section>

    ${ctaBand({ heading: 'Not sure which option fits?', text: 'Start with a free audit or a free 20-minute call, and we\u2019ll recommend the smallest, highest-impact place to begin.' })}`;

  return page({
    title: 'Pricing & Packages | ' + site.name,
    description: 'ShowMe Digital Agency prices in GHS (with USD guides): websites from GHS 7,500, Launch/Grow/Scale bundles, the Growth retainer at ' + site.facts.retainerPrice + '/month and clear payment terms.',
    path,
    jsonLd: [orgLd(), breadcrumbLd(crumbs), faqLd(pricingFaqs)],
    main
  });
}

// ---- Process ----------------------------------------------------------------
export function process() {
  const path = '/process/';
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Process', path }];
  const phases = [
    ['Discover', '1–3 days', 'A free call and a short questionnaire. We learn your business, customers and goals, and confirm what success looks like.'],
    ['Plan', '2–3 days', 'You receive a written proposal: fixed scope, fixed price, timeline and exactly what we need from you. The 50% deposit starts the work.'],
    ['Design', '3–7 days', 'We design the key screens or flows and share a real preview. Two rounds of revisions are included.'],
    ['Build', '1–4 weeks', 'We develop in stages you can see, wiring in enquiry capture, payments, analytics and SEO foundations as we go.'],
    ['Review', '3–5 days', 'We test on real phones and Ghanaian networks, fix what we find and walk you through a working preview for approval.'],
    ['Launch', '1–2 days', 'Once you approve the preview and the final 50% is paid, we go live, train your team and hand over full access.'],
    ['Support', '30 days included', 'Thirty days of post-launch fixes and help, then optional Website Care or a monthly growth or automation plan.']
  ];
  const timelines = [
    ['Growth retainer: landing page, lead system &amp; reporting', 'Live within 7 days of onboarding'],
    ['Landing page', '5–7 working days'],
    ['Automation Audit', '5–7 working days'],
    ['Brand Essentials', '2–3 weeks'],
    ['WhatsApp AI assistant or ordering flow', '2–3 weeks'],
    ['Automation Quick-Win (up to 3 workflows)', '2–3 weeks'],
    ['Business website', '3–5 weeks'],
    ['Booking or ordering system', '3–6 weeks'],
    ['E-commerce store with MoMo checkout', '5–8 weeks'],
    ['Custom web app (first version)', '6–10 weeks'],
    ['Mobile app (first version)', '8–14 weeks']
  ];
  const main = `    <section class="page-hero">
      <div class="wrap">
        ${breadcrumb(crumbs)}
        <p class="kicker">Process</p>
        <h1>How we work with you.</h1>
        <p class="lead">Two journeys, one standard: the growth journey that gets you results, and the seven delivery phases behind every project, each with a realistic duration.</p>
      </div>
    </section>

    <section>
      <div class="wrap">
        <p class="kicker" data-reveal>The growth journey</p>
        <h2 data-reveal>From first audit to steady growth in four steps.</h2>
        <ol class="numsteps" style="margin-top:36px;max-width:760px">
          <li data-reveal><strong>Free audit</strong>We review your website, visibility and systems, then hand you a clear score and three priorities to keep, whether or not you hire us.</li>
          <li data-reveal><strong>Growth plan</strong>You get a plain-English plan: what we will build, what it costs and what changes first.</li>
          <li data-reveal><strong>Launch in 7 days</strong>Your site, lead system and reporting go live within 7 days of onboarding — or month 1 is free.</li>
          <li data-reveal><strong>Grow monthly</strong>We run your demand, follow up every lead and report weekly. You watch the numbers.</li>
        </ol>
      </div>
    </section>

    <section class="section-alt">
      <div class="wrap">
        <p class="kicker" data-reveal>Project delivery phases</p>
        <h2 data-reveal>Seven phases behind every build.</h2>
        <p class="section-lead" data-reveal>Durations below are typical for a business website or similar project. Smaller jobs move faster; larger builds repeat the Build and Review phases in stages. Quick content and approvals keep you at the short end.</p>
        <div class="grid grid-3" style="margin-top:36px">
          ${phases.map((p, i) => `<div class="card phase-card" data-reveal><div class="card-division">Phase ${String(i + 1).padStart(2, '0')}</div><h3>${esc(p[0])}</h3><p class="phase-duration">${esc(p[1])}</p><p>${esc(p[2])}</p></div>`).join('')}
        </div>
      </div>
    </section>

    <section>
      <div class="wrap">
        <p class="kicker" data-reveal>Typical timelines</p>
        <h2 data-reveal>How long things usually take.</h2>
        <p class="section-lead" data-reveal>Measured from the signed proposal and deposit to launch. Your proposal confirms the exact dates.</p>
        <div class="table-wrap" data-reveal>
          <table class="compare">
            <thead><tr><th scope="col">Project</th><th scope="col">Typical timeline</th></tr></thead>
            <tbody>${timelines.map(t => `<tr><td>${t[0]}</td><td>${esc(t[1])}</td></tr>`).join('')}</tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="section-alt">
      <div class="wrap">
        <div class="grid grid-2" style="align-items:start">
          <div data-reveal>
            <p class="kicker">What we need from you</p>
            <h2>Help us hit the timeline.</h2>
            <ul class="ticklist" style="margin-top:20px">
              <li>Content: text, images and any product or service details (we can write or shoot them for you if needed).</li>
              <li>Approvals: feedback within 2 working days at the design and review stages.</li>
              <li>Access: your domain, social and ad accounts and any existing tools.</li>
              <li>A point of contact who can make decisions.</li>
            </ul>
          </div>
          <div data-reveal>
            <p class="kicker">What you can expect from us</p>
            <h2>No surprises.</h2>
            <ul class="ticklist" style="margin-top:20px">
              <li>A fixed scope and price agreed before we start.</li>
              <li>A working preview to approve before the final payment.</li>
              <li>A short progress update every week, by WhatsApp or email.</li>
              <li>Full ownership, training and handover at the end.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    ${ctaBand()}`;

  return page({
    title: 'Our Process & Timelines | ' + site.name,
    description: 'How ShowMe Digital Agency works: a four-step growth journey, seven delivery phases with realistic durations, and typical timelines for websites, stores, automation and apps.',
    path,
    jsonLd: [orgLd(), breadcrumbLd(crumbs)],
    main
  });
}

// ---- Work / what we build --------------------------------------------------
// Solutions we deliver. These describe what we build and what each system is
// designed to achieve. They are not client case studies: no client names,
// no results or statistics.
const SOLUTIONS = [
  {
    id: 'restaurant-ordering', sector: 'Restaurants & caterers', title: 'Restaurant ordering system',
    problem: 'Restaurants that take most orders on WhatsApp often lose time at rush hour copying orders onto paper and checking MoMo screenshots by hand.',
    build: ['Mobile-first menu site that loads fast on 3G/4G', 'Guided WhatsApp ordering: dishes, pick-up or delivery, time', 'MoMo payment link in chat, confirmed automatically', 'Clean, paid orders sent to a kitchen dashboard', 'Repeat-order shortcut for regular office customers'],
    outcomes: 'Fewer missed or mistyped orders, payments confirmed without screenshot checks, and staff freed up during the lunch rush.',
    services: ['whatsapp-ordering-booking', 'business-websites'], from: 'From GHS 14,000 (site + ordering flow)', timeline: '4–5 weeks',
    image: 'solution-restaurant-ordering'
  },
  {
    id: 'real-estate-listings', sector: 'Real estate & diaspora buyers', title: 'Real-estate listing platform',
    problem: 'Developers and agents often get plenty of social media interest but few serious enquiries, while buyers abroad wait hours for a reply.',
    build: ['Listings with photos, floor plans and price in GHS or USD', 'Filters by location, bedrooms and budget', '"Enquire on WhatsApp" with the listing details pre-filled', 'Instant first response and lead qualification across time zones', 'Weekly report: enquiries, viewings booked, cost per lead'],
    outcomes: 'Better-qualified enquiries, faster first replies to buyers in any time zone, and a clear weekly view of where leads come from.',
    services: ['business-websites', 'growth-retainer'], from: 'From GHS 7,500 + Growth retainer', timeline: 'Leads live in 7 days; full site 4–5 weeks',
    image: 'solution-real-estate-listings'
  },
  {
    id: 'clinic-assistant', sector: 'Private healthcare', title: 'Clinic WhatsApp assistant',
    problem: 'Clinic front desks are flooded with the same questions (hours, prices, insurance, directions), and evening messages wait until morning.',
    build: ['AI assistant trained on the clinic\u2019s own FAQs and price list', 'Answers at any hour in plain, friendly language', 'Offers available appointment slots and takes the booking', 'Hands sensitive or medical questions straight to staff', 'Day-before reminders to reduce no-shows'],
    outcomes: 'Routine questions answered around the clock, bookings taken out of hours, fewer no-shows and a front desk with more time for patients.',
    services: ['whatsapp-ai-assistant', 'booking-online-ordering'], from: 'From GHS 6,000', timeline: '2–3 weeks',
    image: 'solution-clinic-assistant'
  },
  {
    id: 'invoice-automation', sector: 'Professional services & B2B', title: 'Invoice automation',
    problem: 'Growing service businesses often chase late invoices by hand, and owners have no quick view of cash, sales and overdue accounts.',
    build: ['Polite WhatsApp and email reminders before and after due dates', 'MoMo and card payment links included in every reminder', 'Invoices marked paid automatically, receipts sent', 'Monday 8am summary to the owner\u2019s WhatsApp', 'Documented workflows the team can see and adjust'],
    outcomes: 'Faster payment with less awkward chasing, no manual reconciliation of paid invoices, and a weekly cash snapshot in the owner\u2019s pocket.',
    services: ['business-process-automation', 'automation-audit'], from: 'From GHS 4,500 (Quick-Win, up to 3 workflows)', timeline: '2–3 weeks',
    image: 'solution-invoice-automation'
  }
];

export function work() {
  const path = '/work/';
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Work', path }];
  const workWa = wa("Hi ShowMe, I'd like to talk about a system like the ones on your Work page. My business: ");

  const projects = SOLUTIONS.map(p => `<article class="sample" id="${p.id}" data-reveal>
          <div class="sample-visual">${illo(p.image, { sizes: '(max-width: 1000px) 100vw, 480px' })}</div>
          <div class="sample-copy">
            <p class="sample-label"><span>Solution</span> ${esc(p.sector)}</p>
            <h3>${esc(p.title)}</h3>
            <p class="sample-scenario"><strong>The problem it solves:</strong> ${esc(p.problem)}</p>
            <p class="sample-sub">Key features</p>
            <ul class="ticklist">${p.build.map(b => `<li>${esc(b)}</li>`).join('')}</ul>
            <p class="sample-scenario sample-outcome"><strong>Designed to deliver:</strong> ${esc(p.outcomes)}</p>
            <p class="sample-meta"><span><strong>Typical price:</strong> ${esc(p.from)}</span><span><strong>Timeline:</strong> ${esc(p.timeline)}</span></p>
            <p class="sample-links">${p.services.map(slug => serviceBySlug[slug]).filter(Boolean).map(s => `<a href="/services/${s.slug}/">${esc(s.title)} →</a>`).join('')}</p>
          </div>
        </article>`).join('');

  const main = `    <section class="page-hero">
      <div class="wrap">
        ${breadcrumb(crumbs)}
        <p class="kicker">What we build</p>
        <h1>Proven systems, built by our team.</h1>
        <p class="lead">${esc(site.facts.experience)} and ${esc(site.facts.businessesHelped)} businesses helped with their digital needs, distilled into the systems our team builds for businesses in Ghana and beyond, how we work with you, and the guarantees we put in writing.</p>
        <div class="btn-row">
          <a class="btn" href="#solutions"><span>See the solutions we deliver ↓</span></a>
          <a class="btn secondary" href="#how-we-work"><span>How we work with you</span></a>
        </div>
      </div>
    </section>

    <section id="solutions">
      <div class="wrap">
        <p class="kicker" data-reveal>Solutions we deliver</p>
        <h2 data-reveal>What we build for businesses like yours.</h2>
        <p class="section-lead" data-reveal>Four systems we build and tailor to each business: the problem each one solves, its key features, the outcomes it is designed to deliver, and a typical price and timeline.</p>
        <div class="sample-list">
          ${projects}
        </div>
      </div>
    </section>

    <section class="section-alt" id="how-we-work">
      <div class="wrap">
        <div class="how-block" data-reveal>
          <div>
            <p class="kicker">How we work with you</p>
            <h2>One accountable team. A proven process.</h2>
            <p class="section-lead">ShowMe is US-led, with our team on the ground in Accra. Josh leads your engagement and stays your direct point of contact; our delivery team builds, launches and supports your system with a fixed scope, a fixed price and weekly updates.</p>
            <div class="btn-row">
              <a class="btn" href="${esc(workWa)}" target="_blank" rel="noopener"><span>Talk to us on WhatsApp →</span></a>
              <a class="btn secondary" href="/process/"><span>See our process</span></a>
            </div>
          </div>
          <div class="grid grid-2 how-cols">
            <div class="side-card">
              <h3>What you get</h3>
              <ul>
                <li>Josh as your direct point of contact</li>
                <li>A delivery team on the ground in Accra</li>
                <li>A fixed plan in plain English</li>
                <li>Every guarantee on this page, in writing</li>
              </ul>
            </div>
            <div class="side-card">
              <h3>How we deliver</h3>
              <ul>
                <li>Audit, plan, build, launch and grow</li>
                <li>A working preview before final payment</li>
                <li>Weekly progress updates</li>
                <li>30 days of launch support on every project</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="wrap">
        <p class="kicker" data-reveal>Our guarantees</p>
        <h2 data-reveal>Promises we put in writing.</h2>
        <p class="section-lead" data-reveal>We guarantee our speed and execution, not inflated lead numbers. These commitments are part of every proposal and our <a href="/terms/" style="color:var(--mint)">Terms of Service</a>.</p>
        ${guaranteeGrid()}
      </div>
    </section>

    <section class="section-alt">
      <div class="wrap">
        <p class="kicker" data-reveal>See our standards for yourself</p>
        <h2 data-reveal>The same care goes into everything we build.</h2>
        <div class="grid grid-4" style="margin-top:36px">
          <div class="card" data-reveal><h3>This website</h3><p>Fast, mobile-first and accessible, with published prices and every enquiry answered quickly.</p></div>
          <div class="card" data-reveal><h3>Our own lead system</h3><p>Our forms capture every enquiry and fall back to WhatsApp, the same pattern we build for clients.</p></div>
          <div class="card" data-reveal><h3>Our guides</h3><p>Read our <a href="/insights/" style="color:var(--mint)">Insights</a> to see how we think about search, payments and automation.</p></div>
          <div class="card" data-reveal><h3>A free audit</h3><p>Get a scored review of your business with three priorities, free, before you spend anything.</p></div>
        </div>
      </div>
    </section>

    ${ctaBand({ heading: 'Want a system like these for your business?', text: 'Start with a free audit or a free call. We\u2019ll recommend the right solution, with a fixed price and timeline, before you commit.' })}`;

  return page({
    title: 'What We Build: Solutions & Guarantees | ' + site.name,
    description: 'Solutions ShowMe Digital Agency builds for Ghanaian businesses (restaurant ordering systems, real-estate listing platforms, clinic WhatsApp assistants, invoice automation), how our team works with you and our written guarantees.',
    path,
    jsonLd: [orgLd(), breadcrumbLd(crumbs)],
    main
  });
}

// ---- Free audit -------------------------------------------------------------
export function freeAudit() {
  const path = '/free-audit/';
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Free audit', path }];
  const points = [
    ['Website', 'Is your site fast, mobile-first and built to capture enquiries?'],
    ['Search visibility', 'Can customers find you in Google — and are AI assistants recommending you?'],
    ['Social presence', 'Is your social consistent, on-brand and actually driving enquiries?'],
    ['Brand', 'Do you look credible and consistent everywhere customers see you?'],
    ['Business systems', 'Are your email, files and customer records organised and secure?'],
    ['Automation', 'Where is your team losing hours to repetitive, automatable work?']
  ];
  const main = `    <section class="page-hero">
      <div class="wrap">
        ${breadcrumb(crumbs)}
        <p class="kicker">Free digital audit</p>
        <h1>See where digital can unlock your next stage of growth.</h1>
        <p class="lead">A focused, no-obligation review of your customer journey and the systems behind it. You leave with a clear score and three practical priorities — whether or not you hire us.</p>
      </div>
    </section>

    <section>
      <div class="wrap detail-grid">
        <div class="detail-main">
          <div class="detail-block" data-reveal>
            <h2>Your 6-point check</h2>
            <div class="grid grid-2" style="margin-top:20px">
              ${points.map((p, i) => `<div class="card"><div class="card-division">${String(i + 1).padStart(2, '0')}</div><h3>${esc(p[0])}</h3><p>${esc(p[1])}</p></div>`).join('')}
            </div>
          </div>
          <div class="detail-block" data-reveal>
            <h2>What you get</h2>
            <ul class="ticklist">
              <li>A clear score across all six areas</li>
              <li>Your three highest-impact priorities</li>
              <li>Plain-English recommendations you can act on</li>
              <li>No obligation — the priorities are yours to keep</li>
            </ul>
          </div>
        </div>
        <aside class="detail-side">
          <div class="side-card">
            <h3>Request your free audit</h3>
            <p style="color:var(--text-muted);font-size:14px;margin:0 0 16px">Tell us about your business — we reply ${esc(site.facts.responsePromise)}.</p>
            ${leadForm({ id: 'auditForm', submitLabel: 'Request my free audit' })}
          </div>
        </aside>
      </div>
    </section>

    ${ctaBand({ heading: 'Prefer to talk it through?', text: 'Message us on WhatsApp and we\u2019ll get straight to your three priorities.' })}`;

  return page({
    title: 'Free Digital Business Audit | ' + site.name,
    description: 'Get a free 6-point digital audit from ShowMe Digital Agency: website, search & AI visibility, social, brand, systems and automation — with a score and three priorities.',
    path,
    jsonLd: [orgLd(), breadcrumbLd(crumbs)],
    main
  });
}

// ---- About ------------------------------------------------------------------
export function about() {
  const path = '/about/';
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'About', path }];
  const personLd = {
    '@context': 'https://schema.org', '@type': 'Person', name: 'Joshua Abbey', alternateName: 'Josh Abbey',
    jobTitle: 'Founder', worksFor: { '@type': 'Organization', name: 'ShowMe World' },
    image: site.founderImage, url: site.origin + '/about/',
    address: { '@type': 'PostalAddress', addressCountry: 'US' }, email: site.email
  };
  const partnerMail = 'mailto:' + site.email + '?subject=' + encodeURIComponent('Partner / careers enquiry');
  const main = `    <section class="page-hero">
      <div class="wrap">
        ${breadcrumb(crumbs)}
        <p class="kicker">About</p>
        <h1>Your digital business partner.</h1>
        <p class="lead">For ${esc(site.facts.experience)}, our team has helped ${esc(site.facts.businessesHelped)} businesses across Ghana and abroad use technology to work smarter, reach more customers and grow, with one accountable partner instead of a pile of freelancers.</p>
      </div>
    </section>

    <section>
      <div class="wrap detail-grid">
        <div class="detail-main">
          <div class="detail-block founder" data-reveal>
            ${founderPhoto({ size: 150, lazy: false })}
            <div>
              <h2>Joshua (Josh) Abbey</h2>
              <p class="founder-role">Founder, ShowMe World · US-led, with our team in Accra</p>
              <p>Josh Abbey is the founder of the ShowMe ecosystem and of its parent company, ShowMe World. He is based in the United States and leads ShowMe Digital Agency, which works with its own delivery team on the ground in Accra, Ghana. Together they bring ${esc(site.facts.experience)} of experience and have helped ${esc(site.facts.businessesHelped)} businesses across Ghana and abroad, including diaspora and international clients in the US, UK and Canada, with their digital needs. Josh is the first person you speak to when you get in touch.</p>
              <p>He started the agency around a simple observation: many good Ghanaian businesses don't lose customers because of their product. They lose them to slow websites, scattered enquiries and follow-up that depends on someone remembering. The fix is rarely one more tool. It's a joined-up system (website, demand, follow-up and back office) run by a team accountable for the whole thing.</p>
              <p>That's how ShowMe works with clients: Josh scopes the work and writes a fixed plan in plain English, and our team in Accra delivers it, from the first audit to launch and beyond. Where a project needs extra specialist skills, we bring in trusted specialists and Josh remains your single point of contact.</p>
              <p>Our standards are the ones you'll see across this site: publish prices, show working previews before asking for final payment, report honestly and let the results speak. Proof, not promises.</p>
              <p class="founder-links"><a href="${esc(bookCallUrl)}" target="_blank" rel="noopener">Book a free call with Josh →</a><a href="mailto:${site.email}">${esc(site.email)}</a></p>
            </div>
          </div>
          <div class="detail-block" data-reveal>
            <h2>The ShowMe ecosystem</h2>
            <p style="color:var(--text-muted);max-width:62ch">ShowMe World is the parent company and home of the ShowMe brand. ShowMe Digital Agency is its client-services arm: the team that builds, grows and automates for businesses in Ghana and abroad. The agency runs on the same tools and standards it recommends to clients.</p>
            <div class="grid grid-2" style="margin-top:20px">
              <div class="card"><div class="card-division">Parent company</div><h3>ShowMe World</h3><p>The umbrella for every ShowMe venture, founded by Joshua Abbey. <a href="https://showmeworld.app" target="_blank" rel="noopener" style="color:var(--mint)">showmeworld.app</a></p></div>
              <div class="card"><div class="card-division">You are here</div><h3>ShowMe Digital Agency</h3><p>Websites, growth, brand, business technology, AI and software for ambitious businesses. Build. Grow. Automate.</p></div>
            </div>
          </div>
          <div class="detail-block" data-reveal>
            <h2>Our principles</h2>
            <ul class="ticklist">
              <li><span><strong>Proof, not promises.</strong> We guarantee our speed and execution, not inflated lead numbers.</span></li>
              <li><span><strong>One accountable partner.</strong> Six divisions under one roof, so there's no finger-pointing.</span></li>
              <li><span><strong>You own everything.</strong> Your domain, content, brand assets and code are yours.</span></li>
              <li><span><strong>Plain English.</strong> No jargon: clear plans, clear reporting, published prices.</span></li>
            </ul>
          </div>
          <div class="detail-block" data-reveal>
            <h2>Where we work</h2>
            <ul class="ticklist">
              <li><span><strong>Accra, Ghana:</strong> our team on the ground, for in-person meetings, shoots and on-site work where a project needs them.</span></li>
              <li><span><strong>Across Ghana, our core market:</strong> from Kumasi to Takoradi and Tamale, delivered over WhatsApp, video calls and shared workspaces, with GHS pricing and MoMo payments.</span></li>
              <li><span><strong>US-led:</strong> Josh leads the agency from the United States, so projects get senior attention across time zones.</span></li>
              <li><span><strong>Diaspora and international clients:</strong> businesses in the US, UK and Canada, with USD quotes and card or international bank payments. Our WhatsApp line (${esc(site.whatsappDisplay)}) works wherever you are.</span></li>
            </ul>
          </div>
          <div class="detail-block" id="partners" data-reveal>
            <h2>Partners &amp; careers</h2>
            <p style="color:var(--text-muted);max-width:62ch">Alongside our core team, we work with a dependable network of specialists in Ghana and the diaspora: designers, developers, photographers and videographers, copywriters and ads specialists. If you do excellent work and care about deadlines, we'd like to hear from you. Email a short introduction and two or three examples of your work with "Partner" in the subject line.</p>
            <p style="color:var(--text-muted);max-width:62ch">We're also open to referral partnerships with accountants, consultants and other agencies whose clients need what we build. When full-time roles open, they'll be listed here first.</p>
            <p style="margin-top:14px"><a class="btn secondary" href="${esc(partnerMail)}"><span>Email us about partnering</span></a></p>
          </div>
        </div>
        <aside class="detail-side">
          <div class="side-card">
            <h3>Work with ShowMe</h3>
            <p style="color:var(--text-muted);font-size:14px;margin:0 0 16px">Start with a free audit, or book a free 20-minute call with Josh.</p>
            <div class="btn-row" style="display:grid">
              <a class="btn" href="/free-audit/"><span>Get a free audit →</span></a>
              ${bookCallButtons()}
            </div>
          </div>
        </aside>
      </div>
    </section>

    ${ctaBand()}`;

  return page({
    title: 'About ShowMe Digital Agency & Founder Joshua Abbey',
    description: 'ShowMe Digital Agency is the client-services arm of ShowMe World, US-led by founder Joshua (Josh) Abbey, with our team on the ground in Accra, ' + site.facts.experience + ' of experience and ' + site.facts.businessesHelped + ' businesses helped, serving businesses in Ghana and clients in the US, UK and Canada: build, grow and automate, with one accountable partner.',
    path,
    jsonLd: [orgLd(), breadcrumbLd(crumbs), personLd],
    main
  });
}

// ---- FAQ --------------------------------------------------------------------
export function faqPage() {
  const path = '/faq/';
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'FAQ', path }];
  const allFaqs = faqGroups.flatMap(g => g.items);
  const groupsHtml = faqGroups.map((g, gi) => `<div class="detail-block" data-reveal>
      <h2>${esc(g.title)}</h2>
      ${faqAccordion(g.items, 'faq-' + gi)}
    </div>`).join('\n');

  const main = `    <section class="page-hero">
      <div class="wrap">
        ${breadcrumb(crumbs)}
        <p class="kicker">FAQ</p>
        <h1>Frequently asked questions.</h1>
        <p class="lead">Everything about how we work, what things cost, timelines, ownership and support. Still unsure? Ask us on WhatsApp.</p>
      </div>
    </section>

    <section>
      <div class="wrap-narrow">
        <div class="detail-main">
          ${groupsHtml}
        </div>
      </div>
    </section>

    ${ctaBand()}`;

  return page({
    title: 'FAQ | ' + site.name,
    description: 'Answers to common questions about ShowMe Digital Agency: pricing, payment, timelines, websites, growth, SEO, AI, automation, ownership and support.',
    path,
    jsonLd: [orgLd(), breadcrumbLd(crumbs), faqLd(allFaqs)],
    main
  });
}

// ---- Contact ----------------------------------------------------------------
export function contact() {
  const path = '/contact/';
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Contact', path }];
  const main = `    <section class="page-hero">
      <div class="wrap">
        ${breadcrumb(crumbs)}
        <p class="kicker">Contact</p>
        <h1>Let's talk about your business.</h1>
        <p class="lead">Tell us where you are and what you're trying to achieve. We reply ${esc(site.facts.responsePromise)} with clear next steps.</p>
      </div>
    </section>

    <section>
      <div class="wrap detail-grid">
        <div class="detail-main">
          ${leadForm({ full: true, id: 'contactForm', submitLabel: 'Send my enquiry' })}
        </div>
        <aside class="detail-side">
          <div class="side-card">
            <h3>Reach us directly</h3>
            <ul style="list-style:none;margin:0 0 16px;padding:0;display:grid;gap:10px;color:var(--text-muted);font-size:14px">
              <li><a href="mailto:${site.email}" style="color:var(--text);font-weight:700">${esc(site.email)}</a></li>
              <li><a href="${WA}" target="_blank" rel="noopener" style="color:var(--text);font-weight:700">WhatsApp ${esc(site.whatsappDisplay)}</a></li>
              <li>${esc(site.locationLine)}</li>
              <li>${esc(site.serviceArea)}</li>
            </ul>
            <a class="btn whatsapp" href="${WA}" target="_blank" rel="noopener" style="width:100%"><span>Chat on WhatsApp</span></a>
          </div>
          <div class="side-card" id="book">
            <h3>Book a free call</h3>
            <p style="color:var(--text-muted);font-size:14px;margin:0 0 14px">A free 20-minute call with Josh to talk through your goals. Send your preferred day, time and time zone, and we'll confirm ${esc(site.facts.responsePromise)}.</p>
            ${bookCallButtons({ full: true })}
          </div>
          <div class="side-card">
            <h3>What happens next</h3>
            <ol class="numsteps" style="gap:12px">
              <li><span><strong>We reply ${esc(site.facts.responsePromise)}</strong>By email or WhatsApp, whichever you prefer.</span></li>
              <li><span><strong>A short discovery chat</strong>We learn your goals and answer questions.</span></li>
              <li><span><strong>Your free audit &amp; plan</strong>A clear score, three priorities and a plain-English plan.</span></li>
            </ol>
          </div>
        </aside>
      </div>
    </section>

    <section class="section-alt">
      <div class="wrap-narrow">
        <p class="kicker" data-reveal>Privacy</p>
        <h2 data-reveal>Your details, handled with care.</h2>
        <p class="section-lead" data-reveal>We collect only what you share and use it solely to respond to your enquiry and, if you become a client, to deliver our services. We never sell your information. Read our full <a href="/privacy/" style="color:var(--mint)">privacy notice</a>.</p>
      </div>
    </section>`;

  return page({
    title: 'Contact & Booking | ' + site.name,
    description: 'Contact ShowMe Digital Agency: US-led, with our team on the ground in Accra, serving businesses in Ghana and clients in the US, UK and Canada. Send a qualifying enquiry, chat on WhatsApp or email ' + site.email + '. We reply ' + site.facts.responsePromise + '.',
    path,
    jsonLd: [orgLd(), breadcrumbLd(crumbs)],
    main
  });
}

// ---- Insights index ---------------------------------------------------------
export function insightsIndex() {
  const path = '/insights/';
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Insights', path }];
  const cards = insights.map(a => `<a class="card article-card card-media" href="/insights/${a.slug}/" data-reveal>
      ${illo(ARTICLE_IMAGE[a.slug], { sizes: '(max-width: 620px) 100vw, (max-width: 1000px) 50vw, 360px', cls: 'card-img' })}
      <div class="card-division">${esc(a.topic)} · ${a.readMins} min read</div>
      <h3>${esc(a.title)}</h3>
      <p>${esc(a.excerpt)}</p>
      <span class="card-cta">Read the guide →</span>
    </a>`).join('');
  const blogLd = {
    '@context': 'https://schema.org', '@type': 'Blog', name: 'ShowMe Insights', url: url(path),
    publisher: { '@type': 'Organization', name: site.name },
    blogPost: insights.map(a => ({ '@type': 'BlogPosting', headline: a.title, url: url('/insights/' + a.slug + '/'), datePublished: a.published }))
  };
  const main = `    <section class="page-hero">
      <div class="wrap">
        ${breadcrumb(crumbs)}
        <p class="kicker">Insights</p>
        <h1>Practical digital guidance for Ghanaian businesses.</h1>
        <p class="lead">Plain-English guides on getting found, getting paid and getting organised online, from AI search and Google Business Profile to Mobile Money checkout and WhatsApp automation.</p>
      </div>
    </section>

    <section>
      <div class="wrap">
        <div class="grid grid-3">${cards}</div>
      </div>
    </section>

    ${ctaBand()}`;

  return page({
    title: 'Insights & Guides | ' + site.name,
    description: 'Practical, plain-English guides for Ghanaian businesses: AI search visibility, local SEO and Google Business Profile, Mobile Money checkout and WhatsApp automation.',
    path,
    jsonLd: [orgLd(), breadcrumbLd(crumbs), blogLd],
    main
  });
}

// ---- Insight article --------------------------------------------------------
export function insightArticle(a) {
  const path = '/insights/' + a.slug + '/';
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Insights', path: '/insights/' }, { name: a.title, path }];
  const articleLd = {
    '@context': 'https://schema.org', '@type': 'BlogPosting', headline: a.title,
    description: a.excerpt, datePublished: a.published, dateModified: a.published, wordCount: a.wordCount,
    image: illoUrl(ARTICLE_IMAGE[a.slug]),
    author: { '@type': 'Person', name: site.founder, jobTitle: 'Founder', image: site.founderImage, url: site.origin + '/about/' },
    publisher: { '@type': 'Organization', name: site.name, url: site.origin + '/' }, mainEntityOfPage: url(path)
  };
  const more = insights.filter(x => x.slug !== a.slug).slice(0, 3);
  const main = `    <section class="page-hero">
      <div class="wrap-narrow">
        ${breadcrumb(crumbs)}
        <p class="kicker">Insights · ${esc(a.topic)}</p>
        <h1>${esc(a.title)}</h1>
        <p class="lead">${esc(a.excerpt)}</p>
        <p class="article-meta byline">${founderPhoto({ size: 40, cls: 'byline-photo', lazy: false, small: true })}<span>By <a href="/about/">${esc(site.founder)}</a>, Founder · <time datetime="${a.published}">${esc(a.publishedLabel)}</time> · ${a.readMins} min read</span></p>
        ${illo(ARTICLE_IMAGE[a.slug], { lazy: false, cls: 'illo article-illo', sizes: '(max-width: 860px) 100vw, 820px' })}
      </div>
    </section>

    <section>
      <div class="wrap-narrow">
        <article class="prose article-body">
${a.body}
        </article>
        <div class="article-cta" data-reveal>
          <h2>Want help putting this into practice?</h2>
          <p>Get a free digital audit with three clear priorities, or book a free 20-minute call.</p>
          <div class="btn-row">
            <a class="btn" href="/free-audit/"><span>Get a free audit →</span></a>
            <a class="btn whatsapp" href="${esc(bookCallUrl)}" target="_blank" rel="noopener"><span>Book a free call</span></a>
          </div>
        </div>
      </div>
    </section>

    <section class="section-alt">
      <div class="wrap">
        <p class="kicker" data-reveal>Keep reading</p>
        <h2 data-reveal>More guides.</h2>
        <div class="grid grid-3" style="margin-top:28px">
          ${more.map(m => `<a class="card" href="/insights/${m.slug}/" data-reveal><div class="card-division">${esc(m.topic)} · ${m.readMins} min read</div><h3>${esc(m.title)}</h3><p>${esc(m.excerpt)}</p><span class="card-cta">Read →</span></a>`).join('')}
        </div>
      </div>
    </section>

    ${ctaBand()}`;

  return page({
    title: a.title + ' | ' + site.name,
    description: a.excerpt,
    path,
    jsonLd: [orgLd(), breadcrumbLd(crumbs), articleLd],
    main,
    ogType: 'article',
    ogImage: { url: illoUrl(ARTICLE_IMAGE[a.slug]), w: 1200, h: 750, alt: ILLO_ALT[ARTICLE_IMAGE[a.slug]] }
  });
}

// ---- Privacy ----------------------------------------------------------------
const LEGAL_UPDATED = '1 October 2026';

export function privacy() {
  const path = '/privacy/';
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Privacy', path }];
  const mail = `<a href="mailto:${site.email}">${esc(site.email)}</a>`;
  const main = `    <section class="page-hero">
      <div class="wrap-narrow">
        ${breadcrumb(crumbs)}
        <p class="kicker">Privacy Policy</p>
        <h1>Privacy, plainly stated.</h1>
        <p class="lead">How ShowMe Digital Agency collects, uses and protects personal data, in line with Ghana's Data Protection Act, 2012 (Act 843).</p>
        <p class="article-meta">Last updated: ${LEGAL_UPDATED}</p>
      </div>
    </section>

    <section>
      <div class="wrap-narrow prose legal">
        <h2>1. Who we are</h2>
        <p>This policy applies to ShowMe Digital Agency ("ShowMe", "we", "us"), the digital agency of ShowMe World (US-led, with our team on the ground in Accra, Ghana), and to this website at agency.showmeworld.app. For the personal data described below, we are the data controller under the Data Protection Act, 2012 (Act 843). You can contact us about privacy at any time at ${mail} or on WhatsApp at ${esc(site.whatsappDisplay)}.</p>

        <h2>2. The data we collect</h2>
        <h3>Information you give us</h3>
        <ul>
          <li><span><strong>Enquiries and audit requests:</strong> your name, business name, email address, phone or WhatsApp number, the services you're interested in, your challenge, budget band, timeline and message.</span></li>
          <li><span><strong>Conversations:</strong> messages you send us by WhatsApp, email or phone, and notes from calls.</span></li>
          <li><span><strong>Client information:</strong> if you become a client, contact and billing details, the content and materials you provide, and access details for accounts we manage on your behalf.</span></li>
        </ul>
        <h3>Information collected automatically</h3>
        <ul>
          <li><span><strong>Anonymous usage counts:</strong> our site records simple totals (page views, form submissions and WhatsApp button clicks) without cookies and without identifying you.</span></li>
          <li><span><strong>Form metadata:</strong> when you submit a form, we store the time and your browser type (user-agent) with your enquiry to help prevent spam.</span></li>
          <li><span><strong>Security logs:</strong> our hosting provider processes technical data such as IP addresses to deliver the site and protect it from abuse.</span></li>
        </ul>
        <h3>Cookies</h3>
        <p>We do not use advertising or tracking cookies on this website. Our fonts are loaded from Google Fonts, which means your browser connects to Google's servers and shares your IP address with Google when pages load.</p>

        <h2>3. How and why we use your data</h2>
        <p>Act 843 requires a lawful basis for processing personal data. We rely on:</p>
        <ul>
          <li><span><strong>Your consent</strong>, when you submit a form or message us, to reply to your enquiry and send the audit or information you asked for.</span></li>
          <li><span><strong>Performance of a contract</strong>, to scope, deliver, bill for and support the services you buy.</span></li>
          <li><span><strong>Our legitimate interests</strong>, to keep our website secure, understand overall usage and improve our services, in ways that don't override your rights.</span></li>
          <li><span><strong>Legal obligations</strong>, such as keeping accounting and tax records.</span></li>
        </ul>
        <p>We will only send you marketing messages if you have agreed to receive them, and every message will tell you how to opt out.</p>

        <h2>4. Who we share data with</h2>
        <p>We never sell your personal data. We share it only with service providers that help us run the business, under appropriate confidentiality and security terms:</p>
        <ul>
          <li>website hosting and security (for example, Cloudflare);</li>
          <li>communication tools (for example, WhatsApp, which is operated by Meta, and our email provider);</li>
          <li>payment providers that process MoMo, card and bank payments (we do not store full card details);</li>
          <li>productivity, file storage and project tools we use to deliver your work.</li>
        </ul>
        <p>We may also disclose data where required by law, or to protect our rights or the safety of others.</p>

        <h2>5. International transfers</h2>
        <p>Some of our service providers store or process data outside Ghana. When that happens, we choose reputable providers and take reasonable steps to ensure your data receives a level of protection consistent with Act 843.</p>

        <h2>6. How long we keep data</h2>
        <ul>
          <li><span><strong>Enquiries that don't become projects:</strong> up to 24 months, then deleted.</span></li>
          <li><span><strong>Client records:</strong> for the length of our engagement and up to 6 years afterwards, to meet accounting, tax and legal requirements.</span></li>
          <li><span><strong>Anonymous usage counts:</strong> kept as totals, which contain no personal data.</span></li>
        </ul>

        <h2>7. How we protect data</h2>
        <p>We use access controls, strong authentication on our accounts, encrypted connections (HTTPS) and reputable providers. Access to client data is limited to the people who need it to deliver your work. No system is perfectly secure, but if a breach affects your personal data, we will notify you and the relevant authorities as required by law.</p>

        <h2>8. Your rights</h2>
        <p>Under the Data Protection Act, 2012 (Act 843), you have the right to:</p>
        <ul>
          <li>ask whether we hold personal data about you and request a copy of it;</li>
          <li>ask us to correct data that is inaccurate, out of date or incomplete;</li>
          <li>ask us to delete or destroy data we no longer have a lawful reason to keep;</li>
          <li>object to processing, and withdraw consent at any time where we rely on it;</li>
          <li>tell us to stop using your data for direct marketing.</li>
        </ul>
        <p>To exercise any of these rights, email ${mail}. We may need to confirm your identity first, and we aim to respond within 21 days. If you are unhappy with how we handle your data, you can complain to the Data Protection Commission of Ghana.</p>

        <h2>9. When we process data for clients</h2>
        <p>When we build or run systems for a client, such as a website form, online store, CRM or WhatsApp assistant, the client is the data controller for their customers' data and we act as a data processor on their instructions. We process that data only to deliver the agreed services, keep it confidential and secure, and return or delete it when the engagement ends. Clients are responsible for having a lawful basis for the data they ask us to process and for their own privacy notices.</p>

        <h2>10. Children</h2>
        <p>Our services are aimed at businesses. We don't knowingly collect personal data from anyone under 18 through this website.</p>

        <h2>11. Changes to this policy</h2>
        <p>We may update this policy as our services or the law change. The "last updated" date at the top shows when it was last revised. Significant changes will be highlighted on this page.</p>

        <h2>12. Contact</h2>
        <p>ShowMe Digital Agency: US-led, with our team on the ground in Accra, Ghana. Email ${mail} or WhatsApp ${esc(site.whatsappDisplay)}. See also our <a href="/terms/">Terms of Service</a>.</p>
      </div>
    </section>`;

  return page({
    title: 'Privacy Policy | ' + site.name,
    description: 'How ShowMe Digital Agency collects, uses and protects personal data under Ghana\u2019s Data Protection Act, 2012 (Act 843). We never sell your data.',
    path,
    jsonLd: [orgLd(), breadcrumbLd(crumbs)],
    main
  });
}

// ---- Terms ------------------------------------------------------------------
export function terms() {
  const path = '/terms/';
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Terms', path }];
  const mail = `<a href="mailto:${site.email}">${esc(site.email)}</a>`;
  const main = `    <section class="page-hero">
      <div class="wrap-narrow">
        ${breadcrumb(crumbs)}
        <p class="kicker">Terms of Service</p>
        <h1>Terms of service.</h1>
        <p class="lead">The terms that apply when you use this website or work with ShowMe Digital Agency. Written to be read, not skimmed.</p>
        <p class="article-meta">Last updated: ${LEGAL_UPDATED}</p>
      </div>
    </section>

    <section>
      <div class="wrap-narrow prose legal">
        <h2>1. About these terms</h2>
        <p>These terms apply between ShowMe Digital Agency ("ShowMe", "we", "us"), the digital agency of ShowMe World (US-led, with our team on the ground in Accra, Ghana), and you, the client ("you"). They apply to every engagement together with your written proposal. If the proposal and these terms conflict, the proposal wins for that engagement. You accept these terms when you approve a proposal or pay a deposit or first monthly fee.</p>

        <h2>2. Proposals and scope</h2>
        <ul>
          <li>Every engagement starts with a written proposal setting out the scope, deliverables, price, timeline and anything we need from you.</li>
          <li>We deliver what the proposal describes. Work outside that scope ("change requests") is quoted in writing before we start it.</li>
          <li>Unless the proposal says otherwise, design work includes two rounds of revisions.</li>
        </ul>

        <h2>3. Prices and quotes</h2>
        <ul>
          <li>Prices on our website are starting ("from") prices for the scope described. Your proposal gives a fixed price for your specific project.</li>
          <li>Quotes are valid for 30 days. Prices are in Ghana cedis (GHS); clients in the US, UK and Canada may be quoted in US dollars (USD).</li>
          <li>Third-party costs are not included unless stated: for example ad spend, software and Microsoft licences, domain names, payment-provider fees, WhatsApp and AI usage fees, printing, and travel outside Greater Accra. We list any that apply in your proposal.</li>
        </ul>

        <h2>4. Payment terms</h2>
        <ul>
          <li><span><strong>Projects:</strong> 50% deposit before work starts and 50% on launch, after you approve a working preview (see section 5).</span></li>
          <li><span><strong>Retainers and monthly plans:</strong> billed monthly in advance.</span></li>
          <li><span><strong>Methods:</strong> Mobile Money (MTN MoMo, Telecel Cash, AT Money), bank transfer, or debit or credit card via a secure payment link. USD invoices can be paid by card or international bank transfer.</span></li>
          <li><span><strong>Late payment:</strong> invoices are due within 7 days unless agreed otherwise. If a payment is more than 7 days late, we may pause work or monthly services until it is settled, and timelines move accordingly.</span></li>
        </ul>

        <h2>5. Preview before final payment</h2>
        <p>On every project, we show you a working preview before the final payment is due. If the preview does not match the scope agreed in your proposal, we fix it at no extra cost before asking for the final payment. Approval should not be unreasonably withheld; requests that go beyond the agreed scope are handled as change requests.</p>

        <h2>6. The ShowMe Growth retainer</h2>
        <ul>
          <li>The Growth retainer costs ${esc(site.facts.retainerPrice)} per month, billed monthly in advance, with a 3-month minimum term.</li>
          <li>Ad spend is separate, prepaid in cedis and paid to the ad platforms. We recommend at least ${esc(site.facts.adSpendMin)} per month.</li>
          <li>After the minimum term, the retainer continues month to month. To cancel, give written notice (email or WhatsApp) at least 14 days before your next billing date.</li>
        </ul>

        <h2>7. The 7-day launch guarantee</h2>
        <p>For the Growth retainer, your landing page, lead system and reporting will be live within 7 days of onboarding, or your month 1 retainer fee is waived (or refunded if already paid). Onboarding is complete when we have received your first payment and the access, information and approvals listed in your onboarding checklist. The guarantee does not apply to delays caused by late information or approvals on your side, or by third-party reviews outside our control, such as ad-account or WhatsApp Business verification. Ad spend is never refunded under the guarantee because it is paid to the platforms.</p>

        <h2>8. Your responsibilities</h2>
        <ul>
          <li>Provide accurate content, information, access and approvals on time.</li>
          <li>Make sure you have the rights to any content, images, logos or data you give us.</li>
          <li>Comply with the laws that apply to your business, including advertising rules and the Data Protection Act, 2012 (Act 843) for your customers' data.</li>
        </ul>

        <h2>9. Ownership and intellectual property</h2>
        <ul>
          <li>Once you have paid in full, you own the final deliverables we create for you: website content and design, brand assets, documents and, for custom software, the code written specifically for you.</li>
          <li>Domains, ad accounts, app-store listings and similar accounts are set up in your name wherever possible.</li>
          <li>We keep ownership of our pre-existing tools, templates, know-how and general-purpose code, and give you a permanent licence to use them as part of your deliverables.</li>
          <li>Third-party components (such as themes, plugins, fonts, stock images or platforms) remain subject to their own licences.</li>
          <li>We will only show your project in our portfolio or publish a case study with your written permission.</li>
        </ul>

        <h2>10. Confidentiality</h2>
        <p>Both of us will keep the other's confidential information private and use it only for the engagement. This continues after the engagement ends.</p>

        <h2>11. Third-party platforms and results</h2>
        <p>Much of our work relies on platforms we don't control, including Google, Meta (Facebook, Instagram and WhatsApp), AI assistants, payment providers and hosting services. Their rules, fees, approvals and algorithms can change at any time. We guarantee our work, speed and transparency, but we do not guarantee specific rankings, AI recommendations, ad approvals, lead volumes or sales.</p>

        <h2>12. Support and fixes</h2>
        <p>Every project includes 30 days of post-launch support to fix defects in what we delivered. After that, support is available through a Website Care plan or a monthly plan, or quoted per request.</p>

        <h2>13. Cancellation and refunds</h2>
        <ul>
          <li><span><strong>Projects:</strong> you may cancel at any time by written notice. You pay for work completed up to that point; if your deposit exceeds the value of that work, we refund the difference.</span></li>
          <li><span><strong>Monthly services:</strong> fees for a month that has started are not refundable, except under the 7-day launch guarantee.</span></li>
          <li><span><strong>Automation Audit:</strong> the fee is non-refundable once the audit has started, and is credited in full toward an automation build started with us within 60 days.</span></li>
          <li>We may end an engagement if you seriously breach these terms and do not fix the breach within 14 days of notice.</li>
        </ul>

        <h2>14. Liability</h2>
        <p>We will carry out our work with reasonable skill and care. To the extent the law allows, our total liability under any engagement is limited to the fees you paid us for that engagement in the 3 months before the claim, and we are not liable for indirect losses such as lost profits, lost data or lost business opportunities. Nothing in these terms limits liability that cannot be limited under Ghanaian law.</p>

        <h2>15. Data protection</h2>
        <p>We handle personal data in line with our <a href="/privacy/">Privacy Policy</a> and the Data Protection Act, 2012 (Act 843). Where we process your customers' data on your behalf, we act on your instructions as described in section 9 of the Privacy Policy.</p>

        <h2>16. Electronic communications</h2>
        <p>Proposals, approvals and notices may be given by email, WhatsApp or electronic signature, and are valid in the same way as signed paper documents, in line with the Electronic Transactions Act, 2008 (Act 772).</p>

        <h2>17. Using this website</h2>
        <p>Content on this website is for general information and may change without notice. Our guides are practical advice, not legal, financial or tax advice. Please don't misuse the site, for example by attempting to disrupt it or by submitting spam through our forms.</p>

        <h2>18. Governing law and disputes</h2>
        <p>The governing law and the courts that have jurisdiction over an engagement are stated in your written proposal. If a dispute arises, we will first try to resolve it in good faith by discussion. If that fails, either of us may refer it to mediation before going to court.</p>

        <h2>19. Changes to these terms</h2>
        <p>We may update these terms from time to time. The version in force when you approve a proposal applies to that engagement. The "last updated" date shows the latest revision.</p>

        <h2>20. Contact</h2>
        <p>Questions about these terms? Email ${mail} or WhatsApp ${esc(site.whatsappDisplay)}.</p>
      </div>
    </section>`;

  return page({
    title: 'Terms of Service | ' + site.name,
    description: 'Terms of service for ShowMe Digital Agency: proposals and scope, prices, 50/50 payment terms, preview before final payment, the 7-day guarantee, ownership and how disputes are resolved.',
    path,
    jsonLd: [orgLd(), breadcrumbLd(crumbs)],
    main
  });
}

// ---- 404 --------------------------------------------------------------------
export function notFound() {
  const main = `    <section class="page-hero">
      <div class="wrap-narrow center">
        <p class="kicker">404</p>
        <h1>Page not found.</h1>
        <p class="lead" style="margin-inline:auto">The page you're looking for has moved or never existed. Let's get you back on track.</p>
        <div class="btn-row" style="justify-content:center">
          <a class="btn" href="/"><span>Back to home →</span></a>
          <a class="btn secondary" href="/services/"><span>Browse services</span></a>
        </div>
      </div>
    </section>

    <section>
      <div class="wrap">
        <div class="grid grid-4">
          <a class="card" href="/services/"><h3>Services</h3><p>All six divisions.</p></a>
          <a class="card" href="/industries/"><h3>Industries</h3><p>Solutions by sector.</p></a>
          <a class="card" href="/pricing/"><h3>Pricing</h3><p>Packages and quotes.</p></a>
          <a class="card" href="/contact/"><h3>Contact</h3><p>Talk to us.</p></a>
        </div>
      </div>
    </section>`;

  return page({
    title: 'Page not found | ' + site.name,
    description: 'The page you were looking for could not be found.',
    path: '/404.html',
    jsonLd: [orgLd()],
    main,
    noindex: true
  });
}
