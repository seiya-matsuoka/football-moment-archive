/**
 * アプリの概要と主要画面への導線を表示するホーム画面。
 */

import Link from 'next/link';

import { PageHeader } from '@/components/common/page-header';
import { Panel } from '@/components/common/panel';
import { APP_DESCRIPTION, APP_NAME, TARGET_COMPETITION } from '@/lib/constants';

/** ホーム画面から移動できる主要機能。 */
const navigationCards = [
  {
    href: '/matches',
    title: '試合一覧',
    description: '場面を記録する対象となる試合を確認する。',
  },
  {
    href: '/moments',
    title: '場面一覧',
    description: '試合の中で記録した場面を確認する。',
  },
] as const;

/** アプリの目的、対象範囲、主要画面へのリンクを表示する。 */
export default function Home() {
  return (
    <div className="space-y-section">
      <PageHeader title={APP_NAME} description={APP_DESCRIPTION} />

      {/* 対象リーグとシーズンを、固定値から表示する。 */}
      <section aria-labelledby="target-competition-title">
        <Panel>
          <h2 id="target-competition-title" className="text-text text-lg font-semibold">
            対象範囲
          </h2>

          <dl className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-muted text-sm font-medium">リーグ</dt>
              <dd className="text-text mt-1 text-base font-semibold">
                {TARGET_COMPETITION.league}
              </dd>
            </div>

            <div>
              <dt className="text-muted text-sm font-medium">シーズン</dt>
              <dd className="text-text mt-1 text-base font-semibold">
                {TARGET_COMPETITION.season}
              </dd>
            </div>
          </dl>
        </Panel>
      </section>

      {/* 試合一覧と場面一覧の基本 Route への導線を表示する。 */}
      <section aria-labelledby="navigation-title">
        <h2 id="navigation-title" className="text-text text-xl font-semibold">
          アプリを見る
        </h2>

        <div className="gap-section mt-5 grid sm:grid-cols-2">
          {navigationCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-panel border-border bg-surface p-panel shadow-panel hover:border-border-strong focus-visible:outline-focus border transition focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <h3 className="text-text text-lg font-semibold">{card.title}</h3>
              <p className="text-muted mt-2 text-sm leading-6">{card.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
