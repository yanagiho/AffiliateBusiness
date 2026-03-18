import type { Metadata } from 'next';
import AuthProvider from '../components/AuthProvider';
import LogoutButton from '../components/LogoutButton';
import './globals.css';

export const metadata: Metadata = {
  title: 'Admin | Affiliate Business',
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-100 antialiased">
        <AuthProvider>
          <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-indigo-700">🗂 Affiliate Admin</span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">port 3001</span>
            </div>
            <LogoutButton />
          </header>
          <div className="p-6">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
