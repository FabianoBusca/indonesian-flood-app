"use client"

import { AlertTriangle, Users, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  type Household,
  getStatusCounts,
  getNonResponsive,
} from "@/lib/mock-data"

interface ResponseTrackerProps {
  households: Household[]
  timedOut: boolean
  elapsedMs: number
  onViewHouseholds?: () => void
  onPlanRoute?: () => void
}

export function ResponseTracker({
  households,
  timedOut,
  elapsedMs,
  onViewHouseholds,
  onPlanRoute,
}: ResponseTrackerProps) {
  const counts = getStatusCounts(households)
  const total = households.length
  const responded = total - counts.no_response
  const pct = total === 0 ? 0 : (responded / total) * 100
  const nonResponsive = getNonResponsive(households)

  return (
    <div className="space-y-3">
      <Card className="border-border">
        <CardContent className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold">Response Progress</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {responded}/{total} responded
            </span>
          </div>
          <Progress value={pct} className="h-2" />
          <p className="mt-1 text-[10px] text-muted-foreground">
            Elapsed: {Math.floor(elapsedMs / 1000)}s
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-lg bg-green-50 p-2 text-center">
          <p className="text-lg font-bold text-green-700">{counts.safe}</p>
          <p className="text-[10px] font-medium text-green-600">SAFE</p>
        </div>
        <div className="rounded-lg bg-yellow-50 p-2 text-center">
          <p className="text-lg font-bold text-yellow-700">{counts.evacuating}</p>
          <p className="text-[10px] font-medium text-yellow-600">EVACUATING</p>
        </div>
        <div className="rounded-lg bg-red-50 p-2 text-center">
          <p className="text-lg font-bold text-red-700">{counts.needs_help}</p>
          <p className="text-[10px] font-medium text-red-600">NEEDS HELP</p>
        </div>
        <div className="rounded-lg bg-gray-100 p-2 text-center">
          <p className="text-lg font-bold text-gray-700">{counts.no_response}</p>
          <p className="text-[10px] font-medium text-gray-600">NO RESPONSE</p>
        </div>
      </div>

      {timedOut && nonResponsive.length > 0 && (
        <Card className="border-red-300 bg-red-50">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <div className="flex-1">
                <p className="text-sm font-bold text-red-700">
                  {nonResponsive.length} households have not responded
                </p>
                <p className="mt-0.5 text-xs text-red-600">
                  Vulnerable families are prioritized for door-to-door check.
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs"
                onClick={onViewHouseholds}
              >
                View list
                <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
              <Button
                size="sm"
                className="h-8 bg-red-600 text-xs text-white hover:bg-red-700"
                onClick={onPlanRoute}
              >
                Plan route
                <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
