import 'server-only';

/**
 * `matches` テーブルを中心とした参照処理を提供する Data Access Layer。
 * SQL、DB 行の型、アプリ用型への変換をこのファイル内へまとめる。
 */

import { isTeamCode } from '@/lib/constants';
import { sql } from '@/server/db/client';
import type { Match, MatchWithMomentCount } from '@/types/match';

/** `matches` テーブルから取得する DB 行。 */
type MatchRow = {
  id: number;
  home_team_code: string;
  away_team_code: string;
  match_date: Date | null;
  home_score: number | null;
  away_score: number | null;
  created_at: Date;
  updated_at: Date;
};

/** 関連する場面数を付加した試合の DB 行。 */
type MatchWithMomentCountRow = MatchRow & {
  moment_count: number;
};

/** `COUNT` の結果を整数として受け取る DB 行。 */
type CountRow = {
  count: number;
};

/** PostgreSQL の `DATE` を、アプリで使用する `YYYY-MM-DD` 形式へ変換する。 */
function toDateString(value: Date | null): string | null {
  if (value === null) {
    return null;
  }

  // Postgres.js は DATE を Date として返すため、時刻部分を除いて日付だけを保持する。
  return value.toISOString().slice(0, 10);
}

/** DB 行の固定値を検証し、試合のアプリ用型へ変換する。 */
function toMatch(row: MatchRow): Match {
  if (!isTeamCode(row.home_team_code)) {
    throw new Error(`Unknown home team code in match ${row.id}: ${row.home_team_code}`);
  }

  if (!isTeamCode(row.away_team_code)) {
    throw new Error(`Unknown away team code in match ${row.id}: ${row.away_team_code}`);
  }

  return {
    id: row.id,
    homeTeamCode: row.home_team_code,
    awayTeamCode: row.away_team_code,
    matchDate: toDateString(row.match_date),
    homeScore: row.home_score,
    awayScore: row.away_score,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

/** 場面数を含む DB 行を、一覧・詳細表示用の試合型へ変換する。 */
function toMatchWithMomentCount(row: MatchWithMomentCountRow): MatchWithMomentCount {
  return {
    ...toMatch(row),
    momentCount: row.moment_count,
  };
}

/** 登録されている試合の総数を取得する。 */
export async function getMatchCount(): Promise<number> {
  // PostgreSQL の COUNT は bigint となるため、SQL 内でアプリ用の integer へ変換する。
  const [row] = await sql<CountRow[]>`
    SELECT COUNT(*)::integer AS count
    FROM matches
  `;

  return row?.count ?? 0;
}

/** 場面数を含む試合一覧を、試合日の新しい順で取得する。 */
export async function getMatchList(): Promise<MatchWithMomentCount[]> {
  const rows = await sql<MatchWithMomentCountRow[]>`
    SELECT
      matches.id,
      matches.home_team_code,
      matches.away_team_code,
      matches.match_date,
      matches.home_score,
      matches.away_score,
      matches.created_at,
      matches.updated_at,
      COUNT(moments.id)::integer AS moment_count
    FROM matches
    LEFT JOIN moments ON moments.match_id = matches.id
    GROUP BY matches.id
    ORDER BY
      matches.match_date DESC NULLS LAST,
      matches.created_at DESC,
      matches.id DESC
  `;

  return rows.map(toMatchWithMomentCount);
}

/** 指定された ID の試合を、関連する場面数とともに取得する。 */
export async function getMatchById(id: number): Promise<MatchWithMomentCount | null> {
  const [row] = await sql<MatchWithMomentCountRow[]>`
    SELECT
      matches.id,
      matches.home_team_code,
      matches.away_team_code,
      matches.match_date,
      matches.home_score,
      matches.away_score,
      matches.created_at,
      matches.updated_at,
      COUNT(moments.id)::integer AS moment_count
    FROM matches
    LEFT JOIN moments ON moments.match_id = matches.id
    WHERE matches.id = ${id}
    GROUP BY matches.id
  `;

  return row ? toMatchWithMomentCount(row) : null;
}
