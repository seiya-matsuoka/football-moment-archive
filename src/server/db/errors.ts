import 'server-only';

/**
 * Postgres.js が返す DB エラーを、Server Action で安全に判定するための関数を定義する。
 */

import postgres from 'postgres';

/** 値が Postgres.js の `PostgresError` であるかを判定する。 */
export function isPostgresError(error: unknown): error is postgres.PostgresError {
  return error instanceof postgres.PostgresError;
}

/** Postgres.js のエラーが、指定した PostgreSQL エラーコードのいずれかであるかを判定する。 */
export function hasPostgresErrorCode(error: unknown, ...codes: string[]): boolean {
  return isPostgresError(error) && codes.includes(error.code);
}
