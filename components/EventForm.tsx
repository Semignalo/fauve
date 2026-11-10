'use client';

import { useEffect, useState } from 'react';
import { event, rupiah } from '@/data/event';
import { waLink } from '@/data/contact';

type Status = 'idle' | 'sending' | 'done' | 'error' | 'full';
type Errors = { name?: string; whatsapp?: string; proof?: string };

const MAX_PAX = 10;

/** Shrinks a payment screenshot so the upload stays small. Returns base64 JPEG without the data: prefix. */
function compress(file: File): Promise<{ data: string; type: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const src = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, 1600 / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(src);
      resolve({ data: c.toDataURL('image/jpeg', 0.8).split(',')[1], type: 'image/jpeg' });
    };
    img.onerror = () => { URL.revokeObjectURL(src); reject(new Error('image')); };
    img.src = src;
  });
}

/** Registers guests by posting to a Google Apps Script web app that appends a row to a Google Sheet. */
export function EventForm() {
  const url = event.formUrl;
  const [taken, setTaken] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [pax, setPax] = useState(1);
  const [doneName, setDoneName] = useState('');
  const [qrisOk, setQrisOk] = useState(false);
  const [preview, setPreview] = useState('');
  const [fileName, setFileName] = useState('');

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setPreview(file && file.type.startsWith('image/') ? URL.createObjectURL(file) : '');
    setFileName(file ? file.name : '');
    if (file) setErrors((p) => ({ ...p, proof: undefined }));
  }

  useEffect(() => {
    const img = new Image();
    img.onload = () => setQrisOk(true);
    img.src = event.qris;
  }, []);

  useEffect(() => {
    if (!url) return;
    fetch(url)
      .then((r) => r.json())
      .then((d) => typeof d.count === 'number' && setTaken(d.count))
      .catch(() => {});
  }, [url]);

  const left = taken === null ? null : Math.max(0, event.maxSeats - taken);
  const full = status === 'full' || left === 0;
  const maxPax = Math.min(MAX_PAX, left ?? MAX_PAX);
  const paxN = Math.max(1, Math.min(pax, maxPax));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget.elements as unknown as Record<string, HTMLInputElement | HTMLTextAreaElement>;
    const name = f.name.value.trim();
    const whatsapp = f.whatsapp.value.trim();
    const file = (f.proof as HTMLInputElement).files?.[0];
    const next: Errors = {};
    if (!name) next.name = 'Please tell us your name.';
    if (whatsapp.replace(/\D/g, '').length < 9) next.whatsapp = 'Please enter a WhatsApp number we can reach.';
    if (!file) next.proof = 'Please attach your transfer receipt.';
    else if (!file.type.startsWith('image/')) next.proof = 'Please attach a photo or screenshot (JPG or PNG).';
    setErrors(next);
    if (next.name) return f.name.focus();
    if (next.whatsapp) return f.whatsapp.focus();
    if (next.proof) return f.proof.focus();

    setStatus('sending');
    try {
      const proof = await compress(file!);
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // keeps it a simple request, no preflight
        body: JSON.stringify({
          name,
          whatsapp,
          pax: paxN,
          dietary: f.dietary.value.trim(),
          proof,
          company: f.company.value, // honeypot
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setDoneName(name);
        setStatus('done');
      } else if (data.error === 'full') {
        if (typeof data.left === 'number') setTaken(event.maxSeats - data.left);
        setStatus('full');
      } else {
        console.error('Event form:', data);
        setStatus('error');
      }
    } catch (err) {
      console.error('Event form:', err);
      setStatus('error');
    }
  }

  if (!url) {
    return <p className="body muted">Registration opens soon. Please check back shortly.</p>;
  }

  if (status === 'done') {
    const chat = waLink(`Hello FAUVE, I registered for the ${event.dateLabel} event. My name is ${doneName}.`);
    return (
      <div className="event-done" role="status">
        <h2 className="h2">Thank you, {doneName}.</h2>
        <p className="body-lg muted">
          We received your registration and your receipt. We will check the payment and confirm your place on WhatsApp.
        </p>
        {chat && (
          <a className="fv-btn fv-btn--secondary" href={chat} target="_blank" rel="noopener noreferrer">
            Chat on WhatsApp
          </a>
        )}
      </div>
    );
  }

  if (full) {
    const ask = waLink(`Hello FAUVE, the ${event.dateLabel} event is full. Could you add me to the waiting list?`);
    return (
      <div className="event-done">
        <h2 className="h2">All {event.maxSeats} seats are taken.</h2>
        <p className="body-lg muted">Message us and we will let you know if a place opens up.</p>
        {ask && (
          <a className="fv-btn fv-btn--primary" href={ask} target="_blank" rel="noopener noreferrer">
            Join the waiting list
          </a>
        )}
      </div>
    );
  }

  return (
    <form className="fv-form" noValidate onSubmit={onSubmit}>
      {left !== null && <p className="label-sm event-left">{left} of {event.maxSeats} seats left</p>}

      <div className="fv-field">
        <label className="fv-field__label label-sm" htmlFor="e-name">Name</label>
        <input className="fv-field__input" id="e-name" name="name" type="text" autoComplete="name" required aria-invalid={errors.name ? true : undefined} aria-describedby={errors.name ? 'e-name-err' : undefined} />
        {errors.name && <p className="fv-field__error body-sm" id="e-name-err">{errors.name}</p>}
      </div>
      <div className="fv-field">
        <label className="fv-field__label label-sm" htmlFor="e-wa">WhatsApp number</label>
        <input className="fv-field__input" id="e-wa" name="whatsapp" type="tel" inputMode="tel" autoComplete="tel" placeholder="08xx xxxx xxxx" required aria-invalid={errors.whatsapp ? true : undefined} aria-describedby={errors.whatsapp ? 'e-wa-err' : undefined} />
        {errors.whatsapp && <p className="fv-field__error body-sm" id="e-wa-err">{errors.whatsapp}</p>}
      </div>
      <div className="fv-field">
        <span className="fv-field__label label-sm" id="e-pax-label">Number of people</span>
        <div className="event-step" role="group" aria-labelledby="e-pax-label">
          <button type="button" className="event-step__btn" aria-label="One fewer person" disabled={paxN <= 1} onClick={() => setPax(paxN - 1)}>−</button>
          <output className="event-step__n" aria-live="polite">{paxN}</output>
          <button type="button" className="event-step__btn" aria-label="One more person" disabled={paxN >= maxPax} onClick={() => setPax(paxN + 1)}>+</button>
        </div>
      </div>
      <div className="fv-field">
        <label className="fv-field__label label-sm" htmlFor="e-diet">Dietary restrictions</label>
        <textarea className="fv-field__input" id="e-diet" name="dietary" rows={2} placeholder="None, or e.g. no chicken, nut allergy" />
      </div>

      <div className="event-pay">
        <p className="label-sm">Payment</p>
        <p className="event-total">{rupiah(event.fee * paxN)}</p>
        <p className="body-sm muted">{rupiah(event.fee)} × {paxN} {paxN === 1 ? 'person' : 'people'}. Pay by QRIS, then attach the receipt below.</p>
        {qrisOk ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="event-qris" src={event.qris} alt="QRIS payment code for FAUVE" />
        ) : (
          <p className="body-sm muted">The QRIS code is being added. Please check back shortly.</p>
        )}
      </div>

      <div className="fv-field">
        <span className="fv-field__label label-sm">Transfer receipt</span>
        <label className="event-file" htmlFor="e-proof">
          <input className="event-file__input" id="e-proof" name="proof" type="file" accept="image/*" required onChange={onPick} aria-invalid={errors.proof ? true : undefined} aria-describedby={errors.proof ? 'e-proof-err' : undefined} />
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="event-file__thumb" src={preview} alt="" />
          ) : (
            <span className="event-file__thumb event-file__thumb--empty" aria-hidden="true">+</span>
          )}
          <span className="event-file__text">
            <span className="body">{fileName || 'Choose a photo or screenshot'}</span>
            <span className="body-sm muted">{fileName ? 'Tap to change' : 'JPG or PNG of your transfer receipt'}</span>
          </span>
        </label>
        {errors.proof && <p className="fv-field__error body-sm" id="e-proof-err">{errors.proof}</p>}
      </div>

      {/* Honeypot: hidden from people, bots tend to fill it. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
        <label>Company<input name="company" type="text" tabIndex={-1} autoComplete="off" /></label>
      </div>

      {status === 'error' && (
        <p className="fv-field__error body-sm" role="alert">Something went wrong and your registration was not saved. Please try again.</p>
      )}
      <div className="fv-form__actions">
        <button className="fv-btn fv-btn--primary" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Reserve my seat'}
        </button>
      </div>
    </form>
  );
}
