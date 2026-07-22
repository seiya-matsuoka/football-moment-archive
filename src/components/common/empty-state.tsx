/**
 * 一覧や検索結果に表示対象が存在しない場合の共通表示。
 */

import { Panel } from './panel';

type EmptyStateProps = {
  /** データが存在しない理由や、利用者が次に確認する内容。 */
  message: string;
};

/** 空状態のメッセージを、他の情報より弱い見た目のパネルで表示する。 */
export function EmptyState({ message }: EmptyStateProps) {
  return (
    <Panel tone="muted">
      <p className="text-muted text-sm leading-6">{message}</p>
    </Panel>
  );
}
