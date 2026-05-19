"use client"

import { MessageSquare, Shield, MapPin, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface Message {
  id: number
  sender: string
  avatar: string
  time: string
  text: string
  risk: boolean
  keywords: string[]
  location?: string
}

const messages: Message[] = [
  {
    id: 1,
    sender: "Budi Santoso",
    avatar: "BS",
    time: "14:21",
    text: "Morning everyone, it's been raining since last night",
    risk: false,
    keywords: [],
  },
  {
    id: 2,
    sender: "Siti Rahayu",
    avatar: "SR",
    time: "14:23",
    text: "Yeah, the river behind the houses is getting higher 😟",
    risk: true,
    keywords: ["river", "higher"],
    location: "Block A, RT 05",
  },
  {
    id: 3,
    sender: "Pak Hendra",
    avatar: "PH",
    time: "14:26",
    text: "Can anyone help move stuff up to the second floor?",
    risk: false,
    keywords: [],
  },
  {
    id: 4,
    sender: "Ahmad Kurniawan",
    avatar: "AK",
    time: "14:31",
    text: "Water is starting to enter the street in front of our alley 🌊",
    risk: true,
    keywords: ["water", "enter", "street"],
    location: "Gang Mawar, RT 05",
  },
  {
    id: 5,
    sender: "Dewi Marlina",
    avatar: "DM",
    time: "14:35",
    text: "The drainage near the mosque is overflowing! Kids be careful",
    risk: true,
    keywords: ["drainage", "overflowing"],
    location: "Near Masjid Al-Hidayah",
  },
  {
    id: 6,
    sender: "Rini Wulandari",
    avatar: "RW",
    time: "14:38",
    text: "Rain is becoming much stronger here, it won't stop",
    risk: true,
    keywords: ["rain", "stronger"],
    location: "Block C, RT 05",
  },
  {
    id: 7,
    sender: "Pak Hendra",
    avatar: "PH",
    time: "14:39",
    text: "Same here too. Hope it clears up soon 🙏",
    risk: false,
    keywords: [],
  },
]

function highlightKeywords(text: string, keywords: string[]) {
  if (!keywords.length) return <span>{text}</span>

  const parts: React.ReactNode[] = []
  let remaining = text

  keywords.forEach((kw) => {
    const idx = remaining.toLowerCase().indexOf(kw.toLowerCase())
    if (idx === -1) return
    if (idx > 0) parts.push(remaining.slice(0, idx))
    parts.push(
      <span key={kw} className="font-bold text-orange-700 underline decoration-dotted">
        {remaining.slice(idx, idx + kw.length)}
      </span>
    )
    remaining = remaining.slice(idx + kw.length)
  })
  parts.push(remaining)

  return <>{parts}</>
}

export function WhatsAppMonitor() {
  const riskCount = messages.filter((m) => m.risk).length

  return (
    <div className="flex h-full flex-col">
      {/* Group header */}
      <div className="border-b border-border bg-card px-3 py-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366]">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">RT 05/08 Citeureup</p>
              <p className="text-[10px] text-muted-foreground">156 members</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="text-[10px] font-medium text-green-700">AI Monitoring Active</span>
          </div>
        </div>
      </div>

      {/* Risk summary banner */}
      {riskCount > 0 && (
        <div className="border-b border-orange-200 bg-orange-50 px-3 py-2">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-orange-600" />
            <p className="text-xs font-semibold text-orange-800">
              {riskCount} risk signals detected in the last 20 minutes
            </p>
            <Badge className="ml-auto bg-orange-500 text-white text-[10px]">HIGH</Badge>
          </div>
        </div>
      )}

      {/* Chat feed */}
      <div className="flex-1 space-y-2 overflow-y-auto bg-[#e5ddd5] px-3 py-3">
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-2">
            {/* Avatar */}
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/80 text-[9px] font-bold text-white">
              {msg.avatar}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[78%] rounded-lg rounded-tl-none px-3 py-2 shadow-sm ${
                msg.risk
                  ? "border border-orange-300 bg-orange-50"
                  : "bg-white"
              }`}
            >
              <p className={`text-[10px] font-semibold ${msg.risk ? "text-orange-700" : "text-primary"}`}>
                {msg.sender}
              </p>
              <p className="mt-0.5 text-xs text-gray-800 leading-relaxed">
                {msg.risk
                  ? highlightKeywords(msg.text, msg.keywords)
                  : msg.text}
              </p>
              <div className="mt-1 flex items-center justify-between gap-2">
                <span className="text-[9px] text-gray-400">{msg.time}</span>
                {msg.risk && msg.location && (
                  <div className="flex items-center gap-0.5">
                    <MapPin className="h-2.5 w-2.5 text-orange-500" />
                    <span className="text-[9px] text-orange-600">{msg.location}</span>
                  </div>
                )}
                {msg.risk && (
                  <AlertTriangle className="h-3 w-3 text-orange-500" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="border-t border-border bg-card px-3 py-2 text-center">
        <p className="text-[9px] text-muted-foreground">
          RakyatBanjir monitors this group automatically · Residents use WhatsApp normally
        </p>
      </div>
    </div>
  )
}
