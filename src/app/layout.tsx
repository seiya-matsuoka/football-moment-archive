/**
 * アプリ全体の Metadata と共通レイアウトを定義する Root Layout。
 */

import type { Metadata } from 'next';

import { PageContainer } from '@/components/common/page-container';
import { PublicDemoNotice } from '@/components/common/public-demo-notice';
import { SiteHeader } from '@/components/common/site-header';
import { APP_DESCRIPTION, APP_NAME } from '@/lib/constants';

import './globals.css';

/** 各画面で個別タイトルを設定した場合も、アプリ名を共通して末尾へ表示する。 */
export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
};

/** すべての Route へ共通ヘッダー、本文領域、公開デモ案内を適用する。 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        {/* キーボード操作時に、共通ナビゲーションを飛ばして本文へ移動できるようにする。 */}
        <a
          href="#main-content"
          className="rounded-control bg-accent text-accent-foreground focus:outline-focus sr-only z-50 px-4 py-3 text-sm font-semibold focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:outline-2 focus:outline-offset-2"
        >
          本文へ移動
        </a>

        <div className="flex min-h-screen flex-col">
          <SiteHeader />

          <main id="main-content" className="flex-1">
            <PageContainer className="py-section">{children}</PageContainer>
          </main>

          <PublicDemoNotice />
        </div>
      </body>
    </html>
  );
}
