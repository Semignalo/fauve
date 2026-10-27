/* FAUVE contact details. Fill these from inputs/3-contact.md.
   Every empty value hides its line on the site rather than showing a placeholder. */
export const contact = {
  whatsapp: '', // digits only, with country code, e.g. '62812xxxxxxx'
  whatsappMessage: 'Hello FAUVE, I would like to ask about',
  email: '',
  instagram: '', // full URL
  tiktok: '', // full URL
  location: '', // e.g. 'Jakarta, by appointment'
  hours: '', // e.g. 'We reply within one working day'
  legalName: '', // shown in the footer if set
};

/** WhatsApp link from the contact data. Returns '' until a number is set. */
export function waLink(message?: string): string {
  const n = contact.whatsapp.replace(/\D/g, '');
  if (!n) return '';
  return `https://wa.me/${n}?text=${encodeURIComponent(message ?? contact.whatsappMessage)}`;
}
