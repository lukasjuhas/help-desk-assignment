import AdminSidebar from "../components/AdminSidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AdminSidebar />
      {/* Main Content */}
      <div className="flex-grow p-6 lg:ml-64 bg-gray-50">{children}</div>
    </div>
  )
}
