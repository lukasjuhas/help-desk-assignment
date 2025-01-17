import Link from "next/link"

export default function Sidebar() {
  return (
    <div>
      <input type="checkbox" id="sidebar-toggle" className="hidden peer" />
      <label
        htmlFor="sidebar-toggle"
        className="btn btn-circle fixed top-4 left-4 z-50 peer-checked:hidden md:hidden"
      >
        ☰
      </label>

      <aside className="fixed top-0 left-0 h-full w-64 bg-base-200 transform -translate-x-full peer-checked:translate-x-0 transition-transform duration-300 md:translate-x-0 md:relative">
        <div className="p-4 flex items-center justify-between">
          <span className="text-2xl font-bold">Help Desk</span>
          <label htmlFor="sidebar-toggle" className="btn btn-circle md:hidden">
            ✕
          </label>
        </div>
        <nav className="flex-grow">
          <ul className="menu p-4 space-y-2">
            <li>
              <Link href="/" className="hover:bg-stone-300 rounded px-4 py-2">
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/admin"
                className="hover:bg-stone-300 rounded px-4 py-2"
              >
                Admin
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  )
}
