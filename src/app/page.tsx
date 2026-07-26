/**
 * アプリの概要、登録状況、最近登録された場面を表示するホーム画面。
 */

import { EmptyState } from '@/components/common/empty-state';
import { LinkButton } from '@/components/common/link-button';
import { PageHeader } from '@/components/common/page-header';
import { Panel } from '@/components/common/panel';
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

/** アプリの概要、対象範囲、登録状況、最近の場面を表示する。 */
export default async function HomePage() {
  // 互いに依存しないホーム用の集計と一覧取得を並列で実行する。
  const [matchCount, momentCount, favoriteMomentCount, recentMoments] = await Promise.all([
    getMatchCount(),
    getMomentCount(),
    getFavoriteMomentCount(),
    getRecentMoments(),
  ]);

  return (
    <div className="space-y-section">
      <PageHeader title={APP_NAME} description={APP_DESCRIPTION} />

      <section aria-labelledby="target-competition-title">
        <Panel>
          <h2 id="target-competition-title" className="text-text text-lg font-semibold">
            対象範囲
          </h2>

          <dl className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-muted text-sm font-medium">リーグ</dt>
              <dd className="text-text mt-1 text-base font-semibold">
                {TARGET_COMPETITION.league}
              </dd>
            </div>

            <div>
              <dt className="text-muted text-sm font-medium">シーズン</dt>
              <dd className="text-text mt-1 text-base font-semibold">
                {TARGET_COMPETITION.season}
              </dd>
            </div>
          </dl>
        </Panel>
      </section>

      <HomeStatistics
        matchCount={matchCount}
        momentCount={momentCount}
        favoriteMomentCount={favoriteMomentCount}
      />

      <section aria-labelledby="recent-moments-title">
        <div className="mb-4">
          <h2 id="recent-moments-title" className="text-text text-xl font-semibold">
            最近登録された場面
          </h2>
          <p className="text-muted mt-1 text-sm">
            登録日時の新しい順に、最大 5 件を表示しています。
          </p>
        </div>

        {recentMoments.length > 0 ? (
          <MomentList moments={recentMoments} itemHeadingLevel={3} />
        ) : matchCount === 0 ? (
          <EmptyState
            message="まだ試合と場面が登録されていません。最初に場面を記録する対象の試合を登録してください。"
            actions={
              <LinkButton href="/matches/new" variant="primary">
                最初の試合を登録
              </LinkButton>
            }
          />
        ) : (
          <EmptyState
            message="まだ場面が登録されていません。登録済みの試合を選び、記憶に残った場面を登録してください。"
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
          />
        )}
      </section>
    </div>
  );
}
