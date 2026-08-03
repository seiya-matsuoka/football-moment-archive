'use client';

/**
 * 場面詳細画面で削除確認、送信状態、Server Action の結果を扱うフォーム。
 */

import type { FormEvent } from 'react';
import { useActionState } from 'react';

import { Button } from '@/components/common/button';
import type { MomentDeleteAction, MomentDeleteState } from '@/types/moment-action';

type MomentDeleteFormProps = {
  /** 場面 ID を束縛した削除用 Server Action。 */
  action: MomentDeleteAction;
  /** 確認ダイアログで削除対象を識別するタイトル。 */
  title: string;
};

/** 場面だけを削除し、関連する試合は保持することを案内して削除処理を実行する。 */
export function MomentDeleteForm({ action, title }: MomentDeleteFormProps) {
  const initialState: MomentDeleteState = {
    status: 'idle',
    message: null,
  };
  const [state, formAction, isPending] = useActionState(action, initialState);

  /** 削除を送信する直前に、ブラウザの確認ダイアログを表示する。 */
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm(`場面「${title}」を削除します。よろしいですか？`)) {
      event.preventDefault();
    }
  }

  return (
    <section
      aria-labelledby="moment-delete-title"
      className="border-error-border bg-error-background rounded-panel border p-5 sm:p-6"
    >
      <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:gap-8">
        <div className="max-w-3xl min-w-0">
          <p className="text-error text-[0.68rem] font-bold tracking-[0.18em] uppercase">
            Danger Zone
          </p>
          <h2 id="moment-delete-title" className="text-error mt-1 text-xl font-semibold">
            場面の削除
          </h2>

          <p className="text-error mt-3 text-sm leading-7">
            この場面だけを削除します。関連する試合は削除されません。この操作は元に戻せません。
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
          <Button type="submit" variant="danger" disabled={isPending} className="min-w-32">
            {isPending ? '削除中' : '場面を削除'}
          </Button>
        </form>
      </div>
    </section>
  );
}
