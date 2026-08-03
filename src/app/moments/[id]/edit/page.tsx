/**
 * 登録済みの場面情報を編集する Server Component。
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PageHeader } from '@/components/common/page-header';
import { MomentForm } from '@/components/moments/moment-form';
import { parsePositiveIntegerId } from '@/lib/validation/id';
import { createMomentFormValues } from '@/lib/validation/moments';
import { getMatchesForSelection } from '@/server/data-access/matches';
import { getMomentById } from '@/server/data-access/moments';

import { updateMomentAction } from '../../actions';

/** Next.js 16 では動的 Route のパラメーターを Promise として受け取る。 */
type EditMomentPageProps = { params: Promise<{ id: string }> };

/** DB の最新状態をリクエストごとに取得し、Build 時の DB 接続を避ける。 */
export const dynamic = 'force-dynamic';

/** ブラウザのタイトルへ場面編集であることを表示する。 */
export const metadata: Metadata = { title: '場面編集' };

/** 現在値と試合選択肢を取得して編集フォームへ渡す。 */
export default async function EditMomentPage({ params }: EditMomentPageProps) {
  const momentId = parsePositiveIntegerId((await params).id);
  if (momentId === null) notFound();

  const [moment, matches] = await Promise.all([getMomentById(momentId), getMatchesForSelection()]);
  if (moment === null) notFound();

  const updateActionWithId = updateMomentAction.bind(null, moment.id);
  const momentDetailHref = `/moments/${moment.id}`;

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        eyebrow="Edit Moment"
        title="場面編集"
        description="登録済みの場面情報を編集します。"
        backLink={{ href: momentDetailHref, label: '場面詳細へ戻る' }}
      />

      <MomentForm
        action={updateActionWithId}
        initialValues={createMomentFormValues(moment)}
        matches={matches}
        submitLabel="変更を保存"
        pendingLabel="保存中"
        cancelHref={momentDetailHref}
      />
    </div>
  );
}
