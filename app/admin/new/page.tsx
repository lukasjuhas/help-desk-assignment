import { use } from "react"
import TicketList from "@/app/components/TicketList"

export default function NewTicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const resolvedParams = use(searchParams) // Use `use` to resolve the `Promise`
  const currentPage = parseInt(resolvedParams.page || "1", 10)

  return (
    <TicketList status="new" title="New Tickets" currentPage={currentPage} />
  )
}
