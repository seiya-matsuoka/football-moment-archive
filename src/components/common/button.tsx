/**
 * フォーム送信や削除などの操作に使用する共通ボタン。
 */

import type { ButtonHTMLAttributes } from 'react';

/** ボタンとボタン形式リンクで共有する見た目の種類。 */
export type ButtonVariant = 'primary' | 'secondary' | 'danger';

/** 操作要素へ共通して適用するレイアウトと操作状態。 */
const buttonBaseClassName =
  'inline-flex min-h-11 items-center justify-center rounded-control border px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';

/** 操作の目的に応じて切り替える色と枠線。 */
const buttonVariantClassNames: Record<ButtonVariant, string> = {
  primary: 'border-accent bg-accent text-accent-foreground hover:border-focus hover:bg-focus',
  secondary:
    'border-border bg-surface text-text hover:border-border-strong hover:bg-surface-raised',
  danger: 'border-danger bg-danger text-danger-foreground hover:border-error hover:bg-error-border',
};

/** ボタンとボタン形式リンクで使用するクラス名を作成する。 */
export function getButtonClassName(variant: ButtonVariant, className?: string): string {
  return [buttonBaseClassName, buttonVariantClassNames[variant], className]
    .filter(Boolean)
    .join(' ');
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** 操作の目的に応じた見た目。 */
  variant?: ButtonVariant;
};

/** 共通の操作状態と見た目を持つボタンを表示する。 */
export function Button({
  variant = 'secondary',
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return <button type={type} className={getButtonClassName(variant, className)} {...props} />;
}
