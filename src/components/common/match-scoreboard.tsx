/**
 * 試合一覧・試合詳細・場面詳細で共有する Home / Score / Away 表示。
 */

import { formatScore, getTeamName } from '@/lib/format';
import type { TeamCode } from '@/lib/constants';

type MatchScoreboardProps = {
  homeTeamCode: TeamCode;
  awayTeamCode: TeamCode;
  homeScore: number | null;
  awayScore: number | null;
  /** 表示箇所に応じた文字の強さ。 */
  density?: 'compact' | 'detail';
};

/** 同じ意味構造を維持し、表示場所に応じて文字サイズだけを調整する。 */
export function MatchScoreboard({
  homeTeamCode,
  awayTeamCode,
  homeScore,
  awayScore,
  density = 'detail',
}: MatchScoreboardProps) {
  const valueClassName = density === 'compact' ? 'text-base' : 'text-lg';
  const scoreClassName = density === 'compact' ? 'text-lg' : 'text-xl';

  return (
    <div className="grid gap-4 text-center sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-5">
      <div className="min-w-0">
        <p className="text-subtle text-xs font-bold tracking-[0.14em] uppercase">Home</p>
        <p className={`text-text mt-1 font-semibold wrap-break-word ${valueClassName}`}>
          {getTeamName(homeTeamCode)}
        </p>
      </div>

      <div className="shrink-0">
        <p className="text-subtle text-xs font-bold tracking-[0.14em] uppercase">Score</p>
        <p className={`text-text mt-1 font-bold tabular-nums ${scoreClassName}`}>
          {formatScore(homeScore, awayScore)}
        </p>
      </div>

      <div className="min-w-0">
        <p className="text-subtle text-xs font-bold tracking-[0.14em] uppercase">Away</p>
        <p className={`text-text mt-1 font-semibold wrap-break-word ${valueClassName}`}>
          {getTeamName(awayTeamCode)}
        </p>
      </div>
    </div>
  );
}
