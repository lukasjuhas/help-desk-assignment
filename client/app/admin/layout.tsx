import Sidebar from "../components/Sidebar"
import Footer from "../components/Footer"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <main className="p-6 flex-grow">{children}</main>
        <Footer />
      </div>
    </div>
  )
}
