'use client';

/**
 * 場面の登録・編集で共通して使用する Client Component のフォーム。
 */

import { useActionState } from 'react';

import { Button } from '@/components/common/button';
import { FieldErrors } from '@/components/common/field-errors';
import { LinkButton } from '@/components/common/link-button';
import { Panel } from '@/components/common/panel';
import { MOMENT_INPUT_LIMITS, MOMENT_TYPE_OPTIONS } from '@/lib/constants';
import { formatFixture, formatMatchDate, formatScore } from '@/lib/format';
import type { MomentFormAction, MomentFormState, MomentFormValues } from '@/types/moment-action';
import type { Match } from '@/types/match';

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

/** 入力要素へ共通して適用する基本スタイル。 */
const formControlBaseClassName =
  'mt-2 min-h-11 w-full rounded-control border bg-surface px-3 py-2 text-base text-text disabled:cursor-not-allowed disabled:opacity-60 focus:outline-2 focus:outline-offset-2 focus:outline-focus';

/** Validation 結果に応じて入力要素の枠線を切り替える。 */
function getFormControlClassName(hasError: boolean): string {
  return `${formControlBaseClassName} ${hasError ? 'border-error-border' : 'border-border'}`;
}

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
         * Server Action から返された入力値を `defaultValue` と `defaultChecked` へ反映する。
         */}
        <fieldset
          key={state.revision}
          disabled={isPending}
          className="space-y-section min-w-0 border-0 p-0"
        >
          <legend className="sr-only">場面情報</legend>

          <div>
            <label htmlFor="match-id" className="text-text text-sm font-medium">
              関連する試合 <span className="text-error">必須</span>
            </label>
            <select
              id="match-id"
              name="matchId"
              required
              defaultValue={state.values.matchId}
              className={getFormControlClassName(Boolean(matchIdErrors?.length))}
              aria-invalid={Boolean(matchIdErrors?.length)}
              aria-describedby={matchIdErrors?.length ? 'match-id-errors' : 'match-id-help'}
            >
              <option value="">選択してください</option>
              {matches.map((match) => (
                <option key={match.id} value={match.id}>
                  {getMatchOptionLabel(match)}
                </option>
              ))}
            </select>
            <p id="match-id-help" className="text-muted mt-2 text-sm leading-6">
              場面を記録する対象の試合を選択してください。
            </p>
            <FieldErrors id="match-id-errors" errors={matchIdErrors} />
          </div>

          <div>
            <label htmlFor="moment-title" className="text-text text-sm font-medium">
              タイトル <span className="text-error">必須</span>
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
              aria-describedby={titleErrors?.length ? 'moment-title-errors' : 'moment-title-help'}
            />
            <p id="moment-title-help" className="text-muted mt-2 text-sm leading-6">
              1〜{MOMENT_INPUT_LIMITS.title} 文字で入力してください。
            </p>
            <FieldErrors id="moment-title-errors" errors={titleErrors} />
          </div>

          <div>
            <label htmlFor="moment-type" className="text-text text-sm font-medium">
              場面の種類 <span className="text-error">必須</span>
            </label>
            <select
              id="moment-type"
              name="momentType"
              required
              defaultValue={state.values.momentType}
              className={getFormControlClassName(Boolean(momentTypeErrors?.length))}
              aria-invalid={Boolean(momentTypeErrors?.length)}
              aria-describedby={momentTypeErrors?.length ? 'moment-type-errors' : undefined}
            >
              <option value="">選択してください</option>
              {MOMENT_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <FieldErrors id="moment-type-errors" errors={momentTypeErrors} />
          </div>

          {/* 短い任意項目は、広い画面では横並びにして関係を把握しやすくする。 */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="time-label" className="text-text text-sm font-medium">
                発生時間 <span className="text-muted">任意</span>
              </label>
              <input
                id="time-label"
                name="timeLabel"
                type="text"
                maxLength={MOMENT_INPUT_LIMITS.timeLabel}
                defaultValue={state.values.timeLabel}
                className={getFormControlClassName(Boolean(timeLabelErrors?.length))}
                aria-invalid={Boolean(timeLabelErrors?.length)}
                aria-describedby={timeLabelErrors?.length ? 'time-label-errors' : 'time-label-help'}
              />
              <p id="time-label-help" className="text-muted mt-2 text-sm leading-6">
                「45+2分」「試合終了後」など、{MOMENT_INPUT_LIMITS.timeLabel}{' '}
                文字以内で自由に入力できます。
              </p>
              <FieldErrors id="time-label-errors" errors={timeLabelErrors} />
            </div>

            <div>
              <label htmlFor="moment-subject" className="text-text text-sm font-medium">
                対象 <span className="text-muted">任意</span>
              </label>
              <input
                id="moment-subject"
                name="subject"
                type="text"
                maxLength={MOMENT_INPUT_LIMITS.subject}
                defaultValue={state.values.subject}
                className={getFormControlClassName(Boolean(subjectErrors?.length))}
                aria-invalid={Boolean(subjectErrors?.length)}
                aria-describedby={
                  subjectErrors?.length ? 'moment-subject-errors' : 'moment-subject-help'
                }
              />
              <p id="moment-subject-help" className="text-muted mt-2 text-sm leading-6">
                選手、チーム、主審、サポーターなどを {MOMENT_INPUT_LIMITS.subject}{' '}
                文字以内で入力できます。
              </p>
              <FieldErrors id="moment-subject-errors" errors={subjectErrors} />
            </div>
          </div>

          <div>
            <label htmlFor="moment-description" className="text-text text-sm font-medium">
              何が起きたか <span className="text-muted">任意</span>
            </label>
            <textarea
              id="moment-description"
              name="description"
              rows={6}
              maxLength={MOMENT_INPUT_LIMITS.description}
              defaultValue={state.values.description}
              className={getFormControlClassName(Boolean(descriptionErrors?.length))}
              aria-invalid={Boolean(descriptionErrors?.length)}
              aria-describedby={
                descriptionErrors?.length ? 'moment-description-errors' : 'moment-description-help'
              }
            />
            <p id="moment-description-help" className="text-muted mt-2 text-sm leading-6">
              場面の内容を {MOMENT_INPUT_LIMITS.description.toLocaleString('ja-JP')}{' '}
              文字以内で入力できます。
            </p>
            <FieldErrors id="moment-description-errors" errors={descriptionErrors} />
          </div>

          <div>
            <label htmlFor="memory-note" className="text-text text-sm font-medium">
              なぜ印象に残ったか <span className="text-muted">任意</span>
            </label>
            <textarea
              id="memory-note"
              name="memoryNote"
              rows={6}
              maxLength={MOMENT_INPUT_LIMITS.memoryNote}
              defaultValue={state.values.memoryNote}
              className={getFormControlClassName(Boolean(memoryNoteErrors?.length))}
              aria-invalid={Boolean(memoryNoteErrors?.length)}
              aria-describedby={
                memoryNoteErrors?.length ? 'memory-note-errors' : 'memory-note-help'
              }
            />
            <p id="memory-note-help" className="text-muted mt-2 text-sm leading-6">
              記憶に残った理由を {MOMENT_INPUT_LIMITS.memoryNote.toLocaleString('ja-JP')}{' '}
              文字以内で入力できます。
            </p>
            <FieldErrors id="memory-note-errors" errors={memoryNoteErrors} />
          </div>

          <div>
            <label className="text-text flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium">
              <input
                name="isFavorite"
                type="checkbox"
                defaultChecked={state.values.isFavorite}
                className="rounded-control border-border accent-accent focus-visible:outline-focus h-5 w-5 focus-visible:outline-2 focus-visible:outline-offset-2"
              />
              お気に入りとして登録する
            </label>
            <p className="text-muted mt-2 text-sm leading-6">
              お気に入り状態は、登録後も一覧や詳細画面から切り替えられます。
            </p>
          </div>

          <p className="text-muted border-border border-t pt-4 text-sm leading-6">
            このアプリは公開デモです。個人情報や公開に適さない内容は入力しないでください。
          </p>
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
