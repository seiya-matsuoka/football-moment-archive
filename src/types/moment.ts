/**
 * 場面機能の画面とコンポーネントで共有する型を定義する。
 */

import type { MomentType } from '@/lib/constants';

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
