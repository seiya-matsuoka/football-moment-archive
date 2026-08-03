/**
 * 新しい場面を登録する Server Component。
 */

import type { Metadata } from 'next';

import { EmptyState } from '@/components/common/empty-state';
import { LinkButton } from '@/components/common/link-button';
import { PageHeader } from '@/components/common/page-header';
import { Panel } from '@/components/common/panel';
import { MomentForm } from '@/components/moments/moment-form';
import { DATA_LIMITS } from '@/lib/constants';
import { parsePositiveIntegerId } from '@/lib/validation/id';
import { createMomentFormValues } from '@/lib/validation/moments';
import { getMatchesForSelection } from '@/server/data-access/matches';
import { getMomentCount } from '@/server/data-access/moments';

import { createMomentAction } from '../actions';

type NewMomentPageProps = {
  /** 試合詳細から指定される初期選択用の Query Parameter。 */
  searchParams: Promise<{ matchId?: string | string[] }>;
};

/** DB の最新状態と Query Parameter をリクエストごとに取得する。 */
export const dynamic = 'force-dynamic';

/** ブラウザのタイトルへ場面登録であることを表示する。 */
export const metadata: Metadata = { title: '場面登録' };

/** 場面登録フォーム、試合 0 件、登録上限到達のいずれかを表示する。 */
export default async function NewMomentPage({ searchParams }: NewMomentPageProps) {
  const [{ matchId: matchIdParam }, matches, momentCount] = await Promise.all([
    searchParams,
    getMatchesForSelection(),
    getMomentCount(),
  ]);

  const requestedMatchId =
    typeof matchIdParam === 'string' ? parsePositiveIntegerId(matchIdParam) : null;
  const initialMatch =
    requestedMatchId === null ? undefined : matches.find((match) => match.id === requestedMatchId);
  const cancelHref = initialMatch ? `/matches/${initialMatch.id}` : '/moments';
  const backLinkLabel = initialMatch ? '試合詳細へ戻る' : '場面一覧へ戻る';
  const hasReachedLimit = momentCount >= DATA_LIMITS.moments;

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        eyebrow="New Moment"
        title="場面登録"
        description="登録済みの試合に、記憶に残った場面を追加します。"
        backLink={{ href: cancelHref, label: backLinkLabel }}
      />

      {matches.length === 0 ? (
        <EmptyState
          title="関連する試合がありません"
          message="場面を登録するには、先に関連する試合を登録する必要があります。"
          actions={
            <LinkButton href="/matches/new" variant="primary">
              試合を登録
            </LinkButton>
          }
        />
      ) : hasReachedLimit ? (
        <Panel tone="error">
          <p className="text-sm leading-6">
            場面は最大 {DATA_LIMITS.moments}{' '}
            件まで登録できます。既存の場面を削除してから再度お試しください。
          </p>
        </Panel>
      ) : (
        <MomentForm
          action={createMomentAction}
          initialValues={createMomentFormValues(undefined, initialMatch?.id)}
          matches={matches}
          submitLabel="場面を登録"
          pendingLabel="登録中"
          cancelHref={cancelHref}
        />
      )}
    </div>
  );
}
