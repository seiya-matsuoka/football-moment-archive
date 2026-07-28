/**
 * ホーム、一覧、詳細の Route Loading で共有するプレースホルダー。
 */

import { Panel } from '@/components/common/panel';

type PageLoadingVariant = 'home' | 'list' | 'detail';

type PageLoadingProps = {
  /** 読み込み対象のページ構造。 */
  variant: PageLoadingVariant;
};

type LoadingBlockProps = {
  /** 表示箇所に合わせて幅と高さを指定する。 */
  className: string;
};

/** 読み込み中の文字や値を表す単純なプレースホルダー。 */
function LoadingBlock({ className }: LoadingBlockProps) {
  return <div aria-hidden="true" className={`rounded-control bg-surface-muted ${className}`} />;
}

/** 各ページで共通する見出し部分のプレースホルダー。 */
function LoadingHeader() {
  return (
    <div className="border-border pb-section border-b">
      <LoadingBlock className="h-10 w-2/3 max-w-xl" />
      <LoadingBlock className="mt-4 h-5 w-full max-w-2xl" />
      <LoadingBlock className="mt-2 h-5 w-4/5 max-w-xl" />
    </div>
  );
}

/** ホームの対象範囲、登録状況、最近の場面を表すプレースホルダー。 */
function HomeLoadingContent() {
  return (
    <>
      <Panel>
        <LoadingBlock className="h-6 w-28" />
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <LoadingBlock className="h-14 w-full" />
          <LoadingBlock className="h-14 w-full" />
        </div>
      </Panel>

      <section>
        <LoadingBlock className="h-7 w-32" />
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Panel key={index}>
              <LoadingBlock className="h-5 w-28" />
              <LoadingBlock className="mt-3 h-9 w-20" />
              <LoadingBlock className="mt-5 h-10 w-36" />
            </Panel>
          ))}
        </div>
      </section>

      <section>
        <LoadingBlock className="h-7 w-44" />
        <div className="mt-5 grid gap-4">
          {Array.from({ length: 2 }, (_, index) => (
            <Panel key={index}>
              <LoadingBlock className="h-6 w-2/3" />
              <LoadingBlock className="mt-3 h-5 w-24" />
              <div className="border-border mt-5 grid gap-4 border-t pt-5 sm:grid-cols-2">
                <LoadingBlock className="h-12 w-full" />
                <LoadingBlock className="h-12 w-full" />
              </div>
            </Panel>
          ))}
        </div>
      </section>
    </>
  );
}

/** 一覧の集計、条件フォーム、一覧項目を表すプレースホルダー。 */
function ListLoadingContent() {
  return (
    <>
      <Panel tone="muted">
        <div className="grid gap-4 sm:grid-cols-2">
          <LoadingBlock className="h-14 w-full" />
          <LoadingBlock className="h-14 w-full" />
        </div>
      </Panel>

      <Panel>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <LoadingBlock className="h-16 w-full" />
          <LoadingBlock className="h-16 w-full" />
          <LoadingBlock className="h-16 w-full" />
        </div>
        <LoadingBlock className="mt-5 h-10 w-32" />
      </Panel>

      <section>
        <LoadingBlock className="h-7 w-32" />
        <div className="mt-5 grid gap-4">
          {Array.from({ length: 2 }, (_, index) => (
            <Panel key={index}>
              <LoadingBlock className="h-6 w-2/3" />
              <LoadingBlock className="mt-3 h-5 w-32" />
              <LoadingBlock className="mt-5 h-16 w-full" />
            </Panel>
          ))}
        </div>
      </section>
    </>
  );
}

/** 詳細情報と関連データを表すプレースホルダー。 */
function DetailLoadingContent() {
  return (
    <>
      <Panel>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <LoadingBlock key={index} className="h-14 w-full" />
          ))}
        </div>
      </Panel>

      <section>
        <LoadingBlock className="h-7 w-40" />
        <Panel className="mt-5">
          <LoadingBlock className="h-6 w-2/3" />
          <LoadingBlock className="mt-3 h-5 w-28" />
          <LoadingBlock className="mt-5 h-20 w-full" />
        </Panel>
      </section>
    </>
  );
}

/**
 * `loading.tsx` が自動的に作る Suspense Boundary の fallback として、
 * 対象ページの大まかな構造が分かる表示を提供する。
 */
export function PageLoading({ variant }: PageLoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="space-y-section animate-pulse"
    >
      <span className="sr-only">ページを読み込んでいます。</span>
      <LoadingHeader />

      {variant === 'home' ? <HomeLoadingContent /> : null}
      {variant === 'list' ? <ListLoadingContent /> : null}
      {variant === 'detail' ? <DetailLoadingContent /> : null}
    </div>
  );
}
