import Link from 'next/link';
import { contact, waLink } from '@/data/contact';
import { NAV } from '@/lib/site';

export function SiteFooter() {
  const bits = [contact.location, contact.email, contact.legalName].filter(Boolean);
  const wa = waLink();
  return (
    <footer className="fv-footer">
      <div className="fv-footer__inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="fv-footer__mark" src="/img/logo/fauve-wordmark-white.svg" alt="FAUVE" />
        <p className="fv-footer__tagline body-lg">To make the meaningful linger through scent.</p>
        <nav className="fv-footer__links label-sm" aria-label="Footer">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
          {contact.instagram && (
            <a href={contact.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          )}
          {contact.tiktok && (
            <a href={contact.tiktok} target="_blank" rel="noopener noreferrer">
              TikTok
            </a>
          )}
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          )}
        </nav>
        <div className="fv-footer__row body-sm">
          <span>&copy; {new Date().getFullYear()} FAUVE</span>
          {bits.length > 0 && <span>{bits.join(' · ')}</span>}
        </div>
      </div>
    </footer>
  );
}
