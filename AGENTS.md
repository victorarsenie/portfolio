# Project context

## What this is
Next.js (App Router) portfolio site (`app/`), ported from the live original at https://victoralexandru.great-site.net/ by matching its DOM, CSS, and behavior pixel-for-pixel.

## Status (new chapter)
- The port to match the original is DONE: hero, about, skills, work, contact, footer, form validation + SweetAlerts, scroll-to-top, nav — all verified identical to the original.
- NEW chapter starting now: **improving the site** beyond the original (the user explicitly asked to note this). Original-parity is the baseline; further changes are enhancements and no longer need to be justified against the original unless the user asks.
- QA pass done (Lighthouse mobile emulation): Performance 88, A11y 96, Best-practices 100, SEO 100; `npm audit` 0 vulns; lint clean. Remaining known: color-contrast fails on the original's brand colors (blue `#26adf4` headings, white text on `#737373` work band) — left as-is; darkening is the fix if the user wants 100.
- Images converted to `next/image` (logo, work photos/screenshots, project images, eu.jpg, footer logo) with `sizes`; hero Image has `priority`. This cut total byte weight and raised LCP ~6.9s → 3.8s.

## Conventions
- Keep the original's look-and-feel/layout unless an improvement intentionally changes it.
- Verify changes: `npm run build`, plus headless Chrome CDP probes (scripts in `C:\Users\victo\AppData\Local\Temp\opencode\`) against `http://localhost:3000` (dev server job `cdpdev`, port 3000).
- Commit style: plain conventional commits (`feat:`, `fix:`). Commit/push only when the user asks.
- No code comments unless asked. Keep responses short.

## Notable past fixes (reference)
- `scrollbarPadding: false` on all `Swal.fire` calls so the footer keeps full width when the alert hides the scrollbar.
- `.eu img { display: inline }` restores the white ring around the avatar (Tailwind preflight `display: block` broke border painting).
- Nav glass effect: `backdrop-filter` blur on `.navbar-default` and `.scrolled`.