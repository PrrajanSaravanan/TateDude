"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Users, Shield, IndianRupee, Download, Share2, Bell } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const statsData = [
  {
    title: "DAILY FOOTFALL",
    value: "127",
    change: "+12%",
    icon: Users,
    color: "text-primary",
  },
  {
    title: "TODAY'S PROFIT",
    value: "₹450",
    change: "+8%",
    icon: IndianRupee,
    color: "text-primary",
  },
  {
    title: "HYGIENE SCORE",
    value: "92/100",
    change: "+5%",
    icon: Shield,
    color: "text-primary",
  },
]

const features = [
  {
    title: "CUSTOMER ANALYTICS",
    description: "Track customer patterns and popular items with advanced insights",
    href: "/analytics",
    icon: "📊",
  },
  {
    title: "BLOCKCHAIN TRACEABILITY",
    description: "Verify raw material origins and suppliers with blockchain technology",
    href: "/traceability",
    icon: "🔗",
  },
  {
    title: "AI HYGIENE SCAN",
    description: "Get instant hygiene scores and personalized recommendations",
    href: "/hygiene",
    icon: "🔍",
  },
  {
    title: "VOICE ASSISTANT",
    description: "Get business insights through voice commands in multiple languages",
    href: "/voice",
    icon: "🎤",
  },
  {
    title: "MANUFACTURER DIRECTORY",
    description: "Connect with verified suppliers and quality manufacturers",
    href: "/directory",
    icon: "🏭",
  },
  {
    title: "STREET WRAPPED",
    description: "Your comprehensive business analytics and performance summary",
    href: "/wrapped",
    icon: "🎁",
  },
]

export default function HomePage() {
  const [notification, setNotification] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(""), 3000)
  }

  const handleQuickAction = async (action: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
    setIsLoading(false)

    switch (action) {
      case "download":
        showNotification("📊 Daily report downloaded successfully!")
        break
      case "share":
        showNotification("📱 Business stats shared to WhatsApp!")
        break
      case "notifications":
        showNotification("🔔 All notifications marked as read!")
        break
    }
  }

  const handleStatClick = (statTitle: string) => {
    showNotification(`📈 ${statTitle} details updated!`)
  }

  return (
    <div className="min-h-screen bg-black animated-bg">
      {/* Notification */}
      {notification && <div className="notification success-state">{notification}</div>}

      <div className="container mx-auto px-6 py-12 max-w-7xl relative">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tight"
            animate={{
              textShadow: [
                "0 0 20px rgba(139, 92, 246, 0.5)",
                "0 0 40px rgba(139, 92, 246, 0.8)",
                "0 0 20px rgba(139, 92, 246, 0.5)",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            WELCOME TO <span className="text-primary">STREETLENS</span>
          </motion.h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-medium mb-8">
            EMPOWERING INDIAN STREET FOOD VENDORS WITH SMART ANALYTICS, BLOCKCHAIN TRACEABILITY, AND AI-POWERED INSIGHTS
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => handleQuickAction("download")}
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wide btn-hover"
              >
                {isLoading ? <div className="loading-spinner mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                DOWNLOAD REPORT
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => handleQuickAction("share")}
                disabled={isLoading}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white font-bold uppercase tracking-wide btn-hover"
              >
                <Share2 className="w-4 h-4 mr-2" />
                SHARE STATS
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => handleQuickAction("notifications")}
                disabled={isLoading}
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-gray-800 font-bold uppercase tracking-wide btn-hover"
              >
                <Bell className="w-4 h-4 mr-2" />
                NOTIFICATIONS
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Live Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {statsData.map((stat, index) => (
            <motion.div key={stat.title} whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card
                className="bg-gray-900/80 backdrop-blur-sm border-gray-800 hover:border-primary transition-all duration-300 hover:glow-purple group pulse-glow cursor-pointer"
                onClick={() => handleStatClick(stat.title)}
              >
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">{stat.title}</p>
                      <p className="text-4xl font-black text-white mt-2">{stat.value}</p>
                      <p className="text-sm text-primary flex items-center mt-3 font-semibold">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        {stat.change} FROM YESTERDAY
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-black/50 border border-gray-800 group-hover:border-primary transition-all duration-300 rotating-border">
                      <div className="w-full h-full flex items-center justify-center">
                        <stat.icon className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Link href={feature.href}>
                <Card className="h-full cursor-pointer bg-gray-900/80 backdrop-blur-sm border-gray-800 hover:border-primary transition-all duration-300 hover:glow-purple wave-bg">
                  <CardHeader className="text-center pb-6">
                    <motion.div
                      className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.2 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <CardTitle className="text-xl font-black text-white uppercase tracking-tight">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-300 mb-6 font-medium leading-relaxed">{feature.description}</p>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent border-primary text-primary hover:bg-primary hover:text-white font-bold uppercase tracking-wide transition-all duration-300 btn-hover"
                    >
                      OPEN FEATURE
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <Card className="bg-primary/90 backdrop-blur-sm border-0 hover:glow-purple-strong transition-all duration-300 pulse-glow">
            <CardContent className="p-12">
              <motion.h2
                className="text-3xl font-black mb-6 text-white uppercase tracking-tight"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                READY TO BOOST YOUR BUSINESS?
              </motion.h2>
              <p className="text-white/90 mb-8 text-lg font-medium max-w-2xl mx-auto">
                START WITH OUR AI-POWERED ANALYTICS TO UNDERSTAND YOUR CUSTOMERS BETTER AND MAXIMIZE YOUR PROFITS
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/analytics">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="secondary"
                      size="lg"
                      className="w-full sm:w-auto bg-black text-white hover:bg-gray-900 font-bold uppercase tracking-wide px-8 py-4 text-lg transition-all duration-300 hover:glow-purple btn-hover"
                    >
                      START ANALYTICS
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/hygiene">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-primary font-bold uppercase tracking-wide px-8 py-4 text-lg transition-all duration-300 btn-hover"
                    >
                      HYGIENE CHECK
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
