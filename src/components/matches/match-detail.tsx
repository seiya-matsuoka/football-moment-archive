/**
 * 試合詳細画面の基本情報を表示するコンポーネント。
 */

import { Panel } from '@/components/common/panel';
import {
  formatDateTime,
  formatFixture,
  formatMatchDate,
  formatScore,
  getTeamName,
} from '@/lib/format';
import type { MatchWithMomentCount } from '@/types/match';

type MatchDetailProps = {
  /** 詳細表示する試合。 */
  match: MatchWithMomentCount;
};

/** 対戦チーム、スコア、試合日、場面数、管理情報をまとめて表示する。 */
export function MatchDetail({ match }: MatchDetailProps) {
  return (
    <Panel>
      {/* ホーム、スコア、アウェーを対になる配置で表示する。 */}
      <div className="grid gap-5 text-center sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div>
          <p className="text-muted text-sm font-medium">ホーム</p>
          <p className="text-text mt-1 text-xl font-semibold">{getTeamName(match.homeTeamCode)}</p>
        </div>

        <div>
          <p className="text-muted text-sm font-medium">スコア</p>
          <p className="text-text mt-1 text-2xl font-bold">
            {formatScore(match.homeScore, match.awayScore)}
          </p>
        </div>

        <div>
          <p className="text-muted text-sm font-medium">アウェー</p>
          <p className="text-text mt-1 text-xl font-semibold">{getTeamName(match.awayTeamCode)}</p>
        </div>
      </div>

      {/* 対戦情報と管理情報は、主表示より優先度を下げて一覧化する。 */}
      <dl className="mt-section border-border pt-section grid gap-4 border-t sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <dt className="text-muted text-sm font-medium">対戦カード</dt>
          <dd className="text-text mt-1 text-sm">
            {formatFixture(match.homeTeamCode, match.awayTeamCode)}
          </dd>
        </div>

        <div>
          <dt className="text-muted text-sm font-medium">試合日</dt>
          <dd className="text-text mt-1 text-sm">{formatMatchDate(match.matchDate)}</dd>
        </div>

        <div>
          <dt className="text-muted text-sm font-medium">場面数</dt>
          <dd className="text-text mt-1 text-sm">{match.momentCount} 件</dd>
        </div>

        <div>
          <dt className="text-muted text-sm font-medium">試合 ID</dt>
          <dd className="text-text mt-1 text-sm">{match.id}</dd>
        </div>

        <div>
          <dt className="text-muted text-sm font-medium">登録日時</dt>
          <dd className="text-text mt-1 text-sm">{formatDateTime(match.createdAt)}</dd>
        </div>

        <div>
          <dt className="text-muted text-sm font-medium">更新日時</dt>
          <dd className="text-text mt-1 text-sm">{formatDateTime(match.updatedAt)}</dd>
        </div>
      </dl>
    </Panel>
  );
}
