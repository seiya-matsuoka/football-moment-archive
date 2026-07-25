/**
 * 場面一覧と試合詳細内の関連場面一覧で共有する、場面の要約表示。
 */

import Link from 'next/link';

import { getMomentTypeLabel } from '@/lib/format';
import type { MomentFavoriteAction } from '@/types/moment-action';
import type { Moment } from '@/types/moment';

import { FavoriteToggleForm } from './favorite-toggle-form';

type MomentSummaryProps = {
  /** 要約表示する場面。 */
  moment: Moment;
  /** 親画面の見出し構造に合わせたタイトルの見出しレベル。 */
  headingLevel: 2 | 3;
  /** 一覧から操作できる場合に渡す、ID を束縛したお気に入り Server Action。 */
  favoriteAction?: MomentFavoriteAction;
};

/** 場面のタイトル、種類、任意の要約項目、お気に入り状態を表示する。 */
export function MomentSummary({ moment, headingLevel, favoriteAction }: MomentSummaryProps) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {/* タイトルを場面詳細へ移動する主な導線として表示する。 */}
          <Heading className="text-text text-lg font-semibold">
            <Link
              href={`/moments/${moment.id}`}
              className="rounded-control hover:text-muted focus-visible:outline-focus focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {moment.title}
            </Link>
          </Heading>
          <p className="text-muted mt-1 text-sm">{getMomentTypeLabel(moment.momentType)}</p>
        </div>

        {favoriteAction ? (
          <FavoriteToggleForm action={favoriteAction} isFavorite={moment.isFavorite} />
        ) : (
          <p className="text-muted shrink-0 text-sm font-medium">
            {moment.isFavorite ? 'お気に入り' : 'お気に入り未登録'}
          </p>
        )}
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
    </div>
  );
}
