"use client"

import { useMemo, useState } from "react"
import {
  ArrowLeft,
  MessageCircle,
  Smartphone,
  Megaphone,
  DoorOpen,
  AlertCircle,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  type CommunicationChannel,
  type Household,
  type HouseholdStatus,
  type VulnerabilityFlag,
  getChannelLabel,
  isVulnerable,
} from "@/lib/mock-data"

interface HouseholdListProps {
  households: Household[]
  onBack?: () => void
  highlightNonResponsive?: boolean
}

const STATUS_STYLES: Record<HouseholdStatus, { label: string; className: string }> = {
  safe: { label: "SAFE", className: "bg-green-100 text-green-700 border-green-200" },
  evacuating: { label: "EVACUATING", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  needs_help: { label: "NEEDS HELP", className: "bg-red-100 text-red-700 border-red-200" },
  no_response: { label: "NO RESPONSE", className: "bg-gray-100 text-gray-700 border-gray-200" },
}

const VULN_LABEL: Record<VulnerabilityFlag, string> = {
  elderly: "Elderly",
  disabled: "Disabled",
  infant: "Infant",
  pregnant: "Pregnant",
}

function ChannelIcon({ channel }: { channel: CommunicationChannel }) {
  const common = "h-3.5 w-3.5"
  const title = getChannelLabel(channel)
  switch (channel) {
    case "whatsapp":
      return <MessageCircle className={`${common} text-green-600`} aria-label={title} />
    case "sms":
      return <Smartphone className={`${common} text-blue-600`} aria-label={title} />
    case "mosque_loudspeaker":
      return <Megaphone className={`${common} text-purple-600`} aria-label={title} />
    case "door_to_door":
      return <DoorOpen className={`${common} text-orange-600`} aria-label={title} />
  }
}

export function HouseholdList({
  households,
  onBack,
  highlightNonResponsive = false,
}: HouseholdListProps) {
  const [statusFilter, setStatusFilter] = useState<HouseholdStatus | "all">("all")
  const [vulnFilter, setVulnFilter] = useState<"all" | "vulnerable">("all")

  const filtered = useMemo(() => {
    let list = households
    if (statusFilter !== "all") list = list.filter((h) => h.status === statusFilter)
    if (vulnFilter === "vulnerable") list = list.filter(isVulnerable)
    if (highlightNonResponsive) {
      list = [...list].sort((a, b) => {
        const aNR = a.status === "no_response" ? 1 : 0
        const bNR = b.status === "no_response" ? 1 : 0
        if (aNR !== bNR) return bNR - aNR
        const aV = isVulnerable(a) ? 1 : 0
        const bV = isVulnerable(b) ? 1 : 0
        return bV - aV
      })
    }
    return list
  }, [households, statusFilter, vulnFilter, highlightNonResponsive])

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border bg-card px-3 py-2">
        {onBack && (
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Households ({households.length})</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 border-b border-border bg-card/50 p-2">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as HouseholdStatus | "all")}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="safe">Safe</SelectItem>
            <SelectItem value="evacuating">Evacuating</SelectItem>
            <SelectItem value="needs_help">Needs Help</SelectItem>
            <SelectItem value="no_response">No Response</SelectItem>
          </SelectContent>
        </Select>
        <Select value={vulnFilter} onValueChange={(v) => setVulnFilter(v as "all" | "vulnerable")}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Vulnerability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All households</SelectItem>
            <SelectItem value="vulnerable">Vulnerable only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-2">
        {filtered.length === 0 && (
          <p className="py-8 text-center text-xs text-muted-foreground">
            No households match the current filters.
          </p>
        )}
        {filtered.map((h) => {
          const vuln = isVulnerable(h)
          const statusStyle = STATUS_STYLES[h.status]
          const isNR = h.status === "no_response"
          return (
            <Card
              key={h.id}
              className={`border ${
                highlightNonResponsive && isNR
                  ? "border-red-300 bg-red-50/30"
                  : vuln
                  ? "border-orange-200"
                  : "border-border"
              }`}
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {h.headOfFamily}
                      </p>
                      {vuln && (
                        <Badge className="border border-orange-300 bg-orange-100 text-[9px] font-semibold text-orange-700">
                          <AlertCircle className="mr-0.5 h-2.5 w-2.5" />
                          VULNERABLE
                        </Badge>
                      )}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{h.address}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {h.memberCount} {h.memberCount === 1 ? "member" : "members"}
                      {h.phone && ` • ${h.phone}`}
                    </p>
                  </div>
                  <Badge className={`shrink-0 border text-[9px] font-semibold ${statusStyle.className}`}>
                    {statusStyle.label}
                  </Badge>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {h.channels.map((c) => (
                      <div
                        key={c}
                        className="flex items-center justify-center rounded-full bg-muted p-1"
                        title={getChannelLabel(c)}
                      >
                        <ChannelIcon channel={c} />
                      </div>
                    ))}
                  </div>
                  {vuln && (
                    <div className="flex flex-wrap items-center gap-1">
                      {h.vulnerabilities.map((v) => (
                        <span
                          key={v}
                          className="rounded-full bg-orange-50 px-1.5 py-0.5 text-[9px] font-medium text-orange-700"
                        >
                          {VULN_LABEL[v]}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
