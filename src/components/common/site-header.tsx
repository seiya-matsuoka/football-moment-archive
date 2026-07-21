/**
 * アプリ名とグローバルナビゲーションを表示する共通ヘッダー。
 */

import Link from 'next/link';

import { APP_NAME } from '@/lib/constants';

import { GlobalNavigation } from './global-navigation';
import { PageContainer } from './page-container';

/** すべての画面上部へ共通して表示するサイトヘッダー。 */
export function SiteHeader() {
  return (
    <header className="border-border bg-surface border-b">
      <PageContainer className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        {/* アプリ名は、どの画面からでもホームへ戻る導線として使用する。 */}
        <Link
          href="/"
          className="rounded-control text-text hover:text-muted focus-visible:outline-focus w-fit text-lg font-bold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {APP_NAME}
        </Link>

        <GlobalNavigation />
      </PageContainer>
    </header>
  );
}
