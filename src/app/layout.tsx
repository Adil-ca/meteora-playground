import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Meteora Playground — Understand liquidity. Play the market.',
  description:
    'Play BIN RUNNER, experiment in Range Lab, and discover DLMM, DAMM v2 and Dynamic Bonding Curve. An independent educational playground.',
  openGraph: {
    title: 'Meteora Playground',
    description: 'One market. Fifteen bins. Your move.',
    images: ['/assets/social-card.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meteora Playground',
    images: ['/assets/social-card.png'],
  },
  icons: { icon: '/icon.svg' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>{children}</body>
    </html>
  );
}
