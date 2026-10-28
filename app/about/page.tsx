import type { Metadata } from 'next';
import Link from 'next/link';
import { Photo } from '@/components/Photo';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';

export const metadata: Metadata = {
  title: 'About',
  description:
    'FAUVE is a fragrance house built on one idea: scent is more than a product, it is a personal story. Our vision, mission and the meaning of the name.',
  alternates: { canonical: '/about' },
};

export default function About() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <SiteHeader />
      <main id="main">
        <section className="page-head band--umber"><div className="wrap reveal">
          <h1 className="h1">A fragrance house built on one idea.</h1>
          <p className="body-lg muted">
            FAUVE is a fragrance house and manufacturing partner built around the belief that scent is more than a product. It is a personal story.
          </p>
        </div></section>

        <section className="bleed"><Photo slot="story" /></section>

        <section className="band band--sand">
          <div className="statement reveal">
            <h2 className="display">The colours of earth, wood, light and fur.</h2>
            <p className="body-lg">
              FAUVE, said /fohv/. In French, fauve refers to the tawny and fawn tones found in nature. Inspired by the stories of nature, FAUVE exists to express the stories of people through scent — a way of translating a story that cannot be said, yet can remain felt after the moment has passed.
            </p>
          </div>
        </section>

        <section className="band">
          <div className="cols cols--offset">
            <div className="cols__media reveal"><Photo slot="vision" /></div>
            <div className="pair-text reveal">
              <h2 className="h1">From developing a scent to bringing it to life.</h2>
              <p className="body-lg muted">
                We develop and manufacture fragrances, including bespoke perfume bars for events, brands and meaningful occasions. We work across the process to make fragrance more personal, memorable and tangible.
              </p>
            </div>
          </div>
        </section>

        <section className="band band--umber">
          <div className="cols cols--2">
            <div className="pair-text reveal">
              <p className="h2"><span className="muted">Our vision. </span>To make the meaningful linger through scent.</p>
            </div>
            <div className="pair-text reveal">
              <p className="h2"><span className="muted">Our mission. </span>We create thoughtful fragrances and experiences that transform stories, identities and moments into scents worth remembering.</p>
            </div>
          </div>
        </section>

        <section className="band band--terra">
          <div className="closing reveal">
            <h2 className="display">As FAUVE evolves, the idea stays the same.</h2>
            <Link className="fv-btn fv-btn--primary" href="/find-your-scent">Find your scent</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
