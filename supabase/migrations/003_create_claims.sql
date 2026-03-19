-- Migration 003: claims table (N:1 with cases)

CREATE TABLE claims (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id              uuid        NOT NULL REFERENCES cases (id) ON DELETE CASCADE,
  title                text        NOT NULL,
  allegation           text        NOT NULL,
  our_position         text,
  documentation_status text        DEFAULT 'requires-review'
                                     CHECK (documentation_status IN ('well-supported', 'partially-supported', 'incomplete', 'requires-review')),
  amount_sought        numeric,
  status               text        DEFAULT 'active'
                                     CHECK (status IN ('active', 'withdrawn', 'disputed', 'resolved')),
  lovdata_refs         jsonb       DEFAULT '[]',
  created_at           timestamptz DEFAULT now(),
  updated_at           timestamptz DEFAULT now()
);

CREATE INDEX idx_claims_case_id ON claims (case_id);

CREATE TRIGGER trg_claims_updated_at
  BEFORE UPDATE ON claims
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
