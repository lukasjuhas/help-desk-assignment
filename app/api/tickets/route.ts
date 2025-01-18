import { NextRequest, NextResponse } from "next/server"
import DOMPurify from "isomorphic-dompurify"
import {
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from "http-status-codes"
import pool from "@/lib/db"
import { generatePublicId } from "@/lib/utils"
import { ITEMS_PER_PAGE } from "@/lib/config"
import { logEvent } from "@/lib/logger"

// Validation utility
function validateFields(
  fields: { [key: string]: string },
  requiredFields: string[]
) {
  const errors: { field: string; message: string }[] = []

  for (const field of requiredFields) {
    if (!fields[field]) {
      errors.push({ field, message: `${field} is required` })
    }
  }

  if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.push({ field: "email", message: "Invalid email address" })
  }

  return errors
}

// GET: Fetch all tickets or a single ticket based on query parameters
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const public_id = searchParams.get("public_id")
  const status = searchParams.get("status") // New status filter
  const page = parseInt(searchParams.get("page") || "1", 10)
  const limit = parseInt(searchParams.get("limit") || `${ITEMS_PER_PAGE}`, 10)
  const offset = (page - 1) * limit

  if (public_id) {
    // Fetch single ticket
    try {
      const result = await pool.query(
        "SELECT public_id, name, email, description, status, created_at, updated_at FROM tickets WHERE public_id = $1",
        [public_id]
      )

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: "Ticket not found" },
          { status: NOT_FOUND }
        )
      }

      return NextResponse.json(result.rows[0])
    } catch (error) {
      console.error("Error fetching ticket:", error)
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: INTERNAL_SERVER_ERROR }
      )
    }
  } else {
    // Fetch paginated tickets with optional status filter
    try {
      const query = `
        SELECT public_id, name, email, description, status, created_at, updated_at
        FROM tickets
        ${status ? "WHERE status = $3" : ""}
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `
      const params = status ? [limit, offset, status] : [limit, offset]

      const result = await pool.query(query, params)

      const countQuery = status
        ? "SELECT COUNT(*) FROM tickets WHERE status = $1"
        : "SELECT COUNT(*) FROM tickets"
      const countParams = status ? [status] : []
      const countResult = await pool.query(countQuery, countParams)
      const totalCount = parseInt(countResult.rows[0].count, 10)

      return NextResponse.json({
        tickets: result.rows,
        total: totalCount,
        page,
        totalPages: Math.ceil(totalCount / limit),
      })
    } catch (error) {
      console.error("Error fetching tickets:", error)
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: INTERNAL_SERVER_ERROR }
      )
    }
  }
}

// POST: Create a new ticket
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, description } = body

    // Validate fields
    const errors = validateFields(body, ["name", "email", "description"])
    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: BAD_REQUEST })
    }

    const sanitizedName = DOMPurify.sanitize(name)
    const sanitizedEmail = DOMPurify.sanitize(email)
    const sanitizedDescription = DOMPurify.sanitize(description)

    const publicId = generatePublicId()

    const result = await pool.query(
      "INSERT INTO tickets (public_id, name, email, description) VALUES ($1, $2, $3, $4) RETURNING *",
      [publicId, sanitizedName, sanitizedEmail, sanitizedDescription]
    )

    const ticket = result.rows[0];

    await logEvent(
      "ticket_created",
      `Ticket created by a user.`,
      ticket.public_id,
      ticket
    )

    return NextResponse.json(ticket, { status: CREATED })
  } catch (error) {
    console.error("Error creating ticket:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: INTERNAL_SERVER_ERROR }
    )
  }
}

// PUT: Update ticket status
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { public_id, status } = body

    if (!public_id || !["new", "progress", "resolved"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: BAD_REQUEST }
      )
    }

    const result = await pool.query(
      "UPDATE tickets SET status = $1, updated_at = NOW() WHERE public_id = $2 RETURNING *",
      [status, public_id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: NOT_FOUND }
      )
    }

    const ticket = result.rows[0]

    await logEvent(
      "status_change",
      `Status changed to '${status}'`,
      ticket.public_id
    )

    return NextResponse.json(ticket)
  } catch (error) {
    console.error("Error updating ticket status:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: INTERNAL_SERVER_ERROR }
    )
  }
}
