import type { Metadata } from 'next';
import './globals.css';
import { Footer } from './components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Affiliate Business',
    template: '%s | Affiliate Business',
  },
  description: 'アフィリエイト事業サイト',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col bg-white text-gray-900 antialiased">
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
