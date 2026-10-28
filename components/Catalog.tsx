'use client';

import { useCallback, useState } from 'react';
import { FROM_PRICE, formatIDR } from '@/data/shop';
import { scentImage } from '@/lib/images';
import type { Scent } from '@/lib/types';
import { OrderForm } from './OrderForm';
import { Photo } from './Photo';

/** The ready-made catalogue. Each card opens the order panel with its scent chosen. */
export function Catalog({ items }: { items: Scent[] }) {
  const [order, setOrder] = useState<string | null>(null);
  const close = useCallback(() => setOrder(null), []);
  const choices = items.map((s) => ({ id: s.id, name: s.name, family: s.family }));

  return (
    <>
      <div className="catalog">
        {items.map((sc) => {
          const rows: [string, string][] = [['Top', sc.top], ['Heart', sc.heart], ['Base', sc.base]];
          return (
            <article className="fv-result fv-product reveal" key={sc.id}>
              <div className="fv-result__media">
                <Photo src={sc.image || scentImage(sc.family, sc.id)} alt="" tag={false} />
                <span className="fv-product__family label-sm">{sc.family}</span>
              </div>
              <div className="fv-product__head">
                <h2 className="fv-result__name h3">{sc.name}</h2>
                <p className="body-sm muted">From {formatIDR(FROM_PRICE)}</p>
              </div>
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
              <button className="fv-btn fv-btn--secondary fv-result__order" type="button" onClick={() => setOrder(sc.id)}>
                Order
              </button>
            </article>
          );
        })}
      </div>
      <OrderForm open={order !== null} onClose={close} choices={choices} preselect={order ?? undefined} source="catalog" />
    </>
  );
}
