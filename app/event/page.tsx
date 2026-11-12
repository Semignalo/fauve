import type { Metadata } from 'next';
import { EventForm } from '@/components/EventForm';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { event } from '@/data/event';

export const metadata: Metadata = {
  title: 'Event',
  description: `${event.title}. ${event.dateLabel} at ${event.venue}. ${event.feeLabel} per guest.`,
  alternates: { canonical: '/event' },
};

export default function Event() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <SiteHeader />
      <main id="main">
        <section className="event-hero">
          <h1 className="sr-only">{event.title}, Perfume Workshop</h1>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/event/workshop.jpg"
            srcSet="/img/event/workshop-sm.jpg 1200w, /img/event/workshop.jpg 2400w"
            sizes="100vw"
            width={2400}
            height={800}
            alt="Scented Soiree, Perfume Workshop. Amor, FAUVE and Starinc."
            fetchPriority="high"
          />
        </section>

        <section className="band band--tight"><div className="wrap">
          <div className="event reveal">
            <div className="event__info">
              <p className="body-lg">{event.intro}</p>
              <ul className="contact__list">
                <li><span className="label-sm">Date</span><span className="body">{event.dateLabel}</span></li>
                <li><span className="label-sm">Time</span><span className="body">{event.timeLabel}</span></li>
                <li>
                  <span className="label-sm">Place</span>
                  <a className="body" href={event.mapsUrl} target="_blank" rel="noopener noreferrer">{event.venue}</a>
                </li>
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
