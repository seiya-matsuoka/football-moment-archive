/**
 * 試合詳細画面の基本情報を表示するコンポーネント。
 */

import { MatchScoreboard } from '@/components/common/match-scoreboard';
import { SectionHeader } from '@/components/common/section-header';
import { formatDateTime, formatMatchDate } from '@/lib/format';
import type { MatchWithMomentCount } from '@/types/match';

type MatchDetailProps = {
  /** 詳細表示する試合。 */
  match: MatchWithMomentCount;
};

/** 共通 Scoreboard と試合日・場面数・登録日時を一つの Card にまとめて表示する。 */
export function MatchDetail({ match }: MatchDetailProps) {
  return (
    <article className="border-border bg-surface rounded-panel shadow-panel border p-5 sm:p-7">
      <SectionHeader eyebrow="Match Detail" title="試合詳細" />

      <div className="border-border/55 mt-5 border-t pt-5 sm:pt-6">
        <MatchScoreboard
          homeTeamCode={match.homeTeamCode}
          awayTeamCode={match.awayTeamCode}
          homeScore={match.homeScore}
          awayScore={match.awayScore}
        />
      </div>

      <dl className="border-border/55 mt-6 grid gap-4 border-t pt-5 text-sm sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        <div>
          <dt className="text-muted text-xs font-medium">試合日</dt>
          <dd className="text-text mt-1.5 wrap-break-word">{formatMatchDate(match.matchDate)}</dd>
        </div>
        <div>
          <dt className="text-muted text-xs font-medium">関連する場面</dt>
          <dd className="text-text mt-1.5">{match.momentCount} 件</dd>
        </div>
        <div>
          <dt className="text-muted text-xs font-medium">登録日時</dt>
          <dd className="text-text mt-1.5 wrap-break-word">{formatDateTime(match.createdAt)}</dd>
        </div>
        <div>
          <dt className="text-muted text-xs font-medium">更新日時</dt>
          <dd className="text-text mt-1.5 wrap-break-word">{formatDateTime(match.updatedAt)}</dd>
        </div>
      </dl>
    </article>
  );
}
