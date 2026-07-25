'use client';

/**
 * 場面一覧と場面詳細で、お気に入り状態の表示と切り替えを担当する Client Component。
 */

import { useActionState } from 'react';

import { Button } from '@/components/common/button';
import type { MomentFavoriteAction, MomentFavoriteState } from '@/types/moment-action';

type FavoriteToggleFormProps = {
  /** 場面 ID を束縛したお気に入り切り替え用 Server Action。 */
  action: MomentFavoriteAction;
  /** Server Component が取得した現在のお気に入り状態。 */
  isFavorite: boolean;
};

/** 楽観的更新を行わず、Server Action 完了後の再描画で最新状態を表示する。 */
export function FavoriteToggleForm({ action, isFavorite }: FavoriteToggleFormProps) {
  const initialState: MomentFavoriteState = {
    status: 'idle',
    message: null,
  };
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <p className="text-muted text-sm font-medium">
        {isFavorite ? 'お気に入り' : 'お気に入り未登録'}
      </p>

      <form action={formAction}>
        <Button
          type="submit"
          variant={isFavorite ? 'secondary' : 'primary'}
          disabled={isPending}
          aria-pressed={isFavorite}
        >
          {isPending ? '更新中' : isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
        </Button>
      </form>

      {state.message ? (
        <p role="alert" className="text-error max-w-xs text-sm leading-6">
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
