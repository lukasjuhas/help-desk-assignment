import { NextRequest, NextResponse } from "next/server"
import {
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from "http-status-codes"
import pool from "../../../lib/db"
import { generatePublicId } from "../../../lib/utils"

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

// GET: Fetch all tickets
export async function GET() {
  try {
    const result = await pool.query(
      "SELECT public_id, name, email, description, status, created_at, updated_at FROM tickets ORDER BY created_at DESC"
    )
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching tickets:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: INTERNAL_SERVER_ERROR }
    )
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

    const publicId = generatePublicId()

    const result = await pool.query(
      "INSERT INTO tickets (public_id, name, email, description) VALUES ($1, $2, $3, $4) RETURNING *",
      [publicId, name, email, description]
    )
    return NextResponse.json(result.rows[0], { status: CREATED })
  } catch (error) {
    console.error("Error creating ticket:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: INTERNAL_SERVER_ERROR }
    )
  }
}

// GET: Fetch a single ticket
export async function GET_SINGLE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const public_id = searchParams.get("public_id")

  if (!public_id) {
    return NextResponse.json(
      { error: "Public ID is required" },
      { status: BAD_REQUEST }
    )
  }

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
      "UPDATE tickets SET status = $1 WHERE public_id = $2 RETURNING *",
      [status, public_id]
    )
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: NOT_FOUND }
      )
    }
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error updating ticket:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: INTERNAL_SERVER_ERROR }
    )
  }
}
