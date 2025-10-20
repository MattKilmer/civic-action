import type { Metadata } from "next";
import Link from "next/link";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "About | Take Civic Action",
  description: "Learn how Take Civic Action empowers citizens to contact their elected representatives through AI-powered communication tools.",
};

export default function AboutPage() {
  return (
    <>
      <TopNav />
      <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About Take Civic Action
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Empowering every American to make their voice heard by their elected representatives through accessible, AI-powered communication tools.
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-12 pb-12 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Democracy works best when citizens actively participate. Yet 78% of Americans who want to contact their representatives never do—not because they don&apos;t care, but because the process is too difficult.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Take Civic Action removes every barrier. We make it possible for anyone to draft personalized, respectful letters to their elected officials in under 3 minutes—from local representatives to federal legislators.
          </p>
        </section>

        {/* How It Works Section */}
        <section className="mb-12 pb-12 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">How It Works</h2>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Enter Your Address</h3>
                <p className="text-gray-700 leading-relaxed">
                  Simply enter your city and state (or full street address). We instantly find all your elected officials—from city council to Congress.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">2</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Your Issue</h3>
                <p className="text-gray-700 leading-relaxed">
                  Choose from the top issues facing Americans today—climate change, healthcare, housing, education, and more. Select whether you support or oppose action on the issue.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">3</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Drafts Your Letter</h3>
                <p className="text-gray-700 leading-relaxed">
                  Our AI generates a personalized, respectful letter based on your stance and personal story. Each letter is unique—never a form letter or petition.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">4</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Send or Customize</h3>
                <p className="text-gray-700 leading-relaxed">
                  Review your draft, make any edits you&apos;d like, and send it with one click. Or copy it to use however you prefer. You&apos;re always in control.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why It Matters Section */}
        <section className="mb-12 pb-12 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Contacting Your Representatives Matters</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Research from the Congressional Management Foundation shows that <strong>personalized constituent letters are the #1 most influential form of constituent communication</strong>—more impactful than petitions, social media posts, or even protests.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Congressional offices rank individualized emails 10x more influential than form letters or petitions. When you send a personal letter, it gets read, tallied, and directly influences how your representative votes.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Just 50-100 letters from constituents on a single issue often prompts action. 500+ letters can change a vote. Your voice matters.
          </p>
        </section>

        {/* Our Values Section */}
        <section className="mb-12 pb-12 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our Core Values</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Nonpartisan */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">100% Nonpartisan</h3>
                  <p className="text-sm text-gray-700">
                    We serve all Americans, regardless of political affiliation. You can support OR oppose any issue—we enable your voice, we don&apos;t choose positions.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy-First */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy-First</h3>
                  <p className="text-sm text-gray-700">
                    We never store your address, political positions, or drafts. Our stateless architecture means there&apos;s no database to breach or data to sell.
                  </p>
                </div>
              </div>
            </div>

            {/* Free Forever */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Free Forever</h3>
                  <p className="text-sm text-gray-700">
                    Civic participation should never have a price tag. This tool is free for all citizens, always. No ads, no upsells, no hidden fees.
                  </p>
                </div>
              </div>
            </div>

            {/* Open Source */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Open Source & Transparent</h3>
                  <p className="text-sm text-gray-700">
                    Our code is fully open source. Anyone can audit how we work, verify our privacy claims, and contribute improvements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="mb-12 pb-12 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Technology</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Take Civic Action uses modern AI to draft personalized letters while maintaining strict quality and ethical standards:
          </p>

          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              <span><strong>AI Letter Generation:</strong> We use OpenAI&apos;s GPT-4 to draft letters, tuned for respectful, civil communication</span>
            </li>
            <li className="flex gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              <span><strong>Representative Data:</strong> Powered by 5 Calls API, providing accurate federal and state official contact info</span>
            </li>
            <li className="flex gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              <span><strong>Quality Standards:</strong> All drafts are 150-220 words, fact-based (no fabricated data), and maintain a respectful tone</span>
            </li>
            <li className="flex gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              <span><strong>Stateless Architecture:</strong> No database means your data never persists—ultimate privacy by design</span>
            </li>
          </ul>
        </section>

        {/* Who We Are Section */}
        <section className="mb-12 pb-12 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Who We Are</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Take Civic Action is an independent civic technology project committed to strengthening American democracy by making constituent communication accessible to everyone.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We&apos;re not affiliated with any political party, candidate, or advocacy organization. Our mission is simple: help citizens speak to their representatives, regardless of which issues they care about or which positions they hold.
          </p>
        </section>

        {/* Get Started CTA */}
        <section className="bg-blue-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Ready to Make Your Voice Heard?
          </h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Join thousands of Americans contacting their representatives about the issues that matter most.
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Get Started
          </Link>
        </section>
      </div>
    </main>
    <Footer />
    </>
  );
}
