import Link from 'next/link';
import { HeroVideo } from '@/components/HeroVideo';
import { Photo } from '@/components/Photo';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { waLink } from '@/data/contact';
import { FROM_PRICE, MOQ, formatIDR, personalizedIncludes } from '@/data/manufacturing';

const panels = [
  {
    slot: 'manufacturing' as const,
    title: 'Your perfume brand, made by us.',
    text: `Private label manufacturing from ${MOQ} pieces. We develop the formula, fill the bottles, and finish them with your box and label.`,
    href: '/manufacturing',
    cta: 'Private label pricing',
  },
  {
    slot: 'vision' as const,
    title: 'Ready to wear.',
    text: 'Ten of our most loved scents, bottled to order in the size and strength you choose.',
    href: '/shop',
    cta: 'Shop the scents',
  },
  {
    slot: 'bar' as const,
    title: 'A scent made in the room.',
    text: 'Our perfume bars bring guests into the making. They explore, create, and take home something that feels uniquely theirs.',
    href: '/perfume-bar',
    cta: 'See the Perfume Bar',
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

const mfgWa = waLink('Hello FAUVE, I would like to start a perfume brand with your private label service.');

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <SiteHeader />
      <main id="main">
        <section className="hero">
          <div className="hero__media"><Photo slot="hero" priority tag={false} /><HeroVideo /></div>
          <h1 className="hero__mark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/logo/fauve-wordmark-white.svg" alt="FAUVE" />
          </h1>
          <div className="hero__foot">
            <p className="hero__line">Fragrance tells your story.</p>
            <div className="closing--pair">
              <Link className="fv-btn fv-btn--primary" href="/shop">Shop</Link>
              <Link className="fv-btn" href="/find-your-scent">Find your scent</Link>
            </div>
          </div>
        </section>

        <section className="doors" aria-label="What we do">
          <Link className="door" href="/shop">
            <span className="h2 door__title">A scent of your own.</span>
            <span className="body-sm door__text">Shop ready-made scents, find yours in six questions, or book a perfume bar for your event.</span>
            <span className="link">Shop now</span>
          </Link>
          <Link className="door door--brand" href="/manufacturing">
            <span className="h2 door__title">Your perfume brand, made by FAUVE.</span>
            <span className="body-sm door__text">
              Formula, bottle, box and label, from {MOQ} pieces. From {formatIDR(FROM_PRICE)} per bottle.
            </span>
            <span className="link">See pricing</span>
          </Link>
        </section>

        <section className="band band--umber band--photo">
          <div className="band__media"><Photo slot="statement" tag={false} /></div>
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

        <section className="band band--stone">
          <div className="mfg reveal">
            <div className="mfg__head">
              <h2 className="display">Launch your own scent.</h2>
              <p className="body-lg">
                We make perfume under your name, for brands, creators, companies and occasions. You bring the story; we return finished bottles, ready to sell or give.
              </p>
            </div>
            <dl className="facts">
              <div><dt className="label-sm">Minimum order</dt><dd className="h1">{MOQ} pcs</dd></div>
              <div><dt className="label-sm">Starting from</dt><dd className="h1">{formatIDR(FROM_PRICE)}</dd><dd className="body-sm">per 30 ml bottle</dd></div>
              <div><dt className="label-sm">Sizes</dt><dd className="h1">30 · 50 ml</dd><dd className="body-sm">10 and 100 ml on request</dd></div>
            </dl>
            <p className="body-sm mfg__incl">Included: {personalizedIncludes.join(', ').toLowerCase()}.</p>
            <div className="closing--pair">
              <Link className="fv-btn fv-btn--primary" href="/manufacturing">See full pricing</Link>
              {mfgWa && (
                <a className="fv-btn fv-btn--secondary" href={mfgWa} target="_blank" rel="noopener noreferrer">Start your brand</a>
              )}
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
