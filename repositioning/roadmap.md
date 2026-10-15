# ShowMe Digital Agency — Repositioning Roadmap (Phase 1 output, 2026-10-15)

**Basis:** `site-audit.md` (same folder) and Josh's brief `master-prompt-2026-10-15.md`. Work happens on a branch → preview worker `showme-agency-preview` only. **No production deploy without Josh's approval.**

**Copy rules applied throughout:**
- Never invent certifications, partners, logos, testimonials, results, team members or years. The only stats allowed are **7+ years** and **50+ businesses**.
- IT and cybersecurity are written as plain service descriptions: **no** "certified", "SOC", "24/7" or guaranteed response times until Josh confirms who delivers.
- Placeholders are written `[[PLACEHOLDER: …]]` and are blocked from production by a build check.

> **Update 2026-10-15 (Josh): "Take out the cybersecurity for now."** Cybersecurity & Digital Protection is removed as a
> pillar and as a marketed service. The site now has **4 pillars**: A Managed IT Services & Infrastructure,
> B Digital Marketing & Brand Growth, C AI, Automation & Business Intelligence, D Software Development & Technology
> Consulting. No cyber pillar page, nav item, hub card or cyber bullets on the Managed IT page (risk/vulnerability
> assessments, awareness training, compliance readiness, IAM, email security are dropped; routine sign-in settings
> such as multi-factor sign-in remain only as part of Microsoft 365 / Google Workspace administration). The hero is
> "Technology That Runs Your Business. Solutions That Power Its Growth." with no "secure/protects" wording. The
> planned `/security/` page became **`/trust/` "Trust & data handling"** (how we work with your data; not a
> service). Site security headers and `/.well-known/security.txt` stay as unadvertised technical hygiene.
> `check.mjs` fails the build on "cybersecurity"/"cyber" in the US view. No 301s are added for cyber URLs that
> never existed. Sections below are updated accordingly; struck items are kept for history.

---

## 0. Priorities at a glance

| | P0: must fix before launch | P1: launch + 30 days | P2: growth |
|---|---|---|---|
| Positioning & IA | New home, Solutions hub, 4 pillar pages, flagship "Complete IT Department" page, consultation/contact; 301s for every old URL | Industry pages (6), engagement-model page, leadership page, trust & data-handling page, new sub-service pages (A) | Case studies, capability demo library, resource downloads |
| Region | US default with **zero** Ghana/Accra/Africa/cedi/MoMo mentions (enforced by `check.mjs`); Ghana view via edge + switcher | Ghana-view copy polish, Ghana-only services/insights placement | Additional regions (UK/CA) if wanted |
| Trust & claims | Fix pending wording items; remove unverifiable claims; reframe Work page; `info@` everywhere; no fake proof | Leadership profiles (real), trust & data-handling page, service-agreement outline | Testimonials/logos once permitted |
| Design | New design system (type, AA contrast, buttons, spacing), hero + pillar imagery with no ₵ and no cartoon | Full imagery set, OG images, motion polish | Video/demos |
| Conversion | "Book a Technology Consultation" flow working (form → KV + alert; preview non-storing) | Scheduler embed + CRM sync + qualification fields | Nurture sequences, webinars, ads landing pages |
| Legal & security | Region-appropriate privacy/terms text (counsel review); security headers + security.txt; no tracking added | Managed-services terms, cookie/consent if any tag is added | — |
| QA | build/check, links, forms, desktop+mobile, a11y AA, Lighthouse, headers, Josh sign-off on preview | Monitoring of leads/events | A/B tests |

### P0 checklist (in order)
1. **Josh inputs (blocking):**
   - who delivers IT/cyber
   - support hours, channels and realistic response targets
   - the flagship package boundaries
   - legal entity/state
   - approval of positioning copy and IA
   - booking tool choice
2. **Region system v2.** Extend the existing build-time `data-us`/`data-gh` mechanism from prices to *all* region-specific content (wording, blocks, schema). Add a `check.mjs` rule that **fails the build if any Ghana term appears in the US view** (same pattern as the hidden-prices check). Replace the ₵ hero illustration.
3. **New IA and templates:**
   - home
   - `/solutions/`
   - 4 pillar pages (cybersecurity removed 2026-10-15)
   - `/managed-it-services/` (flagship)
   - `/contact/` with consultation booking
   - 301 map (section 3)
   - new sitemap
4. **Claims clean-up:**
   - the pending wording items (fixes in audit section 4)
   - Work page reframed as "Capabilities"; remove "Proven systems"
   - about page: remove "publish prices"
   - preview banner text
   - `site.email` and `static/site.js` changed to `info@showmeworld.app`
5. **Design system refresh (section 6),** including WCAG AA button contrast.
6. **Legal:**
   - US-default privacy and terms (no Ghana DPA framing in US view; Ghana view keeps Act 843)
   - managed-services boundaries language
   - counsel review flagged
7. **Site security:** HSTS, CSP, Referrer-Policy, Permissions-Policy, frame-ancestors and `/.well-known/security.txt` (set by the worker).
8. **Consultation journey** working end to end on preview (non-storing) and on production (KV + alert to `info@`).
9. **QA pass and Josh sign-off on the preview, then a production deploy with approval.**

---

## 1. Proposed sitemap / IA

```
/                                   Home
/solutions/                         Solutions hub (4 pillars + flagship)
  /solutions/managed-it/            A  Managed IT Services & Infrastructure
  /solutions/digital-marketing/     B  Digital Marketing & Brand Growth
  /solutions/ai-automation/         C  AI, Automation & Business Intelligence
  /solutions/software-consulting/   D  Software Development & Technology Consulting
  (/solutions/cybersecurity/ removed 2026-10-15: no page, no redirect)
/managed-it-services/               FLAGSHIP: "Your Complete IT Department. Without the Cost of Building One."
/services/<slug>/                   Individual services (existing URLs kept; re-parented under pillars)
/industries/                        Industries hub
  /industries/healthcare-clinics/
  /industries/professional-services/
  /industries/schools/
  /industries/nonprofits/
  /industries/retail-hospitality/
  /industries/startups-smes/
  (/industries/corporates/  optional, as the brief lists corporates)
/how-we-work/                       Engagement models & process (replaces /process/)
/pricing/                           "How pricing works" (prices hidden; Request pricing)
/consultation/                      Book a Technology Consultation (scheduler + short form)
/about/                             About + principles
/about/leadership/                  Leadership (real profiles only)
/trust/                             Trust & data handling (how we work with your data; not a service)
/capabilities/                      Capabilities & demos (replaces /work/ until real case studies exist)
/insights/                          Insights (US content plan; Ghana guides in Ghana view)
/contact/                           Contact (form, email info@, WhatsApp +1 336 457 2361)
/free-audit/                        Kept as "Digital presence check" (pillar C entry offer)
/privacy/  /terms/                  Region-appropriate legal
```

**Header navigation (US view):**
- Solutions ▾ (4 pillars + flagship)
- Managed IT
- Industries ▾
- How we work
- Insights
- Company ▾ (About · Leadership · Capabilities · Trust & data handling · Pricing · FAQ)
- Primary button: **Book a Technology Consultation**

Secondary links: "Explore our solutions" and "Request pricing". Remove the duplicate "FREE AUDIT" link.

**Footer:**
- 4 pillars, flagship, industries, company (About, Leadership, Trust & data handling), legal
- `info@showmeworld.app` and WhatsApp +1 336 457 2361
- Region switcher "United States | Ghana"
- No Accra line in the US view

### Services mapped to pillars (existing URL → pillar; ★ = new page needed)
- **A. Managed IT & Infrastructure:**
  - existing: `microsoft-365` (retitled "Microsoft 365 & Google Workspace administration"), `cloud-document-management` (retitled "Cloud migration & file management")
  - ★ new: `help-desk-support`, `endpoint-device-management`, `network-wifi`, `backup-disaster-recovery`, `it-onboarding-offboarding`
- ~~**B. Cybersecurity & Digital Protection:**~~ *(removed 2026-10-15; nothing below is built)* ★ `security-risk-assessment`, ★ `mfa-identity-access`, ★ `email-security`, ★ `security-awareness-training` (absorbs the training half of `it-consulting-training`), ★ `vulnerability-assessment`, ★ `compliance-readiness`
- **C. Digital Marketing & Brand Growth:**
  - existing: `business-websites`, `landing-pages-funnels`, `ecommerce-momo`→`ecommerce`, `booking-online-ordering`, `website-care`, `growth-retainer` (as "Managed Growth"), `local-seo-gbp`, `seo-programme`, `ai-search-visibility`, `paid-ads`, `social-media`, `content-marketing`, `email-sms`, `brand-identity`, `marketing-collateral`, `photography-video`, `pitch-decks`
  - ★ new: `conversion-rate-optimization`
- **D. AI, Automation & BI:**
  - existing: `whatsapp-ai-assistant`→`ai-assistants-chatbots`, `business-process-automation`, `automation-audit`, `ai-knowledge-base`, `analytics-reporting`, `dashboards-internal-systems` (shared with E), `crm-setup`
- **E. Software Development & Technology Consulting:**
  - existing: `custom-web-apps`, `mobile-apps`, `integrations-saas`, `it-consulting-training`→`technology-consulting`
  - ★ new: `technology-roadmap`, `application-maintenance`

---

## 2. Flagship: "Your Complete IT Department. Without the Cost of Building One." (`/managed-it-services/`)

Page structure: problem → what's included (by tier) → boundaries → how support works → onboarding → add-ons → FAQ → **Request pricing** / **Book a Technology Consultation**. No prices are shown.

| Element | Draft content (all **[[PLACEHOLDER]]** until Josh confirms delivery capacity) |
|---|---|
| Tiers (names TBD) | **Essentials:** remote help desk for users, device inventory, OS/app patching, M365/Google Workspace admin, backup monitoring, monthly summary. **Business:** Essentials + onboarding/offboarding, standard device setup, network/Wi-Fi management, vendor coordination, quarterly review. **Complete:** Business + technology roadmap and budget planning sessions, IT documentation and policy templates, cloud/infrastructure planning, staff tool training, priority handling. *(Security baseline, awareness training and other cyber items removed 2026-10-15.)* |
| Deliverables | Named contact; ticket/email channel; documented asset list; monthly report (tickets, patch status, backup status, security items); quarterly review (Business+). |
| Boundaries (exclusions) | Hardware/software purchase and licences (passed through); on-site visits (add-on, where available); project work beyond [[X hours]]; unsupported/end-of-life systems; third-party vendor faults; incident response beyond [[scope]].  |
| Response commitments | `[[PLACEHOLDER: support hours & time zone, channels, target first-response by priority — only what can be met; no 24/7 unless confirmed]]` |
| Onboarding | Discovery & assessment → documentation of current setup → quick security fixes → handover of access/credentials process → steady-state. |
| Add-ons | On-site support (location-dependent); device procurement/setup; cloud migration projects; roadmap workshops; extra training; after-hours support **only if offered**. *(Cyber add-ons removed 2026-10-15.)* |
| Client responsibilities | Timely access, licence ownership, approving changes, user cooperation. |

---

## 3. Redirects (old URL → new home; 301 unless kept)

The worker already converts asset-layer redirects to 301. Add an explicit redirect map in `worker/src/index.js`, applied before asset lookup and tested by `check.mjs` and curl.

| Old URL | Action |
|---|---|
| `/services/` | 301 → `/solutions/` |
| `/services/<slug>/` (pages kept, see section 1) | **Keep URL**; new breadcrumb under its pillar |
| `/services/ecommerce-momo/` | 301 → `/services/ecommerce/` |
| `/services/whatsapp-ai-assistant/` | 301 → `/services/ai-assistants-chatbots/` |
| `/services/whatsapp-ordering-booking/` | 301 → `/services/booking-online-ordering/` (WhatsApp/MoMo variant shown in Ghana view) |
| `/services/it-consulting-training/` | 301 → `/services/technology-consulting/` |
| `/process/` | 301 → `/how-we-work/` |
| `/work/` | 301 → `/capabilities/` |
| `/industries/private-healthcare/` | 301 → `/industries/healthcare-clinics/` |
| `/industries/private-schools/` | 301 → `/industries/schools/` |
| `/industries/professional-services/` | Keep |
| `/industries/restaurants-caterers/`, `/industries/hospitality-tourism/`, `/industries/fashion-retail/`, `/industries/events-weddings/` | 301 → `/industries/retail-hospitality/` |
| `/industries/churches-ministries/` | 301 → `/industries/nonprofits/` |
| `/industries/real-estate/`, `/industries/diaspora-property/` | **Josh to decide.** Default: 301 → `/industries/` hub, or keep as Ghana-view-only pages (see section 4) |
| `/insights/*` (6 Ghana guides) | Keep URLs (see section 4); retitle the 4 that can be general |
| `/pricing/`, `/free-audit/`, `/about/`, `/contact/`, `/faq/`, `/privacy/`, `/terms/` | Keep |

Sitemap: new URLs only. `lastmod` is handled by the existing mechanism.

---

## 4. Region handling (content, not just prices)

**Rules:**
- US is the default. Every visitor outside Ghana sees US content, including UK/CA/rest of world (confirm with Josh).
- The **US view shows no Ghana/Accra/Africa/cedi/MoMo/diaspora wording**, text or imagery.
- Ghana content appears only in the Ghana view.
- One canonical URL per page; crawlers see the US view.

**Mechanism (extends what is already built for prices):**
1. **Inline wording:** build-time tokens give `<span data-us="…" data-gh="…">US text</span>`. This already exists (`scripts/region.mjs`, `scripts/money.mjs` `WORDS`). Extend `WORDS` with location/market phrases.
2. **Blocks:** US markup renders normally. The Ghana alternative is shipped inside an inert `<template data-gh-for="id">`, which is not rendered and not visible text. For Ghana requests, the worker (HTMLRewriter) swaps it in at the edge. The switcher does the same client-side without reload.
3. **Head:** title, meta, OG and JSON-LD always use the US default. Organization schema drops Accra; `areaServed` is reviewed.
4. **Detection:** `?region=us|gh` (sets the cookie) → `sm_region` cookie → `request.cf.country === 'GH'` → otherwise US. HTML is served with `Vary: Cookie` and no ETag reuse across regions. This exists already.
5. **Switcher:** re-enabled as "Region: United States | Ghana" (it was hidden only because, with prices off, nothing differed). It sits in the footer plus a small top-bar link, and remembers the choice in a cookie and localStorage.
6. **Inherently Ghana pages** (MoMo guide, Local SEO Ghana, diaspora property; possibly real estate). These are kept at their URLs but listed only in Ghana-view navigation and indexes, each labelled "Ghana guide". This is the **one documented exception** to "US sees none": a US visitor can still reach them via a direct link. Alternative: retire them. **Josh decides.**
7. **Enforcement:** `check.mjs` builds the US view of every page and fails on any Ghana term (list in audit appendix A), allowing only these exceptions. It also checks that the Ghana view has no US-only claims.

**Caveats:**
- Googlebot (US) indexes only US content, so Ghana search results show US wording. That is acceptable, or Ghana SEO can be handled later with separate `/gh/` pages plus hreflang (P2 decision).
- Hiding the delivery location from US buyers must not become misleading. The security/data-handling page and contracts must state where client data is accessed and stored. See the open questions.

---

## 5. Engagement model page (`/how-we-work/`)

Two tracks on one page:
- **Managed services:** Consultation → Assessment → Proposal & agreement → Onboarding → Ongoing service & monthly reporting → Quarterly review.
- **Projects:** Discovery → Plan & fixed quote → Design → Build → Preview & approval → Launch → 30 days support.

This mirrors the brief's customer journey. Payment terms (50/50, preview before final payment), communication cadence and the support process are shown with placeholders where Josh must confirm.

---

## 6. Design direction

- **Look:** clean corporate premium, light-first, with generous white space, a 12-column grid, restrained colour (navy/ink + one accent, AA-checked) and **no heavy gradients**. Benchmarks for quality only: Accenture, IBM Consulting, CDW, Deloitte Digital.
- **Typography:** one professional sans family for headings and body (e.g. Inter, IBM Plex Sans or Source Sans 3; self-hosted, 2 weights), sentence-case headings, larger body (17–18px) and a clear type scale. **Retire the all-caps Anton display face.**
- **Imagery:**
  - Real technology contexts: people at work with laptops/devices, network/server details, dashboards (real or clearly demo data), security UI. Use licensed photography or commissioned shoots.
  - Founder and leadership photos (real only).
  - No cartoon illustrations, no AI interiors, no ₵ or other currency symbols in the US view.
  - Icons: a single consistent line set.
- **Components:**
  - pillar cards
  - service detail blocks (deliverables / boundaries / outcomes)
  - comparison table for managed tiers
  - process timeline
  - FAQ
  - CTA band
  - consultation form
  - leadership card with clear placeholder state
- **Motion:** subtle (fade/translate ≤200ms, on first view only), respecting `prefers-reduced-motion`. Remove the scroll progress bar.
- **Accessibility:** WCAG 2.2 AA. Contrast ≥4.5:1 for text/buttons, visible focus, 44px targets, semantic landmarks. Re-test the mega menu and accordion.
- **Performance budget:** LCP < 2.0s on 4G, CLS < 0.05, under 150 KB of critical-path assets, self-hosted fonts with `font-display: swap`, responsive WebP/AVIF images.

---

## 7. Measurement & lead journey

| Journey step (brief) | Site element | Data captured / system |
|---|---|---|
| Discover | SEO (pillar/service pages, insights), LinkedIn, Google Search ads (P2) | `pageview` event (exists) |
| Credibility | Leadership, security page, capabilities, engagement model | `page_view` by section (new event names) |
| Problem → service page | Pillar → service pages | `cta_click` (new) |
| Evidence | Capabilities/demos, case studies (when real) | — |
| Book consultation / assessment | `/consultation/`: scheduler embed (tool TBD) + short qualification form | `consultation_click`, `lead_submitted` (exists) |
| Assess | Manual assessment (IT/security); automated website scan only for pillar C | Existing audit pipeline (website only) |
| Proposal → agreement/onboarding | Offline (proposal templates P2) | CRM stage |
| Ongoing service & reporting | Client reports (outside the site) | — |

**Lead capture:**
- Reuse `/api/lead` → KV `lead:*` (additive fields only; never overwrite existing keys) → founder alert email to `info@showmeworld.app` → admin review at `/admin/`.
- New qualification fields: company size, number of users/devices, pillar(s) of interest, top priority, current IT setup, timeline.
- The automated audit runs **only** when a website is given and pillar C is selected. IT/cyber leads get no automated "assessment" email.

**CRM:**
- Choose HubSpot (free CRM), Zoho or Pipedrive (Josh).
- P1: worker forwards new leads to the CRM via API (secret stored as a worker secret).
- KV remains the system of record backup.

**Follow-up:**
- The existing `FOLLOWUP` flag sends one email after an approved audit.
- P2 nurture sequences (consultation reminder, post-consultation summary, proposal follow-up) are sent only after Josh approves the copy.

**Analytics:**
- Keep the cookieless KV counters (`/api/event`).
- Add events: `consultation_click`, `booking_completed`, `request_pricing_click`, `form_start`, `pillar_view`.
- GA4/Meta Pixel **only after** the privacy update and consent design.

**Preview stays non-storing:** `PREVIEW=1` returns `{ok:true, preview:true}` with no KV, email or CRM calls (already implemented).

---

## 8. Delivery phases after this roadmap (for approval)

1. **Phase 2:** Josh answers the open questions and supplies proof. Then design system + region v2 + new templates on a branch → preview.
2. **Phase 3:** content for home, solutions, 5 pillars, flagship, consultation, about/leadership placeholders, legal drafts → preview. Full QA pass (links, forms, desktop/mobile, SEO, a11y, Lighthouse, headers). Fix, then repeat.
3. **Phase 4:** industries, engagement model, security page, new sub-services, insights plan, CRM/scheduler → preview → QA.
4. **Phase 5:** Josh approval → production deploy (with 301 map) → post-launch monitoring and a final report.

## 9. Open questions for Josh

1. **Who delivers managed IT and cybersecurity?** In-house, contractors or a partner MSP/MSSP? Coverage hours/time zone? Is on-site support possible in the US, and where?
2. What realistic **response targets** and support channels can be published (if any) for the flagship package? Package names and tier contents?
3. Legal entity for US clients (name/state)? Who signs managed-services agreements? Will counsel review the terms/privacy?
4. Are any **certifications or vendor partner statuses** actually held (Microsoft, Google, CompTIA, etc.)? Please send proof before any mention.
5. Leadership: who besides Josh can be named, with photos and bios? Do we keep "Founder" as the only profile until then?
6. Which **real projects** can become case studies (client consent)? Any permitted logos or testimonials?
7. Region: should UK/Canada/others see US content (USD), or should another region come later? Is it acceptable that the delivery team's location is disclosed in contracts and on the security page but not in US marketing copy?
8. Ghana-only pages (real estate, diaspora property, MoMo/Local-SEO-Ghana guides, WhatsApp ordering, photography in Accra): keep in Ghana view, generalise, or retire?
9. Booking tool: Calendly, Cal.com, Microsoft Bookings or Google Calendar appointment schedules? And CRM choice?
10. Do the Growth retainer and Launch/Grow/Scale bundles stay (as pillar C packages), or are they retired in favour of the managed-IT-led offer?
11. Brand name: keep "ShowMe Digital Agency" (the brief keeps it) or move to a more tech-partner name/subtitle (e.g. "ShowMe Digital Agency, technology & digital transformation")?
12. Is any tracking (Meta Pixel, GA4, LinkedIn Insight) planned for launch? If so, the privacy and consent work becomes P0.
