import type { Metadata } from 'next';
import { EventForm } from '@/components/EventForm';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { event } from '@/data/event';

export const metadata: Metadata = {
  title: 'Event',
  description: `${event.title}. ${event.dateLabel} at ${event.venue}. ${event.maxSeats} seats, ${event.feeLabel} per guest.`,
  alternates: { canonical: '/event' },
};

export default function Event() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <SiteHeader />
      <main id="main">
        <section className="page-head band--umber"><div className="wrap reveal">
          <h1 className="h1">{event.title}</h1>
          <p className="body-lg muted">{event.intro}</p>
        </div></section>

        <section className="band band--tight"><div className="wrap">
          <div className="event reveal">
            <div className="event__info">
              <ul className="contact__list">
                <li><span className="label-sm">Date</span><span className="body">{event.dateLabel}</span></li>
                <li><span className="label-sm">Time</span><span className="body">{event.timeLabel}</span></li>
                <li>
                  <span className="label-sm">Place</span>
                  <a className="body" href={event.mapsUrl} target="_blank" rel="noopener noreferrer">{event.venue}</a>
                </li>
                <li><span className="label-sm">Entry fee</span><span className="body">{event.feeLabel}</span></li>
                <li><span className="label-sm">Seats</span><span className="body">{event.maxSeats} guests</span></li>
              </ul>
              <h2 className="h2">With only Rp150k, you get</h2>
              <ul className="event__list body-lg">
                {event.includes.map((i) => <li key={i}>{i}</li>)}
              </ul>
            </div>
            <div className="event__form"><EventForm /></div>
          </div>
        </div></section>
      </main>
      <SiteFooter />
    </>
  );
}
