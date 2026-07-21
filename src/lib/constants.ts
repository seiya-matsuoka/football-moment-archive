/**
 * アプリ全体で共有する固定値と、その固定値から導出する型を定義する。
 * DB の CHECK 制約と同じ保存値を使用し、画面・入力検証・Data Access Layer の間で値を統一する。
 */

/** アプリ名。Metadata や共通ヘッダーで使用する。 */
export const APP_NAME = 'Football Moment Archive';

/** アプリの概要。Metadata やホーム画面で使用する。 */
export const APP_DESCRIPTION = 'サッカーの試合で記憶に残った場面を記録する Web アプリケーション';

/** 今回のアプリで取り扱うリーグ、シーズン、試合日の許可範囲。 */
export const TARGET_COMPETITION = {
  league: 'Premier League',
  season: '2025/26',
  startDate: '2025-08-16',
  endDate: '2026-05-24',
} as const;

/**
 * 対象シーズンの固定 20 チーム。
 * `code` は DB に保存する値、`name` は画面へ表示する名称として使用する。
 */
export const TEAM_OPTIONS = [
  { code: 'arsenal', name: 'Arsenal' },
  { code: 'aston-villa', name: 'Aston Villa' },
  { code: 'afc-bournemouth', name: 'AFC Bournemouth' },
  { code: 'brentford', name: 'Brentford' },
  { code: 'brighton-and-hove-albion', name: 'Brighton & Hove Albion' },
  { code: 'burnley', name: 'Burnley' },
  { code: 'chelsea', name: 'Chelsea' },
  { code: 'crystal-palace', name: 'Crystal Palace' },
  { code: 'everton', name: 'Everton' },
  { code: 'fulham', name: 'Fulham' },
  { code: 'leeds-united', name: 'Leeds United' },
  { code: 'liverpool', name: 'Liverpool' },
  { code: 'manchester-city', name: 'Manchester City' },
  { code: 'manchester-united', name: 'Manchester United' },
  { code: 'newcastle-united', name: 'Newcastle United' },
  { code: 'nottingham-forest', name: 'Nottingham Forest' },
  { code: 'sunderland', name: 'Sunderland' },
  { code: 'tottenham-hotspur', name: 'Tottenham Hotspur' },
  { code: 'west-ham-united', name: 'West Ham United' },
  { code: 'wolverhampton-wanderers', name: 'Wolverhampton Wanderers' },
] as const;

/** `TEAM_OPTIONS` のコードから導出した、DB に保存可能なチームコード。 */
export type TeamCode = (typeof TEAM_OPTIONS)[number]['code'];

/**
 * 場面の種類。
 * `value` は DB に保存する値、`label` は画面へ表示する名称として使用する。
 */
export const MOMENT_TYPE_OPTIONS = [
  { value: 'goal', label: 'ゴール' },
  { value: 'save', label: 'セーブ' },
  { value: 'pass', label: 'パス' },
  { value: 'dribble', label: 'ドリブル' },
  { value: 'defense', label: '守備' },
  { value: 'tactical', label: '戦術・交代' },
  { value: 'decision', label: '判定' },
  { value: 'reaction', label: '反応・雰囲気' },
  { value: 'other', label: 'その他' },
] as const;

/** `MOMENT_TYPE_OPTIONS` の保存値から導出した場面の種類。 */
export type MomentType = (typeof MOMENT_TYPE_OPTIONS)[number]['value'];

/** 認証のない公開デモで保持できるデータの上限。 */
export const DATA_LIMITS = {
  matches: 50,
  moments: 100,
} as const;

/** 試合一覧と場面一覧で 1 ページに表示する件数。 */
export const ITEMS_PER_PAGE = 10;

/**
 * 試合一覧と場面一覧で共通して許可する並び替え。
 * 一覧ごとに別配列を重複定義せず、同じ選択肢を共有する。
 */
const LIST_SORT_OPTIONS = [
  { value: 'match-date-desc', label: '試合日の新しい順' },
  { value: 'match-date-asc', label: '試合日の古い順' },
  { value: 'created-at-desc', label: '登録日時の新しい順' },
  { value: 'created-at-asc', label: '登録日時の古い順' },
] as const;

/** 試合一覧で使用する並び替えの選択肢。 */
export const MATCH_SORT_OPTIONS = LIST_SORT_OPTIONS;

/** 場面一覧で使用する並び替えの選択肢。 */
export const MOMENT_SORT_OPTIONS = LIST_SORT_OPTIONS;

/** 試合一覧で許可する並び替え値。 */
export type MatchSort = (typeof MATCH_SORT_OPTIONS)[number]['value'];

/** 場面一覧で許可する並び替え値。 */
export type MomentSort = (typeof MOMENT_SORT_OPTIONS)[number]['value'];

/** 試合一覧を初めて開いたときに使用する並び順。 */
export const DEFAULT_MATCH_SORT: MatchSort = 'match-date-desc';

/** 場面一覧を初めて開いたときに使用する並び順。 */
export const DEFAULT_MOMENT_SORT: MomentSort = 'match-date-desc';

/*
 * URL 検索パラメーターなどの文字列を固定値の型へ安全に絞り込む。
 * 判定のたびに配列を走査しないよう、検索用の Set をあらかじめ作成する。
 */
const TEAM_CODE_SET = new Set<string>(TEAM_OPTIONS.map((team) => team.code));
const MOMENT_TYPE_SET = new Set<string>(MOMENT_TYPE_OPTIONS.map((option) => option.value));
const MATCH_SORT_SET = new Set<string>(MATCH_SORT_OPTIONS.map((option) => option.value));
const MOMENT_SORT_SET = new Set<string>(MOMENT_SORT_OPTIONS.map((option) => option.value));

/** 文字列が固定 20 チームのコードであるかを判定する。 */
export function isTeamCode(value: string): value is TeamCode {
  return TEAM_CODE_SET.has(value);
}

/** 文字列が許可された場面の種類であるかを判定する。 */
export function isMomentType(value: string): value is MomentType {
  return MOMENT_TYPE_SET.has(value);
}

/** 文字列が試合一覧で許可された並び替えであるかを判定する。 */
export function isMatchSort(value: string): value is MatchSort {
  return MATCH_SORT_SET.has(value);
}

/** 文字列が場面一覧で許可された並び替えであるかを判定する。 */
export function isMomentSort(value: string): value is MomentSort {
  return MOMENT_SORT_SET.has(value);
}
