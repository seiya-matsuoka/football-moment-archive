/**
 * 未定義の URL など、アプリ全体で使用する汎用 404 画面。
 */

import { LinkButton } from '@/components/common/link-button';
import { PageHeader } from '@/components/common/page-header';
import { Panel } from '@/components/common/panel';

/** ページを表示できないことと、ホームへ戻る導線を表示する。 */
export default function NotFound() {
  return (
    <div className="space-y-section">
      <PageHeader
        title="ページが見つかりません"
        description="指定された URL のページは存在しないか、移動または削除されています。"
      />

      <Panel tone="muted">
        <LinkButton href="/">ホームへ戻る</LinkButton>
      </Panel>
    </div>
  );
}
