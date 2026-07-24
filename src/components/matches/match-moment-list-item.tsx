/**
 * 試合詳細内の関連場面一覧で、場面 1 件分を表示するコンポーネント。
 */

import { Panel } from '@/components/common/panel';
import { MomentSummary } from '@/components/moments/moment-summary';
import type { Moment } from '@/types/moment';

type MatchMomentListItemProps = {
  /** 試合詳細内で表示する場面。 */
  moment: Moment;
};

/** 場面一覧と共通する要約表示を使用し、場面詳細への導線を含めて表示する。 */
export function MatchMomentListItem({ moment }: MatchMomentListItemProps) {
  return (
    <li>
      <Panel>
        <MomentSummary moment={moment} headingLevel={3} />
      </Panel>
    </li>
  );
}
