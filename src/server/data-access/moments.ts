import 'server-only';

/**
 * `moments` テーブルを中心とした参照・更新処理を提供する Data Access Layer。
 * SQL、DB 行の型、アプリ用型への変換をこのファイル内へまとめる。
 */

import { ITEMS_PER_PAGE, isMomentType, isTeamCode, type MomentSort } from '@/lib/constants';
import { getPaginationOffset } from '@/lib/pagination';
import { sql } from '@/server/db/client';
import type {
  Moment,
  MomentInput,
  MomentListFilters,
  MomentListQuery,
  MomentMatch,
  MomentWithMatch,
} from '@/types/moment';

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

/** 関連する試合の表示項目を JOIN した場面の DB 行。 */
type MomentWithMatchRow = MomentRow & {
  match_home_team_code: string;
  match_away_team_code: string;
  match_date: Date | null;
  match_home_score: number | null;
  match_away_score: number | null;
};

/** `COUNT` の結果を整数として受け取る DB 行。 */
type CountRow = {
  count: number;
};

/** 削除した場面の ID を受け取る DB 行。 */
type DeletedMomentRow = {
  id: number;
};

/** PostgreSQL の `DATE` を、アプリで使用する `YYYY-MM-DD` 形式へ変換する。 */
function toDateString(value: Date | null): string | null {
  if (value === null) {
    return null;
  }

  // Postgres.js は DATE を Date として返すため、時刻部分を除いて日付だけを保持する。
  return value.toISOString().slice(0, 10);
}

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

/** JOIN した試合の固定値を検証し、場面表示用の試合概要へ変換する。 */
function toMomentMatch(row: MomentWithMatchRow): MomentMatch {
  if (!isTeamCode(row.match_home_team_code)) {
    throw new Error(`Unknown home team code in match ${row.match_id}: ${row.match_home_team_code}`);
  }

  if (!isTeamCode(row.match_away_team_code)) {
    throw new Error(`Unknown away team code in match ${row.match_id}: ${row.match_away_team_code}`);
  }

  return {
    id: row.match_id,
    homeTeamCode: row.match_home_team_code,
    awayTeamCode: row.match_away_team_code,
    matchDate: toDateString(row.match_date),
    homeScore: row.match_home_score,
    awayScore: row.match_away_score,
  };
}

/** 場面と JOIN した試合情報を、一覧・詳細表示用の型へ変換する。 */
function toMomentWithMatch(row: MomentWithMatchRow): MomentWithMatch {
  return {
    ...toMoment(row),
    match: toMomentMatch(row),
  };
}

/** 場面と関連試合を取得する SELECT 句を、再利用可能な SQL 断片として返す。 */
function selectMomentWithMatchColumns() {
  return sql`
    moments.id,
    moments.match_id,
    moments.title,
    moments.moment_type,
    moments.time_label,
    moments.subject,
    moments.description,
    moments.memory_note,
    moments.is_favorite,
    moments.created_at,
    moments.updated_at,
    matches.home_team_code AS match_home_team_code,
    matches.away_team_code AS match_away_team_code,
    matches.match_date,
    matches.home_score AS match_home_score,
    matches.away_score AS match_away_score
  `;
}

/** `%`、`_`、`\` をワイルドカードではなく通常の文字として検索する。 */
function toContainsPattern(keyword: string): string {
  const escapedKeyword = keyword.replace(/[\\%_]/g, '\\$&');

  return `%${escapedKeyword}%`;
}

/** 場面一覧の検索・絞り込み条件を、パラメーター化された SQL 断片へ変換する。 */
function momentListFilter(filters: MomentListFilters) {
  const keywordPattern = filters.keyword === '' ? null : toContainsPattern(filters.keyword);

  return sql`
    WHERE TRUE
      ${
        keywordPattern === null
          ? sql``
          : sql`
              AND (
                moments.title ILIKE ${keywordPattern}
                OR moments.subject ILIKE ${keywordPattern}
                OR moments.description ILIKE ${keywordPattern}
                OR moments.memory_note ILIKE ${keywordPattern}
              )
            `
      }
      ${
        filters.team === null
          ? sql``
          : sql`
              AND (
                matches.home_team_code = ${filters.team}
                OR matches.away_team_code = ${filters.team}
              )
            `
      }
      ${
        filters.momentType === null
          ? sql``
          : sql`
              AND moments.moment_type = ${filters.momentType}
            `
      }
      ${
        filters.favoriteOnly
          ? sql`
              AND moments.is_favorite = TRUE
            `
          : sql``
      }
  `;
}

/**
 * URL から直接 SQL を組み立てず、型で許可された並び替えだけを固定 SQL 断片へ変換する。
 */
function momentOrderBy(sort: MomentSort) {
  switch (sort) {
    case 'match-date-desc':
      return sql`
        matches.match_date DESC NULLS LAST,
        moments.created_at DESC,
        moments.id DESC
      `;
    case 'match-date-asc':
      return sql`
        matches.match_date ASC NULLS LAST,
        moments.created_at ASC,
        moments.id ASC
      `;
    case 'created-at-desc':
      return sql`
        moments.created_at DESC,
        moments.id DESC
      `;
    case 'created-at-asc':
      return sql`
        moments.created_at ASC,
        moments.id ASC
      `;
  }
}

/** 登録されている場面の総数を取得する。 */
export async function getMomentCount(): Promise<number> {
  // PostgreSQL の COUNT は bigint となるため、SQL 内でアプリ用の integer へ変換する。
  const [row] = await sql<CountRow[]>`
    SELECT COUNT(*)::integer AS count
    FROM moments
  `;

  return row?.count ?? 0;
}

/** お気に入りとして登録されている場面の総数を取得する。 */
export async function getFavoriteMomentCount(): Promise<number> {
  const [row] = await sql<CountRow[]>`
    SELECT COUNT(*)::integer AS count
    FROM moments
    WHERE is_favorite = TRUE
  `;

  return row?.count ?? 0;
}

/** 現在の検索・絞り込み条件に一致する場面数を取得する。 */
export async function getMomentListCount(filters: MomentListFilters): Promise<number> {
  const [row] = await sql<CountRow[]>`
    SELECT COUNT(*)::integer AS count
    FROM moments
    INNER JOIN matches ON matches.id = moments.match_id
    ${momentListFilter(filters)}
  `;

  return row?.count ?? 0;
}

/**
 * 関連試合を含む場面一覧へ、検索、絞り込み、並び替え、`LIMIT`、`OFFSET` を適用する。
 */
export async function getMomentList(query: MomentListQuery): Promise<MomentWithMatch[]> {
  const offset = getPaginationOffset(query.page, ITEMS_PER_PAGE);

  const rows = await sql<MomentWithMatchRow[]>`
    SELECT
      ${selectMomentWithMatchColumns()}
    FROM moments
    INNER JOIN matches ON matches.id = moments.match_id
    ${momentListFilter(query)}
    ORDER BY
      ${momentOrderBy(query.sort)}
    LIMIT ${ITEMS_PER_PAGE}
    OFFSET ${offset}
  `;

  return rows.map(toMomentWithMatch);
}

/** 指定された ID の場面を、関連試合とともに取得する。 */
export async function getMomentById(id: number): Promise<MomentWithMatch | null> {
  const [row] = await sql<MomentWithMatchRow[]>`
    SELECT
      ${selectMomentWithMatchColumns()}
    FROM moments
    INNER JOIN matches ON matches.id = moments.match_id
    WHERE moments.id = ${id}
  `;

  return row ? toMomentWithMatch(row) : null;
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

/** ホーム画面用に、最近登録された場面を最大 5 件取得する。 */
export async function getRecentMoments(): Promise<MomentWithMatch[]> {
  const rows = await sql<MomentWithMatchRow[]>`
    SELECT
      ${selectMomentWithMatchColumns()}
    FROM moments
    INNER JOIN matches ON matches.id = moments.match_id
    ORDER BY moments.created_at DESC, moments.id DESC
    LIMIT 5
  `;

  return rows.map(toMomentWithMatch);
}

/** Validation 済みの入力値を使用して場面を登録する。 */
export async function createMoment(input: MomentInput): Promise<Moment> {
  const [row] = await sql<MomentRow[]>`
    INSERT INTO moments (
      match_id,
      title,
      moment_type,
      time_label,
      subject,
      description,
      memory_note,
      is_favorite
    )
    VALUES (
      ${input.matchId},
      ${input.title},
      ${input.momentType},
      ${input.timeLabel},
      ${input.subject},
      ${input.description},
      ${input.memoryNote},
      ${input.isFavorite}
    )
    RETURNING
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
  `;

  if (!row) {
    throw new Error('Failed to create moment.');
  }

  return toMoment(row);
}

/** 指定された場面を更新し、対象が存在しない場合は `null` を返す。 */
export async function updateMomentById(id: number, input: MomentInput): Promise<Moment | null> {
  const [row] = await sql<MomentRow[]>`
    UPDATE moments
    SET
      match_id = ${input.matchId},
      title = ${input.title},
      moment_type = ${input.momentType},
      time_label = ${input.timeLabel},
      subject = ${input.subject},
      description = ${input.description},
      memory_note = ${input.memoryNote},
      is_favorite = ${input.isFavorite},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING
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
  `;

  return row ? toMoment(row) : null;
}

/** 指定された場面を削除し、削除対象が存在したかを返す。 */
export async function deleteMomentById(id: number): Promise<boolean> {
  const [row] = await sql<DeletedMomentRow[]>`
    DELETE FROM moments
    WHERE id = ${id}
    RETURNING id
  `;

  return Boolean(row);
}

/** 指定された場面のお気に入り状態を DB 上の現在値から反転する。 */
export async function toggleMomentFavoriteById(id: number): Promise<Moment | null> {
  const [row] = await sql<MomentRow[]>`
    UPDATE moments
    SET
      is_favorite = NOT is_favorite,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING
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
  `;

  return row ? toMoment(row) : null;
}
