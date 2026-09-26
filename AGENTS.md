# Project context

## What this is
Next.js (App Router) portfolio site (`app/`), ported from the live original at https://victoralexandru.great-site.net/ by matching its DOM, CSS, and behavior pixel-for-pixel.

## Status (new chapter)
- The port to match the original is DONE: hero, about, skills, work, contact, footer, form validation + SweetAlerts, scroll-to-top, nav — all verified identical to the original.
- NEW chapter starting now: **improving the site** beyond the original (the user explicitly asked to note this). Original-parity is the baseline; further changes are enhancements and no longer need to be justified against the original unless the user asks.
- QA pass done (Lighthouse mobile emulation): Performance 88, A11y 96, Best-practices 100, SEO 100; `npm audit` 0 vulns; lint clean. Remaining known: color-contrast fails on the original's brand blue `#26adf4` headings — left as-is. The white-on-`#737373` footer contrast is resolved: the site footer is now dark (`#0c0c0e`) and joins the work → contact band.
- Images converted to `next/image` (logo, work photos/screenshots, project images, eu.jpg, footer logo) with `sizes`; hero Image has `priority`. This cut total byte weight and raised LCP ~6.9s → 3.8s.

## Conventions
- Keep the original's look-and-feel/layout unless an improvement intentionally changes it.
- Verify changes: `npm run build`, plus **silent** headless Chrome CDP probes against `http://localhost:3000` (dev server job `cdpdev`, port 3000). Use the `silent-web-qa` skill (`C:\Users\victo\.config\opencode\skills\silent-web-qa\`): `node scripts/cdp.js <url> <probe.js> [shot.png] [w] [h]`. Never open a visible browser, never click links that leave the site, never trigger `mailto:`/`tel:`/external `target="_blank"` — drive React with in-page `el.click()` instead.
- Commit style: plain conventional commits (`feat:`, `fix:`). Commit/push only when the user asks.
- No code comments unless asked. Keep responses short.

## Notable past fixes (reference)
- `scrollbarPadding: false` on all `Swal.fire` calls so the footer keeps full width when the alert hides the scrollbar.
- `.eu img { display: inline }` restores the white ring around the avatar (Tailwind preflight `display: block` broke border painting).
- Nav glass effect: `backdrop-filter` blur on `.navbar-default` and `.scrolled`.
- Page bands: dark hero → white about (tinted `.skills-band`) → dark work → dark contact → dark `.site-footer`.
- `smoothScrollTo` offsets the target by the fixed nav height + 12px, so anchor clicks no longer park a section top under the navbar.
- Social icons are inline SVG in 44×44 `.footer-social a` buttons; the old `social-sprite.png` divs gave the anchors a 0×0 hit area.
- Skip link (`.skip-link` → `#main-content`) plus a global `:focus-visible` cyan ring, so keyboard focus is consistent across light and dark bands.