import type { Metadata } from "next";
import Link from "next/link";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Take Civic Action",
  description: "Our commitment to your privacy: we never store addresses, political positions, or communication content.",
};

export default function PrivacyPage() {
  return (
    <>
      <TopNav />
      <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600">
            Last Updated: October 19, 2025
          </p>
        </div>

        {/* Privacy Commitment */}
        <section className="mb-12 pb-12 border-b border-gray-200">
          <div className="bg-emerald-50 border-l-4 border-emerald-600 p-6 rounded-r-lg mb-8">
            <h2 className="text-xl font-semibold text-emerald-900 mb-3">Our Privacy Commitment</h2>
            <p className="text-emerald-800 leading-relaxed">
              <strong>We never store your address, political positions, or communication content.</strong> Take Civic Action is built with privacy-by-design architecture—our stateless system means there&apos;s no database to breach, no data to sell, and no tracking to worry about.
            </p>
          </div>

          <p className="text-gray-700 leading-relaxed">
            This privacy policy explains what data we do and don&apos;t collect, how we use it, and your rights. We believe civic participation requires trust, and trust requires transparency.
          </p>
        </section>

        {/* What We Don't Collect */}
        <section className="mb-12 pb-12 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">What We Don&apos;t Collect</h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Your Address</h3>
                <p className="text-gray-700">
                  When you enter your address to find representatives, we use it instantly to look up your officials—then we discard it. It&apos;s never stored in any database.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Your Political Positions</h3>
                <p className="text-gray-700">
                  The issues you select, your stance (support/oppose), and your personal stories are processed in real-time to generate your draft—but never saved.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Your Letter Drafts</h3>
                <p className="text-gray-700">
                  The AI-generated letters we create for you exist only in your browser. We don&apos;t store them on our servers.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Personal Identifiable Information (PII)</h3>
                <p className="text-gray-700">
                  No email addresses, phone numbers, names, or accounts. You use our tool completely anonymously.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Tracking or Analytics Cookies</h3>
                <p className="text-gray-700">
                  We don&apos;t use cookies, pixels, or fingerprinting to track your activity across the web or on our site.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do Collect */}
        <section className="mb-12 pb-12 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">What We Do Collect</h2>

          <p className="text-gray-700 mb-6">
            We collect the absolute minimum data necessary to operate the service:
          </p>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Server Logs (Temporary)</h3>
                <p className="text-gray-700 mb-2">
                  Our hosting provider (Vercel) automatically collects standard server logs including:
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
                  <li>IP address (anonymized after 24 hours)</li>
                  <li>Browser type and version</li>
                  <li>Date/time of requests</li>
                  <li>Pages visited</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Purpose:</strong> Security, debugging, and preventing abuse (rate limiting).
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Retention:</strong> 7 days maximum, then automatically deleted.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Aggregate Usage Statistics (Optional)</h3>
                <p className="text-gray-700 mb-2">
                  We may collect anonymized, aggregate data such as:
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
                  <li>Total number of letters generated (no content)</li>
                  <li>General geographic distribution (state-level only, no addresses)</li>
                  <li>Which issue topics are most selected (to improve topic list)</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Important:</strong> This data cannot be traced back to you. It&apos;s aggregated and anonymized.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How We Use Data */}
        <section className="mb-12 pb-12 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Data</h2>

          <div className="space-y-4 text-gray-700">
            <p>
              <strong>Operational Use:</strong> Your address is used instantly to look up your representatives via the 5 Calls API. Your issue and stance are sent to OpenAI to generate your letter draft. Both operations happen in real-time and nothing is stored.
            </p>
            <p>
              <strong>Security & Abuse Prevention:</strong> Server logs help us detect and prevent abuse (spam, attacks, excessive requests). Rate limiting is based on anonymized IP addresses.
            </p>
            <p>
              <strong>Service Improvement:</strong> Aggregate statistics help us understand which features are used and where to focus development (e.g., if everyone uses custom topics, we might expand the topic list).
            </p>
            <p>
              <strong>What We Don&apos;t Do:</strong> We never sell data, share data with third parties (except as required to operate the service), or use data for advertising.
            </p>
          </div>
        </section>

        {/* Third-Party Services */}
        <section className="mb-12 pb-12 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>

          <p className="text-gray-700 mb-6">
            To provide our service, we use the following third-party providers:
          </p>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">OpenAI (AI Letter Generation)</h3>
              <p className="text-sm text-gray-700 mb-2">
                When you request a draft, your issue, stance, and optional details are sent to OpenAI&apos;s API to generate your letter.
              </p>
              <p className="text-sm text-gray-600">
                <strong>OpenAI&apos;s Policy:</strong> API inputs are not used to train their models and are deleted after 30 days.
              </p>
              <a
                href="https://openai.com/policies/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                OpenAI Privacy Policy →
              </a>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">5 Calls API (Representative Data)</h3>
              <p className="text-sm text-gray-700 mb-2">
                When you enter your address, we send it to the 5 Calls API to find your representatives. 5 Calls is a nonprofit civic organization.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Their Policy:</strong> They don&apos;t store addresses submitted via API.
              </p>
              <a
                href="https://5calls.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Learn more about 5 Calls →
              </a>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Vercel (Hosting)</h3>
              <p className="text-sm text-gray-700 mb-2">
                Our website is hosted on Vercel, which automatically collects server logs for security and performance.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Retention:</strong> Logs are automatically deleted after 7 days.
              </p>
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Vercel Privacy Policy →
              </a>
            </div>
          </div>
        </section>

        {/* Data Security */}
        <section className="mb-12 pb-12 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>

          <p className="text-gray-700 mb-4">
            The best security is not storing data in the first place. Our stateless architecture means:
          </p>

          <ul className="space-y-2 text-gray-700">
            <li className="flex gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              <span><strong>No database to breach:</strong> There&apos;s no central repository of user data that could be hacked.</span>
            </li>
            <li className="flex gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              <span><strong>HTTPS encryption:</strong> All communications between your browser and our servers are encrypted.</span>
            </li>
            <li className="flex gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              <span><strong>Rate limiting:</strong> We prevent abuse by limiting requests per IP address.</span>
            </li>
            <li className="flex gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              <span><strong>Open source:</strong> Our code is publicly auditable on GitHub—you can verify our privacy claims.</span>
            </li>
          </ul>
        </section>

        {/* Your Rights */}
        <section className="mb-12 pb-12 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>

          <p className="text-gray-700 mb-4">
            Since we don&apos;t store personal data, most data rights requests don&apos;t apply—there&apos;s nothing to access, correct, or delete. However:
          </p>

          <ul className="space-y-2 text-gray-700">
            <li className="flex gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              <span><strong>Transparency:</strong> You have the right to understand what data we collect (this policy).</span>
            </li>
            <li className="flex gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              <span><strong>Questions:</strong> If you have questions about our privacy practices, contact us (see below).</span>
            </li>
            <li className="flex gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              <span><strong>Open Source Audit:</strong> You can review our code on GitHub to verify privacy claims.</span>
            </li>
          </ul>
        </section>

        {/* Children's Privacy */}
        <section className="mb-12 pb-12 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Children&apos;s Privacy</h2>

          <p className="text-gray-700">
            Our service is intended for general audiences. We don&apos;t knowingly collect data from children under 13. Since we don&apos;t collect personal information from anyone, and the service requires no account or registration, children can use the tool safely under parental guidance (e.g., in civics classes).
          </p>
        </section>

        {/* International Users */}
        <section className="mb-12 pb-12 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">International Users</h2>

          <p className="text-gray-700 mb-4">
            Take Civic Action is designed for U.S. residents contacting U.S. elected officials. Our servers are located in the United States.
          </p>
          <p className="text-gray-700">
            If you use our service from outside the U.S., your data will be processed in the U.S. However, since we don&apos;t store personal data, this has minimal privacy implications.
          </p>
        </section>

        {/* Changes to Policy */}
        <section className="mb-12 pb-12 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Policy</h2>

          <p className="text-gray-700 mb-4">
            We may update this privacy policy from time to time. If we make significant changes, we&apos;ll update the &quot;Last Updated&quot; date at the top of this page and may notify users via a banner on the site.
          </p>
          <p className="text-gray-700">
            We encourage you to review this policy periodically. Your continued use of the service after changes constitutes acceptance of the updated policy.
          </p>
        </section>

        {/* Contact */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>

          <p className="text-gray-700 mb-4">
            If you have questions about this privacy policy or our data practices:
          </p>

          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 mb-2">
              <strong>Email:</strong> <a href="mailto:privacy@takecivicaction.org" className="text-blue-600 hover:text-blue-800 underline">privacy@takecivicaction.org</a>
            </p>
            <p className="text-gray-700">
              <strong>GitHub:</strong> <a href="https://github.com/MattKilmer/civic-action/issues" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Report an issue</a>
            </p>
          </div>
        </section>

        {/* Back to Home */}
        <div className="text-center pt-8 border-t border-gray-200">
          <Link
            href="/"
            className="inline-block text-blue-600 hover:text-blue-800 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
    <Footer />
    </>
  );
}
