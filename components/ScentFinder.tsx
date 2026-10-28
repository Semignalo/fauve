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
    const t = setTimeout(() => setStep(n + 1), reduce ? 300 : 2200);
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

      <main id="finder-stage" className="finder__stage" aria-live="polite" ref={stage}>
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
            <h2 className="h2">Reading your scent profile</h2>
          </section>
        )}
        {step === n + 1 && <Results answers={answers} onAgain={reset} />}
      </main>
    </div>
  );
}

function Intro({ onBegin }: { onBegin: () => void }) {
  return (
    <section className="screen screen--intro">
      <p className="label-sm muted">Find your scent</p>
      <h1 className="display">A scent that tells your story.</h1>
      <p className="body-lg">
        Six short questions about how you feel, where you belong and what you love. There are no wrong answers, and nothing to type.
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
  onAnswer: (key: (typeof Q)[number]['key'], value: string) => void;
  onNext: () => void;
}) {
  const q = Q[index];
  const moved = useRef(false);
  const current = answers[q.key];

  const go = () => {
    if (moved.current) return;
    moved.current = true;
    onNext();
  };

  return (
    <section className="screen">
      <fieldset>
        <legend>
          <span className="label-sm">
            {q.eyebrow} · {index + 1} of {Q.length}
          </span>
          <span className="h1">{q.question}</span>
        </legend>
        <div className="opts">
          {q.options.map((o, k) => (
            <label
              key={o.value}
              className="fv-opt"
              onClick={(e) => {
                /* A click (not an arrow key) moves on by itself after a short pause. */
                if (e.detail === 0) return;
                setTimeout(go, 450);
              }}
            >
              <input
                className="fv-opt__input"
                type="radio"
                name={q.key}
                value={o.value}
                checked={current === o.value}
                onChange={() => onAnswer(q.key, o.value)}
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
        <button className="fv-btn fv-btn--primary" type="button" disabled={!current} onClick={go}>
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
          <p className="label-sm muted">Your scent profile</p>
          <h1 className="h1">Our scent library is still being written.</h1>
          <p className="body-lg">
            Your answers are saved for this visit. Share them with us and we will choose three for you by hand.
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
      <p className="label-sm muted">Your scent profile</p>
      <h1 className="h1">Three scents for your story.</h1>
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
          Order
        </button>
        <button className="fv-btn fv-btn--secondary" type="button" onClick={onAgain}>
          Start again
        </button>
        <Link className="fv-link fv-result__shop" href="/shop">Or browse the shop</Link>
      </div>
      <OrderForm open={order !== null} onClose={closeOrder} choices={choices} preselect={order ?? undefined} source="finder" />
    </section>
  );
}
