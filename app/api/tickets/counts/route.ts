import { NextResponse } from "next/server"
import pool from "../../../../lib/db"
import { INTERNAL_SERVER_ERROR } from "http-status-codes"

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE status = 'new') AS new,
        COUNT(*) FILTER (WHERE status = 'progress') AS progress,
        COUNT(*) FILTER (WHERE status = 'resolved') AS resolved
      FROM tickets
    `)

    const counts = result.rows[0]

    return NextResponse.json({
      new: parseInt(counts.new, 10),
      progress: parseInt(counts.progress, 10),
      resolved: parseInt(counts.resolved, 10),
    })
  } catch (error) {
    console.error("Error fetching ticket counts:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: INTERNAL_SERVER_ERROR }
    )
  }
}
