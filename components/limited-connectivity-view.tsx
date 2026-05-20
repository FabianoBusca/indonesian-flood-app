"use client"

import { useEffect, useState } from "react"
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Database,
  ImageOff,
  Home,
  Megaphone,
  MessageSquare,
  RotateCw,
  ShieldAlert,
  WifiOff,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type HouseholdStatus = "Pending" | "Visited - safe" | "Visited - needs help" | "No response"
type SyncState = "limited" | "syncing" | "synced"

const priorityHouseholds = [
  {
    id: 1,
    name: "Ibu Siti",
    location: "Block A, river side",
    vulnerability: "Elderly, lives alone",
    alert: "Water reported at doorstep",
    channel: "SMS delivered, WhatsApp failed",
    priority: "Critical",
  },
  {
    id: 2,
    name: "Pak Hendra",
    location: "Gang Mawar",
    vulnerability: "Child with asthma",
    alert: "No acknowledgment after warning",
    channel: "Mosque announcement heard nearby",
    priority: "High",
  },
  {
    id: 3,
    name: "Dewi Marlina",
    location: "Near Masjid Al-Hidayah",
    vulnerability: "Two small children",
    alert: "Drainage overflow reported",
    channel: "SMS queued for retry",
    priority: "High",
  },
]

export function LimitedConnectivityView() {
  const [statuses, setStatuses] = useState<Record<number, HouseholdStatus>>({})
  const [syncState, setSyncState] = useState<SyncState>("limited")

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
                  <p className="text-sm font-bold">Limited-connectivity emergency mode</p>
                  <Badge className="bg-amber-400 text-[10px] font-bold text-zinc-950">AUTO</Badge>
                </div>
                <p className="mt-1 text-xs text-white/75">
                  Heavy storm detected. RakyatBanjir keeps only cached records, alerts, SMS fallback, and visit logging.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-md bg-white/10 p-2">
                <p className="text-lg font-bold">156</p>
                <p className="text-[9px] uppercase text-white/60">Cached homes</p>
              </div>
              <div className="rounded-md bg-white/10 p-2">
                <p className="text-lg font-bold">12</p>
                <p className="text-[9px] uppercase text-white/60">Vulnerable</p>
              </div>
              <div className="rounded-md bg-white/10 p-2">
                <p className="text-lg font-bold">{unsyncedCount}</p>
                <p className="text-[9px] uppercase text-white/60">Unsynced</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-md border border-amber-200 bg-amber-50 p-2 text-center">
            <p className="text-[10px] font-bold text-amber-900">WhatsApp</p>
            <p className="text-[10px] text-amber-800">Delayed</p>
          </div>
          <div className="rounded-md border border-green-200 bg-green-50 p-2 text-center">
            <p className="text-[10px] font-bold text-green-900">SMS</p>
            <p className="text-[10px] text-green-800">Active</p>
          </div>
          <div className="rounded-md border border-green-200 bg-green-50 p-2 text-center">
            <p className="text-[10px] font-bold text-green-900">Loudspeaker</p>
            <p className="text-[10px] text-green-800">Active</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md border border-border bg-card p-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              <p className="text-xs font-semibold">Offline cache</p>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">Households, vulnerability profiles, and latest BPBD alerts available on device.</p>
          </div>
          <div className="rounded-md border border-border bg-card p-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <p className="text-xs font-semibold">Fallback channels</p>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">SMS continues for many homes; mosque loudspeaker remains independent.</p>
          </div>
        </div>

        <div className="rounded-md border border-border bg-muted p-3">
          <div className="flex items-center gap-2">
            <ImageOff className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs font-semibold">Low-bandwidth interface</p>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Live maps, photos, and decorative visuals are paused so essential emergency records load faster.
          </p>
        </div>

        <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-700" />
            <p className="text-xs font-bold text-amber-900">Recent alert cached at 15:42</p>
          </div>
          <p className="mt-1 text-[11px] text-amber-800">
            Water level rising near Block A and Gang Mawar. Failed acknowledgments are converted into a local priority visit list.
          </p>
        </div>

        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-primary" />
              <p className="text-sm font-bold">Offline priority visits</p>
            </div>
            <Badge variant="outline" className="text-[10px]">{priorityHouseholds.length} stops</Badge>
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
                  <Badge className={household.priority === "Critical" ? "bg-red-600 text-white" : "bg-orange-500 text-white"}>
                    {household.priority}
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

                <div className="mt-3 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={status === "Visited - safe" ? "default" : "outline"}
                    className="h-8 flex-1 text-[11px]"
                    onClick={() => recordStatus(household.id, "Visited - safe")}
                  >
                    Safe
                  </Button>
                  <Button
                    size="sm"
                    variant={status === "Visited - needs help" ? "destructive" : "outline"}
                    className="h-8 flex-1 text-[11px]"
                    onClick={() => recordStatus(household.id, "Visited - needs help")}
                  >
                    Needs help
                  </Button>
                  <Button
                    size="sm"
                    variant={status === "No response" ? "secondary" : "outline"}
                    className="h-8 flex-1 text-[11px]"
                    onClick={() => recordStatus(household.id, "No response")}
                  >
                    No response
                  </Button>
                </div>

                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <CheckCircle2 className={`h-3.5 w-3.5 ${status === "Pending" ? "text-muted-foreground" : "text-green-600"}`} />
                  Stored locally: {status}
                </div>
              </div>
            )
          })}
        </section>

        <div className="rounded-md border border-border bg-card p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold">
                {syncState === "synced" ? "Central system updated" : syncState === "syncing" ? "Synchronizing offline updates" : "Offline updates waiting"}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {syncState === "synced"
                  ? "BPBD operators and RT leaders now see the latest door-to-door statuses."
                  : `${localUpdateCount} local record${localUpdateCount === 1 ? "" : "s"} saved on Asep's device.`}
              </p>
            </div>
            <Button
              size="sm"
              className="h-9 shrink-0 gap-1.5 text-[11px]"
              disabled={localUpdateCount === 0 || syncState === "syncing" || syncState === "synced"}
              onClick={() => setSyncState("syncing")}
            >
              <RotateCw className={`h-3.5 w-3.5 ${syncState === "syncing" ? "animate-spin" : ""}`} />
              Sync Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
