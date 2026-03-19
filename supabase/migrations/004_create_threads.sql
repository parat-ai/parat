-- Migration 004: threads table (N:1 with claims)

CREATE TABLE threads (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id    uuid        NOT NULL REFERENCES claims (id) ON DELETE CASCADE,
  type        text        NOT NULL CHECK (type IN ('timeline', 'evidence', 'arguments', 'open_questions', 'insurance')),
  ai_critique text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

CREATE INDEX idx_threads_claim_id ON threads (claim_id);

CREATE TRIGGER trg_threads_updated_at
  BEFORE UPDATE ON threads
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
