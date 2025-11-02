import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzlePg } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

let db: any;

if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres')) {
  // Use PostgreSQL in production
  const queryClient = postgres(process.env.DATABASE_URL);
  db = drizzlePg(queryClient, { schema });
} else {
  // Use SQLite for local development
  const sqlite = new Database('database.db');
  // Enable WAL mode for better performance
  sqlite.pragma('journal_mode = WAL');
  db = drizzle(sqlite, { schema });
}

export { db };
