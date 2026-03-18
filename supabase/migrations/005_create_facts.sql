-- Migration 005: facts table (N:1 with threads)

CREATE TABLE facts (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id   uuid        NOT NULL REFERENCES threads (id) ON DELETE CASCADE,
  statement   text        NOT NULL,
  source_type text        NOT NULL CHECK (source_type IN ('document', 'email', 'verbal', 'public_record', 'memory', 'unknown')),
  source_ref  text,
  source_date date,
  verified    boolean     DEFAULT false,
  added_by    text        NOT NULL CHECK (added_by IN ('user', 'ai_interview', 'ai_inference')),
  confidence  text        NOT NULL CHECK (confidence IN ('confirmed', 'probable', 'uncertain')),
  notes       text,
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX idx_facts_thread_id ON facts (thread_id);
