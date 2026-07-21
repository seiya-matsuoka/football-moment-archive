/**
 * 場面一覧の基本画面。
 */

import type { Metadata } from 'next';

import { PageHeader } from '@/components/common/page-header';
import { Panel } from '@/components/common/panel';

/** ブラウザのタイトルへ場面一覧であることを表示する。 */
export const metadata: Metadata = {
  title: '場面一覧',
};

/** 場面一覧の基本画面。 */
export default function MomentsPage() {
  return (
    <div className="space-y-section">
      <PageHeader title="場面一覧" description="試合の中で記録した場面を確認する。" />

      <Panel tone="muted">
        <p className="text-muted text-sm leading-6">場面一覧の表示機能。</p>
      </Panel>
    </div>
  );
}
