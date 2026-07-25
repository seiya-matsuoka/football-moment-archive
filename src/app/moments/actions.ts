'use server';

/**
 * 場面の登録・編集・削除・お気に入り切り替えを行う Server Action。
 * Validation、業務条件、Data Access Layer、再検証、画面遷移をこの層で組み合わせる。
 */

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { DATA_LIMITS } from '@/lib/constants';
import { isPositiveIntegerId } from '@/lib/validation/id';
import { validateMomentFormData } from '@/lib/validation/moments';
import { getMatchById } from '@/server/data-access/matches';
import {
  createMoment,
  deleteMomentById,
  getMomentById,
  getMomentCount,
  toggleMomentFavoriteById,
  updateMomentById,
} from '@/server/data-access/moments';
import { hasPostgresErrorCode } from '@/server/db/errors';
import type {
  MomentDeleteState,
  MomentFavoriteState,
  MomentFormFieldErrors,
  MomentFormState,
  MomentFormValues,
} from '@/types/moment-action';

/** PostgreSQL の文字数、NOT NULL、CHECK 制約違反を利用者向けエラーへ変換する。 */
function isExpectedMomentWriteError(error: unknown): boolean {
  return hasPostgresErrorCode(error, '22001', '23502', '23514');
}

/** 入力値を保持したまま、登録・編集フォームへエラー状態を返す。 */
function createMomentFormErrorState(
  previousState: MomentFormState,
  values: MomentFormValues,
  message: string,
  fieldErrors: MomentFormFieldErrors = {},
): MomentFormState {
  return {
    status: 'error',
    message,
    fieldErrors,
    values,
    revision: previousState.revision + 1,
  };
}

/** 場面登録フォームを検証し、関連試合と件数上限を確認して場面を登録する。 */
export async function createMomentAction(
  previousState: MomentFormState,
  formData: FormData,
): Promise<MomentFormState> {
  const validation = validateMomentFormData(formData);

  if (!validation.success) {
    return createMomentFormErrorState(
      previousState,
      validation.values,
      validation.formErrors[0] ?? '入力内容を確認してください。',
      validation.fieldErrors,
    );
  }

  // 互いに依存しない業務条件を並列で確認し、登録直前の DB 状態を基準に判断する。
  const [relatedMatch, momentCount] = await Promise.all([
    getMatchById(validation.data.matchId),
    getMomentCount(),
  ]);

  if (relatedMatch === null) {
    return createMomentFormErrorState(
      previousState,
      validation.values,
      '入力内容を確認してください。',
      { matchId: ['選択した試合は存在しません。別の試合を選択してください。'] },
    );
  }

  if (momentCount >= DATA_LIMITS.moments) {
    return createMomentFormErrorState(
      previousState,
      validation.values,
      `場面は最大 ${DATA_LIMITS.moments} 件まで登録できます。`,
    );
  }

  let createdMoment;

  try {
    createdMoment = await createMoment(validation.data);
  } catch (error) {
    // 存在確認後に関連試合が削除された競合時は、外部キー制約を想定内エラーへ変換する。
    if (hasPostgresErrorCode(error, '23503')) {
      return createMomentFormErrorState(
        previousState,
        validation.values,
        '入力内容を確認してください。',
        { matchId: ['選択した試合は存在しません。別の試合を選択してください。'] },
      );
    }

    if (isExpectedMomentWriteError(error)) {
      return createMomentFormErrorState(
        previousState,
        validation.values,
        '入力内容が登録データとしての制約を満たしていません。内容を確認してください。',
      );
    }

    throw error;
  }

  revalidatePath('/');
  revalidatePath('/matches');
  revalidatePath(`/matches/${createdMoment.matchId}`);
  revalidatePath('/moments');
  redirect(`/moments/${createdMoment.id}`);
}

/** 場面編集フォームを検証し、対象場面と関連試合が存在する場合に更新する。 */
export async function updateMomentAction(
  momentId: number,
  previousState: MomentFormState,
  formData: FormData,
): Promise<MomentFormState> {
  const validation = validateMomentFormData(formData);

  if (!validation.success) {
    return createMomentFormErrorState(
      previousState,
      validation.values,
      validation.formErrors[0] ?? '入力内容を確認してください。',
      validation.fieldErrors,
    );
  }

  if (!isPositiveIntegerId(momentId)) {
    return createMomentFormErrorState(
      previousState,
      validation.values,
      '更新対象の場面 ID が不正です。',
    );
  }

  // 更新前の関連試合 ID と、変更先として選択された試合の存在を同時に確認する。
  const [currentMoment, relatedMatch] = await Promise.all([
    getMomentById(momentId),
    getMatchById(validation.data.matchId),
  ]);

  if (currentMoment === null) {
    return createMomentFormErrorState(
      previousState,
      validation.values,
      '対象の場面はすでに削除されています。場面一覧を確認してください。',
    );
  }

  if (relatedMatch === null) {
    return createMomentFormErrorState(
      previousState,
      validation.values,
      '入力内容を確認してください。',
      { matchId: ['選択した試合は存在しません。別の試合を選択してください。'] },
    );
  }

  let updatedMoment;

  try {
    updatedMoment = await updateMomentById(momentId, validation.data);
  } catch (error) {
    if (hasPostgresErrorCode(error, '23503')) {
      return createMomentFormErrorState(
        previousState,
        validation.values,
        '入力内容を確認してください。',
        { matchId: ['選択した試合は存在しません。別の試合を選択してください。'] },
      );
    }

    if (isExpectedMomentWriteError(error)) {
      return createMomentFormErrorState(
        previousState,
        validation.values,
        '入力内容が登録データとしての制約を満たしていません。内容を確認してください。',
      );
    }

    throw error;
  }

  if (updatedMoment === null) {
    return createMomentFormErrorState(
      previousState,
      validation.values,
      '対象の場面はすでに削除されています。場面一覧を確認してください。',
    );
  }

  revalidatePath('/');
  revalidatePath('/matches');
  revalidatePath(`/matches/${currentMoment.matchId}`);
  revalidatePath(`/matches/${updatedMoment.matchId}`);
  revalidatePath('/moments');
  revalidatePath(`/moments/${momentId}`);
  redirect(`/moments/${momentId}`);
}

/** 指定された場面を単独で削除し、関連する試合は保持する。 */
export async function deleteMomentAction(
  momentId: number,
  previousState: MomentDeleteState,
  formData: FormData,
): Promise<MomentDeleteState> {
  void previousState;
  void formData;

  if (!isPositiveIntegerId(momentId)) {
    return {
      status: 'error',
      message: '削除対象の場面 ID が不正です。',
    };
  }

  // 削除後に関連試合の場面数を再検証するため、削除前の関連試合 ID を取得する。
  const moment = await getMomentById(momentId);

  if (moment === null) {
    return {
      status: 'error',
      message: '対象の場面はすでに削除されています。',
    };
  }

  const deleted = await deleteMomentById(momentId);

  if (!deleted) {
    return {
      status: 'error',
      message: '対象の場面はすでに削除されています。',
    };
  }

  revalidatePath('/');
  revalidatePath('/matches');
  revalidatePath(`/matches/${moment.matchId}`);
  revalidatePath('/moments');
  revalidatePath(`/moments/${momentId}`);
  redirect('/moments');
}

/** 場面一覧または詳細から、お気に入り状態を DB の現在値に基づいて切り替える。 */
export async function toggleMomentFavoriteAction(
  momentId: number,
  previousState: MomentFavoriteState,
  formData: FormData,
): Promise<MomentFavoriteState> {
  void previousState;
  void formData;

  if (!isPositiveIntegerId(momentId)) {
    return {
      status: 'error',
      message: '対象の場面 ID が不正です。',
    };
  }

  const updatedMoment = await toggleMomentFavoriteById(momentId);

  if (updatedMoment === null) {
    return {
      status: 'error',
      message: '対象の場面はすでに削除されています。最新の一覧を確認してください。',
    };
  }

  revalidatePath('/');
  revalidatePath('/moments');
  revalidatePath(`/moments/${momentId}`);
  // 試合詳細内の関連場面にもお気に入り状態を表示しているため、関連試合も更新する。
  revalidatePath(`/matches/${updatedMoment.matchId}`);

  return {
    status: 'idle',
    message: null,
  };
}
