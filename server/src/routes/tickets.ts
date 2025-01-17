import { Request, Response, Router } from "express"
import { body, validationResult } from "express-validator"
import {
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from "http-status-codes"
import pool from "../db/db"
import { generatePublicId } from '../utils';

const router = Router()

// Define the expected shape of route parameters, request body, and query
interface TicketRequestParams {
  public_id: string
}

interface TicketRequestBody {
  name: string
  email: string
  description: string
  status?: string
}

// Create a new ticket
router.post(
  "/tickets",
  [
    body("name").isLength({ min: 1 }).trim().escape(),
    body("email").isEmail().normalizeEmail(),
    body("description").isLength({ min: 1 }).trim().escape(),
  ],
  async (req: Request<{}, {}, TicketRequestBody>, res: Response): Promise<void> => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(BAD_REQUEST).json({ errors: errors.array() })
      return;
    }

    const { name, email, description } = req.body
    const publicId = generatePublicId();

    try {
      const result = await pool.query(
        "INSERT INTO tickets (public_id, name, email, description) VALUES ($1, $2, $3, $4) RETURNING *",
        [publicId, name, email, description]
      )
      const ticket = result.rows[0]
      console.log(
        `Would normally send email here with body: ${JSON.stringify(ticket)}`
      )
      res.status(CREATED).json(ticket)
    } catch (err) {
      console.error(err)
      res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" })
    }
  }
)

// Get all tickets
router.get("/tickets", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT public_id, name, email, description, status, created_at, updated_at FROM tickets ORDER BY created_at DESC"
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" })
  }
})

// Get a single ticket
router.get(
  "/tickets/:public_id",
  async (req: Request<TicketRequestParams>, res: Response): Promise<void> => {
    const { public_id } = req.params

    try {
      const result = await pool.query(
        "SELECT public_id, name, email, description, status, created_at, updated_at FROM tickets WHERE public_id = $1",
        [public_id]
      )
      if (result.rows.length === 0) {
        res.status(NOT_FOUND).json({ error: "Ticket not found" })
        return;
      }
      res.json(result.rows[0])
    } catch (err) {
      console.error(err)
      res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" })
    }
  }
)

// Update ticket status
router.put(
  "/tickets/:public_id",
  async (
    req: Request<TicketRequestParams, {}, TicketRequestBody>,
    res: Response
  ): Promise<void> => {
    const { public_id } = req.params
    const { status } = req.body

    if (!["new", "progress", "resolved"].includes(status || "")) {
      res.status(BAD_REQUEST).json({ error: "Invalid status" })
      return;
    }

    try {
      const result = await pool.query(
        "UPDATE tickets SET status = $1 WHERE public_id = $2 RETURNING *",
        [status, public_id]
      )
      if (result.rows.length === 0) {
        res.status(NOT_FOUND).json({ error: "Ticket not found" })
        return;
      }
      res.json(result.rows[0])
    } catch (err) {
      console.error(err)
      res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" })
    }
  }
)

export default router
