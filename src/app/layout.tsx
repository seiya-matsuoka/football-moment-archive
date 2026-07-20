import type { Metadata } from 'next';

import { PageContainer } from '@/components/common/page-container';
import { PublicDemoNotice } from '@/components/common/public-demo-notice';
import { SiteHeader } from '@/components/common/site-header';
import { APP_DESCRIPTION, APP_NAME } from '@/lib/constants';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <a
          href="#main-content"
          className="sr-only z-50 rounded-md bg-slate-950 px-4 py-3 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          本文へ移動
        </a>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main id="main-content" className="flex-1">
            <PageContainer className="py-10 sm:py-14">{children}</PageContainer>
          </main>
          <PublicDemoNotice />
        </div>
      </body>
    </html>
  );
}
