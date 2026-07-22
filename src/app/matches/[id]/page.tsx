/**
 * 指定された試合と、その試合に関連する場面を表示する Server Component。
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { LinkButton } from '@/components/common/link-button';
import { PageHeader } from '@/components/common/page-header';
import { MatchDetail } from '@/components/matches/match-detail';
import { MatchMomentList } from '@/components/matches/match-moment-list';
import { formatFixture } from '@/lib/format';
import { getMatchById } from '@/server/data-access/matches';
import { getMomentsByMatchId } from '@/server/data-access/moments';

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

/** URL の ID を、DB 検索に使用できる正の安全な整数へ変換する。 */
function parseMatchId(value: string): number | null {
  // 符号、小数、指数表記、前後の空白を許可せず、URL として明確な整数形式だけを受け付ける。
  if (!/^[1-9]\d*$/.test(value)) {
    return null;
  }

  const id = Number(value);

  return Number.isSafeInteger(id) ? id : null;
}

/** 試合情報と関連する場面を取得し、存在しない場合は試合用の 404 を表示する。 */
export default async function MatchDetailPage({ params }: MatchDetailPageProps) {
  const { id: idParam } = await params;
  const matchId = parseMatchId(idParam);

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

  return (
    <div className="space-y-section">
      <PageHeader
        title={fixture}
        description="試合情報と、この試合に関連する場面を表示します。"
        actions={<LinkButton href="/matches">試合一覧へ戻る</LinkButton>}
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
    </div>
  );
}
