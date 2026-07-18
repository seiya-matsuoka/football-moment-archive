import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Football Moment Archive',
  description: 'サッカーの試合で記憶に残った場面を記録する Web アプリケーション',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
