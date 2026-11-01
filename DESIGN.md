# Northwind design

Direction: a printed monograph blown up to poster scale.
Fonts: Familjen Grotesk (display, tight and heavy), Newsreader (text).
Tokens: ink `#121211`, paper `#F1EDE4`, stone `#8C877B`, signal `#E8400C` (accent).
Dark (default): paper type on ink ground. Light: ink type on paper ground.
Muted text is foreground mixed into background; stone is for rules only.
Layout: 12-column asymmetric grid. Type runs huge, work runs full bleed.
Photography: full-bleed editorial photos, local WebP files in `public/images/`. See `CREDITS.md`.
Spiral: one original orange coil in `public/spiral.svg`, tiled down every page behind the content.
Motion: GSAP with ScrollTrigger for scroll effects, Lenis for smooth scrolling, a signal curtain between
routes. The `motion` library is kept for small UI bits such as the filter underline.
All of it is off under reduced motion, which also stops the marquees and wraps them into static rows.
