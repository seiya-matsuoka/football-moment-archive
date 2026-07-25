/**
 * 取得済みの場面と関連試合を一覧として並べるコンポーネント。
 */

import type { MomentFavoriteActionWithId } from '@/types/moment-action';
import type { MomentWithMatch } from '@/types/moment';

import { MomentListItem } from './moment-list-item';

type MomentListProps = {
  /** 現在のページへ表示する場面と関連試合。 */
  moments: MomentWithMatch[];
  /** 一覧の各場面で使用するお気に入り切り替え Server Action。 */
  favoriteAction: MomentFavoriteActionWithId;
};

/**
 * 空状態は登録総数と条件一致件数を把握している Page が判断し、
 * このコンポーネントは取得済みの場面を並べることだけを担当する。
 */
export function MomentList({ moments, favoriteAction }: MomentListProps) {
  return (
    <ul className="grid gap-4">
      {moments.map((moment) => (
        <MomentListItem key={moment.id} moment={moment} favoriteAction={favoriteAction} />
      ))}
    </ul>
  );
}
