/**
 * ページ間の移動に使用する、ボタン形式の共通リンク。
 */

import Link from 'next/link';
import type { ReactNode } from 'react';

import { getButtonClassName, type ButtonVariant } from '@/components/common/button';

type LinkButtonProps = {
  /** 移動先の URL。 */
  href: string;
  /** リンク内に表示する内容。 */
  children: ReactNode;
  /** 操作の目的に応じた見た目。 */
  variant?: ButtonVariant;
  /** 利用箇所固有のクラスを追加する場合に指定する。 */
  className?: string;
};

/** 共通ボタンと同じ見た目を持つページ遷移リンクを表示する。 */
export function LinkButton({ href, children, variant = 'secondary', className }: LinkButtonProps) {
  return (
    <Link href={href} className={getButtonClassName(variant, className)}>
      {children}
    </Link>
  );
}
