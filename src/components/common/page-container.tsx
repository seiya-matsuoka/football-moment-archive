/**
 * 画面全体で共通する最大幅と左右余白を適用するコンテナ。
 */

import type { ReactNode } from 'react';

type PageContainerProps = {
  /** コンテナ内に表示する内容。 */
  children: ReactNode;
  /** 利用箇所固有のクラスを追加する場合に指定する。 */
  className?: string;
};

/** サイト全体で統一した最大幅とレスポンシブな左右余白を適用する。 */
export function PageContainer({ children, className }: PageContainerProps) {
  const classes = ['mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8', className]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
}
