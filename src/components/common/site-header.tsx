/**
 * アプリ名とグローバルナビゲーションを表示する共通ヘッダー。
 */

import Link from 'next/link';

import { APP_NAME, APP_SHORT_NAME } from '@/lib/constants';

import { GlobalNavigation } from './global-navigation';
import { PageContainer } from './page-container';

/* すべての画面上部へ共通して表示するサイトヘッダー。
 * Canvas より暗い Brand Surface を使用し、本文領域との階層を明確にする。*/
export function SiteHeader() {
  return (
    <header className="border-border-on-brand bg-brand-strong border-b">
      <PageContainer className="flex items-center justify-between gap-2 py-3 sm:gap-4 sm:py-4">
        <Link
          href="/"
          aria-label={APP_NAME}
          className="text-text-on-brand hover:text-brand-soft focus-visible:outline-focus-on-brand rounded-control w-fit shrink-0 text-lg font-bold tracking-tight transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <span className="sm:hidden">{APP_SHORT_NAME}</span>
          <span className="hidden sm:inline">{APP_NAME}</span>
        </Link>

        <GlobalNavigation />
      </PageContainer>
    </header>
  );
}
