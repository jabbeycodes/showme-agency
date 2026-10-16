# ShowMe logo: vector rebuild of Josh's reference

This is exploration only. Nothing is committed, pushed or deployed. The reference is `reference.png`.

## What it is
- **Symbol.** A folded-ribbon S made from two identical hooks. Each hook is an arm, a half-ring bowl, and a leg with a round end. The second hook is the first turned 180°, and it nests inside the first. The single even gap between them is the white S.
- **Geometry.** It was fitted to the reference PNG and then rounded to clean numbers (reference-pixel units): band width 104, gap 28, bowl radii 80/184, bowl centres ±80 apart, slant 24°.
- **Bands and curves.** All four bands are the same width and run parallel. Every curve is a true circular arc. Both cut ends sit at the same angle, so they are parallel.
- **Pixel squares.** Six squares in three sizes (60/48/24) on a 12-unit grid, in flat colours.
- **Shading.** Each hook has one base gradient, one crisp "inner wall" crescent per bowl (this is the fold), and one soft accent. The top hook gets a cyan glow on its leg. The bottom hook gets an edge highlight on its arm and a rim highlight on its bowl.
- **Wordmark.** Montserrat ExtraBold, tracking −0.02em, converted to outlines. "Show" is navy #0b1b33 and "Me" is a blue gradient (#0b5ee0 → #1aaef6). "DIGITAL AGENCY" is Montserrat Medium, widely tracked. The tagline is Montserrat SemiBold with blue dots and rules.
- **Fonts.** No font files are needed. All text is outlined paths.

## Files
| File | Use |
|---|---|
| `showme-logo-stacked.svg` | Full stacked logo with the primary tagline TECHNOLOGY • AUTOMATION • DIGITAL GROWTH |
| `showme-logo-stacked-tagline-original.svg` | Josh's exact tagline: TECHNOLOGY • SECURITY • DIGITAL GROWTH |
| `showme-logo-stacked-no-tagline.svg` | Stacked, no tagline |
| `showme-logo-stacked-reversed.svg`, `-reversed-no-tagline.svg` | For navy backgrounds (transparent background) |
| `showme-logo-stacked-mono-navy.svg` / `-mono-white.svg` | Single colour |
| `showme-logo-horizontal.svg` (+ `-reversed`, `-mono-navy`, `-mono-white`) | Header lockup: symbol on the left, "ShowMe" and "DIGITAL AGENCY" on the right |
| `showme-symbol.svg` (+ `-reversed`, `-mono-navy`, `-mono-white`) | Symbol alone |
| `favicon/favicon.svg`, `favicon.ico`, `favicon-16/32/48.png`, `apple-touch-icon.png`, `icon-512.png` | Simplified favicon on a navy tile |
| `favicon/favicon-flat.svg` | Transparent favicon (for light backgrounds only) |
| `animated/*.svg`, `animated/showme-logo-motion.css`, `animated/demo.html` | Motion version |
| `boards/board-reference-vs-rebuild.png`, `boards/board-variants.png` | Review boards |
| `build/` | Generator scripts. Run `python3 compose.py && python3 anim.py && python3 finalize_fav.py && python3 boards.py` |

## Judgment calls
1. **Symmetric fold.** In the reference the two halves don't quite match: the white S drifts off-centre and the bowls differ in size. I made them identical (one turned 180°), so the gap is perfectly even. Arm lengths stay asymmetric like the original, with the long tail at the bottom left and the short top end beside the squares.
2. **Cut angle.** The original's two cut ends disagree (about 64° and 33°). Both now share one angle that sits between them.
3. **Pixel squares.** They're snapped to a grid and nudged right by about 24px so they sit just off the new top cut.
4. **Font.** The original wordmark looks like Montserrat ExtraBold but slightly narrower. I used real Montserrat at a natural width with tracking −0.02em, so "ShowMe" is a little wider than in the PNG.
5. **Reversed version.** The white S is kept as a solid white shape so it still reads on navy. The bottom hook and the two navy squares are lifted to mid-blues so they don't disappear.
6. **Horizontal lockup.** The two smallest squares are dropped because they turn to specks at header size. "DIGITAL AGENCY" is set larger (about 31% of the wordmark size, tracked 0.16em) instead of being stretched to full width, so it stays readable with the lockup at 48px tall. Use 44–48px in the 72px header.
7. **Favicon.** It drops the squares, gradients and white slot detail. It's two flat hooks (bright blue and white) on the site navy, with rounded corners. It reads at 16px on both light and dark browser tabs. The transparent navy+blue version disappears on dark tabs, so the navy tile should be the default. The Apple touch icon is full-bleed because iOS rounds the corners itself.
8. **Tagline.** The primary version says AUTOMATION instead of SECURITY, because the site no longer offers cybersecurity. Josh's exact wording is kept as an alternate file.

## Motion
- **Sequence.** The two ribbon halves start apart and glide along their fold line (both move along the 24° slant, so they never overlap) until they lock into the S. Then the six squares assemble one by one from the lower left of the stack with a slight overshoot. Then "ShowMe", "DIGITAL AGENCY" and the tagline rise in. It takes about 1.6s in total and runs once. On the reversed version, the white S fades in once the halves have locked.
- **How it's built.** Plain CSS keyframes inside the SVG (`.sm-anim`), using transform and opacity only. The same CSS is in `animated/showme-logo-motion.css` for inline use.
- **Reduced motion.** `@media (prefers-reduced-motion: reduce)` turns every animation off and shows the final logo straight away. This is verified for an inline SVG with reduced motion emulated in Chrome. Chrome's emulation doesn't reach SVGs loaded through `<img>`, so for the site header, inline the SVG (the site already inlines BRAND_MARK).

## Site integration (preview)
- To regenerate, run `python3 logo/build/site_assets.py` (from `logo/build`). It writes:
  - `scripts/brand.mjs`: the inline header lockup (animated, 48px) and the footer lockup (reversed, 52px, static)
  - `static/favicon.svg`, `static/favicon.ico`, `static/apple-touch-icon.png`, `static/icon-192.png`, `static/icon-512.png`, `static/icon-512-maskable.png`
  - `static/og-image.png`
- The motion CSS lives in `static/styles.css` (`.sm-anim …`). The site's global reduced-motion rule turns it off.
- `reference.webp` is a compressed copy of Josh's PNG. The full-size `reference.png` and the review boards stay local (they're git-ignored).
- After a fresh clone, copy the PNG back to `logo/reference.png` (or convert the webp) before running `boards.py`.
