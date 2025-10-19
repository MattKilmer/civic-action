import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://takecivicaction.org"),
  title: "Take Civic Action | Contact Your Representatives",
  description: "Empowering effective civic action through streamlined communication. Find your elected officials from local to federal level and generate respectful, AI-assisted emails to contact them.",
  keywords: ["civic engagement", "contact representatives", "elected officials", "government", "democracy", "advocacy", "civic action", "email representatives"],
  authors: [{ name: "Civic Action" }],
  creator: "Civic Action",
  publisher: "Civic Action",
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
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
