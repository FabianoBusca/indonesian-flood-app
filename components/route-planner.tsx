"use client"

import { useMemo, useState } from "react"
import {
  ArrowLeft,
  MapPin,
  Footprints,
  AlertCircle,
  Check,
  HelpCircle,
  Home,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type Household, isVulnerable } from "@/lib/mock-data"
import { planRoute } from "@/lib/routing"
import { t, type Locale } from "@/lib/i18n"

interface RoutePlannerProps {
  households: Household[]
  onBack?: () => void
  language?: Locale
}

type StopStatus = "pending" | "visited" | "evacuated" | "needs_more_help"

const STOP_STATUS_STYLES: Record<StopStatus, { key: string; className: string }> = {
  pending: { key: "pending", className: "bg-gray-100 text-gray-700 border-gray-200" },
  visited: { key: "visited", className: "bg-blue-100 text-blue-700 border-blue-200" },
  evacuated: { key: "evacuated", className: "bg-green-100 text-green-700 border-green-200" },
  needs_more_help: { key: "needsMoreHelp", className: "bg-red-100 text-red-700 border-red-200" },
}

export function RoutePlanner({ households, onBack, language = "en" }: RoutePlannerProps) {
  const route = useMemo(() => planRoute(households), [households])
  const [statuses, setStatuses] = useState<Record<string, StopStatus>>({})

  const totalWalkMinutes = route.reduce((sum, r) => sum + r.walkingMinutesFromPrevious, 0)
  const completed = Object.values(statuses).filter((s) => s !== "pending").length

  const setStop = (id: string, s: StopStatus) =>
    setStatuses((prev) => ({ ...prev, [id]: s }))

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border bg-card px-3 py-2">
        {onBack && (
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div className="flex items-center gap-2">
          <Footprints className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">{t(language, "doorToDoor")}</h2>
        </div>
      </div>

      <Card className="m-2 border-border">
        <CardContent className="grid grid-cols-3 gap-2 p-3 text-center">
          <div>
            <p className="text-lg font-bold text-foreground">{route.length}</p>
            <p className="text-[10px] text-muted-foreground">{t(language, "stops")}</p>
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">~{totalWalkMinutes}m</p>
            <p className="text-[10px] text-muted-foreground">{t(language, "walkTime")}</p>
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">
              {completed}/{route.length}
            </p>
            <p className="text-[10px] text-muted-foreground">{t(language, "completed")}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex-1 space-y-2 overflow-y-auto px-2 pb-2">
        {route.length === 0 && (
          <p className="py-8 text-center text-xs text-muted-foreground">
            {t(language, "noDoorToDoor")}
          </p>
        )}
        {route.map((stop) => {
          const status = statuses[stop.household.id] ?? "pending"
          const style = STOP_STATUS_STYLES[status]
          const vuln = isVulnerable(stop.household)
          return (
            <Card
              key={stop.household.id}
              className={`border ${vuln ? "border-orange-200" : "border-border"}`}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      status === "evacuated"
                        ? "bg-green-600 text-white"
                        : status === "needs_more_help"
                        ? "bg-red-600 text-white"
                        : status === "visited"
                        ? "bg-blue-600 text-white"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {stop.order}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-sm font-semibold">{stop.household.headOfFamily}</p>
                      {vuln && (
                        <Badge className="border border-orange-300 bg-orange-100 text-[9px] font-semibold text-orange-700">
                          <AlertCircle className="mr-0.5 h-2.5 w-2.5" />
                          {t(language, "priority")}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{stop.household.address}</span>
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                      <span>{stop.household.memberCount} {t(language, "members")}</span>
                      {stop.walkingMinutesFromPrevious > 0 && (
                        <span className="flex items-center gap-0.5">
                          <Footprints className="h-3 w-3" />~{stop.walkingMinutesFromPrevious}m
                        </span>
                      )}
                    </div>
                    {vuln && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {stop.household.vulnerabilities.map((v) => (
                          <span
                            key={v}
                            className="rounded-full bg-orange-50 px-1.5 py-0.5 text-[9px] font-medium text-orange-700"
                          >
                                {t(language, v)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <Badge className={`shrink-0 border text-[8px] font-semibold ${style.className}`}>
                    {t(language, style.key)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
