import { use } from "react"
import TicketList from "@/app/components/TicketList"

export default function ResolvedTicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const resolvedParams = use(searchParams)
  const currentPage = parseInt(resolvedParams.page || "1", 10)

  return (
    <TicketList
      status="resolved"
      title="Resolved Tickets"
      currentPage={currentPage}
    />
  )
}
