'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { finder as Q } from '@/data/finder';
import { scents } from '@/data/scents';
import { waLink } from '@/data/contact';
import { labelOf, topThree, whySentence, type Answers } from '@/lib/match';
import { scentImage } from '@/lib/images';
import { OrderForm } from './OrderForm';
import { Photo } from './Photo';

/* Step -1 is the intro, 0..n-1 are the questions, n is the short pause, n+1 shows the results. */
export function ScentFinder() {
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState<Answers>({});
  const stage = useRef<HTMLElement>(null);
  const n = Q.length;

  useEffect(() => {
    const h = stage.current?.querySelector<HTMLElement>('h1, h2, legend');
    if (h) {
      h.setAttribute('tabindex', '-1');
      h.focus({ preventScroll: true });
    }
    window.scrollTo({ top: 0 });
  }, [step]);

  useEffect(() => {
    if (step !== n) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = setTimeout(() => setStep(n + 1), reduce ? 300 : 1400);
    return () => clearTimeout(t);
  }, [step, n]);

  const done = Math.max(0, Math.min(n, step));
  const reset = () => {
    setAnswers({});
    setStep(-1);
  };

  return (
    <div className="finder">
      <div className="finder__bar">
        <div className="finder__nav">
          <button
            className={`finder__back label-sm ${step < 0 || step > n - 1 ? 'is-off' : ''}`}
            id="finder-back"
            type="button"
            onClick={() => setStep(step > 0 ? step - 1 : -1)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square" aria-hidden="true">
              <path d="M20 12H4M10 6l-6 6 6 6" />
            </svg>
            Back
          </button>
          <Link href="/" aria-label="FAUVE, home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/logo/fauve-wordmark-white.svg" alt="" />
          </Link>
          <Link className="fv-link" href="/">Close</Link>
        </div>
        <div
          className="fv-progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={n}
          aria-valuenow={done}
          aria-label={`Question ${Math.min(done + 1, n)} of ${n}`}
        >
          <span className="fv-progress__fill" style={{ width: `${(done / n) * 100}%` }} />
        </div>
      </div>

      <main id="finder-stage" className="finder__stage" ref={stage}>
        {step === -1 && <Intro onBegin={() => setStep(0)} />}
        {step >= 0 && step < n && (
          <Question
            key={step}
            index={step}
            answers={answers}
            onAnswer={(key, value) => setAnswers((a) => ({ ...a, [key]: value }))}
            onNext={() => setStep(step + 1)}
          />
        )}
        {step === n && (
          <section className="screen screen--loading" role="status">
            <div className="breath" />
            <h2 className="h2">Finding your scents</h2>
          </section>
        )}
        {step === n + 1 && <Results answers={answers} onAgain={reset} />}
      </main>
    </div>
  );
}

const WORDS: Record<number, string> = { 4: 'Four', 5: 'Five', 6: 'Six', 7: 'Seven', 8: 'Eight', 9: 'Nine', 10: 'Ten', 11: 'Eleven', 12: 'Twelve', 13: 'Thirteen' };

function Intro({ onBegin }: { onBegin: () => void }) {
  return (
    <section className="screen screen--intro">
      <h1 className="display">Find your scent.</h1>
      <p className="body-lg">
        Answer {(WORDS[Q.length] ?? String(Q.length)).toLowerCase()} quick questions and we will pick three scents for you. Just tap your answers. There is nothing to type.
      </p>
      <div className="screen__actions">
        <button className="fv-btn fv-btn--primary" type="button" onClick={onBegin}>
          Begin
        </button>
      </div>
    </section>
  );
}

function Question({
  index,
  answers,
  onAnswer,
  onNext,
}: {
  index: number;
  answers: Answers;
  onAnswer: (key: (typeof Q)[number]['key'], value: string | string[]) => void;
  onNext: () => void;
}) {
  const q = Q[index];
  const moved = useRef(false);
  const current = answers[q.key];
  const picked = ([] as (string | undefined)[]).concat(current);
  const ready = picked.some(Boolean);
  const toggle = (value: string) => {
    const set = picked.filter((v): v is string => !!v);
    onAnswer(q.key, set.includes(value) ? set.filter((v) => v !== value) : [...set, value]);
  };

  const go = () => {
    if (moved.current) return;
    moved.current = true;
    onNext();
  };

  /* A tap on a single-choice answer moves on after a short beat so the check mark shows.
     Keyboard users change radios with the arrow keys (a click with detail 0), so they
     keep using the Next button and are never pushed past a question by accident. */
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const advance = (e: React.MouseEvent<HTMLInputElement>, value: string) => {
    if (q.multi || e.detail === 0) return;
    onAnswer(q.key, value);
    clearTimeout(timer.current);
    timer.current = setTimeout(go, 220);
  };

  return (
    <section className="screen">
      <fieldset>
        <legend>
          <span className="sr-only">
            {q.eyebrow} · {index + 1} of {Q.length}
          </span>
          <span className="h1">{q.question}</span>
        </legend>
        <div className="opts">
          {q.options.map((o, k) => (
            <label
              key={o.value}
              className="fv-opt"
            >
              <input
                className="fv-opt__input"
                type={q.multi ? 'checkbox' : 'radio'}
                name={q.key}
                value={o.value}
                checked={picked.includes(o.value)}
                onChange={() => (q.multi ? toggle(o.value) : onAnswer(q.key, o.value))}
                onClick={(e) => advance(e, o.value)}
              />
              <span className="fv-opt__media">
                {o.image ? (
                  <Photo src={o.image} tone="sand" tag={false} priority={k < 4} />
                ) : (
                  <span className={`tint tint--${o.tint ?? 'sand'}`} />
                )}
                <span className="fv-opt__check">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="1" strokeLinecap="square" aria-hidden="true">
                    <path d="M4 12.5l5 5L20 6.5" />
                  </svg>
                </span>
              </span>
              <span className="fv-opt__label body-sm">{o.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="screen__actions">
        <button className="fv-btn fv-btn--primary" type="button" disabled={!ready} onClick={go}>
          {index === Q.length - 1 ? 'See my scents' : 'Next'}
        </button>
      </div>
    </section>
  );
}

function Results({ answers, onAgain }: { answers: Answers; onAgain: () => void }) {
  const [order, setOrder] = useState<string | null>(null);
  const closeOrder = useCallback(() => setOrder(null), []);
  if (scents.length < 3) {
    const msg = `Hello FAUVE, here is my scent profile: ${Q.map((q) => `${q.eyebrow}: ${labelOf(Q, answers, q.key)}`).join('; ')}.`;
    const href = waLink(msg);
    return (
      <section className="screen">
        <div className="results__empty">
          <h1 className="h1">Our scent list is not ready yet.</h1>
          <p className="body-lg">
            Send us your answers and we will pick three scents for you.
          </p>
          <div className="screen__actions">
            {href ? (
              <a className="fv-btn fv-btn--primary" href={href} target="_blank" rel="noopener noreferrer">
                Send my answers
              </a>
            ) : (
              <Link className="fv-btn fv-btn--primary" href="/contact">
                Get in touch
              </Link>
            )}
            <button className="fv-btn fv-btn--secondary" type="button" onClick={onAgain}>
              Start again
            </button>
          </div>
        </div>
      </section>
    );
  }

  const top = topThree(scents, answers);
  const choices = top.map((m) => ({ id: m.scent.id, name: m.scent.name, family: m.scent.family }));
  return (
    <section className="screen">
      <h1 className="h1">Your top three scents.</h1>
      <div className="results">
        {top.map((m, k) => {
          const sc = m.scent;
          const rows: [string, string][] = [['Top', sc.top], ['Heart', sc.heart], ['Base', sc.base]];
          return (
            <article className="fv-result" key={sc.id}>
              <div className="fv-result__media">
                <Photo src={sc.image || scentImage(sc.family, sc.id, k)} tone="stone" tag={false} />
              </div>
              <h2 className="fv-result__name h3">{sc.name}</h2>
              <dl className="fv-result__notes body-sm">
                {rows
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div className="fv-result__row" key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
              </dl>
              {sc.description && <p className="body-sm">{sc.description}</p>}
              <p className="fv-result__why body-sm">{whySentence(m, Q, answers)}</p>
              <button className="fv-btn fv-btn--secondary fv-result__order" type="button" onClick={() => setOrder(sc.id)}>
                Order this scent
              </button>
            </article>
          );
        })}
      </div>
      <div className="screen__actions">
        <button className="fv-btn fv-btn--primary" type="button" onClick={() => setOrder(top[0].scent.id)}>
          Order my top pick
        </button>
        <button className="fv-btn fv-btn--secondary" type="button" onClick={onAgain}>
          Start again
        </button>
        <Link className="fv-link fv-result__shop" href="/shop">Browse the shop</Link>
      </div>
      <OrderForm open={order !== null} onClose={closeOrder} choices={choices} preselect={order ?? undefined} source="finder" />
    </section>
  );
}
