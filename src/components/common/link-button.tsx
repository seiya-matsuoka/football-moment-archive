/**
 * ページ間の補助的な移動に使用する、ボタン形式の共通リンク。
 */

import Link from 'next/link';
import type { ReactNode } from 'react';

type LinkButtonProps = {
  /** 移動先の URL。 */
  href: string;
  /** リンク内に表示する内容。 */
  children: ReactNode;
  /** 利用箇所固有のクラスを追加する場合に指定する。 */
  className?: string;
};

/** 枠線付きの補助操作として統一した見た目のリンクを表示する。 */
export function LinkButton({ href, children, className }: LinkButtonProps) {
  const classes = [
    'inline-flex min-h-10 items-center rounded-control border border-border bg-surface px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
