'use client';

/**
 * 場面の登録・編集で共通して使用する Client Component のフォーム。
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
import { MOMENT_INPUT_LIMITS, MOMENT_TYPE_OPTIONS } from '@/lib/constants';
import { formatFixture, formatMatchDate, formatScore } from '@/lib/format';
import type { Match } from '@/types/match';
import type { MomentFormAction, MomentFormState, MomentFormValues } from '@/types/moment-action';

type MomentFormProps = {
  /** 登録または ID を束縛した編集用 Server Action。 */
  action: MomentFormAction;
  /** 新規登録の空値、または編集対象の現在値。 */
  initialValues: MomentFormValues;
  /** 関連する試合として選択できる登録済み試合。 */
  matches: readonly Match[];
  /** 通常時の送信ボタン文言。 */
  submitLabel: string;
  /** Server Action 実行中の送信ボタン文言。 */
  pendingLabel: string;
  /** キャンセル時の移動先。 */
  cancelHref: string;
};

/** Textarea へ追加する文章入力用のスタイル。 */
const textareaClassName = 'resize-y leading-7';

/** セレクトボックスで試合日、対戦カード、スコアを判別できる表示を作る。 */
function getMatchOptionLabel(match: Match): string {
  return [
    formatMatchDate(match.matchDate),
    formatFixture(match.homeTeamCode, match.awayTeamCode),
    formatScore(match.homeScore, match.awayScore),
  ].join('｜');
}

/** エラー表示と入力値保持に対応した場面フォームを表示する。 */
export function MomentForm({
  action,
  initialValues,
  matches,
  submitLabel,
  pendingLabel,
  cancelHref,
}: MomentFormProps) {
  const initialState: MomentFormState = {
    status: 'idle',
    message: null,
    fieldErrors: {},
    values: initialValues,
    revision: 0,
  };
  const [state, formAction, isPending] = useActionState(action, initialState);

  const matchIdErrors = state.fieldErrors.matchId;
  const titleErrors = state.fieldErrors.title;
  const momentTypeErrors = state.fieldErrors.momentType;
  const timeLabelErrors = state.fieldErrors.timeLabel;
  const subjectErrors = state.fieldErrors.subject;
  const descriptionErrors = state.fieldErrors.description;
  const memoryNoteErrors = state.fieldErrors.memoryNote;

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
        {/*
         * エラー返却時に key を変更して非制御入力を再生成し、
         * Server Action から返された入力値を `defaultValue` と `defaultChecked` へ反映する。
         */}
        <fieldset key={state.revision} disabled={isPending} className="min-w-0 border-0 p-0">
          <legend className="sr-only">場面情報</legend>

          <section aria-labelledby="moment-form-match-title" className="p-5 sm:p-6">
            <FormSectionHeader
              eyebrow="Match"
              title="関連する試合"
              description="場面を記録する対象の試合を選択します。"
              titleId="moment-form-match-title"
            />
            <p className="text-subtle mt-2 text-sm leading-6">
              「必須」と表示された項目は入力が必要です。
            </p>

            <div className="mt-6">
              <label htmlFor="match-id" className="text-text text-sm font-medium">
                関連する試合
                <RequiredLabel />
              </label>
              <select
                id="match-id"
                name="matchId"
                required
                defaultValue={state.values.matchId}
                className={getFormControlClassName(Boolean(matchIdErrors?.length))}
                aria-invalid={Boolean(matchIdErrors?.length)}
                aria-describedby={getAriaDescribedBy(
                  'match-id-help',
                  'match-id-errors',
                  Boolean(matchIdErrors?.length),
                )}
              >
                <option value="">選択してください</option>
                {matches.map((match) => (
                  <option key={match.id} value={match.id}>
                    {getMatchOptionLabel(match)}
                  </option>
                ))}
              </select>
              <p id="match-id-help" className="text-muted mt-2 text-sm leading-6">
                試合日、対戦カード、スコアを確認して選択してください。
              </p>
              <FieldErrors id="match-id-errors" errors={matchIdErrors} />
            </div>
          </section>

          <section
            aria-labelledby="moment-form-moment-title"
            className="border-border/55 border-t p-5 sm:p-6"
          >
            <FormSectionHeader
              eyebrow="Moment"
              title="場面情報"
              description="一覧や詳細画面で場面を識別するための基本情報を入力します。"
              titleId="moment-form-moment-title"
            />

            <div className="mt-6 space-y-6">
              <div>
                <label htmlFor="moment-title" className="text-text text-sm font-medium">
                  タイトル
                  <RequiredLabel />
                </label>
                <input
                  id="moment-title"
                  name="title"
                  type="text"
                  required
                  maxLength={MOMENT_INPUT_LIMITS.title}
                  defaultValue={state.values.title}
                  className={getFormControlClassName(Boolean(titleErrors?.length))}
                  aria-invalid={Boolean(titleErrors?.length)}
                  aria-describedby={getAriaDescribedBy(
                    'moment-title-help',
                    'moment-title-errors',
                    Boolean(titleErrors?.length),
                  )}
                />
                <p id="moment-title-help" className="text-muted mt-2 text-sm leading-6">
                  場面を識別できるタイトルを 1〜{MOMENT_INPUT_LIMITS.title} 文字で入力してください。
                </p>
                <FieldErrors id="moment-title-errors" errors={titleErrors} />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="moment-type" className="text-text text-sm font-medium">
                    場面の種類
                    <RequiredLabel />
                  </label>
                  <select
                    id="moment-type"
                    name="momentType"
                    required
                    defaultValue={state.values.momentType}
                    className={getFormControlClassName(Boolean(momentTypeErrors?.length))}
                    aria-invalid={Boolean(momentTypeErrors?.length)}
                    aria-describedby={getAriaDescribedBy(
                      'moment-type-help',
                      'moment-type-errors',
                      Boolean(momentTypeErrors?.length),
                    )}
                  >
                    <option value="">選択してください</option>
                    {MOMENT_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p id="moment-type-help" className="text-muted mt-2 text-sm leading-6">
                    場面の内容に最も近い種類を選択してください。
                  </p>
                  <FieldErrors id="moment-type-errors" errors={momentTypeErrors} />
                </div>

                <div>
                  <label htmlFor="time-label" className="text-text text-sm font-medium">
                    発生時間
                    <OptionalLabel />
                  </label>
                  <input
                    id="time-label"
                    name="timeLabel"
                    type="text"
                    maxLength={MOMENT_INPUT_LIMITS.timeLabel}
                    defaultValue={state.values.timeLabel}
                    className={getFormControlClassName(Boolean(timeLabelErrors?.length))}
                    aria-invalid={Boolean(timeLabelErrors?.length)}
                    aria-describedby={getAriaDescribedBy(
                      'time-label-help',
                      'time-label-errors',
                      Boolean(timeLabelErrors?.length),
                    )}
                  />
                  <p id="time-label-help" className="text-muted mt-2 text-sm leading-6">
                    「45+2分」「試合終了後」など、{MOMENT_INPUT_LIMITS.timeLabel}{' '}
                    文字以内で自由に入力できます。
                  </p>
                  <FieldErrors id="time-label-errors" errors={timeLabelErrors} />
                </div>
              </div>

              <div>
                <label htmlFor="moment-subject" className="text-text text-sm font-medium">
                  対象
                  <OptionalLabel />
                </label>
                <input
                  id="moment-subject"
                  name="subject"
                  type="text"
                  maxLength={MOMENT_INPUT_LIMITS.subject}
                  defaultValue={state.values.subject}
                  className={getFormControlClassName(Boolean(subjectErrors?.length))}
                  aria-invalid={Boolean(subjectErrors?.length)}
                  aria-describedby={getAriaDescribedBy(
                    'moment-subject-help',
                    'moment-subject-errors',
                    Boolean(subjectErrors?.length),
                  )}
                />
                <p id="moment-subject-help" className="text-muted mt-2 text-sm leading-6">
                  選手、チーム、主審、サポーターなどを {MOMENT_INPUT_LIMITS.subject}{' '}
                  文字以内で入力できます。
                </p>
                <FieldErrors id="moment-subject-errors" errors={subjectErrors} />
              </div>
            </div>
          </section>

          <section
            aria-labelledby="moment-form-notes-title"
            className="border-border/55 border-t p-5 sm:p-6"
          >
            <FormSectionHeader
              eyebrow="Notes"
              title="記録内容"
              description="場面で起きたことと、記憶に残った理由を文章で記録します。"
              titleId="moment-form-notes-title"
            />

            <div className="mt-6 space-y-6">
              <div>
                <label htmlFor="moment-description" className="text-text text-sm font-medium">
                  何が起きたか
                  <OptionalLabel />
                </label>
                <textarea
                  id="moment-description"
                  name="description"
                  rows={6}
                  maxLength={MOMENT_INPUT_LIMITS.description}
                  defaultValue={state.values.description}
                  className={getFormControlClassName(
                    Boolean(descriptionErrors?.length),
                    textareaClassName,
                  )}
                  aria-invalid={Boolean(descriptionErrors?.length)}
                  aria-describedby={getAriaDescribedBy(
                    'moment-description-help',
                    'moment-description-errors',
                    Boolean(descriptionErrors?.length),
                  )}
                />
                <p id="moment-description-help" className="text-muted mt-2 text-sm leading-6">
                  場面の内容を {MOMENT_INPUT_LIMITS.description.toLocaleString('ja-JP')}{' '}
                  文字以内で入力できます。
                </p>
                <FieldErrors id="moment-description-errors" errors={descriptionErrors} />
              </div>

              <div>
                <label htmlFor="memory-note" className="text-text text-sm font-medium">
                  なぜ印象に残ったか
                  <OptionalLabel />
                </label>
                <textarea
                  id="memory-note"
                  name="memoryNote"
                  rows={6}
                  maxLength={MOMENT_INPUT_LIMITS.memoryNote}
                  defaultValue={state.values.memoryNote}
                  className={getFormControlClassName(
                    Boolean(memoryNoteErrors?.length),
                    textareaClassName,
                  )}
                  aria-invalid={Boolean(memoryNoteErrors?.length)}
                  aria-describedby={getAriaDescribedBy(
                    'memory-note-help',
                    'memory-note-errors',
                    Boolean(memoryNoteErrors?.length),
                  )}
                />
                <p id="memory-note-help" className="text-muted mt-2 text-sm leading-6">
                  記憶に残った理由を {MOMENT_INPUT_LIMITS.memoryNote.toLocaleString('ja-JP')}{' '}
                  文字以内で入力できます。
                </p>
                <FieldErrors id="memory-note-errors" errors={memoryNoteErrors} />
              </div>
            </div>
          </section>

          <section
            aria-labelledby="moment-form-settings-title"
            className="border-border/55 border-t p-5 sm:p-6"
          >
            <FormSectionHeader
              eyebrow="Settings"
              title="登録設定"
              description="登録後に一覧や詳細画面から変更できる状態を設定します。"
              titleId="moment-form-settings-title"
            />

            <div className="mt-5">
              <label className="text-text flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium">
                <input
                  name="isFavorite"
                  type="checkbox"
                  defaultChecked={state.values.isFavorite}
                  className="border-border accent-accent focus-visible:outline-focus rounded-control h-5 w-5 focus-visible:outline-2 focus-visible:outline-offset-2"
                />
                お気に入りとして登録する
              </label>
              <p className="text-muted mt-2 text-sm leading-6">
                お気に入り状態は、登録後も一覧や詳細画面から切り替えられます。
              </p>
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
