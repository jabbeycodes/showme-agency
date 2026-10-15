// ============================================================================
// Ghana-view legal text (unchanged substance from the previous site; shown
// only in the Ghana view). The US default text lives in pages.mjs.
// ============================================================================
import { site } from './data.mjs';
import { pr } from './money.mjs';
import { esc } from './render.mjs';

export function ghPrivacyBody(mail) {
  return `
        <h2>1. Who we are</h2>
        <p>This policy applies to ShowMe Digital Agency ("ShowMe", "we", "us"), the digital agency of ShowMe World (US-led, with our team on the ground in Accra, Ghana), and to this website at agency.showmeworld.app. For the personal data described below, we are the data controller under the Data Protection Act, 2012 (Act 843). You can contact us about privacy at any time at ${mail} or on WhatsApp at ${esc(site.whatsappDisplay)}.</p>

        <h2>2. The data we collect</h2>
        <h3>Information you give us</h3>
        <ul>
          <li><span><strong>Enquiries and audit requests:</strong> your name, business name, email address, phone or WhatsApp number, the services you're interested in, your challenge, budget band, timeline and message.</span></li>
          <li><span><strong>Conversations:</strong> messages you send us by WhatsApp, email or phone, and notes from calls.</span></li>
          <li><span><strong>Client information:</strong> if you become a client, contact and billing details, the content and materials you provide, and access details for accounts we manage on your behalf.</span></li>
        </ul>
        <h3>Information collected automatically</h3>
        <ul>
          <li><span><strong>Anonymous usage counts:</strong> our site records simple totals (page views, form submissions and WhatsApp button clicks) without cookies and without identifying you.</span></li>
          <li><span><strong>Form metadata:</strong> when you submit a form, we store the time and your browser type (user-agent) with your enquiry to help prevent spam.</span></li>
          <li><span><strong>Security logs:</strong> our hosting provider processes technical data such as IP addresses to deliver the site and protect it from abuse.</span></li>
        </ul>
        <h3>Cookies</h3>
        <p>We do not use advertising or tracking cookies on this website.</p>

        <h2>3. How and why we use your data</h2>
        <p>Act 843 requires a lawful basis for processing personal data. We rely on:</p>
        <ul>
          <li><span><strong>Your consent</strong>, when you submit a form or message us, to reply to your enquiry and send the audit or information you asked for.</span></li>
          <li><span><strong>Performance of a contract</strong>, to scope, deliver, bill for and support the services you buy.</span></li>
          <li><span><strong>Our legitimate interests</strong>, to keep our website secure, understand overall usage and improve our services, in ways that don't override your rights.</span></li>
          <li><span><strong>Legal obligations</strong>, such as keeping accounting and tax records.</span></li>
        </ul>
        <p>We will only send you marketing messages if you have agreed to receive them, and every message will tell you how to opt out.</p>

        <h2>4. Who we share data with</h2>
        <p>We never sell your personal data. We share it only with service providers that help us run the business, under appropriate confidentiality and security terms:</p>
        <ul>
          <li>website hosting and security (for example, Cloudflare);</li>
          <li>communication tools (for example, WhatsApp, which is operated by Meta, and our email provider);</li>
          <li>payment providers that process MoMo, card and bank payments (we do not store full card details);</li>
          <li>productivity, file storage and project tools we use to deliver your work.</li>
        </ul>
        <p>We may also disclose data where required by law, or to protect our rights or the safety of others.</p>

        <h2>5. International transfers</h2>
        <p>Some of our service providers store or process data outside Ghana. When that happens, we choose reputable providers and take reasonable steps to ensure your data receives a level of protection consistent with Act 843.</p>

        <h2>6. How long we keep data</h2>
        <ul>
          <li><span><strong>Enquiries that don't become projects:</strong> up to 24 months, then deleted.</span></li>
          <li><span><strong>Client records:</strong> for the length of our engagement and up to 6 years afterwards, to meet accounting, tax and legal requirements.</span></li>
          <li><span><strong>Anonymous usage counts:</strong> kept as totals, which contain no personal data.</span></li>
        </ul>

        <h2>7. How we protect data</h2>
        <p>We use access controls, strong authentication on our accounts, encrypted connections (HTTPS) and reputable providers. Access to client data is limited to the people who need it to deliver your work. No system is perfectly secure, but if a breach affects your personal data, we will notify you and the relevant authorities as required by law.</p>

        <h2>8. Your rights</h2>
        <p>Under the Data Protection Act, 2012 (Act 843), you have the right to:</p>
        <ul>
          <li>ask whether we hold personal data about you and request a copy of it;</li>
          <li>ask us to correct data that is inaccurate, out of date or incomplete;</li>
          <li>ask us to delete or destroy data we no longer have a lawful reason to keep;</li>
          <li>object to processing, and withdraw consent at any time where we rely on it;</li>
          <li>tell us to stop using your data for direct marketing.</li>
        </ul>
        <p>To exercise any of these rights, email ${mail}. We may need to confirm your identity first, and we aim to respond within 21 days. If you are unhappy with how we handle your data, you can complain to the Data Protection Commission of Ghana.</p>

        <h2>9. When we process data for clients</h2>
        <p>When we build or run systems for a client, such as a website form, online store, CRM or WhatsApp assistant, the client is the data controller for their customers' data and we act as a data processor on their instructions. We process that data only to deliver the agreed services, keep it confidential and secure, and return or delete it when the engagement ends. Clients are responsible for having a lawful basis for the data they ask us to process and for their own privacy notices.</p>

        <h2>10. Children</h2>
        <p>Our services are aimed at businesses. We don't knowingly collect personal data from anyone under 18 through this website.</p>

        <h2>11. Changes to this policy</h2>
        <p>We may update this policy as our services or the law change. The "last updated" date at the top shows when it was last revised. Significant changes will be highlighted on this page.</p>

        <h2>12. Contact</h2>
        <p>ShowMe Digital Agency: US-led, with our team on the ground in Accra, Ghana. Email ${mail} or WhatsApp ${esc(site.whatsappDisplay)}. See also our <a href="/terms/">Terms of Service</a>.</p>
`;
}

export function ghTermsBody(mail) {
  return `
        <h2>1. About these terms</h2>
        <p>These terms apply between ShowMe Digital Agency ("ShowMe", "we", "us"), the digital agency of ShowMe World (US-led, with our team on the ground in Accra, Ghana), and you, the client ("you"). They apply to every engagement together with your written proposal. If the proposal and these terms conflict, the proposal wins for that engagement. You accept these terms when you approve a proposal or pay a deposit or first monthly fee.</p>

        <h2>2. Proposals and scope</h2>
        <ul>
          <li>Every engagement starts with a written proposal setting out the scope, deliverables, price, timeline and anything we need from you.</li>
          <li>We deliver what the proposal describes. Work outside that scope ("change requests") is quoted in writing before we start it.</li>
          <li>Unless the proposal says otherwise, design work includes two rounds of revisions.</li>
        </ul>

        <h2>3. Prices and quotes</h2>
        <ul>
${pr(`          <li>Prices on our website are starting ("from") prices for the scope described. Your proposal gives a fixed price for your specific project.</li>
          <li>Quotes are valid for 30 days. Prices are shown in US dollars (USD) by default and in Ghana cedis (GHS) for clients in Ghana; your proposal states the currency you will be invoiced in.</li>`, `          <li>Prices are given in your quote or proposal, which sets a fixed price for the scope described.</li>
          <li>Quotes are valid for 30 days and are in US dollars (USD) or, for clients in Ghana, Ghana cedis (GHS); your proposal states the currency you will be invoiced in.</li>`)}
          <li>Third-party costs are not included unless stated: for example ad spend, software and Microsoft licences, domain names, payment-provider fees, WhatsApp and AI usage fees, printing, and travel outside Greater Accra. We list any that apply in your proposal.</li>
        </ul>

        <h2>4. Payment terms</h2>
        <ul>
          <li><span><strong>Projects:</strong> 50% deposit before work starts and 50% on launch, after you approve a working preview (see section 5).</span></li>
          <li><span><strong>Retainers and monthly plans:</strong> billed monthly in advance.</span></li>
          <li><span><strong>Methods:</strong> {{faq_pay}}</span></li>
          <li><span><strong>Late payment:</strong> invoices are due within 7 days unless agreed otherwise. If a payment is more than 7 days late, we may pause work or monthly services until it is settled, and timelines move accordingly.</span></li>
        </ul>

        <h2>5. Preview before final payment</h2>
        <p>On every project, we show you a working preview before the final payment is due. If the preview does not match the scope agreed in your proposal, we fix it at no extra cost before asking for the final payment. Approval should not be unreasonably withheld; requests that go beyond the agreed scope are handled as change requests.</p>

        <h2>6. The ShowMe Growth retainer</h2>
        <ul>
${pr(`          <li>The Growth retainer costs ${esc(site.facts.retainerPrice)} per month, billed monthly in advance, with a 3-month minimum term.</li>
          <li>Ad spend is {{adspend_paid_full}}. We recommend at least ${esc(site.facts.adSpendMin)} per month.</li>`, `          <li>The Growth retainer is charged at the monthly price in your proposal, billed monthly in advance, with a 3-month minimum term.</li>
          <li>Ad spend is {{adspend_paid_full}}. We recommend a starting budget in your proposal.</li>`)}
          <li>After the minimum term, the retainer continues month to month. To cancel, give written notice (email or WhatsApp) at least 14 days before your next billing date.</li>
        </ul>

        <h2>7. The 7-day launch guarantee</h2>
        <p>For the Growth retainer, your landing page, lead system and reporting will be live within 7 days of onboarding, or your month 1 retainer fee is waived (or refunded if already paid). Onboarding is complete when we have received your first payment and the access, information and approvals listed in your onboarding checklist. The guarantee does not apply to delays caused by late information or approvals on your side, or by third-party reviews outside our control, such as ad-account or WhatsApp Business verification. Ad spend is never refunded under the guarantee because it is paid to the platforms.</p>

        <h2>8. Your responsibilities</h2>
        <ul>
          <li>Provide accurate content, information, access and approvals on time.</li>
          <li>Make sure you have the rights to any content, images, logos or data you give us.</li>
          <li>Comply with the laws that apply to your business, including advertising rules and the Data Protection Act, 2012 (Act 843) for your customers' data.</li>
        </ul>

        <h2>9. Ownership and intellectual property</h2>
        <ul>
          <li>Once you have paid in full, you own the final deliverables we create for you: website content and design, brand assets, documents and, for custom software, the code written specifically for you.</li>
          <li>Domains, ad accounts, app-store listings and similar accounts are set up in your name wherever possible.</li>
          <li>We keep ownership of our pre-existing tools, templates, know-how and general-purpose code, and give you a permanent licence to use them as part of your deliverables.</li>
          <li>Third-party components (such as themes, plugins, fonts, stock images or platforms) remain subject to their own licences.</li>
          <li>We will only show your project in our portfolio or publish a case study with your written permission.</li>
        </ul>

        <h2>10. Confidentiality</h2>
        <p>Both of us will keep the other's confidential information private and use it only for the engagement. This continues after the engagement ends.</p>

        <h2>11. Third-party platforms and results</h2>
        <p>Much of our work relies on platforms we don't control, including Google, Meta (Facebook, Instagram and WhatsApp), AI assistants, payment providers and hosting services. Their rules, fees, approvals and algorithms can change at any time. We guarantee our work, speed and transparency, but we do not guarantee specific rankings, AI recommendations, ad approvals, lead volumes or sales.</p>

        <h2>12. Support and fixes</h2>
        <p>Every project includes 30 days of post-launch support to fix defects in what we delivered. After that, support is available through a Website Care plan or a monthly plan, or quoted per request.</p>

        <h2>13. Cancellation and refunds</h2>
        <ul>
          <li><span><strong>Projects:</strong> you may cancel at any time by written notice. You pay for work completed up to that point; if your deposit exceeds the value of that work, we refund the difference.</span></li>
          <li><span><strong>Monthly services:</strong> fees for a month that has started are not refundable, except under the 7-day launch guarantee.</span></li>
          <li><span><strong>Automation Audit:</strong> the fee is non-refundable once the audit has started, and is credited in full toward an automation build started with us within 60 days.</span></li>
          <li>We may end an engagement if you seriously breach these terms and do not fix the breach within 14 days of notice.</li>
        </ul>

        <h2>14. Liability</h2>
        <p>We will carry out our work with reasonable skill and care. To the extent the law allows, our total liability under any engagement is limited to the fees you paid us for that engagement in the 3 months before the claim, and we are not liable for indirect losses such as lost profits, lost data or lost business opportunities. Nothing in these terms limits liability that cannot be limited under Ghanaian law.</p>

        <h2>15. Data protection</h2>
        <p>We handle personal data in line with our <a href="/privacy/">Privacy Policy</a> and the Data Protection Act, 2012 (Act 843). Where we process your customers' data on your behalf, we act on your instructions as described in section 9 of the Privacy Policy.</p>

        <h2>16. Electronic communications</h2>
        <p>Proposals, approvals and notices may be given by email, WhatsApp or electronic signature, and are valid in the same way as signed paper documents, in line with the Electronic Transactions Act, 2008 (Act 772).</p>

        <h2>17. Using this website</h2>
        <p>Content on this website is for general information and may change without notice. Our guides are practical advice, not legal, financial or tax advice. Please don't misuse the site, for example by attempting to disrupt it or by submitting spam through our forms.</p>

        <h2>18. Governing law and disputes</h2>
        <p>The governing law and the courts that have jurisdiction over an engagement are stated in your written proposal. If a dispute arises, we will first try to resolve it in good faith by discussion. If that fails, either of us may refer it to mediation before going to court.</p>

        <h2>19. Changes to these terms</h2>
        <p>We may update these terms from time to time. The version in force when you approve a proposal applies to that engagement. The "last updated" date shows the latest revision.</p>

        <h2>20. Contact</h2>
        <p>Questions about these terms? Email ${mail} or WhatsApp ${esc(site.whatsappDisplay)}.</p>
`;
}
