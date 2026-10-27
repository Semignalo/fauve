import { SLOTS, type SlotName, type Tone } from '@/lib/images';

type Props = {
  slot?: SlotName;
  tone?: Tone;
  className?: string;
  /** Shows the small "placeholder" tag. Off for tiny tiles. */
  tag?: boolean;
  priority?: boolean;
};

/** An image slot. Renders a real photograph once the slot has a `src`, a tawny placeholder until then. */
export function Photo({ slot, tone, className = '', tag = true, priority }: Props) {
  const s = slot ? SLOTS[slot] : undefined;
  const src = s && 'src' in s ? (s as { src?: string }).src : undefined;
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className={`photo ${className}`} src={src} alt={s?.alt ?? ''} loading={priority ? 'eager' : 'lazy'} />;
  }
  const t = tone ?? s?.tone ?? 'sand';
  return (
    <span className={`plate plate--${t} ${className}`} role={s ? 'img' : undefined} aria-label={s?.alt} aria-hidden={s ? undefined : true}>
      {tag && s && <span className="plate__tag" aria-hidden="true">Placeholder · {s.note}</span>}
    </span>
  );
}
