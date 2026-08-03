/**
 * 不正な ID または存在しない場面が指定された場合に表示する 404 画面。
 */

import { EmptyState } from '@/components/common/empty-state';
import { LinkButton } from '@/components/common/link-button';
import { PageHeader } from '@/components/common/page-header';

/** 場面を表示できないことと、場面一覧へ戻る導線を表示する。 */
export default function MomentNotFound() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        eyebrow="Not Found"
        title="場面が見つかりません"
        description="指定された場面は存在しないか、すでに削除されています。"
      />
      <EmptyState
        title="場面を表示できません"
        message="場面一覧から、現在登録されている場面を確認してください。"
        actions={
          <LinkButton href="/moments" variant="primary">
            場面一覧へ戻る
          </LinkButton>
        }
      />
    </div>
  );
}
