import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// Supabase "Transaction" 풀 모드에서는 prepared statement가 지원되지 않으므로 비활성화합니다.
const client = postgres(process.env.DATABASE_URL, { prepare: false });
export const db = drizzle(client);
