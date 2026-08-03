/**
 * 不正な ID または存在しない試合が指定された場合に表示する 404 画面。
 */

import { EmptyState } from '@/components/common/empty-state';
import { LinkButton } from '@/components/common/link-button';
import { PageHeader } from '@/components/common/page-header';

/** 試合を表示できないことと、試合一覧へ戻る導線を表示する。 */
export default function MatchNotFound() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        eyebrow="Not Found"
        title="試合が見つかりません"
        description="指定された試合は存在しないか、すでに削除されています。"
      />
      <EmptyState
        title="試合を表示できません"
        message="試合一覧から、現在登録されている試合を確認してください。"
        actions={
          <LinkButton href="/matches" variant="primary">
            試合一覧へ戻る
          </LinkButton>
        }
      />
    </div>
  );
}
