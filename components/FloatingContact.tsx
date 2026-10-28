'use client';

import { usePathname } from 'next/navigation';
import { waLink } from '@/data/contact';

/** Always-there WhatsApp button, bottom right. Hidden on the full-screen Scent Finder
   and while the menu or order panel is open (see body.is-locked in globals.css). */
export function FloatingContact() {
  const pathname = usePathname();
  const href = waLink('Hello FAUVE, I have a question.');
  if (!href || pathname?.startsWith('/find-your-scent')) return null;

  return (
    <a className="fv-float" href={href} target="_blank" rel="noopener noreferrer" aria-label="Chat with FAUVE on WhatsApp">
      <span className="fv-float__label label-sm" aria-hidden="true">Chat with us</span>
      <span className="fv-float__dot">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">
          <path d="M4 5h16v11H9l-5 4z" />
          <path d="M8.5 10.5h.01M12 10.5h.01M15.5 10.5h.01" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
    </a>
  );
}
