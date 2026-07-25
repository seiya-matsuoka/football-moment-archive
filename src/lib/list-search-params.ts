/**
 * 試合一覧と場面一覧の URL 検索パラメーターを、安全な取得条件へ正規化する。
 */

import {
  DEFAULT_MATCH_SORT,
  DEFAULT_MOMENT_SORT,
  isMatchSort,
  isMomentSort,
  isMomentType,
  isTeamCode,
} from '@/lib/constants';
import type { MatchListQuery } from '@/types/match';
import type { MomentListQuery } from '@/types/moment';

/** Next.js の Page が受け取る検索パラメーターの共通形。 */
export type RawSearchParams = Record<string, string | string[] | undefined>;

/** 同名パラメーターが複数ある場合は、先頭の文字列だけを使用する。 */
function getSingleSearchParam(searchParams: RawSearchParams, key: string): string | undefined {
  const value = searchParams[key];

  return Array.isArray(value) ? value[0] : value;
}

/** 不正なページ番号を 1 ページ目へ置き換える。 */
function parsePage(value: string | undefined): number {
  if (!value || !/^[1-9]\d*$/.test(value)) {
    return 1;
  }

  const page = Number(value);

  return Number.isSafeInteger(page) ? page : 1;
}

/** 試合一覧の URL 検索パラメーターを、許可値だけで構成した取得条件へ変換する。 */
export function parseMatchListSearchParams(searchParams: RawSearchParams): MatchListQuery {
  const teamParam = getSingleSearchParam(searchParams, 'team');
  const sortParam = getSingleSearchParam(searchParams, 'sort');

  return {
    team: teamParam && isTeamCode(teamParam) ? teamParam : null,
    sort: sortParam && isMatchSort(sortParam) ? sortParam : DEFAULT_MATCH_SORT,
    page: parsePage(getSingleSearchParam(searchParams, 'page')),
  };
}

/** 場面一覧の URL 検索パラメーターを、許可値だけで構成した取得条件へ変換する。 */
export function parseMomentListSearchParams(searchParams: RawSearchParams): MomentListQuery {
  const keywordParam = getSingleSearchParam(searchParams, 'keyword');
  const teamParam = getSingleSearchParam(searchParams, 'team');
  const momentTypeParam = getSingleSearchParam(searchParams, 'type');
  const sortParam = getSingleSearchParam(searchParams, 'sort');

  return {
    keyword: keywordParam?.trim() ?? '',
    team: teamParam && isTeamCode(teamParam) ? teamParam : null,
    momentType: momentTypeParam && isMomentType(momentTypeParam) ? momentTypeParam : null,
    favoriteOnly: getSingleSearchParam(searchParams, 'favorite') === 'true',
    sort: sortParam && isMomentSort(sortParam) ? sortParam : DEFAULT_MOMENT_SORT,
    page: parsePage(getSingleSearchParam(searchParams, 'page')),
  };
}

/**
 * 正規化済みの試合一覧条件から、ページ移動で維持する検索パラメーターを作成する。
 * 初期値は URL から省略し、同じ一覧状態を必要最小限の URL で表す。
 */
export function createMatchListSearchParams(query: MatchListQuery): URLSearchParams {
  const searchParams = new URLSearchParams();

  if (query.team !== null) {
    searchParams.set('team', query.team);
  }

  if (query.sort !== DEFAULT_MATCH_SORT) {
    searchParams.set('sort', query.sort);
  }

  if (query.page > 1) {
    searchParams.set('page', String(query.page));
  }

  return searchParams;
}

/**
 * 正規化済みの場面一覧条件から、ページ移動で維持する検索パラメーターを作成する。
 * 空文字や初期値は URL から省略する。
 */
export function createMomentListSearchParams(query: MomentListQuery): URLSearchParams {
  const searchParams = new URLSearchParams();

  if (query.keyword !== '') {
    searchParams.set('keyword', query.keyword);
  }

  if (query.team !== null) {
    searchParams.set('team', query.team);
  }

  if (query.momentType !== null) {
    searchParams.set('type', query.momentType);
  }

  if (query.favoriteOnly) {
    searchParams.set('favorite', 'true');
  }

  if (query.sort !== DEFAULT_MOMENT_SORT) {
    searchParams.set('sort', query.sort);
  }

  if (query.page > 1) {
    searchParams.set('page', String(query.page));
  }

  return searchParams;
}
