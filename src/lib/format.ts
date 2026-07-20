import { MOMENT_TYPE_OPTIONS, TEAM_OPTIONS, type MomentType, type TeamCode } from '@/lib/constants';

const MATCH_DATE_NOT_SET_LABEL = '試合日未入力';
const DATE_TIME_UNKNOWN_LABEL = '日時不明';
const SCORE_NOT_SET_LABEL = 'スコア未入力';

const matchDateFormatter = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: 'UTC',
});

const dateTimeFormatter = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Asia/Tokyo',
});

export function getTeamName(teamCode: TeamCode): string {
  return TEAM_OPTIONS.find((team) => team.code === teamCode)?.name ?? teamCode;
}

export function getMomentTypeLabel(momentType: MomentType): string {
  return MOMENT_TYPE_OPTIONS.find((option) => option.value === momentType)?.label ?? momentType;
}

export function formatMatchDate(matchDate: string | null): string {
  if (matchDate === null) {
    return MATCH_DATE_NOT_SET_LABEL;
  }

  const date = new Date(`${matchDate}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    return MATCH_DATE_NOT_SET_LABEL;
  }

  return matchDateFormatter.format(date);
}

export function formatDateTime(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return DATE_TIME_UNKNOWN_LABEL;
  }

  return dateTimeFormatter.format(date);
}

export function formatScore(homeScore: number | null, awayScore: number | null): string {
  if (homeScore === null || awayScore === null) {
    return SCORE_NOT_SET_LABEL;
  }

  return `${homeScore} - ${awayScore}`;
}

export function formatFixture(homeTeamCode: TeamCode, awayTeamCode: TeamCode): string {
  return `${getTeamName(homeTeamCode)} vs ${getTeamName(awayTeamCode)}`;
}
