/**
 * 取得済みの場面と関連試合を、レスポンシブな Card Grid として並べるコンポーネント。
 */

import type { MomentFavoriteActionWithId } from '@/types/moment-action';
import type { MomentWithMatch } from '@/types/moment';

import { MomentListItem } from './moment-list-item';

type MomentListProps = {
  /** 一覧として表示する場面と関連試合。 */
  moments: MomentWithMatch[];
  /** 各場面でお気に入りを切り替えられる場合に渡す Server Action。 */
  favoriteAction?: MomentFavoriteActionWithId;
  /** 親画面の見出し構造に合わせた、各場面タイトルの見出しレベル。 */
  itemHeadingLevel?: 2 | 3;
};

/**
 * 空状態は登録総数や条件一致件数を把握している Page が判断し、
 * このコンポーネントは取得済みの場面を並べることだけを担当する。
 * Mobile・Tablet は 1 列、PC は 2 列で場面 Card を表示する。
 */
export function MomentList({ moments, favoriteAction, itemHeadingLevel = 2 }: MomentListProps) {
  return (
    <ul className="grid gap-4 lg:grid-cols-2">
      {moments.map((moment) => (
        <MomentListItem
          key={moment.id}
          moment={moment}
          favoriteAction={favoriteAction}
          headingLevel={itemHeadingLevel}
        />
      ))}
    </ul>
  );
}
