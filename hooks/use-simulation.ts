"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  type Household,
  type HouseholdStatus,
  mockHouseholds,
} from "@/lib/mock-data"

interface UseSimulationOptions {
  /** Milliseconds between simulated response ticks */
  tickMs?: number
  /** Probability per tick that a no-response household responds */
  responseProbability?: number
  /** Milliseconds after start to flag remaining no-response households */
  nonResponsiveTimeoutMs?: number
}

interface SimulationState {
  households: Household[]
  isRunning: boolean
  hasStarted: boolean
  timedOut: boolean
  elapsedMs: number
}

const RESPONSE_WEIGHTS: { status: HouseholdStatus; weight: number }[] = [
  { status: "safe", weight: 0.7 },
  { status: "evacuating", weight: 0.2 },
  { status: "needs_help", weight: 0.1 },
]

function weightedStatus(): HouseholdStatus {
  const r = Math.random()
  let acc = 0
  for (const { status, weight } of RESPONSE_WEIGHTS) {
    acc += weight
    if (r < acc) return status
  }
  return "safe"
}

export function useSimulation(options: UseSimulationOptions = {}) {
  const {
    tickMs = 1500,
    responseProbability = 0.25,
    nonResponsiveTimeoutMs = 60_000,
  } = options

  const [state, setState] = useState<SimulationState>({
    households: mockHouseholds.map((h) => ({ ...h })),
    isRunning: false,
    hasStarted: false,
    timedOut: false,
    elapsedMs: 0,
  })

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number | null>(null)

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setState((s) => ({ ...s, isRunning: false }))
  }, [])

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    startTimeRef.current = null
    setState({
      households: mockHouseholds.map((h) => ({ ...h })),
      isRunning: false,
      hasStarted: false,
      timedOut: false,
      elapsedMs: 0,
    })
  }, [])

  const start = useCallback(() => {
    if (intervalRef.current) return
    startTimeRef.current = Date.now()
    setState((s) => ({ ...s, isRunning: true, hasStarted: true }))

    intervalRef.current = setInterval(() => {
      setState((prev) => {
        const elapsed = startTimeRef.current ? Date.now() - startTimeRef.current : 0
        const timedOut = elapsed >= nonResponsiveTimeoutMs

        const nextHouseholds = prev.households.map((h) => {
          if (h.status !== "no_response") return h
          if (Math.random() < responseProbability) {
            return {
              ...h,
              status: weightedStatus(),
              lastResponseTime: new Date().toISOString(),
            }
          }
          return h
        })

        return {
          ...prev,
          households: nextHouseholds,
          elapsedMs: elapsed,
          timedOut,
        }
      })
    }, tickMs)
  }, [tickMs, responseProbability, nonResponsiveTimeoutMs])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return {
    households: state.households,
    isRunning: state.isRunning,
    hasStarted: state.hasStarted,
    timedOut: state.timedOut,
    elapsedMs: state.elapsedMs,
    start,
    stop,
    reset,
  }
}
