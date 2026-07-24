/**
 * 試合フォームと削除操作で、Client Component と Server Action の間を受け渡す状態を定義する。
 */

/** ブラウザのフォームで保持する文字列形式の入力値。 */
export type MatchFormValues = {
  homeTeamCode: string;
  awayTeamCode: string;
  matchDate: string;
  homeScore: string;
  awayScore: string;
};

/** 試合フォームの項目名。 */
export type MatchFormFieldName = keyof MatchFormValues;

/** 項目ごとに表示する Validation エラー。 */
export type MatchFormFieldErrors = Partial<Record<MatchFormFieldName, string[]>>;

/** 登録・編集フォームで保持する Server Action の結果。 */
export type MatchFormState = {
  status: 'idle' | 'error';
  /** フォーム全体へ表示する業務条件または DB 更新時のエラー。 */
  message: string | null;
  /** 入力項目の近くへ表示する Validation エラー。 */
  fieldErrors: MatchFormFieldErrors;
  /** エラー後にフォームへ戻す入力値。 */
  values: MatchFormValues;
  /** エラー後に非制御フォームを再生成し、返却された値を反映するための番号。 */
  revision: number;
};

/** `useActionState` から呼び出す登録・編集用 Server Action。 */
export type MatchFormAction = (
  previousState: MatchFormState,
  formData: FormData,
) => Promise<MatchFormState>;

/** 試合削除操作で保持する Server Action の結果。 */
export type MatchDeleteState = {
  status: 'idle' | 'error';
  message: string | null;
};

/** `useActionState` から呼び出す削除用 Server Action。 */
export type MatchDeleteAction = (
  previousState: MatchDeleteState,
  formData: FormData,
) => Promise<MatchDeleteState>;
