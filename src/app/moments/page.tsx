/**
 * URL の一覧条件を使用し、DB に登録されている場面と関連試合を一覧表示する Server Component。
 */

import type { Metadata } from 'next';

import { Button } from '@/components/common/button';
import { EmptyState } from '@/components/common/empty-state';
import { LinkButton } from '@/components/common/link-button';
import { PageHeader } from '@/components/common/page-header';
import { Pagination } from '@/components/common/pagination';
import { Panel } from '@/components/common/panel';
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
  const rawSearchParams = await searchParams;
  const requestedQuery = parseMomentListSearchParams(rawSearchParams);

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

  return (
    <div className="space-y-section">
      <PageHeader
        title="場面一覧"
        description={`登録済み ${momentCount} 件のうち、現在の条件に一致する場面は ${filteredMomentCount} 件です。`}
        actions={
          matchCount === 0 ? (
            <div className="max-w-xs text-right">
              <LinkButton href="/matches/new" variant="primary">
                試合を登録
              </LinkButton>
              <p className="text-muted mt-2 text-sm leading-5">
                場面を登録するには試合が必要です。
              </p>
            </div>
          ) : hasReachedLimit ? (
            <div className="max-w-xs text-right">
              <Button disabled>場面を登録</Button>
              <p className="text-muted mt-2 text-sm leading-5">
                最大 {DATA_LIMITS.moments} 件に到達しています。
              </p>
            </div>
          ) : (
            <LinkButton href="/moments/new" variant="primary">
              場面を登録
            </LinkButton>
          )
        }
      />

      <Panel tone="muted">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-muted text-sm font-medium">登録済み場面数</dt>
            <dd className="text-text mt-1 text-xl font-semibold">{momentCount} 件</dd>
          </div>

          <div>
            <dt className="text-muted text-sm font-medium">お気に入り場面数</dt>
            <dd className="text-text mt-1 text-xl font-semibold">{favoriteMomentCount} 件</dd>
          </div>
        </dl>
      </Panel>

      <MomentListFilterForm query={query} />

      {momentCount === 0 ? (
        <EmptyState
          message="まだ場面が登録されていません。場面を登録するには、関連する試合が必要です。"
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
          message="条件に一致する場面がありません。条件を変更するか、条件をリセットしてください。"
          actions={<LinkButton href="/moments">条件をリセット</LinkButton>}
        />
      ) : (
        <section aria-labelledby="moment-list-results-title">
          <div className="mb-4">
            <h2 id="moment-list-results-title" className="text-text text-xl font-semibold">
              検索結果
            </h2>
            <p className="text-muted mt-1 text-sm">
              {filteredMomentCount} 件中 {firstItemNumber}〜{lastItemNumber} 件
            </p>
          </div>

          <MomentList moments={moments} favoriteAction={toggleMomentFavoriteAction} />

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
