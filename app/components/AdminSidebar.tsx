"use client"

import { usePathname } from "next/navigation"

export default function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/new", label: "New Tickets" },
    { href: "/admin/progress", label: "In Progress" },
    { href: "/admin/resolved", label: "Resolved" },
  ]

  return (
    <aside className="w-64 flex-shrink-0">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <nav className="space-y-2">
          {navItems.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={`block py-2 px-4 rounded hover:bg-primary ${
                pathname === href ? "bg-primary" : ""
              }`}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  )
}
