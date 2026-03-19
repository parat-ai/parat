import * as fs from 'fs';
import * as path from 'path';

const MIGRATIONS_DIR = path.resolve(__dirname, '../../supabase/migrations');

function readMigration(filename: string): string {
  return fs.readFileSync(path.join(MIGRATIONS_DIR, filename), 'utf-8');
}

describe('001_create_cases.sql', () => {
  const sql = readMigration('001_create_cases.sql');

  it('defines set_updated_at trigger function', () => {
    expect(sql).toMatch(/CREATE OR REPLACE FUNCTION set_updated_at\(\)/i);
    expect(sql).toMatch(/NEW\.updated_at\s*=\s*now\(\)/i);
    expect(sql).toMatch(/LANGUAGE plpgsql/i);
  });

  it('creates cases table with uuid PK using gen_random_uuid()', () => {
    expect(sql).toMatch(/CREATE TABLE cases/i);
    expect(sql).toMatch(/id\s+uuid\s+PRIMARY KEY\s+DEFAULT\s+gen_random_uuid\(\)/i);
  });

  it('has required columns with correct types', () => {
    expect(sql).toMatch(/title\s+text\s+NOT NULL/i);
    expect(sql).toMatch(/type\s+text\s+NOT NULL/i);
    expect(sql).toMatch(/status\s+text\s+NOT NULL/i);
    expect(sql).toMatch(/jurisdiction\s+text\s+NOT NULL/i);
    expect(sql).toMatch(/opened_at\s+timestamptz\s+NOT NULL/i);
    expect(sql).toMatch(/updated_at\s+timestamptz\s+NOT NULL/i);
    expect(sql).toMatch(/mock_user_id\s+text\s+NOT NULL/i);
  });

  it('enforces type CHECK constraint with INVESTOR_DISPUTE', () => {
    expect(sql).toMatch(/CHECK\s*\(\s*type\s+IN\s*\(\s*'INVESTOR_DISPUTE'\s*\)\s*\)/i);
  });

  it('enforces status CHECK constraint with all allowed values', () => {
    expect(sql).toMatch(/CHECK\s*\(\s*status\s+IN\s*\(/i);
    expect(sql).toMatch(/'pre-legal'/);
    expect(sql).toMatch(/'active'/);
    expect(sql).toMatch(/'settled'/);
    expect(sql).toMatch(/'closed'/);
  });

  it('has default status of pre-legal', () => {
    expect(sql).toMatch(/status\s+text\s+NOT NULL\s+DEFAULT\s+'pre-legal'/i);
  });

  it('has default currency of NOK', () => {
    expect(sql).toMatch(/currency\s+text\s+DEFAULT\s+'NOK'/i);
  });

  it('has default mock_user_id of mock-user-001', () => {
    expect(sql).toMatch(/mock_user_id\s+text\s+NOT NULL\s+DEFAULT\s+'mock-user-001'/i);
  });

  it('has index on mock_user_id', () => {
    expect(sql).toMatch(/CREATE INDEX\s+\w+\s+ON\s+cases\s*\(\s*mock_user_id\s*\)/i);
  });

  it('applies set_updated_at trigger to cases', () => {
    expect(sql).toMatch(/CREATE TRIGGER\s+\w+\s+BEFORE UPDATE ON cases/i);
    expect(sql).toMatch(/EXECUTE FUNCTION set_updated_at\(\)/i);
  });
});

describe('002_create_insurance.sql', () => {
  const sql = readMigration('002_create_insurance.sql');

  it('creates insurance table with uuid PK', () => {
    expect(sql).toMatch(/CREATE TABLE insurance/i);
    expect(sql).toMatch(/id\s+uuid\s+PRIMARY KEY\s+DEFAULT\s+gen_random_uuid\(\)/i);
  });

  it('has FK to cases with ON DELETE CASCADE', () => {
    expect(sql).toMatch(/case_id\s+uuid\s+NOT NULL\s+REFERENCES\s+cases\s*\(\s*id\s*\)\s+ON DELETE CASCADE/i);
  });

  it('enforces policy_type CHECK constraint', () => {
    expect(sql).toMatch(/CHECK\s*\(\s*policy_type\s+IN\s*\(/i);
    expect(sql).toMatch(/'D&O'/);
    expect(sql).toMatch(/'professional_indemnity'/);
    expect(sql).toMatch(/'management_liability'/);
    expect(sql).toMatch(/'other'/);
  });

  it('enforces notification_status CHECK constraint', () => {
    expect(sql).toMatch(/CHECK\s*\(\s*notification_status\s+IN\s*\(/i);
    expect(sql).toMatch(/'not-sent'/);
    expect(sql).toMatch(/'drafted'/);
    expect(sql).toMatch(/'sent'/);
    expect(sql).toMatch(/'acknowledged'/);
    expect(sql).toMatch(/'declined'/);
  });

  it('enforces coverage_review_status CHECK constraint', () => {
    expect(sql).toMatch(/CHECK\s*\(\s*coverage_review_status\s+IN\s*\(/i);
    expect(sql).toMatch(/'not-assessed'/);
    expect(sql).toMatch(/'under-review'/);
    expect(sql).toMatch(/'possible-issues-flagged'/);
    expect(sql).toMatch(/'insurer-response-received'/);
  });

  it('enforces prior_knowledge_attention CHECK constraint', () => {
    expect(sql).toMatch(/CHECK\s*\(\s*prior_knowledge_attention\s+IN\s*\(/i);
    expect(sql).toMatch(/'none-identified'/);
    expect(sql).toMatch(/'possible'/);
    expect(sql).toMatch(/'significant'/);
    expect(sql).toMatch(/'requires-immediate-legal-review'/);
  });

  it('has unique index on case_id (1:1 with cases)', () => {
    expect(sql).toMatch(/CREATE UNIQUE INDEX\s+\w+\s+ON\s+insurance\s*\(\s*case_id\s*\)/i);
  });

  it('applies set_updated_at trigger', () => {
    expect(sql).toMatch(/CREATE TRIGGER\s+\w+\s+BEFORE UPDATE ON insurance/i);
  });
});

describe('003_create_claims.sql', () => {
  const sql = readMigration('003_create_claims.sql');

  it('creates claims table with uuid PK', () => {
    expect(sql).toMatch(/CREATE TABLE claims/i);
    expect(sql).toMatch(/id\s+uuid\s+PRIMARY KEY\s+DEFAULT\s+gen_random_uuid\(\)/i);
  });

  it('has FK to cases with ON DELETE CASCADE', () => {
    expect(sql).toMatch(/case_id\s+uuid\s+NOT NULL\s+REFERENCES\s+cases\s*\(\s*id\s*\)\s+ON DELETE CASCADE/i);
  });

  it('has required text columns', () => {
    expect(sql).toMatch(/title\s+text\s+NOT NULL/i);
    expect(sql).toMatch(/allegation\s+text\s+NOT NULL/i);
  });

  it('enforces documentation_status CHECK constraint', () => {
    expect(sql).toMatch(/CHECK\s*\(\s*documentation_status\s+IN\s*\(/i);
    expect(sql).toMatch(/'well-supported'/);
    expect(sql).toMatch(/'partially-supported'/);
    expect(sql).toMatch(/'incomplete'/);
    expect(sql).toMatch(/'requires-review'/);
  });

  it('enforces status CHECK constraint', () => {
    expect(sql).toMatch(/CHECK\s*\(\s*status\s+IN\s*\(/i);
    expect(sql).toMatch(/'active'/);
    expect(sql).toMatch(/'withdrawn'/);
    expect(sql).toMatch(/'disputed'/);
    expect(sql).toMatch(/'resolved'/);
  });

  it('has lovdata_refs as jsonb with default empty array', () => {
    expect(sql).toMatch(/lovdata_refs\s+jsonb\s+DEFAULT\s+'\[\]'/i);
  });

  it('has index on case_id', () => {
    expect(sql).toMatch(/CREATE INDEX\s+\w+\s+ON\s+claims\s*\(\s*case_id\s*\)/i);
  });

  it('applies set_updated_at trigger', () => {
    expect(sql).toMatch(/CREATE TRIGGER\s+\w+\s+BEFORE UPDATE ON claims/i);
  });
});

describe('004_create_threads.sql', () => {
  const sql = readMigration('004_create_threads.sql');

  it('creates threads table with uuid PK', () => {
    expect(sql).toMatch(/CREATE TABLE threads/i);
    expect(sql).toMatch(/id\s+uuid\s+PRIMARY KEY\s+DEFAULT\s+gen_random_uuid\(\)/i);
  });

  it('has FK to claims with ON DELETE CASCADE', () => {
    expect(sql).toMatch(/claim_id\s+uuid\s+NOT NULL\s+REFERENCES\s+claims\s*\(\s*id\s*\)\s+ON DELETE CASCADE/i);
  });

  it('enforces type CHECK constraint with all thread types', () => {
    expect(sql).toMatch(/type\s+text\s+NOT NULL\s+CHECK\s*\(\s*type\s+IN\s*\(/i);
    expect(sql).toMatch(/'timeline'/);
    expect(sql).toMatch(/'evidence'/);
    expect(sql).toMatch(/'arguments'/);
    expect(sql).toMatch(/'open_questions'/);
    expect(sql).toMatch(/'insurance'/);
  });

  it('has index on claim_id', () => {
    expect(sql).toMatch(/CREATE INDEX\s+\w+\s+ON\s+threads\s*\(\s*claim_id\s*\)/i);
  });

  it('applies set_updated_at trigger', () => {
    expect(sql).toMatch(/CREATE TRIGGER\s+\w+\s+BEFORE UPDATE ON threads/i);
  });
});

describe('005_create_facts.sql', () => {
  const sql = readMigration('005_create_facts.sql');

  it('creates facts table with uuid PK', () => {
    expect(sql).toMatch(/CREATE TABLE facts/i);
    expect(sql).toMatch(/id\s+uuid\s+PRIMARY KEY\s+DEFAULT\s+gen_random_uuid\(\)/i);
  });

  it('has FK to threads with ON DELETE CASCADE', () => {
    expect(sql).toMatch(/thread_id\s+uuid\s+NOT NULL\s+REFERENCES\s+threads\s*\(\s*id\s*\)\s+ON DELETE CASCADE/i);
  });

  it('has required columns', () => {
    expect(sql).toMatch(/statement\s+text\s+NOT NULL/i);
    expect(sql).toMatch(/source_type\s+text\s+NOT NULL/i);
    expect(sql).toMatch(/added_by\s+text\s+NOT NULL/i);
    expect(sql).toMatch(/confidence\s+text\s+NOT NULL/i);
  });

  it('enforces source_type CHECK constraint', () => {
    expect(sql).toMatch(/CHECK\s*\(\s*source_type\s+IN\s*\(/i);
    expect(sql).toMatch(/'document'/);
    expect(sql).toMatch(/'email'/);
    expect(sql).toMatch(/'verbal'/);
    expect(sql).toMatch(/'public_record'/);
    expect(sql).toMatch(/'memory'/);
    expect(sql).toMatch(/'unknown'/);
  });

  it('enforces added_by CHECK constraint', () => {
    expect(sql).toMatch(/CHECK\s*\(\s*added_by\s+IN\s*\(/i);
    expect(sql).toMatch(/'user'/);
    expect(sql).toMatch(/'ai_interview'/);
    expect(sql).toMatch(/'ai_inference'/);
  });

  it('enforces confidence CHECK constraint', () => {
    expect(sql).toMatch(/CHECK\s*\(\s*confidence\s+IN\s*\(/i);
    expect(sql).toMatch(/'confirmed'/);
    expect(sql).toMatch(/'probable'/);
    expect(sql).toMatch(/'uncertain'/);
  });

  it('has verified boolean defaulting to false', () => {
    expect(sql).toMatch(/verified\s+boolean\s+DEFAULT\s+false/i);
  });

  it('has index on thread_id', () => {
    expect(sql).toMatch(/CREATE INDEX\s+\w+\s+ON\s+facts\s*\(\s*thread_id\s*\)/i);
  });

  it('does NOT have updated_at (no trigger needed)', () => {
    expect(sql).not.toMatch(/CREATE TRIGGER/i);
  });
});

describe('006_create_sessions.sql', () => {
  const sql = readMigration('006_create_sessions.sql');

  it('creates sessions table with uuid PK', () => {
    expect(sql).toMatch(/CREATE TABLE sessions/i);
    expect(sql).toMatch(/id\s+uuid\s+PRIMARY KEY\s+DEFAULT\s+gen_random_uuid\(\)/i);
  });

  it('has FK to cases with ON DELETE CASCADE', () => {
    expect(sql).toMatch(/case_id\s+uuid\s+NOT NULL\s+REFERENCES\s+cases\s*\(\s*id\s*\)\s+ON DELETE CASCADE/i);
  });

  it('has required model columns', () => {
    expect(sql).toMatch(/model_primary\s+text\s+NOT NULL/i);
    expect(sql).toMatch(/model_reviewer\s+text\s+NOT NULL/i);
  });

  it('has jsonb columns with empty array defaults', () => {
    expect(sql).toMatch(/context_loaded\s+jsonb\s+DEFAULT\s+'\[\]'/i);
    expect(sql).toMatch(/facts_added\s+jsonb\s+DEFAULT\s+'\[\]'/i);
    expect(sql).toMatch(/facts_updated\s+jsonb\s+DEFAULT\s+'\[\]'/i);
  });

  it('has index on case_id', () => {
    expect(sql).toMatch(/CREATE INDEX\s+\w+\s+ON\s+sessions\s*\(\s*case_id\s*\)/i);
  });

  it('does NOT have updated_at (no trigger needed)', () => {
    expect(sql).not.toMatch(/CREATE TRIGGER/i);
  });
});

describe('migration ordering and completeness', () => {
  it('all 6 migration files exist', () => {
    const files = [
      '001_create_cases.sql',
      '002_create_insurance.sql',
      '003_create_claims.sql',
      '004_create_threads.sql',
      '005_create_facts.sql',
      '006_create_sessions.sql',
    ];
    for (const file of files) {
      expect(fs.existsSync(path.join(MIGRATIONS_DIR, file))).toBe(true);
    }
  });
});
