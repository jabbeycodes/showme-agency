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
      { t: 'Microsoft 365 & Google Workspace administration', d: 'Users, licenses, mailboxes, shared drives, Teams or Meet, and routine sign-in settings such as multi-factor sign-in, set up properly and kept tidy.', link: 'microsoft-365' },
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
    summary: 'Websites, search, social, advertising and brand work that turn attention into qualified inquiries.',
    metaDescription: 'Digital marketing and brand growth: business websites, SEO, Google Business Profile, social media, paid ads, brand identity, content, lead generation and analytics.',
    intro: 'Growth starts with being found and being trusted. We build the website, search presence, campaigns and brand that bring in qualified inquiries, and we report on what is working in plain English.',
    items: [
      { t: 'Websites', d: 'Fast, accessible business websites built to explain what you do and capture inquiries.', link: 'business-websites' },
      { t: 'Search engine optimization (SEO)', d: 'Technical fixes, on-page work and helpful content so the right customers find you in search and AI answers.', link: 'seo-program' },
      { t: 'Google Business Profile', d: 'A complete, well-maintained profile and review process for local searches and maps.', link: 'local-seo-gbp' },
      { t: 'Social media', d: 'Consistent, on-brand content calendars, design and community management.', link: 'social-media' },
      { t: 'Paid advertising', d: 'Google and Meta campaigns built around inquiries and sales, with transparent reporting.', link: 'paid-ads' },
      { t: 'Brand identity', d: 'Logo, color, typography and guidelines that make you look as capable as you are.', link: 'brand-identity' },
      { t: 'Content marketing', d: 'Useful articles, guides and FAQs that build authority with buyers.', link: 'content-marketing' },
      { t: 'Lead generation', d: 'Campaigns, landing pages and follow-up working together, available as a managed monthly service.', link: 'growth-retainer' },
      { t: 'Conversion rate optimization', d: 'Focused landing pages and testing so more of your visitors become inquiries.', link: 'landing-pages-funnels' },
      { t: 'Analytics & reporting', d: 'Correctly configured tracking and a clear dashboard of what your marketing actually produces.', link: 'analytics-reporting' }
    ],
    services: ['business-websites', 'ecommerce', 'landing-pages-funnels', 'booking-online-ordering', 'website-care', 'growth-retainer', 'local-seo-gbp', 'seo-program', 'ai-search-visibility', 'paid-ads', 'social-media', 'content-marketing', 'email-sms', 'analytics-reporting', 'brand-identity', 'marketing-collateral', 'pitch-decks'],
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
      { t: 'Chatbots & customer assistants', d: 'Assistants on your website or messaging channels that answer questions, qualify inquiries and hand off to a person.', link: 'ai-assistants-chatbots' },
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
      { t: 'Technology roadmaps', d: 'A prioritized, budgeted plan for the next 12 to 24 months that your team can follow.', link: 'technology-consulting' },
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

// ---- Flagship: managed IT plans ---------------------------------------------
// Source: repositioning/managed-it-packages.md (draft for Josh, 2026-10-15).
// Names and inclusions follow that file. Everything it marks [CONFIRM WITH
// JOSH] or [PRICE TBD] is rendered as a visible placeholder; its proposed
// response figures are NOT published. tbc:'…' marks a placeholder cell/item.
export const TIERS = [
  {
    name: 'Essentials', tagline: 'Someone to call, and your accounts set up properly.',
    forWho: 'Small teams (about 3 to 10 people) that need someone to call and their accounts set up properly.',
    items: [
      'Remote help desk by email and phone, business hours',
      { t: 'Monthly help desk hours cap', tbc: 'help desk hours included per month', live: 'Monthly help desk hours, set in your service agreement' },
      'Microsoft 365 or Google Workspace admin: users, passwords, mailboxes, sign-in setup (including MFA)',
      'Email delivery settings (SPF, DKIM, DMARC) checked and set up',
      'Device inventory and an update check',
      'Backup of email and cloud files',
      'New starter and leaver accounts on request',
      'Quarterly plain-English summary and an annual check-in'
    ]
  },
  {
    name: 'Business', featured: true, tagline: 'IT that runs in the background.',
    forWho: 'Growing teams (about 10 to 50 people) that rely on their systems every day.',
    items: [
      'Everything in Essentials',
      { t: 'Remote help desk for covered issues without an hours cap', tbc: 'fair-use policy', live: 'Remote help desk for covered issues without an hours cap, under the fair-use terms in your agreement' },
      'Remote device monitoring and scheduled updates',
      'Backup extended to key devices or a local server, with a quarterly restore test',
      'Remote support for router and Wi-Fi',
      'Checklist-based onboarding and offboarding',
      'License management: seats and renewals tracked',
      'Short how-to guides for your team',
      'Monthly report and quarterly review call'
    ]
  },
  {
    name: 'Complete IT Department', tagline: 'Your IT department, without hiring one.',
    forWho: 'Businesses that want an outsourced IT department, including planning and vendor management.',
    items: [
      'Everything in Business',
      { t: 'A named technology lead acting as your virtual IT manager', tbc: 'who the named lead is', live: 'A named technology lead acting as your virtual IT manager' },
      'Full device lifecycle: purchasing advice, setup, rollout and retirement',
      'Network design and documentation, including staff and guest Wi-Fi',
      'Vendor management: internet provider, software vendors, printers',
      'Monthly restore test and documented recovery steps',
      'IT documentation kept up to date',
      'Technology roadmap tied to your business goals',
      'Monthly report and quarterly business review'
    ]
  }
];
// Comparison rows: [label, essentials, business, complete]. Cell values are
// plain text, or { tbc: '…' } for an item still to be confirmed.
export const TIER_MATRIX = [
  ['Remote help desk', 'Business hours, capped', 'Business hours, no cap for covered issues', { tbc: 'extended-hours option', live: 'Available by agreement' }],
  ['Microsoft 365 / Google Workspace admin', 'Users, passwords, mailboxes, sign-in setup (incl. MFA), email delivery settings', '+ groups, shared drives, license management', '+ advanced configuration, retention settings, tenant documentation'],
  ['Device management', 'Inventory and update checks', 'Remote monitoring and scheduled updates', '+ setup, rollout and retirement (full lifecycle)'],
  ['Backup', 'Cloud email and file backup', '+ key devices or server, quarterly restore test', '+ monthly restore test, documented recovery steps'],
  ['Staff changes', 'New starter and leaver accounts on request', '+ checklist-based onboarding and offboarding', '+ device handout and collection'],
  ['Network', 'Advice only', 'Remote support for router and Wi-Fi', '+ network design, staff and guest Wi-Fi, documentation'],
  ['Planning', 'Annual check-in', 'Quarterly review', 'Monthly check-in and quarterly roadmap (virtual IT manager)'],
  ['Reporting', 'Quarterly summary', 'Monthly report', 'Monthly report and quarterly business review'],
  ['On-site visits', 'Not included (billable)', { tbc: 'on-site visits', live: 'By agreement' }, { tbc: 'included visits per month or quarter', live: 'As agreed in your plan' }]
];
export const BOUNDARIES = [
  'Hardware, software licenses and third-party subscriptions (billed separately at cost or as quoted)',
  'Projects such as migrations, office moves, new office setups or new systems (quoted separately)',
  'On-site visits unless included in your plan (billable per visit or hour)',
  'Support for personal devices, home networks or non-business software',
  'Line-of-business software (for example practice-management or accounting systems) beyond basic access issues; we liaise with the vendor',
  'Security assessments, testing, training or compliance work (not offered at present)',
  'Out-of-hours monitoring or support unless separately agreed and confirmed'
];
export const ADDONS = [
  ['On-site support', 'Scheduled or urgent visits', { tbc: 'travel area per city', live: 'Quoted for your location' }],
  ['After-hours support', 'Help outside standard hours for critical issues', { tbc: 'after-hours availability', live: 'By agreement' }],
  ['Cloud migration', 'Move email and files to Microsoft 365 or Google Workspace, or between them', 'Scoped per project'],
  ['New office or network setup', 'Router and Wi-Fi design and installation, cabling coordination, printers', 'Hardware separate'],
  ['Device rollout', 'New laptops and desktops bought, set up and delivered ready to use', 'Hardware separate'],
  ['Team tool training', 'Short sessions on Microsoft 365 or Google Workspace, shared drives, Teams or Meet', { tbc: 'attendees per session', live: 'Quoted per session' }],
  ['Website care', 'Hosting oversight, updates, backups, uptime checks and small edits', 'Redesigns quoted separately'],
  ['Marketing growth', 'SEO, Google Business Profile, social media and ads management', 'Ad spend paid separately'],
  ['AI & automation build', 'A defined automation, chatbot or AI assistant', 'Scoped after an automation review'],
  ['Dashboards & reporting', 'A business dashboard from your existing tools', 'Depends on source data quality'],
  ['Software maintenance', 'Updates, fixes and small improvements for custom apps', 'Major features quoted'],
  ['Extra users or devices', 'Add to any plan', '']
];
export const CLIENT_RESPONSIBILITIES = [
  'Name one internal contact',
  'Give timely access and approvals',
  'Keep hardware and licenses in support (we will advise)',
  'Tell us about changes: new staff, new software, a new office',
  'Do not share the admin access we use'
];
export const ONBOARDING = [
  { t: 'Free Technology Assessment', d: 'We learn your setup and priorities before proposing a plan.' },
  { t: 'Proposal & agreement', d: 'Plan, scope, exclusions and price agreed in writing.' },
  { t: 'Access handover', d: 'Admin accounts created for us in your name; no shared passwords. You keep ownership of every account.' },
  { t: 'Discovery & documentation', d: 'Devices, accounts, network, vendors, licenses and renewal dates recorded.' },
  { t: 'First-month tidy-up', d: 'Backups running, updates current, sign-in and email delivery settings fixed, unused licenses removed.' },
  { t: 'Kickoff with your team', d: 'How to ask for help and what to expect.' },
  { t: 'First report', d: 'At the end of month one: what we did, what needs attention, what we recommend.' }
];
// Priority definitions are published; response figures are not (awaiting Josh).
export const RESPONSE_ROWS = [
  ['P1 Critical', 'The whole business cannot work: email down for everyone, internet down, main system unavailable'],
  ['P2 High', 'One team or a key system down; a workaround exists'],
  ['P3 Normal', 'One user affected; how-to questions'],
  ['P4 Request', 'New user, change request or planned work']
];

// ---- Industries (US-neutral copy) ------------------------------------------
export const INDUSTRIES = [
  {
    slug: 'healthcare-clinics', icon: 'healthcare', title: 'Medical & Dental Clinics',
    metaTitle: 'IT, Automation & Digital Marketing for Healthcare Clinics',
    metaDescription: 'Managed IT, booking systems, automation and digital marketing for private clinics and dental practices: reliable systems for staff, easy booking for patients.',
    summary: 'Reliable systems for clinical and front-desk staff, and an easier path from search to booked appointment.',
    challenges: ['Front-desk staff juggling phones, messages and paper forms', 'Shared logins and ad-hoc devices that nobody fully manages', 'Patients who cannot book online or get no reminder', 'Little visibility of which channels bring new patients'],
    help: [
      ['managed-it', 'Help desk, device management and Microsoft 365 or Google Workspace administration for clinical and admin staff, with tidy accounts and backups.'],
      ['ai-automation', 'Appointment reminders, intake-form routing and an assistant that answers routine patient questions and hands off to staff.'],
      ['digital-marketing', 'A clear website with online booking, an accurate Google Business Profile and reporting on new-patient inquiries.'],
      ['software-consulting', 'Integrations between your booking, billing and communication tools so information is entered once.']
    ],
    note: 'Patient information needs careful handling. We configure tools with sensible access controls and work alongside your own compliance and legal advisers; we do not provide legal advice or compliance certification.',
    noteTbc: 'whether we sign HIPAA Business Associate Agreements',
    services: ['booking-online-ordering', 'microsoft-365', 'ai-assistants-chatbots', 'local-seo-gbp']
  },
  {
    slug: 'professional-services', icon: 'professional', title: 'Professional Services',
    metaTitle: 'Managed IT & Technology for Professional Services Firms',
    metaDescription: 'Managed IT, document management, CRM, automation and marketing for law, accounting, consulting and advisory firms that run on knowledge and client trust.',
    summary: 'For law, accounting, consulting and advisory firms that run on documents, deadlines and client trust.',
    challenges: ['Client documents spread across inboxes, laptops and personal drives', 'New staff waiting days for accounts and equipment', 'Proposals and follow-ups tracked in people\'s heads', 'A website that undersells the expertise of the firm'],
    help: [
      ['managed-it', 'Managed IT with structured onboarding and offboarding, organized cloud files with permissions, and monitored backups.'],
      ['ai-automation', 'A CRM for referrals and pipeline, automated engagement-letter and invoice reminders, and an internal assistant for policies and templates.'],
      ['digital-marketing', 'A credible website and thought-leadership content that explains your services and captures qualified inquiries.'],
      ['software-consulting', 'Client portals for document exchange and a technology roadmap aligned with partner priorities.']
    ],
    services: ['cloud-document-management', 'crm-setup', 'ai-knowledge-base', 'custom-web-apps']
  },
  {
    slug: 'schools', icon: 'schools', title: 'Schools & Education',
    metaTitle: 'IT Support, Systems & Communication for Schools',
    metaDescription: 'IT support, device and account management, parent communication, enrollment websites and dashboards for independent schools and education providers.',
    summary: 'Dependable IT for staff and classrooms, and clearer communication with families.',
    challenges: ['Staff and student accounts created and removed by hand', 'Classroom devices and Wi-Fi that fail at the worst moment', 'Admissions inquiries that wait days for a reply', 'Fee, attendance and enrollment data spread across spreadsheets'],
    help: [
      ['managed-it', 'Help desk for staff, account lifecycle management for each term, device inventory and updates, and network and Wi-Fi management.'],
      ['ai-automation', 'Automated admissions follow-up, fee reminders and a dashboard of enrollment and attendance figures.'],
      ['digital-marketing', 'An admissions-focused website, open-day campaigns and an accurate presence in local search.'],
      ['software-consulting', 'Parent and staff portals and integration between your management system and communication tools.']
    ],
    note: 'Student information needs careful handling. We work within your school\'s own data policies and alongside your advisers; we do not provide legal advice or compliance certification.',
    services: ['microsoft-365', 'dashboards-internal-systems', 'business-process-automation', 'business-websites']
  },
  {
    slug: 'nonprofits', icon: 'nonprofits', title: 'Nonprofits & NGOs',
    metaTitle: 'Technology & Digital Support for Nonprofits and NGOs',
    metaDescription: 'Practical IT, CRM, automation, dashboards and digital campaigns for nonprofits, NGOs and faith-based organizations: more impact from limited budgets.',
    summary: 'Practical technology that stretches limited budgets further, for nonprofits, NGOs and faith-based organizations.',
    challenges: ['Volunteers and staff sharing accounts and devices', 'Supporter and donor records split across lists and spreadsheets', 'Reporting to funders that takes days to assemble', 'Campaigns that are hard to measure'],
    help: [
      ['managed-it', 'Managed IT and workspace administration sized for small teams and changing volunteer rosters.'],
      ['ai-automation', 'A supporter CRM, automated thank-you and follow-up messages, and dashboards for program and funder reporting.'],
      ['digital-marketing', 'A clear website with donation and sign-up journeys, email campaigns and social content.'],
      ['software-consulting', 'An honest technology roadmap that prioritizes spend and integrations between the tools you already use.']
    ],
    services: ['crm-setup', 'email-sms', 'dashboards-internal-systems', 'business-websites']
  },
  {
    slug: 'retail-hospitality', icon: 'retail', title: 'Restaurants, Retail & Hospitality',
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
  },
  {
    slug: 'home-services-contractors', icon: 'homeservices', title: 'Home Services & Contractors',
    metaTitle: 'Websites, Scheduling & IT for Home Services and Contractors',
    metaDescription: 'Websites, local search, online quotes and scheduling, automated follow-up and dependable office IT for contractors and home-services businesses.',
    summary: 'For contractors, trades and home-services companies that win work by phone, text and local search.',
    challenges: ['Calls and texts missed while the team is on a job', 'Quotes and follow-ups tracked on paper or in one person\'s phone', 'A website and Google profile that do not show your service area or reviews clearly', 'Office computers, email and shared files nobody looks after'],
    help: [
      ['digital-marketing', 'A fast website with clear services and service areas, an accurate Google Business Profile, a simple review-request routine and local search ads where they make sense.'],
      ['ai-automation', 'Automatic replies to missed calls and web inquiries, quote follow-up reminders and a simple job pipeline so leads do not go cold.'],
      ['managed-it', 'Microsoft 365 or Google Workspace for the office, shared files your crew can reach from a phone, and backups for estimates and job records.'],
      ['software-consulting', 'Connections between your scheduling, invoicing and accounting tools so job details are entered once.']
    ],
    services: ['business-websites', 'local-seo-gbp', 'booking-online-ordering', 'business-process-automation']
  },
  {
    slug: 'salons-spas', icon: 'salon', title: 'Salons, Barbers & Spas',
    metaTitle: 'Online Booking, Marketing & IT for Salons, Barbers and Spas',
    metaDescription: 'Online booking, reminders, review requests, local search and social media for salons, barbershops, spas and beauty businesses.',
    summary: 'Online booking, reminders and repeat visits for salons, barbershops, spas and beauty businesses.',
    challenges: ['Appointments booked by phone and direct message, then double-booked', 'No-shows with no reminder sent', 'Clients who visit once and are never invited back', 'Social media that takes hours and is hard to measure'],
    help: [
      ['digital-marketing', 'A website with online booking, an up-to-date Google Business Profile and a manageable social media plan.'],
      ['ai-automation', 'Appointment reminders, rebooking prompts, review requests after a visit and an assistant that answers common questions.'],
      ['managed-it', 'Support for front-desk devices, Wi-Fi and the accounts your team uses every day.'],
      ['software-consulting', 'Advice on choosing or connecting booking, point-of-sale and email tools so client details live in one place.']
    ],
    services: ['booking-online-ordering', 'local-seo-gbp', 'social-media', 'email-sms']
  },
  {
    slug: 'auto-services', icon: 'auto', title: 'Auto Repair & Services',
    metaTitle: 'Websites, Booking & IT for Auto Repair and Auto Services',
    metaDescription: 'Websites, online appointment requests, service reminders, local search and office IT for auto repair shops, detailers and auto-service businesses.',
    summary: 'For repair shops, detailers and auto-service businesses that run on appointments, estimates and repeat customers.',
    challenges: ['Phones ringing while technicians are busy in the bay', 'Service reminders that depend on someone remembering', 'Estimates and approvals passed around by phone', 'Front-office computers and shop software that nobody maintains'],
    help: [
      ['digital-marketing', 'A clear website with services and hours, online appointment requests and an accurate local search presence.'],
      ['ai-automation', 'Text and email service reminders, estimate follow-ups and review requests after each job.'],
      ['managed-it', 'Front-office and shop computers kept updated and backed up, business email and Wi-Fi looked after.'],
      ['software-consulting', 'Connections between your shop-management, accounting and messaging tools.']
    ],
    services: ['business-websites', 'booking-online-ordering', 'email-sms', 'local-seo-gbp']
  },
  {
    slug: 'fitness-studios', icon: 'fitness', title: 'Fitness Studios & Gyms',
    metaTitle: 'Websites, Booking & Automation for Fitness Studios and Gyms',
    metaDescription: 'Class booking, membership sign-up, automated follow-up, local search and social media for fitness studios, gyms and personal trainers.',
    summary: 'Class booking, membership sign-ups and member follow-up for studios, gyms and trainers.',
    challenges: ['Trial sign-ups that never hear back', 'Class schedules kept up to date in several places', 'Members who drift away without anyone noticing', 'Front-desk tablets, Wi-Fi and accounts that keep breaking'],
    help: [
      ['digital-marketing', 'A website with your schedule, pricing questions answered and an easy trial sign-up, plus local search and social content.'],
      ['ai-automation', 'Automated trial follow-up, class reminders and check-ins with members who have not visited in a while.'],
      ['managed-it', 'Support for front-desk devices, Wi-Fi and staff accounts.'],
      ['software-consulting', 'Advice on choosing and connecting booking, membership and payment tools.']
    ],
    services: ['business-websites', 'booking-online-ordering', 'email-sms', 'social-media']
  }
];
export const industryBySlug = Object.fromEntries(INDUSTRIES.map(i => [i.slug, i]));

// Ghana-view-only industries (legacy data, kept at their URLs).
export const GH_INDUSTRIES = LEGACY_INDUSTRIES.filter(i => ['real-estate', 'diaspora-property'].includes(i.slug));

// ---- Engagement model -------------------------------------------------------
export const JOURNEY = [
  { t: 'Consultation', d: 'A conversation about your goals, current setup and constraints. No obligation and no sales script.' },
  { t: 'Assessment', d: 'We review your systems, accounts, devices, workflows and marketing, depending on what you asked us to look at.' },
  { t: 'Roadmap', d: 'A prioritized list of recommendations, separated into quick wins, projects and ongoing services.' },
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
  '/industries/churches-ministries/': '/industries/nonprofits/',
  '/free-audit/': '/technology-assessment/',
  '/services/seo-programme/': '/services/seo-program/'
};
