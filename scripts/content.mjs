// ============================================================================
// Repositioning content (2026-10): pillars, flagship managed-IT packages,
// industries, engagement model and the route registry (Ghana-only pages and
// 301 redirects). Copy rules: no invented certifications, partners, logos,
// testimonials, results, team members or years; the only stats are 7+ years
// and 50+ businesses. Anything Josh must confirm is rendered with tbc().
// Cybersecurity is NOT offered as a service (Josh, 2026-10-15).
// ============================================================================
import { industries as LEGACY_INDUSTRIES, insights as ALL_INSIGHTS } from './data.mjs';

// ---- The four solution pillars ---------------------------------------------
export const PILLARS = [
  {
    slug: 'managed-it', letter: 'A', icon: 'managed-it',
    title: 'Managed IT Services & Infrastructure', short: 'Managed IT & Infrastructure',
    metaTitle: 'Managed IT Services & Infrastructure',
    summary: 'Day-to-day IT support, cloud workplace administration and dependable infrastructure, run as a service.',
    metaDescription: 'Managed IT services and infrastructure: help desk, Microsoft 365 and Google Workspace administration, cloud migration, networks, device management and backup.',
    intro: 'Your people need systems that simply work. We run the day-to-day IT your business depends on, from user support and accounts to devices, networks and backups, and we plan the improvements before problems force them.',
    items: [
      { t: 'Help desk & user support', d: 'A single place for your team to get IT help: account issues, software problems, new-starter setup and how-to questions, tracked to resolution.' },
      { t: 'Microsoft 365 & Google Workspace administration', d: 'Users, licences, mailboxes, shared drives, Teams or Meet, and routine sign-in settings such as multi-factor sign-in, set up properly and kept tidy.', link: 'microsoft-365' },
      { t: 'Cloud migration', d: 'Move email, files and line-of-business data to the cloud in planned stages, with a clear folder structure, permissions and a rollback plan.', link: 'cloud-document-management' },
      { t: 'Network & Wi-Fi', d: 'Office network and Wi-Fi planning, configuration and documentation, so connectivity is reliable and changes are recorded.' },
      { t: 'Device management', d: 'An inventory of laptops and phones, consistent setup, operating-system and application updates, and orderly handover when people join or leave.' },
      { t: 'Backup & disaster recovery', d: 'Backups for the systems and files that matter, monitored and test-restored, with a written plan for getting back to work after an outage.' }
    ],
    services: ['microsoft-365', 'cloud-document-management', 'technology-consulting'],
    ghServices: []
  },
  {
    slug: 'digital-marketing', letter: 'B', icon: 'digital-marketing',
    title: 'Digital Marketing & Brand Growth', short: 'Digital Marketing & Brand',
    metaTitle: 'Digital Marketing, Websites & Brand Growth',
    summary: 'Websites, search, social, advertising and brand work that turn attention into qualified enquiries.',
    metaDescription: 'Digital marketing and brand growth: business websites, SEO, Google Business Profile, social media, paid ads, brand identity, content, lead generation and analytics.',
    intro: 'Growth starts with being found and being trusted. We build the website, search presence, campaigns and brand that bring in qualified enquiries, and we report on what is working in plain English.',
    items: [
      { t: 'Websites', d: 'Fast, accessible business websites built to explain what you do and capture enquiries.', link: 'business-websites' },
      { t: 'Search engine optimisation (SEO)', d: 'Technical fixes, on-page work and helpful content so the right customers find you in search and AI answers.', link: 'seo-programme' },
      { t: 'Google Business Profile', d: 'A complete, well-maintained profile and review process for local searches and maps.', link: 'local-seo-gbp' },
      { t: 'Social media', d: 'Consistent, on-brand content calendars, design and community management.', link: 'social-media' },
      { t: 'Paid advertising', d: 'Google and Meta campaigns built around enquiries and sales, with transparent reporting.', link: 'paid-ads' },
      { t: 'Brand identity', d: 'Logo, colour, typography and guidelines that make you look as capable as you are.', link: 'brand-identity' },
      { t: 'Content marketing', d: 'Useful articles, guides and FAQs that build authority with buyers.', link: 'content-marketing' },
      { t: 'Lead generation', d: 'Campaigns, landing pages and follow-up working together, available as a managed monthly service.', link: 'growth-retainer' },
      { t: 'Conversion rate optimisation', d: 'Focused landing pages and testing so more of your visitors become enquiries.', link: 'landing-pages-funnels' },
      { t: 'Analytics & reporting', d: 'Correctly configured tracking and a clear dashboard of what your marketing actually produces.', link: 'analytics-reporting' }
    ],
    services: ['business-websites', 'ecommerce', 'landing-pages-funnels', 'booking-online-ordering', 'website-care', 'growth-retainer', 'local-seo-gbp', 'seo-programme', 'ai-search-visibility', 'paid-ads', 'social-media', 'content-marketing', 'email-sms', 'analytics-reporting', 'brand-identity', 'marketing-collateral', 'pitch-decks'],
    ghServices: ['photography-video']
  },
  {
    slug: 'ai-automation', letter: 'C', icon: 'ai-automation',
    title: 'AI, Automation & Business Intelligence', short: 'AI, Automation & BI',
    metaTitle: 'AI, Automation & Business Intelligence',
    summary: 'AI assistants, workflow automation, CRM and dashboards that remove repetitive work and show you what is happening.',
    metaDescription: 'AI, automation and business intelligence: AI agents and assistants, chatbots, workflow automation, CRM setup, dashboards and reporting for growing businesses.',
    intro: 'Most teams lose hours every week to copying, chasing and re-keying. We find the work worth automating, put practical AI to work on it, and give you dashboards that show the numbers you run the business on.',
    items: [
      { t: 'AI agents & internal assistants', d: 'Private assistants that answer staff questions from your own documents and policies, with sources.', link: 'ai-knowledge-base' },
      { t: 'Workflow automation', d: 'Invoice reminders, onboarding steps, approvals, reports and alerts handled automatically and monitored.', link: 'business-process-automation' },
      { t: 'Chatbots & customer assistants', d: 'Assistants on your website or messaging channels that answer questions, qualify enquiries and hand off to a person.', link: 'ai-assistants-chatbots' },
      { t: 'CRM', d: 'A customer system your team will actually use: lead capture, pipeline stages and follow-up reminders.', link: 'crm-setup' },
      { t: 'Dashboards', d: 'Live views of sales, operations and finance data in one place, replacing manual spreadsheet reports.', link: 'dashboards-internal-systems' },
      { t: 'Business intelligence', d: 'Connected data, consistent definitions and reporting that supports decisions, starting with an automation and data review.', link: 'automation-audit' }
    ],
    services: ['ai-assistants-chatbots', 'business-process-automation', 'automation-audit', 'ai-knowledge-base', 'crm-setup', 'dashboards-internal-systems', 'analytics-reporting'],
    ghServices: ['whatsapp-ordering-booking']
  },
  {
    slug: 'software-consulting', letter: 'D', icon: 'software-consulting',
    title: 'Software Development & Technology Consulting', short: 'Software & Consulting',
    metaTitle: 'Software Development & Technology Consulting',
    summary: 'Custom web and mobile applications, integrations and independent technology advice with a clear roadmap.',
    metaDescription: 'Software development and technology consulting: custom web and mobile apps, internal platforms, SaaS, integrations, digital transformation advice, roadmaps and maintenance.',
    intro: 'When off-the-shelf tools stop fitting, we design and build software around how your business works, and we help you decide what to build, buy or retire with an honest technology roadmap.',
    items: [
      { t: 'Custom web applications', d: 'Customer portals, booking systems and line-of-business apps built in reviewable stages.', link: 'custom-web-apps' },
      { t: 'Mobile applications', d: 'Cross-platform iOS and Android apps focused on one job done well.', link: 'mobile-apps' },
      { t: 'Internal platforms', d: 'Internal tools that replace spreadsheet workflows, with roles and audit history.', link: 'dashboards-internal-systems' },
      { t: 'SaaS products', d: 'From discovery sprint to a first version you can put in front of customers.', link: 'integrations-saas' },
      { t: 'Integrations', d: 'Connect the systems you already pay for so data flows without re-keying.', link: 'integrations-saas' },
      { t: 'Digital transformation consulting', d: 'An independent review of your systems and processes, with priorities tied to business goals.', link: 'technology-consulting' },
      { t: 'Technology roadmaps', d: 'A prioritised, budgeted plan for the next 12 to 24 months that your team can follow.', link: 'technology-consulting' },
      { t: 'Maintenance & support', d: 'Updates, monitoring and small improvements for the applications we build, on a monthly plan.' }
    ],
    services: ['custom-web-apps', 'mobile-apps', 'dashboards-internal-systems', 'integrations-saas', 'technology-consulting'],
    ghServices: []
  }
];
export const pillarBySlug = Object.fromEntries(PILLARS.map(p => [p.slug, p]));

// Primary pillar for each existing service page (breadcrumb + related lists).
export const SERVICE_PILLAR = {};
for (const p of PILLARS) for (const s of [...p.services, ...p.ghServices]) if (!SERVICE_PILLAR[s]) SERVICE_PILLAR[s] = p.slug;
SERVICE_PILLAR['analytics-reporting'] = 'digital-marketing';
SERVICE_PILLAR['dashboards-internal-systems'] = 'ai-automation';
SERVICE_PILLAR['technology-consulting'] = 'software-consulting';

// ---- Flagship: managed IT packages (names and scope await Josh) ------------
export const TIERS = [
  {
    name: 'Essentials', forWho: 'Small teams that need dependable day-to-day IT support and administration.',
    items: ['Remote help desk for your users', 'Microsoft 365 or Google Workspace user and licence administration', 'Device inventory', 'Operating-system and application update management', 'Backup monitoring', 'Monthly service summary']
  },
  {
    name: 'Business', featured: true, forWho: 'Growing teams that want IT managed end to end, including people changes and vendors.',
    items: ['Everything in Essentials', 'Staff onboarding and offboarding (accounts, devices, access)', 'Standard device setup and configuration', 'Network and Wi-Fi management (remote)', 'Coordination with your software and internet vendors', 'Quarterly service review']
  },
  {
    name: 'Complete', forWho: 'Organisations that want an outsourced IT department, including planning and documentation.',
    items: ['Everything in Business', 'Technology roadmap and budget planning sessions', 'IT documentation and policy templates', 'Cloud and infrastructure planning', 'Practical staff training on your core tools', 'Priority handling of requests']
  }
];
// Feature matrix rows: [label, essentials, business, complete] with
// 'yes' | 'no' | 'addon'.
export const TIER_MATRIX = [
  ['Help desk for users (remote)', 'yes', 'yes', 'yes'],
  ['Microsoft 365 / Google Workspace administration', 'yes', 'yes', 'yes'],
  ['Device inventory and update management', 'yes', 'yes', 'yes'],
  ['Backup monitoring', 'yes', 'yes', 'yes'],
  ['Monthly service summary', 'yes', 'yes', 'yes'],
  ['Onboarding and offboarding', 'addon', 'yes', 'yes'],
  ['Network and Wi-Fi management', 'addon', 'yes', 'yes'],
  ['Vendor coordination', 'no', 'yes', 'yes'],
  ['Quarterly service review', 'no', 'yes', 'yes'],
  ['Technology roadmap and budget planning', 'addon', 'addon', 'yes'],
  ['IT documentation and policy templates', 'addon', 'addon', 'yes'],
  ['On-site visits', 'addon', 'addon', 'addon']
];
export const BOUNDARIES = [
  'Hardware, software and licence costs (passed through at cost or bought by you)',
  'On-site visits, unless agreed as an add-on where available',
  'Project work such as office moves, large migrations or new systems (quoted separately)',
  'Systems that are no longer supported by their manufacturer',
  'Faults in third-party services outside our control, which we escalate with the vendor on your behalf'
];
export const ADDONS = [
  'On-site support (location-dependent)',
  'Device procurement and setup',
  'Cloud migration projects',
  'Technology roadmap workshops',
  'Additional staff training sessions',
  'Out-of-hours support, only where it is offered'
];
export const CLIENT_RESPONSIBILITIES = [
  'Give us timely access and a named contact who can approve changes',
  'Keep ownership of your licences, domains and accounts (we set them up in your name)',
  'Approve changes that affect how your team works before we make them',
  'Encourage your team to log requests through the agreed channel'
];
export const RESPONSE_ROWS = [
  ['Critical: business stopped', 'response target', 'update cadence'],
  ['High: a team or key system affected', 'response target', 'update cadence'],
  ['Normal: one user affected', 'response target', 'update cadence'],
  ['Request: change or how-to', 'response target', 'update cadence']
];

// ---- Industries (US-neutral copy) ------------------------------------------
export const INDUSTRIES = [
  {
    slug: 'healthcare-clinics', icon: 'healthcare', title: 'Healthcare Clinics',
    metaTitle: 'IT, Automation & Digital Marketing for Healthcare Clinics',
    metaDescription: 'Managed IT, booking systems, automation and digital marketing for private clinics and dental practices: reliable systems for staff, easy booking for patients.',
    summary: 'Reliable systems for clinical and front-desk staff, and an easier path from search to booked appointment.',
    challenges: ['Front-desk staff juggling phones, messages and paper forms', 'Shared logins and ad-hoc devices that nobody fully manages', 'Patients who cannot book online or get no reminder', 'Little visibility of which channels bring new patients'],
    help: [
      ['managed-it', 'Help desk, device management and Microsoft 365 or Google Workspace administration for clinical and admin staff, with tidy accounts and backups.'],
      ['ai-automation', 'Appointment reminders, intake-form routing and an assistant that answers routine patient questions and hands off to staff.'],
      ['digital-marketing', 'A clear website with online booking, an accurate Google Business Profile and reporting on new-patient enquiries.'],
      ['software-consulting', 'Integrations between your booking, billing and communication tools so information is entered once.']
    ],
    note: 'Patient information needs careful handling. We configure tools with sensible access controls and work alongside your own compliance and legal advisers; we do not provide legal advice or compliance certification.',
    services: ['booking-online-ordering', 'microsoft-365', 'ai-assistants-chatbots', 'local-seo-gbp']
  },
  {
    slug: 'professional-services', icon: 'professional', title: 'Professional Services',
    metaTitle: 'Managed IT & Technology for Professional Services Firms',
    metaDescription: 'Managed IT, document management, CRM, automation and marketing for law, accounting, consulting and advisory firms that run on knowledge and client trust.',
    summary: 'For law, accounting, consulting and advisory firms that run on documents, deadlines and client trust.',
    challenges: ['Client documents spread across inboxes, laptops and personal drives', 'New staff waiting days for accounts and equipment', 'Proposals and follow-ups tracked in people\'s heads', 'A website that undersells the expertise of the firm'],
    help: [
      ['managed-it', 'Managed IT with structured onboarding and offboarding, organised cloud files with permissions, and monitored backups.'],
      ['ai-automation', 'A CRM for referrals and pipeline, automated engagement-letter and invoice reminders, and an internal assistant for policies and templates.'],
      ['digital-marketing', 'A credible website and thought-leadership content that explains your services and captures qualified enquiries.'],
      ['software-consulting', 'Client portals for document exchange and a technology roadmap aligned with partner priorities.']
    ],
    services: ['cloud-document-management', 'crm-setup', 'ai-knowledge-base', 'custom-web-apps']
  },
  {
    slug: 'schools', icon: 'schools', title: 'Schools & Education',
    metaTitle: 'IT Support, Systems & Communication for Schools',
    metaDescription: 'IT support, device and account management, parent communication, enrolment websites and dashboards for independent schools and education providers.',
    summary: 'Dependable IT for staff and classrooms, and clearer communication with families.',
    challenges: ['Staff and student accounts created and removed by hand', 'Classroom devices and Wi-Fi that fail at the worst moment', 'Admissions enquiries that wait days for a reply', 'Fee, attendance and enrolment data spread across spreadsheets'],
    help: [
      ['managed-it', 'Help desk for staff, account lifecycle management for each term, device inventory and updates, and network and Wi-Fi management.'],
      ['ai-automation', 'Automated admissions follow-up, fee reminders and a dashboard of enrolment and attendance figures.'],
      ['digital-marketing', 'An admissions-focused website, open-day campaigns and an accurate presence in local search.'],
      ['software-consulting', 'Parent and staff portals and integration between your management system and communication tools.']
    ],
    note: 'Student information needs careful handling. We work within your school\'s own data policies and alongside your advisers; we do not provide legal advice or compliance certification.',
    services: ['microsoft-365', 'dashboards-internal-systems', 'business-process-automation', 'business-websites']
  },
  {
    slug: 'nonprofits', icon: 'nonprofits', title: 'Nonprofits & NGOs',
    metaTitle: 'Technology & Digital Support for Nonprofits and NGOs',
    metaDescription: 'Practical IT, CRM, automation, dashboards and digital campaigns for nonprofits, NGOs and faith-based organisations: more impact from limited budgets.',
    summary: 'Practical technology that stretches limited budgets further, for nonprofits, NGOs and faith-based organisations.',
    challenges: ['Volunteers and staff sharing accounts and devices', 'Supporter and donor records split across lists and spreadsheets', 'Reporting to funders that takes days to assemble', 'Campaigns that are hard to measure'],
    help: [
      ['managed-it', 'Managed IT and workspace administration sized for small teams and changing volunteer rosters.'],
      ['ai-automation', 'A supporter CRM, automated thank-you and follow-up messages, and dashboards for programme and funder reporting.'],
      ['digital-marketing', 'A clear website with donation and sign-up journeys, email campaigns and social content.'],
      ['software-consulting', 'An honest technology roadmap that prioritises spend and integrations between the tools you already use.']
    ],
    services: ['crm-setup', 'email-sms', 'dashboards-internal-systems', 'business-websites']
  },
  {
    slug: 'retail-hospitality', icon: 'retail', title: 'Retail & Hospitality',
    metaTitle: 'Technology & Marketing for Retail, Restaurants and Hospitality',
    metaDescription: 'E-commerce, online ordering and booking, automation, managed IT and marketing for retailers, restaurants, hotels and event businesses.',
    summary: 'For retailers, restaurants, hotels and event businesses that need smooth ordering, booking and repeat custom.',
    challenges: ['Orders and bookings arriving through too many channels', 'Stock, sales and staffing data that never line up', 'Store and front-of-house systems nobody owns', 'Repeat customers forgotten after the first visit'],
    help: [
      ['digital-marketing', 'Online stores, booking and ordering systems, local search and campaigns that bring customers back.'],
      ['ai-automation', 'Order and booking notifications, stock alerts, review requests and a sales dashboard.'],
      ['managed-it', 'Support for point-of-sale devices, back-office computers, Wi-Fi and workspace accounts.'],
      ['software-consulting', 'Integrations between your store, payments, accounting and delivery partners.']
    ],
    note: 'For online payments we design checkouts so card details are handled by your payment provider rather than stored on your website.',
    services: ['ecommerce', 'booking-online-ordering', 'business-process-automation', 'email-sms']
  },
  {
    slug: 'startups-smes', icon: 'startups', title: 'Startups & SMEs',
    metaTitle: 'IT, Software & Growth Support for Startups and SMEs',
    metaDescription: 'Managed IT, software development, automation and digital marketing for startups and small and mid-sized businesses that need an IT department without hiring one.',
    summary: 'The IT department, software team and growth partner a growing company needs, without hiring all three.',
    challenges: ['IT handled by whoever is least busy', 'Tools added one at a time with no plan', 'A product or internal system that outgrew its first version', 'Marketing that is hard to tie to revenue'],
    help: [
      ['managed-it', 'A managed IT service that grows with headcount: accounts, devices, onboarding and backups from day one.'],
      ['software-consulting', 'MVPs, internal tools and integrations, plus a technology roadmap for the next stage of growth.'],
      ['ai-automation', 'Automation of repetitive operations and dashboards for the metrics investors and managers ask about.'],
      ['digital-marketing', 'A website, brand and lead-generation engine that match the ambition of the company.']
    ],
    services: ['custom-web-apps', 'integrations-saas', 'technology-consulting', 'growth-retainer']
  }
];
export const industryBySlug = Object.fromEntries(INDUSTRIES.map(i => [i.slug, i]));

// Ghana-view-only industries (legacy data, kept at their URLs).
export const GH_INDUSTRIES = LEGACY_INDUSTRIES.filter(i => ['real-estate', 'diaspora-property'].includes(i.slug));

// ---- Engagement model -------------------------------------------------------
export const JOURNEY = [
  { t: 'Consultation', d: 'A conversation about your goals, current setup and constraints. No obligation and no sales script.' },
  { t: 'Assessment', d: 'We review your systems, accounts, devices, workflows and marketing, depending on what you asked us to look at.' },
  { t: 'Roadmap', d: 'A prioritised list of recommendations, separated into quick wins, projects and ongoing services.' },
  { t: 'Proposal & agreement', d: 'A written proposal with scope, deliverables, exclusions, timeline and price. Nothing starts until you approve it.' },
  { t: 'Onboarding', d: 'We document your current setup, agree access and contacts, fix urgent issues and set up reporting.' },
  { t: 'Ongoing service & reporting', d: 'Regular service summaries, reviews against the roadmap and clear recommendations for what comes next.' }
];
export const ENGAGEMENTS = [
  { t: 'Projects', d: 'A defined outcome with a fixed scope and quote: a website, a migration, an automation, an application.', points: ['Fixed scope and quote before work starts', 'Working preview before the final payment', '30 days of post-launch support'] },
  { t: 'Managed monthly services', d: 'Ongoing responsibility for an area of your business: IT support and administration, marketing, or application maintenance.', points: ['Clear monthly scope with inclusions and exclusions', 'Regular service summaries', 'Reviews against your technology roadmap'] },
  { t: 'Advisory', d: 'Independent advice when you need a second opinion or a plan: technology reviews, roadmaps and vendor selection.', points: ['Fixed-fee sessions or workshops', 'Written recommendations you keep', 'No obligation to buy implementation from us'] }
];

// ---- Route registry ---------------------------------------------------------
// Ghana-only pages: reachable only in the Ghana view. For US (default)
// visitors the worker answers 302 to the fallback (302, not 301, so a browser
// never caches the redirect across a region switch). They are left out of
// the sitemap and the US navigation.
export const GH_ONLY = {
  '/industries/real-estate/': '/industries/',
  '/industries/diaspora-property/': '/industries/',
  '/services/whatsapp-ordering-booking/': '/services/booking-online-ordering/',
  '/services/photography-video/': '/services/brand-identity/',
  '/insights/accept-mobile-money-on-your-website/': '/insights/',
  '/insights/local-seo-google-business-profile-ghana/': '/insights/',
  '/insights/ai-search-visibility-for-ghana-businesses/': '/insights/',
  '/insights/whatsapp-automation-for-ghana-businesses/': '/insights/'
};
export const GH_SERVICES = new Set(['whatsapp-ordering-booking', 'photography-video']);
export const INSIGHTS_US = ALL_INSIGHTS.filter(a => !GH_ONLY['/insights/' + a.slug + '/']);
export const INSIGHTS_GH = ALL_INSIGHTS.filter(a => GH_ONLY['/insights/' + a.slug + '/']);

// Permanent redirects for retired URLs (old URL -> new home).
export const REDIRECTS = {
  '/services/': '/solutions/',
  '/process/': '/how-we-work/',
  '/work/': '/capabilities/',
  '/services/ecommerce-momo/': '/services/ecommerce/',
  '/services/whatsapp-ai-assistant/': '/services/ai-assistants-chatbots/',
  '/services/it-consulting-training/': '/services/technology-consulting/',
  '/industries/private-healthcare/': '/industries/healthcare-clinics/',
  '/industries/private-schools/': '/industries/schools/',
  '/industries/restaurants-caterers/': '/industries/retail-hospitality/',
  '/industries/hospitality-tourism/': '/industries/retail-hospitality/',
  '/industries/fashion-retail/': '/industries/retail-hospitality/',
  '/industries/events-weddings/': '/industries/retail-hospitality/',
  '/industries/churches-ministries/': '/industries/nonprofits/'
};
