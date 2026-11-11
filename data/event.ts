/* Details for the current FAUVE event. Edit here, the /event page and form read from this file. */
export const event = {
  title: 'Scented Soiree', // working name, final name tbd
  dateLabel: 'Saturday, 28 November 2026',
  timeLabel: '11.00 AM',
  // The homepage popup and banner hide themselves after this moment (end of event day, Jakarta time).
  endsAt: '2026-11-28T23:59:59+07:00',
  intro: 'Come join us in creating your personalized scent and enjoy a delicious warm meal.',
  venue: 'Amor Restaurant & Cafe',
  mapsUrl: 'https://maps.app.goo.gl/QWCf3NcTYkHcrA6NA',
  fee: 150000, // per person
  feeLabel: 'Rp150.000',
  maxSeats: 30, // total people, not registrations
  includes: [
    'Your own customizable 30ml Eau de Parfum',
    'Complimentary deodorizer serum spray: Confidence Burst, from Starinc',
    'Complimentary meal',
  ],
  // Put your QRIS image at public/img/event/qris.png. Shown above the proof upload.
  qris: '/img/event/qris.png',
  // Google Apps Script web app URL (see scripts/event-apps-script.gs). Set in .env.local, it is baked in at build time.
  formUrl: process.env.NEXT_PUBLIC_EVENT_FORM_URL ?? '',
};

export const rupiah = (n: number) => 'Rp' + n.toLocaleString('id-ID');
