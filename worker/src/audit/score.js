// =============================================================================
// Free Digital Audit — transparent rule-based scoring.
// Each area is a list of rules worth fixed points. Area score = earned / max of
// the rules we could actually measure, scaled to 0–10 and rounded. Overall /60.
// Unmeasured rules are listed as "not measured" and excluded (never guessed).
// =============================================================================
import { FREE_MAIL, emailDomain } from './util.js';

export const AREAS = [
  { key: 'website', label: 'Website' },
  { key: 'search', label: 'Search visibility' },
  { key: 'social', label: 'Social presence' },
  { key: 'brand', label: 'Brand' },
  { key: 'systems', label: 'Business systems' },
  { key: 'automation', label: 'Automation' }
];

function norm(s) { return String(s || '').toLowerCase().replace(/&amp;/g, '&').replace(/[^a-z0-9]+/g, ' ').trim(); }
function nameIn(name, text) {
  const n = norm(name).replace(/\b(ltd|limited|llc|inc|company|co|gh|ghana|enterprise|enterprises)\b/g, '').trim();
  if (!n || n.length < 3) return false;
  return norm(text).includes(n);
}
function secs(ms) { return (Math.round(ms / 100) / 10).toFixed(1) + 's'; }

export function scoreAudit(scan, lead = {}) {
  const areas = {};
  const issues = [];
  for (const a of AREAS) areas[a.key] = { key: a.key, label: a.label, rules: [], manual: [], earned: 0, max: 0, score: 0 };
  const rule = (area, label, earned, max, detail = '') => {
    const status = earned == null ? 'unknown' : earned >= max ? 'pass' : earned <= 0 ? 'fail' : 'partial';
    areas[area].rules.push({ label, earned: earned == null ? null : earned, max, status, detail });
  };
  const issue = (area, id, weight, finding, action) => issues.push({ area, id, weight, finding, action });
  const manual = (area, text) => areas[area].manual.push(text);

  const w = scan.website || {};
  const p = scan.page;
  const reachable = scan.status === 'ok' && !!p;
  const psiM = w.psi?.mobile || {};
  const psiD = w.psi?.desktop || {};
  const psiOk = psiM.status === 'ok';
  const business = (lead.business || '').trim();

  // ---------------------------------------------------------------- Website
  if (!reachable) {
    rule('website', 'Website loads for visitors', 0, 10, w.error ? 'Error: ' + w.error : (w.status ? 'HTTP ' + w.status : 'No response'));
    issue('website', 'unreachable', 100, `Your website (${scan.host || scan.input}) did not load when we tested it${w.status ? ' (HTTP ' + w.status + ')' : ''}.`,
      'Get the site loading reliably first; every other channel sends customers there. Check hosting, the domain renewal and DNS settings.');
  } else {
    rule('website', 'Loads securely over HTTPS', w.https ? 2 : 0, 2, w.https ? 'HTTPS works' : 'Served without HTTPS');
    if (!w.https) issue('website', 'no_https', 90, 'Your site is not served securely over HTTPS, so browsers can label it "Not secure".', 'Turn on a free SSL certificate (most hosts and Cloudflare offer one) and force HTTPS.');
    const rd = w.httpRedirect || {};
    rule('website', 'http:// redirects to https://', rd.checked ? (rd.redirectsToHttps ? 1 : 0) : null, 1, rd.checked ? (rd.redirectsToHttps ? 'Redirects (' + rd.status + ')' : 'No redirect (HTTP ' + rd.status + ')') : 'Could not test');
    if (rd.checked && !rd.redirectsToHttps && w.https) issue('website', 'no_redirect', 35, 'Visitors who type http:// are not sent to the secure version of your site.', 'Add a permanent (301) redirect from http:// to https://.');
    rule('website', 'Mobile-friendly viewport', p.mobileViewport ? 1 : 0, 1, p.viewport ? 'viewport: ' + p.viewport.slice(0, 60) : 'No viewport meta tag');
    if (!p.mobileViewport) issue('website', 'no_viewport', 75, 'Your homepage is missing the mobile viewport setting, so phones may show a shrunken desktop layout.', 'Make the site responsive and add the standard mobile viewport tag; most customers will visit on a phone.');

    if (psiOk) {
      const perf = psiM.performance;
      rule('website', 'Mobile speed score (Google PageSpeed)', perf >= 90 ? 3 : perf >= 70 ? 2 : perf >= 50 ? 1 : 0, 3, perf + '/100 mobile' + (psiD.status === 'ok' ? ', ' + psiD.performance + '/100 desktop' : ''));
      if (perf < 50) issue('website', 'slow_mobile', 80, `Your mobile speed score is ${perf}/100 on Google PageSpeed, which means many visitors on phones wait too long.`, 'Compress and resize images, remove unused plugins and scripts, and use good caching or a CDN.');
      else if (perf < 70) issue('website', 'slow_mobile', 55, `Your mobile speed score is ${perf}/100 on Google PageSpeed; there is clear room to load faster on phones.`, 'Compress images and trim heavy scripts to bring mobile load time down.');
      else if (perf < 90) issue('website', 'slow_mobile', 25, `Your mobile speed score is ${perf}/100 — decent, with some easy gains left.`, 'Fine-tune images and scripts to reach the 90+ range.');
      const lcp = psiM.lcpMs;
      rule('website', 'Main content appears quickly (LCP ≤ 2.5s)', lcp == null ? null : lcp <= 2500 ? 1 : 0, 1, lcp == null ? 'Not reported' : 'LCP ' + secs(lcp) + ' on mobile');
      if (lcp != null && lcp > 4000) issue('website', 'slow_lcp', 60, `On mobile, your main content takes about ${secs(lcp)} to appear (Google's target is 2.5s).`, 'Optimise the largest image or banner at the top of the page and serve it in a modern format.');
      const cls = psiM.cls;
      rule('website', 'Layout stays stable while loading (CLS ≤ 0.1)', cls == null ? null : cls <= 0.1 ? 1 : 0, 1, cls == null ? 'Not reported' : 'CLS ' + cls);
      if (cls != null && cls > 0.25) issue('website', 'cls', 30, `The page jumps around while loading (layout shift ${cls}).`, 'Set fixed sizes for images, embeds and banners so the page does not move as it loads.');
      const acc = psiM.accessibility;
      rule('website', 'Accessibility score ≥ 90', acc == null ? null : acc >= 90 ? 1 : 0, 1, acc == null ? 'Not reported' : acc + '/100');
      if (acc != null && acc < 80) issue('website', 'a11y', 30, `Your accessibility score is ${acc}/100, so some visitors will struggle to read or use the site.`, 'Fix colour contrast, add image descriptions and label your buttons and forms.');
      rule('website', 'Best-practices score (info)', null, 0, psiM.bestPractices != null ? psiM.bestPractices + '/100' : '');
    } else {
      // Fallback signals when Google's lab test is unavailable.
      const rt = w.responseMs;
      rule('website', 'Server responds quickly', rt == null ? null : rt < 1000 ? 2 : rt < 2500 ? 1 : 0, 2, rt == null ? '' : 'Homepage HTML in ' + secs(rt) + ' from our test server');
      if (rt != null && rt >= 2500) issue('website', 'slow_server', 60, `Your homepage took ${secs(rt)} just to start responding in our test.`, 'Review hosting performance and caching; a slow server delays everything else.');
      const kb = Math.round((w.htmlBytes || 0) / 1024);
      rule('website', 'Lightweight page HTML (< 200 KB)', w.htmlBytes ? (kb < 200 ? 1 : 0) : null, 1, kb + ' KB HTML');
      const altRatio = p.images ? p.imagesWithAlt / p.images : 1;
      rule('website', 'Images have text descriptions (alt)', altRatio >= 0.9 ? 1 : 0, 1, p.images ? p.imagesWithAlt + ' of ' + p.images + ' images' : 'No images found');
      rule('website', 'Page language declared', p.lang ? 1 : 0, 1, p.lang || 'Missing');
      rule('website', 'Google PageSpeed lab test', null, 0, psiM.status === 'quota' ? 'Not measured: PageSpeed API quota (needs PSI_API_KEY)' : 'Not measured: ' + (psiM.error || psiM.status || 'unavailable'));
      manual('website', 'Run a full Google PageSpeed test (speed, Core Web Vitals) — the automated test was unavailable for this scan.');
    }
  }

  // ---------------------------------------------------------------- Search
  const noindex = !!(p?.noindexMeta || scan.xRobotsNoindex);
  const blocksAll = !!scan.crawl?.blocksAll;
  if (reachable) {
    rule('search', 'Page can be indexed by Google', noindex || blocksAll ? 0 : 2, 2, noindex ? 'noindex found' : blocksAll ? 'robots.txt blocks all crawlers' : 'Indexable');
    if (noindex || blocksAll) issue('search', 'noindex', 100, noindex ? 'Your homepage tells Google not to index it ("noindex"), so it cannot appear in search results.' : 'Your robots.txt blocks all search engines from crawling the site.', 'Remove the noindex / "Disallow: /" setting (often a leftover from development) and resubmit the site in Google Search Console.');
    const tl = p.titleLength;
    rule('search', 'Page title present (10–65 characters)', tl >= 10 && tl <= 65 ? 1 : 0, 1, p.title ? `"${p.title.slice(0, 80)}" (${tl} chars)` : 'Missing');
    if (!p.title) issue('search', 'no_title', 70, 'Your homepage has no page title, which is the headline Google shows in results.', 'Write a clear title with your business name, what you do and where (under ~60 characters).');
    else if (tl > 65 || tl < 10) issue('search', 'title_len', 20, `Your page title is ${tl} characters, so Google may cut it off or find it too thin.`, 'Rewrite the title to roughly 30–60 characters: business name, main service and location.');
    const md = p.metaDescription || '';
    rule('search', 'Meta description present', md.length >= 50 && md.length <= 170 ? 1 : md ? 0.5 : 0, 1, md ? md.length + ' chars' : 'Missing');
    if (md && md.length < 50) issue('search', 'short_meta_desc', 30, `Your meta description is only ${md.length} characters, so your Google snippet says very little.`, 'Expand it to 120–160 characters covering what you offer, where, and why customers choose you.');
    if (!md) issue('search', 'no_meta_desc', 45, 'Your homepage has no meta description, so Google picks random text for your search snippet.', 'Add a 120–160 character description that says what you offer and invites the click.');
    rule('search', 'One clear main heading (H1)', p.h1Count === 1 ? 1 : p.h1Count > 1 ? 0.5 : 0, 1, p.h1Count ? p.h1Count + ' H1' + (p.h1 ? ': "' + p.h1.slice(0, 60) + '"' : '') : 'No H1');
    if (!p.h1Count) issue('search', 'no_h1', 35, 'Your homepage has no main (H1) heading telling Google and visitors what the page is about.', 'Add one clear headline that states what you do and for whom.');
    rule('search', 'Canonical URL set', p.canonical ? 1 : 0, 1, p.canonical || 'Missing');
    rule('search', 'robots.txt present', scan.crawl?.robotsFound ? 1 : 0, 1, scan.crawl?.robotsFound ? 'Found' : 'Not found');
    rule('search', 'XML sitemap found', scan.crawl?.sitemapFound ? 1 : 0, 1, scan.crawl?.sitemapFound ? scan.crawl.sitemapChecked : 'Not found');
    if (!scan.crawl?.sitemapFound) issue('search', 'no_sitemap', 30, 'We could not find an XML sitemap, which helps Google discover all your pages.', 'Generate a sitemap (most site builders can) and submit it in Google Search Console.');
    const types = p.jsonLdTypes || [];
    const bizSchema = types.some(t => /Organization|LocalBusiness|Store|Restaurant|Service|Corporation|Hotel|Dentist|Physician|Clinic|School|Bakery|Cafe|Salon|Spa|Shop/i.test(t));
    rule('search', 'Business structured data (schema.org)', bizSchema ? 1 : types.length ? 0.5 : 0, 1, types.length ? types.join(', ') : 'None found');
    if (!bizSchema) issue('search', 'no_schema', 35, 'Your site has no business structured data, which helps Google and AI assistants understand who you are, where you are and what you offer.', 'Add LocalBusiness (or Organization) schema with your name, address, phone, hours and social profiles.');
    if (psiOk && psiM.seo != null) {
      rule('search', 'Google PageSpeed SEO score ≥ 90', psiM.seo >= 90 ? 1 : 0, 1, psiM.seo + '/100');
      if (psiM.seo < 80) issue('search', 'psi_seo', 30, `Google's basic SEO check scores your homepage ${psiM.seo}/100.`, 'Fix the basics flagged by Google (titles, link text, crawlable links, tap targets).');
    }
  } else {
    rule('search', 'Website loads so it can be found', 0, 10, 'Site did not load');
  }
  const pl = scan.places || {};
  if (pl.status === 'found') {
    rule('search', 'Google Business Profile linked to this website', 2, 2, (pl.name || 'Profile found') + (pl.reviews != null ? ` · ${pl.reviews} reviews` : '') + (pl.rating != null ? ` · ${pl.rating}★` : ''));
    if ((pl.reviews || 0) < 10) issue('search', 'few_reviews', 45, `Your Google Business Profile has ${pl.reviews || 0} reviews; more recent reviews help you rank in Maps and win trust.`, 'Ask happy customers for a Google review after each job, with a short link sent by WhatsApp.');
  } else if (pl.status === 'not_found') {
    rule('search', 'Google Business Profile linked to this website', 0, 2, pl.note || 'Not found');
    issue('search', 'no_gbp', 70, `We could not find a Google Business Profile for ${business || 'your business'} linked to your website.`, 'Claim or create your free Google Business Profile, add your website, hours, photos and services, and link it to the site.');
  } else {
    rule('search', 'Google Business Profile', null, 0, pl.note || 'Needs manual check');
    manual('search', 'Google Business Profile: search for the business on Google Maps — check it exists, links to the website, has hours, photos and recent reviews.');
  }
  manual('search', 'AI assistant visibility: ask ChatGPT/Gemini for "best [service] in [city]" and note whether the business appears.');

  // ---------------------------------------------------------------- Social
  if (reachable) {
    const n = p.socialCount;
    const plats = Object.keys(p.social || {}).filter(k => k !== 'whatsapp');
    rule('social', 'Social profiles linked from the website', n >= 4 ? 5 : n === 3 ? 4 : n === 2 ? 3 : n === 1 ? 2 : 0, 5, plats.length ? plats.map(x => x === 'x' ? 'X/Twitter' : x[0].toUpperCase() + x.slice(1)).join(', ') : 'None found');
    if (n === 0) issue('social', 'no_social', 55, 'Your website does not link to any social media profiles, so visitors cannot check your recent work or follow you.', 'Add links (header or footer) to the 2–3 platforms where your customers actually are, and keep them active.');
    else if (n === 1) issue('social', 'one_social', 25, `Your website links to only one social profile (${plats[0]}).`, 'Link every active profile from your site so customers can find you wherever they spend time.');
    rule('social', 'WhatsApp chat link on the website', p.whatsapp ? 2 : 0, 2, p.whatsapp ? 'Found' : 'Not found');
    if (!p.whatsapp) issue('social', 'no_whatsapp', 60, 'There is no WhatsApp chat link on your website, even though many customers prefer to message rather than call or email.', 'Add a click-to-chat WhatsApp button (wa.me link) with a pre-filled greeting on every page.');
    const og = p.og || {};
    const ogScore = (og.title ? 1 : 0) + (og.image ? 1 : 0);
    rule('social', 'Link previews set up (Open Graph title + image)', ogScore, 2, [og.title ? 'og:title' : null, og.image ? 'og:image' : null].filter(Boolean).join(', ') || 'Missing');
    if (ogScore < 2) issue('social', 'no_og', 40, 'When someone shares your website on WhatsApp or Facebook, it may show without a proper title or image.', 'Add Open Graph tags (title, description and a 1200×630 share image) so shared links look professional.');
    rule('social', 'X/Twitter card tag', p.twitterCard ? 1 : 0, 1, p.twitterCard || 'Missing');
  } else {
    rule('social', 'Social links on the website', 0, 10, 'Site did not load');
  }
  manual('social', 'Check each profile: posting frequency, last post date, consistent name/logo/bio, and whether posts drive enquiries.');

  // ---------------------------------------------------------------- Brand
  if (reachable) {
    rule('brand', 'Favicon (browser tab icon)', scan.favicon ? 2 : 0, 2, scan.favicon ? 'Found' : 'Not found');
    if (!scan.favicon) issue('brand', 'no_favicon', 30, 'Your site has no favicon, the small logo in the browser tab and bookmarks.', 'Add a favicon made from your logo; it is a small detail that makes the site look finished.');
    rule('brand', 'Logo detected on the homepage', p.logo || p.jsonLdLogo ? 2 : 0, 2, p.logo || p.jsonLdLogo ? 'Found' : 'Not detected (check manually)');
    if (!p.logo && !p.jsonLdLogo) issue('brand', 'no_logo', 20, 'We could not detect a logo on your homepage.', 'Make sure your logo appears top-left on every page and links to the homepage.');
    rule('brand', 'Share image (og:image) set', p.og?.image ? 2 : 0, 2, p.og?.image ? 'Found' : 'Missing');
    const titleHas = business ? nameIn(business, p.title) : null;
    const ogHas = business ? nameIn(business, (p.og?.siteName || '') + ' ' + (p.og?.title || '')) : null;
    if (business) {
      const sc = (titleHas ? 1 : 0) + (ogHas ? 1 : 0);
      rule('brand', 'Business name consistent in title and share tags', sc, 2, `"${business}" ${titleHas ? 'in' : 'not in'} page title; ${ogHas ? 'in' : 'not in'} Open Graph tags`);
      if (sc === 0) issue('brand', 'name_mismatch', 35, `Your business name ("${business}") does not appear in your page title or share tags, so search results and shared links may not show your brand.`, 'Use your exact business name consistently in the page title, share tags, social profiles and Google Business Profile.');
    } else {
      const consistent = p.og?.siteName && p.title && nameIn(p.og.siteName, p.title);
      rule('brand', 'Brand name consistent in title and share tags', p.og?.siteName ? (consistent ? 2 : 1) : null, 2, p.og?.siteName ? 'og:site_name "' + p.og.siteName + '"' : 'No business name given');
    }
    rule('brand', 'Organisation details in structured data', p.jsonLdName ? 1 : 0, 1, p.jsonLdName || 'Not found');
    const siteEmails = p.emails || [];
    const ownDomainEmail = siteEmails.some(e => !FREE_MAIL.has(emailDomain(e)));
    rule('brand', 'Branded email address shown (not Gmail/Yahoo)', siteEmails.length ? (ownDomainEmail ? 1 : 0) : null, 1, siteEmails.length ? siteEmails.slice(0, 2).join(', ') : 'No email shown on homepage');
  } else {
    rule('brand', 'Brand visible online', 0, 10, 'Site did not load');
  }
  manual('brand', 'Human review: logo quality, colours/fonts consistency, photography, tone of voice and whether the brand looks credible next to competitors.');

  // ---------------------------------------------------------------- Business systems
  const d = scan.dns || {};
  if (d.checked) {
    const prov = d.mxProvider || 'unknown';
    const pro = /Google Workspace|Microsoft 365|Zoho/.test(prov);
    rule('systems', 'Business email set up on the domain (MX)', prov === 'unknown' ? null : prov === 'none' ? 0 : pro ? 3 : 2, 3, prov === 'unknown' ? 'MX lookup failed' : prov === 'none' ? 'No MX records for ' + d.domain : prov + ' (' + d.domain + ')');
    if (prov === 'none') issue('systems', 'no_mx', 70, `${d.domain} has no email (MX) records, so there is no email address on your own domain.`, 'Set up business email (Google Workspace or Microsoft 365) on your domain, e.g. hello@' + d.domain + '.');
    rule('systems', 'SPF record (stops spoofing, helps delivery)', d.spf ? 2 : 0, 2, d.spf ? d.spf.slice(0, 70) : 'Missing');
    if (!d.spf && prov !== 'none') issue('systems', 'no_spf', 45, `Your domain has no SPF record, so your emails are more likely to land in spam and others can spoof your address.`, 'Add an SPF record for your email provider (one DNS TXT record).');
    rule('systems', 'DMARC policy', d.dmarc ? (d.dmarcPolicy === 'none' ? 1 : 2) : 0, 2, d.dmarc ? 'p=' + d.dmarcPolicy : 'Missing');
    if (!d.dmarc && prov !== 'none') issue('systems', 'no_dmarc', 40, 'Your domain has no DMARC record, which Gmail and Yahoo now expect from senders and which protects your brand from email spoofing.', 'Add a DMARC record (start with p=none and reporting, then tighten to quarantine).');
  } else {
    rule('systems', 'Email DNS records', null, 0, 'DNS lookup failed');
  }
  const siteEmails2 = p?.emails || [];
  const freeOnSite = (p?.freeMailOnSite || []).length > 0;
  const leadFree = lead.email ? FREE_MAIL.has(emailDomain(lead.email)) : false;
  const anyKnown = siteEmails2.length || lead.email;
  const usesFree = freeOnSite || (leadFree && !siteEmails2.some(e => !FREE_MAIL.has(emailDomain(e))));
  rule('systems', 'Uses a branded email (not free webmail)', anyKnown ? (usesFree ? 0 : 2) : null, 2,
    freeOnSite ? 'Site shows ' + p.freeMailOnSite[0] : leadFree ? 'Enquiry sent from a free webmail address' : siteEmails2.length ? 'Site shows ' + siteEmails2[0] : 'Enquiry from ' + emailDomain(lead.email));
  if (anyKnown && usesFree) issue('systems', 'webmail', 55, freeOnSite ? `Your website lists a free webmail address (${p.freeMailOnSite[0]}), which looks less established to customers and suppliers.` : 'You are using a free webmail address for the business, which looks less established and is harder to manage as the team grows.', 'Move to a branded address on your own domain (e.g. info@yourbusiness) with Google Workspace or Microsoft 365.');
  if (reachable) {
    const contact = siteEmails2.length > 0 || p.tel || p.whatsapp;
    rule('systems', 'Easy contact details on the homepage', contact ? 1 : 0, 1, [siteEmails2.length ? 'email' : null, p.tel ? 'phone' : null, p.whatsapp ? 'WhatsApp' : null].filter(Boolean).join(', ') || 'None found');
    if (!contact) issue('systems', 'no_contact', 50, 'We could not find an email, phone number or WhatsApp link on your homepage.', 'Put your phone/WhatsApp and email in the header or footer of every page.');
  }
  manual('systems', 'Ask: where do customer records, invoices and files live today (spreadsheets, notebooks, a CRM)? Is anything backed up?');

  // ---------------------------------------------------------------- Automation
  const msg = ((lead.message || '') + ' ' + (lead.time_waster || '')).toLowerCase();
  if (reachable) {
    const hasForm = p.forms > 0 || p.embeddedForms.length > 0;
    rule('automation', 'Enquiry form on the site', hasForm ? 2 : p.contactLink ? 1 : 0, 2, hasForm ? (p.embeddedForms.join(', ') || p.forms + ' form(s) on homepage') : p.contactLink ? 'No homepage form; links to a contact page' : 'No form found');
    if (!hasForm) issue('automation', 'no_form', p.contactLink ? 30 : 60, p.contactLink ? 'There is no enquiry form on your homepage (visitors have to click through to contact you).' : 'We found no enquiry form on your site, so leads depend on people calling or emailing.', 'Add a short enquiry form that sends each lead straight to your email/WhatsApp and a simple lead list.');
    const bo = [...p.booking, ...p.ordering];
    rule('automation', 'Online booking or ordering', bo.length ? 3 : 0, 3, bo.length ? bo.join(', ') : 'None detected');
    if (!bo.length) issue('automation', 'no_booking', 50, 'We could not detect online booking or ordering on your website, so bookings likely need a manual back-and-forth.', 'Add online booking or ordering (e.g. a booking calendar or simple order form) with automatic confirmations and reminders.');
    const chat = p.chat.length > 0 || p.whatsapp;
    rule('automation', 'Live chat or WhatsApp on the site', chat ? 2 : 0, 2, p.chat.length ? p.chat.join(', ') : p.whatsapp ? 'WhatsApp link' : 'None');
    if (!chat) issue('automation', 'no_chat', 40, 'We did not find a chat or WhatsApp option for quick questions, so some visitors may leave without asking.', 'Add a WhatsApp chat button and set up quick replies (or an AI assistant) for common questions.');
    const realPay = p.payments.filter(x => !/mentioned/.test(x));
    rule('automation', 'Online payments', realPay.length ? 2 : p.payments.length ? 1 : 0, 2, p.payments.length ? p.payments.join(', ') : 'None detected');
    if (!realPay.length) issue('automation', 'no_payments', 30, 'We did not find an online payment option (card or MoMo link) on your site.', 'Add Paystack/Hubtel payment links or checkout so customers can pay deposits and invoices instantly.');
    rule('automation', 'Analytics installed', p.analytics.length ? 1 : 0, 1, p.analytics.length ? p.analytics.join(', ') : 'None detected');
    if (!p.analytics.length) issue('automation', 'no_analytics', 40, 'We did not detect website analytics, so you cannot see where visitors come from or which pages bring enquiries.', 'Install Google Analytics 4 (or a privacy-friendly alternative) and track enquiry clicks and form submissions.');
  } else {
    rule('automation', 'Website tools for leads and bookings', 0, 10, 'Site did not load');
  }
  manual('automation', lead.time_waster ? `Their biggest time-waster: "${String(lead.time_waster).slice(0, 200)}" — map it to a workflow.` : 'Ask which repetitive tasks (replying to the same questions, invoices, follow-ups, reports) eat the most time each week.');

  // Boost issues that match what the lead told us.
  const boosts = [
    [/book|appointment|reservation|schedul/, ['no_booking']],
    [/whatsapp|messag|repl|dm|inbox|enquir|inquir/, ['no_whatsapp', 'no_chat', 'no_form']],
    [/pay|invoice|momo|deposit/, ['no_payments']],
    [/google|seo|search|found|visib|rank/, ['no_gbp', 'no_meta_desc', 'no_schema', 'noindex', 'no_sitemap']],
    [/instagram|facebook|tiktok|social/, ['no_social', 'one_social', 'no_og']],
    [/slow|speed|load/, ['slow_mobile', 'slow_lcp', 'slow_server']],
    [/email|spam|gmail/, ['webmail', 'no_mx', 'no_spf', 'no_dmarc']],
    [/track|data|report|analytics/, ['no_analytics']]
  ];
  for (const [re, ids] of boosts) if (re.test(msg)) for (const it of issues) if (ids.includes(it.id)) { it.weight += 15; it.boosted = true; }
  const fv = String(lead.found_via || '').toLowerCase();
  if (/google/.test(fv)) for (const it of issues) if (it.area === 'search') it.weight += 10;
  if (/instagram|facebook|tiktok/.test(fv)) for (const it of issues) if (it.area === 'social') it.weight += 10;

  // Area scores
  let total = 0;
  for (const a of AREAS) {
    const ar = areas[a.key];
    for (const r of ar.rules) if (r.earned != null && r.max > 0) { ar.earned += r.earned; ar.max += r.max; }
    ar.score = ar.max > 0 ? Math.round((10 * ar.earned) / ar.max) : 0;
    ar.measured = ar.rules.filter(r => r.max > 0 && r.earned != null).length;
    total += ar.score;
  }

  issues.sort((x, y) => y.weight - x.weight);
  const picked = [];
  const usedAreas = new Set();
  for (const it of issues) { if (picked.length < 3 && !usedAreas.has(it.area)) { picked.push(it); usedAreas.add(it.area); } }
  for (const it of issues) { if (picked.length < 3 && !picked.includes(it)) picked.push(it); }

  return { areas, total, outOf: 60, issues, topIssues: picked };
}

// ---- Templated copy (used directly, or as the fallback when AI is unavailable)
const PRIORITY_TITLES = {
  unreachable: 'Get your website loading reliably', no_https: 'Secure your site with HTTPS', no_redirect: 'Redirect every visitor to the secure site',
  no_viewport: 'Make the site work properly on phones', slow_mobile: 'Speed up your site on mobile', slow_lcp: 'Show your main content faster', cls: 'Stop the page jumping while it loads',
  a11y: 'Make the site easier for everyone to use', slow_server: 'Fix slow server response', noindex: 'Let Google index your website', no_title: 'Add a strong page title',
  title_len: 'Tighten your page title', short_meta_desc: 'Expand your search snippet', no_meta_desc: 'Write a search snippet that earns the click', no_h1: 'Give your homepage a clear headline', no_sitemap: 'Add an XML sitemap',
  no_schema: 'Tell Google and AI assistants who you are', psi_seo: 'Fix Google\u2019s basic SEO flags', few_reviews: 'Grow your Google reviews', no_gbp: 'Claim your Google Business Profile',
  no_social: 'Connect your social profiles to your website', one_social: 'Link all your active social profiles', no_whatsapp: 'Add WhatsApp click-to-chat', no_og: 'Make shared links look professional',
  no_favicon: 'Add a favicon', no_logo: 'Make your logo visible on every page', name_mismatch: 'Use your business name consistently', no_mx: 'Set up business email on your domain',
  no_spf: 'Add SPF so your emails reach the inbox', no_dmarc: 'Protect your domain with DMARC', webmail: 'Move to a branded business email', no_contact: 'Make it easy to contact you',
  no_form: 'Capture enquiries with a simple form', no_booking: 'Let customers book or order online', no_chat: 'Answer quick questions instantly', no_payments: 'Take payments online', no_analytics: 'Measure where your enquiries come from'
};

export function templatedPriorities(result) {
  return result.topIssues.map(it => ({ area: it.area, title: PRIORITY_TITLES[it.id] || 'Quick win', why: it.finding, action: it.action }));
}

export function templatedRecommendations(result) {
  const out = {};
  for (const a of AREAS) {
    const ar = result.areas[a.key];
    const its = result.issues.filter(i => i.area === a.key).slice(0, 2);
    if (its.length) out[a.key] = its.map(i => i.action).join(' ');
    else {
      const passes = ar.rules.filter(r => r.status === 'pass').map(r => r.label.toLowerCase()).slice(0, 2);
      out[a.key] = passes.length ? `Good foundations here (${passes.join('; ')}). Keep it maintained and review it quarterly.` : 'We need a quick human review to score this area properly; we will cover it on a call.';
    }
  }
  return out;
}

export function templatedSummary(result, lead = {}) {
  const sorted = AREAS.map(a => result.areas[a.key]).sort((x, y) => y.score - x.score);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  const name = lead.business || 'your business';
  return `${name} scores ${result.total}/60 across our six-area check. ${best.label} is the strongest area (${best.score}/10)` +
    (worst.score < best.score ? `, and ${worst.label} (${worst.score}/10) is where the biggest gains are.` : '.') +
    ' The three priorities below are the changes we expect to make the most difference first.';
}
