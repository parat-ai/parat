-- Migration 001: cases table + shared set_updated_at() trigger function

-- Shared trigger function: sets updated_at = now() on every row update
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- cases table
CREATE TABLE cases (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title          text        NOT NULL,
  type           text        NOT NULL CHECK (type IN ('INVESTOR_DISPUTE')),
  status         text        NOT NULL DEFAULT 'pre-legal'
                               CHECK (status IN ('pre-legal', 'active', 'settled', 'closed')),
  jurisdiction   text        NOT NULL,
  plaintiff_name  text,
  plaintiff_type  text,
  defendant_name  text,
  defendant_type  text,
  exposure_amount numeric,
  currency       text        DEFAULT 'NOK',
  summary        text,
  opened_at      timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  mock_user_id   text        NOT NULL DEFAULT 'mock-user-001'
);

CREATE INDEX idx_cases_mock_user_id ON cases (mock_user_id);

CREATE TRIGGER trg_cases_updated_at
  BEFORE UPDATE ON cases
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
