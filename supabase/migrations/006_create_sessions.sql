-- Migration 006: sessions table (N:1 with cases)

CREATE TABLE sessions (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id            uuid        NOT NULL REFERENCES cases (id) ON DELETE CASCADE,
  started_at         timestamptz DEFAULT now(),
  ended_at           timestamptz,
  model_primary      text        NOT NULL,
  model_reviewer     text        NOT NULL,
  context_loaded     jsonb       DEFAULT '[]',
  facts_added        jsonb       DEFAULT '[]',
  facts_updated      jsonb       DEFAULT '[]',
  critique_output    text,
  summary_of_session text
);

CREATE INDEX idx_sessions_case_id ON sessions (case_id);
