"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import TicketTable from "../components/TicketTable"
import { ITEM_PREVIEW_COUNT } from "@/lib/config"

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
  const [attentionTickets, setAttentionTickets] = useState<Ticket[]>([])
  const [loadingCounts, setLoadingCounts] = useState(true)
  const [loadingTickets, setLoadingTickets] = useState(true)

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const { data } = await axios.get("/api/tickets/counts")
        setCounts(data)
      } catch (error) {
        console.error("Error fetching counts:", error)
      } finally {
        setLoadingCounts(false)
      }
    }

    const fetchTickets = async () => {
      try {
        // Fetch latest tickets for "new" status
        const latestResponse = await axios.get(
          `/api/tickets?page=1&limit=${ITEM_PREVIEW_COUNT}&status=new&order=desc`
        )
        setLatestTickets(latestResponse.data.tickets)

        // Fetch tickets needing attention
        const attentionNewResponse = await axios.get(
          `/api/tickets?limit=${ITEM_PREVIEW_COUNT}&status=new&order=asc`
        )
        const attentionProgressResponse = await axios.get(
          `/api/tickets?limit=${ITEM_PREVIEW_COUNT}&status=progress&order=asc`
        )

        const combinedAttentionTickets = [
          ...attentionNewResponse.data.tickets,
          ...attentionProgressResponse.data.tickets,
        ].sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )

        setAttentionTickets(combinedAttentionTickets)
      } catch (error) {
        console.error("Error fetching tickets:", error)
      } finally {
        setLoadingTickets(false)
      }
    }

    fetchCounts()
    fetchTickets()
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {loadingCounts || loadingTickets ? (
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

          {/* Tickets Needing Attention */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">High-Priority Tickets</h2>
            </div>
            {attentionTickets.length > 0 ? (
              <TicketTable tickets={attentionTickets} />
            ) : (
              <p>No tickets needing immediate attention.</p>
            )}
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
