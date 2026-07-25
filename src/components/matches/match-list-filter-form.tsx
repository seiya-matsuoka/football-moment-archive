/**
 * 試合一覧のチーム絞り込みと並び替えを URL へ反映する GET フォーム。
 */

import { Button } from '@/components/common/button';
import { LinkButton } from '@/components/common/link-button';
import { Panel } from '@/components/common/panel';
import { MATCH_SORT_OPTIONS, TEAM_OPTIONS } from '@/lib/constants';
import type { MatchListQuery } from '@/types/match';

type MatchListFilterFormProps = {
  /** URL 検索パラメーターから正規化した現在の一覧条件。 */
  query: MatchListQuery;
};

/** 検索フォームの入力要素へ共通して適用するスタイル。 */
const formControlClassName =
  'mt-2 min-h-11 w-full rounded-control border border-border bg-surface px-3 py-2 text-base text-text focus:outline-2 focus:outline-offset-2 focus:outline-focus';

/**
 * `page` を送信項目に含めず、条件を適用したときは必ず 1 ページ目へ戻す。
 */
export function MatchListFilterForm({ query }: MatchListFilterFormProps) {
  return (
    <Panel>
      <form action="/matches" method="get">
        <fieldset className="min-w-0 border-0 p-0">
          <legend className="text-text text-base font-semibold">一覧条件</legend>

          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="match-list-team" className="text-text text-sm font-medium">
                チーム
              </label>
              <select
                id="match-list-team"
                name="team"
                defaultValue={query.team ?? ''}
                className={formControlClassName}
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
              <label htmlFor="match-list-sort" className="text-text text-sm font-medium">
                並び替え
              </label>
              <select
                id="match-list-sort"
                name="sort"
                defaultValue={query.sort}
                className={formControlClassName}
              >
                {MATCH_SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button type="submit" variant="primary">
              条件を適用
            </Button>
            <LinkButton href="/matches">条件をリセット</LinkButton>
          </div>
        </fieldset>
      </form>
    </Panel>
  );
}
