/**
 * URL パラメーターや FormData などの外部入力から受け取った ID を検証する。
 */

/** 数値が DB の ID として使用できる正の安全な整数であるかを判定する。 */
export function isPositiveIntegerId(value: number): boolean {
  return Number.isSafeInteger(value) && value > 0;
}

/**
 * 文字列を、DB の ID として使用できる正の安全な整数へ変換する。
 *
 * 符号、小数、指数表記、前後の空白、先頭が 0 の表記は許可しない。
 * 不正な値の場合は `null` を返し、404 や入力エラーなどの扱いは呼び出し側で決定する。
 */
export function parsePositiveIntegerId(value: string): number | null {
  // 文字列全体が、1 以上から始まる 10 進整数の形式であることを先に確認する。
  if (!/^[1-9]\d*$/.test(value)) {
    return null;
  }

  const id = Number(value);

  // JavaScript で整数として正確に扱える範囲を超える値は、DB 検索へ使用しない。
  return isPositiveIntegerId(id) ? id : null;
}
