import type { Scent } from './types';

/* Follow-up groups for the "notes you like" question. Each group is found in a scent's own
   top, heart and base notes, so no extra data is needed in the catalogue. Notes that nearly
   every scent in a family has (oud in woody, vanilla in amber, aquatic in fresh) are left out
   on purpose: they would not narrow anything down. */
export const NOTE_GROUPS: Record<string, Record<string, RegExp>> = {
  woody: {
    sandalwood: /sandalwood/,
    vetiver: /vetiver/,
    spicy: /saffron|cinnamon|ginger|pepper|cardamom|clove/,
    sweet: /vanilla|chocolate|coffee|caramel/,
  },
  floral: {
    fruity: /lychee|peach|pear|mango|berry|apple/,
    white: /jasmine|orange blossom|lily|tuberose|white florals/,
    rose: /rose/,
    powdery: /musk|peony|sakura|powder|iris/,
  },
  gourmand: {
    chocolate: /chocolate|cocoa/,
    coffee: /coffee/,
    candy: /candy|ice cream|strawberry|peach|mango|caramel|berry/,
  },
  amber: {
    powdery: /musk/,
    woody: /sandalwood/,
    fruity: /pear|mango|peach|rose|jasmine|orchid/,
  },
  fresh: {
    citrus: /lemon|orange(?! blossom)|lime|grapefruit|mandarin|bergamot|yuzu/,
    fruity: /pear|mango|pineapple|raspberry|peach|apple|melon|strawberry|lychee|berry/,
    floral: /orange blossom|jasmine|rose|peony|sakura|lily|freesia/,
    woods: /vetiver|sandalwood|woods|musk|cedar/,
  },
};

/** True when the scent's notes fit the chosen follow-up group of its own family. */
export function hasNoteGroup(scent: Scent, group: string): boolean {
  const re = NOTE_GROUPS[scent.family]?.[group];
  return !!re && re.test([scent.top, scent.heart, scent.base].join(', ').toLowerCase());
}
