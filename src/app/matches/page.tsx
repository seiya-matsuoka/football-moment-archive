/**
 * DB に登録されている試合を一覧表示する Server Component。
 */

import type { Metadata } from 'next';

import { PageHeader } from '@/components/common/page-header';
import { MatchList } from '@/components/matches/match-list';
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

  return (
    <div className="space-y-section">
      <PageHeader
        title="試合一覧"
        description={`登録済みの試合 ${matchCount} 件を表示しています。`}
      />

      <MatchList matches={matches} />
    </div>
  );
}
