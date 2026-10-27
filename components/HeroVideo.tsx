'use client';

import { useEffect, useRef, useState } from 'react';

const CLIPS = ['/img/photo/hero-1.mp4', '/img/photo/hero-2.mp4'];

/** Two hero clips played in turn, crossfading when one ends. Sits over the placeholder plate. */
export function HeroVideo() {
  const refs = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)];
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    refs[active].current?.play().catch(() => {});
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  const next = (i: number) => {
    const n = (i + 1) % CLIPS.length;
    const v = refs[n].current;
    if (v) v.currentTime = 0;
    setActive(n);
  };

  return (
    <div className="herovideo" aria-hidden="true">
      {CLIPS.map((src, i) => (
        <video
          key={src}
          ref={refs[i]}
          className={`herovideo__clip${active === i ? ' is-active' : ''}`}
          src={src}
          muted
          playsInline
          preload={i === 0 ? 'auto' : 'metadata'}
          autoPlay={i === 0}
          onEnded={() => next(i)}
        />
      ))}
    </div>
  );
}
