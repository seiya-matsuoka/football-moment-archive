/**
 * 未定義の URL など、アプリ全体で使用する汎用 404 画面。
 */

import { EmptyState } from '@/components/common/empty-state';
import { LinkButton } from '@/components/common/link-button';
import { PageHeader } from '@/components/common/page-header';

/** ページを表示できないことと、主要画面へ戻る導線を表示する。 */
export default function NotFound() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        eyebrow="Not Found"
        title="ページが見つかりません"
        description="指定されたページやデータは存在しないか、他の操作によって削除された可能性があります。"
      />

      <EmptyState
        eyebrow="404"
        title="目的のページを表示できません"
        message="URL を確認するか、次の主要画面から目的のデータを探してください。"
        actions={
          <>
            <LinkButton href="/" variant="primary">
              ホームへ戻る
            </LinkButton>
            <LinkButton href="/matches">試合一覧へ移動</LinkButton>
            <LinkButton href="/moments">場面一覧へ移動</LinkButton>
          </>
        }
      />
    </div>
  );
}
