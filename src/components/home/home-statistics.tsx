/**
 * ホーム画面で、登録件数と主要画面への導線を Compact に表示するコンポーネント。
 */

import { Button } from '@/components/common/button';
import { LinkButton } from '@/components/common/link-button';
import { SectionHeader } from '@/components/common/section-header';
import { DATA_LIMITS } from '@/lib/constants';

type HomeStatisticsProps = {
  /** 登録済みの試合総数。 */
  matchCount: number;
  /** 登録済みの場面総数。 */
  momentCount: number;
  /** お気に入りとして登録されている場面総数。 */
  favoriteMomentCount: number;
};

/** 3 種類の登録状況を一つの Surface 内で比較できるように表示する。 */
export function HomeStatistics({
  matchCount,
  momentCount,
  favoriteMomentCount,
}: HomeStatisticsProps) {
  const hasReachedMatchLimit = matchCount >= DATA_LIMITS.matches;
  const hasReachedMomentLimit = momentCount >= DATA_LIMITS.moments;
  const canCreateMoment = matchCount > 0 && !hasReachedMomentLimit;

  return (
    <section
      aria-labelledby="registration-status-title"
      className="border-border bg-surface rounded-panel shadow-panel border p-5 sm:p-6"
    >
      <SectionHeader
        eyebrow="Status"
        title="登録状況"
        titleId="registration-status-title"
        description="試合・場面・お気に入りの登録状況と主要な操作を確認できます。"
      />

      <div className="border-border/55 mt-5 grid gap-0 border-t lg:grid-cols-3">
        <div className="py-5 lg:pr-5">
          <p className="text-muted text-sm font-medium">登録済み試合</p>
          <p className="text-text mt-2 text-3xl font-bold tabular-nums">{matchCount} 件</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <LinkButton href="/matches">一覧を見る</LinkButton>
            {hasReachedMatchLimit ? (
              <Button disabled>試合を登録</Button>
            ) : (
              <LinkButton href="/matches/new" variant="primary">
                試合を登録
              </LinkButton>
            )}
          </div>
          {hasReachedMatchLimit ? (
            <p className="text-muted mt-3 text-xs leading-5">
              最大 {DATA_LIMITS.matches} 件に到達しています。
            </p>
          ) : null}
        </div>

        <div className="border-border/55 border-t py-5 lg:border-t-0 lg:border-l lg:px-5">
          <p className="text-muted text-sm font-medium">登録済み場面</p>
          <p className="text-text mt-2 text-3xl font-bold tabular-nums">{momentCount} 件</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <LinkButton href="/moments">一覧を見る</LinkButton>
            {canCreateMoment ? (
              <LinkButton href="/moments/new" variant="primary">
                場面を登録
              </LinkButton>
            ) : (
              <Button disabled>場面を登録</Button>
            )}
          </div>
          {matchCount === 0 ? (
            <p className="text-muted mt-3 text-xs leading-5">
              場面を登録するには、先に試合を登録してください。
            </p>
          ) : hasReachedMomentLimit ? (
            <p className="text-muted mt-3 text-xs leading-5">
              最大 {DATA_LIMITS.moments} 件に到達しています。
            </p>
          ) : null}
        </div>

        <div className="border-border/55 border-t py-5 lg:border-t-0 lg:border-l lg:pl-5">
          <p className="text-favorite text-sm font-medium">お気に入り場面</p>
          <p className="text-text mt-2 text-3xl font-bold tabular-nums">{favoriteMomentCount} 件</p>
          <div className="mt-4">
            <LinkButton href="/moments?favorite=true">お気に入りを見る</LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
