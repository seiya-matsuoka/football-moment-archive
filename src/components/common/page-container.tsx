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

/**
 * 共通の横幅とページ余白を適用する。
 * 画面ごとに最大幅や左右余白を重複指定しないための共通コンポーネント。
 */
export function PageContainer({ children, className }: PageContainerProps) {
  const classes = ['mx-auto w-full max-w-6xl px-page', className].filter(Boolean).join(' ');

  return <div className={classes}>{children}</div>;
}
