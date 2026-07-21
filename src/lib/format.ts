/**
 * DB やアプリ内の値を画面表示用の文字列へ変換する関数を定義する。
 * コンポーネントごとに表記がばらつかないよう、共通の表示規則をこのファイルへ集約する。
 */

import { MOMENT_TYPE_OPTIONS, TEAM_OPTIONS, type MomentType, type TeamCode } from '@/lib/constants';

/** 未入力または不正な値を受け取った場合に使用する代替表示。 */
const MATCH_DATE_NOT_SET_LABEL = '試合日未入力';
const DATE_TIME_UNKNOWN_LABEL = '日時不明';
const SCORE_NOT_SET_LABEL = 'スコア未入力';

/**
 * 試合日は時刻を持たないため、実行環境のタイムゾーンで日付がずれないよう UTC として整形する。
 */
const matchDateFormatter = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: 'UTC',
});

/** DB の TIMESTAMPTZ を、利用者向けに日本時間で表示する。 */
const dateTimeFormatter = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Asia/Tokyo',
});

/** チームコードに対応する表示名を返す。 */
export function getTeamName(teamCode: TeamCode): string {
  // 型上は固定値だけを受け取るが、固定値変更時にも画面が空にならないようコードを代替表示にする。
  return TEAM_OPTIONS.find((team) => team.code === teamCode)?.name ?? teamCode;
}

/** 場面の種類に対応する日本語の表示名を返す。 */
export function getMomentTypeLabel(momentType: MomentType): string {
  // 型と固定値の不整合が発生した場合にも、保存値自体は確認できるよう代替表示にする。
  return MOMENT_TYPE_OPTIONS.find((option) => option.value === momentType)?.label ?? momentType;
}

/** `YYYY-MM-DD` 形式の試合日を日本語の日付表記へ変換する。 */
export function formatMatchDate(matchDate: string | null): string {
  if (matchDate === null) {
    return MATCH_DATE_NOT_SET_LABEL;
  }

  // 日付だけを扱う値へ UTC の時刻を補い、ローカルタイムによる前日・翌日へのずれを防ぐ。
  const date = new Date(`${matchDate}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    return MATCH_DATE_NOT_SET_LABEL;
  }

  return matchDateFormatter.format(date);
}

/** ISO 形式の文字列または Date を、日本時間の日時表記へ変換する。 */
export function formatDateTime(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return DATE_TIME_UNKNOWN_LABEL;
  }

  return dateTimeFormatter.format(date);
}

/** ホームとアウェーの得点を、対戦スコアの表示へ変換する。 */
export function formatScore(homeScore: number | null, awayScore: number | null): string {
  // DB 制約では両方入力または両方未入力だが、不完全な値でも片方だけを誤表示しないよう両方を確認する。
  if (homeScore === null || awayScore === null) {
    return SCORE_NOT_SET_LABEL;
  }

  return `${homeScore} - ${awayScore}`;
}

/** ホームとアウェーのチームコードから対戦カードの表示を作成する。 */
export function formatFixture(homeTeamCode: TeamCode, awayTeamCode: TeamCode): string {
  return `${getTeamName(homeTeamCode)} vs ${getTeamName(awayTeamCode)}`;
}
