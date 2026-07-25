/**
 * 場面機能の画面、Server Action、Data Access Layer で共有する型を定義する。
 */

import type { MomentType, TeamCode } from '@/lib/constants';

/** Data Access Layer で DB 行を camelCase へ変換した後の場面データ。 */
export type Moment = {
  /** DB の主キー。 */
  id: number;
  /** 場面が属する試合の ID。 */
  matchId: number;
  /** 一覧と詳細で場面を識別するタイトル。 */
  title: string;
  /** 固定値として管理する場面の種類。 */
  momentType: MomentType;
  /** 「89分」「試合終了後」などの自由入力による時間表記。 */
  timeLabel: string | null;
  /** 場面の中心となった選手、チーム、集団など。 */
  subject: string | null;
  /** 場面で起きた内容。 */
  description: string | null;
  /** 場面が記憶に残った理由。 */
  memoryNote: string | null;
  /** お気に入りとして登録されているか。 */
  isFavorite: boolean;
  /** ISO 形式へ変換した登録日時。 */
  createdAt: string;
  /** ISO 形式へ変換した更新日時。 */
  updatedAt: string;
};

/** 場面の登録・更新 SQL へ渡す、Validation 済みの入力値。 */
export type MomentInput = Pick<
  Moment,
  | 'matchId'
  | 'title'
  | 'momentType'
  | 'timeLabel'
  | 'subject'
  | 'description'
  | 'memoryNote'
  | 'isFavorite'
>;

/** 場面一覧と場面詳細で表示する、関連する試合の概要。 */
export type MomentMatch = {
  /** 関連する試合の DB 主キー。 */
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
};

/** 場面に、一覧・詳細表示で必要な関連試合の概要を付加したデータ。 */
export type MomentWithMatch = Moment & {
  /** `matches` テーブルから取得した関連試合の概要。 */
  match: MomentMatch;
};
