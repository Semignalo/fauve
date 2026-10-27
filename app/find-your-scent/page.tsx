import type { Metadata } from 'next';
import { ScentFinder } from '@/components/ScentFinder';

export const metadata: Metadata = {
  title: 'Find your scent',
  description: 'Six questions about how you feel and what you love, and three FAUVE scents that fit.',
  alternates: { canonical: '/find-your-scent' },
};

export default function FindYourScent() {
  return (
    <>
      <a className="skip" href="#finder-stage">Skip to content</a>
      <ScentFinder />
    </>
  );
}
