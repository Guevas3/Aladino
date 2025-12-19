import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Default to a placeholder if not present, to prevent build crashes in non-prod without env
const connectionString = process.env.DATABASE_URL!;

const sql = neon(connectionString);
export const db = drizzle(sql);
