/**
 * 指定された試合と、その試合に関連する場面を表示する Server Component。
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Button } from '@/components/common/button';
import { LinkButton } from '@/components/common/link-button';
import { PageHeader } from '@/components/common/page-header';
import { SectionHeader } from '@/components/common/section-header';
import { MatchDeleteForm } from '@/components/matches/match-delete-form';
import { MatchDetail } from '@/components/matches/match-detail';
import { MatchMomentList } from '@/components/matches/match-moment-list';
import { DATA_LIMITS } from '@/lib/constants';
import { formatFixture, formatMatchDate } from '@/lib/format';
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
  const matchId = parsePositiveIntegerId((await params).id);
  if (matchId === null) notFound();
  const match = await getMatchById(matchId);
  if (match === null) notFound();
  return { title: formatFixture(match.homeTeamCode, match.awayTeamCode) };
}

/** 試合情報と関連する場面を取得し、存在しない場合は試合用の 404 を表示する。 */
export default async function MatchDetailPage({ params }: MatchDetailPageProps) {
  const matchId = parsePositiveIntegerId((await params).id);
  if (matchId === null) notFound();
  const match = await getMatchById(matchId);
  if (match === null) notFound();

  // 試合の存在を確認してから、関連場面と全体の登録上限を並列で取得する。
  const [moments, momentCount] = await Promise.all([
    getMomentsByMatchId(match.id),
    getMomentCount(),
  ]);
  const fixture = formatFixture(match.homeTeamCode, match.awayTeamCode);
  const deleteActionWithId = deleteMatchAction.bind(null, match.id);
  const hasReachedMomentLimit = momentCount >= DATA_LIMITS.moments;

  const headerMetadata = (
    <dl className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
      <div className="flex items-baseline gap-1.5">
        <dt className="text-muted">試合日</dt>
        <dd className="text-text font-medium tabular-nums">{formatMatchDate(match.matchDate)}</dd>
      </div>
      <div className="border-border/50 flex items-baseline gap-1.5 sm:border-l sm:pl-4">
        <dt className="text-muted">関連する場面</dt>
        <dd className="text-text font-medium tabular-nums">{moments.length} 件</dd>
      </div>
    </dl>
  );

  const headerActions = (
    <LinkButton href={`/matches/${match.id}/edit`} variant="primary">
      試合を編集
    </LinkButton>
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        eyebrow="Match"
        title={fixture}
        metadata={headerMetadata}
        backLink={{ href: '/matches', label: '試合一覧へ戻る' }}
        actions={headerActions}
      />

      <MatchDetail match={match} />

      <section aria-labelledby="related-moments-title">
        <SectionHeader
          eyebrow="Moments"
          title="関連する場面"
          titleId="related-moments-title"
          description="登録日時の新しい順に表示しています。"
          aside={
            <div className="flex flex-wrap items-center justify-end gap-3">
              <p className="text-muted text-sm font-medium">{moments.length} 件</p>
              {hasReachedMomentLimit ? (
                <Button disabled>場面を登録</Button>
              ) : (
                <LinkButton href={`/moments/new?matchId=${match.id}`} variant="primary">
                  この試合に場面を登録
                </LinkButton>
              )}
            </div>
          }
        />
        <div className="mt-4">
          <MatchMomentList moments={moments} />
        </div>
        {hasReachedMomentLimit ? (
          <p className="text-muted mt-3 text-right text-xs leading-5">
            最大 {DATA_LIMITS.moments} 件に到達しています。
          </p>
        ) : null}
      </section>

      <MatchDeleteForm action={deleteActionWithId} momentCount={match.momentCount} />
    </div>
  );
}
