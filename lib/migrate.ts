import { PoolClient } from "pg"
import pool from "./db"
const { error, log } = console

async function createTicketsTable(client: PoolClient) {
  await client.query(`DROP TABLE IF EXISTS "tickets"`)

  await client.query(`
    CREATE TABLE "tickets" (
      id SERIAL PRIMARY KEY,
      public_id VARCHAR(21) UNIQUE NOT NULL DEFAULT '',
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      description TEXT NOT NULL,
      status VARCHAR(50) DEFAULT 'new',
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `)
}

async function migrate() {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    await createTicketsTable(client)
    await client.query("COMMIT")
    log("Database migrations successful.")
  } catch (err: unknown) {
    await client.query("ROLLBACK")
    if (err instanceof Error) {
      error("Query error:", err.message, err.stack)
    } else {
      error("Unknown error occurred during migration.")
    }
  } finally {
    await client.release()
  }
}

migrate()
