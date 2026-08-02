/**
 * 試合詳細内の関連場面一覧で、場面 1 件分を Compact Card として表示するコンポーネント。
 */

import { MomentSummary } from '@/components/moments/moment-summary';
import type { Moment } from '@/types/moment';

type MatchMomentListItemProps = {
  /** 試合詳細内で表示する場面。 */
  moment: Moment;
};

/** 場面一覧と共通する要約表示を、関連試合を省いた Card として表示する。 */
export function MatchMomentListItem({ moment }: MatchMomentListItemProps) {
  return (
    <li className="border-border/65 bg-surface hover:border-border-strong/75 hover:bg-surface-raised rounded-panel shadow-panel border p-4 transition-colors sm:p-5">
      <MomentSummary moment={moment} headingLevel={3} />
    </li>
  );
}
