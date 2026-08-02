/**
 * 登録済みの試合情報を編集する Server Component。
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PageHeader } from '@/components/common/page-header';
import { MatchForm } from '@/components/matches/match-form';
import { parsePositiveIntegerId } from '@/lib/validation/id';
import { createMatchFormValues } from '@/lib/validation/matches';
import { getMatchById } from '@/server/data-access/matches';

import { updateMatchAction } from '../../actions';

/** Next.js 16 では動的 Route のパラメーターを Promise として受け取る。 */
type EditMatchPageProps = { params: Promise<{ id: string }> };

/** DB の最新状態をリクエストごとに取得し、Build 時の DB 接続を避ける。 */
export const dynamic = 'force-dynamic';

/** ブラウザのタイトルへ試合編集であることを表示する。 */
export const metadata: Metadata = { title: '試合編集' };

/** 現在値を取得して編集フォームへ渡し、存在しない場合は試合用の 404 を表示する。 */
export default async function EditMatchPage({ params }: EditMatchPageProps) {
  const matchId = parsePositiveIntegerId((await params).id);
  if (matchId === null) notFound();

  const match = await getMatchById(matchId);
  if (match === null) notFound();

  const updateActionWithId = updateMatchAction.bind(null, match.id);
  const matchDetailHref = `/matches/${match.id}`;

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        eyebrow="Edit Match"
        title="試合編集"
        description="登録済みの試合情報を編集します。"
        backLink={{ href: matchDetailHref, label: '試合詳細へ戻る' }}
      />

      <MatchForm
        action={updateActionWithId}
        initialValues={createMatchFormValues(match)}
        submitLabel="変更を保存"
        pendingLabel="保存中"
        cancelHref={matchDetailHref}
      />
    </div>
  );
}
