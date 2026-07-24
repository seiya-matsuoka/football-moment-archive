/**
 * 指定された試合と、その試合に関連する場面を表示する Server Component。
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { LinkButton } from '@/components/common/link-button';
import { PageHeader } from '@/components/common/page-header';
import { MatchDeleteForm } from '@/components/matches/match-delete-form';
import { MatchDetail } from '@/components/matches/match-detail';
import { MatchMomentList } from '@/components/matches/match-moment-list';
import { formatFixture } from '@/lib/format';
import { parsePositiveIntegerId } from '@/lib/validation/id';
import { getMatchById } from '@/server/data-access/matches';
import { getMomentsByMatchId } from '@/server/data-access/moments';

import { deleteMatchAction } from '../actions';

type MatchDetailPageProps = {
  /** Next.js 16 では動的 Route のパラメーターを Promise として受け取る。 */
  params: Promise<{ id: string }>;
};

/** DB の最新状態をリクエストごとに取得し、Build 時の DB 接続を避ける。 */
export const dynamic = 'force-dynamic';

/** ブラウザのタイトルへ試合詳細であることを表示する。 */
export const metadata: Metadata = {
  title: '試合詳細',
};

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

  // 試合の存在を確認してから、moments の Data Access Layer で関連場面を取得する。
  const moments = await getMomentsByMatchId(match.id);
  const fixture = formatFixture(match.homeTeamCode, match.awayTeamCode);
  const deleteActionWithId = deleteMatchAction.bind(null, match.id);

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
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 id="related-moments-title" className="text-text text-xl font-semibold">
              関連する場面
            </h2>
            <p className="text-muted mt-1 text-sm">登録日時の新しい順に表示しています。</p>
          </div>

          <p className="text-muted shrink-0 text-sm font-medium">{moments.length} 件</p>
        </div>

        <MatchMomentList moments={moments} />
      </section>

      <MatchDeleteForm action={deleteActionWithId} momentCount={match.momentCount} />
    </div>
  );
}
