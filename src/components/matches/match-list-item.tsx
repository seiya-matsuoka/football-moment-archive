/**
 * 試合一覧で、試合 1 件分の情報を表示するコンポーネント。
 */

import Link from 'next/link';

import { Panel } from '@/components/common/panel';
import { formatFixture, formatMatchDate, formatScore } from '@/lib/format';
import type { MatchWithMomentCount } from '@/types/match';

type MatchListItemProps = {
  /** 一覧項目として表示する試合。 */
  match: MatchWithMomentCount;
};

/** 対戦カード、試合日、スコア、場面数と詳細画面への導線を表示する。 */
export function MatchListItem({ match }: MatchListItemProps) {
  const fixture = formatFixture(match.homeTeamCode, match.awayTeamCode);

  return (
    <li>
      <Panel>
        {/* 対戦カードを、試合詳細へ移動する主な導線として表示する。 */}
        <h2 className="text-text text-lg font-semibold">
          <Link
            href={`/matches/${match.id}`}
            className="rounded-control hover:text-muted focus-visible:outline-focus focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {fixture}
          </Link>
        </h2>

        {/* 一覧で比較する情報を、画面幅に応じて折り返して表示する。 */}
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-muted text-sm font-medium">試合日</dt>
            <dd className="text-text mt-1 text-sm">{formatMatchDate(match.matchDate)}</dd>
          </div>

          <div>
            <dt className="text-muted text-sm font-medium">スコア</dt>
            <dd className="text-text mt-1 text-sm">
              {formatScore(match.homeScore, match.awayScore)}
            </dd>
          </div>

          <div>
            <dt className="text-muted text-sm font-medium">場面数</dt>
            <dd className="text-text mt-1 text-sm">{match.momentCount} 件</dd>
          </div>
        </dl>
      </Panel>
    </li>
  );
}
