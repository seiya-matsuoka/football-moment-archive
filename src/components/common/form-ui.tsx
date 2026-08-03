/**
 * 試合・場面フォームで共有する見出し、Label、Control、操作領域の UI 定義。
 */

import type { ReactNode } from 'react';

import { Button } from './button';
import { LinkButton } from './link-button';
import { SectionHeader } from './section-header';

/** Input・Select・Textarea へ共通して適用する基本スタイル。 */
const formControlBaseClassName =
  'mt-2 min-h-11 w-full rounded-control border bg-surface-muted px-3 py-2 text-base text-text transition-colors hover:border-border-strong disabled:cursor-not-allowed disabled:opacity-60 focus:border-accent focus:outline-2 focus:outline-offset-2 focus:outline-focus';

/** 一覧条件の Input・Select に使用する密度を抑えた Control スタイル。 */
export const filterControlClassName =
  'mt-1.5 min-h-11 w-full rounded-control border border-border bg-surface px-3 py-2 text-sm text-text transition-colors hover:border-border-strong focus:border-accent focus:outline-2 focus:outline-offset-2 focus:outline-focus';

/** Validation 結果に応じて Form Control の枠線を切り替える。 */
export function getFormControlClassName(hasError: boolean, additionalClassName?: string): string {
  return [
    formControlBaseClassName,
    hasError ? 'border-error-border' : 'border-border',
    additionalClassName,
  ]
    .filter(Boolean)
    .join(' ');
}

/** Help と Validation エラーを Input の `aria-describedby` へ関連付ける。 */
export function getAriaDescribedBy(
  helpId: string | undefined,
  errorId: string,
  hasError: boolean,
): string | undefined {
  if (hasError && helpId) {
    return `${helpId} ${errorId}`;
  }

  if (hasError) {
    return errorId;
  }

  return helpId;
}

type FormSectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  titleId: string;
};

/** Form Surface 内で使用する Section 見出し。 */
export function FormSectionHeader(props: FormSectionHeaderProps) {
  return <SectionHeader {...props} />;
}

/** 必須項目であることを文字と色の両方で示す。 */
export function RequiredLabel() {
  return <span className="text-error ml-2 text-xs font-medium">必須</span>;
}

/** 任意項目であることを文字と色の両方で示す。 */
export function OptionalLabel({ note }: { note?: string }) {
  return <span className="text-subtle ml-2 text-xs font-medium">{note ?? '任意'}</span>;
}

type FormActionsProps = {
  submitLabel: string;
  pendingLabel: string;
  cancelHref: string;
  isPending: boolean;
};

/** Mobile では 2 列、PC では内容幅で右寄せする Form 操作領域。 */
export function FormActions({
  submitLabel,
  pendingLabel,
  cancelHref,
  isPending,
}: FormActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:flex sm:justify-end">
      <LinkButton href={cancelHref} className="w-full sm:w-auto">
        キャンセル
      </LinkButton>
      <Button type="submit" variant="primary" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? pendingLabel : submitLabel}
      </Button>
    </div>
  );
}

/** 認証のない公開デモへ入力する際の注意事項を Form 内で表示する。 */
export function FormDemoNotice() {
  return (
    <aside className="border-border/55 bg-surface-muted rounded-control border px-4 py-3">
      <p className="text-subtle text-[0.68rem] font-bold tracking-[0.16em] uppercase">
        Public Demo
      </p>
      <p className="text-muted mt-1.5 text-sm leading-6">
        このアプリは公開デモです。個人情報や公開に適さない内容は入力しないでください。
      </p>
    </aside>
  );
}

type FormSurfaceProps = {
  children: ReactNode;
};

/** Form Section を一つの Surface としてまとめる外枠。 */
export function FormSurface({ children }: FormSurfaceProps) {
  return (
    <div className="border-border bg-surface rounded-panel shadow-panel overflow-hidden border">
      {children}
    </div>
  );
}
