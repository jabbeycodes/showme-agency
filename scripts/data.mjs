import { readFileSync } from 'node:fs';
// ============================================================================
// ShowMe Digital Agency — site content data
// Single source of truth for pages, services and industries. Copy is original.
// Real facts (prices, guarantee, contacts) are centralised in `site` and the
// growth-retainer service so they stay consistent and easy to update.
// ============================================================================

import { PRICES } from './prices.mjs';

export const site = {
  name: 'ShowMe Digital Agency',
  shortName: 'ShowMe',
  tagline: 'Build. Grow. Automate.',
  strapline: 'Your digital business partner',
  origin: 'https://agency.showmeworld.app',
  email: 'josh@showmeworld.app',
  whatsappNumber: '13364572361',
  whatsappDisplay: '+1 336 457 2361',
  founder: 'Joshua Abbey',
  founderImage: 'https://agency.showmeworld.app/assets/joshua-abbey.jpg',
  // US-led (founder based in the United States, country level only; no city or
  // street address is published), with the delivery team on the ground in
  // Accra, Ghana. Ghana remains the core market.
  location: 'United States',
  founderLocation: 'United States',
  teamLocation: 'Accra, Ghana',
  locationLine: 'US-led, with our team on the ground in Accra, Ghana',
  serviceArea: 'Serving businesses in Ghana and diaspora and international clients in the US, UK and Canada',
  ogImage: 'https://agency.showmeworld.app/og-image.png',
  // Real, existing facts — do not change without founder input.
  facts: {
    experience: '7+ years',
    businessesHelped: '50+',
    retainerPrice: 'GHS 3,200',
    retainerMinimum: '3-month minimum',
    adSpendMin: 'GHS 1,500',
    guarantee: 'Live within 7 days of onboarding — or month 1 is free.',
    responsePromise: 'within one business day'
  }
};

export function wa(text) {
  return 'https://wa.me/' + site.whatsappNumber + (text ? '?text=' + encodeURIComponent(text) : '');
}

// "Book a free call" opens WhatsApp with a prefilled message (no calendar
// tool), with email as the fallback for anyone not on WhatsApp.
export const BOOK_CALL_TEXT = "Hi Josh, I'd like to book a free 20-minute call with ShowMe.\n\nMy name: \nBusiness: \nWhat I need help with: \nBest day and time for a call (and my time zone): ";
export const bookCallUrl = wa(BOOK_CALL_TEXT);
export const bookCallMailto = 'mailto:' + site.email + '?subject=' + encodeURIComponent('Book a free call with ShowMe') +
  '&body=' + encodeURIComponent("Hi Josh,\n\nI'd like to book a free 20-minute call.\n\nMy name: \nBusiness: \nWhat I need help with: \nBest day and time (and my time zone): \nPhone/WhatsApp: \n");

// ---- Divisions --------------------------------------------------------------
export const divisions = [
  { slug: 'web-commerce', num: '01', title: 'Web & Commerce', short: 'Web & Commerce',
    blurb: 'Websites, stores and booking systems that turn visits into enquiries and orders.' },
  { slug: 'growth', num: '02', title: 'Growth', short: 'Growth',
    blurb: 'Get found and get chosen — search, ads, social and content that bring qualified demand.' },
  { slug: 'brand', num: '03', title: 'Brand', short: 'Brand',
    blurb: 'Look credible everywhere: identity, collateral, photography and pitch decks.' },
  { slug: 'business-technology', num: '04', title: 'Business Technology', short: 'Business Tech',
    blurb: 'The back office — email, files, CRM and IT that keep a growing team organised.' },
  { slug: 'ai-automation', num: '05', title: 'AI & Automation', short: 'AI & Automation',
    blurb: 'Put routine work on autopilot with WhatsApp assistants and process automation.' },
  { slug: 'software', num: '06', title: 'Software', short: 'Software',
    blurb: "Custom apps, portals and integrations for when off-the-shelf isn't enough." }
];

export const divisionBySlug = Object.fromEntries(divisions.map(d => [d.slug, d]));

// ---- Services ---------------------------------------------------------------
// Published "from" prices (GHS, with an indicative USD guide for diaspora
// clients). Benchmarked against the Ghanaian market (see README). The Growth
// retainer keeps its real, founder-set numbers below.
function P(slug) {
  const p = PRICES[slug];
  if (!p) throw new Error('No price defined for service: ' + slug);
  return { price: p.price, usd: p.usd, note: p.note, placeholder: false };
}

export const services = [
  // ===== Web & Commerce =====
  {
    slug: 'business-websites', division: 'web-commerce', title: 'Business Websites',
    metaTitle: 'Business Website Design in Accra, Ghana',
    summary: 'Fast, mobile-first websites that load on slow networks and turn visitors into enquiries.',
    metaDescription: 'ShowMe builds fast, mobile-first business websites for Ghanaian companies — SEO-ready, easy to update and wired to capture every enquiry.',
    problem: 'Most business websites are slow, hard to update, and treat the enquiry as an afterthought. Visitors bounce, and the ones who do reach out fall through the cracks.',
    deliverables: [
      'A custom, mobile-first design built and tested from 375px up',
      'Fast loading on Ghanaian mobile networks (lazy-loaded images, lean code)',
      'A content structure you can update yourself, with training and handover',
      'Enquiry capture wired to WhatsApp and email so no lead goes cold',
      'SEO foundations: clean titles, meta descriptions, schema and a sitemap',
      'Google Analytics and Search Console set up at launch'
    ],
    whoFor: ['Established businesses replacing a dated or DIY site', 'New companies that need to look credible from day one', 'Teams that want to update their own content without a developer'],
    outcomes: ['More enquiries from the same traffic', 'A site you actually control', 'A credible first impression on any device'],
    process: [
      { t: 'Discover', d: 'We map your customers, goals and the pages you need.' },
      { t: 'Design', d: 'You approve a real preview before we build a single page.' },
      { t: 'Build', d: 'We develop, wire up enquiry capture, and add SEO foundations.' },
      { t: 'Launch', d: 'We go live, train your team and hand over full access.' }
    ],
    pricing: P('business-websites'),
    faqs: [
      { q: 'How long does a website take?', a: 'A typical business website takes 3–5 weeks from the signed proposal: about a week for discovery and design, two to three weeks to build, then review and launch. Quick content and approvals keep it at the shorter end.' },
      { q: 'Can I update it myself?', a: 'Yes. We build with content you can edit and train your team at handover, so you are never locked into a developer for small changes.' },
      { q: 'Do I own the website?', a: 'You own your domain, content and assets. We hand over full access at launch.' }
    ],
    related: ['ecommerce-momo', 'landing-pages-funnels', 'website-care']
  },
  {
    slug: 'ecommerce-momo', division: 'web-commerce', title: 'E-commerce & Mobile Money Checkout',
    metaTitle: 'E-commerce Websites with Mobile Money & Card Checkout',
    summary: 'Online stores that accept MoMo, Paystack and card, with WhatsApp reordering built in.',
    metaDescription: 'Sell online in Ghana with a mobile-first store: MTN MoMo, Telecel Cash, Paystack and card checkout, WhatsApp reordering, inventory and order reporting.',
    problem: 'Selling through DMs and manual invoices does not scale. Customers abandon when they cannot pay the way they want, and you lose track of orders and stock.',
    deliverables: [
      'A mobile-first store designed to convert on phones',
      'Checkout with MTN MoMo, Telecel Cash, Paystack and card',
      'WhatsApp reordering so repeat customers buy in a tap',
      'Product, inventory and order management you can run yourself',
      'Order confirmations and simple sales reporting',
      'SEO foundations so products can be found in search'
    ],
    whoFor: ['Retailers and boutiques moving beyond DM sales', 'Food and FMCG brands taking repeat orders', 'Anyone who needs reliable MoMo and card payments'],
    outcomes: ['Fewer abandoned carts', 'Repeat orders without manual admin', 'A single view of orders, stock and revenue'],
    process: [
      { t: 'Discover', d: 'We scope your catalogue, payment methods and delivery flow.' },
      { t: 'Design', d: 'You approve the store and checkout experience up front.' },
      { t: 'Build', d: 'We wire in payments, inventory and WhatsApp reordering.' },
      { t: 'Launch', d: 'We test real payments, go live and train your team.' }
    ],
    pricing: P('ecommerce-momo'),
    faqs: [
      { q: 'Which payment methods can you set up?', a: 'MTN MoMo, Telecel Cash, card and bank transfer via providers such as Paystack. We confirm the right mix for your customers during discovery.' },
      { q: 'Can customers reorder on WhatsApp?', a: 'Yes. We can add a WhatsApp reordering flow so repeat customers place orders in a couple of taps.' },
      { q: 'Do you handle delivery logistics?', a: 'We build the ordering and payment side and can integrate with your delivery partner or capture delivery details for your team.' }
    ],
    related: ['business-websites', 'whatsapp-ordering-booking', 'website-care']
  },
  {
    slug: 'landing-pages-funnels', division: 'web-commerce', title: 'Landing Pages & Funnels',
    metaTitle: 'High-Converting Landing Pages & Funnels',
    summary: 'Focused pages built to convert ad and campaign traffic into qualified enquiries.',
    metaDescription: 'Campaign landing pages and funnels designed to convert paid and social traffic into qualified leads, with fast load times and clear calls to action.',
    problem: 'Sending ad traffic to a busy homepage wastes budget. Without a focused page and clear next step, clicks do not become customers.',
    deliverables: [
      'A single-goal landing page matched to your offer and audience',
      'A clear call to action wired to WhatsApp, a form or a booking link',
      'Fast load times so you do not pay for people who bounce',
      'Conversion tracking so you can see what the spend returns',
      'A/B-ready structure for testing headlines and offers'
    ],
    whoFor: ['Businesses running Google or Meta ads', 'Launches and limited-time offers', 'Teams tired of paying for clicks that go nowhere'],
    outcomes: ['A higher share of clicks turning into enquiries', 'Clear numbers on cost per lead', 'Pages you can reuse for the next campaign'],
    process: [
      { t: 'Offer', d: 'We sharpen the offer and the single action you want.' },
      { t: 'Design', d: 'We design a focused page around that one goal.' },
      { t: 'Build', d: 'We build, add tracking and connect your lead capture.' },
      { t: 'Optimise', d: 'We watch conversions and refine headlines and layout.' }
    ],
    pricing: P('landing-pages-funnels'),
    faqs: [
      { q: 'Do I need a full website first?', a: 'No. A landing page can stand alone for a campaign, though it works best alongside your main site.' },
      { q: 'Can you run the ads too?', a: 'Yes — see our Paid Ads service, or bundle both inside the ShowMe Growth retainer.' },
      { q: 'How do you measure results?', a: 'We set up conversion tracking so you can see clicks, enquiries and cost per lead, not just visits.' }
    ],
    related: ['paid-ads', 'growth-retainer', 'business-websites']
  },
  {
    slug: 'booking-online-ordering', division: 'web-commerce', title: 'Booking & Online Ordering Systems',
    metaTitle: 'Online Booking & Ordering Systems',
    summary: 'Let customers book appointments or place orders around the clock, without the back-and-forth.',
    metaDescription: 'Online booking and ordering systems for clinics, salons, restaurants and services — take appointments and orders 24/7 with reminders and MoMo payments.',
    problem: 'Booking by phone and DM means missed calls, double-bookings and no-shows. Your team spends the day coordinating instead of serving customers.',
    deliverables: [
      'A booking or ordering flow customers can use any time',
      'Availability, services and pricing you control',
      'Automatic confirmations and reminders to cut no-shows',
      'Optional deposits or payment via MoMo and card',
      'A simple dashboard of upcoming bookings or orders'
    ],
    whoFor: ['Clinics, salons and service providers', 'Restaurants and caterers taking orders', 'Any team losing time to manual scheduling'],
    outcomes: ['Fewer no-shows and double-bookings', 'Less time on the phone', 'Bookings and orders even after hours'],
    process: [
      { t: 'Map', d: 'We map your services, availability and rules.' },
      { t: 'Design', d: 'We design a booking flow that fits how you work.' },
      { t: 'Build', d: 'We add reminders and optional payments.' },
      { t: 'Launch', d: 'We go live and train your team on the dashboard.' }
    ],
    pricing: P('booking-online-ordering'),
    faqs: [
      { q: 'Can it take deposits?', a: 'Yes. We can require a deposit or full payment via MoMo or card to reduce no-shows.' },
      { q: 'Will it send reminders?', a: 'Yes — automatic confirmations and reminders by WhatsApp, SMS or email, depending on your setup.' },
      { q: 'Does it work on a phone?', a: 'Everything is mobile-first, so customers can book or order from any device.' }
    ],
    related: ['whatsapp-ordering-booking', 'business-websites', 'business-process-automation']
  },
  {
    slug: 'website-care', division: 'web-commerce', title: 'Website Care & Maintenance',
    metaTitle: 'Website Care & Maintenance Plans',
    summary: 'Hosting, security, backups and updates so your site stays fast, safe and current.',
    metaDescription: 'Website care plans for Ghanaian businesses: hosting, SSL, backups, security updates, small content changes and uptime monitoring on a simple monthly plan.',
    problem: 'A website is not "done" at launch. Without updates and monitoring, sites break, slow down or get compromised — usually right when you need them.',
    deliverables: [
      'Managed hosting and SSL certificate',
      'Regular backups and security updates',
      'Uptime and performance monitoring',
      'A monthly allowance of small content changes',
      'Priority support when something needs fixing'
    ],
    whoFor: ['Businesses without an in-house web person', 'Owners who want peace of mind', 'Sites that need regular small updates'],
    outcomes: ['Less downtime and fewer surprises', 'A site that stays fast and secure', 'Someone accountable when things go wrong'],
    process: [
      { t: 'Onboard', d: 'We review your current setup and hosting.' },
      { t: 'Secure', d: 'We put backups, SSL and monitoring in place.' },
      { t: 'Maintain', d: 'We keep everything updated and handle small changes.' },
      { t: 'Report', d: 'You get a simple summary of what we did each month.' }
    ],
    pricing: P('website-care'),
    faqs: [
      { q: 'Do I have to have built my site with you?', a: 'Not always — tell us what you are running and we will confirm whether we can take it on during a quick review.' },
      { q: 'What counts as a small change?', a: 'Text edits, swapping images, adding a page section and similar tasks. Larger work is quoted separately.' },
      { q: 'Can I cancel?', a: 'Care plans are month to month once any minimum term is met. You keep your site and assets.' }
    ],
    related: ['business-websites', 'ecommerce-momo', 'analytics-reporting']
  },

  // ===== Growth =====
  {
    slug: 'growth-retainer', division: 'growth', title: 'ShowMe Growth Retainer',
    metaTitle: 'ShowMe Growth Retainer — Managed Demand & Lead System',
    summary: 'Our core offer: managed ads, a landing page and a WhatsApp lead system with weekly reporting.',
    metaDescription: 'The ShowMe Growth retainer: managed ads, a high-converting landing page, a WhatsApp lead system and weekly reporting for GHS 3,200/month, 3-month minimum.',
    problem: 'Running your own ads and follow-up part-time means wasted spend and leads that go cold. You need one accountable partner running demand end to end.',
    deliverables: [
      'Managed advertising and a high-converting landing page',
      'A WhatsApp lead system that captures and routes every enquiry',
      'Weekly reporting so you always know what the spend returns',
      'Ongoing optimisation of targeting, offers and follow-up',
      'A 3-month minimum engagement to give results time to compound'
    ],
    whoFor: ['Businesses ready to run demand consistently', 'Owners who want one partner, not five freelancers', 'Teams that need every lead followed up fast'],
    outcomes: ['A steady, measured flow of enquiries', 'Faster follow-up so fewer leads go cold', 'Clear weekly numbers you can act on'],
    process: [
      { t: 'Free audit', d: 'We review your site, visibility and systems and hand you three priorities.' },
      { t: 'Growth plan', d: 'You get a plain-English plan: what we run, what it costs, what changes first.' },
      { t: 'Launch in 7 days', d: 'Your landing page, lead system and reporting go live within 7 days of onboarding — or month 1 is free.' },
      { t: 'Grow monthly', d: 'We run demand, follow up every lead and report weekly.' }
    ],
    // Real pricing — do not change without founder input.
    pricing: {
      price: site.facts.retainerPrice + ' / month',
      usd: 'About USD 280 / month',
      note: 'Billed monthly in advance (MoMo, bank transfer or card), with a ' + site.facts.retainerMinimum + '. Ad spend is separate and prepaid in cedis (we recommend at least ' + site.facts.adSpendMin + '/month).',
      placeholder: false
    },
    faqs: [
      { q: 'What does the retainer cost?', a: site.facts.retainerPrice + ' per month with a ' + site.facts.retainerMinimum + ', billed monthly in advance by MoMo, bank transfer or card. Ad spend is separate and prepaid in cedis; we recommend at least ' + site.facts.adSpendMin + '/month.' },
      { q: 'Is ad spend included?', a: 'No. The retainer covers our management, landing page and lead system. Ad spend is paid separately and goes directly to the ad platforms.' },
      { q: 'What is the guarantee?', a: site.facts.guarantee + ' We guarantee our speed and execution, not inflated lead promises.' },
      { q: 'How quickly will we see work happening?', a: 'Fast. Our team follows a proven onboarding process: once we have your first payment and access, your landing page, lead system and reporting go live within 7 days, or month 1 is free.' }
    ],
    related: ['paid-ads', 'landing-pages-funnels', 'analytics-reporting']
  },
  {
    slug: 'local-seo-gbp', division: 'growth', title: 'Local SEO & Google Business Profile',
    metaTitle: 'Local SEO & Google Business Profile Management',
    summary: 'Show up in the map pack and local searches when nearby customers are ready to buy.',
    metaDescription: 'Local SEO and Google Business Profile management in Ghana: optimise your profile, win reviews, fix citations and rank in the map pack for nearby searches.',
    problem: 'When someone nearby searches for what you sell, a competitor with a better-managed profile gets the call. An unclaimed or thin profile costs you walk-ins and enquiries.',
    deliverables: [
      'Google Business Profile setup and optimisation',
      'Local keyword and competitor research for your area',
      'Review generation strategy and response management',
      'Consistent name, address and phone details across directories',
      'Posts, photos and Q&A to keep your profile active',
      'Monthly reporting on rankings, calls and directions'
    ],
    whoFor: ['Businesses that serve a local area', 'Clinics, restaurants, salons and shops', 'Anyone relying on walk-ins and calls'],
    outcomes: ['More visibility in the local map pack', 'More calls, directions and walk-ins', 'A steady flow of fresh reviews'],
    process: [
      { t: 'Audit', d: 'We review your profile, reviews and local rankings.' },
      { t: 'Optimise', d: 'We complete and sharpen your profile and citations.' },
      { t: 'Grow', d: 'We build reviews and keep the profile active.' },
      { t: 'Report', d: 'You see rankings, calls and directions each month.' }
    ],
    pricing: P('local-seo-gbp'),
    faqs: [
      { q: 'How long until I see results?', a: 'Local visibility usually improves over the first few months as the profile strengthens and reviews grow. We report progress monthly.' },
      { q: 'Can you get me more reviews?', a: 'Yes — we set up an ethical review-generation flow that makes it easy for happy customers to leave honest reviews.' },
      { q: 'Do you manage responses?', a: 'We can respond to reviews and questions on your behalf, in your voice, as part of the service.' }
    ],
    related: ['seo-programme', 'ai-search-visibility', 'business-websites']
  },
  {
    slug: 'seo-programme', division: 'growth', title: 'SEO Programme',
    metaTitle: 'SEO Programme — Technical, On-Page, Content & Links',
    summary: 'A full search programme: technical fixes, on-page work, content and links with monthly reporting.',
    metaDescription: 'A complete SEO programme for Ghanaian businesses: technical audits, on-page optimisation, content, ethical link building and clear monthly reporting.',
    problem: 'One-off SEO tweaks fade. Ranking for the terms that bring buyers takes an ongoing programme across your site, content and reputation.',
    deliverables: [
      'Technical SEO audit and fixes (speed, crawlability, structure)',
      'Keyword and intent research focused on buyers',
      'On-page optimisation of key pages',
      'A content plan that answers real customer questions',
      'Ethical, relevant link building',
      'Monthly reporting on rankings, traffic and enquiries'
    ],
    whoFor: ['Businesses that want compounding organic traffic', 'Companies in competitive niches', 'Anyone over-reliant on paid ads'],
    outcomes: ['Higher rankings for terms that convert', 'Organic traffic that grows over time', 'Less dependence on ad spend'],
    process: [
      { t: 'Audit', d: 'We assess technical health, content and competitors.' },
      { t: 'Fix', d: 'We resolve technical issues and optimise key pages.' },
      { t: 'Grow', d: 'We publish content and build relevant links.' },
      { t: 'Report', d: 'You get monthly rankings, traffic and enquiry data.' }
    ],
    pricing: P('seo-programme'),
    faqs: [
      { q: 'How is this different from Local SEO?', a: 'Local SEO focuses on your map presence and nearby searches. The SEO programme covers your whole site and content to rank more broadly.' },
      { q: 'How long does SEO take?', a: 'SEO compounds over months, not days. We focus on quick technical wins first, then build momentum with content and links.' },
      { q: 'Do you guarantee rankings?', a: 'No honest agency can guarantee a specific ranking. We guarantee the work, transparency and monthly reporting.' }
    ],
    related: ['content-marketing', 'ai-search-visibility', 'local-seo-gbp']
  },
  {
    slug: 'ai-search-visibility', division: 'growth', title: 'AI Search Visibility',
    metaTitle: 'AI Search Visibility — Get Recommended by ChatGPT, Gemini & Perplexity',
    summary: 'Get your business recommended when customers ask AI assistants, with monthly AI-answer tracking.',
    metaDescription: 'AI search visibility (answer optimisation): structure your content and profiles so ChatGPT, Gemini and Perplexity recommend your business, tracked monthly.',
    problem: 'More customers now ask AI assistants for recommendations instead of scrolling search results. If those answers never mention you, you are invisible to a fast-growing channel.',
    deliverables: [
      'An audit of how AI assistants currently answer questions in your niche',
      'Structured, answer-ready content and FAQs with schema',
      'Consistent, complete profiles across the sources AI tools trust',
      'Reviews and reputation signals that support recommendations',
      'Monthly tracking of how AI assistants mention or recommend you'
    ],
    whoFor: ['Forward-looking businesses in competitive niches', 'Companies already investing in SEO', 'Anyone whose customers research before buying'],
    outcomes: ['A better chance of being named in AI answers', 'Content that serves both search engines and AI', 'A monthly read on an emerging channel'],
    process: [
      { t: 'Baseline', d: 'We record how AI tools answer key questions today.' },
      { t: 'Structure', d: 'We create answer-ready content, schema and profiles.' },
      { t: 'Reinforce', d: 'We strengthen reviews and trusted sources.' },
      { t: 'Track', d: 'We report monthly on AI mentions and recommendations.' }
    ],
    pricing: P('ai-search-visibility'),
    faqs: [
      { q: 'Can you guarantee an AI assistant will recommend me?', a: 'No. AI answers change constantly and no one controls them. We improve the signals that make a recommendation more likely and track the results honestly.' },
      { q: 'Is this the same as SEO?', a: 'It overlaps but is not identical. Good SEO helps, but AI visibility also depends on structured answers, profiles and reputation across sources AI tools trust.' },
      { q: 'Which assistants do you track?', a: 'Typically ChatGPT, Gemini and Perplexity. We agree the exact set and questions during setup.' }
    ],
    related: ['seo-programme', 'content-marketing', 'ai-knowledge-base']
  },
  {
    slug: 'paid-ads', division: 'growth', title: 'Paid Ads (Google & Meta)',
    metaTitle: 'Google & Meta Ads Management',
    summary: 'Managed Google and Meta campaigns aimed at qualified enquiries, not vanity clicks.',
    metaDescription: 'Google and Meta (Facebook & Instagram) ads management for Ghanaian businesses — campaigns built around enquiries and sales, with transparent monthly reporting.',
    problem: 'Boosting posts and guessing at targeting burns budget. Without proper structure, tracking and follow-up, ad spend rarely turns into real customers.',
    deliverables: [
      'Campaign strategy tied to a clear business goal',
      'Google Search, Meta or both, based on where your buyers are',
      'Audience, keyword and creative setup',
      'Conversion tracking so results are measurable',
      'Ongoing optimisation and budget management',
      'Transparent monthly reporting on cost per lead'
    ],
    whoFor: ['Businesses that need enquiries now', 'Companies scaling a proven offer', 'Anyone tired of boosting with nothing to show'],
    outcomes: ['Lower cost per qualified lead over time', 'Spend focused on what works', 'Clear reporting you can trust'],
    process: [
      { t: 'Plan', d: 'We set the goal, audience and budget.' },
      { t: 'Build', d: 'We create campaigns, creative and tracking.' },
      { t: 'Optimise', d: 'We cut what fails and scale what works.' },
      { t: 'Report', d: 'You see spend, leads and cost per lead monthly.' }
    ],
    pricing: P('paid-ads'),
    faqs: [
      { q: 'Is ad spend included in your fee?', a: 'No. Our fee covers management and reporting. Ad spend is separate and goes directly to Google or Meta.' },
      { q: 'What budget do I need?', a: 'It depends on your market and goal. For the Growth retainer we recommend at least ' + site.facts.adSpendMin + '/month in ad spend; we will advise on the right level for you.' },
      { q: 'Google or Meta?', a: 'Whichever reaches your buyers best — often both. We recommend the mix during planning.' }
    ],
    related: ['landing-pages-funnels', 'growth-retainer', 'social-media']
  },
  {
    slug: 'social-media', division: 'growth', title: 'Social Media Management',
    metaTitle: 'Social Media Management',
    summary: 'A consistent content calendar, on-brand design and community management across your channels.',
    metaDescription: 'Social media management for Ghanaian businesses: content calendars, on-brand post and story design, scheduling, community management and monthly summaries.',
    problem: 'Posting whenever you remember, with mixed visuals and no plan, does not build trust or an audience. Meanwhile, comments and DMs go unanswered.',
    deliverables: [
      'A monthly content calendar tied to your goals',
      'On-brand post and story design',
      'Scheduling across your chosen platforms',
      'Community management: replies to comments and DMs',
      'Light paid boosting of your best content',
      'A monthly summary of reach, engagement and growth'
    ],
    whoFor: ['Brands that want a consistent presence', 'Owners with no time to post', 'Businesses whose DMs drive sales'],
    outcomes: ['A steady, professional presence', 'Faster replies to customers', 'Content that supports enquiries and sales'],
    process: [
      { t: 'Plan', d: 'We agree themes, tone and a monthly calendar.' },
      { t: 'Create', d: 'We design and write on-brand content.' },
      { t: 'Manage', d: 'We schedule, post and handle community replies.' },
      { t: 'Report', d: 'You get a monthly performance summary.' }
    ],
    pricing: P('social-media'),
    faqs: [
      { q: 'Which platforms do you manage?', a: 'Usually Instagram, Facebook, TikTok and LinkedIn — we focus on where your customers actually spend time.' },
      { q: 'Do you create the visuals?', a: 'Yes, all post and story design is included and kept on-brand.' },
      { q: 'Can you run ads too?', a: 'We include light boosting; larger campaigns are handled under Paid Ads or the Growth retainer.' }
    ],
    related: ['content-marketing', 'paid-ads', 'brand-identity']
  },
  {
    slug: 'content-marketing', division: 'growth', title: 'Content Marketing',
    metaTitle: 'Content Marketing & Blog Writing',
    summary: 'Articles, FAQs and schema that answer customer questions and earn search and AI visibility.',
    metaDescription: 'Content marketing for Ghanaian businesses: helpful articles, FAQs and structured content that build authority and win visibility in search and AI answers.',
    problem: 'Buyers search for answers before they buy. If you are not the business answering those questions, a competitor is — and they earn the trust and the traffic.',
    deliverables: [
      'A content plan built around real buyer questions',
      'Well-written, original articles and guides',
      'FAQ content with schema for search and AI',
      'On-page SEO so content actually ranks',
      'Internal linking to your service and product pages'
    ],
    whoFor: ['Businesses building long-term organic demand', 'Niches where buyers research first', 'Companies that want to be the trusted expert'],
    outcomes: ['Authority in your niche', 'Traffic that compounds over time', 'Content that supports both SEO and AI visibility'],
    process: [
      { t: 'Plan', d: 'We research questions and map topics to intent.' },
      { t: 'Write', d: 'We produce original, helpful content.' },
      { t: 'Optimise', d: 'We add SEO, schema and internal links.' },
      { t: 'Measure', d: 'We track rankings and traffic over time.' }
    ],
    pricing: P('content-marketing'),
    faqs: [
      { q: 'Do you write the content or do I?', a: 'We write it, working from a short briefing with you so it stays accurate and in your voice.' },
      { q: 'How often will you publish?', a: 'We agree a cadence that fits your goals and budget — often a set number of pieces per month.' },
      { q: 'Is this just for SEO?', a: 'It supports SEO and AI search visibility, and gives you material to share on social and email.' }
    ],
    related: ['seo-programme', 'ai-search-visibility', 'social-media']
  },
  {
    slug: 'email-sms', division: 'growth', title: 'Email & SMS Campaigns',
    metaTitle: 'Email & SMS Marketing Campaigns',
    summary: 'Turn your contact list into repeat business with well-timed email and SMS.',
    metaDescription: 'Email and SMS marketing for Ghanaian businesses: build your list, send campaigns and automated sequences that bring customers back and drive repeat sales.',
    problem: 'Your existing customers are your cheapest source of sales, yet most businesses never message them again. That list is money left on the table.',
    deliverables: [
      'List setup and simple opt-in capture',
      'Campaign design and copy that gets opened',
      'Automated sequences (welcome, follow-up, win-back)',
      'SMS for time-sensitive offers and reminders',
      'Reporting on opens, clicks and conversions'
    ],
    whoFor: ['Businesses with a customer or enquiry list', 'Retail, hospitality and services with repeat custom', 'Anyone running promotions or events'],
    outcomes: ['More repeat purchases', 'Fewer forgotten leads', 'A channel you own, not rented from a platform'],
    process: [
      { t: 'Set up', d: 'We organise your list and opt-in capture.' },
      { t: 'Design', d: 'We create campaigns and automated sequences.' },
      { t: 'Send', d: 'We schedule and send at the right times.' },
      { t: 'Report', d: 'You see opens, clicks and conversions.' }
    ],
    pricing: P('email-sms'),
    faqs: [
      { q: 'Do I need a big list to start?', a: 'No. We help you start capturing contacts and make the most of the list you already have.' },
      { q: 'Is this compliant?', a: 'We use opt-in best practice and clear unsubscribe options so your messaging stays respectful and compliant.' },
      { q: 'Which tools do you use?', a: 'We recommend the right email and SMS platform for your size and budget during setup.' }
    ],
    related: ['growth-retainer', 'business-process-automation', 'analytics-reporting']
  },
  {
    slug: 'analytics-reporting', division: 'growth', title: 'Analytics & Reporting',
    metaTitle: 'Analytics & Reporting Dashboards',
    summary: 'Know what is working with proper tracking and a simple dashboard you actually read.',
    metaDescription: 'Analytics and reporting for Ghanaian businesses: GA4 and conversion tracking set up correctly, plus a clear dashboard so you know what marketing actually works.',
    problem: 'Without proper tracking, marketing is guesswork. You cannot tell which channel brings customers, so you either overspend or cut the wrong thing.',
    deliverables: [
      'Google Analytics (GA4) and Search Console setup',
      'Conversion and enquiry tracking configured correctly',
      'A simple dashboard focused on the numbers that matter',
      'Monthly reporting in plain English',
      'Recommendations on what to do next'
    ],
    whoFor: ['Businesses spending on marketing', 'Owners who want clarity, not vanity metrics', 'Teams making budget decisions'],
    outcomes: ['Clear view of what drives enquiries', 'Confident budget decisions', 'No more flying blind'],
    process: [
      { t: 'Audit', d: 'We check what is currently tracked (and what is not).' },
      { t: 'Set up', d: 'We configure analytics and conversion tracking.' },
      { t: 'Visualise', d: 'We build a dashboard around your key numbers.' },
      { t: 'Advise', d: 'We report monthly and recommend next steps.' }
    ],
    pricing: P('analytics-reporting'),
    faqs: [
      { q: 'Can you fix tracking that is already broken?', a: 'Yes. A common first step is auditing and repairing existing analytics and conversion tracking.' },
      { q: 'Will I understand the reports?', a: 'That is the point. Reports are in plain English and focus on enquiries and revenue, not vanity metrics.' },
      { q: 'Do you offer this on its own?', a: 'Yes, or as part of the Growth retainer where reporting is included.' }
    ],
    related: ['growth-retainer', 'paid-ads', 'seo-programme']
  },

  // ===== Brand =====
  {
    slug: 'brand-identity', division: 'brand', title: 'Brand Identity',
    metaTitle: 'Brand Identity & Logo Design',
    summary: 'A distinctive identity — logo, colours, type and guidelines — from essentials to a full system.',
    metaDescription: 'Brand identity design for Ghanaian businesses: logo, colour palette, typography and guidelines. Choose Essentials or a full identity system. You own the assets.',
    problem: 'An inconsistent, DIY look makes even good businesses seem small and untrustworthy. Customers judge credibility in seconds, and your brand is the first thing they see.',
    deliverables: [
      'Essentials: logo, colour palette, fonts and a mini guide',
      'Full system: complete guidelines, stationery and a social kit',
      'Multiple logo formats for web, print and social',
      'Clear usage rules so your brand stays consistent',
      'All source files handed over — you own everything'
    ],
    whoFor: ['New businesses starting on the right foot', 'Established brands ready to level up', 'Teams that need consistency across channels'],
    outcomes: ['A credible, memorable first impression', 'Consistency everywhere you appear', 'Assets you fully own'],
    process: [
      { t: 'Discover', d: 'We learn your audience, values and competitors.' },
      { t: 'Design', d: 'We present directions and refine your favourite.' },
      { t: 'System', d: 'We build the guidelines and assets you need.' },
      { t: 'Handover', d: 'You receive all files and usage rules.' }
    ],
    pricing: P('brand-identity'),
    faqs: [
      { q: "What's the difference between Essentials and the full system?", a: 'Essentials covers your logo, colours, fonts and a mini guide. The full system adds complete guidelines, stationery and a social kit for larger or fast-growing brands.' },
      { q: 'Do I own the logo and files?', a: 'Yes. You receive all source files and full ownership at handover.' },
      { q: 'Can you refresh an existing brand?', a: 'Yes — we can evolve your current identity rather than start from scratch when that makes sense.' }
    ],
    related: ['marketing-collateral', 'photography-video', 'business-websites']
  },
  {
    slug: 'marketing-collateral', division: 'brand', title: 'Marketing Collateral & Company Profiles',
    metaTitle: 'Marketing Collateral, Stationery & Company Profiles',
    summary: 'Company profiles, stationery and marketing materials that make your business look the part.',
    metaDescription: 'Company profiles, business stationery and marketing collateral design for Ghanaian businesses — professional documents that win trust with clients and partners.',
    problem: 'When a prospect asks for your company profile or proposal, a rushed document undercuts your pitch. Professional materials signal that you are serious.',
    deliverables: [
      'Company profile documents',
      'Business stationery (cards, letterheads, templates)',
      'Brochures, flyers and one-pagers',
      'Proposal and quotation templates',
      'Editable files so your team can reuse them'
    ],
    whoFor: ['Businesses bidding for contracts', 'Companies meeting partners and investors', 'Teams needing consistent documents'],
    outcomes: ['A polished, professional impression', 'Reusable templates for your team', 'Materials that support your sales'],
    process: [
      { t: 'Scope', d: 'We list the materials you actually need.' },
      { t: 'Design', d: 'We design on-brand documents and templates.' },
      { t: 'Refine', d: 'You review and we finalise.' },
      { t: 'Handover', d: 'You get print-ready and editable files.' }
    ],
    pricing: P('marketing-collateral'),
    faqs: [
      { q: 'Do I need a brand identity first?', a: 'It helps. If you do not have one, we can start with Brand Identity or work within your existing style.' },
      { q: 'Will I get editable files?', a: 'Yes — templates your team can reuse, plus print-ready versions.' },
      { q: 'Can you handle printing?', a: 'We deliver print-ready files and can advise on trusted printers.' }
    ],
    related: ['brand-identity', 'pitch-decks', 'photography-video']
  },
  {
    slug: 'photography-video', division: 'brand', title: 'Photography & Video',
    metaTitle: 'Business Photography & Video',
    summary: 'Real photos and video of your business, products and team — content that builds trust.',
    metaDescription: 'Business photography and video for Ghanaian companies: product, team and location shoots plus short-form video for your website, social media and ads.',
    problem: 'Stock photos and blurry phone snaps make customers doubt you. Authentic images of your real business build the trust that closes sales.',
    deliverables: [
      'Product, team and location photography',
      'Short-form video for social and ads',
      'Edited, web-ready and social-ready files',
      'A library of images you can reuse',
      'Direction and shot planning'
    ],
    whoFor: ['Retail and product businesses', 'Hospitality, food and services', 'Any brand refreshing its visuals'],
    outcomes: ['Authentic visuals that build trust', 'A reusable content library', 'Stronger websites, social and ads'],
    process: [
      { t: 'Plan', d: 'We agree the shots and story you need.' },
      { t: 'Shoot', d: 'We capture your business, products and team.' },
      { t: 'Edit', d: 'We deliver polished, web-ready files.' },
      { t: 'Deliver', d: 'You receive an organised image and video library.' }
    ],
    pricing: P('photography-video'),
    faqs: [
      { q: 'Where do you shoot?', a: 'On location at your business, or an agreed venue. We confirm logistics during planning.' },
      { q: 'Do I own the images?', a: 'Yes, you receive full rights to the delivered files for your marketing.' },
      { q: 'Can you do product-only shoots?', a: 'Yes — from full brand shoots to focused product photography for your store.' }
    ],
    related: ['brand-identity', 'social-media', 'ecommerce-momo']
  },
  {
    slug: 'pitch-decks', division: 'brand', title: 'Pitch Decks',
    metaTitle: 'Pitch Deck & Presentation Design',
    summary: 'Investor and sales decks that tell a clear story and look the part.',
    metaDescription: 'Pitch deck and presentation design for Ghanaian founders and businesses — clear structure, strong visuals and a story that persuades investors and clients.',
    problem: 'A weak deck sinks a strong idea. Cluttered slides and a muddled story lose investors and clients in the first few minutes.',
    deliverables: [
      'A clear narrative structure for your pitch',
      'Professionally designed, on-brand slides',
      'Simple charts and visuals for your numbers',
      'An editable master you can update yourself',
      'Guidance on what belongs on each slide'
    ],
    whoFor: ['Founders raising or partnering', 'Sales teams pitching bigger deals', 'Anyone presenting to decision-makers'],
    outcomes: ['A clearer, more persuasive story', 'Slides that look credible', 'A deck you can keep updating'],
    process: [
      { t: 'Story', d: 'We shape the narrative and slide flow.' },
      { t: 'Design', d: 'We design on-brand, focused slides.' },
      { t: 'Refine', d: 'We tighten copy and visuals with you.' },
      { t: 'Handover', d: 'You get an editable master file.' }
    ],
    pricing: P('pitch-decks'),
    faqs: [
      { q: 'Do you write the content?', a: 'We shape the structure and refine your copy. You provide the facts and numbers; we make them clear and persuasive.' },
      { q: 'Which format do I get?', a: 'An editable master (for example in your preferred presentation tool) plus an export for sharing.' },
      { q: 'Can you design other presentations?', a: 'Yes — sales decks, reports and internal presentations too.' }
    ],
    related: ['brand-identity', 'marketing-collateral', 'business-websites']
  },

  // ===== Business Technology =====
  {
    slug: 'microsoft-365', division: 'business-technology', title: 'Microsoft 365 & Business Email',
    metaTitle: 'Microsoft 365, Business Email & SharePoint Setup',
    summary: 'Professional email on your domain, plus Microsoft 365 and SharePoint set up for your team.',
    metaDescription: 'Microsoft 365 setup for Ghanaian businesses: professional email on your own domain, Office apps, SharePoint and Teams configured and migrated with training.',
    problem: 'Running a business from a free personal email address looks unprofessional and scatters your files. Growing teams need proper email, shared files and collaboration.',
    deliverables: [
      'Professional email on your own domain',
      'Microsoft 365 licences and app setup',
      'SharePoint and Teams configured for your team',
      'Migration from your current email or files',
      'User accounts, security basics and training'
    ],
    whoFor: ['Businesses on free or personal email', 'Growing teams that need to collaborate', 'Companies wanting files organised and secure'],
    outcomes: ['A professional email address', 'Files and collaboration in one place', 'A team set up to work together'],
    process: [
      { t: 'Assess', d: 'We review your current email and files.' },
      { t: 'Set up', d: 'We configure Microsoft 365, email and SharePoint.' },
      { t: 'Migrate', d: 'We move your data with minimal disruption.' },
      { t: 'Train', d: 'We onboard your team and hand over admin.' }
    ],
    pricing: P('microsoft-365'),
    faqs: [
      { q: 'Do the Microsoft licences cost extra?', a: 'Yes. Our fee covers setup, migration and training; the monthly Microsoft licence fees are paid to Microsoft based on how many users you have.' },
      { q: 'Can you move my old emails?', a: 'Yes, migration from most common providers is part of the service.' },
      { q: 'Is my current work interrupted?', a: 'We plan migrations to minimise downtime, usually outside working hours where possible.' }
    ],
    related: ['cloud-document-management', 'crm-setup', 'it-consulting-training']
  },
  {
    slug: 'cloud-document-management', division: 'business-technology', title: 'Cloud Storage & Document Management',
    metaTitle: 'Cloud Storage & Document Management',
    summary: 'Get your files off scattered laptops and WhatsApp into a secure, organised, shared system.',
    metaDescription: 'Cloud storage and document management for Ghanaian businesses: organised, secure, shared files with permissions and backups so your team stops losing documents.',
    problem: 'Critical files live on one person\u2019s laptop, in WhatsApp, or in inboxes. When that person is away or a device fails, work stops and documents disappear.',
    deliverables: [
      'A cloud storage structure that fits how you work',
      'Clear folders, naming and access permissions',
      'Migration of existing files into the system',
      'Backups so nothing is lost with a lost device',
      'Team training on the new way of working'
    ],
    whoFor: ['Teams sharing files over WhatsApp and email', 'Businesses worried about lost documents', 'Companies preparing to scale'],
    outcomes: ['One organised home for your files', 'Access control and backups', 'Less time hunting for documents'],
    process: [
      { t: 'Review', d: 'We map your current files and pain points.' },
      { t: 'Design', d: 'We design a folder and permission structure.' },
      { t: 'Migrate', d: 'We move files in and set up backups.' },
      { t: 'Train', d: 'We train the team on the new system.' }
    ],
    pricing: P('cloud-document-management'),
    faqs: [
      { q: 'Which platform do you use?', a: 'Usually Microsoft 365 or Google Workspace — we recommend the best fit for your tools and budget.' },
      { q: 'Can you set permissions?', a: 'Yes. We control who can see and edit what, so sensitive files stay protected.' },
      { q: 'What about backups?', a: 'Backups are part of the setup so a lost or damaged device never means lost work.' }
    ],
    related: ['microsoft-365', 'crm-setup', 'it-consulting-training']
  },
  {
    slug: 'crm-setup', division: 'business-technology', title: 'CRM Setup',
    metaTitle: 'CRM Setup & Customer Management',
    summary: 'A simple CRM so every lead and customer is tracked and nothing slips through.',
    metaDescription: 'CRM setup for Ghanaian businesses: capture leads, track conversations and follow up on time with a simple customer management system your team will actually use.',
    problem: 'Leads and customers tracked in heads, notebooks and chats get forgotten. Follow-ups slip, and you never see the full picture of your pipeline.',
    deliverables: [
      'A CRM chosen and configured for your business',
      'Lead capture connected to your website and WhatsApp',
      'Pipeline stages that match how you sell',
      'Follow-up reminders so leads are not forgotten',
      'Team training and simple reporting'
    ],
    whoFor: ['Sales teams losing track of leads', 'Businesses with slow or missed follow-up', 'Owners who want pipeline visibility'],
    outcomes: ['Every lead captured and tracked', 'Timely, consistent follow-up', 'A clear view of your pipeline'],
    process: [
      { t: 'Map', d: 'We map your sales process and stages.' },
      { t: 'Configure', d: 'We set up the CRM and lead capture.' },
      { t: 'Connect', d: 'We link your website, WhatsApp and email.' },
      { t: 'Train', d: 'We train your team and set up reporting.' }
    ],
    pricing: P('crm-setup'),
    faqs: [
      { q: 'Which CRM do you recommend?', a: 'We match the tool to your size and budget rather than forcing one platform — from lightweight options to full CRMs.' },
      { q: 'Can it capture WhatsApp leads?', a: 'Yes. We connect your website and WhatsApp so enquiries land in the CRM automatically where possible.' },
      { q: 'Will my team actually use it?', a: 'We keep it simple and train your team, because a CRM only works if people use it.' }
    ],
    related: ['business-process-automation', 'whatsapp-ai-assistant', 'microsoft-365']
  },
  {
    slug: 'it-consulting-training', division: 'business-technology', title: 'IT Consulting & Staff Training',
    metaTitle: 'IT Consulting & Staff Training',
    summary: 'Practical advice on the tools you need, plus training so your team actually uses them.',
    metaDescription: 'IT consulting and staff training for Ghanaian businesses: choose the right tools, tighten security basics and upskill your team with practical, jargon-free training.',
    problem: 'Businesses waste money on tools they do not use and skip the basics that keep them safe. Meanwhile, staff never get trained on what they already have.',
    deliverables: [
      'A review of your current tools and gaps',
      'Practical recommendations, not jargon',
      'Security basics: accounts, passwords and access',
      'Hands-on staff training sessions',
      'Simple documentation your team can follow'
    ],
    whoFor: ['Businesses unsure what tools they need', 'Teams that never got proper training', 'Owners worried about basic security'],
    outcomes: ['The right tools, used properly', 'A more capable, confident team', 'Fewer costly mistakes'],
    process: [
      { t: 'Assess', d: 'We review your tools, gaps and risks.' },
      { t: 'Recommend', d: 'We advise on what to keep, add or drop.' },
      { t: 'Train', d: 'We run practical sessions with your team.' },
      { t: 'Document', d: 'We leave simple guides behind.' }
    ],
    pricing: P('it-consulting-training'),
    faqs: [
      { q: 'Do you offer one-off sessions?', a: 'Yes — a single training or advisory session, or ongoing support, depending on your needs.' },
      { q: 'Can you train non-technical staff?', a: 'Absolutely. We keep training practical and jargon-free.' },
      { q: 'Do you provide ongoing IT support?', a: 'We can advise on the right support setup and point you to reliable options where needed.' }
    ],
    related: ['microsoft-365', 'cloud-document-management', 'crm-setup']
  },

  // ===== AI & Automation =====
  {
    slug: 'whatsapp-ai-assistant', division: 'ai-automation', title: 'WhatsApp AI Assistant',
    metaTitle: 'WhatsApp AI Assistant & AI Customer Service',
    summary: 'An AI assistant on WhatsApp that answers FAQs, qualifies leads and hands off to a human.',
    metaDescription: 'A WhatsApp AI assistant for Ghanaian businesses: answers FAQs 24/7, qualifies leads and hands off to a human when needed — so no enquiry goes unanswered.',
    problem: 'Customers message on WhatsApp at all hours, but you cannot reply instantly. Slow answers lose sales, and your team drowns in repetitive questions.',
    deliverables: [
      'An AI assistant trained on your business and FAQs',
      '24/7 instant replies to common questions',
      'Lead qualification that captures what you need',
      'Smooth hand-off to a human when it matters',
      'A knowledge base you can update as you grow'
    ],
    whoFor: ['Businesses flooded with WhatsApp enquiries', 'Teams losing sales to slow replies', 'Anyone answering the same questions all day'],
    outcomes: ['Instant replies, day and night', 'Qualified leads, not just messages', 'Time back for your team'],
    process: [
      { t: 'Train', d: 'We build a knowledge base from your FAQs and info.' },
      { t: 'Design', d: 'We design conversation and qualification flows.' },
      { t: 'Connect', d: 'We connect it to WhatsApp with human hand-off.' },
      { t: 'Improve', d: 'We refine answers as real questions come in.' }
    ],
    pricing: P('whatsapp-ai-assistant'),
    faqs: [
      { q: 'Will it replace my team?', a: 'No — it handles repetitive questions and qualifies leads, then hands off to a human for anything that needs a person.' },
      { q: 'Does it use the official WhatsApp API?', a: 'We recommend the right setup for your volume and budget, including the official WhatsApp Business API where appropriate.' },
      { q: 'Can it take orders or bookings?', a: 'Yes — see WhatsApp Ordering & Booking Flows, which we often combine with the assistant.' }
    ],
    related: ['whatsapp-ordering-booking', 'ai-knowledge-base', 'crm-setup']
  },
  {
    slug: 'whatsapp-ordering-booking', division: 'ai-automation', title: 'WhatsApp Ordering & Booking Flows',
    metaTitle: 'WhatsApp Ordering & Booking with MoMo Payment Links',
    summary: 'Let customers order or book on WhatsApp and pay with a MoMo link — no app required.',
    metaDescription: 'WhatsApp ordering and booking flows with MoMo payment links for Ghanaian businesses: customers order or book in chat and pay instantly, with orders routed to you.',
    problem: 'Taking orders manually over WhatsApp is chaotic: missed messages, wrong details and awkward payment chases. Customers want to order and pay in one place.',
    deliverables: [
      'A guided ordering or booking flow inside WhatsApp',
      'MoMo payment links so customers pay in chat',
      'Orders and bookings routed to your team',
      'Automatic confirmations and reminders',
      'A simple record of orders and payments'
    ],
    whoFor: ['Restaurants, caterers and food brands', 'Retailers taking WhatsApp orders', 'Service providers taking bookings'],
    outcomes: ['Orders and payments in one place', 'Fewer errors and missed messages', 'Faster, cleaner cash flow'],
    process: [
      { t: 'Map', d: 'We map your menu or services and order flow.' },
      { t: 'Build', d: 'We build the WhatsApp flow and payment links.' },
      { t: 'Connect', d: 'We route orders to your team with confirmations.' },
      { t: 'Launch', d: 'We test real orders and go live.' }
    ],
    pricing: P('whatsapp-ordering-booking'),
    faqs: [
      { q: 'How do customers pay?', a: 'With a MoMo payment link (and card where set up) sent right inside the chat, so they never leave WhatsApp.' },
      { q: 'Do I need a website too?', a: 'No, though it pairs well with an online store. The WhatsApp flow can work on its own.' },
      { q: 'Can it handle bookings, not just orders?', a: 'Yes — the same approach works for appointments and reservations with reminders.' }
    ],
    related: ['whatsapp-ai-assistant', 'ecommerce-momo', 'booking-online-ordering']
  },
  {
    slug: 'business-process-automation', division: 'ai-automation', title: 'Business Process Automation',
    metaTitle: 'Business Process Automation (Make / n8n)',
    summary: 'Automate the repetitive work: invoice reminders, onboarding, reports, reminders and alerts.',
    metaDescription: 'Business process automation for Ghanaian companies using tools like Make and n8n: automate invoice reminders, onboarding, reporting, appointment reminders and stock alerts.',
    problem: 'Your team spends hours each week on repetitive admin — chasing invoices, sending reminders, compiling reports. That time costs money and invites mistakes.',
    deliverables: [
      'Automated invoice and payment reminders',
      'Client and staff onboarding sequences',
      'Scheduled reports delivered to your inbox or WhatsApp',
      'Appointment and booking reminders',
      'Inventory and low-stock alerts',
      'Built on reliable tools such as Make or n8n'
    ],
    whoFor: ['Teams buried in repetitive admin', 'Businesses with manual reminders and reports', 'Owners who want to scale without more headcount'],
    outcomes: ['Hours saved every week', 'Fewer human errors', 'Consistent follow-through'],
    process: [
      { t: 'Audit', d: 'We find the tasks worth automating first.' },
      { t: 'Map', d: 'We map each process end to end.' },
      { t: 'Build', d: 'We build and test each automation.' },
      { t: 'Support', d: 'We monitor and refine as you grow.' }
    ],
    pricing: P('business-process-automation'),
    faqs: [
      { q: 'Where should I start?', a: 'Most clients start with an Automation Audit so we target the workflows that save the most time first.' },
      { q: 'Which tools do you use?', a: 'Reliable automation platforms such as Make or n8n, connected to the apps you already use.' },
      { q: 'What can be automated?', a: 'Invoice reminders, onboarding, reports, appointment reminders, stock alerts and many other repetitive tasks.' }
    ],
    related: ['automation-audit', 'crm-setup', 'ai-knowledge-base']
  },
  {
    slug: 'automation-audit', division: 'ai-automation', title: 'Automation Audit',
    metaTitle: 'Automation Audit — Find What to Automate First',
    summary: 'A focused paid audit that finds your biggest time-wasters and the automations worth building.',
    metaDescription: 'An automation audit for Ghanaian businesses: we map your repetitive workflows, estimate the time and cost they waste, and recommend what to automate first.',
    problem: 'Everyone says "automate," but which tasks actually pay off? Guessing leads to over-engineered tools nobody uses. You need a clear, prioritised plan.',
    deliverables: [
      'A review of your day-to-day workflows',
      'A shortlist of high-value automation opportunities',
      'An estimate of the time and cost each one wastes today',
      'A prioritised, practical roadmap',
      'A clear recommendation on where to start'
    ],
    whoFor: ['Businesses new to automation', 'Teams unsure what to automate first', 'Owners who want a plan before spending'],
    outcomes: ['A clear, prioritised roadmap', 'Confidence in where to invest', 'A concrete starting point'],
    process: [
      { t: 'Intake', d: 'You share how your team works day to day.' },
      { t: 'Discover', d: 'We map processes and spot the leaks.' },
      { t: 'Prioritise', d: 'We rank opportunities by value and effort.' },
      { t: 'Recommend', d: 'You get a roadmap and a place to start.' }
    ],
    pricing: P('automation-audit'),
    faqs: [
      { q: 'Why is the audit paid?', a: 'It is real, focused work: interviews, process mapping and a written roadmap you keep even if you build nothing with us. If you do build, the full fee is credited back.' },
      { q: 'How long does it take?', a: 'Usually 5–7 working days: a 60–90 minute discovery session, our analysis, then a walkthrough of your roadmap.' },
      { q: 'How much does it cost?', a: 'A fixed GHS 1,500 (about USD 130). The full fee is credited toward any automation build you start with us within 60 days, so if you go ahead, the audit is effectively free.' },
      { q: 'What do I get at the end?', a: 'A prioritised roadmap of what to automate first, with time and cost estimates and a clear starting point.' }
    ],
    related: ['business-process-automation', 'whatsapp-ai-assistant', 'ai-knowledge-base']
  },
  {
    slug: 'ai-knowledge-base', division: 'ai-automation', title: 'AI Knowledge Base',
    metaTitle: 'AI Knowledge Base — Turn Your Docs into an Internal Assistant',
    summary: 'Turn your documents and SOPs into an internal AI assistant your team can just ask.',
    metaDescription: 'Turn company documents and SOPs into an internal AI assistant. Staff ask questions in plain language and get accurate answers from your own knowledge base.',
    problem: 'Your know-how is trapped in scattered documents, chats and a few people\u2019s heads. New staff take months to get up to speed and keep asking the same questions.',
    deliverables: [
      'Your documents and SOPs organised and cleaned up',
      'An internal AI assistant trained on your knowledge',
      'Plain-language answers with sources',
      'Access control so only your team can use it',
      'A simple way to keep the knowledge current'
    ],
    whoFor: ['Businesses with lots of internal know-how', 'Teams onboarding new staff often', 'Companies losing knowledge when people leave'],
    outcomes: ['Faster onboarding', 'Fewer repeated questions', 'Knowledge that stays in the business'],
    process: [
      { t: 'Gather', d: 'We collect and organise your documents.' },
      { t: 'Build', d: 'We train an assistant on your knowledge.' },
      { t: 'Secure', d: 'We restrict access to your team.' },
      { t: 'Maintain', d: 'We set up a way to keep it current.' }
    ],
    pricing: P('ai-knowledge-base'),
    faqs: [
      { q: 'Is my data kept private?', a: 'Yes. We design the setup so your knowledge base is restricted to your team and handled responsibly.' },
      { q: 'What documents can it use?', a: 'SOPs, policies, product info, FAQs and most common document formats.' },
      { q: 'Can customers use it too?', a: 'This service is for internal use; for customer-facing AI, see the WhatsApp AI Assistant.' }
    ],
    related: ['whatsapp-ai-assistant', 'business-process-automation', 'cloud-document-management']
  },

  // ===== Software =====
  {
    slug: 'custom-web-apps', division: 'software', title: 'Custom Web Apps & Portals',
    metaTitle: 'Custom Web Applications & Portals',
    summary: 'Web apps, customer and staff portals, directories and marketplaces built around your workflow.',
    metaDescription: 'Custom web application and portal development for Ghanaian businesses: customer and staff portals, directories, marketplaces and booking systems built to fit your workflow.',
    problem: 'When spreadsheets and off-the-shelf tools no longer fit how you work, they slow you down. You need software built around your actual process, not the other way round.',
    deliverables: [
      'A web app or portal designed around your workflow',
      'Customer or staff logins with the right permissions',
      'The features you need — directories, listings, bookings and more',
      'Integrations with your existing tools and payments',
      'Hosting, handover and documentation'
    ],
    whoFor: ['Businesses outgrowing spreadsheets', 'Companies with a unique process', 'Teams needing a customer or staff portal'],
    outcomes: ['Software that fits how you actually work', 'Less manual workaround', 'A platform you can grow into'],
    process: [
      { t: 'Discover', d: 'We define the problem, users and must-have features.' },
      { t: 'Design', d: 'We map screens and flows for your approval.' },
      { t: 'Build', d: 'We develop in stages you can review.' },
      { t: 'Launch', d: 'We deploy, train and hand over.' }
    ],
    pricing: P('custom-web-apps'),
    faqs: [
      { q: 'How do you scope a custom project?', a: 'We start with discovery to define users, features and phases, then quote so you can start with a focused first version.' },
      { q: 'Can we build in phases?', a: 'Yes — we recommend launching a focused first version, then adding features as you learn.' },
      { q: 'Who owns the code?', a: 'You do. Ownership and documentation are handed over as agreed.' }
    ],
    related: ['dashboards-internal-systems', 'integrations-saas', 'mobile-apps']
  },
  {
    slug: 'mobile-apps', division: 'software', title: 'Mobile Apps',
    metaTitle: 'Mobile App Development',
    summary: 'iOS and Android apps for customers or staff, built to be genuinely useful.',
    metaDescription: 'Mobile app development for Ghanaian businesses: customer and staff apps for iOS and Android, designed for real use, low data and reliable performance.',
    problem: 'A mobile app only earns a place on the home screen if it is genuinely useful. Too many are built without a clear reason people would keep using them.',
    deliverables: [
      'A mobile app for iOS, Android or both',
      'A clear focus on the core job the app does',
      'Design for low data and everyday reliability',
      'Integration with your systems and payments',
      'App store setup and launch support'
    ],
    whoFor: ['Businesses with a clear app use case', 'Companies with loyal, repeat customers', 'Teams needing a field or staff app'],
    outcomes: ['An app people actually use', 'A direct channel to customers', 'Tools your team can use anywhere'],
    process: [
      { t: 'Define', d: 'We pin down the one job the app must do well.' },
      { t: 'Design', d: 'We design the core screens and flow.' },
      { t: 'Build', d: 'We develop and test on real devices.' },
      { t: 'Launch', d: 'We publish to the stores and support launch.' }
    ],
    pricing: P('mobile-apps'),
    faqs: [
      { q: 'Do I really need an app?', a: 'Often a fast mobile website is enough. We will tell you honestly whether an app is the right investment for your goal.' },
      { q: 'iOS, Android or both?', a: 'We recommend based on where your customers are; cross-platform builds can cover both efficiently.' },
      { q: 'Who manages app store accounts?', a: 'We help set them up in your name so you own your listings.' }
    ],
    related: ['custom-web-apps', 'integrations-saas', 'dashboards-internal-systems']
  },
  {
    slug: 'dashboards-internal-systems', division: 'software', title: 'Dashboards & Internal Systems',
    metaTitle: 'Dashboards & Internal Business Systems',
    summary: 'Bring your data together into dashboards and internal tools your team can act on.',
    metaDescription: 'Custom dashboards and internal systems for Ghanaian businesses: connect your data into clear dashboards and internal tools that replace messy spreadsheets.',
    problem: 'Your numbers live in different tools and spreadsheets, so seeing the real picture means hours of copy-paste. Decisions get made on gut feel or stale data.',
    deliverables: [
      'Dashboards that pull your key numbers together',
      'Internal tools to replace fragile spreadsheets',
      'Connections to the systems where your data lives',
      'Roles and permissions for your team',
      'Training and handover'
    ],
    whoFor: ['Businesses drowning in spreadsheets', 'Owners who want one clear view', 'Teams making decisions on stale data'],
    outcomes: ['One clear view of your business', 'Faster, better decisions', 'Less manual data wrangling'],
    process: [
      { t: 'Define', d: 'We agree the numbers and tools that matter.' },
      { t: 'Connect', d: 'We link your data sources.' },
      { t: 'Build', d: 'We build dashboards and internal tools.' },
      { t: 'Train', d: 'We onboard your team.' }
    ],
    pricing: P('dashboards-internal-systems'),
    faqs: [
      { q: 'Can you connect my existing tools?', a: 'In most cases, yes — we connect common business apps, spreadsheets and databases.' },
      { q: 'Do you build on top of spreadsheets?', a: 'We can start from your spreadsheets and move you to something more reliable as you grow.' },
      { q: 'Is training included?', a: 'Yes. A system only helps if your team can use it, so training and handover are part of the work.' }
    ],
    related: ['custom-web-apps', 'integrations-saas', 'analytics-reporting']
  },
  {
    slug: 'integrations-saas', division: 'software', title: 'Integrations & SaaS Development',
    metaTitle: 'Integrations & SaaS Development',
    summary: 'Connect the tools you use, or build and launch a software product of your own.',
    metaDescription: 'Integrations and SaaS development for Ghanaian businesses and founders: connect your tools so data flows automatically, or build and launch your own software product.',
    problem: 'Disconnected tools mean double entry and errors. And founders with a software idea often struggle to turn it into a real, sellable product.',
    deliverables: [
      'Integrations so your tools share data automatically',
      'APIs and connections between systems',
      'A path from software idea to a launchable product',
      'Payments, accounts and subscriptions for SaaS',
      'Hosting, monitoring and ongoing iteration'
    ],
    whoFor: ['Businesses with disconnected tools', 'Founders with a software product idea', 'Teams doing painful double entry'],
    outcomes: ['Data that flows automatically', 'Less manual re-entry and error', 'A product you can take to market'],
    process: [
      { t: 'Discover', d: 'We map the systems or the product idea.' },
      { t: 'Design', d: 'We plan the integrations or product scope.' },
      { t: 'Build', d: 'We develop and test in stages.' },
      { t: 'Iterate', d: 'We launch and improve with real usage.' }
    ],
    pricing: P('integrations-saas'),
    faqs: [
      { q: 'Can you integrate my payment and accounting tools?', a: 'In most cases, yes — we connect common payment, accounting and business tools so data flows without manual entry.' },
      { q: 'I have a SaaS idea — where do we start?', a: 'With discovery to define the smallest version worth launching, then a phased build so you learn from real users early.' },
      { q: 'Do you offer ongoing development?', a: 'Yes. Software is never truly finished; we can iterate as your needs and users grow.' }
    ],
    related: ['custom-web-apps', 'dashboards-internal-systems', 'mobile-apps']
  }
];

export const serviceBySlug = Object.fromEntries(services.map(s => [s.slug, s]));
export function servicesByDivision(slug) { return services.filter(s => s.division === slug); }

// ---- Industries -------------------------------------------------------------
export const industries = [
  {
    slug: 'real-estate', title: 'Real Estate & Developers',
    metaDescription: 'Digital marketing and websites for Ghanaian real estate developers and agents — qualified property enquiries, listings sites and fast WhatsApp follow-up.',
    summary: 'Turn property interest into qualified, followed-up enquiries — not just clicks.',
    problems: ['Portals and social bring browsers, not serious buyers', 'Enquiries come in on WhatsApp and go cold before follow-up', 'No clear view of which listings and channels actually convert'],
    whatWeBuild: ['A listings site that showcases properties and captures enquiries', 'A WhatsApp lead system so no serious buyer is missed', 'Targeted Google and Meta ads for real demand', 'Reporting on enquiries, viewings and cost per lead'],
    starter: 'A listings website plus the ShowMe Growth retainer, so demand and fast follow-up run together from day one.',
    relatedServices: ['business-websites', 'growth-retainer', 'paid-ads', 'whatsapp-ai-assistant']
  },
  {
    slug: 'diaspora-property', title: 'Diaspora Property Buyers',
    metaDescription: 'Reach diaspora property buyers in the UK, US and Canada: trust-building websites, USD-friendly enquiries and reliable follow-up across time zones.',
    summary: 'Win trust with buyers abroad and follow up reliably across time zones.',
    problems: ['Buyers abroad need extra trust before committing from a distance', 'Time-zone gaps mean enquiries wait too long for a reply', 'Pricing and payment in a foreign currency raise doubts'],
    whatWeBuild: ['A trust-building site aimed at diaspora buyers', 'Enquiry capture that works across time zones', 'Clear presentation of pricing (USD quotes as needed)', 'Automated first responses so no lead waits'],
    starter: 'A diaspora-focused landing page and lead system, paired with ads targeting key markets abroad.',
    relatedServices: ['landing-pages-funnels', 'growth-retainer', 'whatsapp-ai-assistant', 'business-websites'],
    note: 'We focus on buyers in the US, UK and Canada. Developers and agents can be quoted in cedis; diaspora-facing businesses abroad can be quoted and invoiced in USD and pay by card or international transfer.'
  },
  {
    slug: 'private-healthcare', title: 'Private Healthcare & Dental',
    metaDescription: 'Websites, booking and marketing for private clinics and dental practices in Ghana — turn local demand into booked appointments with reliable follow-up.',
    summary: 'Turn local demand into booked appointments, with fewer no-shows.',
    problems: ['Patients call or DM and reach a busy front desk', 'No easy way to book online or after hours', 'No-shows waste valuable appointment slots'],
    whatWeBuild: ['A credible clinic website with clear services', 'Online booking with reminders to cut no-shows', 'Local SEO and Google Business Profile management', 'A WhatsApp assistant for common patient questions'],
    starter: 'A clinic website with online booking, plus Local SEO so nearby patients find and book you.',
    relatedServices: ['booking-online-ordering', 'local-seo-gbp', 'business-websites', 'whatsapp-ai-assistant']
  },
  {
    slug: 'private-schools', title: 'Private Schools & Tutoring',
    metaDescription: 'Websites and admissions marketing for private schools and tutoring centres in Ghana — a steady enrolment pipeline with clear follow-up and reporting.',
    summary: 'Build a steady admissions pipeline with clear follow-up and reporting.',
    problems: ['Enrolment enquiries scatter across calls, DMs and forms', 'Parents get slow or inconsistent follow-up', 'No clear view of the admissions pipeline'],
    whatWeBuild: ['A school website with a clear admissions journey', 'An enquiry-to-enrolment lead system', 'Seasonal ad campaigns around admissions windows', 'Reporting on enquiries and enrolments'],
    starter: 'A school website with an admissions enquiry system, plus the Growth retainer during enrolment season.',
    relatedServices: ['business-websites', 'growth-retainer', 'crm-setup', 'social-media']
  },
  {
    slug: 'restaurants-caterers', title: 'Restaurants & Caterers',
    metaDescription: 'Digital tools for Ghanaian restaurants and caterers: WhatsApp ordering with MoMo payment links, online menus, bookings and social media that drives orders.',
    summary: 'Take clean orders and bookings on WhatsApp — and get paid instantly.',
    problems: ['Orders over WhatsApp are messy and error-prone', 'Chasing payment after cooking hurts cash flow', 'A great menu but no easy way to order or book'],
    whatWeBuild: ['WhatsApp ordering with MoMo payment links', 'An online menu and booking flow', 'Social content that turns followers into orders', 'Automated confirmations and reminders'],
    starter: 'A WhatsApp ordering flow with MoMo payments, plus social media to keep orders coming in.',
    relatedServices: ['whatsapp-ordering-booking', 'ecommerce-momo', 'social-media', 'booking-online-ordering']
  },
  {
    slug: 'hospitality-tourism', title: 'Hospitality & Tourism',
    metaDescription: 'Websites and direct-booking tools for Ghanaian hotels, guesthouses and tour operators — win direct bookings and reduce dependence on third-party platforms.',
    summary: 'Win direct bookings and depend less on third-party platforms.',
    problems: ['Third-party platforms take a cut of every booking', 'Guests cannot easily book direct', 'Slow replies to enquiries lose bookings'],
    whatWeBuild: ['A direct-booking website that reduces platform fees', 'A concierge-style WhatsApp assistant for guests', 'Local SEO and AI visibility so you get found', 'Photography that shows off your property'],
    starter: 'A direct-booking site with a guest WhatsApp assistant, backed by Local SEO.',
    relatedServices: ['booking-online-ordering', 'business-websites', 'local-seo-gbp', 'photography-video']
  },
  {
    slug: 'churches-ministries', title: 'Churches & Ministries',
    metaDescription: 'Websites, giving pages and communication tools for churches and ministries in Ghana — MoMo giving, event info and easy ways to stay connected with members.',
    summary: 'Make it easy for members to connect, give and stay informed.',
    problems: ['Giving is manual and hard to track', 'Members miss events and announcements', 'No central home for sermons and information'],
    whatWeBuild: ['A church website with events and sermons', 'A MoMo giving page for easy, trackable giving', 'Broadcasts by WhatsApp, SMS or email', 'Simple content your team can update'],
    starter: 'A church website with a MoMo giving page and a simple way to reach members.',
    relatedServices: ['business-websites', 'ecommerce-momo', 'email-sms', 'website-care']
  },
  {
    slug: 'fashion-retail', title: 'Fashion & Retail Boutiques',
    metaDescription: 'E-commerce and social selling for Ghanaian fashion and retail boutiques: mobile-first stores, MoMo checkout, WhatsApp reordering and content that sells.',
    summary: 'Sell beyond your DMs with a real store and effortless reordering.',
    problems: ['Selling through DMs does not scale and loses orders', 'No easy checkout, so customers drop off', 'Great products but scattered, inconsistent content'],
    whatWeBuild: ['A mobile-first store with MoMo and card checkout', 'WhatsApp reordering for loyal customers', 'On-brand product photography', 'A consistent social content calendar'],
    starter: 'A mobile-first store with MoMo checkout, plus social media and photography to drive sales.',
    relatedServices: ['ecommerce-momo', 'social-media', 'photography-video', 'whatsapp-ordering-booking']
  },
  {
    slug: 'events-weddings', title: 'Events & Weddings',
    metaDescription: 'Websites, portfolios and booking tools for Ghanaian event planners and wedding vendors — showcase your work and turn enquiries into booked dates.',
    summary: 'Showcase your work and turn enquiries into booked dates.',
    problems: ['A stunning portfolio trapped only on social media', 'Enquiries come in but bookings slip through', 'No easy way for clients to enquire and pay a deposit'],
    whatWeBuild: ['A portfolio website that shows off your work', 'A booking and enquiry flow with deposits', 'Targeted ads and social for your ideal clients', 'Automated follow-up so no enquiry goes cold'],
    starter: 'A portfolio website with a booking flow, plus social and ads to reach couples and hosts.',
    relatedServices: ['business-websites', 'booking-online-ordering', 'social-media', 'photography-video']
  },
  {
    slug: 'professional-services', title: 'Professional Services',
    metaDescription: 'Digital marketing and systems for Ghanaian law firms, accountants and consultants — a credible website, steady enquiries and organised client management.',
    summary: 'Look credible, win the right clients and keep your practice organised.',
    problems: ['A dated site undercuts a serious practice', 'Referrals are great but inconsistent', 'Client information and follow-up are scattered'],
    whatWeBuild: ['A credible website that reflects your expertise', 'SEO and content that win the right clients', 'A CRM to organise clients and follow-up', 'Microsoft 365 and secure document management'],
    starter: 'A professional website with SEO, plus a CRM and Microsoft 365 to run the practice.',
    relatedServices: ['business-websites', 'seo-programme', 'crm-setup', 'microsoft-365']
  }
];

export const industryBySlug = Object.fromEntries(industries.map(i => [i.slug, i]));

// ---- Grouped FAQ (for /faq/) ------------------------------------------------
export const faqGroups = [
  { title: 'General', items: [
    { q: 'Where is ShowMe based and who do you work with?', a: 'ShowMe is US-led, with our team on the ground in Accra, Ghana. Our founder, ' + site.founder + ', is based in the United States, and our delivery team works from Accra. Ghana is our core market: we help ambitious businesses across the country, from small teams getting online to established companies modernising how they operate. We also work with diaspora and international clients in the US, UK and Canada.' },
    { q: 'What makes ShowMe different?', a: 'We are one accountable partner across six divisions — web, growth, brand, business technology, AI and software — so you are not juggling freelancers. Our team brings ' + site.facts.experience + ' of experience and has helped ' + site.facts.businessesHelped + ' businesses across Ghana and abroad with their digital needs, and we lead with proof, not promises: we guarantee our speed and execution, not inflated lead numbers.' },
    { q: 'Do we need to meet in person?', a: 'No. Everything is delivered remotely over WhatsApp, video calls and shared workspaces, for businesses anywhere in Ghana and for diaspora and international clients in the US, UK and Canada, who can be quoted in USD. When you would like to meet, or a project needs on-site work such as a photo or video shoot, our team in Accra can meet you in person; travel outside Greater Accra is quoted separately.' }
  ]},
  { title: 'Pricing & payment', items: [
    { q: 'How much is the ShowMe Growth retainer?', a: site.facts.retainerPrice + ' per month with a ' + site.facts.retainerMinimum + ', billed monthly in advance by MoMo, bank transfer or card. Ad spend is separate and prepaid in cedis; we recommend at least ' + site.facts.adSpendMin + '/month.' },
    { q: 'How is everything else priced?', a: 'Every service has a published "from" price on our pricing page, so you know the starting point before we talk. Your fixed quote follows a short discovery call, based on exactly what you need.' },
    { q: 'What payment methods do you accept?', a: 'Mobile Money (MTN MoMo, Telecel Cash, AT Money), bank transfer and debit or credit card via a secure payment link. Diaspora clients can pay USD quotes by card or international bank transfer.' },
    { q: 'What are your payment terms?', a: 'Projects are 50% deposit to start and 50% on launch, and you approve a working preview before that final payment is due. Retainers and monthly plans are billed monthly in advance.' },
    { q: 'Do you quote in US dollars?', a: 'Yes. Clients in the US, UK and Canada can receive a USD quote. Indicative USD prices are shown on our pricing page, and the exact figure is fixed in your proposal.' }
  ]},
  { title: 'Timelines', items: [
    { q: 'How fast can you launch?', a: 'For the Growth retainer, your landing page, lead system and reporting go live within 7 days of onboarding — or month 1 is free. A business website typically takes 3–5 weeks, an online store 5–8 weeks and a custom web app first version 6–10 weeks.' },
    { q: 'What do you need from me to hit those timelines?', a: 'Timely content, approvals and access. We tell you exactly what we need up front so nothing stalls.' }
  ]},
  { title: 'Websites & e-commerce', items: [
    { q: 'Can I update my own website?', a: 'Yes. We build with content you can edit and train your team at handover, so you are never dependent on a developer for small changes.' },
    { q: 'Which payment methods can my store accept?', a: 'MTN MoMo, Telecel Cash, card and bank transfer via providers such as Paystack. We confirm the right mix during discovery.' }
  ]},
  { title: 'Growth, SEO & ads', items: [
    { q: 'Do you guarantee rankings or a number of leads?', a: 'No honest agency can. We guarantee the work, transparency and reporting. Rankings and lead volume depend on your market, offer and budget.' },
    { q: 'Is ad spend included in your fees?', a: 'No. Our fees cover management, landing pages, lead systems and reporting. Ad spend is separate and goes directly to the ad platforms.' },
    { q: 'What is AI search visibility?', a: 'It is optimising your content, profiles and reputation so AI assistants like ChatGPT, Gemini and Perplexity are more likely to recommend you — tracked monthly. No one can guarantee an AI recommendation, but we improve the signals that make it more likely.' }
  ]},
  { title: 'AI & automation', items: [
    { q: 'Will an AI assistant replace my staff?', a: 'No. It handles repetitive questions and qualifies leads 24/7, then hands off to a human for anything that needs a person.' },
    { q: 'Where should I start with automation?', a: 'Usually with an Automation Audit, so we target the workflows that save the most time and money first.' }
  ]},
  { title: 'Ownership & support', items: [
    { q: 'Do I own what you build?', a: 'Yes. You own your domain, content, brand assets and, for software, your code. We hand over full access at the end of an engagement.' },
    { q: 'What happens after launch?', a: 'We offer Website Care plans and ongoing growth, automation and support so your investment keeps working. There is no lock-in beyond any agreed minimum term.' }
  ]}
];

// ---- Insights (blog) --------------------------------------------------------
// Full article bodies live in scripts/articles/*.html (original copy).
function article(file) {
  return readFileSync(new URL('./articles/' + file, import.meta.url), 'utf8');
}
function words(html) { return html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length; }

const insightList = [
  {
    slug: 'get-recommended-by-ai-assistants', file: 'ai-assistants.html', topic: 'AI search',
    title: 'How to get your Ghanaian business recommended by AI assistants',
    excerpt: 'AI answers are becoming the new front page. Here is how to structure your content, profiles and reputation so tools like ChatGPT, Gemini and Perplexity name your business.'
  },
  {
    slug: 'ai-search-visibility-for-ghana-businesses', file: 'ai-search-ghana.html', topic: 'AI search',
    title: 'AI search visibility for Ghanaian businesses: a plain-English guide',
    excerpt: 'What AI search actually is, how it differs from traditional SEO, what to realistically expect and how to judge anyone offering to help.'
  },
  {
    slug: 'local-seo-google-business-profile-ghana', file: 'local-seo-gbp.html', topic: 'Local SEO',
    title: 'Local SEO in Ghana: getting the most from your Google Business Profile',
    excerpt: 'How to claim, complete and maintain your Google Business Profile so nearby customers find you in the map pack, trust you and get in touch.'
  },
  {
    slug: 'accept-mobile-money-on-your-website', file: 'momo.html', topic: 'E-commerce',
    title: 'How to accept Mobile Money payments on your website in Ghana',
    excerpt: 'A plain-English guide to taking MoMo, card and bank payments online: your options, what to look for in a provider and how to avoid abandoned checkouts.'
  },
  {
    slug: 'follow-up-every-whatsapp-lead', file: 'followup.html', topic: 'Lead follow-up',
    title: 'Never lose another WhatsApp lead: a simple follow-up system',
    excerpt: 'Most businesses lose sales to slow replies. Here is a simple system, part automation and part discipline, to make sure every WhatsApp enquiry gets followed up.'
  },
  {
    slug: 'whatsapp-automation-for-ghana-businesses', file: 'whatsapp-automation.html', topic: 'Automation',
    title: 'WhatsApp automation for Ghanaian businesses: what to automate and how',
    excerpt: 'Orders, payments, bookings, reminders and FAQs: what you can safely automate on WhatsApp, the tools involved, costs to plan for and mistakes to avoid.'
  }
];

export const insights = insightList.map(a => {
  const body = article(a.file);
  const wc = words(body);
  return { ...a, body, wordCount: wc, readMins: Math.max(1, Math.round(wc / 220)), published: '2026-10-01', publishedLabel: '1 October 2026' };
});
