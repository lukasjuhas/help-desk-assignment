export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <div className="flex flex-col flex-grow">
        <main className="p-6 flex-grow">{children}</main>
      </div>
    </div>
  )
}
