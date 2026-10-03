// ============================================================================
// Illustrations: on-brand device-mockup scenes (abstract UI, no real people,
// brands or client names), rendered from /workspace/showme-agency-tools/
// illustrations (source copy in design/illustrations/) and exported to static/assets/img/<name>-{640,1200}.{webp,jpg}
// (16:10). `illo()` emits a responsive <picture> with WebP + JPG fallback.
// ============================================================================
import { site } from './data.mjs';

export const ILLO_ALT = {
  'solution-restaurant-ordering': 'Laptop showing a restaurant menu website with dishes and prices in cedis, next to a phone where a WhatsApp-style chat takes the order and requests a Mobile Money payment',
  'solution-real-estate-listings': 'Laptop showing a property listings site with filters and prices in GHS or USD, beside a phone with a listing page and an Enquire on WhatsApp button',
  'solution-clinic-assistant': 'Phone showing a clinic chat assistant offering appointment times and confirming a booking, surrounded by an appointment calendar and reminder cards',
  'solution-invoice-automation': 'Laptop showing an invoice dashboard with paid, reminded and overdue invoices, next to an automated flow from due-date reminder to payment and receipt',
  'industry-real-estate': 'Property developer website on a laptop with a building illustration and listing cards, plus cards for a new WhatsApp enquiry, a lead chart and a booked viewing',
  'industry-diaspora-property': 'Phone showing a property video tour with USD pricing and a book-a-video-viewing button, with cards for buyers in other time zones, a map and shared documents',
  'industry-private-healthcare': 'Clinic booking page on a laptop with a calendar and available appointment times, next to a phone showing appointment reminders',
  'industry-private-schools': 'School admissions dashboard on a laptop with an enquiry-to-enrolment pipeline, plus cards for a booked open day and enquiry growth',
  'industry-restaurants-caterers': 'Phone showing a restaurant menu with an Order on WhatsApp button, with cards for a catering quote with MoMo deposit, a paid order and weekly orders',
  'industry-hospitality-tourism': 'Hotel booking website on a laptop with a beach header, date search and room cards, plus guest review, availability calendar and direct booking cards',
  'industry-churches-ministries': 'Church website on a laptop with a live-stream player and event cards, next to a phone showing an online giving page with Mobile Money',
  'industry-fashion-retail': 'Online boutique on a laptop with a product grid of dresses, tops and bags, next to a phone checkout with Mobile Money and card options',
  'industry-events-weddings': 'Event planner portfolio site on a laptop with a gallery grid, next to a phone for checking a date and paying a deposit',
  'industry-professional-services': 'Client pipeline dashboard on a laptop for a professional services firm, with cards for a booked consultation, documents and an automatic follow-up',
  'article-ai-assistants': 'AI assistant chat on a laptop answering a question with a short list of recommended businesses, one highlighted as recommended',
  'article-ai-search-visibility': 'Search results page with an AI overview citing sources, next to cards for an AI visibility score and a rising citation chart',
  'article-local-seo-gbp': 'Map with location pins and a business profile card showing a star rating and Directions, Call and Website buttons, plus review and map-view cards',
  'article-mobile-money': 'Phone checkout screen with Mobile Money selected as the payment method, alongside cards for PIN approval, payment received and receipt sent',
  'article-follow-up': 'Lead follow-up timeline from new enquiry to booked call, next to a phone listing leads by follow-up status',
  'article-whatsapp-automation': 'WhatsApp automation flow from customer message to menu, order, Mobile Money payment link and confirmation, next to a phone showing the chat',
  'division-web-commerce': 'Business website on a laptop and an online shop on a phone, illustrating websites, stores and booking systems',
  'division-growth': 'Growth dashboard with a rising enquiries chart, an ad preview, ad spend split and a top search result',
  'division-brand': 'Brand identity board with a colour palette, typography, logo mark, app icon and business cards',
  'division-business-technology': 'Diagram connecting a team to business email, shared files, calendars, CRM, security and IT support',
  'division-ai-automation': 'AI hub connected to a WhatsApp assistant, invoices and reminders, bookings, lead follow-up and reports',
  'division-software': 'Code editor on a laptop showing a passing build, next to a phone running a custom client portal app'
};

export const ARTICLE_IMAGE = {
  'get-recommended-by-ai-assistants': 'article-ai-assistants',
  'ai-search-visibility-for-ghana-businesses': 'article-ai-search-visibility',
  'local-seo-google-business-profile-ghana': 'article-local-seo-gbp',
  'accept-mobile-money-on-your-website': 'article-mobile-money',
  'follow-up-every-whatsapp-lead': 'article-follow-up',
  'whatsapp-automation-for-ghana-businesses': 'article-whatsapp-automation'
};

export function illoUrl(name, w = 1200, ext = 'jpg') {
  return site.origin + `/assets/img/${name}-${w}.${ext}`;
}

// sizes: CSS `sizes` attribute; lazy: defer offscreen images; eager images on
// above-the-fold heroes get fetchpriority="high" instead.
export function illo(name, { sizes = '(max-width: 820px) 100vw, 560px', lazy = true, cls = 'illo', alt } = {}) {
  const a = alt || ILLO_ALT[name];
  if (!a) throw new Error('No alt text for illustration: ' + name);
  const base = `/assets/img/${name}`;
  const load = lazy ? ' loading="lazy" decoding="async"' : ' decoding="async" fetchpriority="high"';
  return `<picture class="${cls}"><source type="image/webp" srcset="${base}-640.webp 640w, ${base}-1200.webp 1200w" sizes="${sizes}"><img src="${base}-640.jpg" srcset="${base}-640.jpg 640w, ${base}-1200.jpg 1200w" sizes="${sizes}" width="1200" height="750" alt="${a.replace(/"/g, '&quot;')}"${load}></picture>`;
}
