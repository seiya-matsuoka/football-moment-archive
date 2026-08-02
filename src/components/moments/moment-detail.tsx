/**
 * 場面詳細画面で、対象、説明、印象、記録日時をまとめて表示するコンポーネント。
 */

import { formatDateTime } from '@/lib/format';
import type { Moment } from '@/types/moment';

type MomentDetailProps = {
  /** 詳細表示する場面。 */
  moment: Moment;
};

/** 場面の内容を、場面一覧と共通する Surface と Divider の表現で表示する。 */
export function MomentDetail({ moment }: MomentDetailProps) {
  return (
    <article className="border-border bg-surface rounded-panel shadow-panel border p-5 sm:p-7">
      <p className="text-accent text-[0.68rem] font-bold tracking-[0.18em] uppercase">
        Moment Detail
      </p>
      <h2 className="text-text mt-1 text-xl font-semibold">場面詳細</h2>

      <div className="border-border/55 mt-5 border-t">
        <section aria-labelledby="moment-subject-title" className="py-5 sm:py-6">
          <p className="text-subtle text-xs font-bold tracking-[0.14em] uppercase">Subject</p>
          <h3 id="moment-subject-title" className="text-text mt-1 text-lg font-semibold">
            対象
          </h3>
          <p className="text-text mt-3 text-base leading-7 wrap-break-word">
            {moment.subject ?? '未入力'}
          </p>
        </section>

        <section
          aria-labelledby="moment-description-title"
          className="border-border/45 border-t py-5 sm:py-6"
        >
          <p className="text-subtle text-xs font-bold tracking-[0.14em] uppercase">What Happened</p>
          <h3 id="moment-description-title" className="text-text mt-1 text-lg font-semibold">
            何が起きたか
          </h3>
          <p className="text-text mt-3 max-w-[70ch] text-base leading-8 wrap-break-word whitespace-pre-wrap">
            {moment.description ?? '未入力'}
          </p>
        </section>

        <section
          aria-labelledby="moment-memory-note-title"
          className="border-border/45 border-t py-5 sm:py-6"
        >
          <p className="text-subtle text-xs font-bold tracking-[0.14em] uppercase">Memory</p>
          <h3 id="moment-memory-note-title" className="text-text mt-1 text-lg font-semibold">
            なぜ印象に残ったか
          </h3>
          <p className="text-text mt-3 max-w-[70ch] text-base leading-8 wrap-break-word whitespace-pre-wrap">
            {moment.memoryNote ?? '未入力'}
          </p>
        </section>
      </div>

      <dl className="border-border/55 grid gap-4 border-t pt-5 text-sm sm:grid-cols-2 sm:gap-6">
        <div>
          <dt className="text-muted text-xs font-medium">登録日時</dt>
          <dd className="text-text mt-1.5 wrap-break-word">{formatDateTime(moment.createdAt)}</dd>
        </div>
        <div>
          <dt className="text-muted text-xs font-medium">更新日時</dt>
          <dd className="text-text mt-1.5 wrap-break-word">{formatDateTime(moment.updatedAt)}</dd>
        </div>
      </dl>
    </article>
  );
}
