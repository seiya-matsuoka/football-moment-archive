/**
 * 試合一覧で、試合 1 件分の情報を独立した Compact Card として表示するコンポーネント。
 */

import Link from 'next/link';

import { MatchScoreboard } from '@/components/common/match-scoreboard';
import { formatFixture, formatMatchDate } from '@/lib/format';
import type { MatchWithMomentCount } from '@/types/match';

type MatchListItemProps = {
  /** 一覧項目として表示する試合。 */
  match: MatchWithMomentCount;
};

/** Home / Score / Away、試合日、場面数、詳細導線を表示する。 */
export function MatchListItem({ match }: MatchListItemProps) {
  const fixture = formatFixture(match.homeTeamCode, match.awayTeamCode);

  return (
    <li className="border-border/65 bg-surface rounded-panel shadow-panel flex h-full min-w-0 flex-col border p-4 sm:p-5">
      <h2 className="sr-only">{fixture}</h2>
      <MatchScoreboard
        homeTeamCode={match.homeTeamCode}
        awayTeamCode={match.awayTeamCode}
        homeScore={match.homeScore}
        awayScore={match.awayScore}
        density="compact"
      />

      <div className="border-border/45 mt-5 flex items-end justify-between gap-4 border-t pt-4">
        <dl className="flex min-w-0 flex-wrap gap-x-5 gap-y-3">
          <div>
            <dt className="text-muted text-xs font-medium">試合日</dt>
            <dd className="text-text mt-1.5 text-sm tabular-nums">
              {formatMatchDate(match.matchDate)}
            </dd>
          </div>
          <div>
            <dt className="text-muted text-xs font-medium">関連する場面</dt>
            <dd className="text-text mt-1.5 text-sm tabular-nums">{match.momentCount} 件</dd>
          </div>
        </dl>

        <Link
          href={`/matches/${match.id}`}
          aria-label={`${fixture}の試合詳細を見る`}
          className="text-accent hover:text-text focus-visible:outline-focus rounded-control inline-flex min-h-10 shrink-0 items-center text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          試合詳細を見る
          <span aria-hidden="true" className="ml-1.5">
            →
          </span>
        </Link>
      </div>
    </li>
  );
}
