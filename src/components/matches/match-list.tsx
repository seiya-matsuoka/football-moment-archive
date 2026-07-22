/**
 * 登録済みの試合を一覧として並べるコンポーネント。
 */

import { EmptyState } from '@/components/common/empty-state';
import type { MatchWithMomentCount } from '@/types/match';

import { MatchListItem } from './match-list-item';

type MatchListProps = {
  /** 一覧へ表示する試合。 */
  matches: MatchWithMomentCount[];
};

/** 試合が 0 件の場合の空状態、または試合 1 件ごとの表示を並べる。 */
export function MatchList({ matches }: MatchListProps) {
  if (matches.length === 0) {
    return <EmptyState message="まだ試合が登録されていません。" />;
  }

  return (
    <ul className="grid gap-4">
      {matches.map((match) => (
        <MatchListItem key={match.id} match={match} />
      ))}
    </ul>
  );
}
