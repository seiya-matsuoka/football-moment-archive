/**
 * 場面フォーム、削除、お気に入り操作で、Client Component と Server Action の間を受け渡す状態を定義する。
 */

/** ブラウザのフォームで保持する、Validation 前の入力値。 */
export type MomentFormValues = {
  matchId: string;
  title: string;
  momentType: string;
  timeLabel: string;
  subject: string;
  description: string;
  memoryNote: string;
  isFavorite: boolean;
};

/** 場面フォームの項目名。 */
export type MomentFormFieldName = keyof MomentFormValues;

/** 項目ごとに表示する Validation エラー。 */
export type MomentFormFieldErrors = Partial<Record<MomentFormFieldName, string[]>>;

/** 登録・編集フォームで保持する Server Action の結果。 */
export type MomentFormState = {
  status: 'idle' | 'error';
  /** フォーム全体へ表示する業務条件または DB 更新時のエラー。 */
  message: string | null;
  /** 入力項目の近くへ表示する Validation エラー。 */
  fieldErrors: MomentFormFieldErrors;
  /** エラー後にフォームへ戻す入力値。 */
  values: MomentFormValues;
  /** エラー後に非制御フォームを再生成し、返却された値を反映するための番号。 */
  revision: number;
};

/** `useActionState` から呼び出す登録・編集用 Server Action。 */
export type MomentFormAction = (
  previousState: MomentFormState,
  formData: FormData,
) => Promise<MomentFormState>;

/** 場面削除操作で保持する Server Action の結果。 */
export type MomentDeleteState = {
  status: 'idle' | 'error';
  message: string | null;
};

/** ID を束縛した場面削除用 Server Action。 */
export type MomentDeleteAction = (
  previousState: MomentDeleteState,
  formData: FormData,
) => Promise<MomentDeleteState>;

/** お気に入り切り替え操作で保持する Server Action の結果。 */
export type MomentFavoriteState = {
  status: 'idle' | 'error';
  message: string | null;
};

/** ID を束縛したお気に入り切り替え用 Server Action。 */
export type MomentFavoriteAction = (
  previousState: MomentFavoriteState,
  formData: FormData,
) => Promise<MomentFavoriteState>;

/** 一覧項目ごとに場面 ID を束縛する前のお気に入り Server Action。 */
export type MomentFavoriteActionWithId = (
  momentId: number,
  previousState: MomentFavoriteState,
  formData: FormData,
) => Promise<MomentFavoriteState>;
