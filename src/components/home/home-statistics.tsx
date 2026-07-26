/**
 * ホーム画面で、登録件数と主要画面への導線を表示するコンポーネント。
 */

import { Button } from '@/components/common/button';
import { LinkButton } from '@/components/common/link-button';
import { Panel } from '@/components/common/panel';
import { DATA_LIMITS } from '@/lib/constants';

type HomeStatisticsProps = {
  /** 登録済みの試合総数。 */
  matchCount: number;
  /** 登録済みの場面総数。 */
  momentCount: number;
  /** お気に入りとして登録されている場面総数。 */
  favoriteMomentCount: number;
};

/**
 * 件数の意味に対応する一覧・登録導線をまとめ、登録上限や前提条件も案内する。
 */
export function HomeStatistics({
  matchCount,
  momentCount,
  favoriteMomentCount,
}: HomeStatisticsProps) {
  const hasReachedMatchLimit = matchCount >= DATA_LIMITS.matches;
  const hasReachedMomentLimit = momentCount >= DATA_LIMITS.moments;
  const canCreateMoment = matchCount > 0 && !hasReachedMomentLimit;

  return (
    <section aria-labelledby="registration-status-title">
      <h2 id="registration-status-title" className="text-text text-xl font-semibold">
        登録状況
      </h2>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel>
          <p className="text-muted text-sm font-medium">登録済み試合数</p>
          <p className="text-text mt-2 text-3xl font-bold">{matchCount} 件</p>

          <div className="mt-5 flex flex-wrap gap-3">
            <LinkButton href="/matches">試合一覧を見る</LinkButton>
            {hasReachedMatchLimit ? (
              <Button disabled>試合を登録</Button>
            ) : (
              <LinkButton href="/matches/new" variant="primary">
                試合を登録
              </LinkButton>
            )}
          </div>

          {hasReachedMatchLimit ? (
            <p className="text-muted mt-3 text-sm leading-5">
              最大 {DATA_LIMITS.matches} 件に到達しています。
            </p>
          ) : null}
        </Panel>

        <Panel>
          <p className="text-muted text-sm font-medium">登録済み場面数</p>
          <p className="text-text mt-2 text-3xl font-bold">{momentCount} 件</p>

          <div className="mt-5 flex flex-wrap gap-3">
            <LinkButton href="/moments">場面一覧を見る</LinkButton>
            {canCreateMoment ? (
              <LinkButton href="/moments/new" variant="primary">
                場面を登録
              </LinkButton>
            ) : (
              <Button disabled>場面を登録</Button>
            )}
          </div>

          {matchCount === 0 ? (
            <p className="text-muted mt-3 text-sm leading-5">
              場面を登録するには、先に試合を登録してください。
            </p>
          ) : hasReachedMomentLimit ? (
            <p className="text-muted mt-3 text-sm leading-5">
              最大 {DATA_LIMITS.moments} 件に到達しています。
            </p>
          ) : null}
        </Panel>

        <Panel>
          <p className="text-muted text-sm font-medium">お気に入り場面数</p>
          <p className="text-text mt-2 text-3xl font-bold">{favoriteMomentCount} 件</p>

          <div className="mt-5">
            <LinkButton href="/moments?favorite=true">お気に入りを見る</LinkButton>
          </div>
        </Panel>
      </div>
    </section>
  );
}
