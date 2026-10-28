"""Turns the FAUVE cheat sheet (Excel recipes + extra.txt) into inputs/1-scents.csv.

Run:  python scripts/cheatsheet-to-csv.py ["Z:/FAUVE/Cheat Sheet"]
      npm run scents

Needs openpyxl (pip install openpyxl). The CSV is overwritten, so hand corrections
belong in the rules below, not in the CSV.

The cheat sheet only gives each variant's ingredients and percentages. Everything the
Scent Finder needs (family, moods, places, time, intensity, top/heart/base) is derived
from the ingredients with the fixed table INGREDIENTS: each ingredient's traits are
weighted by its share of the recipe and the strongest traits win. Percentages never
leave this script; the site only shows ingredient names.
"""
import csv
import re
import sys
from collections import defaultdict
from pathlib import Path

import openpyxl

SRC = Path(sys.argv[1] if len(sys.argv) > 1 else 'Z:/FAUVE/Cheat Sheet')
OUT = Path(__file__).resolve().parent.parent / 'inputs' / '1-scents.csv'

# File -> series prefix for the id.
SERIES = {'Bold series': 'bold', 'Man parfume': 'man', 'Fruity floral': 'fruity-floral', 'Manis segar': 'manis-segar'}

# name: (display name, tier, family, mood, place, time, strength 1-3)
# Words must match data/finder.ts.
INGREDIENTS = {
    'white oud':      ('White oud', 'base', 'woody', 'bold', 'city', 'night', 3),
    'kayu':           ('Woods', 'base', 'woody', 'warm', 'forest', 'dusk', 2),
    'kayu cendana':   ('Sandalwood', 'base', 'woody', 'soft', 'study', 'dusk', 2),
    'vetiver':        ('Vetiver', 'base', 'woody', 'calm', 'forest', 'dusk', 2.5),
    'bambu':          ('Bamboo', 'heart', 'fresh', 'calm', 'forest', 'morning', 1.5),
    'saffron':        ('Saffron', 'heart', 'amber', 'bold', 'city', 'night', 3),
    'cinnamon':       ('Cinnamon', 'heart', 'amber', 'warm', 'study', 'dusk', 2.5),
    'jahe':           ('Ginger', 'top', 'fresh', 'bold', 'city', 'morning', 2),
    'white vanilla':  ('White vanilla', 'base', 'amber', 'soft', 'study', 'dusk', 2),
    'powdery':        ('Powdery musk', 'base', 'amber', 'soft', 'study', 'afternoon', 1.5),
    'kopi':           ('Coffee', 'base', 'gourmand', 'warm', 'study', 'night', 3),
    'coklat':         ('Chocolate', 'base', 'gourmand', 'warm', 'study', 'night', 2.5),
    'candy':          ('Candy', 'base', 'gourmand', 'soft', 'city', 'afternoon', 2),
    'ice cream':      ('Ice cream', 'base', 'gourmand', 'soft', 'coast', 'afternoon', 1.5),
    'popcorn':        ('Popcorn', 'base', 'gourmand', 'warm', 'city', 'afternoon', 2),
    'mawar':          ('Rose', 'heart', 'floral', 'soft', 'city', 'dusk', 2),
    'melati':         ('Jasmine', 'heart', 'floral', 'soft', 'forest', 'dusk', 2),
    'bunga orchid':   ('Orchid', 'heart', 'floral', 'soft', 'city', 'dusk', 2),
    'bunga sakura':   ('Sakura', 'heart', 'floral', 'soft', 'forest', 'morning', 1.5),
    'bunga':          ('White florals', 'heart', 'floral', 'soft', 'forest', 'afternoon', 1.5),
    'orange blossom': ('Orange blossom', 'heart', 'floral', 'calm', 'coast', 'morning', 1.5),
    'lavender':       ('Lavender', 'heart', 'floral', 'calm', 'forest', 'dusk', 1.5),
    'peony':          ('Peony', 'heart', 'floral', 'soft', 'forest', 'afternoon', 1.5),
    'cempaka':        ('Champaca', 'heart', 'floral', 'warm', 'forest', 'dusk', 2),
    'aquatic':        ('Aquatic', 'top', 'fresh', 'calm', 'coast', 'morning', 1),
    'lemon':          ('Lemon', 'top', 'fresh', 'calm', 'coast', 'morning', 1),
    'jeruk':          ('Orange', 'top', 'fresh', 'warm', 'coast', 'morning', 1),
    'mint':           ('Mint', 'top', 'fresh', 'calm', 'coast', 'morning', 1),
    'daun kelor':     ('Moringa leaf', 'top', 'fresh', 'calm', 'forest', 'morning', 1),
    'tea':            ('Tea', 'heart', 'fresh', 'calm', 'study', 'afternoon', 1),
    'peach tea':      ('Peach tea', 'heart', 'fresh', 'calm', 'study', 'afternoon', 1),
    'mango tea':      ('Mango tea', 'heart', 'fresh', 'calm', 'coast', 'afternoon', 1),
    'buah pear':      ('Pear', 'top', 'fresh', 'calm', 'forest', 'morning', 1.5),
    'apple':          ('Apple', 'top', 'fresh', 'calm', 'forest', 'morning', 1.5),
    'melon':          ('Melon', 'top', 'fresh', 'calm', 'coast', 'afternoon', 1.5),
    'buah nanas':     ('Pineapple', 'top', 'fresh', 'warm', 'coast', 'afternoon', 1.5),
    'leci':           ('Lychee', 'top', 'floral', 'soft', 'coast', 'afternoon', 1.5),
    'peach':          ('Peach', 'top', 'gourmand', 'soft', 'coast', 'afternoon', 1.5),
    'mangga':         ('Mango', 'top', 'gourmand', 'warm', 'coast', 'afternoon', 1.5),
    'strawberry':     ('Strawberry', 'top', 'gourmand', 'soft', 'city', 'afternoon', 1.5),
    'raspberry':      ('Raspberry', 'top', 'gourmand', 'bold', 'city', 'dusk', 1.5),
}
# Spellings used in the cheat sheet.
ALIASES = {'bambo': 'bambu', 'bamboo': 'bambu', 'pear': 'buah pear', 'rose': 'mawar', 'ornage blossom': 'orange blossom'}


# Cheat-sheet name -> FAUVE name. Calm, two-word, earth/wood/light imagery, no hype words
# (no "Signature", "Intense", "Power", "Man"). Ids follow the new names.
RENAMES = {
    'Oud Saffron Intense': 'Saffron Ember',
    'Dark Coffee Woods': 'Dark Roast',
    'Leather Vanilla': 'Burnished Oud',
    'Spiced Tobacco Woods': 'Ash Grove',
    'Rose Oud Statement': 'Dusk Rose',
    'Saffron Sandalwood': 'Tawny Sandal',
    'Smoky Coffee Vanilla': 'Slow Ember',
    'Dark Chocolate Oud': 'Cocoa Bark',
    'Cinnamon Oud Reserve': 'Slow Hearth',
    'Vetiver Woods Intense': 'Root and Timber',
    'Lavender Oud Night': 'Night Lavender',
    'Jasmine Oud Noir': 'Jasmine Noir',
    'Orchid Dark Velvet': 'Velvet Orchid',
    'Rose Pepper Woods': 'Rose Timber',
    'Ginger Saffron Bold': 'Golden Root',
    'Cinnamon Cocoa Reserve': 'Cacao Spice',
    'Sweet Oud Signature': 'Soft Oud',
    'Oud Floral Power': 'Oud Blossom',
    'Dark Berry Woods': 'Bramble',
    'Spiced Pear Oud': 'Amber Orchard',
    'Mango Oud Intense': 'Sunbaked Oud',
    'Leather Coffee Woods': 'Driftwood Roast',
    'Rose Cinnamon Noir': 'Rose Ash',
    'Vanilla Vetiver Deep': 'Vanilla Root',
    'Oud Aquatic Power': 'Salt and Oud',
    'Bold Citrus Woods': 'Bitter Citrus',
    'Saffron Rose Velvet': 'Saffron Petal',
    'Dark Vanilla Woods': 'Dark Vanilla',
    'Coffee Cinnamon Intense': 'Spiced Roast',
    'Oud Sakura Noir': 'Black Sakura',
    'Rich Mango Spice': 'Ripe Spice',
    'Tobacco Woods Accord': 'Dry Timber',
    'Bold Jasmine Woods': 'Jasmine Bark',
    'Dark Orchid Oud': 'Orchid Shadow',
    'Raspberry Saffron Oud': 'Red Saffron',
    'Chocolate Sandalwood': 'Warm Sandal',
    'Ginger Vetiver Reserve': 'Ginger Root',
    'Magic Bold Signature': 'Tawny Oud',
    'Rich Boss': 'Oud Grove',
    'Gentleman Woods': 'Quiet Sandal',
    'Blue Ocean Man': 'Open Water',
    'Citrus Vetiver': 'Citrus Root',
    'Oud Saffron Man': 'Saffron Dune',
    'Coffee Leather Woods': 'Morning Roast',
    'Lavender Night': 'Violet Hour',
    'Spicy Gentleman': 'Spice Road',
    'Marine Woods': 'Sea Timber',
    'Dark Vanilla Man': 'Amber Shade',
    'Green Bamboo': 'Green Stalk',
    'Mandarin Woods': 'Mandarin Grove',
    'Saffron Vetiver': 'Saffron Field',
    'Bold Rose Woods': 'Rose Bark',
    'Aquatic Lavender': 'Lavender Tide',
    'Fresh Ginger Woods': 'Ginger Dew',
    'Cocoa Woods': 'Bitter Cocoa',
    'Pear Cedar Fresh': 'Pear Branch',
    'Pineapple Marine': 'Tidepool',
    'Apple Vetiver': 'Orchard Root',
    'Mango Woods': 'Sunlit Timber',
    'Ocean Saffron': 'Salted Saffron',
    'Dark Chocolate Spice': 'Dark Cacao',
    'Powdery Woods Man': 'Soft Timber',
    'Jasmine Woods': 'Jasmine Grain',
    'Orange Blossom Man': 'Citrus Blossom',
    'Mint Ocean Sport': 'Cool Shore',
    'Peach Tea Woods': 'Quiet Tea',
    'Raspberry Oud': 'Red Oud',
    'Sakura Woods': 'Pale Sakura',
    'Cinnamon Sandalwood': 'Cinnamon Dust',
    'Vetiver Reserve': 'Vetiver Stone',
    'Leatherless Oud Accord': 'Bare Oud',
    'Tropical Blue Man': 'Island Haze',
    'Clean White Woods': 'White Driftwood',
    'Midnight Coffee Oud': 'Midnight Roast',
    'Spiced Citrus Man': 'Spiced Peel',
    'Magic Man Signature': 'Tawny Light',
    'Pear Blossom': 'Pear Blossom',
    'Lychee Jasmine': 'White Lychee',
    'Sakura Citrus': 'Sakura Light',
    'Rose Raspberry Fresh': 'Rose Berry',
    'Peach Blossom': 'Peach Bloom',
    'Apple Jasmine': 'Apple Petal',
    'Strawberry Rose': 'Pink Garden',
    'Mango Orchid': 'Orchid Sun',
    'Pineapple Blossom': 'Sunlit Pineapple',
    'Melon Sakura': 'Melon Petal',
    'Lemon Jasmine Breeze': 'Lemon Breeze',
    'Raspberry Orchid': 'Berry Orchid',
    'Orange Blossom Pear': 'Orange Bloom',
    'Peach Tea Floral': 'Peach Tea',
    'Mango Blossom Fresh': 'Mango Bloom',
    'Pear Rose Water': 'Rose Water',
    'Lychee Sakura': 'Spring Lychee',
    'Apple Blossom Citrus': 'Apple Bloom',
    'Strawberry Jasmine': 'Jasmine Berry',
    'Peach Rose Splash': 'Peach Rose',
    'Pineapple Jasmine': 'Golden Jasmine',
    'Melon Orange Blossom': 'Melon Bloom',
    'Raspberry Sakura': 'Pink Sakura',
    'Mango Rose Fresh': 'Mango Rose',
    'Citrus Floral Garden': 'Citrus Garden',
    'Pear Orchid Breeze': 'Orchid Breeze',
    'Lychee Orange Blossom': 'Lychee Bloom',
    'Peach Sakura Water': 'Sakura Water',
    'Apple Rose Fresh': 'Apple Rose',
    'Strawberry Orchid': 'Orchid Berry',
    'Mango Jasmine Breeze': 'Jasmine Breeze',
    'Raspberry Orange Blossom': 'Berry Bloom',
    'Peach Pear Floral': 'Orchard Bloom',
    'Sakura Lychee Fresh': 'Sakura Morning',
    'Tropical Floral Splash': 'Tropic Bloom',
    'Melon Jasmine Dew': 'Jasmine Dew',
    'Lemon Rose Petals': 'Lemon Petal',
    'Fruity Floral Signature': 'Tawny Garden',
    'Vanilla Coffee': 'Vanilla Roast',
    'Strawberry Cream': 'Soft Strawberry',
    'Peach Vanilla': 'Peach Silk',
    'Chocolate Velvet': 'Cocoa Velvet',
    'Raspberry Candy': 'Berry Sugar',
    'Mango Cream': 'Sunny Cream',
    'Pear Vanilla Musk': 'Pear Musk',
    'Sakura Sweet': 'Sweet Sakura',
    'Jasmine Vanilla': 'White Jasmine',
    'Rose Candy': 'Rose Sugar',
    'Orchid Vanilla': 'Orchid Cream',
    'White Oud Vanilla': 'White Oud',
    'Sweet Sandalwood': 'Sandal Silk',
    'Cinnamon Vanilla': 'Warm Cinnamon',
    'Saffron Amber Sweet': 'Saffron Amber',
    'Popcorn Vanilla': 'Toasted Cream',
    'Candy Powder': 'Sugar Dust',
    'Lavender Vanilla': 'Soft Lavender',
    'Coffee Candy': 'Coffee Sugar',
    'Mango Tea Vanilla': 'Mango Tea',
    'Lychee Rose': 'Pale Rose',
    'Apple Candy Woods': 'Orchard Sugar',
    'Melon Ice Cream': 'Melon Cream',
    'Pineapple Vanilla': 'Golden Pineapple',
    'Orange Blossom Cream': 'Blossom Cream',
    'Peach Tea Candy': 'Tea Sugar',
    'Lemon Vanilla Sugar': 'Lemon Sugar',
    'Sweet Aquatic Vanilla': 'Soft Tide',
    'Mint Vanilla Cream': 'Cool Cream',
    'Ginger Spice Vanilla': 'Warm Spice',
    'Moringa Soft Vanilla': 'Moringa Silk',
    'Bamboo Vanilla Woods': 'Pale Bamboo',
    'Vetiver Vanilla Woods': 'Soft Vetiver',
    'Sweet Floral Bouquet': 'Soft Bouquet',
    'Fruity White Oud': 'Pale Oud',
    'Cinnamon Chocolate': 'Cinnamon Cocoa',
    'Tropical Ice Cream': 'Tropic Cream',
    'Candy Woody Signature': 'Tawny Sugar',
    'Segar Manis': 'Sweet Morning',
    'Segar': 'Green Morning',
    'Floral': 'Garden Rose',
    'Fruity': 'Berry Orchard',
    'Elegant Best': 'Tawny Peach',
}


def ingredient(raw):
    key = re.sub(r'\s+', ' ', raw.replace('\u2060', '').strip().lower())
    key = ALIASES.get(key, key)
    if key not in INGREDIENTS:
        raise SystemExit(f'Unknown ingredient "{raw}": add it to INGREDIENTS')
    return key


def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


def read_excel(path):
    """Yields (name, [(ingredient, share)]) from the 'Ringkasan' sheet."""
    ws = openpyxl.load_workbook(path, data_only=True).worksheets[0]
    for row in ws.iter_rows(min_row=2, values_only=True):
        if not row[0]:
            continue
        name = re.sub(r'^\d+\.\s*', '', str(row[0])).strip()
        parts = [re.match(r'(.+?)\s+([\d.]+)%', p.strip()).groups() for p in str(row[1]).split('+')]
        yield name, [(ingredient(i), float(v)) for i, v in parts]


def read_extra(path):
    """extra.txt: a heading line, then 'ingredient : 3 ml' or 'ingredient 3 ml' lines."""
    name, parts = None, []
    for line in path.read_text(encoding='utf8').splitlines():
        line = line.replace('\u2060', '').strip().lstrip('-').strip()
        if not line:
            continue
        m = re.match(r'(.+?)\s*:?\s*([\d.]+)\s*ml$', line, re.I)
        if m:
            parts.append((ingredient(m.group(1)), float(m.group(2))))
        else:
            if name and parts:
                yield name, parts
            name, parts = line.title(), []
    if name and parts:
        yield name, parts


def pick(scores, keep=1, ratio=0.6):
    """Strongest trait, plus runners-up within `ratio` of it (up to `keep`)."""
    ranked = sorted(scores.items(), key=lambda kv: -kv[1])
    return [k for k, v in ranked[:keep] if v >= ranked[0][1] * ratio]


def row(sid, name, parts):
    total = sum(v for _, v in parts)
    fam, mood, place, time = (defaultdict(float) for _ in range(4))
    strength = 0.0
    tiers = {'top': [], 'heart': [], 'base': []}
    for key, v in sorted(parts, key=lambda p: -p[1]):
        label, tier, f, mo, pl, ti, st = INGREDIENTS[key]
        w = v / total
        fam[f] += w; mood[mo] += w; place[pl] += w; time[ti] += w
        strength += w * st
        tiers[tier].append(label)
    intensity = 'close' if strength < 1.6 else 'present' if strength < 2.2 else 'lingering'
    return {
        'id': sid, 'name': name, 'scent_family': pick(fam)[0],
        'top_notes': '; '.join(tiers['top']), 'heart_notes': '; '.join(tiers['heart']), 'base_notes': '; '.join(tiers['base']),
        'moods': '|'.join(pick(mood, 2)), 'places': '|'.join(pick(place, 2)), 'time_of_day': pick(time)[0],
        'intensity': intensity, 'short_description': '',
    }


rows = []
for path in sorted(SRC.glob('*.xlsx')):
    prefix = SERIES[path.stem.strip()]
    rows += [row(f'{prefix}-{slug(RENAMES[n])}', RENAMES[n], p) for n, p in read_excel(path)]
if (SRC / 'extra.txt').exists():
    rows += [row(f'extra-{slug(RENAMES[n])}', RENAMES[n], p) for n, p in read_extra(SRC / 'extra.txt')]

with OUT.open('w', newline='', encoding='utf8') as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0]))
    w.writeheader()
    w.writerows(rows)
print(f'{len(rows)} scents written to {OUT}')
