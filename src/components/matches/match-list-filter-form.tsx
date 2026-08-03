/**
 * 試合一覧のチーム絞り込みと並び替えを URL へ反映する GET フォーム。
 */

import { Button } from '@/components/common/button';
import { filterControlClassName } from '@/components/common/form-ui';
import { LinkButton } from '@/components/common/link-button';
import { SectionHeader } from '@/components/common/section-header';
import { MATCH_SORT_OPTIONS, TEAM_OPTIONS } from '@/lib/constants';
import type { MatchListQuery } from '@/types/match';

type MatchListFilterFormProps = {
  /** URL 検索パラメーターから正規化した現在の一覧条件。 */
  query: MatchListQuery;
};

const controlClassName = filterControlClassName;
const labelClassName = 'text-muted text-xs font-semibold tracking-wide';

/** 条件適用時はページ番号を送信せず、1 ページ目から表示する。 */
export function MatchListFilterForm({ query }: MatchListFilterFormProps) {
  return (
    <section
      aria-labelledby="match-filter-title"
      className="border-border/55 bg-surface-muted rounded-panel border p-4 sm:p-5"
    >
      <SectionHeader
        eyebrow="Filter"
        title="試合を絞り込む"
        titleId="match-filter-title"
        description="チームと並び順の条件は URL に保持されます。"
        size="compact"
      />

      <form action="/matches" method="get" className="mt-5">
        <fieldset className="min-w-0 border-0 p-0">
          <legend className="sr-only">試合一覧の絞り込み・並び替え条件</legend>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label htmlFor="match-list-team" className={labelClassName}>
                チーム
              </label>
              <select
                id="match-list-team"
                name="team"
                defaultValue={query.team ?? ''}
                className={controlClassName}
              >
                <option value="">指定なし</option>
                {TEAM_OPTIONS.map((team) => (
                  <option key={team.code} value={team.code}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="match-list-sort" className={labelClassName}>
                並び替え
              </label>
              <select
                id="match-list-sort"
                name="sort"
                defaultValue={query.sort}
                className={controlClassName}
              >
                {MATCH_SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-border/40 mt-4 flex flex-wrap justify-end gap-2 border-t pt-4">
            <Button type="submit" variant="primary">
              条件を適用
            </Button>
            <LinkButton href="/matches">条件をリセット</LinkButton>
          </div>
        </fieldset>
      </form>
    </section>
  );
}
