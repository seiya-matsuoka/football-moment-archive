/**
 * DB に登録されている試合を一覧表示する Server Component。
 */

import type { Metadata } from 'next';

import { Button } from '@/components/common/button';
import { LinkButton } from '@/components/common/link-button';
import { PageHeader } from '@/components/common/page-header';
import { MatchList } from '@/components/matches/match-list';
import { DATA_LIMITS } from '@/lib/constants';
import { getMatchCount, getMatchList } from '@/server/data-access/matches';

/** DB の最新状態をリクエストごとに取得し、Build 時の DB 接続を避ける。 */
export const dynamic = 'force-dynamic';

/** ブラウザのタイトルへ試合一覧であることを表示する。 */
export const metadata: Metadata = {
  title: '試合一覧',
};

/** Data Access Layer から試合総数と一覧を取得して表示する。 */
export default async function MatchesPage() {
  // 互いに依存しない参照処理は並列で開始し、画面表示までの待ち時間を増やさないようにする。
  const [matchCount, matches] = await Promise.all([getMatchCount(), getMatchList()]);
  const hasReachedLimit = matchCount >= DATA_LIMITS.matches;

  return (
    <div className="space-y-section">
      <PageHeader
        title="試合一覧"
        description={`登録済みの試合 ${matchCount} 件を表示しています。`}
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

      <MatchList matches={matches} />
    </div>
  );
}
