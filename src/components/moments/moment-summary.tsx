/**
 * 場面一覧、試合詳細、ホームで共有する場面の Compact な要約表示。
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

/** 種別・発生時間、タイトル、対象、お気に入りを一覧用の情報階層で表示する。 */
export function MomentSummary({ moment, headingLevel, favoriteAction }: MomentSummaryProps) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';

  return (
    <div className="min-w-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="border-accent/45 bg-accent/10 text-accent inline-flex min-h-7 items-center rounded-full border px-2.5 py-1 text-xs font-bold tracking-wide">
              {getMomentTypeLabel(moment.momentType)}
            </span>
            {moment.timeLabel ? (
              <span className="text-muted text-xs font-medium tabular-nums">
                {moment.timeLabel}
              </span>
            ) : null}
          </div>

          <Heading className="text-text mt-3 text-lg leading-snug font-semibold sm:text-xl">
            <Link
              href={`/moments/${moment.id}`}
              className="hover:text-accent focus-visible:outline-focus rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {moment.title}
            </Link>
          </Heading>

          {moment.subject ? (
            <p className="text-muted mt-2 text-sm leading-6 wrap-break-word">
              <span className="text-subtle mr-2 text-xs font-bold tracking-[0.12em] uppercase">
                Subject
              </span>
              {moment.subject}
            </p>
          ) : null}
        </div>

        <div className="shrink-0">
          {favoriteAction ? (
            <FavoriteToggleForm action={favoriteAction} isFavorite={moment.isFavorite} />
          ) : (
            <p
              className={[
                'text-sm font-semibold',
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
    </div>
  );
}
