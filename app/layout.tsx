import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Movie Suggestions for Mom",
  description: "A beautiful app to discover and track movies and shows",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white min-h-screen`}>
        <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/30 to-pink-950/30">{children}</div>
      </body>
    </html>
  )
}
