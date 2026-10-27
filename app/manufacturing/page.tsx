import type { Metadata } from 'next';
import Link from 'next/link';
import { Packages } from '@/components/Packages';
import { Photo } from '@/components/Photo';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { packages } from '@/data/packages';

export const metadata: Metadata = {
  title: 'Manufacturing',
  description:
    'Custom fragrance development and manufacturing for brands, from the first brief to the finished bottle in 30 ml and 50 ml.',
  alternates: { canonical: '/manufacturing' },
};

const steps = [
  { h: 'Briefing', p: 'We listen to the story the scent has to carry.' },
  { h: 'Development', p: 'We shape the notes until the story is felt.' },
  { h: 'Sampling', p: 'You wear it, live with it, and tell us what it needs.' },
  { h: 'Production', p: 'We bottle it, ready to be remembered.' },
];

export default function Manufacturing() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <SiteHeader />
      <main id="main">
        <section className="page-head band--umber"><div className="wrap reveal">
          <h1 className="h1">From a story to a bottle.</h1>
          <p className="body-lg muted">
            We develop and manufacture fragrance for brands and meaningful occasions, from the first brief to the finished bottle.
          </p>
        </div></section>

        <section className="bleed"><Photo slot="manufacturing" /></section>

        <section className="band band--stone">
          <div className="bottles reveal">
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/product/bottle-30ml.jpg" alt="The FAUVE 30 ml bottle" loading="lazy" />
              <figcaption className="label-sm">30 ml</figcaption>
            </figure>
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/product/bottle-50ml.jpg" alt="The FAUVE 50 ml bottle" loading="lazy" />
              <figcaption className="label-sm">50 ml</figcaption>
            </figure>
          </div>
        </section>

        <section className="band">
          <div className="strip-head reveal"><h2 className="h1">Four steps, one story.</h2></div>
          <ol className="steps reveal">
            {steps.map((s) => (
              <li key={s.h}><h3 className="h3">{s.h}</h3><p className="body-sm">{s.p}</p></li>
            ))}
          </ol>
        </section>

        <section className="band band--sand">
          <div className="strip-head reveal"><h2 className="h1">Made to your order.</h2></div>
          <Packages
            list={packages.manufacturing}
            notes={packages.manufacturingNotes}
            emptyTitle="Manufacturing pricing is being finalised."
            topic="fragrance manufacturing"
          />
        </section>

        <section className="band band--terra">
          <div className="closing reveal">
            <h2 className="display">Bring us your story.</h2>
            <Link className="fv-btn fv-btn--primary" href="/contact">Get in touch</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
