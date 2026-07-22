/**
 * 不正な ID または存在しない試合が指定された場合に表示する 404 画面。
 */

import { LinkButton } from '@/components/common/link-button';
import { PageHeader } from '@/components/common/page-header';
import { Panel } from '@/components/common/panel';

/** 試合を表示できないことと、試合一覧へ戻る導線を表示する。 */
export default function MatchNotFound() {
  return (
    <div className="space-y-section">
      <PageHeader
        title="試合が見つかりません"
        description="指定された試合は存在しないか、すでに削除されています。"
      />

      <Panel tone="muted">
        <LinkButton href="/matches">試合一覧へ戻る</LinkButton>
      </Panel>
    </div>
  );
}
