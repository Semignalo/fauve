'use client';

import { useEffect, useRef, useState } from 'react';
import { waLink } from '@/data/contact';
import { CONCENTRATIONS, CONCENTRATION_NOTE, SIZES, formatIDR, priceOf, type Concentration, type Size } from '@/data/shop';

export type OrderChoice = { id: string; name: string; family: string };

type Props = {
  open: boolean;
  onClose: () => void;
  choices: OrderChoice[];
  preselect?: string;
  source: 'finder' | 'catalog';
};

const SOURCE_LABEL = { finder: 'from Scent Finder', catalog: 'from the shop' } as const;
const REQUIRED = ['name', 'phone', 'address'] as const;

/** Order panel. Builds a WhatsApp message from the form and opens it. Nothing is sent to a server. */
export function OrderForm({ open, onClose, choices, preselect, source }: Props) {
  const [scent, setScent] = useState(preselect ?? choices[0]?.id ?? '');
  const [size, setSize] = useState<Size>(30);
  const [conc, setConc] = useState<Concentration>('EDP');
  const [qty, setQty] = useState(1);
  const [invalid, setInvalid] = useState<string[]>([]);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    if (preselect) setScent(preselect);
  }, [preselect, open]);

  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement;
    document.body.classList.add('is-locked');
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('is-locked');
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [open, onClose]);

  const unit = priceOf(conc, size);
  const total = unit * qty;
  const chosen = choices.find((c) => c.id === scent);

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
      'Hello FAUVE, I would like to order.',
      '',
      `Name: ${v('name')}`,
      `WhatsApp: ${v('phone')}`,
      `Address: ${v('address')}`,
      '',
      `Scent: ${chosen ? chosen.name : 'Not chosen yet'} (${SOURCE_LABEL[source]})`,
      `Size: ${size} ml`,
      `Concentration: ${conc}`,
      `Quantity: ${qty}`,
      `Price: ${formatIDR(unit)} each, total ${formatIDR(total)}`,
    ];
    if (v('notes')) lines.push('', `Notes: ${v('notes')}`);
    const href = waLink(lines.join('\n'));
    if (href) window.open(href, '_blank', 'noopener');
  }

  const bad = (k: string) => invalid.includes(k) || undefined;

  return (
    <div className="fv-order" hidden={!open}>
      <div className="fv-order__scrim" onClick={onClose} aria-hidden="true" />
      <div className="fv-order__panel" role="dialog" aria-modal="true" aria-labelledby="order-title">
        <div className="fv-order__top">
          <p className="label-sm muted">Order</p>
          <button ref={closeBtn} className="fv-order__close" type="button" aria-label="Close order form" onClick={onClose}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square" aria-hidden="true">
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        </div>
        <h2 className="h2" id="order-title">Your bottle, made to order.</h2>

        <form className="fv-form" noValidate onSubmit={onSubmit}>
          <fieldset className="fv-group">
            <legend className="label-sm">Your details</legend>
            <div className="fv-field">
              <label className="fv-field__label label-sm" htmlFor="o-name">Name</label>
              <input className="fv-field__input" id="o-name" name="name" type="text" autoComplete="name" required aria-invalid={bad('name')} />
            </div>
            <div className="fv-field">
              <label className="fv-field__label label-sm" htmlFor="o-phone">WhatsApp number</label>
              <input className="fv-field__input" id="o-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="08..." required aria-invalid={bad('phone')} />
            </div>
            <div className="fv-field">
              <label className="fv-field__label label-sm" htmlFor="o-address">Delivery address</label>
              <textarea className="fv-field__input" id="o-address" name="address" rows={2} autoComplete="street-address" required aria-invalid={bad('address')} />
            </div>
          </fieldset>

          <fieldset className="fv-group">
            <legend className="label-sm">Scent</legend>
            <div className="fv-scents">
              {choices.map((c) => (
                <label key={c.id} className="fv-scent">
                  <input type="radio" name="scent" value={c.id} checked={scent === c.id} onChange={() => setScent(c.id)} />
                  <span className="fv-scent__name">{c.name}</span>
                  <span className="fv-scent__family label-sm">{c.family}</span>
                </label>
              ))}
            </div>
            <div className="fv-field">
              <label className="fv-field__label label-sm" htmlFor="o-notes">Tell us more about the scent you want</label>
              <textarea
                className="fv-field__input"
                id="o-notes"
                name="notes"
                rows={2}
                placeholder="Sweeter, softer, for a gift, a name on the label..."
              />
            </div>
          </fieldset>

          <fieldset className="fv-group">
            <legend className="label-sm">Size</legend>
            <div className="fv-choices">
              {SIZES.map((s) => (
                <label key={s} className="fv-choice">
                  <input type="radio" name="size" value={s} checked={size === s} onChange={() => setSize(s)} />
                  <span>{s} ml</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="fv-group">
            <legend className="label-sm">Concentration</legend>
            <div className="fv-choices fv-choices--wide">
              {CONCENTRATIONS.map((c) => (
                <label key={c} className="fv-choice">
                  <input type="radio" name="conc" value={c} checked={conc === c} onChange={() => setConc(c)} />
                  <span>
                    {c}
                    <small>{CONCENTRATION_NOTE[c]}</small>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="fv-total">
            <div className="fv-qty" role="group" aria-label="Quantity">
              <button type="button" aria-label="One less" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1}>
                −
              </button>
              <output aria-live="polite">{qty}</output>
              <button type="button" aria-label="One more" onClick={() => setQty((q) => Math.min(20, q + 1))}>
                +
              </button>
            </div>
            <p className="fv-total__sum">
              <span className="label-sm muted">Total</span>
              <span className="h3">{formatIDR(total)}</span>
            </p>
          </div>

          <p className="fv-field__hint body-sm">
            Ordering opens WhatsApp with your order already written. We confirm stock, delivery and payment there.
          </p>
          <div className="fv-form__actions">
            <button className="fv-btn fv-btn--primary" type="submit">
              Order on WhatsApp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
