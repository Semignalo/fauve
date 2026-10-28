# FAUVE website

Next.js (App Router, TypeScript), English only. Pages: Home, About, Perfume Bar, Manufacturing, Find your scent, Contact.

```
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # type check
npm test         # checks the scent matching rules
```

## Filling in the missing content

Nothing on the site is invented. Where content does not exist yet, the page says so quietly and points to WhatsApp.

| What | Where | Source |
|---|---|---|
| Contact details | `data/contact.ts` | `inputs/3-contact.md` |
| Packages and prices | `data/packages.ts` | `inputs/2-services-and-pricing.md` |
| Scent catalogue | `inputs/1-scents.csv`, then `npm run scents` | Cheat sheet (`Z:\FAUVE\Cheat Sheet`), via `scripts/cheatsheet-to-csv.py` |

The cheat sheet only lists ingredients and percentages. `scripts/cheatsheet-to-csv.py` derives family, moods, places, time, intensity and top/heart/base from a fixed ingredient table and overwrites the CSV, so correct the table there rather than the CSV. Percentages stay out of the site. Needs `pip install openpyxl`.

Until `whatsapp` has a number, WhatsApp buttons are hidden or disabled. The Scent Finder needs at least three scents; until then it collects answers and offers to send them over WhatsApp.

### Scent catalogue words
Use the same words as the finder questions (`data/finder.ts`): moods `warm calm bold soft`, places `forest coast study city`, time of day `morning afternoon dusk night`, scent family `woody floral gourmand amber fresh`, intensity `close present lingering`. Separate several moods or places with `|`, and notes with `;`. An optional `image` column takes a path such as `/img/photo/ingredient-oud.jpg`. Rows whose id starts with `example` are skipped.

## How the Scent Finder chooses
Fixed weights, no randomness (`lib/match.ts`): mood 3, family you love 3, place 2, time 1, intensity 1; a family you avoid is removed. The top three are shown, ties keep catalogue order.

## Domain
Set `NEXT_PUBLIC_SITE_URL` (for example in `.env.local`) to the real address so the sitemap and share links use it.

## Images
`public/img` holds the logo, bottle and ingredient images with their hidden provenance metadata removed. Replace `hero-bottle.jpg` and the story images with the brand photography when it is exported from Canva, and register new sizes in `lib/images.ts`.

## Design
`DESIGN.md` is the design brief. `app/styles/` holds the design system CSS (`tokens.css`, `components.css`, `site.css`).

`site/` is the earlier static export, kept only for reference. It can be deleted.
