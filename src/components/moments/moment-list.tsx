/**
 * 関連試合を含む場面を一覧として並べるコンポーネント。
 */

import { EmptyState } from '@/components/common/empty-state';
import type { MomentWithMatch } from '@/types/moment';

import { MomentListItem } from './moment-list-item';

type MomentListProps = {
  /** 場面一覧へ表示する場面と関連試合。 */
  moments: MomentWithMatch[];
};

/** 場面が 0 件の場合の空状態、または場面 1 件ごとの表示を並べる。 */
export function MomentList({ moments }: MomentListProps) {
  if (moments.length === 0) {
    return <EmptyState message="まだ場面が登録されていません。先に試合を登録してください。" />;
  }

  return (
    <ul className="grid gap-4">
      {moments.map((moment) => (
        <MomentListItem key={moment.id} moment={moment} />
      ))}
    </ul>
  );
}
