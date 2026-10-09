// ============================================================================
// ShowMe Digital Agency — published "from" prices
// ----------------------------------------------------------------------------
// Benchmarked (Oct 2026) against two Ghanaian competitors' public prices:
//   BVM Digital: website 8,000–12,000 · store 12,000–18,000 · web app 18,000+
//                · care from 800/mo · local SEO 1,500/mo · full SEO 3,500+/mo
//                · automation audit 1,500 (credited) · quick-win 3,500–6,000
//   Agodoo:      web from 6,500 · WhatsApp & AI from 5,500 · SEO & ads from
//                2,500/mo · social from 2,800/mo · branding from 3,500
//                · e-commerce from 12,000
// ShowMe sits between the two on price and above both on what is included
// (preview before final payment, 30 days of launch support, 7-day launch
// guarantee on the Growth retainer, WhatsApp lead capture on every build).
//
// Prices are written as {{tokens}} resolved per region (United States / USD
// by default, Ghana / GHS alternate) from scripts/money.mjs. US figures are
// PROPOSED and need founder approval before going live.
// ============================================================================

export const USD_NOTE = 'Your proposal fixes the exact amount.';

export const PRICES = {
  // ---- Web & Commerce ----
  'business-websites': { price: 'From {{web}}', note: 'Up to 6 custom pages, mobile-first design, enquiry capture to WhatsApp and email, SEO foundations, analytics, training and 30 days of launch support. Typical delivery 3–5 weeks.' },
  'ecommerce-momo': { price: 'From {{store}}', note: 'Up to 50 products loaded, {{checkout_methods}}, WhatsApp reordering, order and stock management, training and 30 days of launch support. Payment-provider fees are separate. Typical delivery 5–8 weeks.' },
  'landing-pages-funnels': { price: 'From {{landing}}', note: 'One focused campaign page with copy, lead capture and conversion tracking. Additional variants from {{landing_variant}} each. Typical delivery 5–7 working days.' },
  'booking-online-ordering': { price: 'From {{booking}}', note: 'Booking or ordering flow, availability rules, confirmations and reminders, optional {{deposit_methods}} deposits and a simple dashboard. Typical delivery 3–6 weeks.' },
  'website-care': { price: 'From {{care}} / month', note: 'Hosting, SSL, backups, security updates, uptime monitoring, up to 1 hour of small changes each month and a monthly summary. Month to month after a 3-month minimum.' },

  // ---- Growth (retainer price lives in data.mjs as a real fact) ----
  'local-seo-gbp': { price: 'From {{local_seo}} / month', note: 'Google Business Profile optimisation, weekly posts, review-generation flow and responses, citation clean-up and a monthly ranking, calls and directions report. 3-month minimum.' },
  'seo-programme': { price: 'From {{seo}} / month', note: 'Technical fixes, on-page optimisation, 2 original articles a month, ethical link building and monthly reporting on rankings, traffic and enquiries. 3-month minimum.' },
  'ai-search-visibility': { price: 'From {{ai_search}} / month', note: 'AI-answer baseline, answer-ready FAQ content with schema, profile consistency work and monthly tracking of up to 20 buyer questions across ChatGPT, Gemini and Perplexity. 3-month minimum. Save {{ai_search_combo_saving}}/month when combined with the SEO Programme.' },
  'paid-ads': { price: 'From {{ads_one}} / month', note: 'Management of Google or Meta campaigns (both from {{ads_both}}/month), creative, conversion tracking and monthly cost-per-lead reporting. Ad spend is separate and paid directly to the platforms; we recommend at least {{adspend}}/month.' },
  'social-media': { price: 'From {{social}} / month', note: 'Two platforms, 12 designed posts plus stories a month, scheduling, community replies on working days and a monthly summary. Boost budget is separate.' },
  'content-marketing': { price: 'From {{content}} / month', note: 'Three original, SEO-optimised articles or guides a month (800–1,200 words), FAQ schema and internal linking. Single articles from {{article}}.' },
  'email-sms': { price: 'From {{email_sms}} / month', note: 'Two campaigns a month, one automated sequence built and maintained, list hygiene and reporting. Platform and SMS credit costs are separate. One-off sequence builds from {{email_seq}}.' },
  'analytics-reporting': { price: 'From {{analytics}}', note: 'One-off GA4, Search Console and conversion-tracking setup with a one-page dashboard. Ongoing monthly reporting from {{reporting}}/month (weekly reporting is already part of the Growth retainer).' },

  // ---- Brand ----
  'brand-identity': { price: 'From {{brand}}', note: 'Brand Essentials: logo suite, colour palette, typography and a mini brand guide (2 concepts, 2 revision rounds). Full Identity System, adding complete guidelines, stationery and a social media kit, from {{brand_full}}.' },
  'marketing-collateral': { price: 'From {{collateral}}', note: 'A company profile of up to 12 pages, or a stationery set (business card, letterhead, email signature and invoice template). Print-ready and editable files included; printing is separate.' },
  'photography-video': { price: 'From {{photo}} per shoot', note: '{{photo_where}} with up to 40 edited photos. Short-form video add-on (3 edited clips) from {{video}}. Travel outside Greater Accra is quoted separately.' },
  'pitch-decks': { price: 'From {{pitch}}', note: 'Up to 15 slides: narrative structure, on-brand design, simple charts and an editable master file, with 2 revision rounds.' },

  // ---- Business Technology ----
  'microsoft-365': { price: 'From {{m365}}', note: 'Setup for up to 5 users: domain email, Microsoft 365 apps, Teams and SharePoint basics, mailbox migration and a training session. Additional users from {{m365_user}} each. Microsoft licence fees are paid separately to Microsoft.' },
  'cloud-document-management': { price: 'From {{cloud}}', note: 'Folder and permission structure, migration of up to 50 GB of existing files, backup setup and one team training session.' },
  'crm-setup': { price: 'From {{crm}}', note: 'CRM selection and configuration, pipeline stages, website and WhatsApp lead capture, follow-up reminders and team training. CRM subscription fees are separate.' },
  'it-consulting-training': { price: 'From {{it_session}} per session', note: 'A half-day advisory or hands-on training session for up to 10 staff, with a written summary and simple guides. Multi-session programmes are quoted.' },

  // ---- AI & Automation ----
  'whatsapp-ai-assistant': { price: 'From {{wa_ai}}', note: 'Setup of an AI assistant trained on up to 50 FAQs, lead qualification and human hand-off, plus 30 days of tuning. Ongoing care from {{wa_ai_care}}/month; WhatsApp and AI usage fees are passed through at cost.' },
  'whatsapp-ordering-booking': { price: 'From {{wa_order}}', note: 'A guided ordering or booking flow for up to 40 menu items or services, {{momo_links}}, routing to your team and automatic confirmations. Payment-provider and WhatsApp fees are separate.' },
  'business-process-automation': { price: 'From {{bpa}}', note: 'A Quick-Win package of up to 3 automated workflows (for example invoice reminders, onboarding and a weekly report), documented and tested. Larger automation programmes from {{bpa_large}}. Support from {{bpa_support}}/month. Tool subscriptions are separate.' },
  'automation-audit': { price: '{{audit}}', note: 'A fixed-fee audit with a prioritised roadmap. The full {{audit}} is credited toward any automation build you start with us within 60 days.' },
  'ai-knowledge-base': { price: 'From {{ai_kb}}', note: 'Up to 200 pages of documents organised and loaded into a private internal assistant with source-linked answers, access control and a content-update routine. AI usage fees are passed through at cost.' },

  // ---- Software ----
  'custom-web-apps': { price: 'From {{webapp}}', note: 'A focused first version (MVP) of a portal or web app, with logins, core features, hosting setup and documentation. Built in reviewable stages; most first versions take 6–10 weeks.' },
  'mobile-apps': { price: 'From {{mobile}}', note: 'A cross-platform (iOS and Android) first version focused on one core job, with store submission in your name. Most first versions take 8–14 weeks.' },
  'dashboards-internal-systems': { price: 'From {{dashboard}}', note: 'A dashboard connecting up to 3 data sources, or a single internal tool replacing a spreadsheet workflow, with roles and training.' },
  'integrations-saas': { price: 'From {{integration}}', note: 'A single integration between two systems, built, tested and monitored. SaaS product builds start with a paid discovery sprint from {{discovery}}, credited toward the build.' }
};

// ---- Bundles ---------------------------------------------------------------
export const BUNDLES = [
  {
    name: 'Launch', tagline: 'Get online, credibly and fast.',
    price: 'From {{b_launch}}', unit: 'one-off',
    saving: 'Over {{b_launch_saving}} less than buying each part separately',
    timeline: '3–5 weeks',
    forWho: 'New or under-represented businesses that need to look credible and start capturing enquiries.',
    includes: [
      'Business website, up to 6 pages, mobile-first and SEO-ready',
      'Brand Essentials: logo suite, colours, fonts and mini guide',
      'Google Business Profile set up and optimised',
      'WhatsApp and email enquiry capture',
      'Analytics and Search Console set up',
      '3 months of Website Care included'
    ]
  },
  {
    name: 'Grow', tagline: 'Turn attention into enquiries.', featured: true,
    price: 'From {{b_grow}}', unit: 'setup + Growth retainer',
    monthly: 'then {{retainer}}/month Growth retainer (3-month minimum)',
    saving: 'Over {{b_grow_saving}} less on setup than buying each part separately',
    timeline: 'Lead system live in 7 days; full site 3–5 weeks',
    forWho: 'Businesses with a proven offer that want a steady, measured flow of qualified leads.',
    includes: [
      'Conversion-focused website, up to 8 pages, with SEO foundations',
      'WhatsApp AI assistant: FAQs, lead qualification, human hand-off',
      'Google Business Profile optimisation',
      'ShowMe Growth retainer: managed ads, landing page, weekly reporting',
      'Live in 7 days of onboarding, or month 1 of the retainer is free',
      'Ad spend separate, recommended from {{adspend}}/month'
    ]
  },
  {
    name: 'Scale', tagline: 'Sell more and automate operations.',
    price: 'From {{b_scale}}', unit: 'one-off',
    monthly: 'optional support from {{bpa_support}}/month after month 3',
    saving: 'Over {{b_scale_saving}} less than buying each part separately',
    timeline: '6–9 weeks',
    forWho: 'Established businesses ready to sell online and take repetitive work off their team.',
    includes: [
      'E-commerce store with {{checkout_methods}}',
      'WhatsApp reordering for repeat customers',
      'Full Identity System: guidelines, stationery and social kit',
      'Up to 3 automated workflows (e.g. invoices, stock alerts, reports)',
      'Order, stock and sales dashboard for your team',
      '3 months of Website Care and 30 days of automation tuning included'
    ]
  }
];

export const PAYMENT = {
  projectSplit: '50% deposit to start, 50% on launch',
  retainer: 'Retainers and monthly plans are billed monthly in advance',
  methods: ['{{pay1}}', '{{pay2}}', '{{pay3}}'],
  usd: '{{pay_note}}',
  preview: 'You approve a working preview before the final 50% is due. If it does not match the agreed scope, we fix it first.'
};
