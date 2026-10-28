import type { Metadata } from 'next';
import { ScentFinder } from '@/components/ScentFinder';

export const metadata: Metadata = {
  title: 'Find your scent',
  description: 'Answer a few quick questions and get three FAUVE scents that fit you.',
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
