"use client"

import { useState } from "react"
import {
  AlertTriangle,
  MessageSquare,
  MapPin,
  Clock,
  Phone,
  Eye,
  Megaphone,
  ChevronRight,
  TrendingUp,
  ArrowLeft,
  Send,
  Smile,
  Paperclip,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const triggeringMessages = [
  {
    id: 1,
    sender: "Siti Rahayu",
    avatar: "SR",
    time: "14:23",
    text: '"The river behind the houses is getting higher 😟"',
    keywords: ["river", "higher"],
    location: "Block A, RT 05",
    phone: "+62 812-3456-7890",
  },
  {
    id: 2,
    sender: "Ahmad Kurniawan",
    avatar: "AK",
    time: "14:31",
    text: '"Water is starting to enter the street in front of our alley 🌊"',
    keywords: ["water", "enter", "street"],
    location: "Gang Mawar, RT 05",
    phone: "+62 813-2345-6789",
  },
  {
    id: 3,
    sender: "Dewi Marlina",
    avatar: "DM",
    time: "14:35",
    text: '"The drainage near the mosque is overflowing! Kids be careful"',
    keywords: ["drainage", "overflowing"],
    location: "Near Masjid Al-Hidayah",
    phone: "+62 857-8765-4321",
  },
  {
    id: 4,
    sender: "Rini Wulandari",
    avatar: "RW",
    time: "14:38",
    text: '"Rain is becoming much stronger here, it won\'t stop"',
    keywords: ["rain", "stronger"],
    location: "Block C, RT 05",
    phone: "+62 821-9988-7766",
  },
]

type View = "alert" | "picker" | "chat"

interface Resident {
  sender: string
  avatar: string
  location: string
  phone: string
}

function EmptyChat({ resident, onBack }: { resident: Resident; onBack: () => void }) {
  return (
    <div className="flex h-full flex-col">
      {/* Chat header */}
      <div className="flex items-center gap-3 border-b border-border bg-card px-3 py-2.5">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/80 text-xs font-bold text-white">
          {resident.avatar}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{resident.sender}</p>
          <p className="text-[10px] text-muted-foreground">{resident.phone}</p>
        </div>
      </div>

      {/* Chat body - empty with a hint */}
      <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-[#e5ddd5] px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/60">
          <MessageSquare className="h-7 w-7 text-muted-foreground" />
        </div>
        <p className="text-xs text-gray-500">
          Start a conversation with <span className="font-semibold">{resident.sender}</span>
        </p>
        <p className="text-[10px] text-gray-400">{resident.location}</p>
      </div>

      {/* Input bar (non-functional) */}
      <div className="flex items-center gap-2 border-t border-border bg-card px-3 py-2">
        <button className="text-muted-foreground">
          <Smile className="h-5 w-5" />
        </button>
        <div className="flex-1 rounded-full border border-border bg-muted px-4 py-2">
          <span className="text-xs text-muted-foreground">Message</span>
        </div>
        <button className="text-muted-foreground">
          <Paperclip className="h-5 w-5" />
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function ResidentPicker({ onSelect, onBack }: { onSelect: (r: Resident) => void; onBack: () => void }) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border bg-card px-3 py-2.5">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <p className="text-sm font-semibold text-foreground">Contact Resident</p>
          <p className="text-[10px] text-muted-foreground">Select who to contact</p>
        </div>
      </div>

      {/* Resident list */}
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          Residents who reported flood conditions
        </p>
        {triggeringMessages.map((msg) => (
          <button
            key={msg.id}
            onClick={() => onSelect({ sender: msg.sender, avatar: msg.avatar, location: msg.location, phone: msg.phone })}
            className="w-full text-left"
          >
            <Card className="border-border transition-colors hover:border-primary/50 hover:bg-accent">
              <CardContent className="flex items-center gap-3 p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/80 text-xs font-bold text-white">
                  {msg.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{msg.sender}</p>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <p className="text-[10px] text-muted-foreground truncate">{msg.location}</p>
                  </div>
                  <p className="mt-0.5 text-[10px] text-orange-600 line-clamp-1">{msg.text}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </CardContent>
            </Card>
          </button>
        ))}
      </div>
    </div>
  )
}

export function AlertsView() {
  const [view, setView] = useState<View>("alert")
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null)

  if (view === "chat" && selectedResident) {
    return <EmptyChat resident={selectedResident} onBack={() => setView("picker")} />
  }

  if (view === "picker") {
    return (
      <ResidentPicker
        onBack={() => setView("alert")}
        onSelect={(r) => { setSelectedResident(r); setView("chat") }}
      />
    )
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-background">
      <div className="space-y-3 p-3">
        {/* Alert header card */}
        <Card className="border-0 bg-orange-500">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-base font-bold text-white">Community Risk Alert</p>
                  <Badge className="bg-white/20 text-white text-[10px] font-bold">HIGH PRIORITY</Badge>
                </div>
                <p className="mt-0.5 text-xs text-white/80">
                  4 residents reported flood-related conditions in the last 17 minutes
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-white/15 px-3 py-2">
              <TrendingUp className="h-4 w-4 text-white" />
              <p className="text-xs text-white">
                Priority automatically escalated — multiple reports in short window
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Meta info row */}
        <div className="grid grid-cols-3 gap-2">
          <Card className="border-border">
            <CardContent className="p-2.5 text-center">
              <p className="text-lg font-bold text-orange-600">4</p>
              <p className="text-[10px] text-muted-foreground">Messages flagged</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-2.5 text-center">
              <p className="text-lg font-bold text-orange-600">17m</p>
              <p className="text-[10px] text-muted-foreground">Time window</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-2.5 text-center">
              <p className="text-lg font-bold text-orange-600">8</p>
              <p className="text-[10px] text-muted-foreground">Keywords hit</p>
            </CardContent>
          </Card>
        </div>

        {/* Detected keywords */}
        <Card className="border-border">
          <CardContent className="p-3">
            <p className="mb-2 text-xs font-semibold text-foreground">Flood-related keywords detected</p>
            <div className="flex flex-wrap gap-1.5">
              {["river rising", "water entering", "street", "drainage", "overflowing", "rain stronger"].map((kw) => (
                <span
                  key={kw}
                  className="rounded-full border border-orange-300 bg-orange-50 px-2.5 py-0.5 text-[10px] font-medium text-orange-700"
                >
                  {kw}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Triggering messages */}
        <div>
          <p className="mb-2 text-xs font-semibold text-foreground">Triggering messages</p>
          <div className="space-y-2">
            {triggeringMessages.map((msg) => (
              <Card key={msg.id} className="border-orange-200 bg-orange-50/60">
                <CardContent className="p-3">
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/80 text-[10px] font-bold text-white">
                      {msg.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-semibold text-foreground">{msg.sender}</p>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span className="text-[10px]">{msg.time}</span>
                        </div>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-700 leading-relaxed">{msg.text}</p>
                      <div className="mt-1.5 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-orange-500" />
                          <span className="text-[10px] text-orange-600">{msg.location}</span>
                        </div>
                        <div className="flex gap-1">
                          {msg.keywords.map((kw) => (
                            <span key={kw} className="rounded bg-orange-200 px-1.5 py-0.5 text-[9px] font-bold text-orange-800">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Source label */}
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
          <MessageSquare className="h-4 w-4 text-[#25D366]" />
          <p className="text-xs text-muted-foreground">
            Source: <span className="font-medium text-foreground">RT 05/08 Citeureup WhatsApp Group</span>
          </p>
        </div>

        {/* Action buttons */}
        <div>
          <p className="mb-2 text-xs font-semibold text-foreground">Asep&apos;s response options</p>
          <div className="space-y-2">
            <Button
              className="h-11 w-full justify-between bg-primary hover:bg-primary/90"
              size="sm"
              onClick={() => setView("picker")}
            >
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4" />
                <div className="text-left">
                  <p className="text-xs font-semibold">Contact Residents Directly</p>
                  <p className="text-[10px] text-primary-foreground/70">Call or message affected members</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Button variant="outline" className="h-11 w-full justify-between border-orange-300 hover:bg-orange-50" size="sm">
              <div className="flex items-center gap-2.5">
                <Eye className="h-4 w-4 text-orange-600" />
                <div className="text-left">
                  <p className="text-xs font-semibold text-foreground">Initiate Enhanced Monitoring</p>
                  <p className="text-[10px] text-muted-foreground">Increase scan frequency for this group</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Button>

            <Button variant="outline" className="h-11 w-full justify-between border-red-300 hover:bg-red-50" size="sm">
              <div className="flex items-center gap-2.5">
                <Megaphone className="h-4 w-4 text-red-600" />
                <div className="text-left">
                  <p className="text-xs font-semibold text-foreground">Activate Emergency Channel</p>
                  <p className="text-[10px] text-muted-foreground">Before official BPBD alert is issued</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>

        <div className="h-2" />
      </div>
    </div>
  )
}
