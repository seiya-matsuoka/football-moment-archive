/**
 * URL と DB の一覧取得で共有するページネーション計算を定義する。
 */

/** 0 件の場合も画面上の基準ページとして 1 を返す。 */
export function getTotalPages(totalItems: number, itemsPerPage: number): number {
  if (totalItems <= 0) {
    return 1;
  }

  return Math.ceil(totalItems / itemsPerPage);
}

/** URL から受け取ったページ番号を、実在するページ範囲へ収める。 */
export function clampPage(page: number, totalPages: number): number {
  return Math.min(Math.max(page, 1), Math.max(totalPages, 1));
}

/** 1 から始まるページ番号を、SQL の `OFFSET` へ変換する。 */
export function getPaginationOffset(page: number, itemsPerPage: number): number {
  return (Math.max(page, 1) - 1) * itemsPerPage;
}
