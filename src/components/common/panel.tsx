/**
 * 情報を一つのまとまりとして表示する共通パネル。
 */

import type { ReactNode } from 'react';

/**
 * パネルの役割に応じて、背景と枠線の強弱を切り替える。
 * Tailwind CSS が検出できるよう、クラス名は完全な文字列で定義する。
 */
const panelToneClassNames = {
  default: 'border-border bg-surface',
  muted: 'border-border bg-surface-muted',
  accent: 'border-accent bg-surface',
  error: 'border-error-border bg-error-background text-error',
} as const;

type PanelTone = keyof typeof panelToneClassNames;

type PanelProps = {
  /** パネル内に表示する内容。 */
  children: ReactNode;
  /** 背景と枠線の強弱。 */
  tone?: PanelTone;
  /** 利用箇所固有のクラスを追加する場合に指定する。 */
  className?: string;
};

/**
 * 色や角丸などの具体値を各画面へ散らさず、共通トークンの組み合わせを適用する。
 */
export function Panel({ children, tone = 'default', className }: PanelProps) {
  const classes = [
    'rounded-panel border p-panel shadow-panel',
    panelToneClassNames[tone],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
}
