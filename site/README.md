# FAUVE website

Six static pages built on the FAUVE design system. No build step: open `index.html` in a browser, or upload the whole folder to any static host.

## Pages

| File | Page |
|---|---|
| `index.html` | Home |
| `about.html` | About |
| `perfume-bar.html` | Perfume Bar |
| `manufacturing.html` | Manufacturing |
| `find-your-scent.html` | Scent Finder |
| `contact.html` | Contact |

## Filling in the missing content

Nothing on the site is invented. Where content does not exist yet, the page says so quietly and points to WhatsApp.

1. **Contact** — fill `data/contact.js` from `inputs/3-contact.md`. Until `whatsapp` has a number, the WhatsApp buttons are disabled or hidden and the contact list does not show.
2. **Packages and pricing** — fill `data/packages.js` from `inputs/2-services-and-pricing.md`. Each list renders as price cards; while a list is empty, its page shows a short "being finalised" note.
3. **Scents** — write the catalogue in `inputs/1-scents.csv`, then run
   `python tools/build_scents.py ../inputs/1-scents.csv`
   to regenerate `data/scents.js`. The Scent Finder needs at least three scents; until then it collects the visitor's answers and offers to send them over WhatsApp.

In the CSV, use the words the finder's questions use (they are listed at the top of `data/finder.js`): moods `warm calm bold soft`, places `forest coast study city`, time of day `morning afternoon dusk night`, families `woody floral gourmand amber fresh`, intensity `close present lingering`. Separate several moods or places with `|`, and notes with `;`. An optional `image` column takes a path such as `assets/img/photo/ingredient-oud.jpg`.

## Design system

`assets/css/tokens.css` and `assets/css/components.css` come from the FAUVE design system. Change values there, in the design system, and copy the files across — not here.

## Images

All imagery is the brand's own: the bottle and ingredient renders, the leaf campaign artwork and the 30/50 ml mockups. The brand guideline's photography (the cave, stones, driftwood and moodboard) is still in Canva; when it is exported, it should replace `hero-bottle.jpg` and the story images.
