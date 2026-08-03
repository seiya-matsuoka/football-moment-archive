/**
 * 一覧条件を維持したままページを移動する共通ページネーション。
 */

import Link from 'next/link';

import { getButtonClassName } from '@/components/common/button';

type PaginationProps = {
  /** 検索パラメーターを付与する一覧画面のパス。 */
  pathname: string;
  /** 現在表示しているページ番号。 */
  currentPage: number;
  /** 条件一致件数から算出した総ページ数。 */
  totalPages: number;
  /** 現在の検索・絞り込み・並び替え条件。 */
  searchParams: URLSearchParams;
};

/** ページ番号だけを差し替え、現在の一覧条件を維持した URL を作成する。 */
function createPageHref(pathname: string, searchParams: URLSearchParams, page: number): string {
  const nextSearchParams = new URLSearchParams(searchParams);

  if (page <= 1) {
    nextSearchParams.delete('page');
  } else {
    nextSearchParams.set('page', String(page));
  }

  const queryString = nextSearchParams.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
}

/** 前後移動と全ページ番号を Compact な Footer として表示する。 */
export function Pagination({ pathname, currentPage, totalPages, searchParams }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const inactiveClassName = getButtonClassName('secondary', 'min-w-10 px-3 tabular-nums');

  return (
    <nav
      aria-label="ページネーション"
      className="border-border/45 mt-5 flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-muted text-xs font-semibold tracking-wide uppercase tabular-nums">
        Page {currentPage} / {totalPages}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {currentPage > 1 ? (
          <Link
            href={createPageHref(pathname, searchParams, currentPage - 1)}
            className={getButtonClassName('secondary')}
            rel="prev"
          >
            前へ
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className={getButtonClassName('secondary', 'cursor-not-allowed opacity-45')}
          >
            前へ
          </span>
        )}

        {pages.map((page) =>
          page === currentPage ? (
            <span
              key={page}
              aria-current="page"
              aria-label={`${page} ページ目・現在のページ`}
              className={getButtonClassName('primary', 'min-w-10 px-3 tabular-nums')}
            >
              {page}
            </span>
          ) : (
            <Link
              key={page}
              href={createPageHref(pathname, searchParams, page)}
              aria-label={`${page} ページ目へ移動`}
              className={inactiveClassName}
            >
              {page}
            </Link>
          ),
        )}

        {currentPage < totalPages ? (
          <Link
            href={createPageHref(pathname, searchParams, currentPage + 1)}
            className={getButtonClassName('secondary')}
            rel="next"
          >
            次へ
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className={getButtonClassName('secondary', 'cursor-not-allowed opacity-45')}
          >
            次へ
          </span>
        )}
      </div>
    </nav>
  );
}
