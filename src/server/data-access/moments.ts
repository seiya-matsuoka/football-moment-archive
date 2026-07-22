import 'server-only';

/**
 * `moments` テーブルを中心とした参照処理を提供する Data Access Layer。
 * SQL、DB 行の型、アプリ用型への変換をこのファイル内へまとめる。
 */

import { isMomentType } from '@/lib/constants';
import { sql } from '@/server/db/client';
import type { Moment } from '@/types/moment';

/** `moments` テーブルから取得する DB 行。 */
type MomentRow = {
  id: number;
  match_id: number;
  title: string;
  moment_type: string;
  time_label: string | null;
  subject: string | null;
  description: string | null;
  memory_note: string | null;
  is_favorite: boolean;
  created_at: Date;
  updated_at: Date;
};

/** DB 行の固定値を検証し、場面のアプリ用型へ変換する。 */
function toMoment(row: MomentRow): Moment {
  if (!isMomentType(row.moment_type)) {
    throw new Error(`Unknown moment type in moment ${row.id}: ${row.moment_type}`);
  }

  return {
    id: row.id,
    matchId: row.match_id,
    title: row.title,
    momentType: row.moment_type,
    timeLabel: row.time_label,
    subject: row.subject,
    description: row.description,
    memoryNote: row.memory_note,
    isFavorite: row.is_favorite,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

/** 指定された試合に関連する場面を、登録日時の新しい順で取得する。 */
export async function getMomentsByMatchId(matchId: number): Promise<Moment[]> {
  const rows = await sql<MomentRow[]>`
    SELECT
      id,
      match_id,
      title,
      moment_type,
      time_label,
      subject,
      description,
      memory_note,
      is_favorite,
      created_at,
      updated_at
    FROM moments
    WHERE match_id = ${matchId}
    ORDER BY created_at DESC, id DESC
  `;

  return rows.map(toMoment);
}
