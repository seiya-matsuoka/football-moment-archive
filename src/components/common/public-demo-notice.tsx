/**
 * 認証のない公開デモであることを全画面へ案内する共通コンポーネント。
 */

import { PageContainer } from './page-container';

/** 共有データの編集可否と、入力時の注意事項を表示する。 */
export function PublicDemoNotice() {
  return (
    <aside
      aria-labelledby="public-demo-notice-title"
      className="border-notice-border bg-notice-background text-notice-text border-t"
    >
      <PageContainer className="py-5">
        <h2 id="public-demo-notice-title" className="text-sm font-semibold">
          公開デモについて
        </h2>

        <p className="mt-1 text-sm leading-6">
          認証のない共有データを使用するため、誰でも登録・編集・削除できる。個人情報は入力せず、登録データが保持されない可能性があることを前提とする。
        </p>
      </PageContainer>
    </aside>
  );
}
