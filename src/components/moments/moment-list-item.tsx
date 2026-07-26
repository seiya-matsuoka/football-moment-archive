/**
 * 場面 1 件分と関連試合を一覧項目として表示するコンポーネント。
 */

import { Panel } from '@/components/common/panel';
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

/** 場面の要約と関連試合を一つの一覧項目として表示する。 */
export function MomentListItem({ moment, favoriteAction, headingLevel }: MomentListItemProps) {
  const favoriteActionWithId = favoriteAction?.bind(null, moment.id);
  const RelatedMatchHeading = headingLevel === 2 ? 'h3' : 'h4';

  return (
    <li>
      <Panel>
        <MomentSummary
          moment={moment}
          headingLevel={headingLevel}
          favoriteAction={favoriteActionWithId}
        />

        <section
          aria-labelledby={`moment-${moment.id}-match-title`}
          className="mt-section border-border pt-section border-t"
        >
          <RelatedMatchHeading
            id={`moment-${moment.id}-match-title`}
            className="text-text mb-4 text-base font-semibold"
          >
            関連する試合
          </RelatedMatchHeading>
          <MomentMatchSummary match={moment.match} />
        </section>
      </Panel>
    </li>
  );
}
