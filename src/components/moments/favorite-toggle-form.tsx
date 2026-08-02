'use client';

/**
 * 場面一覧と場面詳細で、お気に入り状態の切り替えを担当する Client Component。
 */

import { useActionState } from 'react';

import type { MomentFavoriteAction, MomentFavoriteState } from '@/types/moment-action';

type FavoriteToggleFormProps = {
  /** 場面 ID を束縛したお気に入り切り替え用 Server Action。 */
  action: MomentFavoriteAction;
  /** Server Component が取得した現在のお気に入り状態。 */
  isFavorite: boolean;
};

/** 一覧と詳細で同じ Compact Button を使用し、状態は文字と星の両方で示す。 */
export function FavoriteToggleForm({ action, isFavorite }: FavoriteToggleFormProps) {
  const initialState: MomentFavoriteState = {
    status: 'idle',
    message: null,
  };
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <div className="flex flex-col items-start gap-1.5 sm:items-end">
      <form action={formAction}>
        <button
          type="submit"
          disabled={isPending}
          aria-pressed={isFavorite}
          className={[
            'focus-visible:outline-focus rounded-control inline-flex min-h-11 items-center justify-center border px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-55',
            isFavorite
              ? 'border-favorite/60 bg-favorite/10 text-favorite hover:bg-favorite/15'
              : 'border-border bg-surface text-muted hover:border-border-strong hover:bg-surface-raised hover:text-text',
          ].join(' ')}
        >
          <span aria-hidden="true" className="mr-1.5 text-base leading-none">
            {isFavorite ? '★' : '☆'}
          </span>
          {isPending ? '更新中' : isFavorite ? 'お気に入り解除' : 'お気に入り追加'}
        </button>
      </form>

      {state.message ? (
        <p role="alert" className="text-error max-w-xs text-xs leading-5">
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
