'use client';

/**
 * 試合詳細画面で削除可否、確認ダイアログ、Server Action の結果を扱うフォーム。
 */

import type { FormEvent } from 'react';
import { useActionState } from 'react';

import { Button } from '@/components/common/button';
import { Panel } from '@/components/common/panel';
import type { MatchDeleteAction, MatchDeleteState } from '@/types/match-action';

type MatchDeleteFormProps = {
  /** 試合 ID を束縛した削除用 Server Action。 */
  action: MatchDeleteAction;
  /** 現在関連付けられている場面数。 */
  momentCount: number;
};

/** 関連場面の有無に応じて削除可否を案内し、削除処理を実行する。 */
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
    <section aria-labelledby="match-delete-title">
      <h2 id="match-delete-title" className="text-text text-xl font-semibold">
        試合の削除
      </h2>

      <Panel tone={!canDelete || state.status === 'error' ? 'error' : 'default'} className="mt-4">
        {canDelete ? (
          <p className="text-sm leading-6">
            この試合に関連する場面はありません。削除すると元に戻せません。
          </p>
        ) : (
          <p className="text-sm leading-6">
            関連する場面が {momentCount} 件存在するため、この試合は削除できません。
          </p>
        )}

        {state.message ? (
          <p role="alert" className="mt-3 text-sm leading-6">
            {state.message}
          </p>
        ) : null}

        <form action={formAction} onSubmit={handleSubmit} className="mt-4">
          <Button type="submit" variant="danger" disabled={!canDelete || isPending}>
            {isPending ? '削除中' : '試合を削除'}
          </Button>
        </form>
      </Panel>
    </section>
  );
}
