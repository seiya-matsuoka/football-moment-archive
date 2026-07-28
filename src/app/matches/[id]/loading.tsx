/**
 * 試合詳細を中心とした動的 Route Segment の読み込み表示。
 */

import { PageLoading } from '@/components/common/page-loading';

/** 試合情報と関連場面に対応するプレースホルダーを表示する。 */
export default function Loading() {
  return <PageLoading variant="detail" />;
}
