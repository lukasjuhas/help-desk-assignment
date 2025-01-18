import { use } from "react"
import TicketList from "@/app/components/TicketList"

export default function ProgressTicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const resolvedParams = use(searchParams)
  const currentPage = parseInt(resolvedParams.page || "1", 10)

  return (
    <TicketList
      status="progress"
      title="In Progress Tickets"
      currentPage={currentPage}
    />
  )
}
