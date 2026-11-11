'use client';

/* Homepage promotion for the current event: a popup on arrival and a band under the hero.
   Both hide themselves once event.endsAt has passed.
   To remove for good: delete this file and the <EventPopup /> and <EventBand /> lines in app/page.tsx. */

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { event } from '@/data/event';
import { useFocusTrap } from './useFocusTrap';

const SEEN_KEY = 'fv-event-popup-seen';

function isLive() {
  return Date.now() < new Date(event.endsAt).getTime();
}

export function EventPopup() {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  useFocusTrap(box, open);

  // Show once per visit, right when the page opens.
  useEffect(() => {
    if (!isLive()) return;
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
    } catch {}
    setOpen(true);
  }, []);

  function close() {
    setOpen(false);
    try {
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {}
  }

  useEffect(() => {
    if (!open) return;
    document.body.classList.add('is-locked');
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('is-locked');
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fv-pop" role="dialog" aria-modal="true" aria-labelledby="pop-title">
      <div className="fv-pop__scrim" onClick={close} />
      <div className="fv-pop__box" ref={box}>
        <button className="fv-pop__close" type="button" ref={closeBtn} onClick={close} aria-label="Close">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" /></svg>
        </button>
        <h2 className="h1" id="pop-title">{event.title}</h2>
        <p className="body-lg muted">{event.intro}</p>
        <ul className="fv-pop__facts">
          <li><span className="label-sm">When</span><span className="body">{event.dateLabel}, {event.timeLabel}</span></li>
          <li><span className="label-sm">Where</span><span className="body">{event.venue}</span></li>
        </ul>
        <div className="fv-form__actions">
          <Link className="fv-btn fv-btn--primary" href="/event" onClick={close}>Reserve your seat</Link>
          <button className="fv-btn fv-btn--secondary" type="button" onClick={close}>Maybe later</button>
        </div>
      </div>
    </div>
  );
}

export function EventBand() {
  const [live, setLive] = useState(true);
  useEffect(() => setLive(isLive()), []);
  if (!live) return null;

  return (
    <section className="band band--sand eventband" aria-label="Upcoming event">
      <div className="eventband__in reveal">
        <div className="eventband__head">
          <h2 className="display">{event.title}</h2>
          <p className="body-lg">{event.intro}</p>
        </div>
        <ul className="eventband__facts">
          <li><span className="label-sm">When</span><span className="body">{event.dateLabel}, {event.timeLabel}</span></li>
          <li><span className="label-sm">Where</span><span className="body">{event.venue}</span></li>
          <li><span className="label-sm">Seats</span><span className="body">{event.maxSeats} guests only</span></li>
        </ul>
        <Link className="fv-btn fv-btn--primary" href="/event">Reserve your seat</Link>
      </div>
    </section>
  );
}
