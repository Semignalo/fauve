import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Behaviors } from '@/components/Behaviors';
import { FloatingContact } from '@/components/FloatingContact';
import { SITE_URL } from '@/lib/site';
import './globals.css';

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'FAUVE — Fragrance tells your story', template: '%s — FAUVE' },
  description:
    'FAUVE is a fragrance house and manufacturing partner. Bespoke perfume bars for events and brands, and fragrance made to be remembered.',
  openGraph: { siteName: 'FAUVE', type: 'website', locale: 'en', images: [] },
};

export const viewport: Viewport = { themeColor: '#16110E', width: 'device-width', initialScale: 1 };

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'FAUVE',
  url: SITE_URL,
  logo: `${SITE_URL}/img/logo/fauve-monogram-black.png`,
  description: 'A fragrance house and manufacturing partner. Bespoke perfume bars for events, brands and meaningful occasions.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`no-js ${inter.variable}`} suppressHydrationWarning>
      <body>
        {children}
        <FloatingContact />
        <Behaviors />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </body>
    </html>
  );
}
