import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Take Civic Action | Contact Your Representatives",
  description: "Empowering effective civic action through streamlined communication. Find your elected officials from local to federal level and generate respectful, AI-assisted emails to contact them.",
  keywords: ["civic engagement", "contact representatives", "elected officials", "government", "democracy", "advocacy"],
  authors: [{ name: "Civic Action" }],
  openGraph: {
    title: "Take Civic Action | Contact Your Representatives",
    description: "Find your elected officials and generate respectful emails to contact them.",
    url: "https://takecivicaction.org",
    siteName: "Take Civic Action",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Take Civic Action | Contact Your Representatives",
    description: "Find your elected officials and generate respectful emails to contact them.",
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
