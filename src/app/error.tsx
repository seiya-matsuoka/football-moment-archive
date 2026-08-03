'use client';

/**
 * DB 接続失敗など、Route 内で発生した予期しないエラーを扱う共通 Error Boundary。
 */

import { useEffect } from 'react';

import { Button } from '@/components/common/button';
import { LinkButton } from '@/components/common/link-button';
import { PageHeader } from '@/components/common/page-header';
import { Panel } from '@/components/common/panel';

type ErrorPageProps = {
  /** Next.js から渡される予期しないエラー。利用者向け画面には詳細を表示しない。 */
  error: Error & { digest?: string };
  /** 現在の Route Segment を再描画し、処理を再試行する関数。 */
  reset: () => void;
};

/** 内部情報を表示せず、再試行と主要画面への移動手段を案内する。 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // 外部監視サービスは使用せず、開発中はブラウザのコンソールで原因を確認する。
    console.error(error);
  }, [error]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        eyebrow="Error"
        title="処理を完了できませんでした"
        description="一時的な問題が発生した可能性があります。再試行するか、別の画面から操作をやり直してください。"
      />

      <Panel tone="error">
        <div role="alert">
          <p className="text-sm leading-6">
            問題が続く場合は、時間を置いてから再度お試しください。
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button type="button" variant="primary" onClick={reset}>
              再試行
            </Button>
            <LinkButton href="/">ホームへ戻る</LinkButton>
            <LinkButton href="/matches">試合一覧へ移動</LinkButton>
            <LinkButton href="/moments">場面一覧へ移動</LinkButton>
          </div>
        </div>
      </Panel>
    </div>
  );
}
