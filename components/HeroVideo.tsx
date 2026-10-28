'use client';

/** One looping hero clip, sitting over the placeholder plate until it has loaded. */
export function HeroVideo() {
  return (
    <div className="herovideo" aria-hidden="true">
      <video
        className="herovideo__clip is-active"
        src="/img/photo/hero.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
    </div>
  );
}
