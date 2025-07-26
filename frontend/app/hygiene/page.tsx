"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Camera, Upload, Shield, AlertTriangle, CheckCircle, Lightbulb } from "lucide-react"
import { useState } from "react"

const mockHygieneData = {
  overallScore: 92,
  riskLevel: "Low",
  verificationBadge: true,
  categories: [
    { name: "Food Storage", score: 95, status: "excellent" },
    { name: "Cooking Area", score: 88, status: "good" },
    { name: "Utensil Cleanliness", score: 94, status: "excellent" },
    { name: "Personal Hygiene", score: 90, status: "good" },
    { name: "Waste Management", score: 92, status: "excellent" },
  ],
  tips: [
    "Clean cooking surfaces every 2 hours during peak times",
    "Wash hands before handling each new ingredient",
    "Store raw vegetables in covered containers",
    "Replace dish towels every 4 hours",
    "Keep waste bins covered and empty regularly",
  ],
  improvements: [
    "Consider using separate cutting boards for vegetables and meat",
    "Install hand sanitizer dispenser near cooking area",
  ],
}

export default function HygienePage() {
  const [scanResult, setScanResult] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [uploadedImage, setUploadedImage] = useState(null)

  const handleImageCapture = () => {
    setIsScanning(true)
    setTimeout(() => {
      setScanResult(mockHygieneData)
      setIsScanning(false)
    }, 3000)
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target.result)
        setIsScanning(true)
        setTimeout(() => {
          setScanResult(mockHygieneData)
          setIsScanning(false)
        }, 3000)
      }
      reader.readAsDataURL(file)
    }
  }

  const getRiskColor = (riskLevel) => {
    switch (riskLevel.toLowerCase()) {
      case "low":
        return "text-green-600 bg-green-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "high":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600"
    if (score >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "excellent":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "good":
        return <CheckCircle className="w-4 h-4 text-blue-500" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      default:
        return <AlertTriangle className="w-4 h-4 text-red-500" />
    }
  }

  return (
    <div className="min-h-screen bg-black animated-bg">
      <div className="container mx-auto px-6 py-12 max-w-7xl relative">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight">
            AI HYGIENE SCANNER
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg font-medium">
            GET INSTANT HYGIENE SCORES AND PERSONALIZED TIPS USING AI-POWERED IMAGE ANALYSIS
          </p>
        </motion.div>

        {/* Image Capture Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <Card className="bg-primary/90 backdrop-blur-sm border-0 hover:glow-purple-strong transition-all duration-300 pulse-glow wave-bg">
            <CardContent className="p-10 text-center">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Camera className="w-16 h-16 mx-auto mb-6 text-white" />
              </motion.div>
              <h2 className="text-2xl font-black mb-4 text-white uppercase tracking-tight">CAPTURE YOUR FOOD STALL</h2>
              <p className="text-white/90 mb-8 text-lg font-medium">
                TAKE A PHOTO OR UPLOAD AN IMAGE OF YOUR FOOD PREPARATION AREA FOR AI ANALYSIS
              </p>

              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleImageCapture}
                    disabled={isScanning}
                    variant="secondary"
                    size="lg"
                    className="flex-1 bg-black text-white hover:bg-gray-900 font-bold uppercase tracking-wide transition-all duration-300 hover:glow-purple"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {isScanning ? "ANALYZING..." : "CAPTURE PHOTO"}
                  </Button>
                </motion.div>

                <label className="flex-1">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      as="span"
                      variant="outline"
                      size="lg"
                      className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 font-bold uppercase tracking-wide"
                      disabled={isScanning}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      UPLOAD IMAGE
                    </Button>
                  </motion.div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isScanning}
                  />
                </label>
              </div>

              {isScanning && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-center">
                  <div className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-6 py-3">
                    <motion.div
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />
                    <span className="font-semibold">AI IS ANALYZING YOUR IMAGE...</span>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Uploaded Image Preview */}
        {uploadedImage && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800 hover:border-primary transition-all duration-300 rotating-border">
              <CardHeader>
                <CardTitle className="text-white font-black uppercase tracking-tight">UPLOADED IMAGE</CardTitle>
              </CardHeader>
              <CardContent>
                <motion.img
                  src={uploadedImage || "/placeholder.svg"}
                  alt="Uploaded for analysis"
                  className="w-full max-w-md mx-auto rounded-lg shadow-md"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Scan Results */}
        {scanResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Overall Score */}
            <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800 hover:border-primary transition-all duration-300 pulse-glow">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <motion.div
                    className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-primary to-purple-600 rounded-full text-white text-3xl font-black mb-6"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    {scanResult.overallScore}
                  </motion.div>
                  <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">HYGIENE SCORE</h2>
                  <div className="flex items-center justify-center space-x-4">
                    <Badge className={`${getRiskColor(scanResult.riskLevel)} border-0 font-bold uppercase`}>
                      {scanResult.riskLevel} RISK
                    </Badge>
                    {scanResult.verificationBadge && (
                      <Badge variant="outline" className="border-primary text-primary font-bold uppercase">
                        <Shield className="w-3 h-3 mr-1" />
                        AI HYGIENE VERIFIED
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {scanResult.categories.map((category, index) => (
                    <motion.div
                      key={category.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-black/50 rounded-lg p-6 border border-gray-800 hover:border-primary transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-black text-white uppercase tracking-wide">{category.name}</h3>
                        {getStatusIcon(category.status)}
                      </div>
                      <div className="flex items-center space-x-3">
                        <Progress value={category.score} className="flex-1" />
                        <span className={`font-black ${getScoreColor(category.score)}`}>{category.score}%</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tips and Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Hygiene Tips */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800 hover:border-primary transition-all duration-300 wave-bg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-white font-black uppercase tracking-tight">
                      <Lightbulb className="w-5 h-5 text-primary" />
                      <span>HYGIENE TIPS</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {scanResult.tips.map((tip, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="flex items-start space-x-3 p-4 bg-primary/10 rounded-lg border border-primary/20"
                        >
                          <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-black flex-shrink-0">
                            {index + 1}
                          </div>
                          <p className="text-sm text-gray-300 font-medium">{tip}</p>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Improvements */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800 hover:border-primary transition-all duration-300 wave-bg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-white font-black uppercase tracking-tight">
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      <span>SUGGESTED IMPROVEMENTS</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {scanResult.improvements.map((improvement, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="flex items-start space-x-3 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20"
                        >
                          <div className="w-8 h-8 bg-yellow-500 text-black rounded-full flex items-center justify-center text-sm font-black flex-shrink-0">
                            !
                          </div>
                          <p className="text-sm text-gray-300 font-medium">{improvement}</p>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card className="bg-primary/90 backdrop-blur-sm border-0 hover:glow-purple-strong transition-all duration-300 pulse-glow">
                <CardContent className="p-8 text-center">
                  <motion.h3
                    className="text-2xl font-black mb-4 text-white uppercase tracking-tight"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    GREAT JOB ON MAINTAINING HYGIENE!
                  </motion.h3>
                  <p className="text-white/90 mb-8 text-lg font-medium">
                    YOUR HYGIENE SCORE IS EXCELLENT. KEEP UP THE GOOD WORK TO MAINTAIN CUSTOMER TRUST.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="secondary"
                        size="lg"
                        className="bg-black text-white hover:bg-gray-900 font-bold uppercase tracking-wide transition-all duration-300 hover:glow-purple"
                      >
                        DOWNLOAD CERTIFICATE
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="lg"
                        className="bg-transparent border-white text-white hover:bg-white hover:text-primary font-bold uppercase tracking-wide"
                      >
                        SHARE SCORE
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Empty State */}
        {!scanResult && !isScanning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <motion.div
              className="w-32 h-32 bg-gray-900/80 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-800"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Camera className="w-16 h-16 text-gray-600" />
            </motion.div>
            <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">NO IMAGE ANALYZED YET</h3>
            <p className="text-gray-400 max-w-md mx-auto font-medium">
              CAPTURE OR UPLOAD AN IMAGE OF YOUR FOOD PREPARATION AREA TO GET INSTANT HYGIENE ANALYSIS AND PERSONALIZED
              RECOMMENDATIONS.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
