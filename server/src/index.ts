import express, { Application } from "express"
import cors from "cors"
import bodyParser from "body-parser"
import ticketRoutes from "./routes/tickets"

const app: Application = express()
const PORT = process.env.PORT || 4949

// Middleware
app.use(cors())
app.use(bodyParser.json())

// Routes
app.use("/api", ticketRoutes)

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
