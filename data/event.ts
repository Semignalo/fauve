/* Details for the current FAUVE event. Edit here, the /event page and form read from this file. */
export const event = {
  title: 'Create your own scent',
  dateLabel: 'Saturday, 28 November 2026',
  venue: 'Amor',
  mapsUrl: 'https://maps.app.goo.gl/QWCf3NcTYkHcrA6NA',
  fee: 150000, // per person
  feeLabel: 'Rp150.000',
  maxSeats: 30, // total people, not registrations
  includes: [
    'One meal and drink: Chicken Blackpepper and Lychee Tea',
    'Confidence Burst, the deodorant spray from Starinc',
    'Your own custom perfume, 30ml Eau de Parfum',
  ],
  // Put your QRIS image at public/img/event/qris.png. Shown above the proof upload.
  qris: '/img/event/qris.png',
  // Google Apps Script web app URL (see scripts/event-apps-script.gs). Set in .env.local and in Netlify.
  formUrl: process.env.NEXT_PUBLIC_EVENT_FORM_URL ?? '',
};

export const rupiah = (n: number) => 'Rp' + n.toLocaleString('id-ID');
