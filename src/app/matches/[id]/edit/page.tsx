/**
 * 登録済みの試合情報を編集する Server Component。
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { LinkButton } from '@/components/common/link-button';
import { PageHeader } from '@/components/common/page-header';
import { MatchForm } from '@/components/matches/match-form';
import { formatFixture } from '@/lib/format';
import { parsePositiveIntegerId } from '@/lib/validation/id';
import { createMatchFormValues } from '@/lib/validation/matches';
import { getMatchById } from '@/server/data-access/matches';

import { updateMatchAction } from '../../actions';

type EditMatchPageProps = {
  /** Next.js 16 では動的 Route のパラメーターを Promise として受け取る。 */
  params: Promise<{ id: string }>;
};

/** DB の最新状態をリクエストごとに取得し、Build 時の DB 接続を避ける。 */
export const dynamic = 'force-dynamic';

/** ブラウザのタイトルへ試合編集であることを表示する。 */
export const metadata: Metadata = {
  title: '試合編集',
};

/** 現在値を取得して編集フォームへ渡し、存在しない場合は試合用の 404 を表示する。 */
export default async function EditMatchPage({ params }: EditMatchPageProps) {
  const { id: idParam } = await params;
  const matchId = parsePositiveIntegerId(idParam);

  if (matchId === null) {
    notFound();
  }

  const match = await getMatchById(matchId);

  if (match === null) {
    notFound();
  }

  const fixture = formatFixture(match.homeTeamCode, match.awayTeamCode);
  const updateActionWithId = updateMatchAction.bind(null, match.id);

  return (
    <div className="space-y-section">
      <PageHeader
        title="試合編集"
        description={`${fixture} の試合情報を編集します。`}
        actions={<LinkButton href={`/matches/${match.id}`}>試合詳細へ戻る</LinkButton>}
      />

      <MatchForm
        action={updateActionWithId}
        initialValues={createMatchFormValues(match)}
        submitLabel="変更を保存"
        pendingLabel="保存中"
        cancelHref={`/matches/${match.id}`}
      />
    </div>
  );
}
