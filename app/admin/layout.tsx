export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex-shrink-0">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
          <nav className="space-y-2">
            <a
              href="/admin"
              className="block py-2 px-4 rounded hover:bg-gray-700"
            >
              Dashboard
            </a>
            <a
              href="/admin/new"
              className="block py-2 px-4 rounded hover:bg-gray-700"
            >
              New Tickets
            </a>
            <a
              href="/admin/progress"
              className="block py-2 px-4 rounded hover:bg-gray-700"
            >
              In Progress
            </a>
            <a
              href="/admin/resolved"
              className="block py-2 px-4 rounded hover:bg-gray-700"
            >
              Resolved
            </a>
          </nav>
        </div>
      </aside>
      {/* Main Content */}
      <div className="flex-grow bg-gray-100 p-6">{children}</div>
    </div>
  )
}
