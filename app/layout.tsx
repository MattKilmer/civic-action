import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://takecivicaction.org"),
  title: {
    default: "Contact Your Representatives | Take Civic Action - Free AI Letter Generator",
    template: "%s | Take Civic Action"
  },
  description: "Free tool to contact your elected officials. Enter your address, select your issue, and get AI-generated personalized letters to send to representatives from local to federal level. 100% nonpartisan, privacy-first, and always free.",
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
    description: "Find your elected officials from local to federal level and generate respectful, AI-assisted emails to contact them. Free, nonpartisan, and privacy-first.",
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
    description: "Find your elected officials and generate respectful, AI-assisted emails. Free, nonpartisan, privacy-first.",
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
    // Add when available
    // google: "verification-code",
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

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
