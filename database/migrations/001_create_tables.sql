-- Football Moment Archive の初期テーブルを作成する。
-- 本ファイルは新規 DB に対して 1 回だけ実行する。
BEGIN;

CREATE TABLE matches (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  home_team_code VARCHAR(32) NOT NULL,
  away_team_code VARCHAR(32) NOT NULL,
  match_date DATE,
  home_score SMALLINT,
  away_score SMALLINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT matches_home_team_code_allowed_check CHECK (
    home_team_code IN (
      'arsenal',
      'aston-villa',
      'afc-bournemouth',
      'brentford',
      'brighton-and-hove-albion',
      'burnley',
      'chelsea',
      'crystal-palace',
      'everton',
      'fulham',
      'leeds-united',
      'liverpool',
      'manchester-city',
      'manchester-united',
      'newcastle-united',
      'nottingham-forest',
      'sunderland',
      'tottenham-hotspur',
      'west-ham-united',
      'wolverhampton-wanderers'
    )
  ),
  CONSTRAINT matches_away_team_code_allowed_check CHECK (
    away_team_code IN (
      'arsenal',
      'aston-villa',
      'afc-bournemouth',
      'brentford',
      'brighton-and-hove-albion',
      'burnley',
      'chelsea',
      'crystal-palace',
      'everton',
      'fulham',
      'leeds-united',
      'liverpool',
      'manchester-city',
      'manchester-united',
      'newcastle-united',
      'nottingham-forest',
      'sunderland',
      'tottenham-hotspur',
      'west-ham-united',
      'wolverhampton-wanderers'
    )
  ),
  CONSTRAINT matches_different_teams_check CHECK (home_team_code <> away_team_code),
  CONSTRAINT matches_match_date_range_check CHECK (
    match_date IS NULL
    OR match_date BETWEEN DATE '2025-08-16' AND DATE  '2026-05-24'
  ),
  CONSTRAINT matches_score_pair_check CHECK (
    (
      home_score IS NULL
      AND away_score IS NULL
    )
    OR (
      home_score IS NOT NULL
      AND away_score IS NOT NULL
    )
  ),
  CONSTRAINT matches_home_score_non_negative_check CHECK (
    home_score IS NULL
    OR home_score >= 0
  ),
  CONSTRAINT matches_away_score_non_negative_check CHECK (
    away_score IS NULL
    OR away_score >= 0
  )
);

CREATE TABLE moments (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  match_id INTEGER NOT NULL,
  title VARCHAR(80) NOT NULL,
  moment_type VARCHAR(32) NOT NULL,
  time_label VARCHAR(30),
  subject VARCHAR(100),
  description TEXT,
  memory_note TEXT,
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT moments_match_id_fkey FOREIGN KEY (match_id) REFERENCES matches (id) ON DELETE RESTRICT,
  CONSTRAINT moments_title_not_blank_check CHECK (CHAR_LENGTH(BTRIM (title)) BETWEEN 1 AND 80),
  CONSTRAINT moments_moment_type_allowed_check CHECK (
    moment_type IN (
      'goal',
      'save',
      'pass',
      'dribble',
      'defense',
      'tactical',
      'decision',
      'reaction',
      'other'
    )
  )
);

CREATE INDEX matches_home_team_code_idx ON matches (home_team_code);

CREATE INDEX matches_away_team_code_idx ON matches (away_team_code);

CREATE INDEX matches_match_date_idx ON matches (match_date);

CREATE INDEX matches_created_at_idx ON matches (created_at);

CREATE INDEX moments_match_id_idx ON moments (match_id);

CREATE INDEX moments_moment_type_idx ON moments (moment_type);

CREATE INDEX moments_created_at_idx ON moments (created_at);

COMMIT;
