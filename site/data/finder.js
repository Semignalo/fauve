/* Scent Finder questions. The `value` of each option is the word the scent catalogue
   must use in inputs/1-scents.csv for that column, so the two stay in step:
     mood    -> moods column        place -> places column
     time    -> time_of_day column  like / avoid -> scent_family column
     intensity -> intensity column
   `image` is optional; without one the card shows a tint (sand, olive, clay, ash). */
window.FAUVE_FINDER = [
  { key: 'mood', eyebrow: 'Mood', question: 'How do you want to feel when you wear it?', options: [
    { value: 'warm',  label: 'Warm and close',  image: 'assets/img/photo/ingredient-coffee.jpg' },
    { value: 'calm',  label: 'Calm and clear',  image: 'assets/img/photo/ingredient-lavender.jpg' },
    { value: 'bold',  label: 'Deep and certain', image: 'assets/img/photo/ingredient-oud.jpg' },
    { value: 'soft',  label: 'Soft and slow',   image: 'assets/img/photo/ingredient-vanilla.jpg' } ] },
  { key: 'place', eyebrow: 'Place', question: 'Which place feels most like you?', options: [
    { value: 'forest', label: 'A forest after rain', image: 'assets/img/photo/campaign-leaf.jpg' },
    { value: 'coast',  label: 'A sun-washed coast', tint: 'sand' },
    { value: 'study',  label: 'A quiet room of books', tint: 'clay' },
    { value: 'city',   label: 'A city at night', tint: 'ash' } ] },
  { key: 'time', eyebrow: 'Time of day', question: 'When do you feel most yourself?', options: [
    { value: 'morning',   label: 'Early morning', tint: 'sand' },
    { value: 'afternoon', label: 'Long afternoon', tint: 'olive' },
    { value: 'dusk',      label: 'Dusk', tint: 'clay' },
    { value: 'night',     label: 'Late night', tint: 'ash' } ] },
  { key: 'like', eyebrow: 'What you love', question: 'Which of these draws you in?', options: [
    { value: 'woody',    label: 'Wood and resin', image: 'assets/img/photo/ingredient-oud.jpg' },
    { value: 'floral',   label: 'Flowers and herbs', image: 'assets/img/photo/ingredient-lavender.jpg' },
    { value: 'gourmand', label: 'Roasted and edible', image: 'assets/img/photo/ingredient-coffee.jpg' },
    { value: 'amber',    label: 'Amber and sweetness', image: 'assets/img/photo/ingredient-vanilla.jpg' },
    { value: 'fresh',    label: 'Green and fresh', image: 'assets/img/photo/campaign-leaf.jpg' } ] },
  { key: 'avoid', eyebrow: 'What you leave out', question: 'Is there one you would rather not wear?', options: [
    { value: 'woody',    label: 'Wood and resin', image: 'assets/img/photo/ingredient-oud.jpg' },
    { value: 'floral',   label: 'Flowers and herbs', image: 'assets/img/photo/ingredient-lavender.jpg' },
    { value: 'gourmand', label: 'Roasted and edible', image: 'assets/img/photo/ingredient-coffee.jpg' },
    { value: 'amber',    label: 'Amber and sweetness', image: 'assets/img/photo/ingredient-vanilla.jpg' },
    { value: 'none',     label: 'I like them all', tint: 'sand' } ] },
  { key: 'intensity', eyebrow: 'Presence', question: 'How should it stay with you?', options: [
    { value: 'close',     label: 'Close to the skin', tint: 'sand' },
    { value: 'present',   label: 'Noticed in passing', tint: 'olive' },
    { value: 'lingering', label: 'Remembered after you leave', tint: 'clay' } ] }
];
