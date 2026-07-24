/**
 * 試合登録・編集フォームの入力値を解析し、Zod で検証する。
 * FormData の文字列値と、Data Access Layer へ渡す型付き入力値の境界をこのファイルで管理する。
 */

import * as z from 'zod';

import { TARGET_COMPETITION, isTeamCode, type TeamCode } from '@/lib/constants';
import type { MatchFormFieldErrors, MatchFormValues } from '@/types/match-action';
import type { Match, MatchInput } from '@/types/match';

/** PostgreSQL の SMALLINT へ保存できる最大値。 */
const MAX_SCORE = 32_767;

/** HTML の日付入力と同じ `YYYY-MM-DD` 形式で、実在する日付であるかを判定する。 */
function isValidDateString(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/** 未入力または PostgreSQL の SMALLINT へ保存できる 0 以上の整数であるかを判定する。 */
function isValidOptionalScore(value: string): boolean {
  if (value === '') {
    return true;
  }

  if (!/^\d+$/.test(value)) {
    return false;
  }

  const score = Number(value);

  return Number.isSafeInteger(score) && score <= MAX_SCORE;
}

/** 固定 20 チームのコードだけを許可する文字列 Schema。 */
const teamCodeSchema = z.string().refine(isTeamCode, {
  error: '対象チームから選択してください。',
});

/** 未入力または対象シーズン内の日付だけを許可する文字列 Schema。 */
const optionalMatchDateSchema = z
  .string()
  .refine((value) => value === '' || isValidDateString(value), {
    error: '有効な日付を入力してください。',
  })
  .refine(
    (value) =>
      value === '' ||
      (value >= TARGET_COMPETITION.startDate && value <= TARGET_COMPETITION.endDate),
    {
      error: `${TARGET_COMPETITION.startDate} から ${TARGET_COMPETITION.endDate} までの日付を入力してください。`,
    },
  );

/** 未入力または 0〜32767 の整数だけを許可する得点 Schema。 */
const optionalScoreSchema = z.string().refine(isValidOptionalScore, {
  error: `0 から ${MAX_SCORE} までの整数を入力してください。`,
});

/**
 * FormData から取り出した文字列値を検証する Schema。
 * 複数項目にまたがる条件を検証した後、Data Access Layer 用の `MatchInput` へ変換する。
 */
export const matchFormSchema = z
  .object({
    homeTeamCode: teamCodeSchema,
    awayTeamCode: teamCodeSchema,
    matchDate: optionalMatchDateSchema,
    homeScore: optionalScoreSchema,
    awayScore: optionalScoreSchema,
  })
  .refine(
    (values) =>
      !isTeamCode(values.homeTeamCode) ||
      !isTeamCode(values.awayTeamCode) ||
      values.homeTeamCode !== values.awayTeamCode,
    {
      path: ['awayTeamCode'],
      error: 'ホームチームとは異なるチームを選択してください。',
    },
  )
  .refine((values) => values.homeScore !== '' || values.awayScore === '', {
    path: ['homeScore'],
    error: 'アウェーチーム得点を入力する場合は、ホームチーム得点も入力してください。',
  })
  .refine((values) => values.awayScore !== '' || values.homeScore === '', {
    path: ['awayScore'],
    error: 'ホームチーム得点を入力する場合は、アウェーチーム得点も入力してください。',
  })
  .transform((values): MatchInput => ({
    homeTeamCode: values.homeTeamCode as TeamCode,
    awayTeamCode: values.awayTeamCode as TeamCode,
    matchDate: values.matchDate === '' ? null : values.matchDate,
    homeScore: values.homeScore === '' ? null : Number(values.homeScore),
    awayScore: values.awayScore === '' ? null : Number(values.awayScore),
  }));

/** 試合フォームの Validation 成功・失敗を呼び出し側で判別する結果。 */
export type MatchFormValidationResult =
  | {
      success: true;
      data: MatchInput;
      values: MatchFormValues;
    }
  | {
      success: false;
      values: MatchFormValues;
      fieldErrors: MatchFormFieldErrors;
      formErrors: string[];
    };

/** FormData の値を、フォームで保持する文字列へ安全に変換する。 */
function readFormDataString(formData: FormData, name: keyof MatchFormValues): string {
  const value = formData.get(name);

  return typeof value === 'string' ? value : '';
}

/** FormData から試合フォームの全入力値を取得する。 */
export function getMatchFormValues(formData: FormData): MatchFormValues {
  return {
    homeTeamCode: readFormDataString(formData, 'homeTeamCode'),
    awayTeamCode: readFormDataString(formData, 'awayTeamCode'),
    matchDate: readFormDataString(formData, 'matchDate'),
    homeScore: readFormDataString(formData, 'homeScore'),
    awayScore: readFormDataString(formData, 'awayScore'),
  };
}

/** 新規登録または既存試合から、フォームの初期値を作成する。 */
export function createMatchFormValues(match?: Match): MatchFormValues {
  return {
    homeTeamCode: match?.homeTeamCode ?? '',
    awayTeamCode: match?.awayTeamCode ?? '',
    matchDate: match?.matchDate ?? '',
    homeScore:
      match?.homeScore === null || match?.homeScore === undefined ? '' : String(match.homeScore),
    awayScore:
      match?.awayScore === null || match?.awayScore === undefined ? '' : String(match.awayScore),
  };
}

/** FormData を検証し、成功時は型付き入力値、失敗時は表示用エラーを返す。 */
export function validateMatchFormData(formData: FormData): MatchFormValidationResult {
  const values = getMatchFormValues(formData);
  const result = matchFormSchema.safeParse(values);

  if (result.success) {
    return {
      success: true,
      data: result.data,
      values,
    };
  }

  // Zod 4 の `flattenError` を使用し、1 階層のフォーム項目へエラーを対応付ける。
  const flattened = z.flattenError(result.error);

  return {
    success: false,
    values,
    fieldErrors: {
      homeTeamCode: flattened.fieldErrors.homeTeamCode,
      awayTeamCode: flattened.fieldErrors.awayTeamCode,
      matchDate: flattened.fieldErrors.matchDate,
      homeScore: flattened.fieldErrors.homeScore,
      awayScore: flattened.fieldErrors.awayScore,
    },
    formErrors: flattened.formErrors,
  };
}
