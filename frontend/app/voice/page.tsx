"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Volume2, Languages, TrendingUp, IndianRupee } from "lucide-react"
import { useState } from "react"

const voiceResponses = {
  profit: {
    hindi: "आज का मुनाफा ₹450 है। कल से 8% ज्यादा है।",
    english: "Today's profit is ₹450. That's 8% more than yesterday.",
    tamil: "இன்றைய லாபம் ₹450. நேற்றை விட 8% அதிகம்.",
  },
  popular: {
    hindi: "सबसे ज्यादा बिकने वाला आइटम वड़ा पाव है। आज 45 बेचे गए।",
    english: "Most sold item is Vada Pav. 45 pieces sold today.",
    tamil: "அதிகம் விற்பனையான உணவு வடை பாவ். இன்று 45 விற்பனையானது.",
  },
  customers: {
    hindi: "आज 127 ग्राहक आए हैं। कल से 12% ज्यादा।",
    english: "Today we had 127 customers. That's 12% more than yesterday.",
    tamil: "இன்று 127 வாடிக்கையாளர்கள் வந்தனர். நேற்றை விட 12% அதிகம்.",
  },
  restock: {
    hindi: "पाव भाजी के लिए आलू और प्याज की जरूरत है। शाम 5 बजे तक स्टॉक करें।",
    english: "Need to restock potatoes and onions for Pav Bhaji. Stock by 5 PM.",
    tamil: "பாவ் பாஜிக்கு உருளைக்கிழங்கு மற்றும் வெங்காயம் தேவை. மாலை 5 மணிக்குள் சேமிக்கவும்.",
  },
}

const quickCommands = [
  { text: "Today's profit", key: "profit", icon: IndianRupee },
  { text: "Most popular item", key: "popular", icon: TrendingUp },
  { text: "Customer count", key: "customers", icon: "👥" },
  { text: "Restock alerts", key: "restock", icon: "📦" },
]

export default function VoicePage() {
  const [isListening, setIsListening] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState("english")
  const [lastCommand, setLastCommand] = useState("")
  const [response, setResponse] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)

  const languages = [
    { code: "english", name: "English", flag: "🇺🇸" },
    { code: "hindi", name: "हिंदी", flag: "🇮🇳" },
    { code: "tamil", name: "தமிழ்", flag: "🇮🇳" },
  ]

  const startListening = () => {
    setIsListening(true)
    setTimeout(() => {
      setIsListening(false)
      setLastCommand("What is today's profit?")
      setResponse(voiceResponses.profit[currentLanguage])
    }, 3000)
  }

  const stopListening = () => {
    setIsListening(false)
  }

  const handleQuickCommand = (commandKey) => {
    setLastCommand(quickCommands.find((cmd) => cmd.key === commandKey)?.text || "")
    setResponse(voiceResponses[commandKey][currentLanguage])
  }

  const playResponse = () => {
    setIsPlaying(true)
    setTimeout(() => {
      setIsPlaying(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-black animated-bg">
      <div className="container mx-auto px-6 py-12 max-w-7xl relative">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight">VOICE ASSISTANT</h1>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg font-medium">
            GET BUSINESS INSIGHTS THROUGH VOICE COMMANDS IN HINDI, TAMIL, OR ENGLISH
          </p>
        </motion.div>

        {/* Language Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800 hover:border-primary transition-all duration-300 rotating-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white font-black uppercase tracking-tight">
                <Languages className="w-5 h-5 text-primary" />
                <span>SELECT LANGUAGE</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {languages.map((lang) => (
                  <motion.div key={lang.code} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant={currentLanguage === lang.code ? "default" : "outline"}
                      onClick={() => setCurrentLanguage(lang.code)}
                      className={`flex items-center space-x-2 font-bold uppercase tracking-wide transition-all duration-300 ${
                        currentLanguage === lang.code
                          ? "bg-primary hover:bg-primary text-white pulse-glow"
                          : "border-gray-600 text-gray-300 hover:border-primary hover:text-white"
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Voice Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card className="bg-primary/90 backdrop-blur-sm border-0 hover:glow-purple-strong transition-all duration-300 pulse-glow wave-bg">
            <CardContent className="p-12 text-center">
              <motion.div
                animate={
                  isListening
                    ? {
                        scale: [1, 1.2, 1],
                        rotate: [0, 360],
                      }
                    : { scale: 1, rotate: 0 }
                }
                transition={{
                  scale: { repeat: isListening ? Number.POSITIVE_INFINITY : 0, duration: 1 },
                  rotate: { duration: 2, repeat: isListening ? Number.POSITIVE_INFINITY : 0, ease: "linear" },
                }}
                className="mb-8"
              >
                <div
                  className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 ${
                    isListening ? "bg-white/20 animate-pulse" : "bg-white/10"
                  }`}
                >
                  {isListening ? <Mic className="w-16 h-16 text-white" /> : <MicOff className="w-16 h-16 text-white" />}
                </div>
              </motion.div>

              <motion.h2
                className="text-3xl font-black mb-6 text-white uppercase tracking-tight"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                {isListening ? "LISTENING..." : "TAP TO SPEAK"}
              </motion.h2>

              <p className="text-white/90 mb-8 text-lg font-medium">
                {isListening
                  ? "SPEAK YOUR QUESTION NOW"
                  : "ASK ABOUT PROFITS, POPULAR ITEMS, CUSTOMER COUNT, OR RESTOCKING"}
              </p>

              <div className="flex justify-center space-x-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={isListening ? stopListening : startListening}
                    variant="secondary"
                    size="lg"
                    className="flex items-center space-x-2 bg-black text-white hover:bg-gray-900 font-bold uppercase tracking-wide px-8 py-4 transition-all duration-300 hover:glow-purple"
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    <span>{isListening ? "STOP" : "START"} LISTENING</span>
                  </Button>
                </motion.div>
              </div>

              {isListening && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
                  <div className="flex justify-center space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 bg-white rounded-full"
                        animate={{
                          height: [10, 30, 10],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Commands */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800 hover:border-primary transition-all duration-300 wave-bg">
            <CardHeader>
              <CardTitle className="text-white font-black uppercase tracking-tight">QUICK COMMANDS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickCommands.map((command, index) => (
                  <motion.div
                    key={command.key}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      onClick={() => handleQuickCommand(command.key)}
                      className="h-auto p-6 flex flex-col items-center space-y-3 border-gray-600 hover:border-primary hover:bg-primary/10 transition-all duration-300 font-bold uppercase tracking-wide"
                    >
                      {typeof command.icon === "string" ? (
                        <span className="text-3xl">{command.icon}</span>
                      ) : (
                        <command.icon className="w-8 h-8 text-primary" />
                      )}
                      <span className="text-sm text-center text-gray-300">{command.text}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Response Display */}
        {(lastCommand || response) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            {/* Command Recognition */}
            {lastCommand && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800 hover:border-primary transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-white font-black uppercase tracking-tight">
                      <Mic className="w-5 h-5 text-primary" />
                      <span>YOU ASKED:</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl text-gray-300 italic font-medium">"{lastCommand}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Voice Response */}
            {response && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800 hover:border-primary transition-all duration-300 pulse-glow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-white font-black uppercase tracking-tight">
                      <div className="flex items-center space-x-2">
                        <Volume2 className="w-5 h-5 text-primary" />
                        <span>ASSISTANT RESPONSE</span>
                      </div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={playResponse}
                          disabled={isPlaying}
                          variant="outline"
                          size="sm"
                          className="border-primary text-primary hover:bg-primary hover:text-white font-bold uppercase bg-transparent"
                        >
                          {isPlaying ? "PLAYING..." : "PLAY AUDIO"}
                        </Button>
                      </motion.div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-black/50 rounded-lg p-6 mb-4 border border-gray-800">
                      <p className="text-xl text-white font-medium">{response}</p>
                    </div>
                    <Badge variant="secondary" className="bg-primary text-white font-bold uppercase">
                      LANGUAGE: {languages.find((l) => l.code === currentLanguage)?.name}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Empty State */}
        {!lastCommand && !response && !isListening && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center py-16"
          >
            <motion.div
              className="w-32 h-32 bg-gray-900/80 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-800"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Mic className="w-16 h-16 text-gray-600" />
            </motion.div>
            <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">READY TO LISTEN</h3>
            <p className="text-gray-400 max-w-md mx-auto font-medium">
              START SPEAKING OR USE QUICK COMMANDS TO GET INSIGHTS ABOUT YOUR BUSINESS IN YOUR PREFERRED LANGUAGE.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
