/**
 * 場面一覧で、場面 1 件分と関連試合を表示するコンポーネント。
 */

import { Panel } from '@/components/common/panel';
import type { MomentFavoriteActionWithId } from '@/types/moment-action';
import type { MomentWithMatch } from '@/types/moment';

import { MomentMatchSummary } from './moment-match-summary';
import { MomentSummary } from './moment-summary';

type MomentListItemProps = {
  /** 一覧項目として表示する場面と関連試合。 */
  moment: MomentWithMatch;
  /** 場面 ID を束縛する前のお気に入り切り替え Server Action。 */
  favoriteAction: MomentFavoriteActionWithId;
};

/** 場面の要約、関連試合、お気に入り操作を一つの一覧項目として表示する。 */
export function MomentListItem({ moment, favoriteAction }: MomentListItemProps) {
  const favoriteActionWithId = favoriteAction.bind(null, moment.id);

  return (
    <li>
      <Panel>
        <MomentSummary moment={moment} headingLevel={2} favoriteAction={favoriteActionWithId} />

        <section
          aria-labelledby={`moment-${moment.id}-match-title`}
          className="mt-section border-border pt-section border-t"
        >
          <h3
            id={`moment-${moment.id}-match-title`}
            className="text-text mb-4 text-base font-semibold"
          >
            関連する試合
          </h3>
          <MomentMatchSummary match={moment.match} />
        </section>
      </Panel>
    </li>
  );
}
