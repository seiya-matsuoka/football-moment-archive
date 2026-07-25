/**
 * DB に登録されている場面と関連試合を一覧表示する Server Component。
 */

import type { Metadata } from 'next';

import { Button } from '@/components/common/button';
import { LinkButton } from '@/components/common/link-button';
import { PageHeader } from '@/components/common/page-header';
import { Panel } from '@/components/common/panel';
import { MomentList } from '@/components/moments/moment-list';
import { DATA_LIMITS } from '@/lib/constants';
import { getMatchCount } from '@/server/data-access/matches';
import {
  getFavoriteMomentCount,
  getMomentCount,
  getMomentList,
} from '@/server/data-access/moments';

import { toggleMomentFavoriteAction } from './actions';

/** DB の最新状態をリクエストごとに取得し、Build 時の DB 接続を避ける。 */
export const dynamic = 'force-dynamic';

/** ブラウザのタイトルへ場面一覧であることを表示する。 */
export const metadata: Metadata = {
  title: '場面一覧',
};

/** Data Access Layer から件数と関連試合を含む場面一覧を取得して表示する。 */
export default async function MomentsPage() {
  // 互いに依存しない参照処理は並列で開始し、画面表示までの待ち時間を増やさないようにする。
  const [matchCount, momentCount, favoriteMomentCount, moments] = await Promise.all([
    getMatchCount(),
    getMomentCount(),
    getFavoriteMomentCount(),
    getMomentList(),
  ]);
  const hasReachedLimit = momentCount >= DATA_LIMITS.moments;

  return (
    <div className="space-y-section">
      <PageHeader
        title="場面一覧"
        description={`登録済みの場面 ${momentCount} 件を、関連する試合とともに表示しています。`}
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

      <MomentList moments={moments} favoriteAction={toggleMomentFavoriteAction} />
    </div>
  );
}
