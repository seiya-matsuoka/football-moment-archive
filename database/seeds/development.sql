-- 開発確認用データを初期状態へ戻す。
-- 実行すると matches と moments の既存データをすべて削除する。
BEGIN;

TRUNCATE TABLE moments,
matches RESTART IDENTITY;

INSERT INTO
  matches (
    home_team_code,
    away_team_code,
    match_date,
    home_score,
    away_score,
    created_at,
    updated_at
  )
VALUES
  (
    'arsenal',
    'liverpool',
    DATE '2025-08-31',
    2,
    2,
    TIMESTAMPTZ '2026-01-05 10:00:00+09',
    TIMESTAMPTZ '2026-01-05 10:00:00+09'
  ),
  (
    'manchester-city',
    'manchester-united',
    DATE '2025-09-14',
    3,
    0,
    TIMESTAMPTZ '2026-01-06 11:00:00+09',
    TIMESTAMPTZ '2026-01-06 11:00:00+09'
  ),
  (
    'chelsea',
    'sunderland',
    DATE '2025-10-25',
    1,
    1,
    TIMESTAMPTZ '2026-01-07 12:00:00+09',
    TIMESTAMPTZ '2026-01-07 12:00:00+09'
  ),
  (
    'newcastle-united',
    'tottenham-hotspur',
    DATE '2025-12-02',
    2,
    1,
    TIMESTAMPTZ '2026-01-08 13:00:00+09',
    TIMESTAMPTZ '2026-01-08 13:00:00+09'
  ),
  (
    'leeds-united',
    'burnley',
    DATE '2026-01-17',
    0,
    0,
    TIMESTAMPTZ '2026-01-09 14:00:00+09',
    TIMESTAMPTZ '2026-01-09 14:00:00+09'
  ),
  (
    'brighton-and-hove-albion',
    'crystal-palace',
    DATE '2026-02-08',
    1,
    2,
    TIMESTAMPTZ '2026-01-10 15:00:00+09',
    TIMESTAMPTZ '2026-01-10 15:00:00+09'
  ),
  (
    'aston-villa',
    'wolverhampton-wanderers',
    NULL,
    NULL,
    NULL,
    TIMESTAMPTZ '2026-01-11 16:00:00+09',
    TIMESTAMPTZ '2026-01-11 16:00:00+09'
  ),
  (
    'everton',
    'west-ham-united',
    DATE '2026-03-21',
    NULL,
    NULL,
    TIMESTAMPTZ '2026-01-12 17:00:00+09',
    TIMESTAMPTZ '2026-01-12 17:00:00+09'
  );

INSERT INTO
  moments (
    match_id,
    title,
    moment_type,
    time_label,
    subject,
    description,
    memory_note,
    is_favorite,
    created_at,
    updated_at
  )
VALUES
  (
    1,
    '終了間際に生まれた同点ゴール',
    'goal',
    '89分',
    'Arsenal',
    '右サイドからのクロスに合わせ、試合終盤に同点へ追いついた。',
    '劣勢の中でも攻撃を続けた流れが結果につながった。',
    TRUE,
    TIMESTAMPTZ '2026-02-01 09:00:00+09',
    TIMESTAMPTZ '2026-02-01 09:00:00+09'
  ),
  (
    1,
    '至近距離のシュートを止めたセーブ',
    'save',
    '72分',
    'Liverpool のゴールキーパー',
    'ペナルティーエリア内からのシュートに素早く反応した。',
    NULL,
    FALSE,
    TIMESTAMPTZ '2026-02-02 10:00:00+09',
    TIMESTAMPTZ '2026-02-02 10:00:00+09'
  ),
  (
    1,
    '同点直後に広がったスタジアムの熱気',
    'reaction',
    '試合終了直前',
    'ホームサポーター',
    NULL,
    '得点そのものだけでなく、会場全体の反応が強く印象に残った。',
    TRUE,
    TIMESTAMPTZ '2026-02-03 11:00:00+09',
    TIMESTAMPTZ '2026-02-03 11:00:00+09'
  ),
  (
    2,
    '後半開始時の配置変更',
    'tactical',
    '後半開始',
    'Manchester City',
    '中盤の立ち位置を変更し、前線への縦パスを増やした。',
    '流れを変える意図が画面上でも分かりやすかった。',
    FALSE,
    TIMESTAMPTZ '2026-02-04 12:00:00+09',
    TIMESTAMPTZ '2026-02-04 12:00:00+09'
  ),
  (
    2,
    'カウンターを止めた戻りの守備',
    'defense',
    '64分',
    'Manchester United',
    '数的不利になりかけた場面で最終ラインが素早く戻った。',
    NULL,
    FALSE,
    TIMESTAMPTZ '2026-02-05 13:00:00+09',
    TIMESTAMPTZ '2026-02-05 13:00:00+09'
  ),
  (
    3,
    '守備の間を通した縦パス',
    'pass',
    '38分',
    'Chelsea の中盤',
    '相手の中盤と最終ラインの間へ正確な縦パスを通した。',
    '一つのパスで攻撃の速度が変わった。',
    TRUE,
    TIMESTAMPTZ '2026-02-06 14:00:00+09',
    TIMESTAMPTZ '2026-02-06 14:00:00+09'
  ),
  (
    4,
    'タッチライン際からのドリブル突破',
    'dribble',
    '51分',
    'Tottenham Hotspur のウイング',
    '狭い位置で相手をかわし、ゴール前までボールを運んだ。',
    NULL,
    FALSE,
    TIMESTAMPTZ '2026-02-07 15:00:00+09',
    TIMESTAMPTZ '2026-02-07 15:00:00+09'
  ),
  (
    5,
    'ペナルティーエリア内の判定',
    'decision',
    '76分',
    '主審',
    '接触後もプレー続行となり、試合の流れが途切れなかった。',
    '判定後の両チームの反応を含めて印象に残った。',
    FALSE,
    TIMESTAMPTZ '2026-02-08 16:00:00+09',
    TIMESTAMPTZ '2026-02-08 16:00:00+09'
  ),
  (
    6,
    '試合終了後の選手同士のやり取り',
    'other',
    '試合終了後',
    NULL,
    NULL,
    NULL,
    FALSE,
    TIMESTAMPTZ '2026-02-09 17:00:00+09',
    TIMESTAMPTZ '2026-02-09 17:00:00+09'
  ),
  (
    8,
    '試合序盤の連続セーブ',
    'save',
    '12分',
    'Everton のゴールキーパー',
    '短い時間に続いた二本のシュートをどちらも防いだ。',
    'スコア未入力の試合に関連する場面の表示確認にも使用する。',
    TRUE,
    TIMESTAMPTZ '2026-02-10 18:00:00+09',
    TIMESTAMPTZ '2026-02-10 18:00:00+09'
  );

COMMIT;
