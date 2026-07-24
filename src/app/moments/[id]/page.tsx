/**
 * 指定された場面と、その場面に関連する試合を表示する Server Component。
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { LinkButton } from '@/components/common/link-button';
import { PageHeader } from '@/components/common/page-header';
import { Panel } from '@/components/common/panel';
import { MomentDetail } from '@/components/moments/moment-detail';
import { MomentMatchSummary } from '@/components/moments/moment-match-summary';
import { parsePositiveIntegerId } from '@/lib/validation/id';
import { getMomentById } from '@/server/data-access/moments';

type MomentDetailPageProps = {
  /** Next.js 16 では動的 Route のパラメーターを Promise として受け取る。 */
  params: Promise<{ id: string }>;
};

/** DB の最新状態をリクエストごとに取得し、Build 時の DB 接続を避ける。 */
export const dynamic = 'force-dynamic';

/** 動的なページタイトルは工程 9 で追加し、工程 6 では固定タイトルを使用する。 */
export const metadata: Metadata = {
  title: '場面詳細',
};

/** 場面と関連試合を取得し、存在しない場合は場面用の 404 を表示する。 */
export default async function MomentDetailPage({ params }: MomentDetailPageProps) {
  const { id: idParam } = await params;
  const momentId = parsePositiveIntegerId(idParam);

  if (momentId === null) {
    notFound();
  }

  const moment = await getMomentById(momentId);

  if (moment === null) {
    notFound();
  }

  return (
    <div className="space-y-section">
      <PageHeader
        title={moment.title}
        description="記録した場面の内容と、関連する試合を表示します。"
        actions={<LinkButton href="/moments">場面一覧へ戻る</LinkButton>}
      />

      <MomentDetail moment={moment} />

      <section aria-labelledby="related-match-title">
        <h2 id="related-match-title" className="text-text mb-4 text-xl font-semibold">
          関連する試合
        </h2>
        <Panel>
          <MomentMatchSummary match={moment.match} />
        </Panel>
      </section>
    </div>
  );
}
