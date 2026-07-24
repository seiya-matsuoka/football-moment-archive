/**
 * 不正な ID または存在しない場面が指定された場合に表示する 404 画面。
 */

import { LinkButton } from '@/components/common/link-button';
import { PageHeader } from '@/components/common/page-header';
import { Panel } from '@/components/common/panel';

/** 場面を表示できないことと、場面一覧へ戻る導線を表示する。 */
export default function MomentNotFound() {
  return (
    <div className="space-y-section">
      <PageHeader
        title="場面が見つかりません"
        description="指定された場面は存在しないか、すでに削除されています。"
      />

      <Panel tone="muted">
        <LinkButton href="/moments">場面一覧へ戻る</LinkButton>
      </Panel>
    </div>
  );
}
