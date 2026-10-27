import type { FinderQuestion } from '@/lib/types';

/* Scent Finder questions. The `value` of each option is the word the scent catalogue
   must use in inputs/1-scents.csv for that column, so the two stay in step:
     mood -> moods   place -> places   time -> time_of_day
     like / avoid -> scent_family      intensity -> intensity */
export const finder: FinderQuestion[] = [
  { key: 'mood', eyebrow: 'Mood', question: 'How do you want to feel when you wear it?', options: [
    { value: 'warm', label: 'Warm and close', image: '/img/photo/ingredient-coffee.jpg' },
    { value: 'calm', label: 'Calm and clear', image: '/img/photo/ingredient-lavender.jpg' },
    { value: 'bold', label: 'Deep and certain', image: '/img/photo/ingredient-oud.jpg' },
    { value: 'soft', label: 'Soft and slow', image: '/img/photo/ingredient-vanilla.jpg' } ] },
  { key: 'place', eyebrow: 'Place', question: 'Which place feels most like you?', options: [
    { value: 'forest', label: 'A forest after rain', image: '/img/photo/campaign-leaf.jpg' },
    { value: 'coast', label: 'A sun-washed coast', tint: 'sand' },
    { value: 'study', label: 'A quiet room of books', tint: 'clay' },
    { value: 'city', label: 'A city at night', tint: 'ash' } ] },
  { key: 'time', eyebrow: 'Time of day', question: 'When do you feel most yourself?', options: [
    { value: 'morning', label: 'Early morning', tint: 'sand' },
    { value: 'afternoon', label: 'Long afternoon', tint: 'olive' },
    { value: 'dusk', label: 'Dusk', tint: 'clay' },
    { value: 'night', label: 'Late night', tint: 'ash' } ] },
  { key: 'like', eyebrow: 'What you love', question: 'Which of these draws you in?', options: [
    { value: 'woody', label: 'Wood and resin', image: '/img/photo/ingredient-oud.jpg' },
    { value: 'floral', label: 'Flowers and herbs', image: '/img/photo/ingredient-lavender.jpg' },
    { value: 'gourmand', label: 'Roasted and edible', image: '/img/photo/ingredient-coffee.jpg' },
    { value: 'amber', label: 'Amber and sweetness', image: '/img/photo/ingredient-vanilla.jpg' },
    { value: 'fresh', label: 'Green and fresh', image: '/img/photo/campaign-leaf.jpg' } ] },
  { key: 'avoid', eyebrow: 'What you leave out', question: 'Is there one you would rather not wear?', options: [
    { value: 'woody', label: 'Wood and resin', image: '/img/photo/ingredient-oud.jpg' },
    { value: 'floral', label: 'Flowers and herbs', image: '/img/photo/ingredient-lavender.jpg' },
    { value: 'gourmand', label: 'Roasted and edible', image: '/img/photo/ingredient-coffee.jpg' },
    { value: 'amber', label: 'Amber and sweetness', image: '/img/photo/ingredient-vanilla.jpg' },
    { value: 'none', label: 'I like them all', tint: 'sand' } ] },
  { key: 'intensity', eyebrow: 'Presence', question: 'How should it stay with you?', options: [
    { value: 'close', label: 'Close to the skin', tint: 'sand' },
    { value: 'present', label: 'Noticed in passing', tint: 'olive' },
    { value: 'lingering', label: 'Remembered after you leave', tint: 'clay' } ] },
];
