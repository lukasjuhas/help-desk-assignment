import Link from "next/link"
import { formatRelativeTime, formatExactTime, truncateText } from "@/lib/utils"

type Ticket = {
  public_id: string
  name: string
  email: string
  description: string
  status: string
  created_at: string
}

type TicketTableProps = {
  tickets: Ticket[]
  showStatus?: boolean
}

export default function TicketTable({
  tickets,
  showStatus = false,
}: TicketTableProps) {
  return (
    <table className="table-auto w-full text-left">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-4">ID</th>
          <th className="p-4">Name</th>
          <th className="p-4">Description</th>
          <th className="p-4">Created</th>
          {showStatus && <th className="p-4">Status</th>}
        </tr>
      </thead>
      <tbody>
        {tickets.map((ticket) => (
          <tr key={ticket.public_id} className="hover:bg-gray-50">
            <td className="p-4">
              <Link
                href={`/admin/tickets/${ticket.public_id}`}
                className="text-blue-500 hover:underline"
              >
                {ticket.public_id}
              </Link>
            </td>
            <td className="p-4">{ticket.name}</td>
            <td className="p-4">{truncateText(ticket.description, 30)}</td>
            <td className="p-4">
              <span
                className="tooltip tooltip-top"
                data-tip={formatExactTime(ticket.created_at)}
              >
                {formatRelativeTime(ticket.created_at)}
              </span>
            </td>
            {showStatus && <td className="p-4 capitalize">{ticket.status}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
