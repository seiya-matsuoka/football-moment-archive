/**
 * 場面一覧の検索・絞り込み・並び替えを URL へ反映する GET フォーム。
 */

import { Button } from '@/components/common/button';
import { LinkButton } from '@/components/common/link-button';
import { Panel } from '@/components/common/panel';
import { MOMENT_SORT_OPTIONS, MOMENT_TYPE_OPTIONS, TEAM_OPTIONS } from '@/lib/constants';
import type { MomentListQuery } from '@/types/moment';

type MomentListFilterFormProps = {
  /** URL 検索パラメーターから正規化した現在の一覧条件。 */
  query: MomentListQuery;
};

/** 検索フォームの入力要素へ共通して適用するスタイル。 */
const formControlClassName =
  'mt-2 min-h-11 w-full rounded-control border border-border bg-surface px-3 py-2 text-base text-text focus:outline-2 focus:outline-offset-2 focus:outline-focus';

/**
 * `page` を送信項目に含めず、条件を適用したときは必ず 1 ページ目へ戻す。
 */
export function MomentListFilterForm({ query }: MomentListFilterFormProps) {
  return (
    <Panel>
      <form action="/moments" method="get">
        <fieldset className="min-w-0 border-0 p-0">
          <legend className="text-text text-base font-semibold">一覧条件</legend>

          <div className="mt-4">
            <label htmlFor="moment-list-keyword" className="text-text text-sm font-medium">
              キーワード
            </label>
            <input
              id="moment-list-keyword"
              name="keyword"
              type="search"
              defaultValue={query.keyword}
              className={formControlClassName}
              placeholder="タイトル、対象、場面の内容、印象に残った理由"
            />
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            <div>
              <label htmlFor="moment-list-team" className="text-text text-sm font-medium">
                チーム
              </label>
              <select
                id="moment-list-team"
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
              <label htmlFor="moment-list-type" className="text-text text-sm font-medium">
                場面の種類
              </label>
              <select
                id="moment-list-type"
                name="type"
                defaultValue={query.momentType ?? ''}
                className={formControlClassName}
              >
                <option value="">指定なし</option>
                {MOMENT_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="moment-list-sort" className="text-text text-sm font-medium">
                並び替え
              </label>
              <select
                id="moment-list-sort"
                name="sort"
                defaultValue={query.sort}
                className={formControlClassName}
              >
                {MOMENT_SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label className="text-text mt-5 flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium">
            <input
              name="favorite"
              type="checkbox"
              value="true"
              defaultChecked={query.favoriteOnly}
              className="rounded-control border-border accent-accent focus-visible:outline-focus h-5 w-5 focus-visible:outline-2 focus-visible:outline-offset-2"
            />
            お気に入りの場面だけを表示する
          </label>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button type="submit" variant="primary">
              条件を適用
            </Button>
            <LinkButton href="/moments">条件をリセット</LinkButton>
          </div>
        </fieldset>
      </form>
    </Panel>
  );
}
