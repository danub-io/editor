import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock dependencies
vi.mock('drizzle-orm/libsql', () => ({
  drizzle: vi.fn((client, options) => ({ client, options, _isMockDb: true })),
}));

vi.mock('@libsql/client', () => ({
  createClient: vi.fn((config) => ({ config, _isMockClient: true })),
}));

describe('getDb', () => {
  beforeEach(() => {
    // Reset module cache before each test to ensure clean state
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it('should return a db instance with file:local.db by default', async () => {
    // Ensure no DATABASE_URL is set
    vi.stubEnv('DATABASE_URL', '');

    // Dynamically import to get a fresh module execution
    const { getDb } = await import('./index');

    const db = getDb();

    expect(db).toBeDefined();
    expect(db._isMockDb).toBe(true);
    expect(db.client.config.url).toBe('file:local.db');
  });

  it('should use process.env.DATABASE_URL if available', async () => {
    vi.stubEnv('DATABASE_URL', 'libsql://from-process-env.com');

    const { getDb } = await import('./index');

    const db = getDb();

    expect(db.client.config.url).toBe('libsql://from-process-env.com');
  });

  it('should use env.DATABASE_URL if passed as argument and process.env is empty', async () => {
    vi.stubEnv('DATABASE_URL', '');

    const { getDb } = await import('./index');

    const db = getDb({ DATABASE_URL: 'libsql://from-args.com' });

    expect(db.client.config.url).toBe('libsql://from-args.com');
  });

  it('should prefer process.env.DATABASE_URL over env arguments', async () => {
    vi.stubEnv('DATABASE_URL', 'libsql://from-process-env.com');

    const { getDb } = await import('./index');

    const db = getDb({ DATABASE_URL: 'libsql://from-args.com' });

    expect(db.client.config.url).toBe('libsql://from-process-env.com');
  });

  it('should return the same instance on subsequent calls', async () => {
    const { getDb } = await import('./index');

    const db1 = getDb();
    const db2 = getDb();

    expect(db1).toBe(db2);
  });

  it('should fall back to file:local.db if env object is provided but missing DATABASE_URL', async () => {
    vi.stubEnv('DATABASE_URL', '');

    const { getDb } = await import('./index');

    const db = getDb({ OTHER_VAR: 'some-value' });

    expect(db.client.config.url).toBe('file:local.db');
  });

  it('should pass schema to drizzle', async () => {
    const { getDb } = await import('./index');
    const schema = await import('./schema');

    const db = getDb();

    expect(db.options.schema).toEqual(schema);
  });
});

describe('schema exports', () => {
  it('should re-export schema from index', async () => {
    const indexExports = await import('./index');
    const schemaExports = await import('./schema');

    // Check that key schema exports are present in index
    expect(indexExports.projects).toBe(schemaExports.projects);
    expect(indexExports.chapters).toBe(schemaExports.chapters);
    expect(indexExports.characters).toBe(schemaExports.characters);
  });
});
