'use client';

/**
 * 試合詳細画面で削除可否、確認ダイアログ、Server Action の結果を扱うフォーム。
 */

import type { FormEvent } from 'react';
import { useActionState } from 'react';

import { Button } from '@/components/common/button';
import type { MatchDeleteAction, MatchDeleteState } from '@/types/match-action';

type MatchDeleteFormProps = {
  /** 試合 ID を束縛した削除用 Server Action。 */
  action: MatchDeleteAction;
  /** 現在関連付けられている場面数。 */
  momentCount: number;
};

/** 関連場面がない場合だけ試合を削除できる Danger Zone を表示する。 */
export function MatchDeleteForm({ action, momentCount }: MatchDeleteFormProps) {
  const initialState: MatchDeleteState = {
    status: 'idle',
    message: null,
  };
  const [state, formAction, isPending] = useActionState(action, initialState);
  const canDelete = momentCount === 0;

  /** 削除を送信する直前に、ブラウザの確認ダイアログを表示する。 */
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm('この試合を削除します。よろしいですか？')) {
      event.preventDefault();
    }
  }

  return (
    <section
      aria-labelledby="match-delete-title"
      className="border-error-border bg-error-background rounded-panel border p-5 sm:p-6"
    >
      <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:gap-8">
        <div className="max-w-3xl min-w-0">
          <p className="text-error text-[0.68rem] font-bold tracking-[0.18em] uppercase">
            Danger Zone
          </p>
          <h2 id="match-delete-title" className="text-error mt-1 text-xl font-semibold">
            試合の削除
          </h2>
          <p className="text-error mt-3 text-sm leading-7">
            {canDelete
              ? 'この試合を削除します。この操作は元に戻せません。'
              : `関連する場面が ${momentCount} 件存在するため、この試合は削除できません。先に関連場面を削除してください。`}
          </p>
          {state.message ? (
            <p role="alert" className="text-error mt-3 text-sm leading-6">
              {state.message}
            </p>
          ) : null}
        </div>

        <form
          action={formAction}
          onSubmit={handleSubmit}
          className="flex shrink-0 justify-end self-end sm:justify-self-end"
        >
          <Button
            type="submit"
            variant="danger"
            disabled={!canDelete || isPending}
            className="min-w-32"
          >
            {isPending ? '削除中' : '試合を削除'}
          </Button>
        </form>
      </div>
    </section>
  );
}
