# Database

## 1. 概要

本ディレクトリでは、Football Moment Archive の PostgreSQL スキーマとシードデータを SQL ファイルで管理する。

```text
database/
├─ migrations/
│  └─ 001_create_tables.sql
└─ seeds/
   ├─ development.sql
   └─ demo.sql
```

ORM と自動マイグレーションツールは使用しない。  
SQL は対象となる DB に対して手動で適用する。

## 2. マイグレーション

`migrations/001_create_tables.sql` は、次の内容を作成する。

- `matches` テーブル
- `moments` テーブル
- 主キー
- `CHECK` 制約
- 外部キー
- インデックス

新規 DB に対して 1 回だけ実行する。  
同じ DB へ再実行すると、作成済みテーブルによってエラーになる。

適用順序はファイル名の連番に従う。

```text
001_create_tables.sql
002_...
003_...
```

## 3. シードデータ

### 3.1 `development.sql`

`seeds/development.sql` は、少量のデータで開発中の表示と CRUD を確認するために使用する。

次の状態を含む。

- 試合 8 件
- 場面 10 件
- 試合日が未入力の試合
- スコアが未入力の試合
- 場面の任意項目が未入力のデータ
- 複数の場面が関連する試合
- 場面が関連しない試合

### 3.2 `demo.sql`

`seeds/demo.sql` は、公開環境への初期投入と公開デモのリセットに使用する。  
2025/26 Premier League の実際の試合記録を基に、公開画面で読みやすい文章へ整理している。

次の状態を含む。

- 試合 20 件
- 場面 36 件
- 対象シーズンの全 20 チーム
- 全 9 種類の場面
- お気に入りあり・なし
- 一部の任意項目が `NULL` の場面
- `created_at` と `updated_at` が異なるデータ
- 複数の場面が関連する試合
- 場面が関連しない試合
- 試合一覧 2 ページ分のデータ
- 場面一覧 4 ページ分のデータ

### 3.3 共通の実行内容

両方のシードファイルは、実行時に次の処理を行う。

1. `matches` と `moments` の既存データを削除
2. Identity Column の採番を 1 から再開
3. 試合を登録
4. 場面を登録

両方とも繰り返し実行可能である。  
既存データをすべて削除するため、保持が必要な DB では実行しない。

## 4. 適用手順

### 4.1 開発確認用データ

1. 対象となる DB とブランチを確認する
2. 新規 DB の場合は `migrations/001_create_tables.sql` を実行する
3. `seeds/development.sql` を実行する
4. 確認 SQL を実行する

### 4.2 公開デモ用データ

1. 公開対象となる DB とブランチを確認する
2. 新規 DB の場合は `migrations/001_create_tables.sql` を実行する
3. `seeds/demo.sql` を実行する
4. 件数、種類、関連、任意項目を確認する
5. アプリからページネーション、検索、絞り込み、並び替えを確認する

Neon を使用する場合は、Neon Console の SQL Editor から各ファイルの内容を実行できる。

## 5. 確認 SQL

### 5.1 テーブル

```sql
SELECT
  table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('matches', 'moments')
ORDER BY table_name;
```

### 5.2 件数

```sql
SELECT
  (SELECT COUNT(*) FROM matches) AS match_count,
  (SELECT COUNT(*) FROM moments) AS moment_count;
```

期待値：

| シード            | `match_count` | `moment_count` |
| ----------------- | ------------: | -------------: |
| `development.sql` |             8 |             10 |
| `demo.sql`        |            20 |             36 |

### 5.3 登場するチーム

```sql
SELECT
  team_code
FROM (
  SELECT home_team_code AS team_code
  FROM matches

  UNION

  SELECT away_team_code AS team_code
  FROM matches
) AS teams
ORDER BY team_code;
```

`demo.sql` の期待値は 20 件である。

```sql
SELECT
  COUNT(*) AS team_count
FROM (
  SELECT home_team_code AS team_code
  FROM matches

  UNION

  SELECT away_team_code AS team_code
  FROM matches
) AS teams;
```

### 5.4 場面の種類

```sql
SELECT
  moment_type,
  COUNT(*) AS moment_count
FROM moments
GROUP BY moment_type
ORDER BY moment_type;
```

`demo.sql` では、次の全 9 種類が 1 件以上存在することを確認する。

```text
goal
save
pass
dribble
defense
tactical
decision
reaction
other
```

### 5.5 お気に入り

```sql
SELECT
  is_favorite,
  COUNT(*) AS moment_count
FROM moments
GROUP BY is_favorite
ORDER BY is_favorite;
```

### 5.6 任意項目の未入力

```sql
SELECT
  COUNT(*) FILTER (WHERE time_label IS NULL) AS time_label_null_count,
  COUNT(*) FILTER (WHERE subject IS NULL) AS subject_null_count,
  COUNT(*) FILTER (WHERE description IS NULL) AS description_null_count,
  COUNT(*) FILTER (WHERE memory_note IS NULL) AS memory_note_null_count
FROM moments;
```

### 5.7 登録日時と更新日時

```sql
SELECT
  id,
  title,
  created_at,
  updated_at
FROM moments
WHERE created_at <> updated_at
ORDER BY id;
```

### 5.8 試合ごとの場面数

```sql
SELECT
  matches.id,
  matches.home_team_code,
  matches.away_team_code,
  matches.match_date,
  COUNT(moments.id) AS moment_count
FROM matches
LEFT JOIN moments
  ON moments.match_id = matches.id
GROUP BY
  matches.id,
  matches.home_team_code,
  matches.away_team_code,
  matches.match_date
ORDER BY matches.match_date, matches.id;
```

### 5.9 場面が関連しない試合

```sql
SELECT
  matches.id,
  matches.home_team_code,
  matches.away_team_code,
  matches.match_date
FROM matches
LEFT JOIN moments
  ON moments.match_id = matches.id
WHERE moments.id IS NULL
ORDER BY matches.match_date, matches.id;
```

### 5.10 孤立した場面

```sql
SELECT
  moments.id,
  moments.title,
  moments.match_id
FROM moments
LEFT JOIN matches
  ON matches.id = moments.match_id
WHERE matches.id IS NULL;
```

期待値は 0 件である。

### 5.11 外部キーを含むデータ

```sql
SELECT
  moments.id,
  moments.title,
  moments.moment_type,
  matches.home_team_code,
  matches.away_team_code,
  matches.match_date
FROM moments
INNER JOIN matches
  ON matches.id = moments.match_id
ORDER BY moments.id;
```

### 5.12 制約

```sql
SELECT
  table_name,
  constraint_name,
  constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'public'
  AND table_name IN ('matches', 'moments')
ORDER BY table_name, constraint_name;
```

### 5.13 インデックス

```sql
SELECT
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('matches', 'moments')
ORDER BY tablename, indexname;
```

## 6. 画面で確認する内容

`demo.sql` を適用した後は、次を確認する。

- 試合一覧が 2 ページに分かれる
- 場面一覧が 4 ページに分かれる
- 全チームで試合を絞り込める
- 全種類で場面を絞り込める
- お気に入りのみで絞り込める
- キーワード検索で複数件が表示される
- 複数条件を組み合わせて絞り込める
- 試合日順と登録日時順で表示順が変わる
- 任意項目が未入力でもレイアウトが崩れない
- 場面が関連しない試合で空状態が表示される

## 7. 更新方針

スキーマ変更が必要になった場合は、既存のマイグレーションを書き換えず、新しい連番の SQL ファイルを追加する。  
開発初期にマイグレーションが未共有・未適用である場合のみ、既存ファイルの修正を検討する。

開発確認用データの変更は `development.sql` へ反映する。  
公開デモの初期状態を変更する場合は `demo.sql` へ反映する。

アプリケーションから実行する参照・更新 SQL は、本ディレクトリではなく `src/server/data-access` 配下へ記述する。
