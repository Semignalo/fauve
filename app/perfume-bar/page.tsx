import type { Metadata } from 'next';
import Link from 'next/link';
import { Packages } from '@/components/Packages';
import { Photo } from '@/components/Photo';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { packages } from '@/data/packages';

export const metadata: Metadata = {
  title: 'Perfume Bar',
  description:
    'A bespoke perfume bar for weddings, brand activations and private evenings. Guests explore, create, and take home a scent that is uniquely theirs.',
  alternates: { canonical: '/perfume-bar' },
};

export default function PerfumeBar() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <SiteHeader />
      <main id="main">
        <section className="page-head band--umber"><div className="wrap reveal">
          <h1 className="h1">A scent made in the room.</h1>
          <p className="body-lg muted">
            For weddings, brand activations and private evenings. Guests explore, create, and take home something that feels uniquely theirs.
          </p>
        </div></section>

        <section className="bleed"><Photo slot="bar" /></section>

        <section className="band">
          <div className="cols cols--offset">
            <div className="pair-text reveal">
              <h2 className="h1">Not simply a fragrance, but a memory.</h2>
              <p className="body-lg muted">
                We bring the bar into your occasion and guide each guest through the notes. What they leave with belongs to the evening, and to them.
              </p>
            </div>
            <div className="cols__media reveal"><Photo slot="wood" /></div>
          </div>
        </section>

        <section className="band band--sand">
          <div className="strip-head reveal"><h2 className="h1">Choose a bar for your occasion.</h2></div>
          <Packages
            list={packages.perfumeBar}
            notes={packages.perfumeBarNotes}
            emptyTitle="Perfume Bar packages are being finalised."
            topic="a Perfume Bar"
          />
        </section>

        <section className="band band--terra">
          <div className="closing reveal">
            <h2 className="display">Tell us about your occasion.</h2>
            <Link className="fv-btn fv-btn--primary" href="/contact">Get in touch</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
