/**
 * URL の一覧条件を使用し、DB に登録されている場面と関連試合を一覧表示する Server Component。
 */

import type { Metadata } from 'next';

import { Button } from '@/components/common/button';
import { EmptyState } from '@/components/common/empty-state';
import { LinkButton } from '@/components/common/link-button';
import { PageHeader } from '@/components/common/page-header';
import { Pagination } from '@/components/common/pagination';
import { SectionHeader } from '@/components/common/section-header';
import { MomentListFilterForm } from '@/components/moments/moment-list-filter-form';
import { MomentList } from '@/components/moments/moment-list';
import { DATA_LIMITS, ITEMS_PER_PAGE } from '@/lib/constants';
import {
  createMomentListSearchParams,
  parseMomentListSearchParams,
  type RawSearchParams,
} from '@/lib/list-search-params';
import { clampPage, getTotalPages } from '@/lib/pagination';
import { getMatchCount } from '@/server/data-access/matches';
import {
  getFavoriteMomentCount,
  getMomentCount,
  getMomentList,
  getMomentListCount,
} from '@/server/data-access/moments';

import { toggleMomentFavoriteAction } from './actions';

type MomentsPageProps = {
  /** Next.js 16 では URL 検索パラメーターを Promise として受け取る。 */
  searchParams: Promise<RawSearchParams>;
};

/** DB の最新状態をリクエストごとに取得し、Build 時の DB 接続を避ける。 */
export const dynamic = 'force-dynamic';

/** ブラウザのタイトルへ場面一覧であることを表示する。 */
export const metadata: Metadata = {
  title: '場面一覧',
};

/** 件数、一覧条件、現在ページの場面と関連試合を取得して表示する。 */
export default async function MomentsPage({ searchParams }: MomentsPageProps) {
  const requestedQuery = parseMomentListSearchParams(await searchParams);

  // 登録総数・お気に入り総数と、現在の条件に一致する件数を並列で取得する。
  const [matchCount, momentCount, favoriteMomentCount, filteredMomentCount] = await Promise.all([
    getMatchCount(),
    getMomentCount(),
    getFavoriteMomentCount(),
    getMomentListCount(requestedQuery),
  ]);

  const totalPages = getTotalPages(filteredMomentCount, ITEMS_PER_PAGE);
  const currentPage = clampPage(requestedQuery.page, totalPages);
  const query = {
    ...requestedQuery,
    page: currentPage,
  };

  const moments = filteredMomentCount === 0 ? [] : await getMomentList(query);
  const hasReachedLimit = momentCount >= DATA_LIMITS.moments;
  const firstItemNumber = filteredMomentCount === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const lastItemNumber = Math.min(currentPage * ITEMS_PER_PAGE, filteredMomentCount);

  const headerMetadata = (
    <dl className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
      <div className="flex items-baseline gap-1.5">
        <dt className="text-muted">登録</dt>
        <dd className="text-text font-semibold tabular-nums">
          {momentCount}
          <span className="text-muted ml-1 text-xs font-normal">件</span>
        </dd>
      </div>
      <div className="border-border/50 flex items-baseline gap-1.5 sm:border-l sm:pl-4">
        <dt className="text-favorite font-medium">
          <span aria-hidden="true" className="mr-1">
            ★
          </span>
          お気に入り
        </dt>
        <dd className="text-text font-semibold tabular-nums">
          {favoriteMomentCount}
          <span className="text-muted ml-1 text-xs font-normal">件</span>
        </dd>
      </div>
      <div className="border-border/50 flex items-baseline gap-1.5 sm:border-l sm:pl-4">
        <dt className="text-muted">条件一致</dt>
        <dd className="text-text font-semibold tabular-nums">
          {filteredMomentCount}
          <span className="text-muted ml-1 text-xs font-normal">件</span>
        </dd>
      </div>
    </dl>
  );

  const headerActions =
    matchCount === 0 ? (
      <div className="max-w-xs text-right">
        <LinkButton href="/matches/new" variant="primary">
          試合を登録
        </LinkButton>
        <p className="text-muted mt-2 text-xs leading-5">場面を登録するには試合が必要です。</p>
      </div>
    ) : hasReachedLimit ? (
      <div className="max-w-xs text-right">
        <Button disabled>場面を登録</Button>
        <p className="text-muted mt-2 text-xs leading-5">
          最大 {DATA_LIMITS.moments} 件に到達しています。
        </p>
      </div>
    ) : (
      <LinkButton href="/moments/new" variant="primary">
        場面を登録
      </LinkButton>
    );

  return (
    <div className="space-y-6 sm:space-y-7">
      <PageHeader
        eyebrow="Moments"
        title="場面一覧"
        description="記録した場面を検索・絞り込みし、試合の記憶を振り返ります。"
        metadata={headerMetadata}
        actions={headerActions}
      />

      <MomentListFilterForm query={query} />

      {momentCount === 0 ? (
        <EmptyState
          eyebrow="Empty Archive"
          title="まだ場面が登録されていません"
          message="場面を登録するには、関連する試合が必要です。"
          actions={
            matchCount === 0 ? (
              <LinkButton href="/matches/new" variant="primary">
                試合を登録
              </LinkButton>
            ) : (
              <LinkButton href="/moments/new" variant="primary">
                最初の場面を登録
              </LinkButton>
            )
          }
        />
      ) : filteredMomentCount === 0 ? (
        <EmptyState
          eyebrow="No Results"
          title="条件に一致する場面がありません"
          message="条件を変更するか、一覧条件をリセットしてください。"
          actions={<LinkButton href="/moments">条件をリセット</LinkButton>}
        />
      ) : (
        <section aria-labelledby="moment-list-results-title">
          <SectionHeader
            eyebrow="Results"
            title="検索結果"
            titleId="moment-list-results-title"
            aside={
              <p className="text-muted text-sm tabular-nums">
                {filteredMomentCount} 件中 {firstItemNumber}〜{lastItemNumber} 件
              </p>
            }
          />

          <div className="mt-4">
            <MomentList moments={moments} favoriteAction={toggleMomentFavoriteAction} />
          </div>

          <Pagination
            pathname="/moments"
            currentPage={currentPage}
            totalPages={totalPages}
            searchParams={createMomentListSearchParams(query)}
          />
        </section>
      )}
    </div>
  );
}
