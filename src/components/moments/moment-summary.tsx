/**
 * 場面一覧、試合詳細、ホームで共有する場面の Compact な要約表示。
 */

import Link from 'next/link';

import { getMomentTypeLabel } from '@/lib/format';
import type { Moment } from '@/types/moment';
import type { MomentFavoriteAction } from '@/types/moment-action';

import { FavoriteToggleForm } from './favorite-toggle-form';

type MomentSummaryProps = {
  /** 要約表示する場面。 */
  moment: Moment;
  /** 親画面の見出し構造に合わせたタイトルの見出しレベル。 */
  headingLevel: 2 | 3;
  /** 一覧から操作できる場合に渡す、ID を束縛したお気に入り Server Action。 */
  favoriteAction?: MomentFavoriteAction;
};

/** 種別・発生時間、タイトル、対象、お気に入り、詳細導線を一覧用の情報階層で表示する。 */
export function MomentSummary({ moment, headingLevel, favoriteAction }: MomentSummaryProps) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';

  return (
    <div className="min-w-0">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <span className="border-accent/45 bg-accent/10 text-accent inline-flex min-h-7 items-center rounded-full border px-2.5 py-1 text-xs font-bold tracking-wide">
            {getMomentTypeLabel(moment.momentType)}
          </span>
          {moment.timeLabel ? (
            <span className="text-muted text-xs font-medium tabular-nums">{moment.timeLabel}</span>
          ) : null}
        </div>

        <div className="shrink-0">
          {favoriteAction ? (
            <FavoriteToggleForm action={favoriteAction} isFavorite={moment.isFavorite} />
          ) : (
            <p
              className={[
                'text-sm font-semibold whitespace-nowrap',
                moment.isFavorite ? 'text-favorite' : 'text-muted',
              ].join(' ')}
            >
              <span aria-hidden="true" className="mr-1.5">
                {moment.isFavorite ? '★' : '☆'}
              </span>
              {moment.isFavorite ? 'お気に入り' : 'お気に入り未登録'}
            </p>
          )}
        </div>
      </div>

      <Heading className="text-text mt-3 text-lg leading-snug font-semibold wrap-break-word sm:text-xl">
        {moment.title}
      </Heading>

      <div className="mt-4 flex items-end gap-4">
        {moment.subject ? (
          <dl className="min-w-0 flex-1">
            <div>
              <dt className="text-muted text-xs font-medium">対象</dt>
              <dd className="text-text mt-1.5 text-sm leading-6 wrap-break-word">
                {moment.subject}
              </dd>
            </div>
          </dl>
        ) : null}

        <Link
          href={`/moments/${moment.id}`}
          aria-label={`${moment.title}の場面詳細を見る`}
          className="text-accent hover:text-text focus-visible:outline-focus rounded-control ml-auto inline-flex min-h-10 shrink-0 items-center text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          場面詳細を見る
          <span aria-hidden="true" className="ml-1.5">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
