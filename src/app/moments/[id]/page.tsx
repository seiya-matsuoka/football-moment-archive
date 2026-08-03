/**
 * 指定された場面と、その場面に関連する試合を表示する Server Component。
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { LinkButton } from '@/components/common/link-button';
import { PageHeader } from '@/components/common/page-header';
import { SectionHeader } from '@/components/common/section-header';
import { FavoriteToggleForm } from '@/components/moments/favorite-toggle-form';
import { MomentDeleteForm } from '@/components/moments/moment-delete-form';
import { MomentDetail } from '@/components/moments/moment-detail';
import { MomentMatchSummary } from '@/components/moments/moment-match-summary';
import { getMomentTypeLabel } from '@/lib/format';
import { parsePositiveIntegerId } from '@/lib/validation/id';
import { getMomentById } from '@/server/data-access/moments';

import { deleteMomentAction, toggleMomentFavoriteAction } from '../actions';

type MomentDetailPageProps = {
  /** Next.js 16 では動的 Route のパラメーターを Promise として受け取る。 */
  params: Promise<{ id: string }>;
};

/** DB の最新状態をリクエストごとに取得し、Build 時の DB 接続を避ける。 */
export const dynamic = 'force-dynamic';

/** 対象場面のタイトルを使用して動的なページタイトルを生成する。 */
export async function generateMetadata({ params }: MomentDetailPageProps): Promise<Metadata> {
  const momentId = parsePositiveIntegerId((await params).id);
  if (momentId === null) notFound();
  const moment = await getMomentById(momentId);
  if (moment === null) notFound();
  return { title: moment.title };
}

/** 場面と関連試合を取得し、更新・削除・お気に入り操作とともに表示する。 */
export default async function MomentDetailPage({ params }: MomentDetailPageProps) {
  const momentId = parsePositiveIntegerId((await params).id);
  if (momentId === null) notFound();
  const moment = await getMomentById(momentId);
  if (moment === null) notFound();

  const favoriteActionWithId = toggleMomentFavoriteAction.bind(null, moment.id);
  const deleteActionWithId = deleteMomentAction.bind(null, moment.id);

  const headerMetadata = (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <span className="border-accent/45 bg-accent/10 text-accent inline-flex min-h-7 items-center rounded-full border px-2.5 py-1 text-xs font-bold tracking-wide">
        {getMomentTypeLabel(moment.momentType)}
      </span>
      {moment.timeLabel ? (
        <span className="text-muted text-xs font-medium tabular-nums">{moment.timeLabel}</span>
      ) : null}
      <span className="text-xs font-medium">
        <span className="text-muted">お気に入り：</span>
        <span className={moment.isFavorite ? 'text-favorite' : 'text-muted'}>
          {moment.isFavorite ? '登録済み' : '未登録'}
        </span>
      </span>
    </div>
  );

  const headerActions = (
    <>
      <FavoriteToggleForm action={favoriteActionWithId} isFavorite={moment.isFavorite} />
      <LinkButton href={`/moments/${moment.id}/edit`} variant="primary">
        場面を編集
      </LinkButton>
    </>
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        eyebrow="Moment"
        title={moment.title}
        metadata={headerMetadata}
        backLink={{ href: '/moments', label: '場面一覧へ戻る' }}
        actions={headerActions}
      />

      <div className="grid gap-5 sm:gap-6">
        <MomentDetail moment={moment} />

        <section
          aria-labelledby="related-match-title"
          className="border-border bg-surface rounded-panel shadow-panel border p-5 sm:p-6"
        >
          <SectionHeader eyebrow="Match" title="関連する試合" titleId="related-match-title" />
          <div className="mt-5">
            <MomentMatchSummary match={moment.match} density="detail" />
          </div>
        </section>

        <MomentDeleteForm action={deleteActionWithId} title={moment.title} />
      </div>
    </div>
  );
}
