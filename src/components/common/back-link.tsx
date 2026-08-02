/**
 * 一覧や詳細など、一つ前の主要画面へ戻るための共通 Text Link。
 */

import Link from 'next/link';

type BackLinkProps = {
  /** 戻り先の URL。 */
  href: string;
  /** 利用者へ表示する戻り先。 */
  label: string;
};

/** ボタンより優先度を抑えた、ページ上部の戻る導線を表示する。 */
export function BackLink({ href, label }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="text-muted hover:text-accent focus-visible:outline-focus rounded-control inline-flex min-h-10 items-center text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <span aria-hidden="true" className="mr-2">
        ←
      </span>
      {label}
    </Link>
  );
}
