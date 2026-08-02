/**
 * 取得済みの試合をレスポンシブな Card Grid として並べるコンポーネント。
 */

import type { MatchWithMomentCount } from '@/types/match';

import { MatchListItem } from './match-list-item';

type MatchListProps = {
  /** 現在のページへ表示する試合。 */
  matches: MatchWithMomentCount[];
};

/**
 * 空状態は登録総数と条件一致件数を把握している Page が判断し、
 * このコンポーネントは取得済みの試合を並べることだけを担当する。
 * Mobile・Tablet は 1 列、PC は 2 列で試合 Card を表示する。
 */
export function MatchList({ matches }: MatchListProps) {
  return (
    <ul className="grid gap-4 lg:grid-cols-2">
      {matches.map((match) => (
        <MatchListItem key={match.id} match={match} />
      ))}
    </ul>
  );
}
