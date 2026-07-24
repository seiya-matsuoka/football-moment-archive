/**
 * 場面詳細画面で、場面の全情報を表示するコンポーネント。
 */

import { Panel } from '@/components/common/panel';
import { formatDateTime, getMomentTypeLabel } from '@/lib/format';
import type { Moment } from '@/types/moment';

type MomentDetailProps = {
  /** 詳細表示する場面。 */
  moment: Moment;
};

/** 場面の基本情報、任意の本文、管理情報を表示する。 */
export function MomentDetail({ moment }: MomentDetailProps) {
  return (
    <Panel>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-muted text-sm font-medium">場面の種類</p>
          <p className="text-text mt-1 text-lg font-semibold">
            {getMomentTypeLabel(moment.momentType)}
          </p>
        </div>

        <p className="text-muted shrink-0 text-sm font-medium">
          {moment.isFavorite ? 'お気に入り' : 'お気に入り未登録'}
        </p>
      </div>

      {/* 発生時間と対象は、どちらかに値がある場合だけ情報欄を作成する。 */}
      {moment.timeLabel || moment.subject ? (
        <dl className="mt-section border-border pt-section grid gap-4 border-t sm:grid-cols-2">
          {moment.timeLabel ? (
            <div>
              <dt className="text-muted text-sm font-medium">発生時間</dt>
              <dd className="text-text mt-1 text-sm">{moment.timeLabel}</dd>
            </div>
          ) : null}

          {moment.subject ? (
            <div>
              <dt className="text-muted text-sm font-medium">対象</dt>
              <dd className="text-text mt-1 text-sm">{moment.subject}</dd>
            </div>
          ) : null}
        </dl>
      ) : null}

      {/* 長文の任意項目は、値がある項目だけ見出しと本文を表示する。 */}
      {moment.description || moment.memoryNote ? (
        <div className="mt-section border-border pt-section gap-section grid border-t">
          {moment.description ? (
            <section aria-labelledby="moment-description-title">
              <h2 id="moment-description-title" className="text-text text-base font-semibold">
                何が起きたか
              </h2>
              <p className="text-text mt-3 text-sm leading-7 whitespace-pre-wrap">
                {moment.description}
              </p>
            </section>
          ) : null}

          {moment.memoryNote ? (
            <section aria-labelledby="moment-memory-note-title">
              <h2 id="moment-memory-note-title" className="text-text text-base font-semibold">
                なぜ印象に残ったか
              </h2>
              <p className="text-text mt-3 text-sm leading-7 whitespace-pre-wrap">
                {moment.memoryNote}
              </p>
            </section>
          ) : null}
        </div>
      ) : null}

      {/* DB 上の識別情報と更新状況は、本文より優先度を下げて表示する。 */}
      <dl className="mt-section border-border pt-section grid gap-4 border-t sm:grid-cols-3">
        <div>
          <dt className="text-muted text-sm font-medium">場面 ID</dt>
          <dd className="text-text mt-1 text-sm">{moment.id}</dd>
        </div>

        <div>
          <dt className="text-muted text-sm font-medium">登録日時</dt>
          <dd className="text-text mt-1 text-sm">{formatDateTime(moment.createdAt)}</dd>
        </div>

        <div>
          <dt className="text-muted text-sm font-medium">更新日時</dt>
          <dd className="text-text mt-1 text-sm">{formatDateTime(moment.updatedAt)}</dd>
        </div>
      </dl>
    </Panel>
  );
}
