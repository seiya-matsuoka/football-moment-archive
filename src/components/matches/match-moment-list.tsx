/**
 * 試合詳細で、その試合に関連する場面を Card Grid として並べるコンポーネント。
 */

import { EmptyState } from '@/components/common/empty-state';
import type { Moment } from '@/types/moment';

import { MatchMomentListItem } from './match-moment-list-item';

type MatchMomentListProps = {
  /** 試合へ関連付けられている場面。 */
  moments: Moment[];
};

/** 関連場面が 0 件の場合の空状態、または場面 Card を表示する。 */
export function MatchMomentList({ moments }: MatchMomentListProps) {
  if (moments.length === 0) {
    return (
      <EmptyState
        eyebrow="Empty"
        title="関連する場面がありません"
        message="この試合には、まだ場面が登録されていません。"
        headingLevel={3}
      />
    );
  }

  return (
    <ul className="grid gap-4 lg:grid-cols-2">
      {moments.map((moment) => (
        <MatchMomentListItem key={moment.id} moment={moment} />
      ))}
    </ul>
  );
}
