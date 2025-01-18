import pool from "./db"

type LogContext = Record<string, unknown> | null

/**
 * Logs an event in the database.
 * @param eventType - The type of event (e.g., "status_change", "response").
 * @param message - A detailed message describing the event.
 * @param ticketPublicId - (Optional) The `public_id` of the ticket associated with the event.
 * @param context - (Optional) Additional metadata about the event.
 */
export async function logEvent(
  event_type: string,
  message: string,
  ticket_public_id: string | null = null,
  context: LogContext = null
): Promise<void> {
  try {
    await pool.query(
      `
      INSERT INTO logs (ticket_public_id, event_type, message, context)
      VALUES ($1, $2, $3, $4)
    `,
      [ticket_public_id, event_type, message, context]
    )
  } catch (error) {
    console.error("Error logging event:", error)
  }
}