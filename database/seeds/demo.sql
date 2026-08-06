-- 公開デモと公開環境のリセットに使用するデータを初期状態へ戻す。
-- 2025/26 Premier League の実際の試合記録をある程度参考にしている。
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
    'burnley',
    'sunderland',
    DATE '2025-08-23',
    2,
    0,
    TIMESTAMPTZ '2026-06-01 09:00:00+09',
    TIMESTAMPTZ '2026-06-01 09:00:00+09'
  ),
  (
    'aston-villa',
    'newcastle-united',
    DATE '2025-08-16',
    0,
    0,
    TIMESTAMPTZ '2026-06-01 16:00:00+09',
    TIMESTAMPTZ '2026-06-01 16:00:00+09'
  ),
  (
    'brighton-and-hove-albion',
    'fulham',
    DATE '2025-08-16',
    1,
    1,
    TIMESTAMPTZ '2026-06-01 23:00:00+09',
    TIMESTAMPTZ '2026-06-01 23:00:00+09'
  ),
  (
    'nottingham-forest',
    'brentford',
    DATE '2025-08-17',
    3,
    1,
    TIMESTAMPTZ '2026-06-03 06:00:00+09',
    TIMESTAMPTZ '2026-06-05 09:00:00+09'
  ),
  (
    'sunderland',
    'west-ham-united',
    DATE '2025-08-16',
    3,
    0,
    TIMESTAMPTZ '2026-06-03 13:00:00+09',
    TIMESTAMPTZ '2026-06-03 13:00:00+09'
  ),
  (
    'tottenham-hotspur',
    'burnley',
    DATE '2025-08-16',
    3,
    0,
    TIMESTAMPTZ '2026-06-02 13:00:00+09',
    TIMESTAMPTZ '2026-06-02 13:00:00+09'
  ),
  (
    'wolverhampton-wanderers',
    'manchester-city',
    DATE '2025-08-16',
    0,
    4,
    TIMESTAMPTZ '2026-06-03 20:00:00+09',
    TIMESTAMPTZ '2026-06-03 20:00:00+09'
  ),
  (
    'chelsea',
    'crystal-palace',
    DATE '2025-08-17',
    0,
    0,
    TIMESTAMPTZ '2026-06-04 03:00:00+09',
    TIMESTAMPTZ '2026-06-04 03:00:00+09'
  ),
  (
    'manchester-united',
    'arsenal',
    DATE '2025-08-17',
    0,
    1,
    TIMESTAMPTZ '2026-06-04 10:00:00+09',
    TIMESTAMPTZ '2026-06-04 10:00:00+09'
  ),
  (
    'leeds-united',
    'everton',
    DATE '2025-08-18',
    1,
    0,
    TIMESTAMPTZ '2026-06-04 10:00:00+09',
    TIMESTAMPTZ '2026-06-04 10:00:00+09'
  ),
  (
    'brighton-and-hove-albion',
    'manchester-city',
    DATE '2025-08-31',
    2,
    1,
    TIMESTAMPTZ '2026-06-04 17:00:00+09',
    TIMESTAMPTZ '2026-06-06 20:00:00+09'
  ),
  (
    'liverpool',
    'arsenal',
    DATE '2025-08-31',
    1,
    0,
    TIMESTAMPTZ '2026-06-05 00:00:00+09',
    TIMESTAMPTZ '2026-06-05 00:00:00+09'
  ),
  (
    'fulham',
    'manchester-city',
    DATE '2025-12-02',
    4,
    5,
    TIMESTAMPTZ '2026-06-06 07:00:00+09',
    TIMESTAMPTZ '2026-06-06 07:00:00+09'
  ),
  (
    'leeds-united',
    'liverpool',
    DATE '2025-12-06',
    3,
    3,
    TIMESTAMPTZ '2026-06-06 14:00:00+09',
    TIMESTAMPTZ '2026-06-06 14:00:00+09'
  ),
  (
    'manchester-united',
    'afc-bournemouth',
    DATE '2025-12-15',
    4,
    4,
    TIMESTAMPTZ '2026-06-05 14:00:00+09',
    TIMESTAMPTZ '2026-06-07 17:00:00+09'
  ),
  (
    'wolverhampton-wanderers',
    'west-ham-united',
    DATE '2026-01-03',
    3,
    0,
    TIMESTAMPTZ '2026-06-06 21:00:00+09',
    TIMESTAMPTZ '2026-06-06 21:00:00+09'
  ),
  (
    'fulham',
    'liverpool',
    DATE '2026-01-04',
    2,
    2,
    TIMESTAMPTZ '2026-06-07 04:00:00+09',
    TIMESTAMPTZ '2026-06-07 04:00:00+09'
  ),
  (
    'newcastle-united',
    'leeds-united',
    DATE '2026-01-07',
    4,
    3,
    TIMESTAMPTZ '2026-06-07 11:00:00+09',
    TIMESTAMPTZ '2026-06-07 11:00:00+09'
  ),
  (
    'arsenal',
    'manchester-united',
    DATE '2026-01-25',
    2,
    3,
    TIMESTAMPTZ '2026-06-07 11:00:00+09',
    TIMESTAMPTZ '2026-06-09 14:00:00+09'
  ),
  (
    'newcastle-united',
    'everton',
    DATE '2026-02-28',
    2,
    3,
    TIMESTAMPTZ '2026-06-07 18:00:00+09',
    TIMESTAMPTZ '2026-06-07 18:00:00+09'
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
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'burnley'
        AND away_team_code = 'sunderland'
        AND match_date = DATE '2025-08-23'
    ),
    '均衡を破った後半開始直後の先制ゴール',
    'goal',
    '後半',
    'Josh Cullen',
    '後半開始直後にゴールを決め、昇格組同士の一戦で Burnley を先行させた。',
    '拮抗していた試合を動かし、ホームでのシーズン初勝利につながった。',
    TRUE,
    TIMESTAMPTZ '2026-06-15 09:00:00+09',
    TIMESTAMPTZ '2026-06-15 09:00:00+09'
  ),
  (
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'burnley'
        AND away_team_code = 'sunderland'
        AND match_date = DATE '2025-08-23'
    ),
    '相手の攻撃を封じて守り切ったクリーンシート',
    'defense',
    '試合全体',
    'Burnley',
    'Sunderland の攻撃を無得点に抑え、Josh Cullen と Jaidon Anthony の得点を勝利へ結び付けた。',
    '昇格後のホーム初戦で、攻守のまとまりを示した完封だった。',
    FALSE,
    TIMESTAMPTZ '2026-06-16 14:00:00+09',
    TIMESTAMPTZ '2026-06-16 14:00:00+09'
  ),
  (
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'burnley'
        AND away_team_code = 'sunderland'
        AND match_date = DATE '2025-08-23'
    ),
    'ホーム初戦でシーズン初勝利を迎えた歓喜',
    'reaction',
    '試合終了後',
    'Burnley の選手とサポーター',
    '2-0 の勝利が決まると、Turf Moor で選手とサポーターがシーズン初勝利を分かち合った。',
    'プレミアリーグ復帰後の手応えを感じさせるホームの空気が印象に残った。',
    TRUE,
    TIMESTAMPTZ '2026-06-17 19:00:00+09',
    TIMESTAMPTZ '2026-06-20 21:00:00+09'
  ),
  (
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'brighton-and-hove-albion'
        AND away_team_code = 'fulham'
        AND match_date = DATE '2025-08-16'
    ),
    '落ち着いて決めた後半の先制ペナルティーキック',
    'goal',
    '55分',
    'Matt O''Riley',
    'ペナルティーキックを決め、均衡していた試合で Brighton を先行させた。',
    NULL,
    FALSE,
    TIMESTAMPTZ '2026-06-19 00:00:00+09',
    TIMESTAMPTZ '2026-06-19 00:00:00+09'
  ),
  (
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'brighton-and-hove-albion'
        AND away_team_code = 'fulham'
        AND match_date = DATE '2025-08-16'
    ),
    '終了間際に勝点を持ち帰った同点ゴール',
    'goal',
    '90+7分',
    'Rodrigo Muniz',
    '途中出場し、アディショナルタイムに同点ゴールを決めた。',
    '最後まで攻撃を続けた Fulham の粘りが結果につながった。',
    TRUE,
    TIMESTAMPTZ '2026-06-20 05:00:00+09',
    TIMESTAMPTZ '2026-06-20 05:00:00+09'
  ),
  (
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'nottingham-forest'
        AND away_team_code = 'brentford'
        AND match_date = DATE '2025-08-17'
    ),
    '最終ラインの頭上を越えた正確なクロス',
    'pass',
    '42分',
    'Morgan Gibbs-White',
    '相手の寄せを外して浮き球のクロスを送り、Dan Ndoye のダイビングヘッドを導いた。',
    '受け手だけでなく、クロスを上げるまでの判断と精度が印象的だった。',
    FALSE,
    TIMESTAMPTZ '2026-06-20 11:00:00+09',
    TIMESTAMPTZ '2026-06-20 11:00:00+09'
  ),
  (
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'nottingham-forest'
        AND away_team_code = 'brentford'
        AND match_date = DATE '2025-08-17'
    ),
    '前半のうちに勝負を決定づけた冷静なフィニッシュ',
    'goal',
    '45+2分',
    'Chris Wood',
    'Elliot Anderson のパスから抜け出し、ゴールキーパーをかわして 3 点目を決めた。',
    '前半のうちに勝負を大きく引き寄せた落ち着いた得点だった。',
    TRUE,
    TIMESTAMPTZ '2026-06-21 16:00:00+09',
    TIMESTAMPTZ '2026-06-21 16:00:00+09'
  ),
  (
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'sunderland'
        AND away_team_code = 'west-ham-united'
        AND match_date = DATE '2025-08-16'
    ),
    '復帰戦の熱気を一気に高めた先制ヘッド',
    'goal',
    '後半',
    'Eliezer Mayenda',
    '高い打点のヘディングで、8 シーズンぶりのプレミアリーグ復帰戦に先制点をもたらした。',
    'Stadium of Light の期待が歓喜へ変わった瞬間だった。',
    TRUE,
    TIMESTAMPTZ '2026-06-22 21:00:00+09',
    TIMESTAMPTZ '2026-06-25 23:00:00+09'
  ),
  (
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'sunderland'
        AND away_team_code = 'west-ham-united'
        AND match_date = DATE '2025-08-16'
    ),
    '3人の初出場選手が記録した3ゴール',
    'other',
    NULL,
    'Eliezer Mayenda、Dan Ballard、Wilson Isidor',
    NULL,
    'プレミアリーグ初出場の 3 選手が同じ試合で得点し、昇格チームの新しいシーズンを象徴する記録になった。',
    FALSE,
    TIMESTAMPTZ '2026-06-24 02:00:00+09',
    TIMESTAMPTZ '2026-06-24 02:00:00+09'
  ),
  (
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'tottenham-hotspur'
        AND away_team_code = 'burnley'
        AND match_date = DATE '2025-08-16'
    ),
    'クロスへ合わせた鮮やかなシザーキック',
    'goal',
    '後半',
    'Richarlison',
    'Mohammed Kudus のクロスへ身体をひねって合わせ、シザーキックで 2 点目を決めた。',
    '時間をかけたチームの組み立てを、思い切りのよいフィニッシュで完結させた。',
    TRUE,
    TIMESTAMPTZ '2026-06-25 07:00:00+09',
    TIMESTAMPTZ '2026-06-25 07:00:00+09'
  ),
  (
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'tottenham-hotspur'
        AND away_team_code = 'burnley'
        AND match_date = DATE '2025-08-16'
    ),
    'ゴールキーパーの8秒ルールが初適用された場面',
    'decision',
    '4分',
    'Martin Dubravka',
    'ボールを 8 秒より長く保持したとして、相手にコーナーキックが与えられた。',
    '新しいルールの運用が実際の試合で示された場面として記憶に残った。',
    FALSE,
    TIMESTAMPTZ '2026-06-25 13:00:00+09',
    TIMESTAMPTZ '2026-06-25 13:00:00+09'
  ),
  (
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'wolverhampton-wanderers'
        AND away_team_code = 'manchester-city'
        AND match_date = DATE '2025-08-16'
    ),
    'コンパクトな守備を崩した浮き球のパス',
    'pass',
    '前半',
    'Tijjani Reijnders',
    '中盤を前向きに突破し、走り込む Rico Lewis へ浮き球のパスを通して先制点につながる流れをつくった。',
    '一つの判断で守備ブロックの間を切り開いたプレーだった。',
    TRUE,
    TIMESTAMPTZ '2026-06-26 18:00:00+09',
    TIMESTAMPTZ '2026-06-26 18:00:00+09'
  ),
  (
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'wolverhampton-wanderers'
        AND away_team_code = 'manchester-city'
        AND match_date = DATE '2025-08-16'
    ),
    '中盤から前進して攻撃を加速させたボール運び',
    'dribble',
    '前半',
    'Tijjani Reijnders',
    '中盤からボールを持ち運んで攻撃へ加わり、折り返しを受けてプレミアリーグ初得点を決めた。',
    '前進するドリブルとゴール前への走り込みが一つにつながった。',
    FALSE,
    TIMESTAMPTZ '2026-06-27 23:00:00+09',
    TIMESTAMPTZ '2026-06-27 23:00:00+09'
  ),
  (
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'chelsea'
        AND away_team_code = 'crystal-palace'
        AND match_date = DATE '2025-08-17'
    ),
    '壁との距離を巡って取り消された直接フリーキック',
    'decision',
    '前半10分以内',
    'Eberechi Eze と壁際に立った Crystal Palace の選手',
    '直接フリーキックはゴールに入ったが、味方選手が相手の壁へ近づきすぎていたとして取り消された。',
    NULL,
    FALSE,
    TIMESTAMPTZ '2026-06-29 04:00:00+09',
    TIMESTAMPTZ '2026-07-02 06:00:00+09'
  ),
  (
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'manchester-united'
        AND away_team_code = 'arsenal'
        AND match_date = DATE '2025-08-17'
    ),
    'ゴール隅へ向かうシュートをそらした指先のセーブ',
    'save',
    '前半',
    'David Raya',
    'Matheus Cunha の低いシュートへ反応し、指先でゴールの外へそらした。',
    '押し込まれる時間帯で失点を防ぎ、1 点差の勝利を支えた。',
    TRUE,
    TIMESTAMPTZ '2026-06-29 10:00:00+09',
    TIMESTAMPTZ '2026-06-29 10:00:00+09'
  ),
  (
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'manchester-united'
        AND away_team_code = 'arsenal'
        AND match_date = DATE '2025-08-17'
    ),
    '支配よりも切り替えと守備を優先した試合運び',
    'tactical',
    '試合全体',
    'Arsenal',
    'Manchester United の前向きなプレスに対し、通常よりも直接的な攻撃と守備を重視した試合運びで対応した。',
    '理想の形でなくても勝点 3 を守り切る対応力が表れた。',
    FALSE,
    TIMESTAMPTZ '2026-06-30 15:00:00+09',
    TIMESTAMPTZ '2026-06-30 15:00:00+09'
  ),
  (
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'leeds-united'
        AND away_team_code = 'everton'
        AND match_date = DATE '2025-08-18'
    ),
    '復帰初戦を勝利へ導いた終盤のペナルティーキック',
    'goal',
    '86分',
    'Lukas Nmecha',
    '途中出場し、ペナルティーキックを決めて Leeds のプレミアリーグ復帰戦を勝利へ導いた。',
    NULL,
    TRUE,
    TIMESTAMPTZ '2026-07-01 20:00:00+09',
    TIMESTAMPTZ '2026-07-01 20:00:00+09'
  ),
  (
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'brighton-and-hove-albion'
        AND away_team_code = 'manchester-city'
        AND match_date = DATE '2025-08-31'
    ),
    '後半の配置変更で流れを変えた試合運び',
    'tactical',
    '後半',
    'Brighton & Hove Albion',
    '1 点を追う後半に攻撃の圧力を高め、同点に追いついてから逆転するまで試合の主導権を握った。',
    '前半と後半で試合の景色が大きく変わったことが印象に残った。',
    FALSE,
    TIMESTAMPTZ '2026-07-03 01:00:00+09',
    TIMESTAMPTZ '2026-07-03 01:00:00+09'
  ),
  (
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'brighton-and-hove-albion'
        AND away_team_code = 'manchester-city'
        AND match_date = DATE '2025-08-31'
    ),
    '最終盤に抜け出して決勝点へつなげたボール運び',
    'dribble',
    '89分',
    'Brajan Gruda',
    '最終ラインの背後へ抜け出し、ゴールキーパーとの一対一でも落ち着いてボールを運んで決勝点を決めた。',
    '前へ出る判断と落ち着いた運びで、強豪相手の逆転を完成させた。',
    TRUE,
    TIMESTAMPTZ '2026-07-04 06:00:00+09',
    TIMESTAMPTZ '2026-07-04 06:00:00+09'
  ),
  (
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'liverpool'
        AND away_team_code = 'arsenal'
        AND match_date = DATE '2025-08-31'
    ),
    '32ヤードから試合を決めた直接フリーキック',
    'goal',
    '83分',
    'Dominik Szoboszlai',
    '長い距離から直接フリーキックをゴールへ沈め、均衡していた試合の決勝点を決めた。',
    '一つのキックだけで接戦を決着させた技術と大胆さが印象的だった。',
    TRUE,
    TIMESTAMPTZ '2026-07-04 12:00:00+09',
    TIMESTAMPTZ '2026-07-04 12:00:00+09'
  ),
  (
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'fulham'
        AND away_team_code = 'manchester-city'
        AND match_date = DATE '2025-12-02'
    ),
    'プレミアリーグ通算100得点目となったゴール',
    'goal',
    '17分',
    'Erling Haaland',
    '先制点を決め、プレミアリーグ史上最速で通算 100 得点に到達した。',
    '大量得点の試合の始まりとなった、記録にも残るゴールだった。',
    TRUE,
    TIMESTAMPTZ '2026-07-05 17:00:00+09',
    TIMESTAMPTZ '2026-07-08 19:00:00+09'
  ),
  (
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'fulham'
        AND away_team_code = 'manchester-city'
        AND match_date = DATE '2025-12-02'
    ),
    '4点差を1点差まで縮めた追撃とスタンドの熱気',
    'reaction',
    '後半',
    NULL,
    'Fulham が連続得点で 5-4 まで追い上げるたびに、Craven Cottage の期待が大きくなった。',
    '大差がついても終わらず、最後まで同点の可能性を感じさせた雰囲気が印象に残った。',
    FALSE,
    TIMESTAMPTZ '2026-07-06 22:00:00+09',
    TIMESTAMPTZ '2026-07-06 22:00:00+09'
  ),
  (
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'fulham'
        AND away_team_code = 'manchester-city'
        AND match_date = DATE '2025-12-02'
    ),
    '同点を防いだゴールライン上のクリア',
    'defense',
    '試合終盤',
    'Josko Gvardiol',
    'Josh King のシュートをゴールライン付近でかき出した。',
    '9 得点が生まれた試合で、最後に勝利を守り切った守備だった。',
    TRUE,
    TIMESTAMPTZ '2026-07-08 03:00:00+09',
    TIMESTAMPTZ '2026-07-08 03:00:00+09'
  ),
  (
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'leeds-united'
        AND away_team_code = 'liverpool'
        AND match_date = DATE '2025-12-06'
    ),
    'アディショナルタイムに飛び出した二度目の同点ゴール',
    'goal',
    '90+6分',
    'Ao Tanaka',
    '終盤に再びリードされた後、アディショナルタイムにゴールを決めて 3-3 とした。',
    '最後まで諦めなかった Leeds の試合を象徴する得点だった。',
    TRUE,
    TIMESTAMPTZ '2026-07-08 09:00:00+09',
    TIMESTAMPTZ '2026-07-08 09:00:00+09'
  ),
  (
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'leeds-united'
        AND away_team_code = 'liverpool'
        AND match_date = DATE '2025-12-06'
    ),
    '二度追いついたチームを包んだ試合終了間際の歓声',
    'reaction',
    '試合終了間際',
    'Elland Road のサポーター',
    '2 点差から追いつき、再びリードされた後にも同点へ戻した展開にスタンドが沸いた。',
    '結果だけでなく、何度でも立ち上がる空気が強く印象に残った。',
    FALSE,
    TIMESTAMPTZ '2026-07-09 14:00:00+09',
    TIMESTAMPTZ '2026-07-12 16:00:00+09'
  ),
  (
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'manchester-united'
        AND away_team_code = 'afc-bournemouth'
        AND match_date = DATE '2025-12-15'
    ),
    '両チームが立て続けに決めた直接フリーキック',
    'other',
    '後半',
    'Marcus Tavernier と Bruno Fernandes',
    'Tavernier が直接フリーキックで Bournemouth にリードをもたらし、その後 Fernandes も直接フリーキックで追いついた。',
    '同じ試合の短い時間に両チームのキッカーが技術を見せた。',
    TRUE,
    TIMESTAMPTZ '2026-07-10 19:00:00+09',
    TIMESTAMPTZ '2026-07-10 19:00:00+09'
  ),
  (
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'manchester-united'
        AND away_team_code = 'afc-bournemouth'
        AND match_date = DATE '2025-12-15'
    ),
    '8人目の得点者となった終盤の同点ゴール',
    'goal',
    '84分',
    'Junior Kroupi',
    '途中出場し、4-4 とするゴールを決めて、8人の異なる選手が得点する展開を締めくくった。',
    '最後まで勝敗の行方が分からない展開を生んだ。',
    FALSE,
    TIMESTAMPTZ '2026-07-12 00:00:00+09',
    TIMESTAMPTZ '2026-07-12 00:00:00+09'
  ),
  (
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'wolverhampton-wanderers'
        AND away_team_code = 'west-ham-united'
        AND match_date = DATE '2026-01-03'
    ),
    '逆を突かれながらも足で防いだ至近距離のヘディング',
    'save',
    '前半',
    'Alphonse Areola',
    'Tolu Arokodare のヘディングで逆を突かれながらも、足を残してゴールを防いだ。',
    '3 失点した試合の中でも、ゴールキーパーの反応速度が際立った。',
    FALSE,
    TIMESTAMPTZ '2026-07-13 05:00:00+09',
    TIMESTAMPTZ '2026-07-13 05:00:00+09'
  ),
  (
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'wolverhampton-wanderers'
        AND away_team_code = 'west-ham-united'
        AND match_date = DATE '2026-01-03'
    ),
    '枠内シュートを許さず守り切ったシーズン初の完封',
    'defense',
    '試合全体',
    'Wolverhampton Wanderers',
    'West Ham に枠内シュートを許さず、シーズン初勝利と初クリーンシートを同時に記録した。',
    NULL,
    TRUE,
    TIMESTAMPTZ '2026-07-13 11:00:00+09',
    TIMESTAMPTZ '2026-07-13 11:00:00+09'
  ),
  (
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'fulham'
        AND away_team_code = 'liverpool'
        AND match_date = DATE '2026-01-04'
    ),
    '30ヤードから突き刺した土壇場の同点ゴール',
    'goal',
    '90+7分',
    'Harrison Reed',
    'アディショナルタイムに約 30 ヤードの位置から右上隅へシュートを決め、2-2 の同点に追いついた。',
    'Liverpool が勝ち越した直後に生まれた、試合を締めくくる強烈な一撃だった。',
    TRUE,
    TIMESTAMPTZ '2026-07-14 16:00:00+09',
    TIMESTAMPTZ '2026-07-17 18:00:00+09'
  ),
  (
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'fulham'
        AND away_team_code = 'liverpool'
        AND match_date = DATE '2026-01-04'
    ),
    'VAR の確認で認められた先制ゴール',
    'decision',
    '17分',
    'Harry Wilson',
    '一度はオフサイドと判定されたが、VAR の確認後に先制ゴールとして認められた。',
    '判定の変更によって試合の流れが動き出した。',
    FALSE,
    TIMESTAMPTZ '2026-07-15 21:00:00+09',
    TIMESTAMPTZ '2026-07-15 21:00:00+09'
  ),
  (
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'newcastle-united'
        AND away_team_code = 'leeds-united'
        AND match_date = DATE '2026-01-07'
    ),
    'プレミアリーグ史上最も遅い時間に生まれた決勝点',
    'goal',
    '90+12分',
    'Harvey Barnes',
    'ゴール前でボールを収めてシュートを決め、3度リードを許した Newcastle の逆転勝利を完成させた。',
    '101分48秒に記録された、リーグ史上最も遅い決勝点として強く印象に残った。',
    TRUE,
    TIMESTAMPTZ '2026-07-17 02:00:00+09',
    TIMESTAMPTZ '2026-07-17 02:00:00+09'
  ),
  (
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'newcastle-united'
        AND away_team_code = 'leeds-united'
        AND match_date = DATE '2026-01-07'
    ),
    'アディショナルタイムの連続得点で生まれた大逆転の歓喜',
    'reaction',
    '90分以降',
    'Newcastle United の選手とサポーター',
    '終盤まで 2-3 で追う展開から、ペナルティーキックで追いつき、さらに決勝点を奪って 4-3 へひっくり返した。',
    '試合終了直前に二度スタンドが揺れた劇的な結末だった。',
    TRUE,
    TIMESTAMPTZ '2026-07-18 07:00:00+09',
    TIMESTAMPTZ '2026-07-18 07:00:00+09'
  ),
  (
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'arsenal'
        AND away_team_code = 'manchester-united'
        AND match_date = DATE '2026-01-25'
    ),
    '同点直後に決めた25ヤードからのカーブシュート',
    'goal',
    '87分',
    'Matheus Cunha',
    'Arsenal が追いついた直後、ペナルティーエリア外から右足でカーブをかけて決勝点を決めた。',
    '試合の流れが Arsenal へ傾いた直後に生まれた、強い意志を感じるゴールだった。',
    TRUE,
    TIMESTAMPTZ '2026-07-18 13:00:00+09',
    TIMESTAMPTZ '2026-07-18 13:00:00+09'
  ),
  (
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'arsenal'
        AND away_team_code = 'manchester-united'
        AND match_date = DATE '2026-01-25'
    ),
    '至近距離のヘディングをはじき出した序盤のセーブ',
    'save',
    '前半',
    'Senne Lammens',
    'Martin Zubimendi の近距離からのヘディングへ反応し、クロスバーの上へはじき出した。',
    '早い時間の失点を防ぎ、その後の逆転につながる時間をつくった。',
    FALSE,
    TIMESTAMPTZ '2026-07-19 18:00:00+09',
    TIMESTAMPTZ '2026-07-22 20:00:00+09'
  ),
  (
    (
      SELECT
        id
      FROM
        matches
      WHERE
        home_team_code = 'newcastle-united'
        AND away_team_code = 'everton'
        AND match_date = DATE '2026-02-28'
    ),
    '勝利を守ったアディショナルタイムの超反応セーブ',
    'save',
    '90+4分',
    'Jordan Pickford',
    'Sandro Tonali の強烈なボレーへ反応し、ボールをクロスバーに当てて外へ逃がした。',
    '同点になりかねない最後のシュートを防ぎ、3-2 の勝利を守り切った。',
    TRUE,
    TIMESTAMPTZ '2026-07-20 23:00:00+09',
    TIMESTAMPTZ '2026-07-20 23:00:00+09'
  );

COMMIT;
