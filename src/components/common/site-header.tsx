/**
 * アプリ名とグローバルナビゲーションを表示する共通ヘッダー。
 */

import Link from 'next/link';

import { APP_NAME } from '@/lib/constants';

import { GlobalNavigation } from './global-navigation';
import { PageContainer } from './page-container';

/* すべての画面上部へ共通して表示するサイトヘッダー。
 * Canvas より暗い Brand Surface を使用し、本文領域との階層を明確にする。*/
export function SiteHeader() {
  return (
    <header className="border-border-on-brand bg-brand-strong border-b">
      <PageContainer className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="text-text-on-brand hover:text-brand-soft focus-visible:outline-focus-on-brand rounded-control w-fit text-lg font-bold tracking-tight transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {APP_NAME}
        </Link>

        <GlobalNavigation />
      </PageContainer>
    </header>
  );
}
