'use client';

/**
 * 現在の Route を判定しながら主要画面へのリンクを表示するグローバルナビゲーション。
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/** アプリ全体から移動できる主要画面。 */
const navigationItems = [
  { href: '/', label: 'ホーム' },
  { href: '/matches', label: '試合一覧' },
  { href: '/moments', label: '場面一覧' },
] as const;

/**
 * ナビゲーションリンクの共通スタイル。
 * 現在地かどうかに関係しないレイアウトと操作時のスタイルをまとめる。
 */
const navigationLinkBaseClassName =
  'inline-flex min-h-10 items-center rounded-control px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';

/** 現在地と通常状態で切り替えるスタイル。 */
const navigationLinkStateClassNames = {
  current: 'bg-accent text-accent-foreground',
  default: 'text-muted hover:bg-surface-muted hover:text-text',
} as const;

/** 現在のパスが、指定されたナビゲーション項目の配下であるかを判定する。 */
function isCurrentPath(pathname: string, href: string): boolean {
  // ホームは他の Route の親にもなるため、完全一致だけを現在地として扱う。
  if (href === '/') {
    return pathname === '/';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

/** 現在地を `aria-current` で示すグローバルナビゲーションを表示する。 */
export function GlobalNavigation() {
  // 現在地の表示にブラウザ側のパス情報が必要なため、このコンポーネントだけ Client Component とする。
  const pathname = usePathname();

  return (
    <nav aria-label="グローバルナビゲーション">
      <ul className="flex flex-wrap items-center gap-1">
        {navigationItems.map((item) => {
          const isCurrent = isCurrentPath(pathname, item.href);
          const stateClassName = isCurrent
            ? navigationLinkStateClassNames.current
            : navigationLinkStateClassNames.default;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isCurrent ? 'page' : undefined}
                className={`${navigationLinkBaseClassName} ${stateClassName}`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
