import type { FinderQuestion } from '@/lib/types';

/* Scent Finder questions. The `value` of each option is the word the scent catalogue
   must use in inputs/1-scents.csv for that column, so the two stay in step:
     mood -> moods   like / avoid -> scent_family   intensity, projection, sillage -> intensity
   daypart maps onto `time_of_day` (day = morning/afternoon, night = dusk/night, all = no preference).
   `like` takes one answer and is followed by one of the `followUps` below, chosen by the family
   picked. `avoid` allows several answers and is a hard rule: those families are removed.
   occasion is not scored yet; it is kept in the WhatsApp summary. Longevity is not asked, it
   follows the concentration chosen when ordering. Keep the wording plain and direct. */
export const finder: FinderQuestion[] = [
  { key: 'mood', eyebrow: 'Mood', question: 'What kind of mood do you want your perfume to have?', options: [
    { value: 'warm', label: 'Warm and cozy', image: '/img/finder/coffee.jpg' },
    { value: 'calm', label: 'Calm and fresh', image: '/img/finder/lavender.jpg' },
    { value: 'bold', label: 'Strong and confident', image: '/img/finder/oud.jpg' },
    { value: 'soft', label: 'Soft and gentle', image: '/img/finder/vanilla.jpg' } ] },
  { key: 'like', eyebrow: 'Notes you like', question: 'Which perfume note(s) are you mostly drawn to?', options: [
    { value: 'woody', label: 'Woody', image: '/img/finder/oud.jpg' },
    { value: 'floral', label: 'Floral and herbal', image: '/img/finder/lavender.jpg' },
    { value: 'gourmand', label: 'Coffee and food-like', image: '/img/finder/coffee.jpg' },
    { value: 'amber', label: 'Sweet and warm', image: '/img/finder/vanilla.jpg' },
    { value: 'fresh', label: 'Fresh and green', image: '/img/finder/forest.jpg' } ] },
  { key: 'avoid', eyebrow: 'Notes you avoid', multi: true, question: 'On the contrary, which scent notes you can’t stand? You can choose more than one', options: [
    { value: 'woody', label: 'Woody', image: '/img/finder/oud.jpg' },
    { value: 'floral', label: 'Floral and herbal', image: '/img/finder/lavender.jpg' },
    { value: 'gourmand', label: 'Coffee and food-like', image: '/img/finder/coffee.jpg' },
    { value: 'amber', label: 'Sweet and warm', image: '/img/finder/vanilla.jpg' },
    { value: 'none', label: 'None, I like them all', image: '/img/photo/vision.jpg' } ] },
  { key: 'intensity', eyebrow: 'Strength', question: 'How rich and/or bold should your signature scent be?', options: [
    { value: 'close', label: 'Light and subtle', image: '/img/photo/fur.jpg' },
    { value: 'present', label: 'Balanced', image: '/img/photo/light.jpg' },
    { value: 'lingering', label: 'Rich and bold', image: '/img/photo/earth.jpg' } ] },
  { key: 'daypart', eyebrow: 'When you wear it', question: 'How do you usually wear your perfume?', options: [
    { value: 'day', label: 'Day time', image: '/img/finder/morning.jpg' },
    { value: 'night', label: 'Night time', image: '/img/finder/night.jpg' },
    { value: 'all', label: 'Throughout the entire day', image: '/img/finder/afternoon.jpg' } ] },
  { key: 'occasion', eyebrow: 'Occasion', question: 'How do you usually wear your perfume?', options: [
    { value: 'daily', label: 'Daily', image: '/img/finder/coast.jpg' },
    { value: 'event', label: 'Only on special occasions', image: '/img/finder/city.jpg' } ] },
  { key: 'projection', eyebrow: 'Projection', question: 'How far do people have to stand before they can sniff your scent?', options: [
    { value: 'close', label: 'Only when someone is close', image: '/img/photo/fur.jpg' },
    { value: 'present', label: 'Within arm’s length', image: '/img/photo/story.jpg' },
    { value: 'lingering', label: 'Across the room', image: '/img/photo/statement.jpg' } ] },
  { key: 'sillage', eyebrow: 'Trail', question: 'Would you like your scent to linger even when you’ve walked away?', options: [
    { value: 'lingering', label: 'Yes', image: '/img/photo/light.jpg' },
    { value: 'close', label: 'No', image: '/img/photo/vision.jpg' } ] },
];

/* Asked right after `like`. The option values are the group names in lib/notes.ts, and a
   matching group adds points. "any" adds none. Photos are placeholders from the existing set. */
const any = { value: 'any', label: 'No preference', image: '/img/photo/vision.jpg' };
export const followUps: Record<string, FinderQuestion> = {
  woody: { key: 'detail', eyebrow: 'Woody', question: 'What kind of woody?', options: [
    { value: 'sandalwood', label: 'Creamy sandalwood', image: '/img/photo/wood.jpg' },
    { value: 'vetiver', label: 'Earthy vetiver', image: '/img/photo/earth.jpg' },
    { value: 'spicy', label: 'Warm and spicy', image: '/img/photo/contact.jpg' },
    { value: 'sweet', label: 'Sweet, like vanilla or coffee', image: '/img/finder/vanilla.jpg' },
    any ] },
  floral: { key: 'detail', eyebrow: 'Floral', question: 'What kind of floral?', options: [
    { value: 'fruity', label: 'Fruity floral', image: '/img/finder/afternoon.jpg' },
    { value: 'white', label: 'White flowers', image: '/img/finder/morning.jpg' },
    { value: 'rose', label: 'Rose', image: '/img/finder/dusk.jpg' },
    { value: 'powdery', label: 'Soft and powdery', image: '/img/photo/fur.jpg' },
    any ] },
  gourmand: { key: 'detail', eyebrow: 'Food-like', question: 'Which food-like note do you prefer?', options: [
    { value: 'chocolate', label: 'Chocolate', image: '/img/photo/ingredient-coffee.jpg' },
    { value: 'coffee', label: 'Coffee', image: '/img/finder/coffee.jpg' },
    { value: 'candy', label: 'Candy and fruit', image: '/img/finder/dusk.jpg' },
    any ] },
  amber: { key: 'detail', eyebrow: 'Sweet', question: 'What kind of sweet?', options: [
    { value: 'powdery', label: 'Soft and powdery', image: '/img/photo/fur.jpg' },
    { value: 'woody', label: 'Woody', image: '/img/photo/wood.jpg' },
    { value: 'fruity', label: 'Fruity and floral', image: '/img/finder/afternoon.jpg' },
    any ] },
  fresh: { key: 'detail', eyebrow: 'Fresh', question: 'What kind of fresh?', options: [
    { value: 'citrus', label: 'Citrus, like lemon and orange', image: '/img/finder/morning.jpg' },
    { value: 'fruity', label: 'Fruity, like pear and mango', image: '/img/finder/afternoon.jpg' },
    { value: 'floral', label: 'Floral', image: '/img/finder/lavender.jpg' },
    { value: 'woods', label: 'Clean woods', image: '/img/finder/forest.jpg' },
    any ] },
};
