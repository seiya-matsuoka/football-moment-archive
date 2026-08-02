/**
 * 場面 1 件分と関連試合を独立した Compact Card として表示するコンポーネント。
 */

import type { MomentFavoriteActionWithId } from '@/types/moment-action';
import type { MomentWithMatch } from '@/types/moment';

import { MomentMatchSummary } from './moment-match-summary';
import { MomentSummary } from './moment-summary';

type MomentListItemProps = {
  /** 一覧項目として表示する場面と関連試合。 */
  moment: MomentWithMatch;
  /** お気に入りを切り替えられる場合に渡す、場面 ID を束縛する前の Server Action。 */
  favoriteAction?: MomentFavoriteActionWithId;
  /** 親画面の見出し構造に合わせた場面タイトルの見出しレベル。 */
  headingLevel: 2 | 3;
};

/** 場面の要約と関連試合を、一つの独立した Card にまとめて表示する。 */
export function MomentListItem({ moment, favoriteAction, headingLevel }: MomentListItemProps) {
  const favoriteActionWithId = favoriteAction?.bind(null, moment.id);
  const RelatedMatchHeading = headingLevel === 2 ? 'h3' : 'h4';

  return (
    <li className="border-border/65 bg-surface hover:border-border-strong/75 hover:bg-surface-raised rounded-panel shadow-panel flex h-full min-w-0 flex-col border p-4 transition-colors sm:p-5">
      <MomentSummary
        moment={moment}
        headingLevel={headingLevel}
        favoriteAction={favoriteActionWithId}
      />

      <section aria-labelledby={`moment-${moment.id}-match-title`} className="mt-auto pt-5">
        <RelatedMatchHeading id={`moment-${moment.id}-match-title`} className="sr-only">
          関連する試合
        </RelatedMatchHeading>
        <MomentMatchSummary match={moment.match} />
      </section>
    </li>
  );
}
