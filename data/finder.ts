import type { FinderQuestion } from '@/lib/types';

/* Scent Finder questions. The `value` of each option is the word the scent catalogue
   must use in inputs/1-scents.csv for that column, so the two stay in step:
     mood -> moods   place -> places   time -> time_of_day
     like / avoid -> scent_family      intensity -> intensity
   The practical questions at the end: daypart maps onto `time` (day = morning/afternoon,
   night = dusk/night), projection and sillage each map onto `intensity` (see lib/match.ts).
   Longevity is not asked, it follows the concentration chosen when ordering. The `avoid`
   answer is a hard rule: that family is removed. occasion is not scored yet; it is kept in
   the WhatsApp summary. character allows several answers. Keep the wording plain and direct. */
export const finder: FinderQuestion[] = [
  { key: 'mood', eyebrow: 'Mood', question: 'What mood do you want from your perfume?', options: [
    { value: 'warm', label: 'Warm and cozy', image: '/img/finder/coffee.jpg' },
    { value: 'calm', label: 'Calm and fresh', image: '/img/finder/lavender.jpg' },
    { value: 'bold', label: 'Strong and confident', image: '/img/finder/oud.jpg' },
    { value: 'soft', label: 'Soft and gentle', image: '/img/finder/vanilla.jpg' } ] },
  { key: 'place', eyebrow: 'Place', question: 'Which place do you like most?', options: [
    { value: 'forest', label: 'Forest after rain', image: '/img/finder/forest.jpg' },
    { value: 'coast', label: 'Sunny beach', image: '/img/finder/coast.jpg' },
    { value: 'study', label: 'Quiet library', image: '/img/finder/study.jpg' },
    { value: 'city', label: 'City at night', image: '/img/finder/city.jpg' } ] },
  { key: 'time', eyebrow: 'Time of day', question: 'What time of day do you like best?', options: [
    { value: 'morning', label: 'Early morning', image: '/img/finder/morning.jpg' },
    { value: 'afternoon', label: 'Afternoon', image: '/img/finder/afternoon.jpg' },
    { value: 'dusk', label: 'Sunset', image: '/img/finder/dusk.jpg' },
    { value: 'night', label: 'Late night', image: '/img/finder/night.jpg' } ] },
  { key: 'like', eyebrow: 'Favorite scent', question: 'Which scent do you like most?', options: [
    { value: 'woody', label: 'Woody', image: '/img/finder/oud.jpg' },
    { value: 'floral', label: 'Floral and herbal', image: '/img/finder/lavender.jpg' },
    { value: 'gourmand', label: 'Coffee and food-like', image: '/img/finder/coffee.jpg' },
    { value: 'amber', label: 'Sweet and warm', image: '/img/finder/vanilla.jpg' },
    { value: 'fresh', label: 'Fresh and green', image: '/img/finder/forest.jpg' } ] },
  { key: 'avoid', eyebrow: 'Avoid', question: 'Is there a scent you do not want?', options: [
    { value: 'woody', label: 'Woody', image: '/img/finder/oud.jpg' },
    { value: 'floral', label: 'Floral and herbal', image: '/img/finder/lavender.jpg' },
    { value: 'gourmand', label: 'Coffee and food-like', image: '/img/finder/coffee.jpg' },
    { value: 'amber', label: 'Sweet and warm', image: '/img/finder/vanilla.jpg' },
    { value: 'none', label: 'No, I like them all', image: '/img/photo/vision.jpg' } ] },
  { key: 'intensity', eyebrow: 'Strength', question: 'How strong should it be?', options: [
    { value: 'close', label: 'Light, close to my skin', image: '/img/photo/fur.jpg' },
    { value: 'present', label: 'Medium, noticed when near', image: '/img/photo/light.jpg' },
    { value: 'lingering', label: 'Strong, stays after I leave', image: '/img/photo/earth.jpg' } ] },
  { key: 'daypart', eyebrow: 'When you wear it', question: 'When do you usually wear perfume?', options: [
    { value: 'day', label: 'Morning and daytime', image: '/img/finder/morning.jpg' },
    { value: 'night', label: 'Evening and night', image: '/img/finder/night.jpg' } ] },
  { key: 'occasion', eyebrow: 'Occasion', question: 'What do you wear it for?', options: [
    { value: 'daily', label: 'Everyday', image: '/img/finder/coast.jpg' },
    { value: 'event', label: 'Special events', image: '/img/finder/city.jpg' } ] },
  { key: 'character', eyebrow: 'Scent type', multi: true, question: 'What scents do you like? Pick all that apply.', options: [
    { value: 'sweet', label: 'Sweet', image: '/img/finder/vanilla.jpg' },
    { value: 'fresh', label: 'Fresh', image: '/img/finder/forest.jpg' },
    { value: 'woody', label: 'Woody or spicy', image: '/img/finder/oud.jpg' },
    { value: 'floral', label: 'Floral', image: '/img/finder/lavender.jpg' },
    { value: 'hungry', label: 'Food-like, makes you hungry', image: '/img/finder/coffee.jpg' } ] },
  { key: 'projection', eyebrow: 'Projection', question: 'How far should people smell it?', options: [
    { value: 'close', label: 'Only when someone is close', image: '/img/photo/fur.jpg' },
    { value: 'present', label: 'Within arm’s length', image: '/img/photo/story.jpg' },
    { value: 'lingering', label: 'Across the room', image: '/img/photo/statement.jpg' } ] },
  { key: 'sillage', eyebrow: 'Trail', question: 'Should it leave a trail when you walk past?', options: [
    { value: 'close', label: 'Barely, a faint trace', image: '/img/photo/vision.jpg' },
    { value: 'present', label: 'A little', image: '/img/photo/contact.jpg' },
    { value: 'lingering', label: 'Yes, a clear trail', image: '/img/photo/light.jpg' } ] },
];
