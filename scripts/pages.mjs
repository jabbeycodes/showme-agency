// ============================================================================
// Standalone pages (one-off layouts). Service/industry detail pages live in
// templates.mjs. Every page returns a full HTML document string.
// ============================================================================
import {
  site, wa, divisions, services, servicesByDivision, serviceBySlug,
  industries, faqGroups, insights
} from './data.mjs';
import {
  esc, url, page, breadcrumb, ctaBand, faqAccordion, serviceCard, industryCard,
  orgLd, breadcrumbLd, faqLd
} from './render.mjs';

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
    description: 'Digital agency in Accra, Ghana offering web, growth, brand, business technology, AI and software services.',
    url: site.origin + '/',
    email: site.email,
    image: site.ogImage,
    areaServed: { '@type': 'Country', name: 'Ghana' },
    address: { '@type': 'PostalAddress', addressLocality: 'Accra', addressCountry: 'GH' },
    founder: { '@type': 'Person', name: site.founder },
    slogan: site.tagline
  };

  const teaserFaqs = faqGroups[0].items.concat(faqGroups[1].items.slice(0, 1));

  const main = `    <section class="hero">
      <div class="wrap hero-grid">
        <div class="hero-copy">
          <p class="eyebrow">${esc(site.strapline)}</p>
          <h1><span>Build.</span> <span>Grow.</span> <em>Automate.</em></h1>
          <p class="lead">We help Ghanaian businesses use technology to work smarter, reach more customers and grow — from brand and website to software, AI and everyday operations.</p>
          <div class="btn-row">
            <a class="btn" href="/free-audit/"><span>Get your free digital audit →</span></a>
            <a class="btn secondary" href="/services/"><span>Explore all services ↓</span></a>
          </div>
          <div class="pill-row">
            <span class="pill"><span class="dot" aria-hidden="true"></span>Live in 7 days or month 1 is free</span>
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
            <div class="promise-block pilot" data-reveal><span class="label">First 5 clients only</span><strong>Month 1 for ${esc(site.facts.pilotPrice)}.</strong><p>50% off with full delivery. The standard plan begins in month 2 unless you cancel.</p></div>
            <div class="promise-block" data-reveal><span class="label">Everything else</span><strong>Custom quotes, scoped to you.</strong><p>Web, brand, technology, AI and software projects are scoped separately after a short discovery call.</p></div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="wrap">
        <p class="kicker" data-reveal>Proof, not promises</p>
        <h2 data-reveal>Don't take our word for it. Take our work.</h2>
        <p class="section-lead" data-reveal>Client case studies are on the way. Until they're published with real numbers, here's the proof you can check right now.</p>
        <div class="grid grid-4" style="margin-top:36px">
          <div class="card" data-reveal><h3>This website</h3><p>You're looking at it. Fast, mobile-first, and every enquiry gets an instant response.</p></div>
          <div class="card" data-reveal><h3>Leads answered fast</h3><p>Our own form replies automatically and routes every lead for follow-up. No lead goes cold.</p></div>
          <div class="card" data-reveal><h3>One partner, six divisions</h3><p>Web, growth, brand, systems, AI and software under one roof. No finger-pointing.</p></div>
          <div class="card" data-reveal><h3>Live in 7 days</h3><p>From onboarding to launch in a week — or month one is free.</p></div>
        </div>
        <!-- TODO(founder): add real case studies, testimonials, client logos and result metrics on /work/ -->
        <div class="placeholder" data-reveal style="margin-top:28px">
          <p>Real client testimonials, logos and case-study results will appear here once the founder provides them. See the <a href="/work/" style="color:var(--mint)">Work &amp; results</a> page for the case-study template.</p>
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
    description: 'ShowMe Digital Agency is your digital business partner in Accra, Ghana. We build websites, grow demand and automate the systems behind your customer journey. Start with a free digital audit.',
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
        <div class="division-head" data-reveal><span class="num">${d.num}</span><h3>ShowMe ${esc(d.title)}</h3><p>${esc(d.blurb)}</p></div>
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
    { q: 'Can you credit an Automation Audit toward a build?', a: 'Yes — the Automation Audit is a paid entry offer and its fee can be credited toward a subsequent automation build.' },
    { q: 'Do you offer USD pricing for diaspora clients?', a: 'We work with diaspora and international clients. USD quoting is available on request — confirm with us for your project.' }
  ]);

  const main = `    <section class="page-hero">
      <div class="wrap">
        ${breadcrumb(crumbs)}
        <p class="kicker">Pricing</p>
        <h1>Honest pricing that starts with growth.</h1>
        <p class="lead">One real, published price for our core Growth retainer — and clear, custom quotes for everything else, scoped to what you actually need.</p>
      </div>
    </section>

    <section>
      <div class="wrap">
        <div class="grid grid-2" style="align-items:start">
          <div class="price-card featured" data-reveal>
            <span class="badge">Core offer</span>
            <div class="amount">${esc(site.facts.retainerPrice)} <small>/ month</small></div>
            <p style="color:var(--text-muted);margin:0">ShowMe Growth retainer · ${esc(site.facts.retainerMinimum)}</p>
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
            <div class="promise-block pilot" data-reveal><span class="label">First 5 clients only</span><strong>Month 1 for ${esc(site.facts.pilotPrice)}.</strong><p>That's 50% off with full delivery. The standard plan begins in month 2 unless you cancel.</p></div>
            <div class="promise-block" data-reveal><span class="label">Everything else</span><strong>Custom quote per division.</strong><p>Web, brand, technology, AI and software projects are scoped and quoted after a short discovery call — you only pay for what you need.</p></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section-alt">
      <div class="wrap">
        <p class="kicker" data-reveal>Bundles</p>
        <h2 data-reveal>Start-to-scale bundles.</h2>
        <p class="section-lead" data-reveal>Three common ways to combine services. Contents are fixed; final pricing is confirmed after a short discovery call.</p>
        <!-- TODO(founder): confirm bundle contents and set real bundle prices (or keep as custom quote) -->
        <div class="grid grid-3" style="margin-top:36px">
          <div class="price-card" data-reveal>
            <h3 style="font-family:'Archivo';font-size:22px">Launch</h3>
            <p style="color:var(--text-muted)">Get online, credibly and fast.</p>
            <ul>
              <li>Business website (mobile-first, SEO-ready)</li>
              <li>Brand essentials (logo &amp; core assets)</li>
              <li>3 months of Website Care</li>
            </ul>
            <div class="placeholder inline" style="margin-top:18px"><p><strong>From GHS [TBD]</strong></p></div>
          </div>
          <div class="price-card featured" data-reveal>
            <span class="badge">Most popular</span>
            <h3 style="font-family:'Archivo';font-size:22px">Grow</h3>
            <p style="color:var(--text-muted)">Turn attention into enquiries.</p>
            <ul>
              <li>Website with SEO foundations</li>
              <li>ShowMe Growth retainer</li>
              <li>WhatsApp AI assistant for follow-up</li>
            </ul>
            <div class="placeholder inline" style="margin-top:18px"><p><strong>From GHS [TBD]</strong></p></div>
          </div>
          <div class="price-card" data-reveal>
            <h3 style="font-family:'Archivo';font-size:22px">Scale</h3>
            <p style="color:var(--text-muted)">Sell more and automate operations.</p>
            <ul>
              <li>E-commerce with MoMo checkout</li>
              <li>Full brand identity system</li>
              <li>Process automation &amp; ongoing support</li>
            </ul>
            <div class="placeholder inline" style="margin-top:18px"><p><strong>From GHS [TBD]</strong></p></div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="wrap">
        <p class="kicker" data-reveal>À la carte</p>
        <h2 data-reveal>Prefer a single service?</h2>
        <p class="section-lead" data-reveal>Every division can be bought on its own. Each project is scoped to your needs and quoted after discovery.</p>
        <div class="table-wrap" data-reveal>
          <table class="compare">
            <thead><tr><th>Division</th><th>What it covers</th><th>How it's priced</th></tr></thead>
            <tbody>
              ${divisions.map(d => `<tr><td><a href="/services/#${d.slug}" style="color:inherit">ShowMe ${esc(d.title)}</a></td><td>${esc(d.blurb)}</td><td>${d.slug === 'growth' ? esc(site.facts.retainerPrice) + '/mo retainer or custom quote' : 'Custom quote'}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="section-alt">
      <div class="wrap">
        <div class="grid grid-2" style="align-items:start">
          <div data-reveal>
            <p class="kicker">Payment terms &amp; methods</p>
            <h2>Simple, upfront terms.</h2>
            <ul class="ticklist" style="margin-top:20px">
              <li>The Growth retainer is paid monthly in advance by MoMo or bank transfer.</li>
              <li>Ad spend is separate and prepaid in cedis, and goes directly to the ad platforms.</li>
              <li>Payment methods: MTN MoMo and bank transfer.</li>
            </ul>
            <!-- TODO(founder): confirm project payment split (e.g. deposit/milestones), accepted card methods, and USD terms for diaspora -->
            <div class="placeholder" style="margin-top:18px"><p>Project payment split (deposit and milestones), card acceptance and USD terms for diaspora clients are to be confirmed by the founder.</p></div>
          </div>
          <div data-reveal>
            <p class="kicker">Risk reversal</p>
            <h2>Why it's safe to start.</h2>
            <ul class="ticklist" style="margin-top:20px">
              <li><strong>The 7-day guarantee.</strong> ${esc(site.facts.guarantee)}</li>
              <li><strong>Fixed scope.</strong> We agree exactly what's included before we start.</li>
              <li><strong>You own your assets.</strong> Domain, content, brand files and, for software, your code.</li>
            </ul>
            <!-- TODO(founder): confirm whether to offer "preview before final payment" as a formal guarantee -->
            <div class="placeholder" style="margin-top:18px"><p>"See a working preview before final payment" — confirm with the founder before adding this as a formal guarantee.</p></div>
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

    ${ctaBand({ heading: 'Not sure which option fits?', text: 'Start with a free audit and we\u2019ll recommend the smallest, highest-impact place to begin.' })}`;

  return page({
    title: 'Pricing & Packages | ' + site.name,
    description: 'ShowMe Digital Agency pricing: the Growth retainer at ' + site.facts.retainerPrice + '/month, start-to-scale bundles and custom quotes per division, with clear payment terms.',
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
    ['Discover', 'We learn your business, customers and goals, and agree a fixed scope.'],
    ['Plan', 'You get a plain-English plan: what we build, what it costs and the order of work.'],
    ['Design', 'You approve a real preview before we build — no surprises later.'],
    ['Build', 'We develop in stages you can review, with quality checks along the way.'],
    ['Review', 'We test on real devices and networks, and refine with your feedback.'],
    ['Launch', 'We go live, wire up analytics and hand over full access.'],
    ['Support', 'We keep things running and growing with care plans and ongoing work.']
  ];
  const main = `    <section class="page-hero">
      <div class="wrap">
        ${breadcrumb(crumbs)}
        <p class="kicker">Process</p>
        <h1>How we work with you.</h1>
        <p class="lead">Two journeys, one standard: the growth journey that gets you results, and the delivery phases behind every project.</p>
      </div>
    </section>

    <section>
      <div class="wrap">
        <p class="kicker" data-reveal>The growth journey</p>
        <h2 data-reveal>From first audit to steady growth in four steps.</h2>
        <ol class="numsteps" style="margin-top:36px;max-width:760px">
          <li data-reveal><strong>Free audit</strong>We review your website, visibility and systems, then hand you a clear score and three priorities to keep — whether or not you hire us.</li>
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
        <p class="section-lead" data-reveal>Durations vary by project size and how quickly content and approvals come through. Indicative timelines are shared in your plan.</p>
        <div class="grid grid-3" style="margin-top:36px">
          ${phases.map((p, i) => `<div class="card" data-reveal><div class="card-division">Phase ${String(i + 1).padStart(2, '0')}</div><h3>${esc(p[0])}</h3><p>${esc(p[1])}</p><!-- TODO(founder): confirm indicative duration for the ${p[0]} phase --><p class="placeholder inline" style="margin-top:12px"><span>Indicative duration: [TBD]</span></p></div>`).join('')}
        </div>
      </div>
    </section>

    <section>
      <div class="wrap">
        <div class="grid grid-2" style="align-items:start">
          <div data-reveal>
            <p class="kicker">What we need from you</p>
            <h2>Help us hit the timeline.</h2>
            <ul class="ticklist" style="margin-top:20px">
              <li>Content: text, images and any product or service details.</li>
              <li>Approvals: timely feedback at design and review stages.</li>
              <li>Access: your domain, accounts and any existing tools.</li>
              <li>A point of contact who can make decisions.</li>
            </ul>
          </div>
          <div data-reveal>
            <p class="kicker">What you can expect from us</p>
            <h2>No surprises.</h2>
            <ul class="ticklist" style="margin-top:20px">
              <li>A fixed scope agreed before we start.</li>
              <li>A real preview to approve before we build.</li>
              <li>Clear updates and honest timelines.</li>
              <li>Full ownership and handover at the end.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    ${ctaBand()}`;

  return page({
    title: 'Our Process | ' + site.name,
    description: 'How ShowMe Digital Agency works: a four-step growth journey and seven project delivery phases, with clear expectations on both sides.',
    path,
    jsonLd: [orgLd(), breadcrumbLd(crumbs)],
    main
  });
}

// ---- Work / results ---------------------------------------------------------
export function work() {
  const path = '/work/';
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Work', path }];
  const caseCard = (n) => `<div class="card" data-reveal style="border-style:dashed">
    <div class="card-division">Case study ${n}</div>
    <!-- TODO(founder): replace with a real case study — client, industry, challenge, what we did, result metric -->
    <h3>Client name — Industry</h3>
    <p><strong>Challenge:</strong> <span class="placeholder inline"><span>PLACEHOLDER</span></span></p>
    <p style="margin-top:10px"><strong>What we did:</strong> <span class="placeholder inline"><span>PLACEHOLDER</span></span></p>
    <p style="margin-top:10px"><strong>Result:</strong> <span class="placeholder inline"><span>PLACEHOLDER metric</span></span></p>
  </div>`;

  const main = `    <section class="page-hero">
      <div class="wrap">
        ${breadcrumb(crumbs)}
        <p class="kicker">Work &amp; results</p>
        <h1>Proof, not promises.</h1>
        <p class="lead">We won't invent numbers to look impressive. Real case studies are published here with the client's permission — with the actual challenge, what we did and the measured result.</p>
      </div>
    </section>

    <section>
      <div class="wrap">
        <p class="kicker" data-reveal>Case studies</p>
        <h2 data-reveal>Results we can stand behind.</h2>
        <p class="section-lead" data-reveal>The template below shows exactly how we'll present each engagement. These slots are placeholders until the founder supplies verified details.</p>
        <div class="grid grid-3" style="margin-top:36px">
          ${caseCard(1)}${caseCard(2)}${caseCard(3)}
        </div>
      </div>
    </section>

    <section class="section-alt">
      <div class="wrap">
        <p class="kicker" data-reveal>What you can verify today</p>
        <h2 data-reveal>Don't take our word for it. Take our work.</h2>
        <div class="grid grid-4" style="margin-top:36px">
          <div class="card" data-reveal><h3>This website</h3><p>Fast, mobile-first and accessible, with every enquiry answered instantly.</p></div>
          <div class="card" data-reveal><h3>Leads answered fast</h3><p>Our own form replies automatically and routes every lead for follow-up.</p></div>
          <div class="card" data-reveal><h3>One partner, six divisions</h3><p>Web, growth, brand, systems, AI and software under one roof.</p></div>
          <div class="card" data-reveal><h3>Live in 7 days</h3><p>From onboarding to launch in a week — or month one is free.</p></div>
        </div>
      </div>
    </section>

    <section>
      <div class="wrap">
        <p class="kicker" data-reveal>Testimonials</p>
        <h2 data-reveal>In our clients' words.</h2>
        <!-- TODO(founder): add real testimonials with name, business and permission to publish -->
        <div class="grid grid-2" style="margin-top:32px">
          <div class="placeholder" data-reveal><p>"Client testimonial goes here." — Name, Business. Provided by the founder with permission to publish.</p></div>
          <div class="placeholder" data-reveal><p>"Client testimonial goes here." — Name, Business. Provided by the founder with permission to publish.</p></div>
        </div>
      </div>
    </section>

    ${ctaBand({ heading: 'Want to be our next case study?', text: 'Start with a free audit. If we work together, we\u2019ll measure the results and — with your permission — publish them here.' })}`;

  return page({
    title: 'Work & Results | ' + site.name,
    description: 'Real case studies and results from ShowMe Digital Agency, presented honestly with the client\u2019s permission. Proof, not promises.',
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
  const main = `    <section class="page-hero">
      <div class="wrap">
        ${breadcrumb(crumbs)}
        <p class="kicker">About</p>
        <h1>Your digital business partner.</h1>
        <p class="lead">ShowMe Digital Agency helps Ghanaian businesses use technology to work smarter, reach more customers and grow — with one accountable partner instead of a pile of freelancers.</p>
      </div>
    </section>

    <section>
      <div class="wrap detail-grid">
        <div class="detail-main">
          <div class="detail-block" data-reveal>
            <h2>Founder</h2>
            <p style="color:var(--text-muted);max-width:62ch">${esc(site.name)} was founded by ${esc(site.founder)}, based in ${esc(site.location)}. ShowMe exists to give ambitious businesses a single, honest partner across the whole digital picture — build, grow and automate.</p>
            <!-- TODO(founder): add Joshua Abbey's bio and a professional photo -->
            <div class="placeholder" style="margin-top:18px"><p>Founder bio and a professional photo of ${esc(site.founder)} to be added by the founder.</p></div>
          </div>
          <div class="detail-block" data-reveal>
            <h2>The ShowMe ecosystem</h2>
            <p style="color:var(--text-muted);max-width:62ch">ShowMe Digital Agency is part of the wider ShowMe brand. As other ShowMe products launch, we'll connect them here.</p>
            <!-- TODO(founder): describe the other ShowMe brand products and how they connect -->
            <div class="placeholder" style="margin-top:18px"><p>Details of the other products in the ShowMe brand ecosystem to be added by the founder.</p></div>
          </div>
          <div class="detail-block" data-reveal>
            <h2>Our principles</h2>
            <ul class="ticklist">
              <li><strong>Proof, not promises.</strong> We guarantee our speed and execution, not inflated lead numbers.</li>
              <li><strong>One accountable partner.</strong> Six divisions under one roof, so there's no finger-pointing.</li>
              <li><strong>You own everything.</strong> Your domain, content, brand assets and code are yours.</li>
              <li><strong>Plain English.</strong> No jargon — clear plans, clear reporting, clear pricing.</li>
            </ul>
          </div>
          <div class="detail-block" data-reveal>
            <h2>Where we work</h2>
            <p style="color:var(--text-muted);max-width:62ch">We're based in ${esc(site.location)} and work with businesses across Ghana. We also serve diaspora and international clients.</p>
            <!-- TODO(founder): confirm which international/diaspora markets to highlight -->
            <div class="placeholder" style="margin-top:18px"><p>Confirm which diaspora and international markets to highlight (e.g. UK, US, Canada) and whether USD quoting is offered.</p></div>
          </div>
        </div>
        <aside class="detail-side">
          <div class="side-card">
            <h3>Work with ShowMe</h3>
            <p style="color:var(--text-muted);font-size:14px;margin:0 0 16px">Start with a free audit or say hello on WhatsApp.</p>
            <div class="btn-row" style="display:grid">
              <a class="btn" href="/free-audit/"><span>Get a free audit →</span></a>
              <a class="btn whatsapp" href="${WA}" target="_blank" rel="noopener"><span>Chat on WhatsApp</span></a>
            </div>
          </div>
        </aside>
      </div>
    </section>

    ${ctaBand()}`;

  return page({
    title: 'About ShowMe Digital Agency | ' + site.founder,
    description: 'ShowMe Digital Agency is a digital partner in Accra, Ghana founded by ' + site.founder + ' — build, grow and automate, with one accountable team and an honest, proof-first approach.',
    path,
    jsonLd: [orgLd(), breadcrumbLd(crumbs)],
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
              <li>${esc(site.location)}</li>
            </ul>
            <a class="btn whatsapp" href="${WA}" target="_blank" rel="noopener" style="width:100%"><span>Chat on WhatsApp</span></a>
          </div>
          <div class="side-card">
            <h3>Book a call</h3>
            <!-- TODO(founder): add a Cal.com / Calendly booking link and embed it here -->
            <div class="placeholder"><p>Online booking calendar (Cal.com or Calendly) link to be added by the founder. For now, use WhatsApp or the form and we'll schedule a time.</p></div>
          </div>
          <div class="side-card">
            <h3>What happens next</h3>
            <ol class="numsteps" style="gap:12px">
              <li><strong>We reply ${esc(site.facts.responsePromise)}</strong>By email or WhatsApp, whichever you prefer.</li>
              <li><strong>A short discovery chat</strong>We learn your goals and answer questions.</li>
              <li><strong>Your free audit &amp; plan</strong>A clear score, three priorities and a plain-English plan.</li>
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
    description: 'Contact ShowMe Digital Agency in Accra, Ghana. Send a qualifying enquiry, chat on WhatsApp or email ' + site.email + '. We reply ' + site.facts.responsePromise + '.',
    path,
    jsonLd: [orgLd(), breadcrumbLd(crumbs)],
    main
  });
}

// ---- Insights index ---------------------------------------------------------
export function insightsIndex() {
  const path = '/insights/';
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Insights', path }];
  const cards = insights.map(a => `<a class="card" href="/insights/${a.slug}/" data-reveal>
      ${a.draft ? '<div class="card-division">Draft outline</div>' : ''}
      <h3>${esc(a.title)}</h3>
      <p>${esc(a.excerpt)}</p>
      <span class="card-cta">Read outline →</span>
    </a>`).join('');
  const main = `    <section class="page-hero">
      <div class="wrap">
        ${breadcrumb(crumbs)}
        <p class="kicker">Insights</p>
        <h1>Practical digital guidance for Ghanaian businesses.</h1>
        <p class="lead">Plain-English guides on getting found, getting paid and getting organised online. These starter articles are outlined drafts — full versions are on the way.</p>
      </div>
    </section>

    <section>
      <div class="wrap">
        <div class="grid grid-3">${cards}</div>
        <!-- TODO(founder): expand these outlines into full articles for SEO -->
      </div>
    </section>

    ${ctaBand()}`;

  return page({
    title: 'Insights & Guides | ' + site.name,
    description: 'Practical, plain-English digital marketing and technology guides for Ghanaian businesses from ShowMe Digital Agency.',
    path,
    jsonLd: [orgLd(), breadcrumbLd(crumbs)],
    main
  });
}

// ---- Insight article --------------------------------------------------------
export function insightArticle(a) {
  const path = '/insights/' + a.slug + '/';
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Insights', path: '/insights/' }, { name: a.title, path }];
  const articleLd = {
    '@context': 'https://schema.org', '@type': 'Article', headline: a.title,
    description: a.excerpt, author: { '@type': 'Organization', name: site.name },
    publisher: { '@type': 'Organization', name: site.name }, mainEntityOfPage: url(path)
  };
  const main = `    <section class="page-hero">
      <div class="wrap-narrow">
        ${breadcrumb(crumbs)}
        <p class="kicker">Insights · Draft outline</p>
        <h1>${esc(a.title)}</h1>
        <p class="lead">${esc(a.excerpt)}</p>
      </div>
    </section>

    <section>
      <div class="wrap-narrow prose">
        <!-- TODO(founder): expand this outline into a full, original article -->
        <div class="placeholder" data-reveal><p>This is a draft outline for an upcoming article. The full, original piece will be published here.</p></div>
        <h2>Outline</h2>
        <ol>
          ${a.outline.map(o => `<li>${esc(o)}</li>`).join('')}
        </ol>
        <p style="margin-top:28px">Want help putting this into practice for your business? <a href="/free-audit/">Get a free audit</a> or <a href="/contact/">contact us</a>.</p>
      </div>
    </section>

    ${ctaBand()}`;

  return page({
    title: a.title + ' | ' + site.name,
    description: a.excerpt,
    path,
    jsonLd: [orgLd(), breadcrumbLd(crumbs), articleLd],
    main
  });
}

// ---- Privacy ----------------------------------------------------------------
export function privacy() {
  const path = '/privacy/';
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Privacy', path }];
  const main = `    <section class="page-hero">
      <div class="wrap-narrow">
        ${breadcrumb(crumbs)}
        <p class="kicker">Privacy</p>
        <h1>Privacy, plainly stated.</h1>
      </div>
    </section>

    <section>
      <div class="wrap-narrow prose">
        <p>When you request an audit or contact us, we collect only what you share — your name, business, email and phone number — and use it solely to respond to your enquiry and, if you become a client, to deliver our services.</p>
        <h2>What we collect</h2>
        <ul>
          <li>Details you submit through our forms (name, business, email, phone and your message).</li>
          <li>Basic, privacy-respecting usage counts (for example, page views and form submissions) to understand how the site is used.</li>
        </ul>
        <h2>How we use it</h2>
        <ul>
          <li>To respond to your enquiry and provide the services you ask for.</li>
          <li>To improve our website and services.</li>
        </ul>
        <h2>What we don't do</h2>
        <p>We never sell your information or share it with third parties for their own marketing.</p>
        <h2>Your choices</h2>
        <p>To review or delete your details at any time, email <a href="mailto:${site.email}">${esc(site.email)}</a>.</p>
        <!-- TODO(founder): have this reviewed for full Ghana Data Protection Act compliance if required -->
        <div class="placeholder" data-reveal><p>Confirm whether a formal Data Protection Act (Ghana) compliance statement and registration details are required.</p></div>
      </div>
    </section>`;

  return page({
    title: 'Privacy | ' + site.name,
    description: 'How ShowMe Digital Agency collects, uses and protects the information you share. We never sell your data.',
    path,
    jsonLd: [orgLd(), breadcrumbLd(crumbs)],
    main
  });
}

// ---- Terms ------------------------------------------------------------------
export function terms() {
  const path = '/terms/';
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Terms', path }];
  const main = `    <section class="page-hero">
      <div class="wrap-narrow">
        ${breadcrumb(crumbs)}
        <p class="kicker">Terms</p>
        <h1>Terms of service.</h1>
      </div>
    </section>

    <section>
      <div class="wrap-narrow prose">
        <!-- TODO(founder): replace this placeholder with reviewed terms of service -->
        <div class="placeholder" data-reveal><p>These terms are a placeholder. The founder should provide reviewed terms of service covering scope, payment, ownership, guarantees and liability before this page goes live.</p></div>
        <h2>What these terms will cover</h2>
        <ul>
          <li>Scope of work and what's included in each engagement.</li>
          <li>Pricing, payment terms and refunds.</li>
          <li>Ownership of deliverables and assets.</li>
          <li>Guarantees (including the 7-day launch guarantee) and their conditions.</li>
          <li>Confidentiality and liability.</li>
        </ul>
        <p>For any questions in the meantime, email <a href="mailto:${site.email}">${esc(site.email)}</a>.</p>
      </div>
    </section>`;

  return page({
    title: 'Terms | ' + site.name,
    description: 'Terms of service for ShowMe Digital Agency (placeholder pending final review).',
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
