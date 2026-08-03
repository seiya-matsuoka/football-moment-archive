/**
 * 各画面の戻る導線、補助ラベル、タイトル、説明、操作を同じ構成で表示する共通ヘッダー。
 */

import type { ReactNode } from 'react';

import { BackLink } from './back-link';

type PageHeaderProps = {
  /** 英語の短い補助ラベル。 */
  eyebrow?: string;
  /** 画面の主見出し。 */
  title: string;
  /** 見出しの補足説明。 */
  description?: string;
  /** 件数や状態など、説明に付随する補助情報。 */
  metadata?: ReactNode;
  /** 登録・編集など、ページの主要操作。 */
  actions?: ReactNode;
  /** ページ上部に表示する戻る導線。 */
  backLink?: {
    href: string;
    label: string;
  };
};

/** サイト全体で統一した情報階層と操作配置を持つページヘッダーを表示する。 */
export function PageHeader({
  eyebrow,
  title,
  description,
  metadata,
  actions,
  backLink,
}: PageHeaderProps) {
  return (
    <header className="border-border/60 border-b pb-6 sm:pb-7">
      {backLink ? <BackLink href={backLink.href} label={backLink.label} /> : null}

      <div
        className={[
          'flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between',
          backLink ? 'mt-4' : undefined,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="max-w-3xl min-w-0">
          {eyebrow ? (
            <p className="text-accent text-xs font-bold tracking-[0.2em] uppercase">{eyebrow}</p>
          ) : null}

          <h1
            className={[
              'text-text text-3xl leading-tight font-bold tracking-tight wrap-break-word sm:text-4xl',
              eyebrow ? 'mt-2' : undefined,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {title}
          </h1>

          {description ? (
            <p className="text-muted mt-3 max-w-2xl text-sm leading-7 sm:text-base">
              {description}
            </p>
          ) : null}

          {metadata ? <div className="mt-4">{metadata}</div> : null}
        </div>

        {actions ? (
          <div className="flex w-full shrink-0 flex-wrap items-start justify-end gap-3 lg:w-auto">
            {actions}
          </div>
        ) : null}
      </div>
    </header>
  );
}
