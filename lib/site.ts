/** Public address of the site. Set NEXT_PUBLIC_SITE_URL when the domain is known. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

export const NAV = [
  { href: '/shop', label: 'Shop' },
  { href: '/manufacturing', label: 'Private label' },
  { href: '/about', label: 'About' },
  { href: '/perfume-bar', label: 'Perfume Bar' },
  { href: '/find-your-scent', label: 'Find your scent' },
  { href: '/contact', label: 'Contact' },
];
