"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MessageCircle, Search, Star, Shield, MapPin, Phone, Mail } from "lucide-react"
import { useState } from "react"

const manufacturers = [
  {
    id: 1,
    name: "Green Valley Farms",
    location: "Nashik, Maharashtra",
    products: ["Tomatoes", "Onions", "Potatoes", "Leafy Greens"],
    rating: 4.8,
    hygieneRating: 95,
    blockchainVerified: true,
    phone: "+91 98765 43210",
    email: "contact@greenvalley.com",
    description: "Organic farm specializing in fresh vegetables with blockchain traceability.",
    priceRange: "₹30-50/kg",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    name: "Fresh Produce Co.",
    location: "Pune, Maharashtra",
    products: ["Spices", "Grains", "Pulses", "Oil"],
    rating: 4.5,
    hygieneRating: 88,
    blockchainVerified: true,
    phone: "+91 87654 32109",
    email: "sales@freshproduce.com",
    description: "Wholesale supplier of quality spices and grains for street food vendors.",
    priceRange: "₹80-200/kg",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    name: "Mumbai Masala House",
    location: "Mumbai, Maharashtra",
    products: ["Pav", "Bread", "Buns", "Bakery Items"],
    rating: 4.7,
    hygieneRating: 92,
    blockchainVerified: false,
    phone: "+91 76543 21098",
    email: "orders@mumbaimasala.com",
    description: "Traditional bakery providing fresh pav and bread for street food stalls.",
    priceRange: "₹15-25/piece",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    name: "Coastal Coconut Suppliers",
    location: "Goa",
    products: ["Coconut Oil", "Fresh Coconuts", "Coconut Milk"],
    rating: 4.6,
    hygieneRating: 90,
    blockchainVerified: true,
    phone: "+91 65432 10987",
    email: "info@coastalcoconut.com",
    description: "Premium coconut products sourced directly from coastal farms.",
    priceRange: "₹120-180/liter",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    name: "Rajasthan Spice Traders",
    location: "Jodhpur, Rajasthan",
    products: ["Red Chili", "Turmeric", "Coriander", "Cumin"],
    rating: 4.4,
    hygieneRating: 85,
    blockchainVerified: true,
    phone: "+91 54321 09876",
    email: "trade@rajasthanspice.com",
    description: "Authentic Rajasthani spices with traditional processing methods.",
    priceRange: "₹150-300/kg",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 6,
    name: "Kerala Curry Leaves Co.",
    location: "Kochi, Kerala",
    products: ["Curry Leaves", "Black Pepper", "Cardamom", "Ginger"],
    rating: 4.9,
    hygieneRating: 96,
    blockchainVerified: true,
    phone: "+91 43210 98765",
    email: "hello@keralacurry.com",
    description: "Fresh aromatic herbs and spices from Kerala's spice gardens.",
    priceRange: "₹200-500/kg",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function DirectoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedManufacturer, setSelectedManufacturer] = useState(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [filterRating, setFilterRating] = useState(0)
  const [filterVerified, setFilterVerified] = useState(false)

  const filteredManufacturers = manufacturers.filter((manufacturer) => {
    const matchesSearch =
      manufacturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manufacturer.products.some((product) => product.toLowerCase().includes(searchTerm.toLowerCase())) ||
      manufacturer.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRating = manufacturer.rating >= filterRating
    const matchesVerified = !filterVerified || manufacturer.blockchainVerified

    return matchesSearch && matchesRating && matchesVerified
  })

  const handleChat = (manufacturer) => {
    setSelectedManufacturer(manufacturer)
    setChatOpen(true)
  }

  return (
    <div className="min-h-screen bg-black animated-bg">
      <div className="container mx-auto px-6 py-12 max-w-7xl relative">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight">
            MANUFACTURER DIRECTORY
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg font-medium">
            CONNECT WITH VERIFIED SUPPLIERS AND MANUFACTURERS FOR YOUR RAW MATERIALS
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800 hover:border-primary transition-all duration-300 rotating-border">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5" />
                  <Input
                    placeholder="SEARCH BY NAME, PRODUCT, OR LOCATION..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 bg-black/50 border-gray-700 text-white placeholder:text-gray-400 focus:border-primary font-medium uppercase"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant={filterVerified ? "default" : "outline"}
                      onClick={() => setFilterVerified(!filterVerified)}
                      size="sm"
                      className={`font-bold uppercase tracking-wide transition-all duration-300 ${
                        filterVerified
                          ? "bg-primary hover:bg-primary text-white pulse-glow"
                          : "border-gray-600 text-gray-300 hover:border-primary hover:text-white"
                      }`}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      VERIFIED ONLY
                    </Button>
                  </motion.div>

                  <select
                    value={filterRating}
                    onChange={(e) => setFilterRating(Number(e.target.value))}
                    className="px-4 py-2 bg-black/50 border border-gray-700 rounded-md text-white font-medium uppercase focus:border-primary"
                  >
                    <option value={0}>ALL RATINGS</option>
                    <option value={4}>4+ STARS</option>
                    <option value={4.5}>4.5+ STARS</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Manufacturers Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredManufacturers.map((manufacturer, index) => (
            <motion.div
              key={manufacturer.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02, y: -10 }}
              className="group"
            >
              <Card className="h-full bg-gray-900/80 backdrop-blur-sm border-gray-800 hover:border-primary transition-all duration-300 hover:glow-purple wave-bg">
                <div className="relative">
                  <motion.img
                    src={manufacturer.image || "/placeholder.svg"}
                    alt={manufacturer.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                  {manufacturer.blockchainVerified && (
                    <Badge className="absolute top-2 right-2 bg-primary hover:bg-primary text-white font-bold uppercase pulse-glow">
                      <Shield className="w-3 h-3 mr-1" />
                      VERIFIED
                    </Badge>
                  )}
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-black text-white uppercase tracking-tight">
                        {manufacturer.name}
                      </CardTitle>
                      <p className="text-sm text-gray-400 flex items-center mt-1 font-medium">
                        <MapPin className="w-3 h-3 mr-1 text-primary" />
                        {manufacturer.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-black text-white">{manufacturer.rating}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Products */}
                    <div>
                      <h4 className="font-black text-white mb-2 uppercase tracking-wide">PRODUCTS:</h4>
                      <div className="flex flex-wrap gap-2">
                        {manufacturer.products.slice(0, 3).map((product) => (
                          <Badge
                            key={product}
                            variant="secondary"
                            className="text-xs bg-primary/20 text-primary border-primary/30 font-bold uppercase"
                          >
                            {product}
                          </Badge>
                        ))}
                        {manufacturer.products.length > 3 && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-primary/20 text-primary border-primary/30 font-bold uppercase"
                          >
                            +{manufacturer.products.length - 3} MORE
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Hygiene Rating */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400 font-bold uppercase">HYGIENE SCORE:</span>
                      <Badge
                        variant="outline"
                        className={`font-bold uppercase ${
                          manufacturer.hygieneRating >= 90
                            ? "border-green-500 text-green-400"
                            : "border-yellow-500 text-yellow-400"
                        }`}
                      >
                        {manufacturer.hygieneRating}/100
                      </Badge>
                    </div>

                    {/* Price Range */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400 font-bold uppercase">PRICE RANGE:</span>
                      <span className="font-black text-primary">{manufacturer.priceRange}</span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-300 line-clamp-2 font-medium">{manufacturer.description}</p>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                        <Button
                          onClick={() => handleChat(manufacturer)}
                          className="w-full bg-primary hover:bg-primary text-white font-bold uppercase tracking-wide transition-all duration-300 hover:glow-purple"
                          size="sm"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          CHAT
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300 hover:border-primary hover:text-primary bg-transparent"
                        >
                          <Phone className="w-4 h-4" />
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300 hover:border-primary hover:text-primary bg-transparent"
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredManufacturers.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
            <motion.div
              className="w-32 h-32 bg-gray-900/80 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-800"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Search className="w-16 h-16 text-gray-600" />
            </motion.div>
            <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">NO MANUFACTURERS FOUND</h3>
            <p className="text-gray-400 max-w-md mx-auto font-medium">
              TRY ADJUSTING YOUR SEARCH TERMS OR FILTERS TO FIND MORE SUPPLIERS.
            </p>
          </motion.div>
        )}

        {/* Chat Dialog */}
        <Dialog open={chatOpen} onOpenChange={setChatOpen}>
          <DialogContent className="max-w-md bg-gray-900/95 backdrop-blur-sm border-gray-800">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2 text-white font-black uppercase tracking-tight">
                <MessageCircle className="w-5 h-5 text-primary" />
                <span>CHAT WITH {selectedManufacturer?.name}</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-black/50 rounded-lg p-4 max-h-60 overflow-y-auto border border-gray-800">
                <div className="space-y-3">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-primary text-white rounded-lg p-3 ml-8"
                  >
                    <p className="text-sm font-medium">
                      Hello! I'm interested in your products for my street food stall.
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gray-800 text-white rounded-lg p-3 mr-8 border border-gray-700"
                  >
                    <p className="text-sm font-medium">
                      Hi! Thank you for your interest. We'd be happy to supply fresh ingredients. What products do you
                      need?
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                    className="bg-primary text-white rounded-lg p-3 ml-8"
                  >
                    <p className="text-sm font-medium">
                      I need tomatoes and onions for my Pav Bhaji stall. What are your rates?
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 }}
                    className="bg-gray-800 text-white rounded-lg p-3 mr-8 border border-gray-700"
                  >
                    <p className="text-sm font-medium">
                      Our current rates are ₹45/kg for tomatoes and ₹35/kg for onions. All blockchain verified with
                      quality guarantee!
                    </p>
                  </motion.div>
                </div>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="TYPE YOUR MESSAGE..."
                  className="flex-1 bg-black/50 border-gray-700 text-white placeholder:text-gray-400 focus:border-primary font-medium uppercase"
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary text-white font-bold uppercase tracking-wide"
                  >
                    SEND
                  </Button>
                </motion.div>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-500 font-medium">
                  THIS IS A DEMO CHAT. IN PRODUCTION, THIS WOULD CONNECT TO A REAL MESSAGING SYSTEM.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
