/**
 * URL の一覧条件を使用し、DB に登録されている試合を一覧表示する Server Component。
 */

import type { Metadata } from 'next';

import { Button } from '@/components/common/button';
import { EmptyState } from '@/components/common/empty-state';
import { LinkButton } from '@/components/common/link-button';
import { PageHeader } from '@/components/common/page-header';
import { Pagination } from '@/components/common/pagination';
import { MatchListFilterForm } from '@/components/matches/match-list-filter-form';
import { MatchList } from '@/components/matches/match-list';
import { DATA_LIMITS, ITEMS_PER_PAGE } from '@/lib/constants';
import {
  createMatchListSearchParams,
  parseMatchListSearchParams,
  type RawSearchParams,
} from '@/lib/list-search-params';
import { clampPage, getTotalPages } from '@/lib/pagination';
import { getMatchCount, getMatchList, getMatchListCount } from '@/server/data-access/matches';

type MatchesPageProps = {
  /** Next.js 16 では URL 検索パラメーターを Promise として受け取る。 */
  searchParams: Promise<RawSearchParams>;
};

/** DB の最新状態をリクエストごとに取得し、Build 時の DB 接続を避ける。 */
export const dynamic = 'force-dynamic';

/** ブラウザのタイトルへ試合一覧であることを表示する。 */
export const metadata: Metadata = {
  title: '試合一覧',
};

/** 試合総数、条件一致件数、現在ページの試合を取得して表示する。 */
export default async function MatchesPage({ searchParams }: MatchesPageProps) {
  const rawSearchParams = await searchParams;
  const requestedQuery = parseMatchListSearchParams(rawSearchParams);

  // 登録総数は上限表示、条件一致件数はページ数と空状態の判断に使用する。
  const [matchCount, filteredMatchCount] = await Promise.all([
    getMatchCount(),
    getMatchListCount(requestedQuery),
  ]);

  const totalPages = getTotalPages(filteredMatchCount, ITEMS_PER_PAGE);
  const currentPage = clampPage(requestedQuery.page, totalPages);
  const query = {
    ...requestedQuery,
    page: currentPage,
  };

  const matches = filteredMatchCount === 0 ? [] : await getMatchList(query);
  const hasReachedLimit = matchCount >= DATA_LIMITS.matches;
  const firstItemNumber = filteredMatchCount === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const lastItemNumber = Math.min(currentPage * ITEMS_PER_PAGE, filteredMatchCount);

  return (
    <div className="space-y-section">
      <PageHeader
        title="試合一覧"
        description={`登録済み ${matchCount} 件のうち、現在の条件に一致する試合は ${filteredMatchCount} 件です。`}
        actions={
          hasReachedLimit ? (
            <div className="max-w-xs text-right">
              <Button disabled>試合を登録</Button>
              <p className="text-muted mt-2 text-sm leading-5">
                最大 {DATA_LIMITS.matches} 件に到達しています。
              </p>
            </div>
          ) : (
            <LinkButton href="/matches/new" variant="primary">
              試合を登録
            </LinkButton>
          )
        }
      />

      <MatchListFilterForm query={query} />

      {matchCount === 0 ? (
        <EmptyState
          message="まだ試合が登録されていません。"
          actions={
            <LinkButton href="/matches/new" variant="primary">
              最初の試合を登録
            </LinkButton>
          }
        />
      ) : filteredMatchCount === 0 ? (
        <EmptyState
          message="条件に一致する試合がありません。条件を変更するか、条件をリセットしてください。"
          actions={<LinkButton href="/matches">条件をリセット</LinkButton>}
        />
      ) : (
        <section aria-labelledby="match-list-results-title">
          <div className="mb-4">
            <h2 id="match-list-results-title" className="text-text text-xl font-semibold">
              検索結果
            </h2>
            <p className="text-muted mt-1 text-sm">
              {filteredMatchCount} 件中 {firstItemNumber}〜{lastItemNumber} 件
            </p>
          </div>

          <MatchList matches={matches} />

          <Pagination
            pathname="/matches"
            currentPage={currentPage}
            totalPages={totalPages}
            searchParams={createMatchListSearchParams(query)}
          />
        </section>
      )}
    </div>
  );
}
