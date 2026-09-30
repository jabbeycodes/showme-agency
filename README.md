# ShowMe Digital Agency

Conversion-focused multi-page website for **agency.showmeworld.app**.

## Positioning

**Turn attention into customers.**

ShowMe is positioned as a growth-and-automation partner for Ghanaian businesses, connecting acquisition, landing pages, WhatsApp, follow-up, CRM, reporting, automation, business technology and custom software.

## Pages

- `index.html` — homepage / core positioning
- `services.html` — ShowMe Growth System
- `industries.html` — priority verticals and fit
- `audit.html` — free 6-point Digital Growth Audit
- `about.html` — differentiation / Why ShowMe
- `styles.css` — shared design system
- `site.js` — audit-to-WhatsApp conversion flow

## Core offer

ShowMe Growth: **GHS 3,200/month**, 3-month minimum. Ad spend is separate; recommended from GHS 1,500/month.

Pilot language is intentionally explicit: qualifying first-five clients may receive month 1 at GHS 1,600 **as part of the 3-month engagement**.

## Deployment note

The previous production setup served a single inline `index.html` from a Cloudflare Worker. The new site is multi-page. Production routing/static asset handling must serve the HTML pages plus `styles.css` and `site.js` before this branch is deployed as-is.

## Contact

- Email: josh@showmeworld.app
- WhatsApp: +1 336 457 2361
