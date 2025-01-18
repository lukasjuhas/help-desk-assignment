import { NextRequest, NextResponse } from "next/server"
import pool from "../../../lib/db"
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "http-status-codes"

type LogContext = Record<string, unknown> | null

export async function POST(req: NextRequest) {
  try {
    const {
      event_type,
      message,
      ticket_public_id,
      context,
    }: {
      event_type: string
      message: string
      ticket_public_id?: string
      context?: LogContext
    } = await req.json()

    if (!event_type || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: BAD_REQUEST }
      )
    }

    await pool.query(
      `
      INSERT INTO logs (ticket_public_id, event_type, message, context)
      VALUES ($1, $2, $3, $4)
    `,
      [ticket_public_id || null, event_type, message, context || null]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating log:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: INTERNAL_SERVER_ERROR }
    )
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const ticketPublicId = searchParams.get("ticket_public_id")
  const eventType = searchParams.get("event_type")

  try {
    const queryParts: string[] = []
    const queryValues: (string | null)[] = []

    if (ticketPublicId) {
      queryParts.push(`ticket_public_id = $${queryParts.length + 1}`)
      queryValues.push(ticketPublicId)
    }

    if (eventType) {
      queryParts.push(`event_type = $${queryParts.length + 1}`)
      queryValues.push(eventType)
    }

    const whereClause = queryParts.length
      ? `WHERE ${queryParts.join(" AND ")}`
      : ""

    const result = await pool.query(
      `
      SELECT id, ticket_public_id, event_type, message, context, created_at
      FROM logs
      ${whereClause}
      ORDER BY created_at DESC
    `,
      queryValues
    )

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching logs:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: INTERNAL_SERVER_ERROR }
    )
  }
}
