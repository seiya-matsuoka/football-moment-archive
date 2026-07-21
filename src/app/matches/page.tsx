/**
 * 試合一覧の基本画面。
 */

import type { Metadata } from 'next';

import { PageHeader } from '@/components/common/page-header';
import { Panel } from '@/components/common/panel';

/** ブラウザのタイトルへ試合一覧であることを表示する。 */
export const metadata: Metadata = {
  title: '試合一覧',
};

/** 試合一覧の基本画面。 */
export default function MatchesPage() {
  return (
    <div className="space-y-section">
      <PageHeader title="試合一覧" description="場面を記録する対象となる試合を確認する。" />

      <Panel tone="muted">
        <p className="text-muted text-sm leading-6">試合一覧の表示機能。</p>
      </Panel>
    </div>
  );
}
