import type { Metadata } from "next"
import { Space_Mono } from "next/font/google"
import "./globals.css"
import Sidebar from "./components/Sidebar"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

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
      <body className={`${spaceMono.variable} antialiased`}>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex flex-col flex-grow">
            <Navbar />
            <main className="p-6 flex-grow">{children}</main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  )
}
