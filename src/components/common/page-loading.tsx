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
    <div className="border-border/60 border-b pb-7">
      <LoadingBlock className="h-3 w-24" />
      <LoadingBlock className="mt-3 h-10 w-2/3 max-w-xl" />
      <LoadingBlock className="mt-4 h-5 w-full max-w-2xl" />
      <LoadingBlock className="mt-2 h-5 w-4/5 max-w-xl" />
    </div>
  );
}

/** カードグリッド部分を表すプレースホルダー。 */
function CardGrid({ count = 2 }: { count?: number }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {Array.from({ length: count }, (_, index) => (
        <Panel key={index}>
          <div className="grid gap-4 text-center sm:grid-cols-3">
            <LoadingBlock className="h-12 w-full" />
            <LoadingBlock className="h-12 w-full" />
            <LoadingBlock className="h-12 w-full" />
          </div>
          <div className="border-border/45 mt-5 border-t pt-4">
            <LoadingBlock className="h-10 w-full" />
          </div>
        </Panel>
      ))}
    </div>
  );
}

/** ホームの対象範囲、登録状況、最近の場面を表すプレースホルダー。 */
function HomeLoadingContent() {
  return (
    <>
      <Panel>
        <LoadingBlock className="h-24 w-full" />
      </Panel>
      <Panel>
        <LoadingBlock className="h-40 w-full" />
      </Panel>
      <section>
        <LoadingBlock className="mb-4 h-7 w-52" />
        <CardGrid />
      </section>
    </>
  );
}

/** 一覧の集計、条件フォーム、一覧項目を表すプレースホルダー。 */
function ListLoadingContent() {
  return (
    <>
      <Panel tone="muted">
        <LoadingBlock className="h-28 w-full" />
      </Panel>
      <section>
        <LoadingBlock className="mb-4 h-7 w-36" />
        <CardGrid count={4} />
      </section>
    </>
  );
}

/** 詳細情報と関連データを表すプレースホルダー。 */
function DetailLoadingContent() {
  return (
    <>
      <Panel>
        <LoadingBlock className="h-56 w-full" />
      </Panel>
      <Panel>
        <LoadingBlock className="h-40 w-full" />
      </Panel>
      <Panel tone="error">
        <LoadingBlock className="h-24 w-full" />
      </Panel>
    </>
  );
}

/** Route Segment の大まかな構造が分かる Skeleton を表示する。 */
export function PageLoading({ variant }: PageLoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="animate-pulse space-y-6 sm:space-y-8"
    >
      <span className="sr-only">ページを読み込んでいます。</span>
      <LoadingHeader />
      {variant === 'home' ? <HomeLoadingContent /> : null}
      {variant === 'list' ? <ListLoadingContent /> : null}
      {variant === 'detail' ? <DetailLoadingContent /> : null}
    </div>
  );
}
