import type { FinderQuestion } from '@/lib/types';

/* Scent Finder questions. The `value` of each option is the word the scent catalogue
   must use in inputs/1-scents.csv for that column, so the two stay in step:
     mood -> moods   place -> places   time -> time_of_day
     like / avoid -> scent_family      intensity -> intensity */
export const finder: FinderQuestion[] = [
  { key: 'mood', eyebrow: 'Mood', question: 'How do you want to feel when you wear it?', options: [
    { value: 'warm', label: 'Warm and close', image: '/img/finder/coffee.jpg' },
    { value: 'calm', label: 'Calm and clear', image: '/img/finder/lavender.jpg' },
    { value: 'bold', label: 'Deep and certain', image: '/img/finder/oud.jpg' },
    { value: 'soft', label: 'Soft and slow', image: '/img/finder/vanilla.jpg' } ] },
  { key: 'place', eyebrow: 'Place', question: 'Which place feels most like you?', options: [
    { value: 'forest', label: 'A forest after rain', image: '/img/finder/forest.jpg' },
    { value: 'coast', label: 'A sun-washed coast', image: '/img/finder/coast.jpg' },
    { value: 'study', label: 'A quiet room of books', image: '/img/finder/study.jpg' },
    { value: 'city', label: 'A city at night', image: '/img/finder/city.jpg' } ] },
  { key: 'time', eyebrow: 'Time of day', question: 'When do you feel most yourself?', options: [
    { value: 'morning', label: 'Early morning', image: '/img/finder/morning.jpg' },
    { value: 'afternoon', label: 'Long afternoon', image: '/img/finder/afternoon.jpg' },
    { value: 'dusk', label: 'Dusk', image: '/img/finder/dusk.jpg' },
    { value: 'night', label: 'Late night', image: '/img/finder/night.jpg' } ] },
  { key: 'like', eyebrow: 'What you love', question: 'Which of these draws you in?', options: [
    { value: 'woody', label: 'Wood and resin', image: '/img/finder/oud.jpg' },
    { value: 'floral', label: 'Flowers and herbs', image: '/img/finder/lavender.jpg' },
    { value: 'gourmand', label: 'Roasted and edible', image: '/img/finder/coffee.jpg' },
    { value: 'amber', label: 'Amber and sweetness', image: '/img/finder/vanilla.jpg' },
    { value: 'fresh', label: 'Green and fresh', image: '/img/finder/forest.jpg' } ] },
  { key: 'avoid', eyebrow: 'What you leave out', question: 'Is there one you would rather not wear?', options: [
    { value: 'woody', label: 'Wood and resin', image: '/img/finder/oud.jpg' },
    { value: 'floral', label: 'Flowers and herbs', image: '/img/finder/lavender.jpg' },
    { value: 'gourmand', label: 'Roasted and edible', image: '/img/finder/coffee.jpg' },
    { value: 'amber', label: 'Amber and sweetness', image: '/img/finder/vanilla.jpg' },
    { value: 'none', label: 'I like them all', image: '/img/photo/vision.jpg' } ] },
  { key: 'intensity', eyebrow: 'Presence', question: 'How should it stay with you?', options: [
    { value: 'close', label: 'Close to the skin', image: '/img/photo/fur.jpg' },
    { value: 'present', label: 'Noticed in passing', image: '/img/photo/light.jpg' },
    { value: 'lingering', label: 'Remembered after you leave', image: '/img/photo/earth.jpg' } ] },
];
