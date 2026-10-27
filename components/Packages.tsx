import Link from 'next/link';
import { waLink } from '@/data/contact';
import type { Pack } from '@/lib/types';

type Props = { list: Pack[]; notes: string[]; emptyTitle: string; topic: string };

/** Price cards when the data has packages, a short note and a WhatsApp link when it does not. */
export function Packages({ list, notes, emptyTitle, topic }: Props) {
  if (!list.length) {
    const href = waLink(`Hello FAUVE, I would like to ask about ${topic}.`);
    return (
      <div className="pending">
        <p className="h2">{emptyTitle}</p>
        <p className="body">Tell us about your occasion and we will shape one with you.</p>
        {href ? (
          <a className="fv-btn fv-btn--secondary" href={href} target="_blank" rel="noopener noreferrer">
            Ask on WhatsApp
          </a>
        ) : (
          <Link className="fv-btn fv-btn--secondary" href="/contact">
            Get in touch
          </Link>
        )}
      </div>
    );
  }
  return (
    <div>
      <div className="cards">
        {list.map((pk) => {
          const href = waLink(`Hello FAUVE, I would like to ask about the ${pk.name} package.`);
          return (
            <article key={pk.name} className="fv-price reveal">
              <h3 className="fv-price__name h3">{pk.name}</h3>
              {pk.for && <p className="fv-price__desc body-sm">{pk.for}</p>}
              {pk.inclusions && pk.inclusions.length > 0 && (
                <ul className="fv-price__list body-sm">
                  {pk.inclusions.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              )}
              <p className="fv-price__price h3">{pk.price || 'Price on request'}</p>
              {href ? (
                <a className="fv-btn fv-btn--secondary" href={href} target="_blank" rel="noopener noreferrer">
                  Enquire
                </a>
              ) : (
                <Link className="fv-btn fv-btn--secondary" href="/contact">
                  Enquire
                </Link>
              )}
            </article>
          );
        })}
      </div>
      {notes.length > 0 && (
        <ul className="notes body-sm">
          {notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
