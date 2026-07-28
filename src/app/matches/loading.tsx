/**
 * 試合一覧を中心とした `matches` Route Segment の読み込み表示。
 */

import { PageLoading } from '@/components/common/page-loading';

/** 試合一覧の集計、条件フォーム、一覧に対応するプレースホルダーを表示する。 */
export default function Loading() {
  return <PageLoading variant="list" />;
}
