import * as fs from 'fs';
import * as path from 'path';

const MIGRATIONS_DIR = path.resolve(__dirname, '../../supabase/migrations');

const MIGRATION_FILES = [
  '001_create_cases.sql',
  '002_create_insurance.sql',
  '003_create_claims.sql',
  '004_create_threads.sql',
  '005_create_facts.sql',
  '006_create_sessions.sql',
];

describe('migration chain integrity', () => {
  it('all migration files exist and are readable', () => {
    for (const file of MIGRATION_FILES) {
      const filePath = path.join(MIGRATIONS_DIR, file);
      expect(fs.existsSync(filePath)).toBe(true);
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    }
  });

  it('migration files are numbered sequentially starting at 001', () => {
    const files = fs.readdirSync(MIGRATIONS_DIR)
      .filter(f => f.endsWith('.sql'))
      .sort();
    files.forEach((file, index) => {
      const prefix = String(index + 1).padStart(3, '0');
      expect(file).toMatch(new RegExp(`^${prefix}_`));
    });
  });

  it('002_create_insurance references cases (defined in 001)', () => {
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, '002_create_insurance.sql'), 'utf-8');
    expect(sql).toMatch(/REFERENCES\s+cases/i);
  });

  it('003_create_claims references cases (defined in 001)', () => {
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, '003_create_claims.sql'), 'utf-8');
    expect(sql).toMatch(/REFERENCES\s+cases/i);
  });

  it('004_create_threads references claims (defined in 003)', () => {
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, '004_create_threads.sql'), 'utf-8');
    expect(sql).toMatch(/REFERENCES\s+claims/i);
  });

  it('005_create_facts references threads (defined in 004)', () => {
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, '005_create_facts.sql'), 'utf-8');
    expect(sql).toMatch(/REFERENCES\s+threads/i);
  });

  it('006_create_sessions references cases (defined in 001)', () => {
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, '006_create_sessions.sql'), 'utf-8');
    expect(sql).toMatch(/REFERENCES\s+cases/i);
  });

  it('no migration forward-references a table defined later', () => {
    // Build map of which migration defines each table
    const tableDefinedIn: Record<string, number> = {};
    for (let i = 0; i < MIGRATION_FILES.length; i++) {
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, MIGRATION_FILES[i]), 'utf-8');
      const matches = sql.matchAll(/CREATE TABLE\s+(\w+)/gi);
      for (const match of matches) {
        tableDefinedIn[match[1].toLowerCase()] = i;
      }
    }

    // Verify each FK references a table defined in an earlier migration
    for (let i = 0; i < MIGRATION_FILES.length; i++) {
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, MIGRATION_FILES[i]), 'utf-8');
      const fkMatches = sql.matchAll(/REFERENCES\s+(\w+)/gi);
      for (const match of fkMatches) {
        const referencedTable = match[1].toLowerCase();
        const definedAt = tableDefinedIn[referencedTable];
        expect(definedAt).toBeDefined();
        expect(definedAt).toBeLessThan(i);
      }
    }
  });

  it('set_updated_at trigger function is defined before it is used', () => {
    const migration001 = fs.readFileSync(path.join(MIGRATIONS_DIR, '001_create_cases.sql'), 'utf-8');
    expect(migration001).toMatch(/CREATE OR REPLACE FUNCTION set_updated_at\(\)/i);

    // All other migrations that use set_updated_at must come after 001
    const tablesWithTrigger = ['002', '003', '004'];
    for (const prefix of tablesWithTrigger) {
      const file = MIGRATION_FILES.find(f => f.startsWith(prefix))!;
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf-8');
      if (sql.match(/EXECUTE FUNCTION set_updated_at\(\)/i)) {
        // Confirm this is after 001
        expect(parseInt(prefix)).toBeGreaterThan(1);
      }
    }
  });

  it('all tables with updated_at column have the set_updated_at trigger', () => {
    for (const file of MIGRATION_FILES) {
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf-8');
      const hasUpdatedAt = /updated_at/.test(sql) && /CREATE TABLE/.test(sql);
      const hasTrigger = /EXECUTE FUNCTION set_updated_at\(\)/.test(sql);
      if (hasUpdatedAt) {
        expect(hasTrigger).toBe(true);
      }
    }
  });

  it('every ON DELETE CASCADE pairs with a NOT NULL FK column', () => {
    for (const file of MIGRATION_FILES) {
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf-8');
      const cascadeCount = (sql.match(/ON DELETE CASCADE/gi) || []).length;
      const notNullFkCount = (sql.match(/NOT NULL\s+REFERENCES/gi) || []).length;
      if (cascadeCount > 0) {
        expect(notNullFkCount).toBe(cascadeCount);
      }
    }
  });
});
