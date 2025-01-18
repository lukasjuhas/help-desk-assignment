import AdminSidebar from "../components/AdminSidebar"
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <AdminSidebar />
      {/* Main Content */}
      <div className="flex-grow bg-gray-100 p-6">{children}</div>
    </div>
  )
}
