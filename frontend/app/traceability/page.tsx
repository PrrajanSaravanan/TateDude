"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { QrCode, MapPin, Calendar, DollarSign, Shield, Truck, CheckCircle } from "lucide-react"
import { useState } from "react"

const mockBlockchainData = {
  productId: "BC-TOM-2024-001",
  productName: "Organic Tomatoes",
  origin: "Nashik, Maharashtra",
  supplier: "Green Valley Farms",
  harvestDate: "2024-01-15",
  packagingDate: "2024-01-16",
  expiryDate: "2024-01-25",
  price: "₹45/kg",
  certifications: ["Organic", "FSSAI Approved"],
  transportRoute: ["Nashik → Mumbai → Local Market"],
  blockchainHash: "0x1a2b3c4d5e6f7g8h9i0j",
  verificationStatus: "Verified",
}

const priceComparison = [
  { supplier: "Green Valley Farms", price: "₹45/kg", rating: 4.8, verified: true },
  { supplier: "Fresh Produce Co.", price: "₹42/kg", rating: 4.5, verified: true },
  { supplier: "Local Vendor", price: "₹38/kg", rating: 4.2, verified: false },
  { supplier: "Wholesale Market", price: "₹40/kg", rating: 4.0, verified: true },
]

export default function TraceabilityPage() {
  const [scannedData, setScannedData] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [qrInput, setQrInput] = useState("")

  const handleQRScan = () => {
    setIsScanning(true)
    setTimeout(() => {
      setScannedData(mockBlockchainData)
      setIsScanning(false)
    }, 2000)
  }

  const handleManualInput = () => {
    if (qrInput.trim()) {
      setScannedData(mockBlockchainData)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight">
            BLOCKCHAIN TRACEABILITY
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg font-medium">
            VERIFY THE ORIGIN AND AUTHENTICITY OF YOUR RAW MATERIALS USING BLOCKCHAIN TECHNOLOGY
          </p>
        </motion.div>

        {/* QR Scanner Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <Card className="bg-primary border-0 hover:glow-orange-strong transition-all duration-300">
            <CardContent className="p-10">
              <div className="text-center mb-8">
                <QrCode className="w-16 h-16 mx-auto mb-6 text-white" />
                <h2 className="text-2xl font-black mb-4 text-white uppercase tracking-tight">
                  SCAN RAW MATERIAL QR CODE
                </h2>
                <p className="text-white/90 text-lg font-medium">
                  SCAN THE QR CODE ON YOUR RAW MATERIAL PACKAGING TO VERIFY ITS ORIGIN
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
                <Button
                  onClick={handleQRScan}
                  disabled={isScanning}
                  variant="secondary"
                  size="lg"
                  className="flex-1 bg-black text-white hover:bg-gray-900 font-bold uppercase tracking-wide transition-all duration-300 hover:glow-orange"
                >
                  {isScanning ? "SCANNING..." : "SCAN QR CODE"}
                </Button>
              </div>

              <div className="pt-8 border-t border-white/20">
                <p className="text-white/90 text-sm mb-4 text-center font-semibold uppercase">
                  OR ENTER QR CODE MANUALLY:
                </p>
                <div className="flex gap-3 max-w-md mx-auto">
                  <Input
                    placeholder="Enter QR code"
                    value={qrInput}
                    onChange={(e) => setQrInput(e.target.value)}
                    className="bg-black/20 border-white/20 text-white placeholder:text-white/60 focus:border-white font-medium"
                  />
                  <Button
                    onClick={handleManualInput}
                    variant="secondary"
                    className="bg-black text-white hover:bg-gray-900 font-bold uppercase px-6"
                  >
                    VERIFY
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Scanned Data Display */}
        {scannedData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Product Information */}
            <Card className="bg-gray-900 border-gray-800 hover:border-primary transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-white">
                  <CheckCircle className="w-6 h-6 text-primary" />
                  <span className="font-black uppercase tracking-tight">PRODUCT VERIFICATION</span>
                  <Badge variant="secondary" className="bg-primary text-white font-bold uppercase">
                    {scannedData.verificationStatus}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-black text-white mb-4 uppercase tracking-wide">PRODUCT DETAILS</h3>
                      <div className="space-y-3">
                        <p className="text-gray-300 font-medium">
                          <span className="text-gray-400 uppercase text-sm">Name:</span>{" "}
                          <span className="text-white font-bold">{scannedData.productName}</span>
                        </p>
                        <p className="text-gray-300 font-medium">
                          <span className="text-gray-400 uppercase text-sm">ID:</span>{" "}
                          <span className="text-white font-bold">{scannedData.productId}</span>
                        </p>
                        <p className="text-gray-300 font-medium">
                          <span className="text-gray-400 uppercase text-sm">Price:</span>{" "}
                          <span className="text-primary font-bold">{scannedData.price}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-black text-white mb-4 uppercase tracking-wide">ORIGIN & SUPPLIER</h3>
                      <div className="space-y-3">
                        <p className="flex items-center text-gray-300 font-medium">
                          <MapPin className="w-5 h-5 mr-3 text-primary" />
                          <span className="text-white font-bold">{scannedData.origin}</span>
                        </p>
                        <p className="text-gray-300 font-medium">
                          <span className="text-gray-400 uppercase text-sm">Supplier:</span>{" "}
                          <span className="text-white font-bold">{scannedData.supplier}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-black text-white mb-4 uppercase tracking-wide">DATES</h3>
                      <div className="space-y-3">
                        <p className="flex items-center text-gray-300 font-medium">
                          <Calendar className="w-5 h-5 mr-3 text-primary" />
                          <span className="text-gray-400 uppercase text-sm mr-2">Harvest:</span>{" "}
                          <span className="text-white font-bold">{scannedData.harvestDate}</span>
                        </p>
                        <p className="text-gray-300 font-medium">
                          <span className="text-gray-400 uppercase text-sm">Packaging:</span>{" "}
                          <span className="text-white font-bold">{scannedData.packagingDate}</span>
                        </p>
                        <p className="text-gray-300 font-medium">
                          <span className="text-gray-400 uppercase text-sm">Expiry:</span>{" "}
                          <span className="text-white font-bold">{scannedData.expiryDate}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-800">
                  <h3 className="font-black text-white mb-4 uppercase tracking-wide">CERTIFICATIONS</h3>
                  <div className="flex flex-wrap gap-3">
                    {scannedData.certifications.map((cert) => (
                      <Badge key={cert} variant="outline" className="border-primary text-primary font-bold uppercase">
                        <Shield className="w-4 h-4 mr-2" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-800">
                  <h3 className="font-black text-white mb-4 uppercase tracking-wide">TRANSPORT ROUTE</h3>
                  <div className="flex items-center space-x-3 text-gray-300 font-medium">
                    <Truck className="w-5 h-5 text-primary" />
                    <span className="text-white font-bold">{scannedData.transportRoute.join(" ")}</span>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-800">
                  <h3 className="font-black text-white mb-3 uppercase tracking-wide">BLOCKCHAIN HASH</h3>
                  <p className="text-sm font-mono bg-black p-4 rounded border border-gray-800 text-primary font-bold">
                    {scannedData.blockchainHash}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Price Comparison */}
            <Card className="bg-gray-900 border-gray-800 hover:border-primary transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-white">
                  <DollarSign className="w-6 h-6 text-primary" />
                  <span className="font-black uppercase tracking-tight">PRICE COMPARISON</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {priceComparison.map((supplier, index) => (
                    <div
                      key={supplier.supplier}
                      className="flex items-center justify-between p-6 bg-black rounded-lg border border-gray-800 hover:border-primary transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <Badge
                          variant={index === 0 ? "default" : "secondary"}
                          className={`font-bold text-lg ${index === 0 ? "bg-primary text-white" : "bg-gray-800 text-gray-300"}`}
                        >
                          {index === 0 ? "CURRENT" : `#${index + 1}`}
                        </Badge>
                        <div>
                          <p className="font-black text-white uppercase">{supplier.supplier}</p>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className="text-sm text-gray-400 font-semibold">RATING: {supplier.rating}/5</span>
                            {supplier.verified && (
                              <Badge
                                variant="outline"
                                className="text-xs border-primary text-primary font-bold uppercase"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                VERIFIED
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-primary text-xl">{supplier.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Empty State */}
        {!scannedData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <div className="w-32 h-32 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-800">
              <QrCode className="w-16 h-16 text-gray-600" />
            </div>
            <h3 className="text-2xl font-black text-white mb-4 uppercase">NO QR CODE SCANNED</h3>
            <p className="text-gray-400 max-w-md mx-auto font-medium">
              SCAN A QR CODE FROM YOUR RAW MATERIAL PACKAGING TO VIEW ITS BLOCKCHAIN VERIFICATION AND TRACEABILITY
              INFORMATION.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
