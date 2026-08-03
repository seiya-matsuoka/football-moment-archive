'use client';

/**
 * 試合の登録・編集で共通して使用する Client Component のフォーム。
 */

import { useActionState } from 'react';

import { FieldErrors } from '@/components/common/field-errors';
import {
  FormActions,
  FormDemoNotice,
  FormSectionHeader,
  FormSurface,
  OptionalLabel,
  RequiredLabel,
  getAriaDescribedBy,
  getFormControlClassName,
} from '@/components/common/form-ui';
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
    <form action={formAction} noValidate className="space-y-5" aria-busy={isPending}>
      {/* 業務条件や DB 更新時など、フォーム全体に関わるエラーを表示する。 */}
      {state.message ? (
        <Panel tone="error">
          <p role="alert" className="text-sm leading-6">
            {state.message}
          </p>
        </Panel>
      ) : null}

      <FormSurface>
        <fieldset key={state.revision} disabled={isPending} className="min-w-0 border-0 p-0">
          <legend className="sr-only">試合情報</legend>

          <section aria-labelledby="match-form-teams-title" className="p-5 sm:p-6">
            <FormSectionHeader
              eyebrow="Teams"
              title="対戦チーム"
              titleId="match-form-teams-title"
              description="対象シーズンの固定チームからホームとアウェイを選択します。"
            />
            <p className="text-subtle mt-2 text-sm leading-6">
              「必須」と表示された項目は入力が必要です。
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="home-team-code" className="text-text text-sm font-medium">
                  ホームチーム
                  <RequiredLabel />
                </label>
                <select
                  id="home-team-code"
                  name="homeTeamCode"
                  required
                  defaultValue={state.values.homeTeamCode}
                  className={getFormControlClassName(Boolean(homeTeamErrors?.length))}
                  aria-invalid={Boolean(homeTeamErrors?.length)}
                  aria-describedby={getAriaDescribedBy(
                    undefined,
                    'home-team-code-errors',
                    Boolean(homeTeamErrors?.length),
                  )}
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
                  アウェイチーム
                  <RequiredLabel />
                </label>
                <select
                  id="away-team-code"
                  name="awayTeamCode"
                  required
                  defaultValue={state.values.awayTeamCode}
                  className={getFormControlClassName(Boolean(awayTeamErrors?.length))}
                  aria-invalid={Boolean(awayTeamErrors?.length)}
                  aria-describedby={getAriaDescribedBy(
                    undefined,
                    'away-team-code-errors',
                    Boolean(awayTeamErrors?.length),
                  )}
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
          </section>

          <section
            aria-labelledby="match-form-date-title"
            className="border-border/55 border-t p-5 sm:p-6"
          >
            <FormSectionHeader
              eyebrow="Match"
              title="試合情報"
              titleId="match-form-date-title"
              description="試合日を入力します。未入力のまま登録することもできます。"
            />

            <div className="mt-6">
              <label htmlFor="match-date" className="text-text text-sm font-medium">
                試合日
                <OptionalLabel />
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
                aria-describedby={getAriaDescribedBy(
                  'match-date-help',
                  'match-date-errors',
                  Boolean(matchDateErrors?.length),
                )}
              />
              <p id="match-date-help" className="text-muted mt-2 text-sm leading-6">
                {TARGET_COMPETITION.startDate} から {TARGET_COMPETITION.endDate}{' '}
                までを入力できます。
              </p>
              <FieldErrors id="match-date-errors" errors={matchDateErrors} />
            </div>
          </section>

          <section
            aria-labelledby="match-form-score-title"
            className="border-border/55 border-t p-5 sm:p-6"
          >
            <FormSectionHeader
              eyebrow="Score"
              title="スコア"
              titleId="match-form-score-title"
              description="スコアはホームとアウェイを両方入力するか、両方未入力にします。"
            />

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="home-score" className="text-text text-sm font-medium">
                  ホームチーム得点
                  <OptionalLabel note="任意・両方入力" />
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
                  aria-describedby={getAriaDescribedBy(
                    undefined,
                    'home-score-errors',
                    Boolean(homeScoreErrors?.length),
                  )}
                />
                <FieldErrors id="home-score-errors" errors={homeScoreErrors} />
              </div>

              <div>
                <label htmlFor="away-score" className="text-text text-sm font-medium">
                  アウェイチーム得点
                  <OptionalLabel note="任意・両方入力" />
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
                  aria-describedby={getAriaDescribedBy(
                    undefined,
                    'away-score-errors',
                    Boolean(awayScoreErrors?.length),
                  )}
                />
                <FieldErrors id="away-score-errors" errors={awayScoreErrors} />
              </div>
            </div>
          </section>
        </fieldset>

        <div className="border-border border-t p-5 sm:p-6">
          <FormDemoNotice />
          <div className="mt-5">
            <FormActions
              submitLabel={submitLabel}
              pendingLabel={pendingLabel}
              cancelHref={cancelHref}
              isPending={isPending}
            />
          </div>
        </div>
      </FormSurface>
    </form>
  );
}
