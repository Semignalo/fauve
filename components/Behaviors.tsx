'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/** Scroll reveal and gentle parallax. Respects reduced-motion; content is visible without scripts. */
export function Behaviors() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.remove('no-js');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reveals = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    let io: IntersectionObserver | undefined;

    if (!reduce && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('is-in');
              observer.unobserve(e.target);
            }
          });
        },
        { rootMargin: '0px 0px -10% 0px' },
      );
      io = observer;
      reveals.forEach((n) => observer.observe(n));
    } else {
      reveals.forEach((n) => n.classList.add('is-in'));
    }

    const drift = Array.from(document.querySelectorAll<HTMLElement>('.parallax'));
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        drift.forEach((img) => {
          const parent = img.parentElement;
          if (!parent) return;
          const r = parent.getBoundingClientRect();
          const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
          img.style.transform = `translateY(${(p * -40).toFixed(1)}px) scale(1.08)`;
        });
        ticking = false;
      });
    };
    if (!reduce && drift.length) window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      io?.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [pathname]);

  return null;
}
