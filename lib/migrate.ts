import { PoolClient } from 'pg';
import pool from './db';
const { error, log } = console;

async function createTicketsTable(client: PoolClient) {
  await client.query(`CREATE TABLE IF NOT EXISTS "tickets" (
    id SERIAL PRIMARY KEY,
    public_id VARCHAR(21) UNIQUE NOT NULL DEFAULT '',
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new',
    updated_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
  )`)
}

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN")
    await createTicketsTable(client)
    await client.query("COMMIT")
  } catch (err: unknown) {
    if (err instanceof Error) {
      error("Query error:", err.message, err.stack)
    } else {
      error("Unknown error occurred during migration.")
    }
  } finally {
    log("Database migrations successful.")
    await client.release()
  }
}

migrate();