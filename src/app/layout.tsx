import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Cloud Resilience Tycoon',
  description: 'Manage your cloud infrastructure',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  );
}
