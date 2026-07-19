# Football Moment Archive アーキテクチャ設計

## 1. 文書概要

### 1.1 目的

本書は、`football-moment-archive` のアプリケーション構成、レイヤー責務、依存関係、データ取得・更新フロー、エラー処理、再検証方針を定義するための文書である。  
本書は開発中のアーキテクチャに関する判断基準として使用する。  
実装完了後は、完成した仕様と実装内容を反映した設計書を別途作成する。

### 1.2 対象範囲

本書では、次の内容を対象とする。

- 全体構成
- Next.js App Router の利用方針
- Server Component と Client Component の責務
- Server Action の責務
- Data Access Layer の責務
- 入力値検証
- DB 接続
- 型変換
- エラー処理
- キャッシュ再検証
- Metadata
- ディレクトリ構成
- モジュール間の依存関係
- 環境変数
- セキュリティ上の基本方針

画面の表示内容と遷移は `screen-design.md`、テーブルとカラムは `data-design.md` で定義する。

## 2. 採用構成

### 2.1 全体構成

Next.js App Router を使用した 1 つのフルスタック Web アプリケーションとして構成する。

```text
ブラウザ
  ↓
Next.js App Router
  ├─ Server Component
  ├─ Client Component
  └─ Server Action
       ↓
Data Access Layer
       ↓
Postgres.js
       ↓
Neon PostgreSQL
```

フロントエンドとバックエンドを別アプリケーションへ分離しない。  
Spring Boot、Express、独立した REST API は使用しない。

### 2.2 採用技術

| 区分            | 技術         |
| --------------- | ------------ |
| フレームワーク  | Next.js      |
| UI              | React        |
| 言語            | TypeScript   |
| ルーティング    | App Router   |
| スタイル        | Tailwind CSS |
| 入力値検証      | Zod          |
| DB              | PostgreSQL   |
| DB サービス     | Neon         |
| DB クライアント | Postgres.js  |
| Lint            | ESLint       |
| Format          | Prettier     |

### 2.3 実行環境

アプリケーションは Node.js Runtime で実行する。  
Edge Runtime は使用しない。

Postgres.js による PostgreSQL 接続を前提とし、DB へ接続する処理はサーバー環境だけで実行する。

## 3. アーキテクチャ方針

- App Router を使用する
- 参照処理は Server Component から Data Access Layer を呼び出す
- 更新処理は Server Action から Data Access Layer を呼び出す
- 画面コンポーネントに SQL を記述しない
- Server Action に SQL を記述しない
- Data Access Layer に DB 操作を集約する
- DB 接続情報を Client Component へ渡さない
- DB 行の `snake_case` を Data Access Layer で `camelCase` へ変換する
- 入力値検証と DB 制約の両方を使用する
- Service Layer は設けない
- 内部 API 用の Route Handler は設けない
- ORM は使用しない
- グローバル状態管理ライブラリは使用しない
- データ取得ライブラリは使用しない
- サーバー処理を基本とし、Client Component は必要最小限とする
- 小規模な構成を維持し、実際に責務やファイル量が増えた場合だけ分割する

## 4. レイヤー構成

### 4.1 レイヤー一覧

| レイヤー       | 主な配置                 | 責務                                         |
| -------------- | ------------------------ | -------------------------------------------- |
| Route          | `src/app`                | ルーティング、ページ構成、Metadata、状態画面 |
| Presentation   | `src/components`         | 表示、フォーム、操作 UI                      |
| Action         | `src/app/*/actions.ts`   | 更新処理の受付と制御                         |
| Validation     | `src/lib/validation`     | 入力値の構文・業務検証                       |
| Data Access    | `src/server/data-access` | SQL 実行、DB 行の変換                        |
| DB Client      | `src/server/db`          | PostgreSQL 接続の生成                        |
| Domain Support | `src/lib`、`src/types`   | 固定値、表示変換、共通型                     |

### 4.2 レイヤー間の基本フロー

#### 参照処理

```text
page.tsx
  ↓
Data Access Layer
  ↓
DB Client
  ↓
PostgreSQL
```

#### 更新処理

```text
フォームまたは操作ボタン
  ↓
Server Action
  ↓
Validation
  ↓
Data Access Layer
  ↓
DB Client
  ↓
PostgreSQL
  ↓
revalidatePath
  ↓
redirect または同一画面の再表示
```

## 5. App Router

### 5.1 ルート構成

```text
src/app/
├─ layout.tsx
├─ page.tsx
├─ loading.tsx
├─ error.tsx
├─ not-found.tsx
├─ globals.css
├─ matches/
│  ├─ actions.ts
│  ├─ page.tsx
│  ├─ loading.tsx
│  ├─ new/
│  │  └─ page.tsx
│  └─ [id]/
│     ├─ page.tsx
│     ├─ loading.tsx
│     └─ edit/
│        └─ page.tsx
└─ moments/
   ├─ actions.ts
   ├─ page.tsx
   ├─ loading.tsx
   ├─ new/
   │  └─ page.tsx
   └─ [id]/
      ├─ page.tsx
      ├─ loading.tsx
      └─ edit/
         └─ page.tsx
```

### 5.2 Route Group

Route Group は使用しない。  
画面数とレイアウトの種類が少なく、ルート階層を追加する必要がないためである。

### 5.3 Route Handler

`src/app/api` は作成しない。  
画面内部の参照は Server Component、更新は Server Action で完結させる。

外部サービス向け API や Webhook が必要になった場合だけ、Route Handler の追加を再検討する。

## 6. Server Component

### 6.1 基本方針

`page.tsx` と、サーバー上で完結する表示コンポーネントは Server Component とする。  
`"use client"` は付与しない。

### 6.2 主な責務

- URL パラメーターの取得
- URL 検索パラメーターの取得
- 検索条件の正規化
- Data Access Layer の呼び出し
- データの存在確認
- `notFound()` の呼び出し
- サーバーで取得したデータの表示コンポーネントへの受け渡し
- Metadata に必要なデータ取得

### 6.3 一覧画面

一覧画面では、`searchParams` から次の条件を受け取る。

- キーワード
- チーム
- 場面の種類
- お気に入り
- 並び替え
- ページ番号

検索パラメーターは、許可値へ正規化してから Data Access Layer へ渡す。  
不正な値はエラーにせず、初期値または未指定として扱う。

### 6.4 詳細画面

動的ルートの `id` は、正の整数として解釈できることを確認する。  
不正な形式または対象データが存在しない場合は `notFound()` を呼び出す。

### 6.5 DB 参照

Server Component から DB Client を直接呼び出さない。  
必ず Data Access Layer を経由する。

```text
許可
page.tsx
  → getMatchById()
  → Data Access Layer

禁止
page.tsx
  → sql`SELECT ...`
```

## 7. Client Component

### 7.1 基本方針

ブラウザ側の状態、イベント、標準 Web API が必要な箇所だけ Client Component とする。  
画面全体を Client Component にしない。

### 7.2 想定する用途

- Server Action の実行状態表示
- 送信ボタンの無効化
- お気に入り切り替えボタン
- 削除確認
- 削除ボタン
- 必要に応じたフォームエラー表示
- 現在の送信状態に応じた文言変更

### 7.3 使用しない用途

次の処理のためだけに Client Component を使用しない。

- DB データの初期取得
- 一覧検索
- 一覧絞り込み
- 一覧並び替え
- ページネーション
- Metadata
- 詳細データの取得

一覧条件は HTML の `GET` フォームと URL 検索パラメーターで管理する。

### 7.4 状態管理

React のローカル状態と Server Action の状態だけを使用する。  
Redux、Zustand、Context によるグローバル状態管理は使用しない。

## 8. Server Action

### 8.1 配置

ドメインごとに 1 ファイルへまとめる。

```text
src/app/matches/actions.ts
src/app/moments/actions.ts
```

初期段階では、登録・編集・削除ごとにファイルを分割しない。  
ファイルが大きくなり責務が判別しにくくなった場合だけ分割する。

### 8.2 対象処理

#### 試合

- 登録
- 編集
- 削除

#### 場面

- 登録
- 編集
- 削除
- お気に入り切り替え

### 8.3 責務

Server Action は、次の順序で処理する。

1. `FormData` またはアクション引数を受け取る
2. 値を検証可能な形式へ変換する
3. Validation を実行する
4. 必要に応じて DB 上の存在確認と件数上限確認を行う
5. Data Access Layer の更新関数を呼び出す
6. 想定内エラーを利用者向けの結果へ変換する
7. 関連ページを再検証する
8. 成功後の画面へ遷移する

### 8.4 責務に含めない処理

- SQL の組み立て
- DB 行から画面用型への変換
- JSX の生成
- 複雑な UI 状態管理
- DB 接続の生成

### 8.5 戻り値

入力エラーなど、同じフォーム内へ表示する必要がある結果は、構造化した Action State として返す。

想定例：

```ts
type ActionState = {
  status: 'idle' | 'error';
  message?: string;
  fieldErrors?: Record<string, string[]>;
  values?: Record<string, string>;
};
```

成功時は `redirect()` を使用する。  
`redirect()` の後に値を返す処理は記述しない。

### 8.6 二重送信

送信中は Client Component 側でボタンを無効化する。  
厳密な冪等性キーや重複リクエスト管理は導入しない。

## 9. Validation

### 9.1 配置

```text
src/lib/validation/
├─ matches.ts
└─ moments.ts
```

### 9.2 責務

- 文字列の前後空白除去
- 必須値の確認
- 数値への変換
- 文字数確認
- 固定値の許可確認
- 日付範囲の確認
- 項目間の整合性確認
- 空文字から `null` への変換

### 9.3 試合の検証

- ホームチーム必須
- アウェーチーム必須
- 固定 20 チーム内のコード
- ホームとアウェーが異なる
- 試合日が対象シーズン内
- スコアが両方入力または両方未入力
- 得点が 0 以上の整数

### 9.4 場面の検証

- 関連試合 ID 必須
- タイトル必須
- タイトル最大 80 文字
- 場面の種類が固定値内
- 発生時間最大 30 文字
- 対象最大 100 文字
- 説明最大 1,000 文字
- 印象に残った理由最大 1,000 文字
- 任意項目の空文字を `null` へ変換

### 9.5 DB に依存する検証

次の確認は Validation だけで完結させず、Data Access Layer を使用する。

- 関連試合が存在するか
- 登録件数上限に達しているか
- 試合に関連する場面が存在するか
- 更新対象または削除対象が存在するか

## 10. Data Access Layer

### 10.1 配置

```text
src/server/data-access/
├─ matches.ts
└─ moments.ts
```

名称は `repositories` ではなく `data-access` を使用する。

### 10.2 分割単位

Data Access Layer は、中心となるデータ領域ごとに分割する。

- 試合を中心とする処理は `matches.ts`
- 場面を中心とする処理は `moments.ts`

1 つの SQL が複数テーブルを参照する場合でも、中心となる返却データに基づいて配置する。

例：

- 場面数を含む試合一覧は `matches.ts`
- 試合情報を含む場面一覧は `moments.ts`

### 10.3 主な責務

- SQL の実行
- パラメーターのバインド
- DB 行の型定義
- `snake_case` から `camelCase` への変換
- 一覧検索
- 詳細取得
- 件数取得
- 存在確認
- 登録
- 更新
- 削除
- お気に入り切り替え
- 登録上限の確認

### 10.4 想定する試合関数

```ts
getMatchCount();
getMatchList();
getMatchById();
getMatchWithMoments();
createMatch();
updateMatch();
deleteMatch();
hasMomentsForMatch();
```

実際の関数名は、実装時に戻り値と責務が明確になるよう調整する。

### 10.5 想定する場面関数

```ts
getMomentCount();
getFavoriteMomentCount();
getMomentList();
getMomentById();
getMomentsByMatchId();
getRecentMoments();
createMoment();
updateMoment();
deleteMoment();
toggleMomentFavorite();
```

### 10.6 SQL

Postgres.js の Tagged Template Literal を使用し、値を文字列連結しない。

```ts
const rows = await sql<MatchRow[]>`
  SELECT
    id,
    home_team_code,
    away_team_code,
    match_date,
    home_score,
    away_score,
    created_at,
    updated_at
  FROM matches
  WHERE id = ${id}
`;
```

検索条件や並び替えは許可値から SQL 断片を組み立てる。  
利用者が入力した文字列を、そのままカラム名や `ORDER BY` へ埋め込まない。

### 10.7 戻り値

Data Access Layer は、画面で使用できる TypeScript の型を返す。  
DB クライアント固有の行形式を上位レイヤーへ公開しない。

詳細取得で対象が存在しない場合は `null` を返す。  
`notFound()` は Data Access Layer では呼び出さず、Route 側で判断する。

### 10.8 エラー

Data Access Layer は予期しない DB エラーを握りつぶさない。  
必要に応じて制約違反を判別し、Server Action が扱える想定内エラーへ変換する。

## 11. DB Client

### 11.1 配置

```text
src/server/db/client.ts
```

### 11.2 責務

- `DATABASE_URL` の取得
- Postgres.js クライアントの生成
- DB 接続オブジェクトの公開

### 11.3 サーバー限定

`src/server/db/client.ts` と Data Access Layer には、`server-only` を読み込む。

```ts
import 'server-only';
```

クライアント用のバンドルから DB 接続コードが参照された場合に、開発時点で検出できる構成とする。

### 11.4 接続文字列

接続文字列は `DATABASE_URL` から取得する。  
接続文字列をソースコードへ直接記述しない。

## 12. 型設計

### 12.1 共通型の配置

```text
src/types/
├─ match.ts
└─ moment.ts
```

### 12.2 アプリ用の型

画面やコンポーネントで使用する型を定義する。

想定例：

```ts
export type Match = {
  id: number;
  homeTeamCode: TeamCode;
  awayTeamCode: TeamCode;
  matchDate: string | null;
  homeScore: number | null;
  awayScore: number | null;
  createdAt: string;
  updatedAt: string;
};
```

```ts
export type Moment = {
  id: number;
  matchId: number;
  title: string;
  momentType: MomentType;
  timeLabel: string | null;
  subject: string | null;
  description: string | null;
  memoryNote: string | null;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
};
```

### 12.3 画面用途別の型

必要に応じて次の型を定義する。

- 試合一覧用
- 試合詳細用
- 場面一覧用
- 場面詳細用
- ページネーション結果
- 検索条件

型の共通化を優先しすぎず、用途ごとの必要項目を明確にする。

### 12.4 DB 行の型

DB 行の型は Data Access Layer のファイル内に定義し、外部へ公開しない。  
アプリ用の型と DB 行の型を同一にしない。

## 13. 固定値

### 13.1 配置

初期段階では、固定値を 1 ファイルへまとめる。

```text
src/lib/constants.ts
```

### 13.2 管理対象

- 対象リーグ
- 対象シーズン
- 対象期間
- 固定 20 チーム
- 場面の種類
- 試合登録上限
- 場面登録上限
- 1 ページの表示件数
- 並び替えの許可値

### 13.3 分割方針

`constants.ts` が大きくなり、異なる責務が混在した場合だけ分割する。

想定例：

```text
src/lib/constants/
├─ competition.ts
├─ teams.ts
├─ moments.ts
└─ pagination.ts
```

初期段階から上記の分割は行わない。

## 14. 表示変換

### 14.1 配置

```text
src/lib/format.ts
```

### 14.2 対象処理

- チームコードから表示名への変換
- 場面の種類から表示名への変換
- 試合日の表示
- 日時の表示
- スコアの表示
- 対戦カードの表示
- 未入力値の代替表示

### 14.3 汎用化

`utils.ts` のような用途が不明確なファイルは作成しない。  
表示変換に関する処理は、意味が明確な `format.ts` へ配置する。

## 15. コンポーネント構成

### 15.1 配置

```text
src/components/
├─ common/
├─ matches/
└─ moments/
```

### 15.2 共通コンポーネント

次の条件を満たす場合に `common` へ抽出する。

- 複数の画面で再利用する
- 単独の責務を持つ
- 抽出によって呼び出し側が読みやすくなる

想定例：

- ナビゲーション
- ページヘッダー
- 公開デモの案内
- ページネーション
- 空状態
- フォームエラー
- 送信ボタン

### 15.3 試合コンポーネント

想定例：

- 試合一覧
- 試合一覧項目
- 試合検索フォーム
- 試合フォーム
- 試合情報
- 試合削除ボタン

### 15.4 場面コンポーネント

想定例：

- 場面一覧
- 場面一覧項目
- 場面検索フォーム
- 場面フォーム
- 場面情報
- お気に入りボタン
- 場面削除ボタン

### 15.5 抽出しないケース

次の条件では、無理にコンポーネントを分割しない。

- 1 画面でしか使用しない短い表示
- 親コンポーネントから切り離すと読みづらくなる
- Props の受け渡しだけが増える
- 再利用予定だけを理由とする

## 16. 検索・絞り込み・ページネーション

### 16.1 URL 管理

一覧条件は URL 検索パラメーターで管理する。

```text
/matches?team=arsenal&sort=match-date-desc&page=2
/moments?keyword=save&type=save&favorite=true&page=1
```

ブラウザの戻る・進む、URL の共有、再読み込みで同じ一覧状態を再現可能とする。

### 16.2 フォーム

検索フォームは `GET` を使用する。  
Client Component の状態だけで検索条件を保持しない。

### 16.3 正規化

Route 側で検索パラメーターを正規化し、Data Access Layer へ型付きの条件を渡す。

想定例：

```ts
type MatchListQuery = {
  teamCode: TeamCode | null;
  sort: MatchSort;
  page: number;
};
```

### 16.4 SQL

Data Access Layer は、総件数取得と一覧データ取得を行う。  
ページ番号から `LIMIT` と `OFFSET` を算出する。

## 17. キャッシュと再検証

### 17.1 基本方針

更新処理後は `revalidatePath()` を使用し、関連する画面の表示を更新する。  
初期段階では `revalidateTag()` や独自のキャッシュキーを使用しない。

### 17.2 試合の登録・編集・削除

関連する主なパス：

- `/`
- `/matches`
- `/matches/[id]`
- `/moments`

試合情報は場面一覧や場面詳細にも表示されるため、関連する場面画面も再検証対象とする。

### 17.3 場面の登録・編集・削除

関連する主なパス：

- `/`
- `/moments`
- `/moments/[id]`
- `/matches/[matchId]`

場面数、最近登録された場面、お気に入り数へ影響するため、ホームと関連試合詳細を再検証する。

### 17.4 お気に入り切り替え

関連する主なパス：

- `/`
- `/moments`
- `/moments/[id]`

### 17.5 実装方針

必要なパスを明示的に再検証する。  
すべてのパスを無条件に再検証する共通処理は作成しない。

## 18. エラー処理

### 18.1 分類

エラーは次の 3 種類に分類する。

1. 入力値または業務条件に関する想定内エラー
2. 対象データが存在しない状態
3. DB 接続失敗などの予期しないエラー

### 18.2 想定内エラー

次のエラーは Server Action の結果として画面へ返す。

- 必須項目不足
- 文字数超過
- 不正な固定値
- 試合日範囲外
- スコア不整合
- 登録件数上限
- 関連試合が存在しない
- 関連する場面がある試合の削除
- 更新・削除対象がすでに存在しない

### 18.3 存在しないデータ

ページ表示時に対象データが存在しない場合は `notFound()` を使用する。

Server Action 実行中に対象が削除された場合は、即座に `notFound()` へ遷移させず、想定内エラーとして利用者へ案内する。

### 18.4 予期しないエラー

予期しないエラーは上位へ送出し、`error.tsx` で処理する。  
内部エラー内容、SQL、接続文字列、スタックトレースを利用者へ表示しない。

### 18.5 ログ

開発中はサーバー側のコンソールで予期しないエラーを確認する。  
外部エラー監視サービスは導入しない。

## 19. Loading・Error・Not Found

### 19.1 Loading

次のルートへ `loading.tsx` を配置する。

- `/`
- `/matches`
- `/matches/[id]`
- `/moments`
- `/moments/[id]`

フォームの送信中状態は、`loading.tsx` ではなく Client Component 内で表示する。

### 19.2 Error

ルートレベルの `error.tsx` を用意する。  
必要性が明確になった場合だけ、`matches` または `moments` 配下へ個別の `error.tsx` を追加する。

### 19.3 Not Found

ルートレベルの `not-found.tsx` を使用する。  
試合と場面で別々の 404 画面は作成しない。

## 20. Metadata

### 20.1 固定画面

固定タイトルと説明は、各 Route または共通 Metadata で定義する。

### 20.2 動的画面

試合詳細と場面詳細では `generateMetadata()` を使用する。

- 試合詳細：対戦カード
- 場面詳細：場面のタイトル

Metadata 取得でも Data Access Layer を使用する。  
SQL を `generateMetadata()` 内へ直接記述しない。

### 20.3 データ取得の重複

ページ本体と Metadata で同じデータ取得関数を呼び出す構成を許容する。  
小規模アプリであり、複雑な共有キャッシュ処理は導入しない。

実装時に Next.js によるリクエスト単位の重複排除を利用できる場合は、同じ取得関数を再利用する。

## 21. 環境変数

### 21.1 使用する環境変数

```text
DATABASE_URL
```

### 21.2 ファイル

```text
.env.local
.env.example
```

`.env.local` には実際の接続文字列を記載し、Git の管理対象外とする。  
`.env.example` にはキー名だけを記載する。

```env
DATABASE_URL=
```

### 21.3 クライアント公開

`NEXT_PUBLIC_` を付けない。  
DB 接続情報を Client Component やブラウザへ公開しない。

## 22. セキュリティ上の基本方針

### 22.1 SQL Injection

Postgres.js のパラメーター埋め込みを使用する。  
入力値を SQL 文字列へ直接連結しない。

### 22.2 入力値

クライアント側の入力制御を信用せず、Server Action で必ず再検証する。  
DB の `CHECK` 制約と外部キーも併用する。

### 22.3 表示

React の標準エスケープを使用し、利用者の入力内容を HTML として解釈しない。  
`dangerouslySetInnerHTML` は使用しない。

### 22.4 認証

認証と権限管理は実装しない。  
誰でも登録・編集・削除できる公開デモとして扱う。

### 22.5 荒らし対策

試合 50 件、場面 100 件の登録上限だけを設ける。  
Rate Limiting、CAPTCHA、IP 制限、管理者専用データは導入しない。

## 23. ディレクトリ構成

```text
football-moment-archive/
├─ database/
│  ├─ migrations/
│  │  └─ 001_create_tables.sql
│  ├─ seeds/
│  │  └─ development.sql
│  └─ README.md
├─ public/
├─ src/
│  ├─ app/
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  ├─ loading.tsx
│  │  ├─ error.tsx
│  │  ├─ not-found.tsx
│  │  ├─ matches/
│  │  │  ├─ actions.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ loading.tsx
│  │  │  ├─ new/
│  │  │  │  └─ page.tsx
│  │  │  └─ [id]/
│  │  │     ├─ page.tsx
│  │  │     ├─ loading.tsx
│  │  │     └─ edit/
│  │  │        └─ page.tsx
│  │  └─ moments/
│  │     ├─ actions.ts
│  │     ├─ page.tsx
│  │     ├─ loading.tsx
│  │     ├─ new/
│  │     │  └─ page.tsx
│  │     └─ [id]/
│  │        ├─ page.tsx
│  │        ├─ loading.tsx
│  │        └─ edit/
│  │           └─ page.tsx
│  ├─ components/
│  │  ├─ common/
│  │  ├─ matches/
│  │  └─ moments/
│  ├─ lib/
│  │  ├─ constants.ts
│  │  ├─ format.ts
│  │  └─ validation/
│  │     ├─ matches.ts
│  │     └─ moments.ts
│  ├─ server/
│  │  ├─ db/
│  │  │  └─ client.ts
│  │  └─ data-access/
│  │     ├─ matches.ts
│  │     └─ moments.ts
│  └─ types/
│     ├─ match.ts
│     └─ moment.ts
├─ .env.example
├─ .env.local
├─ .gitignore
├─ eslint.config.mjs
├─ next.config.ts
├─ package.json
├─ package-lock.json
├─ tsconfig.json
└─ README.md
```

## 24. 依存関係

### 24.1 許可する依存方向

```text
app/page
  ├─ components
  ├─ types
  ├─ constants
  ├─ format
  └─ data-access

components
  ├─ types
  ├─ constants
  ├─ format
  └─ actions

actions
  ├─ validation
  ├─ constants
  └─ data-access

data-access
  ├─ db/client
  ├─ types
  └─ constants

db/client
  └─ 環境変数
```

### 24.2 禁止する依存方向

- DB Client から Data Access Layer を参照しない
- Data Access Layer から Server Action を参照しない
- Validation から DB へ接続しない
- Client Component から DB Client を参照しない
- Client Component から Data Access Layer を直接参照しない
- `page.tsx` へ SQL を記述しない
- `actions.ts` へ SQL を記述しない
- `src/lib` から `src/app` を参照しない

### 24.3 循環参照

モジュール間の循環参照を作らない。  
共通型と固定値は、上位レイヤーへ依存しない場所へ配置する。

## 25. 採用しない構成

次の構成は初期実装で採用しない。

- Pages Router
- 独立したバックエンド
- REST API
- GraphQL
- Route Handler
- Service Layer
- Repository というディレクトリ名
- ORM
- DB トリガー
- Event Bus
- Redis
- Queue
- WebSocket
- グローバル状態管理
- TanStack Query
- SWR
- React Hook Form
- UI コンポーネントライブラリ
- トーストライブラリ
- 独自モーダルライブラリ
- テスト専用の複雑な依存性注入
- Barrel Export
- Route Group
- Edge Runtime
- 独自キャッシュ層
- Middleware による認証・認可
- 外部監視サービス

## 26. 分割・拡張の判断基準

初期構成を維持し、将来の可能性だけを理由にファイルやレイヤーを増やさない。

次の状態になった場合に分割を検討する。

- `actions.ts` が大きくなり、処理を探しにくい
- Data Access Layer の参照系と更新系が明確に別責務となる
- `constants.ts` に異なる種類の固定値が大量に混在する
- 同じ UI が複数画面で重複する
- 画面コンポーネントが長くなり、主要な表示構造を把握しにくい
- 外部 API や別クライアントから利用するエンドポイントが必要になる
- 認証やデータ所有者の概念が追加される
- 複雑な業務処理が追加され、Server Action と Data Access Layer だけでは責務が不明確になる

## 27. 確定事項

- Next.js App Router を使用した 1 つのフルスタック Web アプリケーションとする
- Node.js Runtime を使用する
- 参照処理は Server Component から Data Access Layer を呼び出す
- 更新処理は Server Action から Data Access Layer を呼び出す
- Client Component は送信状態、削除確認、お気に入り操作などに限定する
- 内部 REST API と Route Handler は使用しない
- Service Layer は設けない
- ORM は使用しない
- SQL は `src/server/data-access` へ集約する
- DB 接続は `src/server/db/client.ts` へ集約する
- DB と Data Access Layer は `server-only` とする
- 入力値検証は Zod と DB 制約の両方で行う
- DB 行の `snake_case` は Data Access Layer で `camelCase` へ変換する
- DB 行の型は Data Access Layer 内に閉じる
- 一覧条件は URL 検索パラメーターで管理する
- 更新後は `revalidatePath()` で関連画面を再検証する
- 存在しないデータは Route 側で `notFound()` を呼び出す
- 想定内エラーはフォームまたは操作箇所へ表示する
- 予期しないエラーは `error.tsx` で扱う
- 環境変数は `DATABASE_URL` だけを使用する
- DB 接続情報をブラウザへ公開しない
- 初期段階ではファイルとレイヤーを細分化しすぎない
