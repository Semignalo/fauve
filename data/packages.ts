import type { Pack } from '@/lib/types';

/* FAUVE packages and pricing. Fill these from inputs/2-services-and-pricing.md.
   While a list is empty, its page shows a short note and a WhatsApp link instead of cards. */
export const packages: {
  perfumeBar: Pack[];
  perfumeBarNotes: string[];
  manufacturing: Pack[];
  manufacturingNotes: string[];
} = {
  perfumeBar: [],
  perfumeBarNotes: [], // e.g. ['Minimum 30 guests', 'Book four weeks ahead']
  manufacturing: [],
  manufacturingNotes: [], // e.g. ['Minimum order 100 units']
};
