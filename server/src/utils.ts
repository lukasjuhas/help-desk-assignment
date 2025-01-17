import { customAlphabet } from "nanoid"

// Define a custom alphabet excluding '-' and '_'
const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
const PUBLIC_ID_LENGTH = 10

const generatePublicId = customAlphabet(alphabet, PUBLIC_ID_LENGTH)

export { generatePublicId };