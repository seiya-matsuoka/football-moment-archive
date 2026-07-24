/**
 * 場面一覧と場面詳細で共有する、関連試合の概要表示。
 */

import { LinkButton } from '@/components/common/link-button';
import { formatFixture, formatMatchDate, formatScore } from '@/lib/format';
import type { MomentMatch } from '@/types/moment';

type MomentMatchSummaryProps = {
  /** 場面に関連付けられている試合。 */
  match: MomentMatch;
};

/** 対戦カード、試合日、スコアと試合詳細への導線を表示する。 */
export function MomentMatchSummary({ match }: MomentMatchSummaryProps) {
  return (
    <div>
      <dl className="grid gap-4 sm:grid-cols-3">
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
          <dt className="text-muted text-sm font-medium">スコア</dt>
          <dd className="text-text mt-1 text-sm">
            {formatScore(match.homeScore, match.awayScore)}
          </dd>
        </div>
      </dl>

      <div className="mt-4">
        <LinkButton href={`/matches/${match.id}`}>試合詳細を見る</LinkButton>
      </div>
    </div>
  );
}
