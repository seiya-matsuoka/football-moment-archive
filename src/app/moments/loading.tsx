/**
 * 場面一覧を中心とした `moments` Route Segment の読み込み表示。
 */

import { PageLoading } from '@/components/common/page-loading';

/** 場面一覧の集計、条件フォーム、一覧に対応するプレースホルダーを表示する。 */
export default function Loading() {
  return <PageLoading variant="list" />;
}
