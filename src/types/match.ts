/**
 * 試合機能の画面とコンポーネントで共有する型を定義する。
 */

import type { TeamCode } from '@/lib/constants';

/** Data Access Layer で DB 行を camelCase へ変換した後の試合データ。 */
export type Match = {
  /** DB の主キー。 */
  id: number;
  /** ホームチームの固定コード。 */
  homeTeamCode: TeamCode;
  /** アウェーチームの固定コード。 */
  awayTeamCode: TeamCode;
  /** `YYYY-MM-DD` 形式の試合日。未入力の場合は `null`。 */
  matchDate: string | null;
  /** ホームチームの得点。スコア未入力の場合は `null`。 */
  homeScore: number | null;
  /** アウェーチームの得点。スコア未入力の場合は `null`。 */
  awayScore: number | null;
  /** ISO 形式へ変換した登録日時。 */
  createdAt: string;
  /** ISO 形式へ変換した更新日時。 */
  updatedAt: string;
};

/** 一覧画面と詳細画面で使用する、関連する場面数を含んだ試合データ。 */
export type MatchWithMomentCount = Match & {
  /** 試合へ関連付けられている場面の件数。 */
  momentCount: number;
};
