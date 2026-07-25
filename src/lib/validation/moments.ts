/**
 * 場面登録・編集フォームの入力値を解析し、Zod で検証する。
 * FormData の値と、Data Access Layer へ渡す型付き入力値の境界をこのファイルで管理する。
 */

import * as z from 'zod';

import { MOMENT_INPUT_LIMITS, isMomentType, type MomentType } from '@/lib/constants';
import { parsePositiveIntegerId } from '@/lib/validation/id';
import type { Moment, MomentInput } from '@/types/moment';
import type { MomentFormFieldErrors, MomentFormValues } from '@/types/moment-action';

/** DB の ID として使用できる正の整数だけを許可し、数値へ変換する Schema。 */
const matchIdSchema = z
  .string()
  .refine((value) => parsePositiveIntegerId(value) !== null, {
    error: '関連する試合を選択してください。',
  })
  .transform(Number);

/** 前後の空白を除いた 1〜80 文字のタイトルを許可する Schema。 */
const titleSchema = z
  .string()
  .trim()
  .min(1, { error: 'タイトルを入力してください。' })
  .max(MOMENT_INPUT_LIMITS.title, {
    error: `タイトルは ${MOMENT_INPUT_LIMITS.title} 文字以内で入力してください。`,
  });

/** 固定された場面の種類だけを許可する Schema。 */
const momentTypeSchema = z
  .string()
  .refine(isMomentType, {
    error: '場面の種類を選択してください。',
  })
  .transform((value) => value as MomentType);

/** 任意文字列を Trim し、空文字は `null`、入力済みの値は上限内だけ許可する。 */
function createOptionalTextSchema(maxLength: number, label: string) {
  return z
    .string()
    .trim()
    .max(maxLength, {
      error: `${label}は ${maxLength.toLocaleString('ja-JP')} 文字以内で入力してください。`,
    })
    .transform((value) => (value === '' ? null : value));
}

/** 発生時間、対象、本文、印象をそれぞれの文字数上限で検証する。 */
const optionalTimeLabelSchema = createOptionalTextSchema(MOMENT_INPUT_LIMITS.timeLabel, '発生時間');
const optionalSubjectSchema = createOptionalTextSchema(MOMENT_INPUT_LIMITS.subject, '対象');
const optionalDescriptionSchema = createOptionalTextSchema(
  MOMENT_INPUT_LIMITS.description,
  '何が起きたか',
);
const optionalMemoryNoteSchema = createOptionalTextSchema(
  MOMENT_INPUT_LIMITS.memoryNote,
  'なぜ印象に残ったか',
);

/**
 * FormData から読み取ったフォーム値を検証し、Data Access Layer 用の `MomentInput` へ変換する。
 */
export const momentFormSchema = z
  .object({
    matchId: matchIdSchema,
    title: titleSchema,
    momentType: momentTypeSchema,
    timeLabel: optionalTimeLabelSchema,
    subject: optionalSubjectSchema,
    description: optionalDescriptionSchema,
    memoryNote: optionalMemoryNoteSchema,
    isFavorite: z.boolean(),
  })
  .transform((values): MomentInput => ({
    matchId: values.matchId,
    title: values.title,
    momentType: values.momentType,
    timeLabel: values.timeLabel,
    subject: values.subject,
    description: values.description,
    memoryNote: values.memoryNote,
    isFavorite: values.isFavorite,
  }));

/** 場面フォームの Validation 成功・失敗を呼び出し側で判別する結果。 */
export type MomentFormValidationResult =
  | {
      success: true;
      data: MomentInput;
      values: MomentFormValues;
    }
  | {
      success: false;
      values: MomentFormValues;
      fieldErrors: MomentFormFieldErrors;
      formErrors: string[];
    };

type MomentFormStringFieldName = Exclude<keyof MomentFormValues, 'isFavorite'>;

/** FormData の値を、フォームで保持する文字列へ安全に変換する。 */
function readFormDataString(formData: FormData, name: MomentFormStringFieldName): string {
  const value = formData.get(name);

  return typeof value === 'string' ? value : '';
}

/** FormData から場面フォームの全入力値を取得する。 */
export function getMomentFormValues(formData: FormData): MomentFormValues {
  return {
    matchId: readFormDataString(formData, 'matchId'),
    title: readFormDataString(formData, 'title'),
    momentType: readFormDataString(formData, 'momentType'),
    timeLabel: readFormDataString(formData, 'timeLabel'),
    subject: readFormDataString(formData, 'subject'),
    description: readFormDataString(formData, 'description'),
    memoryNote: readFormDataString(formData, 'memoryNote'),
    // 未選択のチェックボックスは FormData に含まれないため、存在する場合だけ true とする。
    isFavorite: formData.get('isFavorite') === 'on',
  };
}

/** 新規登録または既存場面から、フォームの初期値を作成する。 */
export function createMomentFormValues(moment?: Moment, initialMatchId?: number): MomentFormValues {
  return {
    matchId: String(moment?.matchId ?? initialMatchId ?? ''),
    title: moment?.title ?? '',
    momentType: moment?.momentType ?? '',
    timeLabel: moment?.timeLabel ?? '',
    subject: moment?.subject ?? '',
    description: moment?.description ?? '',
    memoryNote: moment?.memoryNote ?? '',
    isFavorite: moment?.isFavorite ?? false,
  };
}

/** FormData を検証し、成功時は型付き入力値、失敗時は表示用エラーを返す。 */
export function validateMomentFormData(formData: FormData): MomentFormValidationResult {
  const values = getMomentFormValues(formData);
  const result = momentFormSchema.safeParse(values);

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
      matchId: flattened.fieldErrors.matchId,
      title: flattened.fieldErrors.title,
      momentType: flattened.fieldErrors.momentType,
      timeLabel: flattened.fieldErrors.timeLabel,
      subject: flattened.fieldErrors.subject,
      description: flattened.fieldErrors.description,
      memoryNote: flattened.fieldErrors.memoryNote,
      isFavorite: flattened.fieldErrors.isFavorite,
    },
    formErrors: flattened.formErrors,
  };
}
