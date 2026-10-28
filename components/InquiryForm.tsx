'use client';

import { useState } from 'react';
import { waLink } from '@/data/contact';

/** Builds a message from the form and opens WhatsApp with it. Nothing is sent to a server. */
export function InquiryForm() {
  const hasWa = Boolean(waLink());
  const [nameInvalid, setNameInvalid] = useState(false);
  const chat = waLink();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget.elements as unknown as Record<string, HTMLInputElement | HTMLTextAreaElement>;
    const name = f.name.value.trim();
    if (!name) {
      setNameInvalid(true);
      f.name.focus();
      return;
    }
    setNameInvalid(false);
    const parts = [`Hello FAUVE, my name is ${name}.`];
    if (f.occasion.value.trim()) parts.push(`Occasion: ${f.occasion.value.trim()}.`);
    if (f.date.value) parts.push(`Date: ${f.date.value}.`);
    if (f.message.value.trim()) parts.push(f.message.value.trim());
    const href = waLink(parts.join('\n'));
    if (href) window.open(href, '_blank', 'noopener');
  }

  return (
    <form className="fv-form" id="inquiry" noValidate onSubmit={onSubmit}>
      <div className="fv-field">
        <label className="fv-field__label label-sm" htmlFor="f-name">Name</label>
        <input className="fv-field__input" id="f-name" name="name" type="text" autoComplete="name" required aria-invalid={nameInvalid || undefined} aria-describedby={nameInvalid ? 'f-name-err' : undefined} />
        {nameInvalid && <p className="fv-field__error body-sm" id="f-name-err">Please tell us your name.</p>}
      </div>
      <div className="fv-field">
        <label className="fv-field__label label-sm" htmlFor="f-occasion">Occasion</label>
        <input className="fv-field__input" id="f-occasion" name="occasion" type="text" />
      </div>
      <div className="fv-field">
        <label className="fv-field__label label-sm" htmlFor="f-date">Date</label>
        <input className="fv-field__input" id="f-date" name="date" type="date" />
      </div>
      <div className="fv-field">
        <label className="fv-field__label label-sm" htmlFor="f-message">Tell us about it</label>
        <textarea className="fv-field__input" id="f-message" name="message" rows={3} />
      </div>
      <p className="fv-field__hint body-sm">
        {hasWa ? 'Sending opens WhatsApp with your message already written.' : 'Our WhatsApp line is being set up. Please check back soon.'}
      </p>
      <div className="fv-form__actions">
        <button className="fv-btn fv-btn--primary" type="submit" disabled={!hasWa}>
          Send on WhatsApp
        </button>
        {chat && (
          <a className="fv-btn fv-btn--secondary" href={chat} target="_blank" rel="noopener noreferrer">
            Chat on WhatsApp
          </a>
        )}
      </div>
    </form>
  );
}
