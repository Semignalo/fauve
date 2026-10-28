import type { Metadata } from 'next';
import { MfgForm } from '@/components/MfgForm';
import { Photo } from '@/components/Photo';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { waLink } from '@/data/contact';
import {
  CONCENTRATIONS,
  FROM_PRICE,
  MOQ,
  audiences,
  faq,
  formatIDR,
  personalized,
  personalizedIncludes,
  personalizedNote,
  wholesale,
  wholesaleIncludes,
  type PriceRow,
} from '@/data/manufacturing';

export const metadata: Metadata = {
  title: 'Private label perfume manufacturing',
  description: `Perfume made under your brand. Formula, bottle, box and label included, from ${MOQ} pieces and ${formatIDR(FROM_PRICE)} per bottle.`,
  alternates: { canonical: '/manufacturing' },
};

const steps = [
  { h: 'Briefing', p: 'We listen to the story the scent has to carry, and to who will wear it.' },
  { h: 'Development', p: 'We shape the formula until the story is felt, and design your label and box.' },
  { h: 'Sampling', p: 'You wear it, live with it, and tell us what it needs.' },
  { h: 'Production', p: 'We fill, label and box every bottle, ready to sell or give.' },
];

const wholesaleWa = waLink('Hello FAUVE, I would like to ask about bulk / wholesale perfume prices.');

function PriceTable({ caption, rows, unit }: { caption: string; rows: PriceRow[]; unit: string }) {
  return (
    <div className="pricelist__scroll">
      <table className="pricelist">
        <caption className="label-sm">{caption}</caption>
        <thead>
          <tr>
            <th scope="col"><span className="sr-only">{unit}</span></th>
            {CONCENTRATIONS.map((c) => (
              <th scope="col" key={c} className="label-sm">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <th scope="row" className="h3">{r.label}</th>
              {CONCENTRATIONS.map((c) => {
                const p = r.prices[c];
                return <td key={c} className={p ? 'h3' : 'body-sm muted-dark'}>{p ? formatIDR(p) : 'Price on request'}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Manufacturing() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <SiteHeader />
      <main id="main">
        <section className="page-head band--umber"><div className="wrap reveal">
          <p className="label-sm muted">Private label manufacturing</p>
          <h1 className="h1">Your perfume brand, made by FAUVE.</h1>
          <p className="body-lg muted">
            We develop, fill and finish perfume under your name. Formula, bottle, box, label and stickering included, from {MOQ} pieces.
          </p>
          <dl className="facts facts--dark">
            <div><dt className="label-sm">Minimum order</dt><dd className="h2">{MOQ} pcs</dd></div>
            <div><dt className="label-sm">Starting from</dt><dd className="h2">{formatIDR(FROM_PRICE)}</dd></div>
            <div><dt className="label-sm">Sizes</dt><dd className="h2">30 · 50 ml</dd></div>
          </dl>
          <div className="closing--pair">
            <a className="fv-btn fv-btn--primary" href="#brief">Start your brand</a>
            <a className="fv-btn" href="#pricing">See pricing</a>
          </div>
        </div></section>

        <section className="bleed"><Photo slot="manufacturing" /></section>

        <section className="band band--stone" id="pricing">
          <div className="wrap pricing reveal">
            <div className="strip-head">
              <h2 className="h1">Personalised perfume.</h2>
              <p className="label-sm">Per piece · minimum {MOQ} pcs</p>
            </div>
            <PriceTable caption="Personalised perfume pricelist, IDR per piece" rows={personalized} unit="Bottle size" />
            <ul className="included body-sm">
              {personalizedIncludes.map((i) => <li key={i}>{i}</li>)}
            </ul>
            <p className="body-sm muted-dark">Price includes {personalizedIncludes.join(', ').toLowerCase()}. {personalizedNote}</p>
          </div>
        </section>

        <section className="band band--sand band--tight">
          <div className="wrap pricing reveal">
            <div className="strip-head">
              <h2 className="h2">Bulk and wholesale.</h2>
              <p className="label-sm">30 ml standard bottle</p>
            </div>
            <PriceTable caption="Bulk and wholesale pricelist" rows={wholesale} unit="Quantity" />
            <p className="body-sm muted-dark">Includes {wholesaleIncludes.join(', ').toLowerCase()}.</p>
            {wholesaleWa && (
              <a className="fv-btn fv-btn--secondary" href={wholesaleWa} target="_blank" rel="noopener noreferrer">Ask for wholesale prices</a>
            )}
          </div>
        </section>

        <section className="band">
          <div className="strip-head reveal"><h2 className="h1">Who it is for.</h2></div>
          <ul className="audiences reveal">
            {audiences.map((a) => (
              <li key={a.h}><h3 className="h3">{a.h}</h3><p className="body-sm muted">{a.p}</p></li>
            ))}
          </ul>
        </section>

        <section className="band band--umber">
          <div className="strip-head reveal"><h2 className="h1">Four steps, one story.</h2></div>
          <ol className="steps reveal">
            {steps.map((s) => (
              <li key={s.h}><h3 className="h3">{s.h}</h3><p className="body-sm">{s.p}</p></li>
            ))}
          </ol>
        </section>

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
          <div className="cols cols--offset">
            <div className="pair-text reveal">
              <h2 className="h1">Questions.</h2>
            </div>
            <div className="faq reveal">
              {faq.map((f) => (
                <details key={f.q}>
                  <summary className="h3">{f.q}</summary>
                  <p className="body-sm muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="band band--umber" id="brief">
          <div className="cols cols--offset">
            <div className="pair-text reveal">
              <p className="label-sm muted">Start your brand</p>
              <h2 className="h1">Tell us about it.</h2>
              <p className="body muted">Choose a size and strength for an estimate. We reply on WhatsApp with samples and a final quote.</p>
            </div>
            <MfgForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
