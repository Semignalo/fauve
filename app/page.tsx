import Link from 'next/link';
import { Photo } from '@/components/Photo';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';

const panels = [
  {
    slot: 'bar' as const,
    title: 'A scent made in the room.',
    text: 'Our perfume bars bring guests into the making. They explore, create, and take home something that feels uniquely theirs.',
    href: '/perfume-bar',
    cta: 'See the Perfume Bar',
  },
  {
    slot: 'manufacturing' as const,
    title: 'From a story to a bottle.',
    text: 'We develop and manufacture fragrance for brands and meaningful occasions. Not simply a fragrance to be made, but one to be remembered.',
    href: '/manufacturing',
    cta: 'See how we work',
  },
  {
    slot: 'finder' as const,
    title: 'Find the scent that tells yours.',
    text: 'Six questions about how you feel and what you love. Three scents that fit.',
    href: '/find-your-scent',
    cta: 'Find your scent',
  },
];

const mood = [
  { slot: 'earth' as const, label: 'Earth' },
  { slot: 'wood' as const, label: 'Wood' },
  { slot: 'light' as const, label: 'Light' },
  { slot: 'fur' as const, label: 'Fur' },
];

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <SiteHeader />
      <main id="main">
        <section className="hero">
          <div className="hero__media"><Photo slot="hero" priority /></div>
          <h1 className="hero__mark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/logo/fauve-wordmark-white.svg" alt="FAUVE" />
          </h1>
          <div className="hero__foot">
            <p className="hero__line">Fragrance tells your story.</p>
            <Link className="fv-btn" href="/find-your-scent">Find your scent</Link>
          </div>
        </section>

        <section className="band band--umber">
          <div className="statement reveal">
            <p className="display">Scent is more than a product. It is a story that stays.</p>
            <p className="body-lg muted">
              In French, fauve names the tawny tones of earth, wood, light and animal fur. We make fragrance from the stories of people, so that what cannot be said can still be felt.
            </p>
            <Link className="link" href="/about">Read our story</Link>
          </div>
        </section>

        <div className="stack">
          {panels.map((p) => (
            <section className="panel" key={p.href}>
              <div className="panel__media"><Photo slot={p.slot} /></div>
              <div className="panel__body">
                <h2 className="display panel__title">{p.title}</h2>
                <div className="panel__text">
                  <p className="body">{p.text}</p>
                  <Link className="link" href={p.href}>{p.cta}</Link>
                </div>
              </div>
            </section>
          ))}
        </div>

        <section className="band band--sand">
          <div className="strip-head reveal">
            <h2 className="h1">Earth, wood, light, fur.</h2>
            <Link className="link" href="/about">The idea behind the name</Link>
          </div>
          <div className="wrap">
            <div className="strip reveal">
              {mood.map((m) => (
                <figure key={m.slot}>
                  <div className="strip__img"><Photo slot={m.slot} tag={false} /></div>
                  <figcaption className="label-sm">{m.label}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="band band--terra">
          <div className="closing reveal">
            <h2 className="display">Tell us the story. We will make it a scent.</h2>
            <div className="closing--pair">
              <Link className="fv-btn fv-btn--primary" href="/contact">Get in touch</Link>
              <Link className="fv-btn" href="/find-your-scent">Find your scent</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
