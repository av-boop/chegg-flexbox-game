import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Flexbox Learning Game - Master CSS Flexbox",
  description:
    "Interactive game to learn CSS Flexbox properties by positioning students on desks. Learn flexbox through fun, hands-on practice.",
  generator: "v0.app",
  icons: {
    icon: "/chegg-logo.webp",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
