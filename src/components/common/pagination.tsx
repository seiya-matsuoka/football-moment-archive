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

/** 前後移動と全ページ番号を表示する。 */
export function Pagination({ pathname, currentPage, totalPages, searchParams }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const previousPage = currentPage - 1;
  const nextPage = currentPage + 1;

  return (
    <nav
      aria-label="ページネーション"
      className="border-border mt-section pt-section flex flex-col gap-4 border-t sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-muted text-sm">
        {currentPage} / {totalPages} ページ
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {currentPage > 1 ? (
          <Link
            href={createPageHref(pathname, searchParams, previousPage)}
            className={getButtonClassName('secondary')}
            rel="prev"
          >
            前ページ
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className={getButtonClassName('secondary', 'cursor-not-allowed opacity-60')}
          >
            前ページ
          </span>
        )}

        {pages.map((page) =>
          page === currentPage ? (
            <span
              key={page}
              aria-current="page"
              aria-label={`${page} ページ目・現在のページ`}
              className={getButtonClassName('primary', 'min-w-10 px-3')}
            >
              {page}
            </span>
          ) : (
            <Link
              key={page}
              href={createPageHref(pathname, searchParams, page)}
              aria-label={`${page} ページ目へ移動`}
              className={getButtonClassName('secondary', 'min-w-10 px-3')}
            >
              {page}
            </Link>
          ),
        )}

        {currentPage < totalPages ? (
          <Link
            href={createPageHref(pathname, searchParams, nextPage)}
            className={getButtonClassName('secondary')}
            rel="next"
          >
            次ページ
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className={getButtonClassName('secondary', 'cursor-not-allowed opacity-60')}
          >
            次ページ
          </span>
        )}
      </div>
    </nav>
  );
}
