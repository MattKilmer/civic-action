import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://takecivicaction.org"),
  title: {
    default: "Contact Your Representatives | Take Civic Action - Free AI Letter Generator",
    template: "%s | Take Civic Action"
  },
  description: "Contact your representatives in minutes. Find officials, search bills, and generate AI-powered letters. Free, nonpartisan, privacy-first civic engagement tool.",
  keywords: [
    // Primary keywords
    "contact representatives",
    "email elected officials",
    "contact congress",
    "write to congressman",
    "contact senator",
    // Long-tail keywords
    "how to contact my representative",
    "find my elected officials",
    "email generator for congress",
    "civic engagement tool",
    "contact government officials",
    // Action-oriented
    "contact representatives about issues",
    "write to congress",
    "email my representative",
    // Brand/category
    "civic action",
    "democracy tools",
    "constituent communication",
    "political advocacy tools",
    // Features
    "AI letter generator",
    "free civic engagement",
    "nonpartisan civic tool"
  ],
  authors: [{ name: "Civic Action" }],
  creator: "Civic Action",
  publisher: "Civic Action",
  alternates: {
    canonical: "https://takecivicaction.org",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://takecivicaction.org",
    title: "Take Civic Action | Contact Your Representatives",
    description: "Contact your representatives in minutes. Find officials, search bills, and generate AI-powered letters. Free, nonpartisan, privacy-first.",
    siteName: "Take Civic Action",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Take Civic Action - Contact Your Representatives",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@takecivicaction",
    creator: "@takecivicaction",
    title: "Take Civic Action | Contact Your Representatives",
    description: "Contact your representatives in minutes. Find officials, search bills, generate AI letters. Free, nonpartisan, privacy-first.",
    images: ["/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Google Search Console verification
    // To add: Go to https://search.google.com/search-console
    // 1. Add property: takecivicaction.org
    // 2. Choose "HTML tag" method
    // 3. Copy the content value and paste below
    // 4. Uncomment and deploy
    // google: "your-verification-code-here",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured data for search engines (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Take Civic Action",
    "applicationCategory": "GovernmentApplication",
    "operatingSystem": "Any",
    "url": "https://takecivicaction.org",
    "description": "Free tool to contact your elected representatives with AI-generated letters. Find officials from local to federal level and send personalized, respectful emails.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "audience": {
      "@type": "Audience",
      "audienceType": "US Citizens",
      "geographicArea": {
        "@type": "Country",
        "name": "United States"
      }
    },
    "creator": {
      "@type": "Organization",
      "name": "Civic Action",
      "url": "https://takecivicaction.org"
    },
    "featureList": [
      "Find elected officials by address",
      "AI-generated personalized letters",
      "Contact information for representatives",
      "Federal, state, and local officials",
      "Privacy-first, no data storage",
      "100% free for citizens"
    ]
  };

  // FAQ structured data for rich snippets
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I find my elected representatives?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Enter your address (city, state, or full street address) and we'll instantly show you all your representatives from local to federal level, including House, Senate, and state legislators."
        }
      },
      {
        "@type": "Question",
        "name": "Is this tool really free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, completely free forever for individual citizens. No ads, no paid tiers, no subscriptions. We're committed to keeping civic engagement accessible to all Americans."
        }
      },
      {
        "@type": "Question",
        "name": "Do you store my address or political views?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. We never store your address, political positions, or communication content. Your data stays private - we only use your address temporarily to look up officials, then immediately discard it."
        }
      },
      {
        "@type": "Question",
        "name": "How does the AI letter generator work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Select your issue and stance, optionally add a bill number and personal impact. Our AI generates a respectful, personalized 150-220 word letter in seconds. You can edit it before sending."
        }
      },
      {
        "@type": "Question",
        "name": "Is this tool nonpartisan?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, 100% nonpartisan. We serve all Americans regardless of political affiliation. We show all representatives equally and support all viewpoints."
        }
      },
      {
        "@type": "Question",
        "name": "What contact methods are available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We provide email addresses (when available), web contact forms, phone numbers, and official websites. For web forms, we auto-copy your letter and provide step-by-step guidance."
        }
      }
    ]
  };

  // HowTo structured data for process guidance
  const howToStructuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Contact Your Representatives",
    "description": "Step-by-step guide to contacting elected officials using Take Civic Action",
    "totalTime": "PT5M",
    "tool": [
      {
        "@type": "HowToTool",
        "name": "Your address (city, state, or full address)"
      }
    ],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Enter Your Address",
        "text": "Type your city and state (e.g., San Francisco, CA) or full street address to find your representatives.",
        "position": 1
      },
      {
        "@type": "HowToStep",
        "name": "Choose Your Issue",
        "text": "Select the issue you care about from topics like climate change, healthcare, housing, or education. Optionally search for a specific bill.",
        "position": 2
      },
      {
        "@type": "HowToStep",
        "name": "Select Your Stance",
        "text": "Choose whether you support or oppose the issue. Add optional details like personal impact or desired action.",
        "position": 3
      },
      {
        "@type": "HowToStep",
        "name": "Generate Your Letter",
        "text": "Click 'Draft email' for any representative. Our AI generates a personalized, respectful 150-220 word letter in seconds.",
        "position": 4
      },
      {
        "@type": "HowToStep",
        "name": "Send Your Message",
        "text": "Review and edit the letter if desired. Click the 'Send email' or 'Contact via web form' button to reach your representative.",
        "position": 5
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToStructuredData) }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />

        {/* Plausible Analytics - Privacy-respecting, GDPR compliant, no cookies */}
        {/* To enable:
            1. Sign up at https://plausible.io/register
            2. Add site: takecivicaction.org
            3. Uncomment the Script tag below
            4. See docs/ANALYTICS_SETUP.md for full guide
        */}
        {/* <Script defer data-domain="takecivicaction.org" src="https://plausible.io/js/script.js" /> */}
      </body>
    </html>
  );
}
