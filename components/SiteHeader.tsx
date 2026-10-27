'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { NAV } from '@/lib/site';

/** Fixed header: menu word at left, wordmark centred, scent finder at right. Turns solid once the page scrolls. */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('is-locked', open);
    if (open) closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
        menuBtn.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('is-locked');
    };
  }, [open]);

  return (
    <>
      <div className="site-header">
        <header className={`fv-nav ${solid ? 'is-solid' : ''}`}>
          <button
            ref={menuBtn}
            className="fv-nav__menu"
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen(true)}
          >
            <span className="fv-nav__bars" aria-hidden="true" />
            Menu
          </button>
          <Link className="fv-nav__mark" href="/" aria-label="FAUVE, home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/logo/fauve-wordmark-white.svg" alt="" />
          </Link>
          <div className="fv-nav__cta">
            <Link href="/find-your-scent">
              Find <span className="long">your </span>scent
            </Link>
          </div>
        </header>
      </div>
      <div className="fv-menu" id="site-menu" role="dialog" aria-modal="true" aria-label="Menu" hidden={!open}>
        <div className="fv-menu__top">
          <button
            ref={closeBtn}
            className="fv-menu__close"
            type="button"
            aria-label="Close menu"
            onClick={() => {
              setOpen(false);
              menuBtn.current?.focus();
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square" aria-hidden="true">
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="fv-menu__mark" src="/img/logo/fauve-wordmark-white.svg" alt="FAUVE" />
          <span />
        </div>
        <ul className="fv-menu__list">
          {NAV.map((n) => (
            <li key={n.href}>
              <Link className="fv-menu__link h1" href={n.href} onClick={() => setOpen(false)}>
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="fv-menu__foot label-sm">Fragrance tells your story.</p>
      </div>
    </>
  );
}
