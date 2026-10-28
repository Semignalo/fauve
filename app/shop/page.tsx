import type { Metadata } from 'next';
import Link from 'next/link';
import { Catalog } from '@/components/Catalog';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { CATALOG_IDS } from '@/data/shop';
import { scents } from '@/data/scents';
import type { Scent } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Ten FAUVE scents, ready to order in 10, 30, 50 or 100 ml, as EDP or Extrait.',
  alternates: { canonical: '/shop' },
};

const items = CATALOG_IDS.map((id) => scents.find((s) => s.id === id)).filter((s): s is Scent => Boolean(s));

export default function Shop() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <SiteHeader />
      <main id="main">
        <section className="page-head band--umber"><div className="wrap reveal">
          <h1 className="h1">Ready to wear.</h1>
          <p className="body-lg muted">
            Ten of our most loved scents. Choose the size and the strength, and we bottle it for you.
          </p>
        </div></section>

        <section className="band band--tight">
          <div className="wrap">
            <Catalog items={items} />
          </div>
        </section>

        <section className="band band--sand">
          <div className="closing reveal">
            <h2 className="display">Not sure where to begin.</h2>
            <p className="body-lg">Six short questions, three scents that fit you.</p>
            <Link className="fv-btn fv-btn--primary" href="/find-your-scent">Find your scent</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
