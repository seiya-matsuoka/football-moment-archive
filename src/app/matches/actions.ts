'use server';

/**
 * 試合の登録・編集・削除を行う Server Action。
 * Validation、業務条件、Data Access Layer、再検証、画面遷移をこの層で組み合わせる。
 */

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { DATA_LIMITS } from '@/lib/constants';
import { isPositiveIntegerId } from '@/lib/validation/id';
import { validateMatchFormData } from '@/lib/validation/matches';
import {
  createMatch,
  deleteMatchById,
  getMatchById,
  getMatchCount,
  updateMatchById,
} from '@/server/data-access/matches';
import { hasPostgresErrorCode } from '@/server/db/errors';
import type {
  MatchDeleteState,
  MatchFormFieldErrors,
  MatchFormState,
  MatchFormValues,
} from '@/types/match-action';

/** PostgreSQL の CHECK 制約、NOT NULL、数値範囲違反を利用者向けエラーへ変換する。 */
function isExpectedMatchWriteError(error: unknown): boolean {
  return hasPostgresErrorCode(error, '22003', '23502', '23514');
}

/** 入力値を保持したまま、登録・編集フォームへエラー状態を返す。 */
function createMatchFormErrorState(
  previousState: MatchFormState,
  values: MatchFormValues,
  message: string,
  fieldErrors: MatchFormFieldErrors = {},
): MatchFormState {
  return {
    status: 'error',
    message,
    fieldErrors,
    values,
    revision: previousState.revision + 1,
  };
}

/** 試合登録フォームを検証し、件数上限未満の場合に新しい試合を登録する。 */
export async function createMatchAction(
  previousState: MatchFormState,
  formData: FormData,
): Promise<MatchFormState> {
  const validation = validateMatchFormData(formData);

  if (!validation.success) {
    return createMatchFormErrorState(
      previousState,
      validation.values,
      validation.formErrors[0] ?? '入力内容を確認してください。',
      validation.fieldErrors,
    );
  }

  // 公開デモの件数上限は画面表示だけに依存せず、登録直前にサーバー側で再確認する。
  const matchCount = await getMatchCount();

  if (matchCount >= DATA_LIMITS.matches) {
    return createMatchFormErrorState(
      previousState,
      validation.values,
      `試合は最大 ${DATA_LIMITS.matches} 件まで登録できます。`,
    );
  }

  let createdMatch;

  try {
    createdMatch = await createMatch(validation.data);
  } catch (error) {
    if (isExpectedMatchWriteError(error)) {
      return createMatchFormErrorState(
        previousState,
        validation.values,
        '入力内容が 登録データとしての制約を満たしていません。内容を確認してください。',
      );
    }

    // 接続障害や実装不備などの予期しないエラーは Error Boundary へ委ねる。
    throw error;
  }

  revalidatePath('/');
  revalidatePath('/matches');
  redirect(`/matches/${createdMatch.id}`);
}

/** 試合編集フォームを検証し、対象が存在する場合に試合情報を更新する。 */
export async function updateMatchAction(
  matchId: number,
  previousState: MatchFormState,
  formData: FormData,
): Promise<MatchFormState> {
  const validation = validateMatchFormData(formData);

  if (!validation.success) {
    return createMatchFormErrorState(
      previousState,
      validation.values,
      validation.formErrors[0] ?? '入力内容を確認してください。',
      validation.fieldErrors,
    );
  }

  // Server Action は外部から呼び出せるため、画面側で確認済みの ID も再検証する。
  if (!isPositiveIntegerId(matchId)) {
    return createMatchFormErrorState(
      previousState,
      validation.values,
      '更新対象の試合 ID が不正です。',
    );
  }

  let updatedMatch;

  try {
    updatedMatch = await updateMatchById(matchId, validation.data);
  } catch (error) {
    if (isExpectedMatchWriteError(error)) {
      return createMatchFormErrorState(
        previousState,
        validation.values,
        '入力内容が 登録データとしての制約を満たしていません。内容を確認してください。',
      );
    }

    throw error;
  }

  // 編集画面表示後に他の利用者が削除した場合は、フォーム内の想定内エラーとして案内する。
  if (updatedMatch === null) {
    return createMatchFormErrorState(
      previousState,
      validation.values,
      '対象の試合はすでに削除されています。試合一覧を確認してください。',
    );
  }

  revalidatePath('/matches');
  revalidatePath(`/matches/${matchId}`);
  revalidatePath('/moments');
  redirect(`/matches/${matchId}`);
}

/** 関連場面が存在しない試合だけを削除する。 */
export async function deleteMatchAction(
  matchId: number,
  previousState: MatchDeleteState,
  formData: FormData,
): Promise<MatchDeleteState> {
  void previousState;
  void formData;

  if (!isPositiveIntegerId(matchId)) {
    return {
      status: 'error',
      message: '削除対象の試合 ID が不正です。',
    };
  }

  const match = await getMatchById(matchId);

  if (match === null) {
    return {
      status: 'error',
      message: '対象の試合はすでに削除されています。',
    };
  }

  // 利用者へ分かりやすい理由を返すため、削除 SQL の前にアプリ側でも関連件数を確認する。
  if (match.momentCount > 0) {
    return {
      status: 'error',
      message: `関連する場面が ${match.momentCount} 件存在するため削除できません。`,
    };
  }

  let deleted;

  try {
    deleted = await deleteMatchById(matchId);
  } catch (error) {
    // 確認後に場面が追加された競合時も、外部キー制約を最終防衛線として削除を拒否する。
    if (hasPostgresErrorCode(error, '23503')) {
      return {
        status: 'error',
        message: '関連する場面が存在するため削除できません。最新の状態を確認してください。',
      };
    }

    throw error;
  }

  if (!deleted) {
    return {
      status: 'error',
      message: '対象の試合はすでに削除されています。',
    };
  }

  revalidatePath('/');
  revalidatePath('/matches');
  revalidatePath('/moments');
  redirect('/matches');
}
