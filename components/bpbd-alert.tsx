"use client"

import { AlertTriangle, MapPin, Droplets, Users, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { BPBDAlert, Household } from "@/lib/mock-data"

interface BPBDAlertBannerProps {
  alert: BPBDAlert
  households: Household[]
  onReview: () => void
  onDismiss?: () => void
}

const SEVERITY_STYLES: Record<BPBDAlert["severity"], { bg: string; label: string }> = {
  AMAN: { bg: "bg-green-600", label: "AMAN — Safe" },
  WASPADA: { bg: "bg-yellow-500", label: "WASPADA — Watch" },
  SIAGA: { bg: "bg-orange-500", label: "SIAGA — Warning" },
  BAHAYA: { bg: "bg-red-600", label: "BAHAYA — Danger" },
}

export function BPBDAlertBanner({ alert, households, onReview, onDismiss }: BPBDAlertBannerProps) {
  const style = SEVERITY_STYLES[alert.severity]
  const affected = households.length

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-sm">
      <div className={`flex items-center justify-between px-4 py-2 ${style.bg}`}>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-white" />
          <span className="text-sm font-bold text-white">Incoming BPBD Alert</span>
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-white hover:bg-white/20"
            onClick={onDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        <Card className={`border-0 ${style.bg}`}>
          <CardContent className="p-4 text-white">
            <Badge className="border-0 bg-white/20 text-[10px] font-bold text-white">
              {style.label}
            </Badge>
            <h2 className="mt-2 text-lg font-bold leading-tight">{alert.title}</h2>
            <p className="mt-1 text-xs text-white/90">{alert.description}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-2">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-1.5">
                <Droplets className="h-4 w-4 text-primary" />
                <span className="text-[10px] text-muted-foreground">Predicted Level</span>
              </div>
              <p className="mt-1 text-lg font-bold">{alert.predictedFloodLevel}m</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-[10px] text-muted-foreground">Affected Households</span>
              </div>
              <p className="mt-1 text-lg font-bold">{affected}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="space-y-3 p-3">
            <div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold">Affected Area</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{alert.affectedArea}</p>
            </div>

            <div>
              <p className="text-xs font-semibold">Evacuation Recommendation</p>
              <p className="mt-1 text-xs text-muted-foreground">{alert.evacuationRecommendation}</p>
            </div>

            <div>
              <p className="text-xs font-semibold">Shelter Locations</p>
              <ul className="mt-1 space-y-1">
                {alert.shelterLocations.map((s) => (
                  <li key={s} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="border-t border-border bg-card p-3">
        <Button
          className="h-12 w-full gap-2 bg-orange-500 text-base font-bold text-white shadow-lg hover:bg-orange-600"
          onClick={onReview}
        >
          Review & Broadcast
        </Button>
      </div>
    </div>
  )
}
