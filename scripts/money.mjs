// ============================================================================
// Region-aware prices and wording (United States / USD and Ghana / GHS).
// ----------------------------------------------------------------------------
// Content strings anywhere in the site reference these as {{key}} tokens.
// At build time scripts/region.mjs resolves them:
//   - attributes, <title>, <meta>, JSON-LD  -> US value (the canonical default)
//   - visible text nodes -> US text, with the Ghana text alongside in a
//     data-gh attribute so the worker (edge) or the switcher (client) can swap.
//
// Ghana (gh) values are the current published prices, unchanged.
// United States (us) values are PROPOSED, NOT FINAL: they still need the
// founder's approval (see /workspace/us-pricing/proposed-us-prices.md).
// Values must not contain the characters " < > & (they are inserted raw).
// ============================================================================

export const US_PRICES_STATUS = 'proposed';

// key: [ghana, united states, basis note for the US figure]
export const MONEY = {
  // ---- Retainers & core facts
  retainer: ['GHS 3,200', '$1,800', 'Managed ads + landing page + WhatsApp lead system + weekly reporting; typical US small-business PPC/lead-gen management retainers run from roughly $1,000 to $3,000+/month before ad spend.'],
  enterprise: ['GHS 7,500', '$4,500', 'Senior strategist, multi-location reporting, QBRs, 4-hour priority response; typical US agency retainers with a dedicated strategist commonly start in the mid four figures per month.'],
  adspend: ['GHS 1,500', '$1,000', 'Recommended minimum ad budget (paid to the platforms, not to ShowMe); a typical floor for a meaningful US Google/Meta test.'],
  // ---- Web & Commerce
  web: ['GHS 7,500', '$3,500', 'Up to 6 custom pages; typical US small-business custom sites are often quoted from roughly $2,500 to $10,000.'],
  store: ['GHS 13,500', '$6,500', 'Up to 50 products; typical US small-business e-commerce builds are often quoted from roughly $5,000 to $15,000+.'],
  landing: ['GHS 3,000', '$1,500', 'One campaign page with copy and tracking; typical US range roughly $1,000–$3,000.'],
  landing_variant: ['GHS 1,200', '$500', 'Additional page variant.'],
  booking: ['GHS 9,500', '$4,500', 'Booking/ordering flow with reminders and deposits; typical US custom booking builds roughly $3,000–$8,000.'],
  care: ['GHS 750', '$150', 'Hosting, backups, updates, 1 hour of changes; typical US website care plans roughly $100–$300/month.'],
  // ---- Growth
  local_seo: ['GHS 1,600', '$600', 'GBP + reviews + citations; typical US local SEO roughly $400–$1,500/month.'],
  seo: ['GHS 3,800', '$1,500', 'Technical + on-page + 2 articles + links; typical US small-business SEO retainers roughly $1,000–$3,000/month.'],
  ai_search: ['GHS 2,800', '$1,000', 'Emerging service with no settled market rate; priced in line with the content/SEO retainers. ASSUMPTION — confirm.'],
  ai_search_combo_saving: ['GHS 1,000', '$350', 'Combination discount kept at roughly the same share of the price.'],
  ads_one: ['GHS 2,200', '$900', 'One platform (Google or Meta); typical US management fees roughly $500–$2,000/month or a % of spend.'],
  ads_both: ['GHS 3,000', '$1,250', 'Google + Meta.'],
  social: ['GHS 3,000', '$1,200', '2 platforms, 12 posts + stories; typical US small-business social management roughly $800–$2,500/month.'],
  content: ['GHS 2,400', '$1,000', '3 articles a month; typical US blog content packages roughly $250–$500 per article.'],
  article: ['GHS 900', '$350', 'Single article, 800–1,200 words.'],
  email_sms: ['GHS 1,800', '$750', '2 campaigns + 1 automated sequence; typical US email marketing management roughly $500–$2,000/month.'],
  email_seq: ['GHS 2,500', '$1,000', 'One-off automated sequence build.'],
  analytics: ['GHS 2,500', '$1,200', 'GA4 + Search Console + conversion tracking + dashboard; typical US one-off setups roughly $750–$2,500.'],
  reporting: ['GHS 600', '$250', 'Ongoing monthly reporting.'],
  // ---- Brand
  brand: ['GHS 3,800', '$2,000', 'Logo suite + palette + type + mini guide; typical US small-business logo/brand packages roughly $1,500–$5,000.'],
  brand_full: ['GHS 8,500', '$5,000', 'Full identity system; typical US range roughly $5,000–$15,000.'],
  collateral: ['GHS 2,500', '$900', 'Company profile up to 12 pages or a stationery set.'],
  photo: ['GHS 3,500', '$1,200', 'Half-day shoot. NOTE: the team shoots in Accra; US on-location shoots would need a US photographer or travel. ASSUMPTION — confirm how this is offered in the US.'],
  video: ['GHS 2,500', '$750', 'Short-form video add-on (3 clips).'],
  pitch: ['GHS 3,000', '$1,500', 'Up to 15 slides; typical US pitch-deck design roughly $1,000–$5,000.'],
  // ---- Business Technology
  m365: ['GHS 2,000', '$900', 'Up to 5 users incl. migration + training; typical US MSP project fees for small setups roughly $500–$2,000.'],
  m365_user: ['GHS 250', '$75', 'Per additional user.'],
  cloud: ['GHS 2,500', '$1,000', 'Up to 50 GB migration + structure + training.'],
  crm: ['GHS 4,500', '$2,000', 'CRM configuration + lead capture + training; typical US small-business CRM setups roughly $1,500–$5,000.'],
  it_session: ['GHS 1,200', '$500', 'Half-day session (remote); typical US consulting rates roughly $100–$200/hour.'],
  // ---- AI & Automation
  wa_ai: ['GHS 6,000', '$2,500', 'AI assistant on up to 50 FAQs + hand-off + 30 days tuning; typical US chatbot builds for small businesses roughly $2,000–$10,000.'],
  wa_ai_care: ['GHS 800', '$300', 'Ongoing care per month.'],
  wa_order: ['GHS 6,500', '$2,750', 'Guided ordering/booking flow on WhatsApp. NOTE: WhatsApp ordering is less common in the US than SMS/web ordering — ASSUMPTION that it is still offered as-is.'],
  bpa: ['GHS 4,500', '$2,000', 'Up to 3 workflows; typical US automation (Zapier/Make) consultants roughly $75–$150/hour or $1,500–$5,000 per small project.'],
  bpa_large: ['GHS 12,000', '$6,000', 'Larger automation programmes.'],
  bpa_support: ['GHS 1,500', '$600', 'Support per month.'],
  audit: ['GHS 1,500', '$500', 'Fixed-fee automation audit, credited toward a build.'],
  ai_kb: ['GHS 8,000', '$3,500', 'Private internal assistant on up to 200 pages of documents.'],
  // ---- Software
  webapp: ['GHS 20,000', '$9,000', 'MVP portal/web app; typical US small MVP builds are often quoted from roughly $10,000–$50,000+ (this sits at the low end).'],
  mobile: ['GHS 35,000', '$15,000', 'Cross-platform MVP; typical US small app MVPs are often quoted from roughly $20,000–$80,000+ (this sits below the low end — confirm).'],
  dashboard: ['GHS 9,000', '$4,000', 'Dashboard on up to 3 data sources or one internal tool.'],
  integration: ['GHS 5,000', '$2,000', 'Single two-system integration.'],
  discovery: ['GHS 6,000', '$2,500', 'Paid discovery sprint (credited).'],
  // ---- Bundles
  b_launch: ['GHS 11,500', '$5,000', 'Website + Brand Essentials + GBP + analytics + 3 months care (parts at US prices: about $7,150+).'],
  b_launch_saving: ['GHS 3,000', '$2,000', 'Saving vs parts.'],
  b_grow: ['GHS 12,500', '$5,500', 'Setup: 8-page site + WhatsApp AI assistant + GBP (parts at US prices: about $6,600+), then the Growth retainer.'],
  b_grow_saving: ['GHS 3,000', '$1,000', 'Saving vs parts.'],
  b_scale: ['GHS 24,500', '$11,000', 'Store + full identity + 3 workflows + dashboard + 3 months care (parts at US prices: about $17,950).'],
  b_scale_saving: ['GHS 4,000', '$5,000', 'Saving vs parts.'],
  // ---- Lead-form budget bands
  budget1: ['Up to GHS 5,000', 'Up to $2,500', 'Lead-form budget band.'],
  budget2: ['GHS 5,000–15,000', '$2,500–$7,500', 'Lead-form budget band.'],
  budget3: ['GHS 15,000+', '$7,500+', 'Lead-form budget band.'],
  // ---- Work samples ("from" lines)
  w_restaurant: ['GHS 14,000', '$6,500', 'Site + ordering flow.']
};

// Region-specific wording (not prices).
export const WORDS = {
  cur: ['GHS', 'USD'],
  bill_methods: ['MoMo, bank transfer or card', 'card or bank transfer'],
  adspend_paid: ['prepaid in cedis', 'paid directly to the ad platforms'],
  adspend_paid_full: ['separate, prepaid in cedis and paid directly to the ad platforms', 'separate and paid directly to the ad platforms'],
  checkout_row: ['MoMo, card and bank checkout', 'Card and digital-wallet checkout'],
  checkout_methods: ['MoMo, card and bank checkout', 'card and digital-wallet checkout'],
  deposit_methods: ['MoMo or card', 'card'],
  momo_links: ['MoMo payment links', 'card payment links'],
  photo_where: ['A half-day shoot in Accra', 'A half-day shoot in Accra, Ghana (on-location shoots in the US are quoted on request)'],
  dollar_ads: ['We handle the dollar ad-account side &mdash; you never touch a dollar card', 'We set up and run the ad accounts in your name &mdash; you keep full ownership'],
  dollar_ads_lead: ['creative testing, dollar ad accounts', 'creative testing, ad-account management'],
  pay1: ['MTN MoMo, Telecel Cash and AT Money', 'Debit or credit card via a secure payment link'],
  pay2: ['Bank transfer (GHS)', 'Bank transfer (USD)'],
  pay3: ['Debit or credit card via a secure payment link', 'International clients: card or international bank transfer'],
  pay_note_label: ['Diaspora clients', 'Clients in Ghana'],
  pay_note: ['Switch prices to United States (USD) to see our US prices; USD invoices are payable by card or international bank transfer', 'Switch prices to Ghana (GHS) to see Ghana prices, payable by MoMo, bank transfer or card'],
  prices_in: ['Prices are in Ghana cedis (GHS) for businesses in Ghana. Clients in the US, UK and Canada: switch to United States (USD) above for US prices.', 'Prices are in US dollars (USD). Businesses in Ghana: switch to Ghana (GHS) above for Ghana prices.'],
  prices_in_short: ['in GHS', 'in USD'],
  market_position: ['Our starting prices sit in the middle of the Ghanaian market.', 'Our US prices are published starting points; your proposal fixes the exact figure.'],
  faq_usd: ['Yes. Clients in the US, UK and Canada are quoted in US dollars: switch the price display to United States (USD) to see our US prices. The exact figure is fixed in your proposal.', 'Yes. Prices shown for the United States are in US dollars, and the exact figure is fixed in your proposal. Businesses in Ghana can switch to Ghana (GHS) prices.'],
  faq_pay: ['Mobile Money (MTN MoMo, Telecel Cash, AT Money), bank transfer and debit or credit card via a secure payment link. Clients outside Ghana pay USD invoices by card or international bank transfer.', 'Debit or credit card via a secure payment link, or bank transfer in US dollars. Clients in Ghana can also pay by Mobile Money in cedis.']
};

export const ALL = { ...Object.fromEntries(Object.entries(MONEY).map(([k, v]) => [k, v])), ...Object.fromEntries(Object.entries(WORDS).map(([k, v]) => [k, v])) };

for (const [k, v] of Object.entries(ALL)) {
  for (const s of v.slice(0, 2)) if (/["<>]|&(?!mdash;)/.test(s)) throw new Error('money.mjs: unsafe character in ' + k);
}
