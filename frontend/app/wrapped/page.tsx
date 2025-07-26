"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Share2, Download, Trophy, Calendar, TrendingUp, IndianRupee, Crown } from "lucide-react"
import { useState } from "react"

const wrappedData = {
  year: "2024",
  totalProfit: "₹1,64,250",
  totalCustomers: 4567,
  bestDay: "Saturday",
  mostProfitableItem: "Vada Pav",
  itemsSold: 1234,
  itemRevenue: "₹12,340",
  peakMonth: "December",
  growthRate: "+23%",
  hygieneScore: 94,
  customerSatisfaction: 4.8,
}

const monthlyData = [
  { month: "Jan", profit: 12000 },
  { month: "Feb", profit: 11500 },
  { month: "Mar", profit: 13200 },
  { month: "Apr", profit: 14800 },
  { month: "May", profit: 13900 },
  { month: "Jun", profit: 15200 },
  { month: "Jul", profit: 16100 },
  { month: "Aug", profit: 15800 },
  { month: "Sep", profit: 14500 },
  { month: "Oct", profit: 16800 },
  { month: "Nov", profit: 17200 },
  { month: "Dec", profit: 18400 },
]

const achievements = [
  {
    title: "Hygiene Champion",
    description: "Maintained 90+ hygiene score for 6 months",
    icon: "🏆",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    title: "Customer Favorite",
    description: "Served over 4,500 happy customers",
    icon: "❤️",
    color: "bg-red-100 text-red-800",
  },
  {
    title: "Growth Master",
    description: "23% profit growth this year",
    icon: "📈",
    color: "bg-green-100 text-green-800",
  },
  {
    title: "Consistency King",
    description: "Open 350+ days this year",
    icon: "⭐",
    color: "bg-blue-100 text-blue-800",
  },
]

export default function WrappedPage() {
  const [isSharing, setIsSharing] = useState(false)

  const handleWhatsAppShare = () => {
    const message = `🎉 My StreetLens Year in Review ${wrappedData.year}!\n\n💰 Total Profit: ${wrappedData.totalProfit}\n👥 Customers Served: ${wrappedData.totalCustomers}\n🏆 Best Item: ${wrappedData.mostProfitableItem}\n📈 Growth: ${wrappedData.growthRate}\n\nPowered by StreetLens 🚀`

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleDownload = () => {
    alert("Your Street Wrapped report has been downloaded!")
  }

  return (
    <div className="min-h-screen bg-black animated-bg">
      <div className="container mx-auto px-6 py-12 max-w-7xl relative">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <motion.div
            className="inline-flex items-center space-x-2 bg-primary/20 rounded-full px-8 py-3 mb-8 border border-primary/30"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <Crown className="w-6 h-6 text-primary" />
            <span className="font-black text-primary uppercase tracking-wide">STREET WRAPPED {wrappedData.year}</span>
          </motion.div>
          <motion.h1
            className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tight"
            animate={{
              background: [
                "linear-gradient(45deg, #8B5CF6, #A78BFA)",
                "linear-gradient(45deg, #A78BFA, #C4B5FD)",
                "linear-gradient(45deg, #8B5CF6, #A78BFA)",
              ],
            }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            style={{
              background: "linear-gradient(45deg, #8B5CF6, #A78BFA)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            YOUR YEAR IN REVIEW
          </motion.h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-medium">
            CELEBRATING YOUR INCREDIBLE JOURNEY AS A STREET FOOD ENTREPRENEUR
          </p>
        </motion.div>

        {/* Key Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          <motion.div whileHover={{ scale: 1.05, y: -10 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="bg-gradient-to-br from-green-600 to-emerald-700 border-0 text-white pulse-glow">
              <CardContent className="p-8 text-center">
                <IndianRupee className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-4xl font-black mb-2">{wrappedData.totalProfit}</h3>
                <p className="text-green-100 font-medium uppercase">TOTAL PROFIT</p>
                <Badge className="mt-2 bg-white/20 text-white border-0 font-bold uppercase">
                  {wrappedData.growthRate} GROWTH
                </Badge>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05, y: -10 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="bg-gradient-to-br from-blue-600 to-cyan-700 border-0 text-white pulse-glow">
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">👥</div>
                <h3 className="text-4xl font-black mb-2">{wrappedData.totalCustomers.toLocaleString()}</h3>
                <p className="text-blue-100 font-medium uppercase">HAPPY CUSTOMERS</p>
                <Badge className="mt-2 bg-white/20 text-white border-0 font-bold uppercase">
                  ⭐ {wrappedData.customerSatisfaction}/5 RATING
                </Badge>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05, y: -10 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="bg-gradient-to-br from-purple-600 to-pink-700 border-0 text-white pulse-glow">
              <CardContent className="p-8 text-center">
                <Trophy className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-2xl font-black mb-2">{wrappedData.mostProfitableItem}</h3>
                <p className="text-purple-100 font-medium uppercase">TOP SELLING ITEM</p>
                <Badge className="mt-2 bg-white/20 text-white border-0 font-bold uppercase">
                  {wrappedData.itemsSold} SOLD
                </Badge>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05, y: -10 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="bg-gradient-to-br from-orange-600 to-red-700 border-0 text-white pulse-glow">
              <CardContent className="p-8 text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-2xl font-black mb-2">{wrappedData.bestDay}</h3>
                <p className="text-orange-100 font-medium uppercase">BEST DAY OF WEEK</p>
                <Badge className="mt-2 bg-white/20 text-white border-0 font-bold uppercase">PEAK PERFORMANCE</Badge>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Profit Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800 hover:border-primary transition-all duration-300 wave-bg">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2 font-black uppercase tracking-tight">
                <TrendingUp className="w-6 h-6 text-primary" />
                <span>MONTHLY PROFIT JOURNEY</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.2)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                  <YAxis stroke="rgba(255,255,255,0.7)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.9)",
                      border: "1px solid #8B5CF6",
                      borderRadius: "8px",
                      color: "white",
                    }}
                  />
                  <Bar dataKey="profit" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-black text-center mb-12 text-white uppercase tracking-tight">
            🏆 YOUR ACHIEVEMENTS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800 hover:border-primary transition-all duration-300 h-full pulse-glow">
                  <CardContent className="p-8 text-center">
                    <motion.div
                      className="text-5xl mb-4"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
                    >
                      {achievement.icon}
                    </motion.div>
                    <h3 className="text-lg font-black text-white mb-2 uppercase tracking-tight">{achievement.title}</h3>
                    <p className="text-gray-300 text-sm font-medium">{achievement.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Special Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-16"
        >
          <Card className="bg-primary/90 backdrop-blur-sm border-0 hover:glow-purple-strong transition-all duration-300 pulse-glow">
            <CardContent className="p-12 text-center">
              <motion.div
                className="text-7xl mb-8"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                🎉
              </motion.div>
              <motion.h2
                className="text-4xl font-black mb-6 text-white uppercase tracking-tight"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                YOU'RE AMAZING!
              </motion.h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90 font-medium">
                THIS YEAR, YOU SERVED DELICIOUS FOOD TO THOUSANDS OF CUSTOMERS, MAINTAINED EXCELLENT HYGIENE STANDARDS,
                AND GREW YOUR BUSINESS BY {wrappedData.growthRate}. YOU'RE NOT JUST A VENDOR - YOU'RE A FOOD
                ENTREPRENEUR!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <motion.div
                  className="bg-white/20 rounded-lg p-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="text-3xl font-black text-white">{wrappedData.peakMonth}</h3>
                  <p className="text-white/80 font-medium uppercase">BEST MONTH</p>
                </motion.div>
                <motion.div
                  className="bg-white/20 rounded-lg p-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="text-3xl font-black text-white">{wrappedData.hygieneScore}/100</h3>
                  <p className="text-white/80 font-medium uppercase">AVG HYGIENE SCORE</p>
                </motion.div>
                <motion.div
                  className="bg-white/20 rounded-lg p-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="text-3xl font-black text-white">350+</h3>
                  <p className="text-white/80 font-medium uppercase">DAYS ACTIVE</p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Share Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="text-center"
        >
          <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800 hover:border-primary transition-all duration-300 rotating-border">
            <CardContent className="p-12">
              <motion.h2
                className="text-3xl font-black text-white mb-6 uppercase tracking-tight"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                SHARE YOUR SUCCESS!
              </motion.h2>
              <p className="text-gray-300 mb-8 text-lg font-medium max-w-md mx-auto">
                LET YOUR CUSTOMERS AND FRIENDS KNOW ABOUT YOUR INCREDIBLE YEAR IN THE STREET FOOD BUSINESS
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleWhatsAppShare}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold uppercase tracking-wide px-8 py-4 transition-all duration-300 hover:glow-purple"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    SHARE TO WHATSAPP
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    size="lg"
                    className="border-primary text-primary hover:bg-primary hover:text-white font-bold uppercase tracking-wide px-8 py-4 transition-all duration-300 bg-transparent"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    DOWNLOAD REPORT
                  </Button>
                </motion.div>
              </div>
              <p className="text-xs text-gray-500 mt-6 font-medium uppercase">
                POWERED BY STREETLENS - YOUR AI-POWERED BUSINESS COMPANION
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
