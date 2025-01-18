"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { formatRelativeTime, formatExactTime } from "@/lib/utils"

type Ticket = {
  public_id: string
  name: string
  email: string
  description: string
  status: string
  created_at: string
  updated_at: string
}

const statusMapping = {
  new: "New",
  progress: "In progress",
  resolved: "Resolved",
}

const statusStyles: Record<string, string> = {
  new: "bg-error text-white",
  progress: "bg-primary text-white",
  resolved: "bg-success text-white",
}

export default function TicketDetailPage() {
  const { public_id } = useParams()
  const router = useRouter()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const fetchTicket = async () => {
      if (!public_id) {
        setError("Ticket ID is missing.")
        setLoading(false)
        return
      }

      try {
        const { data } = await axios.get(`/api/tickets?public_id=${public_id}`)
        setTicket(data)
        setSelectedStatus(data.status)
      } catch (err) {
        console.error("Error fetching ticket:", err)
        setError("Failed to load ticket details.")
      } finally {
        setLoading(false)
      }
    }

    fetchTicket()
  }, [public_id])

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus)
    setShowModal(true)
  }

  const confirmStatusUpdate = async () => {
    if (!ticket || !selectedStatus) return

    setUpdating(true)
    setError(null)
    setShowModal(false)

    try {
      const { data } = await axios.put("/api/tickets", {
        public_id: ticket.public_id,
        status: selectedStatus,
      })
      setTicket(data)
    } catch (err) {
      console.error("Error updating ticket status:", err)
      setError("Failed to update ticket status.")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Ticket Details</h1>
        {ticket?.status && (
          <span
            className={`px-3 py-1 rounded-lg text-sm font-semibold ${
              statusStyles[ticket.status]
            }`}
          >
            {statusMapping[selectedStatus as keyof typeof statusMapping] ?? ""}
          </span>
        )}
      </div>
      {ticket && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* Header Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-bold">Ticket ID</h2>
              <div className="flex items-center">
                <pre className="bg-gray-100 p-2 rounded-lg border text-sm select-all">
                  {ticket.public_id}
                </pre>
                <button
                  className="btn btn-sm btn-outline ml-2"
                  onClick={() =>
                    navigator.clipboard.writeText(ticket.public_id)
                  }
                >
                  Copy
                </button>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold">Name</h2>
              <p>{ticket.name}</p>
            </div>
            <div>
              <h2 className="text-lg font-bold">Email</h2>
              <p>{ticket.email}</p>
            </div>
            <div>
              <h2 className="text-lg font-bold">Created</h2>
              <span
                className="tooltip tooltip-top"
                data-tip={formatExactTime(ticket.created_at)}
              >
                {formatRelativeTime(ticket.created_at)}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold">Last Updated</h2>
              <span
                className="tooltip tooltip-top"
                data-tip={formatExactTime(ticket.updated_at)}
              >
                {formatRelativeTime(ticket.updated_at)}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold">Status</h2>
              <select
                className="select select-bordered w-full"
                value={selectedStatus ?? ""}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updating}
              >
                {Object.entries(statusMapping).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-6">
            <h2 className="text-lg font-bold">Description</h2>
            <p className="p-4 bg-gray-50 rounded-md border">
              {ticket.description}
            </p>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      )}
      <button onClick={() => router.back()} className="btn btn-outline mt-6">
        Go Back
      </button>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Status Change</h3>
            <p className="py-4">
              Are you sure you want to change the ticket status to{" "}
              <span className="font-bold">
                {statusMapping[selectedStatus as keyof typeof statusMapping] ??
                  ""}
              </span>
              ?
            </p>
            <div className="modal-action">
              <button
                className="btn btn-error"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="btn btn-success" onClick={confirmStatusUpdate}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
