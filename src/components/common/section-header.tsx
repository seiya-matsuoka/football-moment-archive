/**
 * Card や一覧 Section の英語補助ラベル、日本語見出し、説明、操作を表示する共通見出し。
 */

import type { ReactNode } from 'react';

type SectionHeaderProps = {
  /** 英語の短い補助ラベル。 */
  eyebrow: string;
  /** Section の日本語見出し。 */
  title: string;
  /** 見出しを参照する ID。 */
  titleId?: string;
  /** Section の補足説明。 */
  description?: string;
  /** 件数や操作など、見出し右側の補助領域。 */
  aside?: ReactNode;
  /** 見出しの大きさ。 */
  size?: 'default' | 'compact';
};

/** 場面・試合・フォームで共通する Section 見出しを表示する。 */
export function SectionHeader({
  eyebrow,
  title,
  titleId,
  description,
  aside,
  size = 'default',
}: SectionHeaderProps) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="text-accent text-[0.68rem] font-bold tracking-[0.18em] uppercase">
          {eyebrow}
        </p>
        <h2
          id={titleId}
          className={[
            'text-text mt-1 font-semibold',
            size === 'compact' ? 'text-lg' : 'text-xl',
          ].join(' ')}
        >
          {title}
        </h2>
        {description ? <p className="text-muted mt-2 text-sm leading-6">{description}</p> : null}
      </div>

      {aside ? <div className="shrink-0 sm:text-right">{aside}</div> : null}
    </header>
  );
}
