import type React from "react"
import ClientLayout from "./clientLayout"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}

export const metadata = {
      generator: 'v0.dev'
    };
