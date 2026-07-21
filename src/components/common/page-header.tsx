/**
 * 各画面のタイトル、説明、操作領域を同じ構成で表示する共通ヘッダー。
 */

import type { ReactNode } from 'react';

type PageHeaderProps = {
  /** 画面の主見出し。 */
  title: string;
  /** 見出しの補足説明。 */
  description?: string;
  /** 登録ボタンなど、見出しの横へ配置する操作領域。 */
  actions?: ReactNode;
};

/** 画面ごとのタイトル、説明、任意の操作領域を表示する。 */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className="border-border pb-section flex flex-col gap-5 border-b sm:flex-row sm:items-end sm:justify-between">
      {/* タイトルと説明は、操作領域とは分けて幅を制御する。 */}
      <div className="max-w-3xl">
        <h1 className="text-text text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>

        {description ? <p className="text-muted mt-3 text-base leading-7">{description}</p> : null}
      </div>

      {/* 登録ボタンなどが必要な画面だけ操作領域を表示する。 */}
      {actions ? <div className="flex shrink-0 flex-wrap gap-3">{actions}</div> : null}
    </header>
  );
}
