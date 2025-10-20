import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bill Explorer - Search Federal Legislation',
  description: 'Browse and search current bills in the 118th Congress. Find legislation you care about by topic, bill number, or keywords. Use bills as the subject of your letter to representatives.',
  keywords: [
    'bill explorer',
    'federal legislation',
    'search bills',
    'congress bills',
    'house bills',
    'senate bills',
    'find legislation',
    'browse bills',
    '118th congress',
    'congressional bills',
  ],
  openGraph: {
    title: 'Bill Explorer - Search Federal Legislation | Take Civic Action',
    description: 'Browse and search current bills in the 118th Congress. Find legislation you care about and use it to contact your representatives.',
    url: 'https://takecivicaction.org/bills',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bill Explorer - Search Federal Legislation | Take Civic Action',
    description: 'Browse and search current bills in the 118th Congress. Find legislation you care about and use it to contact your representatives.',
  },
};

export default function BillsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
