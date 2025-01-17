import type { Metadata } from "next"
import { Space_Mono } from "next/font/google"
import Navbar from "./components/Navbar"
import "./globals.css"

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: "400",
})

export const metadata: Metadata = {
  title: "Help Desk Assignment",
  description: "Help Desk Assignment by Lukas Juhas",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${spaceMono.variable} antialiased bg-gray-100 min-h-screen`}
      >
        <header>
          <Navbar />
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
