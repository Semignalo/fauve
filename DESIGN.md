# FAUVE — Design System (tawny dusk)

Quiet, dark-warm editorial. One full-bleed image per section, big light type, almost no chrome. References studied: Byredo (full-bleed hero, giant wordmark over image, minimal menu) and Diptyque (large image panels with short captions).

## Color
| Role | Hex | Use |
|---|---|---|
| Ink | #16110E | page ground, header (solid), footer |
| Umber | #231A15 | alternate dark bands |
| Bone | #F1E9DA | text on dark |
| Bone soft | #CDBFA8 | secondary text on dark |
| Sand | #E9DDC6 | light band (moodboard, pricing) |
| Stone | #E5E3DB | light band (bottles) |
| Terracotta | #A05034 | one drenched closing band per page, progress line, selected state |
| Olive | #747B4D | reserved for fine details |
| Charcoal | #1D1D1D | text on sand and stone |

## Type
Inter, weight 300 for display and body, 400 for labels. Display `clamp(2.3rem, 6.4vw, 5.2rem)`, tracking -0.03em. Labels and links: 12px, uppercase, 0.2em tracking. No eyebrows above headings.

## Layout
- Bands with `clamp(88px, 14vw, 200px)` vertical padding, page gutter `clamp(20px, 4vw, 56px)`, content max 1600px.
- Home: full-bleed hero (giant white wordmark over the plate), statement band, three stacked sticky full-bleed panels (the signature scroll moment), moodboard strip, terracotta closing band.
- Inner pages: dark page head, full-bleed plate, offset two-column text and 4:5 plate, vision/mission pair, terracotta closing band.
- Rectangular everywhere. Hairline borders. No cards except price cards on sand.

## Components
- Header: fixed, Menu word left, white wordmark centre, "Find your scent" underlined right; solid ink after 40px of scroll. Menu is a full-screen ink panel with ruled list.
- Buttons: 12px uppercase outlined; primary is bone on dark, ink on light bands; hover turns terracotta.
- Plate: the image slot. A tawny gradient placeholder (canyon, amber, driftwood, stone, dune, grove, dusk, sand) with grain and a small "Placeholder" tag. Set `src` in `lib/images.ts` to swap in a real photograph; nothing else changes.
- Scent Finder: dark stage, 4:5 plate option cards, terracotta outline and check when selected, 1px terracotta progress line.

## Motion
Slow drift on the hero plate, stacked panel slide-over, reveal on scroll (fade and 28px rise, 1s ease-out), menu fade-down. All disabled under reduced motion.

## Imagery
All imagery is placeholder until real photography exists (canyon light, driftwood, river stones, dune grass, hides, amber glass). Bottle mockups (30 ml, 50 ml) remain on the Manufacturing page.
