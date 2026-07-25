/**
 * 登録済みの場面情報を編集する Server Component。
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { LinkButton } from '@/components/common/link-button';
import { PageHeader } from '@/components/common/page-header';
import { MomentForm } from '@/components/moments/moment-form';
import { parsePositiveIntegerId } from '@/lib/validation/id';
import { createMomentFormValues } from '@/lib/validation/moments';
import { getMatchList } from '@/server/data-access/matches';
import { getMomentById } from '@/server/data-access/moments';

import { updateMomentAction } from '../../actions';

type EditMomentPageProps = {
  /** Next.js 16 では動的 Route のパラメーターを Promise として受け取る。 */
  params: Promise<{ id: string }>;
};

/** DB の最新状態をリクエストごとに取得し、Build 時の DB 接続を避ける。 */
export const dynamic = 'force-dynamic';

/** ブラウザのタイトルへ場面編集であることを表示する。 */
export const metadata: Metadata = {
  title: '場面編集',
};

/** 現在値と試合選択肢を取得して編集フォームへ渡す。 */
export default async function EditMomentPage({ params }: EditMomentPageProps) {
  const { id: idParam } = await params;
  const momentId = parsePositiveIntegerId(idParam);

  if (momentId === null) {
    notFound();
  }

  const [moment, matches] = await Promise.all([getMomentById(momentId), getMatchList()]);

  if (moment === null) {
    notFound();
  }

  const updateActionWithId = updateMomentAction.bind(null, moment.id);

  return (
    <div className="space-y-section">
      <PageHeader
        title="場面編集"
        description={`「${moment.title}」の内容と関連する試合を編集します。`}
        actions={<LinkButton href={`/moments/${moment.id}`}>場面詳細へ戻る</LinkButton>}
      />

      <MomentForm
        action={updateActionWithId}
        initialValues={createMomentFormValues(moment)}
        matches={matches}
        submitLabel="変更を保存"
        pendingLabel="保存中"
        cancelHref={`/moments/${moment.id}`}
      />
    </div>
  );
}
