# PR Description

## What

Implements **Scenario 1 — RT Leader Coordinates Flood Response** end-to-end as a prototype, using mock data only (no backend).

### Data layer (`lib/mock-data.ts`)
- Expanded to 35-household roster for Citeureup Village RT 05 (~141 total members, 14 with vulnerability flags) to represent realistic population density.
- Implemented the four planned helpers: `getChannelLabel`, `isVulnerable`, `getStatusCounts`, `getNonResponsive`, plus an extra `getChannelBreakdown` consumed by the broadcast dialog.

### Household dashboard (`components/household-list.tsx`)
- Scrollable list with per-row channel icons, vulnerability badges, and color-coded status chips.
- Filters by **status** and **vulnerability**, plus an optional "non-responsive first" sort.
- Home dashboard counts are now derived from `getStatusCounts()` instead of hardcoded numbers.

### Alert + broadcast flow (`components/bpbd-alert.tsx`, `components/broadcast-dialog.tsx`)
- Full-screen BPBD alert overlay showing severity, predicted level, affected count, area, recommendation, and shelters.
- Broadcast dialog with an editable pre-filled message, per-channel summary, total recipient count, and a single send button.
- Dispatch animation runs per-channel progress bars (WhatsApp/SMS count up, mosque + door-to-door confirm as a single request), then transitions to response tracking.

### Real-time response tracking (`hooks/use-simulation.ts`, `components/response-tracker.tsx`)
- `useSimulation` hook ticks every 1.5s; each no-response household has a 22% chance per tick to respond with a weighted status (70% SAFE / 20% EVACUATING / 10% NEEDS HELP).
- Live progress bar + status counts on the home screen replace the static stats once a broadcast has been sent.
- After a 60s timeout, a red warning surfaces non-responsive households with shortcuts into the household list and route planner.

### Door-to-door routing (`lib/routing.ts`, `components/route-planner.tsx`)
- Priority-weighted nearest-neighbor route: vulnerability flags add weight (disabled 4, infant/pregnant 3, elderly 2), starting stop is the highest-priority household, and each next pick uses `distance − priority×5` so vulnerable families are visited earlier.
- Mock walking time estimates between stops (no real geolocation — addresses are projected to pseudo-coordinates).
- Per-stop **Visited / Evacuated / Needs more help** controls with a live "X/Y completed" counter.

## Why

The plan called for demonstrating the user flow Asep Santoso (RT leader) goes through during a flood event — receiving a BPBD alert, broadcasting evacuation instructions across multiple channels, tracking who responds, and dispatching in-person checks for those who don't. The implementation focuses on making that flow **clickable and visually believable** rather than building any real infrastructure.

Key design decisions:
- **Mock data, not a backend.** This is a prototype to validate UX with stakeholders before committing to real BPBD integration / SMS gateway / WhatsApp Business API.
- **Multiple comms channels surfaced as first-class.** Not every household has WhatsApp — the dashboard and route planner make the channel mix and "door-to-door fallback" visible, which is the core insight the scenario is meant to communicate.
- **Vulnerability flags as priority signal.** They drive the route ordering and the "non-responsive" sort, mirroring how RT leaders prioritize in practice.
- **60s timeout in prototype** (would be much longer in production) so the non-response handling can be demoed in one sitting.

## How to test

Run the dev server:

```bash
pnpm dev
```

Open the app and walk through the scenario:

1. **Receive the alert** — On home, tap **Alert Details** (or **Broadcast Warning**). A full-screen orange `SIAGA` banner shows severity, predicted level (2.3m), affected count (35), area, recommendation, and 3 shelter locations.
2. **Review & edit** — Tap **Review & Broadcast**. A dialog opens with a pre-filled message, channel breakdown (WA / SMS / Mosque / Door), and total recipient count. Edit the message to confirm it's editable.
3. **Send** — Tap **Send Emergency Broadcast**. Watch per-channel progress bars run, then **Broadcast Complete** with a **View Response Tracking** button.
4. **Live tracking** — Home now shows a **Response Progress** card with a climbing progress bar and live SAFE / EVACUATING / NEEDS HELP / NO RESPONSE counts (updates every ~1.5s).
5. **Non-response timeout** — Wait ~60s. A red warning card appears: *"X households have not responded"* with **View list** and **Plan route** shortcuts.
6. **Household list** — Tap **View list** (or the Households quick-action). Check that:
   - 35 households render with channel icons + status chips.
   - 14 households show the orange **VULNERABLE** badge.
   - Non-responders are pinned to the top with a red highlight.
   - Filtering by status and by vulnerability narrows the list correctly.
7. **Door-to-door route** — Tap **Plan route**. Confirm:
   - First stops carry the orange **PRIORITY** badge (vulnerable families visited first).
   - Walking-time estimates appear between stops.
   - Tapping **Visited / Evac. / Help** on a stop updates the numbered circle and status badge, and increments the completed counter.
8. **Re-run** — Tap **Broadcast Again** on home to re-open the dialog and replay the flow.

### Sanity checks

| Check | How |
|---|---|
| Typechecks clean | `npx tsc --noEmit` |
| Household count | List header reads "Households (35)" |
| Channel mix | Broadcast dialog summary shows roughly 12 WA / 16 SMS / 3 Mosque / 3 Door |
| Vulnerable-first ordering | First entries in Route Planner all show **PRIORITY** |

## Files

| Action | File |
|---|---|
| Modified | `lib/mock-data.ts` |
| Created | `lib/routing.ts` |
| Created | `hooks/use-simulation.ts` |
| Created | `components/household-list.tsx` |
| Created | `components/bpbd-alert.tsx` |
| Created | `components/broadcast-dialog.tsx` |
| Created | `components/response-tracker.tsx` |
| Created | `components/route-planner.tsx` |
| Modified | `components/flood-app.tsx` |
