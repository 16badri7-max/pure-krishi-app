import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pure Krishi | Demand-First Agricultural Platform',
  description: 'AI-Powered Agricultural Procurement Platform connecting farmers with buyers directly.',
  keywords: ['organic farming', 'agriculture', 'farmer marketplace', 'pure krishi'],
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#FAF8F0] text-[#17231C] antialiased">{children}</body>
    </html>
  );
}
