import AdminSidebar from "../components/AdminSidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen pt-16">
      {/* Sidebar */}
      <AdminSidebar />
      {/* Main Content */}
      <div className="flex-grow p-6 lg:ml-64">{children}</div>
    </div>
  )
}
