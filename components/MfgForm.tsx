'use client';

import { useState } from 'react';
import { waLink } from '@/data/contact';
import { CONCENTRATIONS, MOQ, formatIDR, mfgPrice, personalized } from '@/data/manufacturing';
import type { Concentration } from '@/data/shop';

const SIZES = [...personalized.map((r) => r.label), '10 ml', '100 ml'];
const REQUIRED = ['name', 'phone'] as const;

/** Private label inquiry. Writes a WhatsApp message with a price estimate from the pricelist. */
export function MfgForm() {
  const [size, setSize] = useState(SIZES[0]);
  const [conc, setConc] = useState<Concentration>('EDP');
  const [qty, setQty] = useState(MOQ);
  const [invalid, setInvalid] = useState<string[]>([]);

  const unit = mfgPrice(size, conc);
  const q = Math.max(MOQ, qty || 0);
  const estimate = unit ? `${formatIDR(unit)} per piece, about ${formatIDR(unit * q)} for ${q} pcs` : 'Price on request';

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget.elements as unknown as Record<string, HTMLInputElement | HTMLTextAreaElement>;
    const v = (k: string) => f[k].value.trim();
    const missing = REQUIRED.filter((k) => !v(k));
    setInvalid(missing);
    if (missing.length) {
      f[missing[0]].focus();
      return;
    }
    const lines = [
      'Hello FAUVE, I would like to make perfume under my own brand.',
      '',
      `Name: ${v('name')}`,
      `WhatsApp: ${v('phone')}`,
    ];
    if (v('brand')) lines.push(`Brand: ${v('brand')}`);
    lines.push('', `Size: ${size}`, `Concentration: ${conc}`, `Quantity: ${q} pcs`, `Estimate: ${estimate}`);
    if (v('notes')) lines.push('', `About the scent: ${v('notes')}`);
    const href = waLink(lines.join('\n'));
    if (href) window.open(href, '_blank', 'noopener');
  }

  const bad = (k: string) => invalid.includes(k) || undefined;

  return (
    <form className="fv-form" noValidate onSubmit={onSubmit}>
      <div className="fv-field">
        <label className="fv-field__label label-sm" htmlFor="m-name">Name</label>
        <input className="fv-field__input" id="m-name" name="name" type="text" autoComplete="name" required aria-invalid={bad('name')} />
      </div>
      <div className="fv-field">
        <label className="fv-field__label label-sm" htmlFor="m-phone">WhatsApp number</label>
        <input className="fv-field__input" id="m-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required aria-invalid={bad('phone')} />
      </div>
      <div className="fv-field">
        <label className="fv-field__label label-sm" htmlFor="m-brand">Brand or company</label>
        <input className="fv-field__input" id="m-brand" name="brand" type="text" autoComplete="organization" />
      </div>

      <fieldset className="fv-group">
        <legend className="label-sm">Size</legend>
        <div className="fv-choices">
          {SIZES.map((s) => (
            <label key={s} className="fv-choice">
              <input type="radio" name="size" value={s} checked={size === s} onChange={() => setSize(s)} />
              <span>{s}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="fv-group">
        <legend className="label-sm">Concentration</legend>
        <div className="fv-choices">
          {CONCENTRATIONS.map((c) => (
            <label key={c} className="fv-choice">
              <input type="radio" name="conc" value={c} checked={conc === c} onChange={() => setConc(c)} />
              <span>{c}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="fv-field">
        <label className="fv-field__label label-sm" htmlFor="m-qty">Quantity (minimum {MOQ} pcs)</label>
        <input
          className="fv-field__input"
          id="m-qty"
          name="qty"
          type="number"
          inputMode="numeric"
          min={MOQ}
          step={50}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          onBlur={() => setQty(q)}
        />
      </div>
      <div className="fv-field">
        <label className="fv-field__label label-sm" htmlFor="m-notes">Tell us about the scent and the brand</label>
        <textarea className="fv-field__input" id="m-notes" name="notes" rows={3} />
      </div>

      <p className="fv-total__sum">
        <span className="label-sm muted">Estimate</span>
        <span className="h3">{estimate}</span>
      </p>
      <p className="fv-field__hint body-sm">Sending opens WhatsApp with your brief already written. We reply with samples and a final quote.</p>
      <div className="fv-form__actions">
        <button className="fv-btn fv-btn--primary" type="submit">Send on WhatsApp</button>
      </div>
    </form>
  );
}
