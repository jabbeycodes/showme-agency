// ============================================================================
// Photos: AI-generated images approved by the founder (no real clients,
// brands or identifiable people). Sources are 16:9; each is center-cropped to
// 16:10 and exported to static/assets/img/<name>-{640,1200}.{webp,jpg}
// (Lanczos resize + light sharpen; WebP q80, JPG q82). `illo()` emits a
// responsive <picture> with WebP + JPG fallback.
// ============================================================================
import { site } from './data.mjs';

export const ILLO_ALT = {
  'solution-restaurant-ordering': 'Phone showing a food ordering app with jollof rice and other dishes, next to a plate of jollof rice on a table in a busy restaurant',
  'solution-real-estate-listings': 'Laptop showing property listings with a map view on a marble table, overlooking a modern house with a swimming pool',
  'solution-clinic-assistant': 'Hand holding a phone with a clinic chat assistant and an appointment calendar, in front of a bright clinic reception desk',
  'solution-invoice-automation': 'Laptop showing an invoice dashboard with payment statuses and a revenue chart, next to a phone confirming a payment and a cup of coffee',
  'industry-real-estate': 'Modern two-storey house with large glass windows, palm trees and a pool at golden hour',
  'industry-diaspora-property': 'Laptop showing a video tour of a large white villa, on a living-room table beside a passport and a set of house keys',
  'industry-private-healthcare': 'Bright, modern private clinic reception with a white front desk, a check-in tablet, plants and a seating area',
  'industry-private-schools': 'Bright classroom with wooden desks and laptops, colourful bookshelves and large windows looking out onto greenery',
  'industry-restaurants-caterers': 'Plates of jollof rice, grilled chicken, fried plantain and fresh salad on a restaurant table',
  'industry-hospitality-tourism': 'Beachfront resort infinity pool with sun loungers and palm trees at sunset over the ocean',
  'industry-churches-ministries': 'Church auditorium with a lit stage and instruments, and a video camera set up to live-stream the service',
  'industry-fashion-retail': 'Fashion boutique with racks of colourful African-print clothing and folded kente cloth, with a phone on the counter showing the online shop',
  'industry-events-weddings': 'Outdoor wedding reception at dusk with round tables, floral centrepieces, candles and draped fabric with string lights',
  'industry-professional-services': 'Professional services office with a laptop, documents and coffee on a wooden desk, overlooking a city skyline',
  'article-ai-assistants': 'Phone showing an AI assistant chat with glowing streams of data flowing out of the screen',
  'article-ai-search-visibility': 'Laptop showing an AI search answer highlighting a business result with a star rating',
  'article-local-seo-gbp': 'Hand holding a phone with a map pin and a five-star business profile, on a sunny street lined with shops',
  'article-mobile-money': 'Hand holding a phone showing a payment confirmation tick, in front of a market stall with baskets of fruit and colourful fabrics',
  'article-follow-up': 'Laptop showing a lead pipeline board and a phone listing contacts, on a desk with plants and a notebook',
  'article-whatsapp-automation': 'Phone chat connected by glowing lines to icons for bookings, receipts and orders',
  'division-web-commerce': 'The same online shop shown on a laptop, a tablet and a phone, on a bright desk',
  'division-growth': 'Laptop showing a marketing dashboard with growth charts, next to a phone with a social media feed',
  'division-brand': 'Brand identity flat lay with coral, mint, navy and gold colour swatches, business cards and a sketchbook of logo ideas',
  'division-business-technology': 'Laptop showing a cloud security icon on a desk with a Wi-Fi router, a headset and a secure device',
  'division-ai-automation': 'Laptop with glowing icons for chat, documents, calendar and payments connected in an automated workflow',
  'division-software': 'Desk at dusk with a monitor full of code, a laptop showing an app dashboard and a phone running a client app'
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
  if (!a) throw new Error('No alt text for image: ' + name);
  const base = `/assets/img/${name}`;
  const load = lazy ? ' loading="lazy" decoding="async"' : ' decoding="async" fetchpriority="high"';
  return `<picture class="${cls}"><source type="image/webp" srcset="${base}-640.webp 640w, ${base}-1200.webp 1200w" sizes="${sizes}"><img src="${base}-640.jpg" srcset="${base}-640.jpg 640w, ${base}-1200.jpg 1200w" sizes="${sizes}" width="1200" height="750" alt="${a.replace(/"/g, '&quot;')}"${load}></picture>`;
}
