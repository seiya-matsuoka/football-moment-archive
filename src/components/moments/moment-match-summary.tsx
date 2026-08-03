/**
 * 場面一覧と場面詳細で共有する、関連試合の概要表示。
 */

import Link from 'next/link';

import { MatchScoreboard } from '@/components/common/match-scoreboard';
import { formatMatchDate } from '@/lib/format';
import type { MomentMatch } from '@/types/moment';

type MomentMatchSummaryProps = {
  /** 場面に関連付けられている試合。 */
  match: MomentMatch;
  /** 一覧 Card と詳細 Card で切り替える情報密度。 */
  density?: 'compact' | 'detail';
};

/** 共通 Scoreboard と試合日・詳細導線を表示する。 */
export function MomentMatchSummary({ match, density = 'compact' }: MomentMatchSummaryProps) {
  return (
    <div className="border-border/45 border-t pt-4">
      {density === 'compact' ? (
        <p className="text-accent/90 mb-3 text-[0.68rem] font-bold tracking-[0.16em] uppercase">
          Match
        </p>
      ) : null}

      <MatchScoreboard
        homeTeamCode={match.homeTeamCode}
        awayTeamCode={match.awayTeamCode}
        homeScore={match.homeScore}
        awayScore={match.awayScore}
        density={density}
      />

      <div className="border-border/45 mt-4 flex items-end justify-between gap-4 border-t pt-4">
        <dl className="min-w-0">
          <div>
            <dt className="text-muted text-xs font-medium">試合日</dt>
            <dd className="text-text mt-1.5 text-sm tabular-nums">
              {formatMatchDate(match.matchDate)}
            </dd>
          </div>
        </dl>

        <Link
          href={`/matches/${match.id}`}
          className="text-accent hover:text-text focus-visible:outline-focus rounded-control inline-flex min-h-10 shrink-0 items-center text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          試合詳細を見る
          <span aria-hidden="true" className="ml-1.5">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
