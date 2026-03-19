-- Migration 002: insurance table (1:1 with cases)

CREATE TABLE insurance (
  id                        uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id                   uuid        NOT NULL REFERENCES cases (id) ON DELETE CASCADE,
  policy_type               text        CHECK (policy_type IN ('D&O', 'professional_indemnity', 'management_liability', 'other')),
  insurer                   text,
  policy_number             text,
  coverage_period_from      date,
  coverage_period_to        date,
  notification_deadline     date,
  notification_status       text        DEFAULT 'not-sent'
                                          CHECK (notification_status IN ('not-sent', 'drafted', 'sent', 'acknowledged', 'declined')),
  coverage_review_status    text        DEFAULT 'not-assessed'
                                          CHECK (coverage_review_status IN ('not-assessed', 'under-review', 'possible-issues-flagged', 'insurer-response-received', 'declined')),
  prior_knowledge_attention text        DEFAULT 'none-identified'
                                          CHECK (prior_knowledge_attention IN ('none-identified', 'possible', 'significant', 'requires-immediate-legal-review')),
  notification_draft        text,
  created_at                timestamptz DEFAULT now(),
  updated_at                timestamptz DEFAULT now()
);

-- One insurance record per case
CREATE UNIQUE INDEX idx_insurance_case_id ON insurance (case_id);

CREATE TRIGGER trg_insurance_updated_at
  BEFORE UPDATE ON insurance
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
