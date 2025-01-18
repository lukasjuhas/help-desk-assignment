import { customAlphabet } from "nanoid"
import { parseISO, formatDistanceToNow, format } from "date-fns"
import { toZonedTime } from "date-fns-tz"

// Constants for ID generation
const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
const PUBLIC_ID_LENGTH = 10

// Generate a custom public ID excluding '-' and '_'
const generatePublicId = customAlphabet(alphabet, PUBLIC_ID_LENGTH)

/**
 * Formats a timestamp into a human-readable relative time (e.g., "3 minutes ago").
 * @param timestamp - ISO timestamp string
 * @param timeZone - The timezone to convert to (default is local timezone)
 */
function formatRelativeTime(timestamp: string, timeZone?: string): string {
  const zonedTime = toZonedTime(
    parseISO(timestamp),
    timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone
  )
  return formatDistanceToNow(zonedTime, { addSuffix: true })
}

/**
 * Formats a timestamp into a specific date-time format.
 * @param timestamp - ISO timestamp string
 * @param timeZone - The timezone to convert to (default is local timezone)
 */
function formatExactTime(timestamp: string, timeZone?: string): string {
  const zonedTime = toZonedTime(
    parseISO(timestamp),
    timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone
  )
  return format(zonedTime, "yyyy-MM-dd HH:mm:ss")
}

/**
 * Truncates a string to a specified length, appending "..." if truncated.
 * @param text - The string to truncate
 * @param maxLength - Maximum length of the truncated string
 */
function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text
}

export { generatePublicId, formatRelativeTime, formatExactTime, truncateText }
