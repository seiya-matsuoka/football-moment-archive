/**
 * 試合詳細内の関連場面一覧で、場面 1 件分を表示するコンポーネント。
 */

import { Panel } from '@/components/common/panel';
import { getMomentTypeLabel } from '@/lib/format';
import type { Moment } from '@/types/moment';

type MatchMomentListItemProps = {
  /** 試合詳細内で表示する場面。 */
  moment: Moment;
};

/** 場面のタイトル、種類、任意情報、お気に入り状態を表示する。 */
export function MatchMomentListItem({ moment }: MatchMomentListItemProps) {
  return (
    <li>
      <Panel>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-text text-base font-semibold">{moment.title}</h3>
            <p className="text-muted mt-1 text-sm">{getMomentTypeLabel(moment.momentType)}</p>
          </div>

          {/* お気に入り状態。 */}
          <p className="text-muted shrink-0 text-sm font-medium">
            {moment.isFavorite ? 'お気に入り' : 'お気に入り未登録'}
          </p>
        </div>

        {/* 任意項目は値がある場合だけ表示し、空のラベルを残さない。 */}
        {moment.timeLabel || moment.subject ? (
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            {moment.timeLabel ? (
              <div>
                <dt className="text-muted text-sm font-medium">発生時間</dt>
                <dd className="text-text mt-1 text-sm">{moment.timeLabel}</dd>
              </div>
            ) : null}

            {moment.subject ? (
              <div>
                <dt className="text-muted text-sm font-medium">対象</dt>
                <dd className="text-text mt-1 text-sm">{moment.subject}</dd>
              </div>
            ) : null}
          </dl>
        ) : null}
      </Panel>
    </li>
  );
}
