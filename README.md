# ShowMe Digital Agency

Public website for **agency.showmeworld.app** — _"Your digital business partner: Build. Grow. Automate."_

This is a comprehensive, multi-page static site (plain HTML/CSS/vanilla JS, no
framework) generated from small, DRY templates and served in production by a
Cloudflare Worker.

## Stack

- **No framework.** Pages are plain static HTML with a shared `styles.css` and
  `site.js`. A tiny Node build step (`scripts/`) stamps the shared header,
  footer and SEO into every page so they stay consistent.
- **Content lives in `scripts/data.mjs`** — divisions, services, industries,
  FAQs and site facts. Edit copy there, then rebuild.
- **Output is committed to `public/`** and is what the Worker serves.

```
scripts/          build tooling & content (source of truth)
  data.mjs        all copy: services, industries, FAQs, contacts, insights index
  prices.mjs      published "from" prices, bundles and payment terms
  articles/       full Insights article bodies (HTML fragments)
  render.mjs      head/SEO, header (mega-menu), footer, cards, JSON-LD
  templates.mjs   service + industry detail page templates
  pages.mjs       one-off pages (home, pricing, contact, etc.)
  build.mjs       generates /public + sitemap.xml + robots.txt
  check.mjs       validates links, HTML structure & sitemap
  serve.mjs       local preview server (mirrors worker routing)
static/           hand-authored assets copied into /public as-is
  styles.css      shared design system (dark-first, brand palette)
  site.js         nav, mega-menu, forms, FAQ, reveal, analytics beacons
  assets/         images (hero-owner.webp, founder photo)
  assets/img/     AI-generated photos <name>-{640,1200}.{webp,jpg}, approved by the
                  founder (solution-*, industry-*, article-*, division-*). Sources are
                  16:9, center-cropped to 16:10 and exported at 1200x750 and 640x400
                  (WebP q80 + JPG q82). Alt text lives in scripts/images.mjs. They are
                  illustrative, not client work or real customers.
  og-image.png    1200x630 social share image
  favicon.*, icon-*.png, apple-touch-icon.png, site.webmanifest   icon set
public/           GENERATED site (committed) — do not edit by hand
worker/           Cloudflare Worker (serves /public, handles /api/*)
og-image.png      copy of static/og-image.png (OG tags now use https://agency.showmeworld.app/og-image.png)
```

## Build & check

Requires Node 18+. No dependencies to install.

```bash
npm run build      # generate /public, then validate it
npm run build:site # generate only
npm run check      # validate links, HTML structure, sitemap
npm run serve      # preview at http://localhost:4321 (mirrors worker routing)
```

`npm run check` fails the build if any internal link is broken, a page is
missing its single `<h1>`, title, meta description, canonical, skip link or
`<main>`, or the sitemap references a missing page.

## Brand

- Fonts: Anton (display), Archivo (headings), Public Sans (body).
- Palette: ink `#10243f`, coral `#f2654b`, mint `#24bda4`, gold `#eeb43f`,
  paper `#fffaf4`, night `#07111f`.
- Voice: plain-English, confident, honest — **proof, not promises**.

## Real facts baked into the site (do not change without founder input)

- ShowMe Growth retainer: **GHS 3,200/month**, **3-month minimum**, billed
  monthly in advance (MoMo, bank transfer or card).
- Ad spend is **separate** and prepaid in cedis (recommended from **GHS 1,500/mo**).
- Guarantee: **live within 7 days of onboarding, or month 1 is free.**
- The former first-5-clients / founding-client offer (month 1 for GHS 1,600)
  was **removed** in Oct 2026 at the founder's request, along with all
  "founding client" / "first case studies" framing.
- Experience: the team has **7+ years** helping businesses with their digital
  needs (`site.facts.experience`) and has helped **50+ businesses**
  (`site.facts.businessesHelped`). Founder-confirmed; no other numbers,
  client names, testimonials or awards are claimed.
- Contacts: **josh@showmeworld.app**, WhatsApp **+1 336 457 2361**.
- Location framing: **US-led, with our team on the ground in Accra, Ghana.**
  Founder **Joshua (Josh) Abbey** is based in the **United States** (country
  level only; no US city or street address is published); the delivery team
  works from Accra. The agency serves businesses in
  **Ghana** (core market: GHS pricing, MoMo, Ghana Data Protection Act) and
  diaspora/international clients in the **US, UK and Canada**, remotely.

## Pricing (set Oct 2026, in `scripts/prices.mjs`)

All services now carry a published GHS "from" price plus an indicative USD guide
(at roughly GHS 11.5 per USD; the proposal fixes the exact USD amount).
Benchmarked against BVM Digital and Agodoo's public prices (see the audit in
`/workspace/competitor-audit/report.md`): ShowMe sits mid-market on price and
includes more as standard (preview before final payment, 30 days of launch
support, WhatsApp lead capture, training, ownership).

| Item | From |
|---|---|
| Launch bundle (site + Brand Essentials + GBP + 3 mo care) | GHS 11,500 |
| Grow bundle (site + WhatsApp AI assistant + GBP) | GHS 12,500 + Growth retainer |
| Scale bundle (store + full identity + 3 automations + 3 mo care) | GHS 24,500 |
| Automation Audit (credited in full toward a build within 60 days) | GHS 1,500 |

Payment terms: 50% deposit / 50% on launch (after the client approves a working
preview), retainers monthly in advance, MoMo / bank transfer / card, USD quotes
for US/UK/Canada clients.

## Lead pipeline (unchanged contract)

Forms POST JSON `{name, business, email, phone, need, message}` to `/api/lead`,
fall back to WhatsApp on failure, and send `/api/event` beacons
(`pageview`, `lead_submitted`, `whatsapp_click`). Extra qualifying fields
(services, challenge, budget, timeline) are appended into `message`, so the
existing worker still accepts submissions unchanged. `name` and `email` remain
required.

## Deployment (Cloudflare Worker) — do this manually, nothing auto-deploys

Production is the `showme-agency` Worker. This repo adds `worker/` with Workers
Static Assets so the multi-page site is served correctly.

1. `npm run build` (regenerates `public/` and validates it).
2. In `worker/wrangler.toml`, set the `LEADS` KV namespace `id` to the **existing**
   namespace already bound to the live `showme-agency` worker, so historic leads
   and stats are preserved.
3. From `worker/`, deploy with Wrangler:
   ```bash
   cd worker
   npx wrangler deploy
   ```
   (Requires `wrangler login` / a Cloudflare API token with access to the account.)
4. Verify: the home page and inner pages load, `/does-not-exist` returns the
   404 page, and a test form submission stores a lead in KV.

The Worker runs custom code **only** for `/api/lead` and `/api/event`
(reproducing the previous handlers), and serves `public/` for everything else.

## Content status

All former `PLACEHOLDER` boxes and `TODO(founder)` comments have been replaced
with finished copy (prices, bundles, payment terms, process durations, founder
bio with the founder's photo (`static/assets/joshua-abbey*.webp|jpg`), WhatsApp "Book a free call" with email fallback,
six full Insights articles, Terms and Privacy). No testimonials, client names,
logos or project results are shown anywhere (the only figures are the
founder-confirmed **7+ years** and **50+ businesses helped**): `/work/` presents four
**solutions we deliver** (what each system does, its features and the outcomes
it is designed for, with no client names or results), how the team works
with clients and written guarantees. Add real case studies only with client permission and real
numbers.

### ⚠️ Legal review recommended

`/terms/` and `/privacy/` were drafted for a Ghana-based digital agency with
reference to the Data Protection Act, 2012 (Act 843), the Electronic
Transactions Act, 2008 (Act 772) and the Alternative Dispute Resolution Act,
2010 (Act 798). They are **not** a substitute for advice from a Ghanaian lawyer.
Before relying on them, have them reviewed, and confirm whether ShowMe needs to
register with the Data Protection Commission as a data controller.

**Flagged (Oct 2026): founder location and governing law.** The founder is
based in the United States and the delivery team is in Accra, with Ghana as
the core client market. Clause
18 of `/terms/` previously applied Ghanaian law with the courts in Accra. It
has been made **neutral**: the governing law and jurisdiction are now stated in
each written proposal, and disputes go to good-faith discussion, then
mediation. Decide with a lawyer which law should apply by default (Ghana, or a
US state, possibly differing for Ghanaian vs US/UK/Canadian clients) and then
restore a specific clause in `scripts/pages.mjs` (`terms()`). Also confirm
which entity is the data controller in `/privacy/` (it still references Ghana's
Act 843 and the Ghana Data Protection Commission, which stay relevant for
Ghanaian clients) and whether US state privacy laws or UK/Canadian rules
apply to diaspora clients.

### Things worth double-checking

- USD guide figures if the cedi moves significantly (update `scripts/prices.mjs`).
- The 30-day launch support, 60-day audit credit window, 14-day cancellation
  notice and 21-day data-request response time are new commitments introduced
  with this content; adjust in `prices.mjs`, `pages.mjs` and the legal pages if
  you want different terms.
- The `showmeworld.app` link on `/about/` assumes the parent site is live.

### Deployment

- [ ] Real `LEADS` KV namespace id in `worker/wrangler.toml`.
