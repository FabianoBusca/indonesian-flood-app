import type { Household, VulnerabilityFlag } from "./mock-data"

export interface RouteStop {
  household: Household
  order: number
  priorityScore: number
  walkingMinutesFromPrevious: number
}

const VULNERABILITY_WEIGHTS: Record<VulnerabilityFlag, number> = {
  disabled: 4,
  infant: 3,
  pregnant: 3,
  elderly: 2,
}

function priorityScore(h: Household): number {
  let score = 0
  for (const v of h.vulnerabilities) score += VULNERABILITY_WEIGHTS[v]
  score += Math.min(h.memberCount, 6) * 0.25
  return score
}

// Parse a rough "coordinate" out of an address so we can do nearest-neighbor.
// Not real geolocation — just a deterministic projection so the route feels stable.
function pseudoCoords(address: string): [number, number] {
  let x = 0
  let y = 0
  for (let i = 0; i < address.length; i++) {
    const c = address.charCodeAt(i)
    if (i % 2 === 0) x += c
    else y += c
  }
  return [x % 100, y % 100]
}

function distance(a: Household, b: Household): number {
  const [ax, ay] = pseudoCoords(a.address)
  const [bx, by] = pseudoCoords(b.address)
  return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2)
}

/**
 * Build a door-to-door route over the given households.
 * Greedy nearest-neighbor, but weighted by vulnerability priority so
 * higher-priority households get visited earlier even if slightly farther.
 */
export function planRoute(households: Household[]): RouteStop[] {
  if (households.length === 0) return []

  const remaining = [...households]
  // Start from the highest-priority household.
  remaining.sort((a, b) => priorityScore(b) - priorityScore(a))

  const route: RouteStop[] = []
  let current = remaining.shift()!
  route.push({
    household: current,
    order: 1,
    priorityScore: priorityScore(current),
    walkingMinutesFromPrevious: 0,
  })

  while (remaining.length > 0) {
    let bestIdx = 0
    let bestCost = Infinity
    for (let i = 0; i < remaining.length; i++) {
      const candidate = remaining[i]
      const d = distance(current, candidate)
      const p = priorityScore(candidate)
      // Lower cost = better. Heavier priority reduces effective distance.
      const cost = d - p * 5
      if (cost < bestCost) {
        bestCost = cost
        bestIdx = i
      }
    }
    const next = remaining.splice(bestIdx, 1)[0]
    const walk = Math.max(1, Math.round(distance(current, next) / 12))
    route.push({
      household: next,
      order: route.length + 1,
      priorityScore: priorityScore(next),
      walkingMinutesFromPrevious: walk,
    })
    current = next
  }

  return route
}
