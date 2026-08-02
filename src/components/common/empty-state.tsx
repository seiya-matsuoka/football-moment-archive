/**
 * 一覧や検索結果に表示対象が存在しない場合の共通表示。
 */

import type { ReactNode } from 'react';

import { Panel } from './panel';

type EmptyStateProps = {
  /** 空状態を短く示す見出し。 */
  title?: string;
  /** データが存在しない理由や、利用者が次に確認する内容。 */
  message: string;
  /** 新規登録など、空状態から次に行える操作。 */
  actions?: ReactNode;
  /** 補助ラベル。 */
  eyebrow?: string;
  /** 親 Section に合わせる見出しレベル。 */
  headingLevel?: 2 | 3;
};

/** 空状態を通常コンテンツより弱い Surface と明確な次操作で表示する。 */
export function EmptyState({
  title = '表示するデータがありません',
  message,
  actions,
  eyebrow = 'Empty',
  headingLevel = 2,
}: EmptyStateProps) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';

  return (
    <Panel tone="muted" className="px-5 py-7 sm:px-6 sm:py-8">
      <p className="text-accent text-[0.68rem] font-bold tracking-[0.18em] uppercase">{eyebrow}</p>
      <Heading className="text-text mt-1.5 text-lg font-semibold">{title}</Heading>
      <p className="text-muted mt-2 max-w-2xl text-sm leading-6">{message}</p>
      {actions ? <div className="mt-5 flex flex-wrap gap-3">{actions}</div> : null}
    </Panel>
  );
}
