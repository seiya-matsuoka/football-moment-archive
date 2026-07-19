# Database

## 1. 概要

本ディレクトリでは、Football Moment Archive の PostgreSQL スキーマと開発確認用データを SQL ファイルで管理する。

```text
database/
├─ migrations/
│  └─ 001_create_tables.sql
└─ seeds/
   └─ development.sql
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

`seeds/development.sql` は、開発確認用の試合と場面を投入する。

実行時に次の処理を行う。

1. `matches` と `moments` の既存データを削除
2. Identity Column の採番を 1 から再開
3. 試合 8 件を登録
4. 場面 10 件を登録

本ファイルは繰り返し実行可能である。  
既存データをすべて削除するため、保持が必要な DB では実行しない。

## 4. 適用手順

1. 対象となる DB とブランチを確認する
2. `migrations/001_create_tables.sql` を実行する
3. `seeds/development.sql` を実行する
4. 確認 SQL を実行する

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

```text
match_count = 8
moment_count = 10
```

### 5.3 外部キーを含むデータ

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

### 5.4 制約

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

### 5.5 インデックス

```sql
SELECT
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('matches', 'moments')
ORDER BY tablename, indexname;
```

## 6. 更新方針

スキーマ変更が必要になった場合は、既存のマイグレーションを書き換えず、新しい連番の SQL ファイルを追加する。  
開発初期にマイグレーションが未共有・未適用である場合のみ、既存ファイルの修正を検討する。

シードデータの変更は `development.sql` へ反映する。  
アプリケーションから実行する参照・更新 SQL は、本ディレクトリではなく `src/server/data-access` 配下へ記述する。
