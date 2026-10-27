import type { Metadata } from 'next';
import { InquiryForm } from '@/components/InquiryForm';
import { Photo } from '@/components/Photo';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { contact, waLink } from '@/data/contact';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Tell us about your occasion or your brand. Send an enquiry and we will reply on WhatsApp.',
  alternates: { canonical: '/contact' },
};

type Line = { label: string; text: string; href?: string };

function lines(): Line[] {
  const out: Line[] = [];
  const strip = (u: string) => u.replace(/^https?:\/\/(www\.)?/, '');
  if (contact.whatsapp) out.push({ label: 'WhatsApp', text: '+' + contact.whatsapp.replace(/\D/g, ''), href: waLink() });
  if (contact.email) out.push({ label: 'Email', text: contact.email, href: `mailto:${contact.email}` });
  if (contact.instagram) out.push({ label: 'Instagram', text: strip(contact.instagram), href: contact.instagram });
  if (contact.tiktok) out.push({ label: 'TikTok', text: strip(contact.tiktok), href: contact.tiktok });
  if (contact.location) out.push({ label: 'Studio', text: contact.location });
  if (contact.hours) out.push({ label: 'Replies', text: contact.hours });
  return out;
}

export default function Contact() {
  const items = lines();
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <SiteHeader />
      <main id="main">
        <section className="page-head band--umber"><div className="wrap reveal">
          <h1 className="h1">Tell us about your story.</h1>
        </div></section>

        <section className="band band--tight"><div className="wrap">
          <div className="contact reveal">
            <div className="contact__media">
              <Photo slot="contact" className="fill" />
            </div>
            <div className="contact__body">
              <InquiryForm />
              {items.length > 0 && (
                <ul className="contact__list">
                  {items.map((l) => (
                    <li key={l.label}>
                      <span className="label-sm">{l.label}</span>
                      {l.href ? (
                        <a className="body" href={l.href} {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                          {l.text}
                        </a>
                      ) : (
                        <span className="body">{l.text}</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div></section>
      </main>
      <SiteFooter />
    </>
  );
}
