/**
 * アプリの概要、対象範囲、登録状況、最近登録された場面を表示するホーム画面。
 */

import { EmptyState } from '@/components/common/empty-state';
import { LinkButton } from '@/components/common/link-button';
import { PageHeader } from '@/components/common/page-header';
import { SectionHeader } from '@/components/common/section-header';
import { HomeStatistics } from '@/components/home/home-statistics';
import { MomentList } from '@/components/moments/moment-list';
import { APP_DESCRIPTION, APP_NAME, DATA_LIMITS, TARGET_COMPETITION } from '@/lib/constants';
import { getMatchCount } from '@/server/data-access/matches';
import {
  getFavoriteMomentCount,
  getMomentCount,
  getRecentMoments,
} from '@/server/data-access/moments';

/** DB の最新状態をリクエストごとに取得し、Build 時の DB 接続を避ける。 */
export const dynamic = 'force-dynamic';

/** アプリの目的と現在の Archive 状況を表示する。 */
export default async function HomePage() {
  // 互いに依存しないホーム用の集計と一覧取得を並列で実行する。
  const [matchCount, momentCount, favoriteMomentCount, recentMoments] = await Promise.all([
    getMatchCount(),
    getMomentCount(),
    getFavoriteMomentCount(),
    getRecentMoments(),
  ]);

  const headerActions = (
    <>
      <LinkButton href="/matches">試合を見る</LinkButton>
      <LinkButton href="/moments" variant="primary">
        場面を見る
      </LinkButton>
    </>
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        eyebrow="Football Archive"
        title={APP_NAME}
        description={APP_DESCRIPTION}
        actions={headerActions}
      />

      <section
        aria-labelledby="target-competition-title"
        className="border-border bg-surface rounded-panel shadow-panel border p-5 sm:p-6"
      >
        <SectionHeader
          eyebrow="Competition"
          title="対象範囲"
          titleId="target-competition-title"
          description="この Archive で取り扱うリーグとシーズンです。"
          size="compact"
        />
        <dl className="border-border/55 mt-5 grid gap-4 border-t pt-5 sm:grid-cols-2">
          <div>
            <dt className="text-muted text-xs font-medium">リーグ</dt>
            <dd className="text-text mt-1.5 text-base font-semibold">
              {TARGET_COMPETITION.league}
            </dd>
          </div>
          <div>
            <dt className="text-muted text-xs font-medium">シーズン</dt>
            <dd className="text-text mt-1.5 text-base font-semibold">
              {TARGET_COMPETITION.season}
            </dd>
          </div>
        </dl>
      </section>

      <HomeStatistics
        matchCount={matchCount}
        momentCount={momentCount}
        favoriteMomentCount={favoriteMomentCount}
      />

      <section aria-labelledby="recent-moments-title">
        <SectionHeader
          eyebrow="Recent"
          title="最近登録された場面"
          titleId="recent-moments-title"
          description="登録日時の新しい順に、最大 5 件を表示しています。"
          aside={<LinkButton href="/moments">すべての場面を見る</LinkButton>}
        />

        <div className="mt-4">
          {recentMoments.length > 0 ? (
            <MomentList moments={recentMoments} itemHeadingLevel={3} />
          ) : matchCount === 0 ? (
            <EmptyState
              title="まだ試合と場面が登録されていません"
              message="最初に、場面を記録する対象の試合を登録してください。"
              actions={
                <LinkButton href="/matches/new" variant="primary">
                  最初の試合を登録
                </LinkButton>
              }
              headingLevel={3}
            />
          ) : (
            <EmptyState
              title="まだ場面が登録されていません"
              message="登録済みの試合を選び、記憶に残った場面を登録してください。"
              actions={
                <>
                  {matchCount < DATA_LIMITS.matches ? (
                    <LinkButton href="/matches/new">試合を登録</LinkButton>
                  ) : (
                    <LinkButton href="/matches">試合一覧を見る</LinkButton>
                  )}
                  <LinkButton href="/moments/new" variant="primary">
                    最初の場面を登録
                  </LinkButton>
                </>
              }
              headingLevel={3}
            />
          )}
        </div>
      </section>
    </div>
  );
}
