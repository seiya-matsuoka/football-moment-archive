/**
 * フォーム項目ごとの Validation エラーを表示する共通コンポーネント。
 */

type FieldErrorsProps = {
  /** 入力要素の `aria-describedby` から参照する ID。 */
  id: string;
  /** 対象項目へ表示するエラーメッセージ。 */
  errors?: readonly string[];
};

/** エラーが存在する場合だけ、色に依存しない文言付きで表示する。 */
export function FieldErrors({ id, errors }: FieldErrorsProps) {
  if (!errors || errors.length === 0) {
    return null;
  }

  return (
    <ul id={id} className="text-error mt-2 space-y-1 text-sm leading-6" aria-live="polite">
      {errors.map((error) => (
        <li key={error}>エラー：{error}</li>
      ))}
    </ul>
  );
}
