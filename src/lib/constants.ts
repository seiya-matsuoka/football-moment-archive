export const APP_NAME = 'Football Moment Archive';

export const APP_DESCRIPTION = 'サッカーの試合で記憶に残った場面を記録する Web アプリケーション';

export const TARGET_COMPETITION = {
  league: 'Premier League',
  season: '2025/26',
  startDate: '2025-08-16',
  endDate: '2026-05-24',
} as const;

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

export type TeamCode = (typeof TEAM_OPTIONS)[number]['code'];

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

export type MomentType = (typeof MOMENT_TYPE_OPTIONS)[number]['value'];

export const DATA_LIMITS = {
  matches: 50,
  moments: 100,
} as const;

export const ITEMS_PER_PAGE = 10;

export const MATCH_SORT_OPTIONS = [
  { value: 'match-date-desc', label: '試合日の新しい順' },
  { value: 'match-date-asc', label: '試合日の古い順' },
  { value: 'created-at-desc', label: '登録日時の新しい順' },
  { value: 'created-at-asc', label: '登録日時の古い順' },
] as const;

export type MatchSort = (typeof MATCH_SORT_OPTIONS)[number]['value'];

export const DEFAULT_MATCH_SORT: MatchSort = 'match-date-desc';

export const MOMENT_SORT_OPTIONS = [
  { value: 'match-date-desc', label: '試合日の新しい順' },
  { value: 'match-date-asc', label: '試合日の古い順' },
  { value: 'created-at-desc', label: '登録日時の新しい順' },
  { value: 'created-at-asc', label: '登録日時の古い順' },
] as const;

export type MomentSort = (typeof MOMENT_SORT_OPTIONS)[number]['value'];

export const DEFAULT_MOMENT_SORT: MomentSort = 'match-date-desc';

export function isTeamCode(value: string): value is TeamCode {
  return TEAM_OPTIONS.some((team) => team.code === value);
}

export function isMomentType(value: string): value is MomentType {
  return MOMENT_TYPE_OPTIONS.some((momentType) => momentType.value === value);
}

export function isMatchSort(value: string): value is MatchSort {
  return MATCH_SORT_OPTIONS.some((sort) => sort.value === value);
}

export function isMomentSort(value: string): value is MomentSort {
  return MOMENT_SORT_OPTIONS.some((sort) => sort.value === value);
}
