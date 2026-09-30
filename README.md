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
  data.mjs        all copy: services, industries, FAQs, prices, contacts
  render.mjs      head/SEO, header (mega-menu), footer, cards, JSON-LD
  templates.mjs   service + industry detail page templates
  pages.mjs       one-off pages (home, pricing, contact, etc.)
  build.mjs       generates /public + sitemap.xml + robots.txt
  check.mjs       validates links, HTML structure & sitemap
  serve.mjs       local preview server (mirrors worker routing)
static/           hand-authored assets copied into /public as-is
  styles.css      shared design system (dark-first, brand palette)
  site.js         nav, mega-menu, forms, FAQ, reveal, analytics beacons
  assets/         images (hero-owner.webp)
  og-image.png    social share image (also kept at repo root, see note)
public/           GENERATED site (committed) — do not edit by hand
worker/           Cloudflare Worker (serves /public, handles /api/*)
og-image.png      kept at repo root because OG tags point at the raw GitHub URL
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

- ShowMe Growth retainer: **GHS 3,200/month**, **3-month minimum**, paid
  monthly in advance by MoMo or bank transfer.
- Ad spend is **separate** and prepaid in cedis (recommended from **GHS 1,500/mo**).
- Guarantee: **live within 7 days of onboarding, or month 1 is free.**
- First-5-clients offer: **month 1 for GHS 1,600.**
- Contacts: **josh@showmeworld.app**, WhatsApp **+1 336 457 2361**.
- Founder: **Joshua Abbey**, **Accra, Ghana**.

Everything else is priced as a **custom quote** (or a clearly marked
`From GHS [TBD]` placeholder) until the founder confirms real figures.

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

## What the founder still needs to provide (placeholders)

Every item below is marked in the HTML with a dashed "PLACEHOLDER" style and an
`<!-- TODO(founder): ... -->` comment. Search the code for `TODO(founder)` to
find them.

**Proof & trust**
- [ ] Real case studies on `/work/` (client, industry, challenge, what we did, result metric).
- [ ] Real testimonials (name, business, permission to publish) on `/work/` and home.
- [ ] Client logos (if any).

**Pricing**
- [ ] Bundle contents/prices for Launch / Grow / Scale on `/pricing/` (or keep as custom quote).
- [ ] Real starting figures for `From GHS [TBD]` services (e.g. Automation Audit fee).
- [ ] Project payment split (deposit/milestones), accepted card methods, USD terms for diaspora.
- [ ] Confirm whether to offer "preview before final payment" as a formal guarantee.

**Process**
- [ ] Indicative durations for each delivery phase (Discover → Support).

**About**
- [ ] Joshua Abbey bio + professional photo.
- [ ] Description of the other ShowMe brand products (ecosystem).
- [ ] Which diaspora/international markets to highlight and whether USD quoting is offered.

**Contact**
- [ ] Cal.com / Calendly booking link to embed on `/contact/`.

**Legal**
- [ ] Reviewed Terms of Service (`/terms/` is a placeholder).
- [ ] Confirm Ghana Data Protection Act requirements for `/privacy/`.

**Insights**
- [ ] Expand the three draft article outlines in `/insights/` into full articles.

**Deployment**
- [ ] Real `LEADS` KV namespace id in `worker/wrangler.toml`.
