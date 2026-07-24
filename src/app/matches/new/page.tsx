/**
 * 新しい試合を登録する Server Component。
 */

import type { Metadata } from 'next';

import { LinkButton } from '@/components/common/link-button';
import { PageHeader } from '@/components/common/page-header';
import { Panel } from '@/components/common/panel';
import { MatchForm } from '@/components/matches/match-form';
import { DATA_LIMITS } from '@/lib/constants';
import { createMatchFormValues } from '@/lib/validation/matches';
import { getMatchCount } from '@/server/data-access/matches';

import { createMatchAction } from '../actions';

/** 登録上限をリクエストごとに確認し、Build 時の DB 接続を避ける。 */
export const dynamic = 'force-dynamic';

/** ブラウザのタイトルへ試合登録であることを表示する。 */
export const metadata: Metadata = {
  title: '試合登録',
};

/** 試合登録フォーム、または登録上限到達の案内を表示する。 */
export default async function NewMatchPage() {
  const matchCount = await getMatchCount();
  const hasReachedLimit = matchCount >= DATA_LIMITS.matches;

  return (
    <div className="space-y-section">
      <PageHeader
        title="試合登録"
        description="場面を記録する対象となる試合を登録します。"
        actions={<LinkButton href="/matches">試合一覧へ戻る</LinkButton>}
      />

      {hasReachedLimit ? (
        <Panel tone="error">
          <p className="text-sm leading-6">
            試合は最大 {DATA_LIMITS.matches}{' '}
            件まで登録できます。既存の試合を削除してから再度お試しください。
          </p>
        </Panel>
      ) : (
        <MatchForm
          action={createMatchAction}
          initialValues={createMatchFormValues()}
          submitLabel="試合を登録"
          pendingLabel="登録中"
          cancelHref="/matches"
        />
      )}
    </div>
  );
}
