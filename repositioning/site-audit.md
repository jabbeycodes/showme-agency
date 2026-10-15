# ShowMe Digital Agency — Site & Brand Audit vs. Josh's Repositioning Brief (2026-10-15)

**Scope:** https://agency.showmeworld.app (live, `main` @ 7d0d751, GHS prices shown) and the preview https://showme-agency-preview.codeproject1111.workers.dev (branch `us-pricing` @ 852b0ed, prices hidden, US default). All file:line references are on `us-pricing` @ 852b0ed. Phase 1 only: no code was changed and nothing was deployed.
**Brief:** `repositioning/master-prompt-2026-10-15.md`. ShowMe should read as a premium, full-service **technology partner** with five pillars (A Managed IT & Infrastructure · B Cybersecurity · C Digital Marketing & Brand · D AI, Automation & BI · E Software & Consulting). The flagship is **"Your Complete IT Department."** Visitors are US by default; Ghana content appears only in the Ghana view.
**Screenshots:** `repositioning/audit-shots/` (home desktop/mobile, Work, an industry page).

---

## Executive summary — the 10 biggest issues

1. **Wrong positioning.** Every page says "Ghana-focused web, marketing and WhatsApp agency" ("Build. Grow. Automate.", "Built for ambitious businesses across Ghana"). Nothing says "technology partner", and managed IT and cybersecurity do not exist as offers.
2. **The two pillars that should lead are missing.** Managed IT (help desk, endpoints, network, backup/DR, cloud) and Cybersecurity (risk assessment, MFA/IAM, email security, awareness training) have **no pages at all**. "IT Consulting & Staff Training" and "Microsoft 365" are the only IT services. The flagship "Complete IT Department" offer does not exist.
3. **US visitors see Ghana everywhere.** All 61 of 61 pages contain Ghana/Accra/MoMo/cedi/diaspora wording, including the footer, Organization JSON-LD, titles ("…Digital Solutions in Ghana"), the privacy law (Ghana DPA Act 843) and the hero illustration (it shows **₵ cedi symbols**). About 150 source lines need region handling (appendix A).
4. **The look reads small-agency and consumer, not corporate-premium.** It uses a dark theme, all-caps Anton display type, coral/mint/gold accents and a flat cartoon hero illustration. Most other imagery is AI-rendered interiors. There is no real technology imagery and no leadership or team photos beyond the founder.
5. **Trust proof is thin, and some of it is self-referential.** "Work" lists *hypothetical* solution types ("Proven systems, built by our team") and offers "This website" as its own proof. There are no case studies, logos, testimonials, certifications, partner statuses, SLAs, security practices or named delivery team. The only proof stats are 7+ years and 50+ businesses.
6. **Risky claims.** Pending wording items: "proven" in 8 source lines, "high-converting" in 6, and the "Live in 7 days or month 1 is free" guarantee shown without its Growth-retainer qualifier in 8+ places. "Proof, not promises" also sits next to unevidenced claims.
7. **The information architecture fits a small agency.** There are six "divisions" with 31 thin service pages, mixing Ghana-specific consumer offers (WhatsApp ordering, MoMo e-commerce, event/wedding and church pages) with B2B. There is no solutions hub, no pillar pages, no engagement-model page and no leadership page.
8. **Weak conversion path for B2B tech buyers.** The primary CTA is a "free digital audit" of a *website* (the automated scanner only checks websites). "Book a free call" opens WhatsApp. There is no consultation booking, assessment offer, scheduler or CRM. The header shows "FREE AUDIT" twice.
9. **Legal and trust pages are built for Ghana.** Privacy cites Ghana's Data Protection Act; Terms cite the Ghana Electronic Transactions Act and MoMo. There is no US entity statement, no security/data-handling page and no service-agreement outline. The public contact email is `josh@`, not `info@showmeworld.app`.
10. **Security hygiene and accessibility debt, which a cybersecurity firm will be judged on.** The live site sends **no HSTS, CSP, Referrer-Policy, Permissions-Policy or X-Frame-Options** (only `nosniff`) and has no `/.well-known/security.txt`. White-on-coral 12px uppercase buttons have 3.1:1 contrast (fails WCAG AA). Three Google Font families block rendering. Performance is otherwise good: a static site with modest page weight.

---
## 1. Positioning: current vs. brief

| | Current (live + preview) | Brief (target) |
|---|---|---|
| Identity | "Your digital business partner", "Build. Grow. Automate." (`scripts/data.mjs:15-16`) | Premium technology & digital-transformation partner: "Your Business. Our Technology Expertise. Unlimited Possibilities." |
| Hero | "For 7+ years… 50+ businesses across Ghana and abroad…"; illustration with ₵ symbols | "Technology That Protects Your Business. Solutions That Power Its Growth." + "Book a Technology Consultation" / "Explore Our Solutions" |
| Offer structure | 6 "divisions": Web & Commerce, Growth, Brand, Business Technology, AI & Automation, Software (31 services) | 5 pillars A–E + flagship managed-IT monthly packages |
| Lead offer | Growth retainer (ads + landing page + WhatsApp leads) and a free website audit | "Your Complete IT Department" + technology consultation/assessment |
| Market | "Built for ambitious businesses across Ghana"; diaspora US/UK/CA as secondary | US default (no Ghana/Accra/Africa); Ghana view for Ghana visitors; international |
| Buyers named | real estate, diaspora property, clinics, schools, restaurants, hospitality, churches, fashion boutiques, events/weddings, professional services | startups/SMEs, healthcare clinics, professional services, schools, nonprofits/NGOs, retail & hospitality, corporates |
| Tone | Friendly, WhatsApp-first, "no juggling freelancers", consumer-ish | Corporate, calm, precise, security-conscious |

**Gap by pillar** (what exists today → what is missing):

- **A. Managed IT & Infrastructure:** `microsoft-365`, `cloud-document-management` and `it-consulting-training` exist. **Missing:** help desk/user support, Google Workspace admin, endpoint/device management, network & Wi-Fi, backup & disaster recovery, cloud migration, IT asset/vendor management, onboarding/offboarding, and the flagship monthly package.
- **B. Cybersecurity:** **nothing exists.** Missing: security risk assessment, MFA rollout, identity & access management, email security (SPF/DKIM/DMARC, phishing filtering), security awareness training, vulnerability assessment, compliance readiness (e.g. HIPAA-readiness for clinics, phrased only as "readiness support"), incident-response planning.
- **C. Digital Marketing & Brand:** well covered (websites, SEO, GBP, social, ads, brand, content, email, analytics, growth retainer). Missing as named services: CRO and lead generation. Several pages are Ghana-coded (MoMo checkout, photography in Accra).
- **D. AI, Automation & BI:** WhatsApp AI assistant, automation, audit, AI knowledge base and dashboards exist. Missing: AI agents/chatbots for web/Teams/Slack (not WhatsApp-only) and BI/reporting as a pillar service. WhatsApp-centric framing is weak for US buyers.
- **E. Software & Consulting:** web apps, mobile apps, dashboards and integrations/SaaS exist. Missing: digital-transformation consulting, technology roadmaps/vCIO-style advisory (wording to be confirmed, see Q list), and application maintenance/support.

---

## 2. Site-wide findings

### 2.1 Information architecture & navigation
- Top nav: Services ▾ (mega menu of 31 links in 6 columns) · Industries · Pricing · Work · About · Contact · "FREE AUDIT" (text link) + "FREE AUDIT" (button). **The duplicate CTA looks unpolished** (`scripts/render.mjs:195` desktop-cta + nav-links CTA).
- The mega menu is a long flat list with no pillar landing pages, so buyers cannot browse by problem ("secure my business", "fix our IT").
- Footer: tagline "Your digital business partner…US-led, with our team on the ground in Accra, Ghana…", `josh@showmeworld.app`, "Work & results" (there are no results), "Partners & careers".
- Missing pages a tech-partner buyer expects: Solutions hub, pillar pages, Managed Services/IT department, Engagement models, Security & data handling, Leadership, Consultation booking, Careers (proper), Accessibility statement.
- 61 pages in total. Many are thin (service pages share one template: problem → included → who for → outcomes → process → pricing → FAQ, around 300–500 words).

### 2.2 Copy
- **Generic or agency phrases:** "Build. Grow. Automate.", "Everything your business needs to move forward digitally", "One partner, six divisions", "no juggling freelancers", "Three things, done properly".
- **Small-business signals:** "Start small", "a reply within one business day", WhatsApp as the primary channel, "Prefer not to say" budget, "Book a free call with Josh" (founder-as-only-person).
- **Claims without evidence:** "Proof, not promises" (about); "Proven systems" (work H1); "high-converting"; "Designed to deliver: …" outcomes.
- **Inconsistent in prices-hidden mode:** the about page still says "Our standards…: **publish prices**, show working previews…" (`scripts/pages.mjs:1237`). The preview banner still says "proposed prices".
- **US-unclear terms:** "MoMo", "Telecel Cash", "cedis", "programme", "colour", "dental/tutoring" (British/Ghanaian spelling and terms; pick US English for the US default).

### 2.3 Visual design, typography, imagery
- Dark navy theme with coral/mint/gold accents, gradient progress bar, pill badges, emoji-like ticks: reads as a startup/creator brand, not Accenture/CDW-style corporate.
- Typography: **Anton** (condensed, all-caps display) for H1s/brand, Archivo + Public Sans for body. Three families. All-caps H1s ("PRIVATE HEALTHCARE & DENTAL") feel loud and reduce readability.
- Imagery: the home hero is a flat illustration with **₵ cedi signs** and a phone (`static/assets/hero-owner*.webp`, alt "A Ghanaian business owner…"). Division, industry and article images (`assets/img/*`, 104 files) are mostly AI-rendered interiors and illustrations. There are **no real technology visuals** (dashboards, network/security operations, devices, team at work). The founder photo is the only real person.
- Motion: reveal-on-scroll everywhere plus a scroll progress bar. The brief asks for subtle motion; the current motion is acceptable but the effect is busy.
- The OG image is "Build. Grow. Automate." branding (`static/og-image.png`) and needs replacing.

### 2.4 Trust signals
Present: 7+ years, 50+ businesses, founder name and photo, written guarantees, preview-before-final-payment, ownership of assets, terms/privacy.
Missing (see §5 for the collection list): leadership/team profiles, who delivers IT/cyber, certifications, vendor partner statuses, case studies, client logos, testimonials, security practices/data handling, service agreement/SLA outline, support process (hours, channels, escalation), insurance, entity details (US company, address policy).

### 2.5 CTAs, forms & lead journey
- CTAs: "Get your free digital audit", "Book a free call" (opens WhatsApp `wa.me` with prefilled text), "Request pricing", "Get a quote on WhatsApp", "Ask on WhatsApp". There is **no calendar booking**; WhatsApp-first is unusual for US B2B buyers.
- Forms (`scripts/pages.mjs:20-140` `leadForm`): name, business, email, phone, services (6 old divisions), challenge, "What are you looking for?", timeline, need, website URL, how found, time-waster, message. Fields map to the old divisions. There are no company size, number of users/devices, current IT setup or security concerns fields, which matter for managed-IT qualification.
- Backend: `/api/lead` → KV + founder alert + automated **website** audit (`worker/src/audit/*`). The scanner checks websites only (PSI, SEO, GBP); it cannot assess IT or security posture. The public email/WhatsApp fallback in `static/site.js:11` is `josh@` (rule says `info@`).
- No CRM, no booking tool, no nurture beyond the optional single follow-up email (`FOLLOWUP` var).

### 2.6 SEO, meta & schema
- Titles and meta are Ghana-targeted: "Industries We Serve in Ghana", "… — Digital Solutions in Ghana" (all 10 industry pages), "Business Website Design in Accra, Ghana", 6 insights titles with "Ghana/Ghanaian".
- Organization JSON-LD (`scripts/render.mjs:111` `orgLd`) lists location **Accra, GH** and `areaServed` Ghana/US/UK/Canada. Service JSON-LD has no `offers` (fine with hidden prices). FAQPage JSON-LD repeats Ghana answers.
- Keyword focus is web/marketing; there is zero coverage for "managed IT services", "IT support for small business", "cybersecurity assessment", "MFA setup", etc.
- Good: single canonical URL per page, sitemap, breadcrumbs JSON-LD, unique titles/descriptions (enforced by `check.mjs`), clean 301 handling in the worker.

### 2.7 Accessibility
- Good: skip link, labelled form fields, all 51 images have alt text, one H1 per page, focus styles, reduced-motion respected.
- Issues:
  - White on coral `#f2654b` buttons = **3.12:1** at 12px/800 uppercase (fails AA 4.5:1).
  - Long all-caps headings and letter-spaced 10–12px uppercase labels hurt readability.
  - The FAQ accordion and mega menu need keyboard/screen-reader re-test after the redesign.
  - "Prefer not to say" select defaults are fine.

### 2.8 Performance & mobile
- Static HTML (index around 36 KB), CSS 40 KB, JS 14 KB; worker-served with long-cache versioned assets. Good baseline.
- Issues:
  - Render-blocking Google Fonts CSS (3 families).
  - Hero WebP up to 254 KB.
  - Industry JPGs of 150–205 KB (1200w).
  - Reveal animations delay content paint on mobile.
  - Lighthouse/PSI was not run in this phase (no PSI key); add it to the QA phase.
- Mobile: the sticky bottom CTA bar (WhatsApp/Free audit) is fine functionally, but it is WhatsApp-led. The hero illustration is pushed below the fold on 390px.

### 2.8b Security posture of the site itself
- Live response headers (checked 2026-10-15) contain only `x-content-type-options: nosniff`. HSTS, Content-Security-Policy, Referrer-Policy, Permissions-Policy and frame protection are missing, so public header scanners grade the site poorly. Prospective cyber clients run exactly these checks.
- `/.well-known/security.txt` returns 404 (no vulnerability-disclosure contact).
- Positive: no third-party trackers; the form has a honeypot; admin is behind a password with brute-force lockout; leads are stored server-side only.

### 2.9 Legal
- Privacy (`scripts/pages.mjs:1506-1608`): framed on **Ghana's Data Protection Act 2012 (Act 843)**. It says "We do not use advertising or tracking cookies" (`:1539`), which is true today (no Facebook Pixel or GA in repo or live). It is US-led but makes no US/state-privacy statement.
- Terms (`scripts/pages.mjs:1609-1720`): Ghana Electronic Transactions Act (`:1705`), MoMo methods, cedi/USD currency. Governing law is "stated in your proposal" (`:1711`, good). There are no managed-services or security-services terms (scope boundaries, client responsibilities, no-guarantee-of-breach-prevention language).

---

## 3. Page-by-page

| Page | What looks inexperienced / small / unclear | Keep | Direction |
|---|---|---|---|
| **Home** `/` | Cartoon hero with ₵; "Build. Grow. Automate."; Ghana-first copy; "Live in 7 days or month 1 is free" pill without qualifier (`pages.mjs:208`); Growth retainer as the core offer; six-division wall of links; "Built for ambitious businesses across Ghana"; "Our proven process" | 7+ yrs / 50+ businesses, guarantees concept, FAQ | New hero per brief; 5 pillar cards; flagship IT-department block; industries; engagement model; leadership; consultation CTA |
| **Services hub** `/services/` | 31 equal-weight cards across 6 divisions; no prioritisation | URLs | Becomes `/solutions/` hub (pillars); `/services/` 301 or kept as an A–Z index |
| **Service pages** ×31 | Thin, same template; WhatsApp CTAs; titles Ghana-coded (e.g. `business-websites` "…in Accra, Ghana", `ecommerce-momo`, `whatsapp-ordering-booking`, `photography-video` "half-day shoot in Accra") | Problem/included/outcomes structure | Re-parent under pillars; rewrite to B2B tone; add deliverables/boundaries; Ghana-only services visible only in Ghana view |
| **Growth retainer** | "high-converting" (`data.mjs:240,243`); guarantee; "proven onboarding" (`data.mjs:268`) | Offer itself (pillar C package) | Keep as "Managed Growth" package inside pillar C |
| **Industries hub + 10 pages** | "Digital Solutions in Ghana" titles; consumer sectors (churches, weddings, boutiques, diaspora property); AI-rendered photos; all-caps H1s | healthcare, schools, professional services, hospitality content | Consolidate to the brief's 6–7 industries (§ roadmap) |
| **Pricing** `/pricing/` (preview) | Now "How pricing works" + bundles (Launch/Grow/Scale are web-marketing bundles, not tech packages); "Three proven combinations" (`pages.mjs:558`) | Fixed-quote process, payment terms, risk reversal | Becomes "Engagement models & pricing approach"; managed-IT tiers described without prices |
| **Process** `/process/` | Web-project process only; "Launch in 7 days" step without qualifier (`pages.mjs:925`) | 7-phase structure, timelines | Engagement-model page: Assess → Roadmap → Onboard → Operate → Review (+ project track) |
| **Work** `/work/` | H1 "Proven systems, built by our team." (`pages.mjs:1056`); 4 *illustrative* solutions with "Designed to deliver"; "This website" as proof; "A proven process" (`:1081`) | Honest framing "solutions we deliver" | Rename to "Capabilities & demos" until real case studies exist; add placeholders clearly marked |
| **About** `/about/` | Founder-only; "ShowMe World ecosystem"; "Where we work" lists Kumasi/Takoradi/Tamale, MoMo, GHS; "Partners & careers" mentions specialists in Ghana; says "publish prices" | Founder profile, principles (ownership, plain English) | About + Leadership (real profiles only; placeholders marked); US view drops Ghana geography |
| **Free audit** `/free-audit/` | 6-point *website/marketing* check; not a technology assessment | Automated scan pipeline | Reframe as "Digital presence check" (pillar C) + new "Technology & security consultation" (manual) |
| **Contact** `/contact/` | WhatsApp-first; old 6-division "services" select; `josh@` email | Form + KV pipeline | Consultation booking (calendar) + qualified form (company size, users, current IT, priorities) |
| **FAQ** `/faq/` | 64 Ghana mentions; pricing/WhatsApp heavy | Structure | Rewrite per pillar; region variants |
| **Insights** ×6 + index | All Ghana topics ("…for Ghanaian businesses", MoMo, Local SEO Ghana) | Real guides (useful for Ghana view) | Ghana-view only; new US content plan (cyber basics, IT tips, AI demos) |
| **Privacy / Terms** | Ghana law framing; "no tracking cookies" vs future Pixel | Plain-English style | Region-appropriate legal text reviewed by counsel; managed-services terms |
| **404** | Fine | — | Restyle |

---

## 4. Pending wording items (still unchanged) — proposed fixes

| Item | Where (file:line @852b0ed) | Proposed fix (consistent with rules) |
|---|---|---|
| "proven" | `data.mjs:268` ("proven onboarding process"), `data.mjs:375` ("proven offer"), `pages.mjs:324` ("Our proven process"), `pages.mjs:558` and `:781` ("Three proven combinations"), `pages.mjs:1056` (Work H1 "Proven systems…"), `pages.mjs:1081` ("A proven process"), `prices.mjs:91` ("a proven offer") | Replace with verifiable wording: "a documented onboarding process", "an offer that already sells", "Our process", "Three ready-made combinations", Work H1 "What we build, and how", "One accountable team. A clear process." |
| "high-converting" | `data.mjs:240` (growth-retainer meta), `data.mjs:243`, `pages.mjs:276`, `:293`, `:522`, `:743` | "conversion-focused landing page" (describes intent, not a result) |
| "Live in 7 days" without the Growth-retainer qualifier | `pages.mjs:208` (home hero pill), `pages.mjs:259` and `:925` (home/process step "Launch in 7 days"), `data.mjs:40` `site.facts.guarantee` used unqualified at `pages.mjs:280, 297, 528, 617, 749, 839` and `data.mjs:267`; `data.mjs:254`; `prices.mjs:90, 97` (Grow bundle context). Qualifier present at `pages.mjs:148, 897`, `data.mjs:1128`, terms `pages.mjs:1663` | Put the qualifier inside the fact itself: "Growth retainer: landing page, lead system and reporting live within 7 days of onboarding — or month 1 of the retainer is free." In the repositioned site, move it off the home hero into the pillar C package page only (it is not a tech-partner headline). |
| Privacy notice vs Facebook Pixel | `pages.mjs:1539` "We do not use advertising or tracking cookies on this website." No Pixel in repo or live today | Keep the sentence while no Pixel exists. **Before** any Pixel/GA4/ads tag is added: rewrite the cookies section (what, why, retention, opt-out), add a consent banner for the Ghana and EU/UK views, and update the US view for state privacy notices. Do not add the Pixel first. |

---

## 5. Missing proof to collect (nothing below may be invented)

| Proof | Why it matters | What to collect from Josh |
|---|---|---|
| Leadership profiles | Brief requires leadership; today only the founder | Names, roles, photos, short bios, LinkedIn URLs, written consent to publish, for each real leader |
| **Who delivers IT & cybersecurity** | Required before any managed-IT/cyber claim | In-house staff vs subcontractor/MSP partner; their experience; hours of coverage; locations (for data-handling disclosure) |
| Certifications | Credibility (only if real) | Copies or verification links of any held (e.g. Microsoft, Google, CompTIA, CISSP, ISO); **none to be claimed until verified** |
| Partner statuses | Vendor programmes | Proof of any Microsoft/Google Workspace/AWS/HubSpot/etc. partner status; logo usage rules |
| Case studies | The Work page is illustrative only | 3–5 real projects: client consent, problem, what was done, measurable outcome with source, dates |
| Client logos | Social proof | Written permission per logo |
| Testimonials | Social proof | Real quotes with name, title, company and written permission |
| Security practices | Cyber buyers ask first | Password manager/MFA policy, access control to client systems, data storage locations, background checks, NDAs, incident handling, insurance (cyber/E&O) |
| Service agreement & SLAs | Flagship package needs boundaries | Support hours, channels, target response times (only what can be met), escalation, exclusions, onboarding steps, termination |
| Tools stack | Capability demos | RMM/PSA, backup, endpoint security, M365/Workspace admin tools actually licensed |
| Company/entity details | US trust and legal pages | Legal entity name, state, registered address policy, EIN not needed publicly; Ghana entity (if any) |
| Capability demos | "Show, not tell" | Screenshots/short videos of dashboards, automations and AI assistants (real or clearly labelled demo data) |

---
## Appendix A — Ghana/Accra/Africa/cedi/MoMo mentions US visitors currently see

The US default must show none of these. Search terms: Accra, Ghana, Ghanaian, Africa, cedi, GHS, GH₵, MoMo, Mobile Money, Telecel, MTN, AT Money, Kumasi, Takoradi, Tamale, diaspora, +233, Tema. The **₵ symbols inside the hero illustration** (`static/assets/hero-owner*.webp`) are an image, so text search cannot find them. A.1 lists the rendered pages and A.2 the source lines that produce them. Comment lines are excluded. WhatsApp itself uses the US number (+1 336 457 2361) and is not Ghana-specific, but WhatsApp-first CTAs read as Ghana/consumer to US B2B buyers (see §2.5).

### A.1 Rendered preview (prices hidden, US default): mentions per page (visible text + head/meta/JSON-LD)

All **61 of 61** pages contain at least one, because the footer, Organization JSON-LD and footer tagline appear on every page.

| Page | Total mentions | In `<head>` (title/meta/JSON-LD) |
|---|---|---|
| /faq/ | 64 | 31 |
| /pricing/ | 63 | 19 |
| /insights/accept-mobile-money-on-your-website/ | 59 | 19 |
| /services/ecommerce-momo/ | 53 | 33 |
| / | 47 | 16 |
| /industries/diaspora-property/ | 42 | 20 |
| /about/ | 39 | 10 |
| /insights/ | 37 | 19 |
| /services/whatsapp-ordering-booking/ | 34 | 20 |
| /insights/get-recommended-by-ai-assistants/ | 33 | 10 |
| /industries/fashion-retail/ | 31 | 15 |
| /insights/ai-search-visibility-for-ghana-businesses/ | 31 | 10 |
| /industries/ | 30 | 13 |
| /insights/whatsapp-automation-for-ghana-businesses/ | 30 | 10 |
| /services/business-websites/ | 29 | 18 |
| /industries/restaurants-caterers/ | 29 | 14 |
| /insights/local-seo-google-business-profile-ghana/ | 29 | 10 |
| /terms/ | 29 | 7 |
| /industries/churches-ministries/ | 28 | 14 |
| /work/ | 27 | 10 |
| /privacy/ | 27 | 10 |
| /services/booking-online-ordering/ | 25 | 13 |
| /services/photography-video/ | 25 | 12 |
| /services/growth-retainer/ | 25 | 10 |
| /services/website-care/ | 22 | 12 |
| /services/whatsapp-ai-assistant/ | 21 | 12 |
| /services/social-media/ | 21 | 12 |
| /services/seo-programme/ | 21 | 12 |
| /services/pitch-decks/ | 21 | 12 |
| /services/paid-ads/ | 21 | 12 |
| /services/mobile-apps/ | 21 | 12 |
| /services/microsoft-365/ | 21 | 12 |
| /services/marketing-collateral/ | 21 | 12 |
| /services/local-seo-gbp/ | 21 | 12 |
| /services/it-consulting-training/ | 21 | 12 |
| /services/integrations-saas/ | 21 | 12 |
| /services/email-sms/ | 21 | 12 |
| /services/dashboards-internal-systems/ | 21 | 12 |
| /services/custom-web-apps/ | 21 | 12 |
| /services/crm-setup/ | 21 | 12 |
| /services/content-marketing/ | 21 | 12 |
| /services/cloud-document-management/ | 21 | 12 |
| /services/business-process-automation/ | 21 | 12 |
| /services/brand-identity/ | 21 | 12 |
| /services/automation-audit/ | 21 | 12 |
| /services/analytics-reporting/ | 21 | 12 |
| /industries/real-estate/ | 20 | 11 |
| /industries/professional-services/ | 20 | 11 |
| /industries/private-schools/ | 20 | 11 |
| /industries/private-healthcare/ | 20 | 11 |
| /industries/hospitality-tourism/ | 20 | 11 |
| /industries/events-weddings/ | 20 | 11 |
| /contact/ | 20 | 7 |
| /services/ | 19 | 7 |
| /process/ | 18 | 7 |
| /insights/follow-up-every-whatsapp-lead/ | 18 | 5 |
| /services/landing-pages-funnels/ | 17 | 8 |
| /services/ai-search-visibility/ | 17 | 8 |
| /services/ai-knowledge-base/ | 17 | 8 |
| /free-audit/ | 16 | 7 |
| /404.html | 16 | 7 |

### A.2 Source lines (file:line @ us-pricing 852b0ed)

Region-neutral wording that still names Ghana in prices-hidden mode lives in `scripts/money.mjs:131-145` (`NEUTRAL`):
- `bill_methods` "…Mobile Money (Ghana)"
- `checkout_*` "Mobile Money checkout"
- `deposit_methods`
- `momo_links`
- `photo_where` "Accra, Ghana"
- `pay3` "Mobile Money in Ghana (MTN MoMo, Telecel Cash, AT Money)"
- `faq_usd`
- `faq_pay`

The Ghana-region values in `MONEY`/`WORDS` are only shown when prices are on and the visitor is in Ghana view.

#### scripts/data.mjs (74 lines)

| file:line | terms | context |
|---|---|---|
| scripts/data.mjs:28 | Accra, Ghana | … teamLocation: 'Accra, Ghana',… |
| scripts/data.mjs:29 | Accra, Ghana | … locationLine: 'US-led, with our team on the ground in Accra, Ghana',… |
| scripts/data.mjs:30 | Ghana, diaspora | … serviceArea: 'Serving businesses in Ghana and diaspora and international clients in the US,… |
| scripts/data.mjs:89 | Accra, Ghana | … metaTitle: 'Business Website Design in Accra, Ghana',… |
| scripts/data.mjs:91 | Ghana | …on: 'ShowMe builds fast, mobile-first business websites for Ghanaian companies — SEO-ready, easy to update and wire… |
| scripts/data.mjs:95 | Ghana | … 'Fast loading on Ghanaian mobile networks (lazy-loaded images, lean code… |
| scripts/data.mjs:118 | Mobile Money | …merce-momo', division: 'web-commerce', title: 'E-commerce & Mobile Money Checkout',… |
| scripts/data.mjs:119 | Mobile Money | … metaTitle: 'E-commerce Websites with Mobile Money & Card Checkout',… |
| scripts/data.mjs:120 | MoMo | … summary: 'Online stores that accept MoMo, Paystack and card, with WhatsApp reordering buil… |
| scripts/data.mjs:121 | Ghana, MTN, MoMo, Telecel | … metaDescription: 'Sell online in Ghana with a mobile-first store: MTN MoMo, Telecel Cash… |
| scripts/data.mjs:125 | MTN, MoMo, Telecel | … 'Checkout with MTN MoMo, Telecel Cash, Paystack and card',… |
| scripts/data.mjs:131 | MoMo | …CG brands taking repeat orders', 'Anyone who needs reliable MoMo and card payments'],… |
| scripts/data.mjs:141 | MTN, MoMo, Telecel | … { q: 'Which payment methods can you set up?', a: 'MTN MoMo, Telecel Cash, card and bank transfer via pr… |
| scripts/data.mjs:180 | MoMo | …ices — take appointments and orders 24/7 with reminders and MoMo payments.',… |
| scripts/data.mjs:186 | MoMo | … 'Optional deposits or payment via MoMo and card',… |
| scripts/data.mjs:199 | MoMo | …ts?', a: 'Yes. We can require a deposit or full payment via MoMo or card to reduce no-shows.' },… |
| scripts/data.mjs:209 | Ghana | … metaDescription: 'Website care plans for Ghanaian businesses: hosting, SSL, backups, security up… |
| scripts/data.mjs:276 | Ghana | …ption: 'Local SEO and Google Business Profile management in Ghana: optimise your profile, win reviews, fix citation… |
| scripts/data.mjs:306 | Ghana | … metaDescription: 'A complete SEO programme for Ghanaian businesses: technical audits, on-page optimisa… |
| scripts/data.mjs:365 | Ghana | … 'Google and Meta (Facebook & Instagram) ads management for Ghanaian businesses — campaigns built around enquiries … |
| scripts/data.mjs:395 | Ghana | … metaDescription: 'Social media management for Ghanaian businesses: content calendars, on-brand post a… |
| scripts/data.mjs:425 | Ghana | … metaDescription: 'Content marketing for Ghanaian businesses: helpful articles, FAQs and structu… |
| scripts/data.mjs:454 | Ghana | … metaDescription: 'Email and SMS marketing for Ghanaian businesses: build your list, send campaigns an… |
| scripts/data.mjs:483 | Ghana | … metaDescription: 'Analytics and reporting for Ghanaian businesses: GA4 and conversion tracking set up… |
| scripts/data.mjs:514 | Ghana | … metaDescription: 'Brand identity design for Ghanaian businesses: logo, colour palette, typography a… |
| scripts/data.mjs:543 | Ghana | …es, business stationery and marketing collateral design for Ghanaian businesses — professional documents that win t… |
| scripts/data.mjs:572 | Ghana | … metaDescription: 'Business photography and video for Ghanaian companies: product, team and location shoots p… |
| scripts/data.mjs:601 | Ghana | … metaDescription: 'Pitch deck and presentation design for Ghanaian founders and businesses — clear structure, str… |
| scripts/data.mjs:632 | Ghana | … metaDescription: 'Microsoft 365 setup for Ghanaian businesses: professional email on your own dom… |
| scripts/data.mjs:661 | Ghana | …metaDescription: 'Cloud storage and document management for Ghanaian businesses: organised, secure, shared files wi… |
| scripts/data.mjs:690 | Ghana | … metaDescription: 'CRM setup for Ghanaian businesses: capture leads, track conversations… |
| scripts/data.mjs:719 | Ghana | … metaDescription: 'IT consulting and staff training for Ghanaian businesses: choose the right tools, tighten se… |
| scripts/data.mjs:750 | Ghana | … metaDescription: 'A WhatsApp AI assistant for Ghanaian businesses: answers FAQs 24/7, qualifies leads… |
| scripts/data.mjs:777 | MoMo | … metaTitle: 'WhatsApp Ordering & Booking with MoMo Payment Links',… |
| scripts/data.mjs:778 | MoMo | …ry: 'Let customers order or book on WhatsApp and pay with a MoMo link — no app required.',… |
| scripts/data.mjs:779 | Ghana, MoMo | … metaDescription: 'WhatsApp ordering and booking flows with MoMo payment links for Ghanaian businesses: customers … |
| scripts/data.mjs:783 | MoMo | … 'MoMo payment links so customers pay in chat',… |
| scripts/data.mjs:798 | MoMo | … { q: 'How do customers pay?', a: 'With a MoMo payment link (and card where set up) sent right i… |
| scripts/data.mjs:808 | Ghana | … metaDescription: 'Business process automation for Ghanaian companies using tools like Make and n8n: autom… |
| scripts/data.mjs:838 | Ghana | … metaDescription: 'An automation audit for Ghanaian businesses: we map your repetitive workflows, … |
| scripts/data.mjs:899 | Ghana | …ription: 'Custom web application and portal development for Ghanaian businesses: customer and staff portals, direct… |
| scripts/data.mjs:928 | Ghana | … metaDescription: 'Mobile app development for Ghanaian businesses: customer and staff apps for iOS an… |
| scripts/data.mjs:957 | Ghana | …etaDescription: 'Custom dashboards and internal systems for Ghanaian businesses: connect your data into clear dashb… |
| scripts/data.mjs:986 | Ghana | … metaDescription: 'Integrations and SaaS development for Ghanaian businesses and founders: connect your tools so… |
| scripts/data.mjs:1020 | Ghana | … metaDescription: 'Digital marketing and websites for Ghanaian real estate developers and agents — qualified … |
| scripts/data.mjs:1028 | Diaspora, diaspora | … slug: 'diaspora-property', title: 'Diaspora Property Buyers',… |
| scripts/data.mjs:1029 | diaspora | … metaDescription: 'Reach diaspora property buyers in the UK, US and Canada: trust-b… |
| scripts/data.mjs:1032 | diaspora | … whatWeBuild: ['A trust-building site aimed at diaspora buyers', 'Enquiry capture that works across time … |
| scripts/data.mjs:1033 | diaspora | … starter: 'A diaspora-focused landing page and lead system, paired with… |
| scripts/data.mjs:1035 | cedi, diaspora | …e US, UK and Canada. Developers and agents can be quoted in cedis; diaspora-facing businesses abroad can be quoted… |
| scripts/data.mjs:1039 | Ghana | …g and marketing for private clinics and dental practices in Ghana — turn local demand into booked appointments with… |
| scripts/data.mjs:1048 | Ghana | …sions marketing for private schools and tutoring centres in Ghana — a steady enrolment pipeline with clear follow-u… |
| scripts/data.mjs:1057 | Ghana, MoMo | … metaDescription: 'Digital tools for Ghanaian restaurants and caterers: WhatsApp ordering wi… |
| scripts/data.mjs:1060 | MoMo | … whatWeBuild: ['WhatsApp ordering with MoMo payment links', 'An online menu and booking flow'… |
| scripts/data.mjs:1061 | MoMo | … starter: 'A WhatsApp ordering flow with MoMo payments, plus social media to keep orders coming… |
| scripts/data.mjs:1066 | Ghana | … metaDescription: 'Websites and direct-booking tools for Ghanaian hotels, guesthouses and tour operators — win d… |
| scripts/data.mjs:1075 | Ghana, MoMo | …ages and communication tools for churches and ministries in Ghana — MoMo giving, event info and easy ways to stay c… |
| scripts/data.mjs:1078 | MoMo | …hatWeBuild: ['A church website with events and sermons', 'A MoMo giving page for easy, trackable giving', 'Broadca… |
| scripts/data.mjs:1079 | MoMo | … starter: 'A church website with a MoMo giving page and a simple way to reach members.',… |
| scripts/data.mjs:1084 | Ghana, MoMo | … metaDescription: 'E-commerce and social selling for Ghanaian fashion and retail boutiques: mobile-first sto… |
| scripts/data.mjs:1087 | MoMo | … whatWeBuild: ['A mobile-first store with MoMo and card checkout', 'WhatsApp reordering for loya… |
| scripts/data.mjs:1088 | MoMo | … starter: 'A mobile-first store with MoMo checkout, plus social media and photography to dr… |
| scripts/data.mjs:1093 | Ghana | …etaDescription: 'Websites, portfolios and booking tools for Ghanaian event planners and wedding vendors — showcase … |
| scripts/data.mjs:1102 | Ghana | … metaDescription: 'Digital marketing and systems for Ghanaian law firms, accountants and consultants — a cre… |
| scripts/data.mjs:1116 | Accra, Ghana, diaspora | …ith?', a: 'ShowMe is US-led, with our team on the ground in Accra, Ghana. Our founder, ' + site.founder + ', is bas… |
| scripts/data.mjs:1117 | Ghana | …elped ' + site.facts.businessesHelped + ' businesses across Ghana and abroad with their digital needs, and we lead … |
| scripts/data.mjs:1118 | Accra, Ghana, diaspora | …deo calls and shared workspaces, for businesses anywhere in Ghana and for diaspora and international clients in the… |
| scripts/data.mjs:1133 | MTN, MoMo, Telecel | … { q: 'Which payment methods can my store accept?', a: 'MTN MoMo, Telecel Cash, card and bank transfer via pr… |
| scripts/data.mjs:1160 | Ghana | … title: 'How to get your Ghanaian business recommended by AI assistants',… |
| scripts/data.mjs:1165 | Ghana | … title: 'AI search visibility for Ghanaian businesses: a plain-English guide',… |
| scripts/data.mjs:1170 | Ghana | … title: 'Local SEO in Ghana: getting the most from your Google Business Profi… |
| scripts/data.mjs:1175 | Ghana, Mobile Money | … title: 'How to accept Mobile Money payments on your website in Ghana',… |
| scripts/data.mjs:1176 | MoMo | … excerpt: 'A plain-English guide to taking MoMo, card and bank payments online: your options, wha… |
| scripts/data.mjs:1185 | Ghana | … title: 'WhatsApp automation for Ghanaian businesses: what to automate and how',… |

#### scripts/pages.mjs (52 lines)

| file:line | terms | context |
|---|---|---|
| scripts/pages.mjs:182 | Accra, Ghana, diaspora | …-led digital agency with its delivery team on the ground in Accra, Ghana, with ' + site.facts.experience + ' of exp… |
| scripts/pages.mjs:187 | Accra | … address: { '@type': 'PostalAddress', addressLocality: 'Accra', addressCountry: 'GH' },… |
| scripts/pages.mjs:199 | Ghana | …elped ${esc(site.facts.businessesHelped)} businesses across Ghana and abroad use technology to work smarter, reach … |
| scripts/pages.mjs:207 | Accra | …span class="dot" aria-hidden="true"></span>US-led · team in Accra</span>… |
| scripts/pages.mjs:214 | Ghana | …dth: 1000px) 100vw, 600px" width="1200" height="900" alt="A Ghanaian business owner managing advertising and custom… |
| scripts/pages.mjs:225 | MoMo | …oftware</h3><p>Fast, mobile-first sites, online stores with MoMo, booking systems and custom apps — built to conve… |
| scripts/pages.mjs:245 | Ghana | … <h2 data-reveal>Built for ambitious businesses across Ghana.</h2>… |
| scripts/pages.mjs:330 | Accra | …} businesses helped. US-led, with our team on the ground in Accra.</strong>… |
| scripts/pages.mjs:331 | Accra | …ys your direct point of contact, while our delivery team in Accra builds, launches and supports your systems throug… |
| scripts/pages.mjs:351 | Accra | … description: 'US-led digital agency with a team in Accra: ' + site.facts.experience + ' of experience, ' +… |
| scripts/pages.mjs:427 | Ghana | … title: 'Industries We Serve in Ghana / ' + site.name,… |
| scripts/pages.mjs:428 | Ghana | …hes, fashion, events, professional services and more across Ghana.',… |
| scripts/pages.mjs:442 | Accra | …sApp and AI usage fees, printing and travel outside Greater Accra. We list any that apply in your proposal.' },… |
| scripts/pages.mjs:600 | GHS, Ghana, cedi | …</strong> quotes are in US dollars (USD) or, for clients in Ghana, Ghana cedis (GHS).</span></li>… |
| scripts/pages.mjs:669 | Accra | …sApp and AI usage fees, printing and travel outside Greater Accra. We list any that apply in your proposal.' },… |
| scripts/pages.mjs:892 | Ghana | … ['Review', '3–5 days', 'We test on real phones and Ghanaian networks, fix what we find and walk you throug… |
| scripts/pages.mjs:905 | MoMo | … ['E-commerce store with MoMo checkout', '5–8 weeks'],… |
| scripts/pages.mjs:1001 | MoMo | …se time at rush hour copying orders onto paper and checking MoMo screenshots by hand.',… |
| scripts/pages.mjs:1002 | MoMo | …ded WhatsApp ordering: dishes, pick-up or delivery, time', 'MoMo payment link in chat, confirmed automatically', '… |
| scripts/pages.mjs:1008 | diaspora | … id: 'real-estate-listings', sector: 'Real estate & diaspora buyers', title: 'Real-estate listing platform',… |
| scripts/pages.mjs:1010 | GHS | … build: ['Listings with photos, floor plans and price in GHS or USD', 'Filters by location, bedrooms and budge… |
| scripts/pages.mjs:1026 | MoMo | … WhatsApp and email reminders before and after due dates', 'MoMo and card payment links included in every reminder… |
| scripts/pages.mjs:1057 | Ghana | …istilled into the systems our team builds for businesses in Ghana and beyond, how we work with you, and the guarant… |
| scripts/pages.mjs:1082 | Accra | …tion-lead">ShowMe is US-led, with our team on the ground in Accra. Josh leads your engagement and stays your direct… |
| scripts/pages.mjs:1093 | Accra | … <li>A delivery team on the ground in Accra</li>… |
| scripts/pages.mjs:1138 | Ghana | … description: 'What ShowMe builds for Ghanaian businesses: restaurant ordering, real-estate l… |
| scripts/pages.mjs:1222 | Ghana | …elped ${esc(site.facts.businessesHelped)} businesses across Ghana and abroad use technology to work smarter, reach … |
| scripts/pages.mjs:1233 | Accra | …nder-role">Founder, ShowMe World · US-led, with our team in Accra</p>… |
| scripts/pages.mjs:1234 | Accra, Ghana, diaspora | …cy, which works with its own delivery team on the ground in Accra, Ghana. Together they bring ${esc(site.facts.expe… |
| scripts/pages.mjs:1235 | Ghana | …e started the agency around a simple observation: many good Ghanaian businesses don't lose customers because of the… |
| scripts/pages.mjs:1236 | Accra | …k and writes a fixed plan in plain English, and our team in Accra delivers it, from the first audit to launch and b… |
| scripts/pages.mjs:1243 | Ghana | …the team that builds, grows and automates for businesses in Ghana and abroad. The agency runs on the same tools and… |
| scripts/pages.mjs:1261 | Accra, Ghana | … <li><span><strong>Accra, Ghana:</strong> our team on the ground, for in-p… |
| scripts/pages.mjs:1262 | GHS, Ghana, Kumasi, MoMo, Takoradi, Tamale | … <li><span><strong>Across Ghana, our core market:</strong> from Kumasi to Takorad… |
| scripts/pages.mjs:1264 | Diaspora | … <li><span><strong>Diaspora and international clients:</strong> businesses in… |
| scripts/pages.mjs:1269 | Ghana, diaspora | …e team, we work with a dependable network of specialists in Ghana and the diaspora: designers, developers, photogra… |
| scripts/pages.mjs:1291 | Accra | …tal Agency and founder Joshua (Josh) Abbey: US-led, team in Accra, ' + site.facts.experience + ' of experience and … |
| scripts/pages.mjs:1419 | Ghana | … <h1>Practical digital guidance for Ghanaian businesses.</h1>… |
| scripts/pages.mjs:1420 | Mobile Money | …nised online, from AI search and Google Business Profile to Mobile Money checkout and WhatsApp automation.</p>… |
| scripts/pages.mjs:1434 | Ghana, Mobile Money | … description: 'Practical, plain-English guides for Ghanaian businesses: AI search visibility, local SEO an… |
| scripts/pages.mjs:1515 | Ghana | …ncy collects, uses and protects personal data, in line with Ghana's Data Protection Act, 2012 (Act 843).</p>… |
| scripts/pages.mjs:1523 | Accra, Ghana | …ncy of ShowMe World (US-led, with our team on the ground in Accra, Ghana), and to this website at agency.showmeworl… |
| scripts/pages.mjs:1556 | MoMo | … <li>payment providers that process MoMo, card and bank payments (we do not store full car… |
| scripts/pages.mjs:1562 | Ghana | …Some of our service providers store or process data outside Ghana. When that happens, we choose reputable providers… |
| scripts/pages.mjs:1583 | Ghana | …data, you can complain to the Data Protection Commission of Ghana.</p>… |
| scripts/pages.mjs:1595 | Accra, Ghana | …owMe Digital Agency: US-led, with our team on the ground in Accra, Ghana. Email ${mail} or WhatsApp ${esc(site.what… |
| scripts/pages.mjs:1601 | Ghana | …ital Agency collects, uses and protects personal data under Ghana\u2019s Data Protection Act, 2012 (Act 843). We ne… |
| scripts/pages.mjs:1626 | Accra, Ghana | …ncy of ShowMe World (US-led, with our team on the ground in Accra, Ghana), and you, the client ("you"). They apply … |
| scripts/pages.mjs:1638 | GHS, Ghana, cedi | …ays. Prices are shown in US dollars (USD) by default and in Ghana cedis (GHS) for clients in Ghana; your proposal s… |
| scripts/pages.mjs:1639 | GHS, Ghana, cedi | … for 30 days and are in US dollars (USD) or, for clients in Ghana, Ghana cedis (GHS); your proposal states the curr… |
| scripts/pages.mjs:1640 | Accra | …App and AI usage fees, printing, and travel outside Greater Accra. We list any that apply in your proposal.</li>… |
| scripts/pages.mjs:1699 | Ghana | …n these terms limits liability that cannot be limited under Ghanaian law.</p>… |

#### scripts/templates.mjs (1 lines)

| file:line | terms | context |
|---|---|---|
| scripts/templates.mjs:199 | Ghana | … title: i.title + ' — Digital Solutions in Ghana / ' + site.name,… |

#### scripts/render.mjs (6 lines)

| file:line | terms | context |
|---|---|---|
| scripts/render.mjs:49 | GHS, Ghana | …ton type="button" data-set-region="gh" aria-pressed="false">Ghana (GHS)</button></div></div></div>`;… |
| scripts/render.mjs:55 | Ghana, diaspora | …Automate. Websites, growth and automation for businesses in Ghana and the diaspora.' };… |
| scripts/render.mjs:109 | Ghana | …export const AREA_SERVED = ['Ghana', 'United States', 'United Kingdom', 'Canada'].ma… |
| scripts/render.mjs:118 | Accra, Ghana | … digital agency with its own delivery team on the ground in Accra, Ghana, bringing ' + site.facts.experience + ' of… |
| scripts/render.mjs:122 | Accra | …am', address: { '@type': 'PostalAddress', addressLocality: 'Accra', addressCountry: 'GH' } },… |
| scripts/render.mjs:215 | Ghana | …utomation. ${esc(site.locationLine)}, serving businesses in Ghana and clients in the US, UK and Canada.</p>… |

#### scripts/prices.mjs (2 lines)

| file:line | terms | context |
|---|---|---|
| scripts/prices.mjs:45 | Accra | …-on (3 edited clips) from {{video}}. Travel outside Greater Accra is quoted separately.' },… |
| scripts/prices.mjs:138 | Accra | …dd-on (3 edited clips) is available. Travel outside Greater Accra is quoted separately.',… |

#### scripts/images.mjs (2 lines)

| file:line | terms | context |
|---|---|---|
| scripts/images.mjs:16 | diaspora | … 'industry-diaspora-property': 'Laptop showing a video tour of a larg… |
| scripts/images.mjs:22 | Africa | …-fashion-retail': 'Fashion boutique with racks of colourful African-print clothing and folded kente cloth, with a ph… |

#### static/site.webmanifest (1 lines)

| file:line | terms | context |
|---|---|---|
| static/site.webmanifest:4 | Ghana | …"Build. Grow. Automate. Websites, growth and automation for Ghanaian businesses.",… |

#### worker/src/audit/render.js (4 lines)

| file:line | terms | context |
|---|---|---|
| worker/src/audit/render.js:9 | Accra, Ghana | …Me Digital Agency is US-led, with our team on the ground in Accra, Ghana. We bring 7+ years of experience and have … |
| worker/src/audit/render.js:12 | Accra, Africa | … day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Accra' }); } catch { return ''; }… |
| worker/src/audit/render.js:15 | Accra, Africa | …: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Accra' }) + ' GMT'; } catch { return ''; }… |
| worker/src/audit/render.js:252 | +233, Ghana | …wa.assumed ? `<p style="${E.muted}">WhatsApp link assumes a Ghana (+233) number.</p>` : ''}… |

#### worker/src/audit/scan.js (1 lines)

| file:line | terms | context |
|---|---|---|
| worker/src/audit/scan.js:71 | Mobile Money | …], ['Square checkout', /square\.link/checkout\.square/i], ['Mobile Money (mentioned)', /mobile money/\bmomo\b/i]… |

#### worker/src/audit/score.js (1 lines)

| file:line | terms | context |
|---|---|---|
| worker/src/audit/score.js:222 | MoMo | …ts', 30, 'We did not find an online payment option (card or MoMo link) on your site.', 'Add Paystack/Hubtel paymen… |
