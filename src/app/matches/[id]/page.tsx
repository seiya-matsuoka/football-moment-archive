/**
 * 指定された試合と、その試合に関連する場面を表示する Server Component。
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Button } from '@/components/common/button';
import { LinkButton } from '@/components/common/link-button';
import { PageHeader } from '@/components/common/page-header';
import { MatchDeleteForm } from '@/components/matches/match-delete-form';
import { MatchDetail } from '@/components/matches/match-detail';
import { MatchMomentList } from '@/components/matches/match-moment-list';
import { DATA_LIMITS } from '@/lib/constants';
import { formatFixture } from '@/lib/format';
import { parsePositiveIntegerId } from '@/lib/validation/id';
import { getMatchById } from '@/server/data-access/matches';
import { getMomentCount, getMomentsByMatchId } from '@/server/data-access/moments';

import { deleteMatchAction } from '../actions';

type MatchDetailPageProps = {
  /** Next.js 16 では動的 Route のパラメーターを Promise として受け取る。 */
  params: Promise<{ id: string }>;
};

/** DB の最新状態をリクエストごとに取得し、Build 時の DB 接続を避ける。 */
export const dynamic = 'force-dynamic';

/** 対象試合の対戦カードを使用して動的なページタイトルを生成する。 */
export async function generateMetadata({ params }: MatchDetailPageProps): Promise<Metadata> {
  const { id: idParam } = await params;
  const matchId = parsePositiveIntegerId(idParam);

  if (matchId === null) {
    notFound();
  }

  const match = await getMatchById(matchId);

  if (match === null) {
    notFound();
  }

  return {
    title: formatFixture(match.homeTeamCode, match.awayTeamCode),
  };
}

/** 試合情報と関連する場面を取得し、存在しない場合は試合用の 404 を表示する。 */
export default async function MatchDetailPage({ params }: MatchDetailPageProps) {
  const { id: idParam } = await params;
  const matchId = parsePositiveIntegerId(idParam);

  if (matchId === null) {
    notFound();
  }

  const match = await getMatchById(matchId);

  if (match === null) {
    notFound();
  }

  // 試合の存在を確認してから、関連場面と全体の登録上限を並列で取得する。
  const [moments, momentCount] = await Promise.all([
    getMomentsByMatchId(match.id),
    getMomentCount(),
  ]);
  const fixture = formatFixture(match.homeTeamCode, match.awayTeamCode);
  const deleteActionWithId = deleteMatchAction.bind(null, match.id);
  const hasReachedMomentLimit = momentCount >= DATA_LIMITS.moments;

  return (
    <div className="space-y-section">
      <PageHeader
        title={fixture}
        description="試合情報と、この試合に関連する場面を表示します。"
        actions={
          <>
            <LinkButton href="/matches">試合一覧へ戻る</LinkButton>
            <LinkButton href={`/matches/${match.id}/edit`} variant="primary">
              試合を編集
            </LinkButton>
          </>
        }
      />

      <MatchDetail match={match} />

      <section aria-labelledby="related-moments-title">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="related-moments-title" className="text-text text-xl font-semibold">
              関連する場面
            </h2>
            <p className="text-muted mt-1 text-sm">登録日時の新しい順に表示しています。</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:justify-end">
            <p className="text-muted shrink-0 text-sm font-medium">{moments.length} 件</p>
            {hasReachedMomentLimit ? (
              <div className="max-w-xs text-right">
                <Button disabled>場面を登録</Button>
                <p className="text-muted mt-2 text-sm leading-5">
                  最大 {DATA_LIMITS.moments} 件に到達しています。
                </p>
              </div>
            ) : (
              <LinkButton href={`/moments/new?matchId=${match.id}`} variant="primary">
                この試合に場面を登録
              </LinkButton>
            )}
          </div>
        </div>

        <MatchMomentList moments={moments} />
      </section>

      <MatchDeleteForm action={deleteActionWithId} momentCount={match.momentCount} />
    </div>
  );
}
