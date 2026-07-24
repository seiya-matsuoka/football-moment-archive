/**
 * 一覧や検索結果に表示対象が存在しない場合の共通表示。
 */

import type { ReactNode } from 'react';

import { Panel } from './panel';

type EmptyStateProps = {
  /** データが存在しない理由や、利用者が次に確認する内容。 */
  message: string;
  /** 新規登録など、空状態から次に行える操作。 */
  actions?: ReactNode;
};

/** 空状態のメッセージと任意の操作を、他の情報より弱い見た目で表示する。 */
export function EmptyState({ message, actions }: EmptyStateProps) {
  return (
    <Panel tone="muted">
      <p className="text-muted text-sm leading-6">{message}</p>
      {actions ? <div className="mt-4 flex flex-wrap gap-3">{actions}</div> : null}
    </Panel>
  );
}
