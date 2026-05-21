"use client"

import { useEffect, useState } from "react"
import {
  AlertTriangle,
  ClipboardList,
  Database,
  ImageOff,
  Home,
  Megaphone,
  MessageSquare,
  ChevronRight,
  ShieldAlert,
  WifiOff,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { t, type Locale } from "@/lib/i18n"

type HouseholdStatus = "Pending" | "Visited - safe" | "Visited - needs help" | "No response"
type SyncState = "limited" | "syncing" | "synced"
type DetailPanel = "cache" | "fallback" | "alert" | `household-${number}` | null

const statusLabelKey: Record<HouseholdStatus, string> = {
  Pending: "pending",
  "Visited - safe": "safeStatus",
  "Visited - needs help": "needsHelpStatus",
  "No response": "noResponseStatus",
}

function getPriorityLabel(language: Locale, priority: string) {
  if (language === "id") return priority === "Critical" ? "KRITIS" : "TINGGI"
  if (language === "su") return priority === "Critical" ? "KRITIS" : "LUHUR"
  return priority
}

function getPriorityHouseholds(language: Locale) {
  if (language === "id") {
    return [
      { id: 1, name: "Ibu Siti", location: "Blok A, sisi sungai", vulnerability: "Lansia, tinggal sendiri", alert: "Air terpantau di depan pintu", channel: "SMS terkirim, WhatsApp gagal", priority: "KRITIS" },
      { id: 2, name: "Pak Hendra", location: "Gang Mawar", vulnerability: "Anak dengan asma", alert: "Belum ada balasan setelah peringatan", channel: "Pengumuman masjid terdengar di dekat sini", priority: "TINGGI" },
      { id: 3, name: "Dewi Marlina", location: "Dekat Masjid Al-Hidayah", vulnerability: "Dua anak kecil", alert: "Luapan drainase dilaporkan", channel: "SMS antre untuk dikirim ulang", priority: "TINGGI" },
    ]
  }

  if (language === "su") {
    return [
      { id: 1, name: "Ibu Siti", location: "Blok A, sisi walungan", vulnerability: "Lansia, hirup sorangan", alert: "Cai kapanggih di hareupeun panto", channel: "SMS dikirim, WhatsApp gagal", priority: "KRITIS" },
      { id: 2, name: "Pak Hendra", location: "Gang Mawar", vulnerability: "Budak jeung asma", alert: "Can aya balesan sanggeus panggeuing", channel: "Pangumuman masjid kadéngé caket dieu", priority: "LUHUR" },
      { id: 3, name: "Dewi Marlina", location: "Deukeut Masjid Al-Hidayah", vulnerability: "Dua budak leutik", alert: "Luapan drainase dilaporkeun", channel: "SMS antre pikeun dikirim deui", priority: "LUHUR" },
    ]
  }

  return [
    { id: 1, name: "Ibu Siti", location: "Block A, river side", vulnerability: "Elderly, lives alone", alert: "Water reported at doorstep", channel: "SMS delivered, WhatsApp failed", priority: "Critical" },
    { id: 2, name: "Pak Hendra", location: "Gang Mawar", vulnerability: "Child with asthma", alert: "No acknowledgment after warning", channel: "Mosque announcement heard nearby", priority: "High" },
    { id: 3, name: "Dewi Marlina", location: "Near Masjid Al-Hidayah", vulnerability: "Two small children", alert: "Drainage overflow reported", channel: "SMS queued for retry", priority: "High" },
  ]
}

export function LimitedConnectivityView({ language = "en" }: { language?: Locale }) {
  const [statuses, setStatuses] = useState<Record<number, HouseholdStatus>>({})
  const [syncState, setSyncState] = useState<SyncState>("limited")
  const [openDetail, setOpenDetail] = useState<DetailPanel>(null)
  const priorityHouseholds = getPriorityHouseholds(language)

  const localUpdateCount = Object.keys(statuses).length
  const unsyncedCount = syncState === "synced" ? 0 : localUpdateCount

  useEffect(() => {
    if (syncState !== "syncing") return

    const timer = window.setTimeout(() => setSyncState("synced"), 1400)
    return () => window.clearTimeout(timer)
  }, [syncState])

  const recordStatus = (id: number, status: HouseholdStatus) => {
    setStatuses((current) => ({ ...current, [id]: status }))
    if (syncState === "synced") {
      setSyncState("limited")
    }
  }

  const toggleDetail = (panel: DetailPanel) => {
    setOpenDetail((current) => (current === panel ? null : panel))
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-background">
      <div className="space-y-3 p-3">
        <Card className="border-0 bg-zinc-900 text-white">
          <CardContent className="space-y-3 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white/15">
                <WifiOff className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold">{t(language, "limitedModeTitle")}</p>
                  <Badge className="bg-amber-400 text-[10px] font-bold text-zinc-950">AUTO</Badge>
                </div>
                <p className="mt-1 text-xs text-white/75">{t(language, "limitedModeBody")}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-md bg-white/10 p-2">
                <p className="text-lg font-bold">141</p>
                <p className="text-[9px] uppercase text-white/60">{t(language, "cachedHomes")}</p>
              </div>
              <div className="rounded-md bg-white/10 p-2">
                <p className="text-lg font-bold">11</p>
                <p className="text-[9px] uppercase text-white/60">{t(language, "vulnerableCount")}</p>
              </div>
              <div className="rounded-md bg-white/10 p-2">
                <p className="text-lg font-bold">{unsyncedCount}</p>
                <p className="text-[9px] uppercase text-white/60">{t(language, "unsynced")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-md border border-amber-200 bg-amber-50 p-2 text-center">
            <p className="text-[10px] font-bold text-amber-900">{language === "id" ? "WhatsApp" : language === "su" ? "WhatsApp" : "WhatsApp"}</p>
            <p className="text-[10px] text-amber-800">{t(language, "delayed")}</p>
          </div>
          <div className="rounded-md border border-green-200 bg-green-50 p-2 text-center">
            <p className="text-[10px] font-bold text-green-900">SMS</p>
            <p className="text-[10px] text-green-800">{t(language, "active")}</p>
          </div>
          <div className="rounded-md border border-green-200 bg-green-50 p-2 text-center">
            <p className="text-[10px] font-bold text-green-900">{language === "id" ? "Pengeras Suara" : language === "su" ? "Pengeras Suara" : "Loudspeaker"}</p>
            <p className="text-[10px] text-green-800">{t(language, "active")}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            className="rounded-md border border-border bg-card p-3 text-left transition-colors hover:border-primary/50"
            onClick={() => toggleDetail("cache")}
          >
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              <p className="text-xs font-semibold">{t(language, "offlineCache")}</p>
              <ChevronRight className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">{t(language, "offlineCacheBody")}</p>
          </button>
          <button
            className="rounded-md border border-border bg-card p-3 text-left transition-colors hover:border-primary/50"
            onClick={() => toggleDetail("fallback")}
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <p className="text-xs font-semibold">{t(language, "fallbackChannels")}</p>
              <ChevronRight className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">{t(language, "fallbackChannelsBody")}</p>
          </button>
        </div>

        {openDetail === "cache" && (
          <div className="rounded-md border border-primary/20 bg-primary/5 p-3">
            <p className="text-xs font-bold text-foreground">{t(language, "cachedOnDevice")}</p>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-md bg-background p-2">
                <p className="text-sm font-bold">141</p>
                <p className="text-[9px] text-muted-foreground">{t(language, "cacheHouseholds")}</p>
              </div>
              <div className="rounded-md bg-background p-2">
                <p className="text-sm font-bold">11</p>
                <p className="text-[9px] text-muted-foreground">{t(language, "vulnerableCount")}</p>
              </div>
              <div className="rounded-md bg-background p-2">
                <p className="text-sm font-bold">3</p>
                <p className="text-[9px] text-muted-foreground">{t(language, "cacheAlerts")}</p>
              </div>
            </div>
          </div>
        )}

        {openDetail === "fallback" && (
          <div className="rounded-md border border-primary/20 bg-primary/5 p-3">
            <p className="text-xs font-bold text-foreground">{t(language, "fallbackQueue")}</p>
            <div className="mt-2 space-y-1 text-[11px] text-muted-foreground">
              <p>{t(language, "fallbackQueueBody1")}</p>
              <p>{t(language, "fallbackQueueBody2")}</p>
              <p>{t(language, "fallbackQueueBody3")}</p>
            </div>
          </div>
        )}

        <div className="rounded-md border border-border bg-muted p-3">
          <div className="flex items-center gap-2">
            <ImageOff className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs font-semibold">{t(language, "lowBandwidthTitle")}</p>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">{t(language, "lowBandwidthBody")}</p>
        </div>

        <button
          className="w-full rounded-md border border-amber-200 bg-amber-50 p-3 text-left transition-colors hover:border-amber-400"
          onClick={() => toggleDetail("alert")}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-700" />
            <p className="text-xs font-bold text-amber-900">{t(language, "recentAlertCached")}</p>
            <ChevronRight className="ml-auto h-3.5 w-3.5 text-amber-800" />
          </div>
          <p className="mt-1 text-[11px] text-amber-800">{t(language, "recentAlertBody")}</p>
        </button>

        {openDetail === "alert" && (
          <div className="rounded-md border border-amber-200 bg-white p-3">
            <p className="text-xs font-bold text-foreground">{t(language, "alertOfflineTitle")}</p>
            <div className="mt-2 space-y-1 text-[11px] text-muted-foreground">
              <p>{t(language, "alertOfflineBody1")}</p>
              <p>{t(language, "alertOfflineBody2")}</p>
              <p>{t(language, "alertOfflineBody3")}</p>
            </div>
          </div>
        )}

        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-primary" />
              <p className="text-sm font-bold">{t(language, "offlinePriorityVisits")}</p>
            </div>
            <Badge variant="outline" className="text-[10px]">{priorityHouseholds.length} {t(language, "stopsSuffix")}</Badge>
          </div>

          {priorityHouseholds.map((household) => {
            const status = statuses[household.id] ?? "Pending"

            return (
              <div key={household.id} className="rounded-md border border-border bg-card p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-primary" />
                      <p className="text-sm font-semibold">{household.name}</p>
                    </div>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{household.location}</p>
                  </div>
                      <Badge className={household.priority === "Critical" || household.priority === "KRITIS" ? "bg-red-600 text-white" : "bg-orange-500 text-white"}>
                        {getPriorityLabel(language, household.priority)}
                  </Badge>
                </div>

                <div className="mt-2 space-y-1 text-[11px]">
                  <p className="flex gap-1.5 text-foreground">
                    <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-600" />
                    {household.vulnerability}
                  </p>
                  <p className="text-muted-foreground">{household.alert}</p>
                  <p className="flex gap-1.5 text-muted-foreground">
                    <Megaphone className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {household.channel}
                  </p>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        status === "Visited - safe"
                          ? "bg-green-600 text-white"
                          : status === "Visited - needs help"
                          ? "bg-red-600 text-white"
                          : status === "No response"
                          ? "bg-gray-500 text-white"
                          : "bg-muted text-foreground"
                      }
                    >
                        {t(language, statusLabelKey[status])}
                    </Badge>
                    <div className="text-[10px] text-muted-foreground">{status === "No response" ? 0 : 1}/1</div>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                      <Button size="sm" variant="outline" className="h-auto whitespace-normal py-1 text-[10px] leading-tight" onClick={() => recordStatus(household.id, "Visited - safe")}>{t(language, "safe")}</Button>
                      <Button size="sm" variant="outline" className="h-auto whitespace-normal py-1 text-[10px] leading-tight" onClick={() => recordStatus(household.id, "Visited - needs help")}>{t(language, "needsHelp")}</Button>
                      <Button size="sm" variant="outline" className="h-auto whitespace-normal py-1 text-[10px] leading-tight" onClick={() => recordStatus(household.id, "No response")}>{t(language, "noResponse")}</Button>
                  </div>
                </div>
              </div>
            )
          })}
        </section>
      </div>
    </div>
  )
}
