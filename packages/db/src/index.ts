import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

let dbInstance: any = null;

export function getDb(env?: Record<string, unknown>) {
  if (dbInstance) return dbInstance;

  const client = createClient({
    url: process.env.DATABASE_URL || (env && (env as any).DATABASE_URL) || 'file:local.db',
  });

  dbInstance = drizzle(client, { schema });
  return dbInstance;
}

export * from './schema';
