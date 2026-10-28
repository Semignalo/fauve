'use client';

import { useEffect, useRef, useState } from 'react';

/** One looping hero clip over its poster. Stays a still image under reduced-motion or Save-Data. */
export function HeroVideo() {
  const [still, setStill] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    const sync = () => setStill(mq.matches || saveData);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (still) v.pause();
    else v.play().catch(() => {});
  }, [still]);

  return (
    <div className="herovideo" aria-hidden="true">
      <img className="herovideo__poster" src="/img/photo/hero-poster.jpg" alt="" width={1600} height={900} />
      {!still && (
        <video
          ref={ref}
          className="herovideo__clip is-active"
          src="/img/photo/hero.mp4"
          poster="/img/photo/hero-poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />
      )}
    </div>
  );
}
