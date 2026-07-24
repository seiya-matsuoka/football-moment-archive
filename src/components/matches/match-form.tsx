'use client';

/**
 * 試合の登録・編集で共通して使用する Client Component のフォーム。
 */

import { useActionState } from 'react';

import { Button } from '@/components/common/button';
import { FieldErrors } from '@/components/common/field-errors';
import { LinkButton } from '@/components/common/link-button';
import { Panel } from '@/components/common/panel';
import { TARGET_COMPETITION, TEAM_OPTIONS } from '@/lib/constants';
import type { MatchFormAction, MatchFormState, MatchFormValues } from '@/types/match-action';

type MatchFormProps = {
  /** 登録または ID を束縛した編集用 Server Action。 */
  action: MatchFormAction;
  /** 新規登録の空値、または編集対象の現在値。 */
  initialValues: MatchFormValues;
  /** 通常時の送信ボタン文言。 */
  submitLabel: string;
  /** Server Action 実行中の送信ボタン文言。 */
  pendingLabel: string;
  /** キャンセル時の移動先。 */
  cancelHref: string;
};

/** 入力要素へ共通して適用する基本スタイル。 */
const formControlBaseClassName =
  'mt-2 min-h-11 w-full rounded-control border bg-surface px-3 py-2 text-base text-text disabled:cursor-not-allowed disabled:opacity-60 focus:outline-2 focus:outline-offset-2 focus:outline-focus';

/** Validation 結果に応じて入力要素の枠線を切り替える。 */
function getFormControlClassName(hasError: boolean): string {
  return `${formControlBaseClassName} ${hasError ? 'border-error-border' : 'border-border'}`;
}

/** エラー表示と入力値保持に対応した試合フォームを表示する。 */
export function MatchForm({
  action,
  initialValues,
  submitLabel,
  pendingLabel,
  cancelHref,
}: MatchFormProps) {
  const initialState: MatchFormState = {
    status: 'idle',
    message: null,
    fieldErrors: {},
    values: initialValues,
    revision: 0,
  };
  const [state, formAction, isPending] = useActionState(action, initialState);

  const homeTeamErrors = state.fieldErrors.homeTeamCode;
  const awayTeamErrors = state.fieldErrors.awayTeamCode;
  const matchDateErrors = state.fieldErrors.matchDate;
  const homeScoreErrors = state.fieldErrors.homeScore;
  const awayScoreErrors = state.fieldErrors.awayScore;

  return (
    <form action={formAction} noValidate className="space-y-6" aria-busy={isPending}>
      {/* 業務条件や DB 更新時など、フォーム全体に関わるエラーを表示する。 */}
      {state.message ? (
        <Panel tone="error">
          <p role="alert" className="text-sm leading-6">
            {state.message}
          </p>
        </Panel>
      ) : null}

      <Panel>
        {/*
         * エラー返却時に key を変更して非制御入力を再生成し、
         * Server Action から返された入力値を `defaultValue` へ反映する。
         */}
        <fieldset
          key={state.revision}
          disabled={isPending}
          className="space-y-section min-w-0 border-0 p-0"
        >
          <legend className="sr-only">試合情報</legend>

          {/* ホームとアウェーは、広い画面では対になる配置で表示する。 */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="home-team-code" className="text-text text-sm font-medium">
                ホームチーム <span className="text-error">必須</span>
              </label>
              <select
                id="home-team-code"
                name="homeTeamCode"
                required
                defaultValue={state.values.homeTeamCode}
                className={getFormControlClassName(Boolean(homeTeamErrors?.length))}
                aria-invalid={Boolean(homeTeamErrors?.length)}
                aria-describedby={homeTeamErrors?.length ? 'home-team-code-errors' : undefined}
              >
                <option value="">選択してください</option>
                {TEAM_OPTIONS.map((team) => (
                  <option key={team.code} value={team.code}>
                    {team.name}
                  </option>
                ))}
              </select>
              <FieldErrors id="home-team-code-errors" errors={homeTeamErrors} />
            </div>

            <div>
              <label htmlFor="away-team-code" className="text-text text-sm font-medium">
                アウェーチーム <span className="text-error">必須</span>
              </label>
              <select
                id="away-team-code"
                name="awayTeamCode"
                required
                defaultValue={state.values.awayTeamCode}
                className={getFormControlClassName(Boolean(awayTeamErrors?.length))}
                aria-invalid={Boolean(awayTeamErrors?.length)}
                aria-describedby={awayTeamErrors?.length ? 'away-team-code-errors' : undefined}
              >
                <option value="">選択してください</option>
                {TEAM_OPTIONS.map((team) => (
                  <option key={team.code} value={team.code}>
                    {team.name}
                  </option>
                ))}
              </select>
              <FieldErrors id="away-team-code-errors" errors={awayTeamErrors} />
            </div>
          </div>

          <div>
            <label htmlFor="match-date" className="text-text text-sm font-medium">
              試合日 <span className="text-muted">任意</span>
            </label>
            <input
              id="match-date"
              name="matchDate"
              type="date"
              min={TARGET_COMPETITION.startDate}
              max={TARGET_COMPETITION.endDate}
              defaultValue={state.values.matchDate}
              className={getFormControlClassName(Boolean(matchDateErrors?.length))}
              aria-invalid={Boolean(matchDateErrors?.length)}
              aria-describedby={matchDateErrors?.length ? 'match-date-errors' : 'match-date-help'}
            />
            <p id="match-date-help" className="text-muted mt-2 text-sm leading-6">
              {TARGET_COMPETITION.startDate} から {TARGET_COMPETITION.endDate} までを入力できます。
            </p>
            <FieldErrors id="match-date-errors" errors={matchDateErrors} />
          </div>

          {/* スコアは両方入力または両方未入力とする。 */}
          <div>
            <p className="text-text text-sm font-medium">
              スコア <span className="text-muted">任意・両方入力</span>
            </p>

            <div className="mt-3 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="home-score" className="text-text text-sm font-medium">
                  ホームチーム得点
                </label>
                <input
                  id="home-score"
                  name="homeScore"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max="32767"
                  step="1"
                  defaultValue={state.values.homeScore}
                  className={getFormControlClassName(Boolean(homeScoreErrors?.length))}
                  aria-invalid={Boolean(homeScoreErrors?.length)}
                  aria-describedby={homeScoreErrors?.length ? 'home-score-errors' : undefined}
                />
                <FieldErrors id="home-score-errors" errors={homeScoreErrors} />
              </div>

              <div>
                <label htmlFor="away-score" className="text-text text-sm font-medium">
                  アウェーチーム得点
                </label>
                <input
                  id="away-score"
                  name="awayScore"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max="32767"
                  step="1"
                  defaultValue={state.values.awayScore}
                  className={getFormControlClassName(Boolean(awayScoreErrors?.length))}
                  aria-invalid={Boolean(awayScoreErrors?.length)}
                  aria-describedby={awayScoreErrors?.length ? 'away-score-errors' : undefined}
                />
                <FieldErrors id="away-score-errors" errors={awayScoreErrors} />
              </div>
            </div>
          </div>
        </fieldset>
      </Panel>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? pendingLabel : submitLabel}
        </Button>
        <LinkButton href={cancelHref}>キャンセル</LinkButton>
      </div>
    </form>
  );
}
