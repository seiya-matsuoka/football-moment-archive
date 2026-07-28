/**
 * 未定義の URL など、アプリ全体で使用する汎用 404 画面。
 */

import { LinkButton } from '@/components/common/link-button';
import { PageHeader } from '@/components/common/page-header';
import { Panel } from '@/components/common/panel';

/** ページを表示できないことと、主要画面へ戻る導線を表示する。 */
export default function NotFound() {
  return (
    <div className="space-y-section">
      <PageHeader
        title="ページが見つかりません"
        description="指定されたページやデータは存在しないか、他の操作によって削除された可能性があります。"
      />

      <Panel tone="muted">
        <p className="text-muted text-sm leading-6">
          URL を確認するか、次の主要画面から目的のデータを探してください。
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <LinkButton href="/" variant="primary">
            ホームへ戻る
          </LinkButton>
          <LinkButton href="/matches">試合一覧へ移動</LinkButton>
          <LinkButton href="/moments">場面一覧へ移動</LinkButton>
        </div>
      </Panel>
    </div>
  );
}
