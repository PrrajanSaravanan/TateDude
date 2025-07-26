"use client"

import type React from "react"

import "./globals.css"
import { Inter } from "next/font/google"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Home, BarChart3, LinkIcon, Shield, Mic, Building, Gift } from "lucide-react"
import { motion } from "framer-motion"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
})

const navigation = [
  { name: "HOME", href: "/", icon: Home },
  { name: "ANALYTICS", href: "/analytics", icon: BarChart3 },
  { name: "TRACEABILITY", href: "/traceability", icon: LinkIcon },
  { name: "HYGIENE", href: "/hygiene", icon: Shield },
  { name: "VOICE", href: "/voice", icon: Mic },
  { name: "DIRECTORY", href: "/directory", icon: Building },
  { name: "WRAPPED", href: "/wrapped", icon: Gift },
]

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white animated-bg`}>
        <div className="min-h-screen bg-black animated-bg">
          {/* Floating Particles */}
          <div className="particles fixed inset-0 pointer-events-none">
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
          </div>

          {/* Desktop Navigation */}
          <nav className="bg-black/90 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50 wave-bg">
            <div className="container mx-auto px-6 max-w-7xl">
              <div className="flex justify-between items-center h-20">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-3 group">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center transition-all duration-300 group-hover:glow-purple rotating-border">
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-white font-black text-lg">SL</span>
                    </div>
                  </div>
                  <span className="text-2xl font-black text-white uppercase tracking-tight">STREETLENS</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-2">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link key={item.name} href={item.href}>
                        <Button
                          variant={isActive ? "default" : "ghost"}
                          size="sm"
                          className={`flex items-center space-x-2 font-semibold tracking-wide transition-all duration-300 ${
                            isActive
                              ? "bg-primary hover:bg-primary text-white hover:glow-purple pulse-glow"
                              : "text-gray-300 hover:text-white hover:bg-gray-900"
                          }`}
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </Button>
                      </Link>
                    )
                  })}
                </div>

                {/* Mobile Menu Button */}
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="md:hidden text-white hover:text-primary">
                      <Menu className="w-6 h-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80 bg-black/95 backdrop-blur-sm border-gray-800">
                    <div className="flex flex-col space-y-4 mt-12">
                      {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                          <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                            <Button
                              variant={isActive ? "default" : "ghost"}
                              size="lg"
                              className={`w-full justify-start space-x-3 font-semibold tracking-wide transition-all duration-300 ${
                                isActive
                                  ? "bg-primary hover:bg-primary text-white"
                                  : "text-gray-300 hover:text-white hover:bg-gray-900"
                              }`}
                            >
                              <item.icon className="w-5 h-5" />
                              <span>{item.name}</span>
                            </Button>
                          </Link>
                        )
                      })}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1 relative">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </body>
    </html>
  )
}
