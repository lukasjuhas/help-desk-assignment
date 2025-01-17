import type { Metadata } from "next"
import { Space_Mono } from "next/font/google"
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
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${spaceMono.variable} antialiased bg-stone-300`}>
        {children}
      </body>
    </html>
  )
}
