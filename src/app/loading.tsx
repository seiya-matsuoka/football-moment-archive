/**
 * ホーム画面のデータ取得中に表示する Route Loading。
 */

import { PageLoading } from '@/components/common/page-loading';

/** ホームの対象範囲、登録状況、最近の場面に対応するプレースホルダーを表示する。 */
export default function Loading() {
  return <PageLoading variant="home" />;
}
