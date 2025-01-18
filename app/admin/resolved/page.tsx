"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import TicketTable from "../../components/TicketTable"

type Ticket = {
  public_id: string
  name: string
  email: string
  description: string
  status: string
  created_at: string
}

export default function ResolvedTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await axios.get("/api/tickets")
        const filteredTickets = data.filter(
          (ticket: Ticket) => ticket.status === "resolved"
        )
        setTickets(filteredTickets)
      } catch (error) {
        console.error("Error fetching tickets:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Resolved Tickets</h1>
      {loading ? (
        <p>Loading...</p>
      ) : tickets.length > 0 ? (
        <TicketTable tickets={tickets} showStatus={false} />
      ) : (
        <p>No resolved tickets available.</p>
      )}
    </div>
  )
}
