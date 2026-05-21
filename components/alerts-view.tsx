"use client"

import { useEffect, useState } from "react"
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
  Radio,
  Check,
  Activity,
  DoorOpen,
  Smartphone,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { t, type Locale } from "@/lib/i18n"

function getTriggeringMessages(language: Locale) {
  if (language === "id") {
    return [
      {
        id: 1,
        sender: "Siti Rahayu",
        avatar: "SR",
        time: "14:23",
        text: '"Sungai di belakang rumah semakin naik 😟"',
        keywords: ["sungai", "naik"],
        location: "Blok A, RT 05",
        phone: "+62 812-3456-7890",
      },
      {
        id: 2,
        sender: "Ahmad Kurniawan",
        avatar: "AK",
        time: "14:31",
        text: '"Air mulai masuk ke jalan di depan gang kami 🌊"',
        keywords: ["air", "masuk", "jalan"],
        location: "Gang Mawar, RT 05",
        phone: "+62 813-2345-6789",
      },
      {
        id: 3,
        sender: "Dewi Marlina",
        avatar: "DM",
        time: "14:35",
        text: '"Drainase dekat masjid meluap! Anak-anak hati-hati"',
        keywords: ["drainase", "meluap"],
        location: "Dekat Masjid Al-Hidayah",
        phone: "+62 857-8765-4321",
      },
      {
        id: 4,
        sender: "Rini Wulandari",
        avatar: "RW",
        time: "14:38",
        text: '"Hujan di sini makin deras, belum reda"',
        keywords: ["hujan", "deras"],
        location: "Blok C, RT 05",
        phone: "+62 821-9988-7766",
      },
    ]
  }

  if (language === "su") {
    return [
      {
        id: 1,
        sender: "Siti Rahayu",
        avatar: "SR",
        time: "14:23",
        text: '"Walungan di tukangeun imah beuki luhur 😟"',
        keywords: ["walungan", "luhur"],
        location: "Blok A, RT 05",
        phone: "+62 812-3456-7890",
      },
      {
        id: 2,
        sender: "Ahmad Kurniawan",
        avatar: "AK",
        time: "14:31",
        text: '"Cai mimiti asup ka jalan di hareup gang urang 🌊"',
        keywords: ["cai", "asup", "jalan"],
        location: "Gang Mawar, RT 05",
        phone: "+62 813-2345-6789",
      },
      {
        id: 3,
        sender: "Dewi Marlina",
        avatar: "DM",
        time: "14:35",
        text: '"Drainase deukeut masjid ngabahekeun! Barudak sing ati-ati"',
        keywords: ["drainase", "ngabahekeun"],
        location: "Deukeut Masjid Al-Hidayah",
        phone: "+62 857-8765-4321",
      },
      {
        id: 4,
        sender: "Rini Wulandari",
        avatar: "RW",
        time: "14:38",
        text: '"Hujan di dieu beuki tarik, tacan eureun"',
        keywords: ["hujan", "tarik"],
        location: "Blok C, RT 05",
        phone: "+62 821-9988-7766",
      },
    ]
  }

  return [
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
}

function getDetectedKeywords(language: Locale) {
  if (language === "id") return ["sungai naik", "air masuk", "jalan", "drainase", "meluap", "hujan deras"]
  if (language === "su") return ["walungan luhur", "cai asup", "jalan", "drainase", "ngabahekeun", "hujan tarik"]
  return ["river rising", "water entering", "street", "drainage", "overflowing", "rain stronger"]
}

type View = "alert" | "picker" | "chat" | "monitoring" | "emergency"

interface Resident {
  sender: string
  avatar: string
  location: string
  phone: string
}

function EmptyChat({ resident, onBack, language }: { resident: Resident; onBack: () => void; language: Locale }) {
  return (
    <div className="flex h-full flex-col">
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
      <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-[#e5ddd5] px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/60">
          <MessageSquare className="h-7 w-7 text-muted-foreground" />
        </div>
          <p className="text-xs text-gray-500">
          {t(language, "startConversationWith")} <span className="font-semibold">{resident.sender}</span>
        </p>
        <p className="text-[10px] text-gray-400">{resident.location}</p>
      </div>
      <div className="flex items-center gap-2 border-t border-border bg-card px-3 py-2">
        <button className="text-muted-foreground"><Smile className="h-5 w-5" /></button>
        <div className="flex-1 rounded-full border border-border bg-muted px-4 py-2">
          <span className="text-xs text-muted-foreground">{t(language, "message")}</span>
        </div>
        <button className="text-muted-foreground"><Paperclip className="h-5 w-5" /></button>
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function ResidentPicker({ onSelect, onBack, language }: { onSelect: (r: Resident) => void; onBack: () => void; language: Locale }) {
  const triggeringMessages = getTriggeringMessages(language)
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-border bg-card px-3 py-2.5">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <p className="text-sm font-semibold text-foreground">{t(language, "contactResident")}</p>
          <p className="text-[10px] text-muted-foreground">{t(language, "selectWhoToContact")}</p>
        </div>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {t(language, "residentsReportedFlood")}
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

function EnhancedMonitoring({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<"confirm" | "applying" | "active">("confirm")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (phase !== "applying") return
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); setPhase("active"); return 100 }
        return p + 8
      })
    }, 80)
    return () => clearInterval(interval)
  }, [phase])

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-border bg-card px-3 py-2.5">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <p className="text-sm font-semibold text-foreground">Enhanced Monitoring</p>
          <p className="text-[10px] text-muted-foreground">RT 05/08 Citeureup WhatsApp Group</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Current vs new frequency */}
        <div className="grid grid-cols-2 gap-2">
          <Card className="border-border">
            <CardContent className="p-3 text-center">
              <p className="text-[10px] text-muted-foreground mb-1">Current frequency</p>
              <p className="text-2xl font-bold text-foreground">5 min</p>
              <p className="text-[10px] text-muted-foreground">per scan</p>
            </CardContent>
          </Card>
          <Card className={`border-2 ${phase === "active" ? "border-green-400 bg-green-50" : "border-orange-300 bg-orange-50"}`}>
            <CardContent className="p-3 text-center">
              <p className="text-[10px] text-muted-foreground mb-1">Enhanced frequency</p>
              <p className={`text-2xl font-bold ${phase === "active" ? "text-green-700" : "text-orange-700"}`}>30 sec</p>
              <p className="text-[10px] text-muted-foreground">per scan</p>
            </CardContent>
          </Card>
        </div>

        {/* What changes */}
        <Card className="border-border">
          <CardContent className="p-3 space-y-2">
            <p className="text-xs font-semibold text-foreground">What this does</p>
            {[
              { icon: Activity, text: "Scans group messages every 30 seconds instead of 5 minutes" },
              { icon: AlertTriangle, text: "Lowers detection threshold — flags single-word risk terms" },
              { icon: Clock, text: "Automatically reverts to normal after 2 hours of no new signals" },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-start gap-2">
                <Icon className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground">{text}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Progress / state */}
        {phase === "confirm" && (
          <Button
            className="h-12 w-full gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold"
            onClick={() => setPhase("applying")}
          >
            <Eye className="h-5 w-5" />
            Activate Enhanced Monitoring
          </Button>
        )}

        {phase === "applying" && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4 space-y-2">
              <p className="text-xs font-semibold text-orange-800">Updating scan frequency…</p>
              <Progress value={progress} className="h-2" />
              <p className="text-[10px] text-orange-600">{progress < 100 ? "Applying settings to monitoring service" : "Done"}</p>
            </CardContent>
          </Card>
        )}

        {phase === "active" && (
          <Card className="border-green-300 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500">
                  <Check className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-green-800">Enhanced monitoring active</p>
                  <p className="text-[10px] text-green-600">Scanning every 30 seconds</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                <p className="text-[10px] text-green-700">Next scan in 30 seconds • Auto-reverts in 2 hours</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

const DEFAULT_EMERGENCY_MSG =
  "⚠️ COMMUNITY ALERT — RT 05/08 Citeureup\n\nMultiple residents have reported rising water levels and flooding signs in the area.\n\nPlease stay alert, move valuables to higher ground, and reply with your status:\nSAFE · EVACUATING · HELP\n\n— Asep (RT Leader)"

type EmergencyPhase = "compose" | "dispatching" | "complete"

const CHANNELS = [
  { key: "whatsapp", label: "WhatsApp", icon: MessageSquare, color: "text-green-600", count: 117 },
  { key: "sms", label: "SMS", icon: Smartphone, color: "text-blue-600", count: 24 },
  { key: "loudspeaker", label: "Mosque loudspeaker", icon: Megaphone, color: "text-purple-600", count: 1 },
  { key: "door", label: "Door-to-door (assigned)", icon: DoorOpen, color: "text-orange-600", count: 14 },
] as const

function EmergencyChannel({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<EmergencyPhase>("compose")
  const [message, setMessage] = useState(DEFAULT_EMERGENCY_MSG)
  const [progress, setProgress] = useState<Record<string, number>>({ whatsapp: 0, sms: 0, loudspeaker: 0, door: 0 })

  useEffect(() => {
    if (phase !== "dispatching") return
    const timers = CHANNELS.map((ch) => {
      const total = ch.count
      const tick = ch.key === "loudspeaker" || ch.key === "door" ? 600 : 120
      const step = ch.key === "loudspeaker" || ch.key === "door" ? total : 2
      return setInterval(() => {
        setProgress((prev) => {
          const next = Math.min((prev[ch.key] ?? 0) + step, total)
          return { ...prev, [ch.key]: next }
        })
      }, tick)
    })
    const done = setTimeout(() => setPhase("complete"), 2800)
    return () => { timers.forEach(clearInterval); clearTimeout(done) }
  }, [phase])

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-border bg-card px-3 py-2.5">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <p className="text-sm font-semibold text-foreground">Emergency Channel</p>
          <p className="text-[10px] text-muted-foreground">Community broadcast — before BPBD alert</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {phase === "compose" && (
          <>
            <Card className="border-red-200 bg-red-50">
              <CardContent className="flex items-center gap-2 p-3">
                <Radio className="h-4 w-4 text-red-600 shrink-0" />
                <p className="text-xs text-red-800">
                  This will broadcast to <span className="font-bold">156 members</span> across 20 households via all available channels — without waiting for an official BPBD alert.
                </p>
              </CardContent>
            </Card>

            <div>
              <p className="mb-1.5 text-xs font-semibold text-foreground">Message</p>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[140px] text-xs leading-relaxed"
              />
            </div>

            {/* Channel summary */}
            <div className="grid grid-cols-2 gap-2">
              {CHANNELS.map((ch) => (
                <div key={ch.key} className="flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-2">
                  <ch.icon className={`h-4 w-4 shrink-0 ${ch.color}`} />
                  <div>
                    <p className="text-[10px] font-medium text-foreground">{ch.label}</p>
                    <p className="text-[10px] text-muted-foreground">{ch.count} recipients</p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              className="h-12 w-full gap-2 bg-red-600 hover:bg-red-700 text-white font-bold"
              onClick={() => setPhase("dispatching")}
            >
              <Radio className="h-5 w-5" />
              Broadcast Emergency Alert
            </Button>
          </>
        )}

        {phase === "dispatching" && (
          <>
            <Card className="border-0 bg-red-600">
              <CardContent className="p-4 flex items-center gap-3">
                <Radio className="h-6 w-6 text-white animate-pulse" />
                <div>
                  <p className="text-sm font-bold text-white">Broadcasting…</p>
                  <p className="text-[10px] text-white/80">Sending across all channels</p>
                </div>
              </CardContent>
            </Card>
            <div className="space-y-2">
              {CHANNELS.map((ch) => (
                <Card key={ch.key} className="border-border">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <ch.icon className={`h-4 w-4 ${ch.color}`} />
                        <p className="text-xs font-medium text-foreground">{ch.label}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {progress[ch.key]}/{ch.count}
                      </span>
                    </div>
                    <Progress value={(progress[ch.key] / ch.count) * 100} className="h-1.5" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {phase === "complete" && (
          <>
            <Card className="border-0 bg-green-600">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                  <Check className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Alert Broadcast Complete</p>
                  <p className="text-[10px] text-white/80">156 members across 20 households notified</p>
                </div>
              </CardContent>
            </Card>
            <div className="space-y-2">
              {CHANNELS.map((ch) => (
                <Card key={ch.key} className="border-green-200 bg-green-50">
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ch.icon className={`h-4 w-4 ${ch.color}`} />
                      <p className="text-xs font-medium text-foreground">{ch.label}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-green-600" />
                      <span className="text-xs font-semibold text-green-700">{ch.count} sent</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export function AlertsView({ language = "en" }: { language?: Locale }) {
  const [view, setView] = useState<View>("alert")
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null)
  const triggeringMessages = getTriggeringMessages(language)
  const detectedKeywords = getDetectedKeywords(language)

  if (view === "chat" && selectedResident) {
    return <EmptyChat resident={selectedResident} onBack={() => setView("picker")} language={language} />
  }
  if (view === "picker") {
    return (
      <ResidentPicker
        onBack={() => setView("alert")}
        onSelect={(r) => { setSelectedResident(r); setView("chat") }}
        language={language}
      />
    )
  }
  if (view === "monitoring") {
    return <EnhancedMonitoring onBack={() => setView("alert")} />
  }
  if (view === "emergency") {
    return <EmergencyChannel onBack={() => setView("alert")} />
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
                  <p className="text-base font-bold text-white">{t(language, "communityRiskAlert")}</p>
                  <Badge className="bg-white/20 text-white text-[10px] font-bold">{t(language, "highPriority")}</Badge>
                </div>
                <p className="mt-0.5 text-xs text-white/80">
                  {language === "id"
                    ? `4 warga melaporkan kondisi terkait banjir dalam 17 menit terakhir`
                    : language === "su"
                    ? `4 warga ngalaporkeun kaayaan patali banjir dina 17 menit panungtungan`
                    : `4 residents reported flood-related conditions in the last 17 minutes`}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-white/15 px-3 py-2">
              <TrendingUp className="h-4 w-4 text-white" />
              <p className="text-xs text-white">
                {t(language, "priorityAutomaticallyEscalated")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Meta info row */}
        <div className="grid grid-cols-3 gap-2">
          <Card className="border-border">
            <CardContent className="p-2.5 text-center">
              <p className="text-lg font-bold text-orange-600">4</p>
              <p className="text-[10px] text-muted-foreground">{t(language, "messagesFlagged")}</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-2.5 text-center">
              <p className="text-lg font-bold text-orange-600">17m</p>
              <p className="text-[10px] text-muted-foreground">{t(language, "timeWindow")}</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-2.5 text-center">
              <p className="text-lg font-bold text-orange-600">8</p>
              <p className="text-[10px] text-muted-foreground">{t(language, "keywordsHit")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Detected keywords */}
        <Card className="border-border">
          <CardContent className="p-3">
            <p className="mb-2 text-xs font-semibold text-foreground">{t(language, "floodKeywordsDetected")}</p>
            <div className="flex flex-wrap gap-1.5">
              {detectedKeywords.map((kw) => (
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
          <p className="mb-2 text-xs font-semibold text-foreground">{t(language, "triggeringMessages")}</p>
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
            <Button className="h-11 w-full justify-between bg-primary hover:bg-primary/90" size="sm" onClick={() => setView("picker")}>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4" />
                <div className="text-left">
                  <p className="text-xs font-semibold">Contact Residents Directly</p>
                  <p className="text-[10px] text-primary-foreground/70">Call or message affected members</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Button variant="outline" className="h-11 w-full justify-between border-orange-300 hover:bg-orange-50" size="sm" onClick={() => setView("monitoring")}>
              <div className="flex items-center gap-2.5">
                <Eye className="h-4 w-4 text-orange-600" />
                <div className="text-left">
                  <p className="text-xs font-semibold text-foreground">Initiate Enhanced Monitoring</p>
                  <p className="text-[10px] text-muted-foreground">Increase scan frequency for this group</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Button>

            <Button variant="outline" className="h-11 w-full justify-between border-red-300 hover:bg-red-50" size="sm" onClick={() => setView("emergency")}>
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
