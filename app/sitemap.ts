import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', '/about', '/shop', '/perfume-bar', '/manufacturing', '/find-your-scent', '/contact'];
  return paths.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: 'monthly', priority: p === '' ? 1 : 0.7 }));
}
