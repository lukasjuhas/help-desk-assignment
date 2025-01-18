import pool from "./db"

/**
 * Logs an event in the database.
 * @param eventType - The type of event (e.g., "status_change", "response").
 * @param message - A detailed message describing the event.
 * @param ticketPublicId - (Optional) The `public_id` of the ticket associated with the event.
 * @param context - (Optional) Additional metadata about the event.
 */
export async function logEvent(
  eventType: string,
  message: string,
  ticketPublicId?: string,
  context: Record<string, any> = {}
) {
  try {
    await pool.query(
      `
      INSERT INTO logs (ticket_public_id, event_type, message, context)
      VALUES ($1, $2, $3, $4)
    `,
      [ticketPublicId || null, eventType, message, context]
    )
    console.log(`Logged event: ${eventType} - ${message}`)
  } catch (error) {
    console.error("Error logging event:", error)
  }
}
