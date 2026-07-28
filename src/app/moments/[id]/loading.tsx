/**
 * 場面詳細を中心とした動的 Route Segment の読み込み表示。
 */

import { PageLoading } from '@/components/common/page-loading';

/** 場面情報と関連試合に対応するプレースホルダーを表示する。 */
export default function Loading() {
  return <PageLoading variant="detail" />;
}
