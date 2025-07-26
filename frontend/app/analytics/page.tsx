"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { QrCode, Clock, TrendingUp, Users, ShoppingBag, Download, RefreshCw, Filter } from "lucide-react"
import { useState } from "react"

const hourlyData = [
  { hour: "6 AM", customers: 12 },
  { hour: "8 AM", customers: 45 },
  { hour: "10 AM", customers: 32 },
  { hour: "12 PM", customers: 78 },
  { hour: "2 PM", customers: 65 },
  { hour: "4 PM", customers: 43 },
  { hour: "6 PM", customers: 89 },
  { hour: "8 PM", customers: 67 },
  { hour: "10 PM", customers: 23 },
]

const popularItems = [
  { name: "Vada Pav", sales: 45, revenue: "₹450" },
  { name: "Pav Bhaji", sales: 32, revenue: "₹640" },
  { name: "Dosa", sales: 28, revenue: "₹420" },
  { name: "Idli Sambar", sales: 25, revenue: "₹250" },
  { name: "Misal Pav", sales: 18, revenue: "₹360" },
]

export default function AnalyticsPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [notification, setNotification] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(""), 3000)
  }

  const handleQRScan = async () => {
    setIsScanning(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsScanning(false)
    showNotification("✅ QR Code scanned! Customer data recorded.")
  }

  const handleRefreshData = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsRefreshing(false)
    showNotification("🔄 Analytics data refreshed successfully!")
  }

  const handleDownloadReport = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    showNotification("📊 Analytics report downloaded!")
  }

  const handleFilterData = () => {
    showNotification("🔍 Filters applied to analytics data!")
  }

  return (
    <div className="min-h-screen bg-black animated-bg">
      {/* Notification */}
      {notification && <div className="notification success-state">{notification}</div>}

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight">
            CUSTOMER ANALYTICS
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg font-medium mb-8">
            TRACK CUSTOMER PATTERNS, POPULAR ITEMS, AND OPTIMIZE YOUR BUSINESS HOURS WITH REAL-TIME INSIGHTS
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleRefreshData}
                disabled={isRefreshing}
                className="bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wide btn-hover"
              >
                {isRefreshing ? <div className="loading-spinner mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                REFRESH DATA
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleDownloadReport}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white font-bold uppercase tracking-wide btn-hover bg-transparent"
              >
                <Download className="w-4 h-4 mr-2" />
                DOWNLOAD REPORT
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleFilterData}
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-gray-800 font-bold uppercase tracking-wide btn-hover"
              >
                <Filter className="w-4 h-4 mr-2" />
                FILTER DATA
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* QR Scanner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <Card className="bg-primary/90 backdrop-blur-sm border-0 hover:glow-purple-strong transition-all duration-300 pulse-glow">
            <CardContent className="p-10 text-center">
              <motion.div
                animate={{ rotate: isScanning ? [0, 360] : 0 }}
                transition={{ duration: 2, repeat: isScanning ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
              >
                <QrCode className="w-16 h-16 mx-auto mb-6 text-white" />
              </motion.div>
              <h2 className="text-2xl font-black mb-4 text-white uppercase tracking-tight">QR CUSTOMER CHECK-IN</h2>
              <p className="text-white/90 mb-8 text-lg font-medium">
                LET CUSTOMERS SCAN QR TO TRACK FOOTFALL AND PREFERENCES
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleQRScan}
                  disabled={isScanning}
                  variant="secondary"
                  size="lg"
                  className="bg-black text-white hover:bg-gray-900 font-bold uppercase tracking-wide px-8 py-4 transition-all duration-300 hover:glow-purple btn-hover"
                >
                  {isScanning ? (
                    <>
                      <div className="loading-spinner mr-2" />
                      SCANNING...
                    </>
                  ) : (
                    "START QR SCANNER"
                  )}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800 hover:border-primary transition-all duration-300 hover:glow-purple group cursor-pointer">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">TODAY'S FOOTFALL</p>
                    <p className="text-4xl font-black text-white mt-2">127</p>
                    <p className="text-sm text-primary flex items-center mt-3 font-semibold">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      +12% FROM YESTERDAY
                    </p>
                  </div>
                  <Users className="w-10 h-10 text-primary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800 hover:border-primary transition-all duration-300 hover:glow-purple group cursor-pointer">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">PEAK HOUR</p>
                    <p className="text-4xl font-black text-white mt-2">6-8 PM</p>
                    <p className="text-sm text-primary font-semibold mt-3">89 CUSTOMERS</p>
                  </div>
                  <Clock className="w-10 h-10 text-primary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800 hover:border-primary transition-all duration-300 hover:glow-purple group cursor-pointer">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">TOP ITEM</p>
                    <p className="text-4xl font-black text-white mt-2">VADA PAV</p>
                    <p className="text-sm text-primary font-semibold mt-3">45 SOLD TODAY</p>
                  </div>
                  <ShoppingBag className="w-10 h-10 text-primary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Hourly Footfall Chart */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800 hover:border-primary transition-all duration-300 wave-bg">
              <CardHeader>
                <CardTitle className="text-white font-black uppercase tracking-tight">
                  HOURLY FOOTFALL PATTERN
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="hour" stroke="#F5F5F5" />
                    <YAxis stroke="#F5F5F5" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111111",
                        border: "1px solid #8B5CF6",
                        borderRadius: "8px",
                        color: "#FFFFFF",
                      }}
                    />
                    <Bar dataKey="customers" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Popular Items */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800 hover:border-primary transition-all duration-300 wave-bg">
              <CardHeader>
                <CardTitle className="text-white font-black uppercase tracking-tight">POPULAR ITEMS TODAY</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {popularItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-4 bg-black/50 rounded-lg border border-gray-800 hover:border-primary transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-center space-x-4">
                        <Badge
                          variant="secondary"
                          className="bg-primary text-white font-bold text-lg w-8 h-8 rounded-full flex items-center justify-center"
                        >
                          {index + 1}
                        </Badge>
                        <div>
                          <p className="font-bold text-white uppercase">{item.name}</p>
                          <p className="text-sm text-gray-400 font-semibold">{item.sales} SOLD</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-primary text-lg">{item.revenue}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Restock Suggestions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="bg-primary/90 backdrop-blur-sm border-0 hover:glow-purple-strong transition-all duration-300 pulse-glow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-white">
                <TrendingUp className="w-6 h-6" />
                <span className="font-black uppercase tracking-tight">SMART RESTOCK SUGGESTIONS</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  className="bg-black/20 rounded-lg p-6 border border-white/10 cursor-pointer hover:bg-black/30 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => showNotification("📦 Pav Bhaji ingredients added to shopping list!")}
                >
                  <h3 className="font-black mb-3 text-white uppercase">🥖 PAV BHAJI INGREDIENTS</h3>
                  <p className="text-white/90 text-sm mb-4 font-medium">HIGH DEMAND EXPECTED DURING 6-8 PM RUSH</p>
                  <Badge variant="secondary" className="bg-black text-white font-bold uppercase">
                    RESTOCK BY 5 PM
                  </Badge>
                </motion.div>
                <motion.div
                  className="bg-black/20 rounded-lg p-6 border border-white/10 cursor-pointer hover:bg-black/30 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => showNotification("🥔 Vada Pav potatoes marked as urgent!")}
                >
                  <h3 className="font-black mb-3 text-white uppercase">🥔 VADA PAV POTATOES</h3>
                  <p className="text-white/90 text-sm mb-4 font-medium">RUNNING LOW - 15 PORTIONS REMAINING</p>
                  <Badge variant="secondary" className="bg-red-600 text-white font-bold uppercase">
                    URGENT RESTOCK
                  </Badge>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
