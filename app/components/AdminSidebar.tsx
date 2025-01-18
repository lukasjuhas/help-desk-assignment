"use client"

import { usePathname } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import HifiLogo from "../../public/hifi-logo.svg"

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/new", label: "New Tickets" },
    { href: "/admin/progress", label: "In Progress" },
    { href: "/admin/resolved", label: "Resolved" },
  ]

  return (
    <>
      {/* Mobile Hamburger Menu */}
      <button
        className="lg:hidden fixed top-4 left-4 p-2 bg-gray-200 rounded-full shadow-md z-30"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg> // Close icon
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg> // Hamburger icon
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gray-100 border-r transition-transform transform lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } z-20`}
      >
        <div className="p-6">
          {/* Logo */}
          <div className="mb-10">
            <Link href="/">
              <Image
                priority
                src={HifiLogo}
                alt="HIFI Help Desk"
                className="w-12 ml-14 lg:ml-0"
              />
            </Link>
          </div>

          {/* Navigation */}
          <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
          <nav className="space-y-2">
            {navItems.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className={`block py-2 px-4 rounded-lg hover:bg-gray-200 ${
                  pathname === href ? "bg-primary" : ""
                }`}
                onClick={() => setIsOpen(false)} // Close on click
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  )
}
