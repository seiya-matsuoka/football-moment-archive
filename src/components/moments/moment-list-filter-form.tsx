/**
 * 場面一覧の検索・絞り込み・並び替えを URL へ反映する GET フォーム。
 */

import { Button } from '@/components/common/button';
import { filterControlClassName } from '@/components/common/form-ui';
import { LinkButton } from '@/components/common/link-button';
import { SectionHeader } from '@/components/common/section-header';
import { MOMENT_SORT_OPTIONS, MOMENT_TYPE_OPTIONS, TEAM_OPTIONS } from '@/lib/constants';
import type { MomentListQuery } from '@/types/moment';

type MomentListFilterFormProps = {
  /** URL 検索パラメーターから正規化した現在の一覧条件。 */
  query: MomentListQuery;
};

const filterLabelClassName = 'text-muted text-xs font-semibold tracking-wide';

/** 条件適用時に `page` を送信せず、常に 1 ページ目から検索する。 */
export function MomentListFilterForm({ query }: MomentListFilterFormProps) {
  return (
    <section
      aria-labelledby="moment-filter-title"
      className="border-border/55 bg-surface-muted rounded-panel border p-4 sm:p-5"
    >
      <SectionHeader
        eyebrow="Filter"
        title="場面を絞り込む"
        titleId="moment-filter-title"
        description="検索・絞り込み・並び替え条件は URL に保持されます。"
        size="compact"
      />

      <form action="/moments" method="get" className="mt-5">
        <fieldset className="min-w-0 border-0 p-0">
          <legend className="sr-only">場面一覧の検索・絞り込み・並び替え条件</legend>

          <div className="grid gap-3 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <label htmlFor="moment-list-keyword" className={filterLabelClassName}>
                キーワード
              </label>
              <input
                id="moment-list-keyword"
                name="keyword"
                type="search"
                defaultValue={query.keyword}
                className={filterControlClassName}
                placeholder="タイトル、対象、場面の内容、印象に残った理由"
              />
            </div>

            <div className="lg:col-span-2">
              <label htmlFor="moment-list-team" className={filterLabelClassName}>
                チーム
              </label>
              <select
                id="moment-list-team"
                name="team"
                defaultValue={query.team ?? ''}
                className={filterControlClassName}
              >
                <option value="">指定なし</option>
                {TEAM_OPTIONS.map((team) => (
                  <option key={team.code} value={team.code}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <label htmlFor="moment-list-type" className={filterLabelClassName}>
                場面の種類
              </label>
              <select
                id="moment-list-type"
                name="type"
                defaultValue={query.momentType ?? ''}
                className={filterControlClassName}
              >
                <option value="">指定なし</option>
                {MOMENT_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <label htmlFor="moment-list-sort" className={filterLabelClassName}>
                並び替え
              </label>
              <select
                id="moment-list-sort"
                name="sort"
                defaultValue={query.sort}
                className={filterControlClassName}
              >
                {MOMENT_SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-border/40 mt-4 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="text-text border-border/55 bg-surface rounded-control flex min-h-11 cursor-pointer items-center gap-3 border px-3 py-2 text-sm font-medium">
              <input
                name="favorite"
                type="checkbox"
                value="true"
                defaultChecked={query.favoriteOnly}
                className="border-border accent-favorite focus-visible:outline-focus h-5 w-5 rounded focus-visible:outline-2 focus-visible:outline-offset-2"
              />
              <span>
                <span aria-hidden="true" className="text-favorite mr-1.5">
                  ★
                </span>
                お気に入りだけ
              </span>
            </label>

            <div className="flex flex-wrap gap-2">
              <Button type="submit" variant="primary">
                条件を適用
              </Button>
              <LinkButton href="/moments">条件をリセット</LinkButton>
            </div>
          </div>
        </fieldset>
      </form>
    </section>
  );
}
