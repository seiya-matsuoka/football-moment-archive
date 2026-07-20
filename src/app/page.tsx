import Link from 'next/link';

import { PageHeader } from '@/components/common/page-header';
import { APP_DESCRIPTION, APP_NAME, TARGET_COMPETITION } from '@/lib/constants';

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

export default function Home() {
  return (
    <div className="space-y-10">
      <PageHeader title={APP_NAME} description={APP_DESCRIPTION} />

      <section aria-labelledby="target-competition-title">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 id="target-competition-title" className="text-lg font-semibold text-slate-950">
            対象範囲
          </h2>
          <dl className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-slate-500">リーグ</dt>
              <dd className="mt-1 text-base font-semibold text-slate-950">
                {TARGET_COMPETITION.league}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">シーズン</dt>
              <dd className="mt-1 text-base font-semibold text-slate-950">
                {TARGET_COMPETITION.season}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section aria-labelledby="navigation-title">
        <h2 id="navigation-title" className="text-xl font-semibold text-slate-950">
          アプリを見る
        </h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {navigationCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900"
            >
              <h3 className="text-lg font-semibold text-slate-950">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
