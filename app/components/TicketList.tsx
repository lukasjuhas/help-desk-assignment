"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import TicketTable from "@/app/components/TicketTable"
import { TICKETS_PER_PAGE } from "@/lib/config"

type Ticket = {
  public_id: string
  name: string
  email: string
  description: string
  status: string
  created_at: string
}

type TicketListProps = {
  status: string
  title: string
}

export default function TicketList({ status, title }: TicketListProps) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true)
      setError(null)

      try {
        const { data } = await axios.get(
          `/api/tickets?page=${currentPage}&limit=${TICKETS_PER_PAGE}&status=${status}`
        )
        setTickets(data.tickets)
        setTotalPages(data.totalPages)
      } catch (err) {
        console.error("Error fetching tickets:", err)
        setError("Failed to load tickets.")
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [currentPage, status]) // Re-fetch data when `status` or `currentPage` changes

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{title}</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="mb-6">
            {tickets.length > 0 ? (
              <TicketTable tickets={tickets} showStatus={false} />
            ) : (
              <p>No tickets available for this status.</p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <div className="join">
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1
                  return (
                    <button
                      key={page}
                      className={`btn join-item ${
                        page === currentPage ? "btn-primary" : ""
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
