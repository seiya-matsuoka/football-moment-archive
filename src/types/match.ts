/**
 * 試合機能の画面、Server Action、Data Access Layer で共有する型を定義する。
 */

import type { MatchSort, TeamCode } from '@/lib/constants';

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

/** 試合の登録・更新 SQL へ渡す、検証済みの入力値。 */
export type MatchInput = Pick<
  Match,
  'homeTeamCode' | 'awayTeamCode' | 'matchDate' | 'homeScore' | 'awayScore'
>;

/** 試合一覧の件数取得と一覧取得で共有する絞り込み条件。 */
export type MatchListFilters = {
  /** ホームまたはアウェーに含まれるチーム。指定なしの場合は `null`。 */
  team: TeamCode | null;
};

/** URL 検索パラメーターから正規化した試合一覧の取得条件。 */
export type MatchListQuery = MatchListFilters & {
  /** 許可された 4 種類の並び替え。 */
  sort: MatchSort;
  /** 1 から始まる表示ページ番号。 */
  page: number;
};

/** 一覧画面と詳細画面で使用する、関連する場面数を含んだ試合データ。 */
export type MatchWithMomentCount = Match & {
  /** 試合へ関連付けられている場面の件数。 */
  momentCount: number;
};
