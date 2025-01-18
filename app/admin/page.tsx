"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import TicketTable from "../components/TicketTable"

type Ticket = {
  public_id: string
  name: string
  email: string
  description: string
  status: string
  created_at: string
}

export default function AdminPage() {
  const [counts, setCounts] = useState({ new: 0, progress: 0, resolved: 0 })
  const [latestTickets, setLatestTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await axios.get("/api/tickets")

        // Group tickets by status
        const grouped = data.reduce(
          (acc: Record<string, number>, ticket: Ticket) => {
            acc[ticket.status] = (acc[ticket.status] || 0) + 1
            return acc
          },
          {}
        )

        setCounts({
          new: grouped["new"] || 0,
          progress: grouped["progress"] || 0,
          resolved: grouped["resolved"] || 0,
        })

        // Get the latest 5 new tickets
        const latest = data
          .filter((ticket: Ticket) => ticket.status === "new")
          .slice(0, 5)
        setLatestTickets(latest)
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
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Ticket Counts */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <Link
              href="/admin/new"
              className="bg-error text-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-bold">New Tickets</h2>
              <p className="text-2xl mt-2">{counts.new}</p>
            </Link>
            <Link
              href="/admin/progress"
              className="bg-primary text-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-bold">In Progress</h2>
              <p className="text-2xl mt-2">{counts.progress}</p>
            </Link>
            <Link
              href="/admin/resolved"
              className="bg-success text-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-bold">Resolved</h2>
              <p className="text-2xl mt-2">{counts.resolved}</p>
            </Link>
          </div>

          {/* Latest New Tickets */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Latest New Tickets</h2>
              <Link href="/admin/new" className="btn btn-primary">
                View All
              </Link>
            </div>
            {latestTickets.length > 0 ? (
              <TicketTable tickets={latestTickets} />
            ) : (
              <p>No new tickets.</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
