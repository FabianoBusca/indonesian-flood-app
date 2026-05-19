"use client"

import { useEffect, useMemo, useState } from "react"
import { Radio, MessageCircle, Smartphone, Megaphone, DoorOpen, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  type BPBDAlert,
  type CommunicationChannel,
  type Household,
  getChannelBreakdown,
  getChannelLabel,
} from "@/lib/mock-data"

interface BroadcastDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  alert: BPBDAlert
  households: Household[]
  onComplete: () => void
}

const CHANNEL_ICON: Record<CommunicationChannel, typeof MessageCircle> = {
  whatsapp: MessageCircle,
  sms: Smartphone,
  mosque_loudspeaker: Megaphone,
  door_to_door: DoorOpen,
}

const CHANNEL_COLOR: Record<CommunicationChannel, string> = {
  whatsapp: "text-green-600",
  sms: "text-blue-600",
  mosque_loudspeaker: "text-purple-600",
  door_to_door: "text-orange-600",
}

function defaultMessage(alert: BPBDAlert): string {
  return (
    `[${alert.severity}] ${alert.title}\n\n` +
    `${alert.description}\n\n` +
    `Evacuate to nearest shelter:\n` +
    alert.shelterLocations.map((s) => `• ${s}`).join("\n") +
    `\n\nReply with your status: SAFE, EVACUATING, or HELP.`
  )
}

export function BroadcastDialog({
  open,
  onOpenChange,
  alert,
  households,
  onComplete,
}: BroadcastDialogProps) {
  const [message, setMessage] = useState(() => defaultMessage(alert))
  const [phase, setPhase] = useState<"compose" | "dispatching" | "complete">("compose")
  const [progress, setProgress] = useState<Record<CommunicationChannel, number>>({
    whatsapp: 0,
    sms: 0,
    mosque_loudspeaker: 0,
    door_to_door: 0,
  })

  const breakdown = useMemo(() => getChannelBreakdown(households), [households])
  const totalRecipients = households.length

  useEffect(() => {
    if (!open) {
      setPhase("compose")
      setMessage(defaultMessage(alert))
      setProgress({ whatsapp: 0, sms: 0, mosque_loudspeaker: 0, door_to_door: 0 })
    }
  }, [open, alert])

  useEffect(() => {
    if (phase !== "dispatching") return
    const channels: CommunicationChannel[] = [
      "whatsapp",
      "sms",
      "mosque_loudspeaker",
      "door_to_door",
    ]
    const intervals = channels.map((c) => {
      const total = breakdown[c]
      if (total === 0) return null
      const step = c === "mosque_loudspeaker" || c === "door_to_door" ? total : 1
      const tick = c === "mosque_loudspeaker" ? 700 : 250
      return setInterval(() => {
        setProgress((prev) => {
          if (prev[c] >= total) return prev
          const next = Math.min(prev[c] + step, total)
          return { ...prev, [c]: next }
        })
      }, tick)
    })
    return () => {
      intervals.forEach((i) => i && clearInterval(i))
    }
  }, [phase, breakdown])

  useEffect(() => {
    if (phase !== "dispatching") return
    const channels: CommunicationChannel[] = [
      "whatsapp",
      "sms",
      "mosque_loudspeaker",
      "door_to_door",
    ]
    const allDone = channels.every((c) => progress[c] >= breakdown[c])
    if (allDone) {
      const t = setTimeout(() => setPhase("complete"), 600)
      return () => clearTimeout(t)
    }
  }, [progress, phase, breakdown])

  const handleSend = () => setPhase("dispatching")

  const handleFinish = () => {
    onOpenChange(false)
    onComplete()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[560px] w-[300px] max-w-[300px] gap-2 overflow-y-auto p-3 sm:max-w-[300px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-primary" />
            {phase === "compose" && "Emergency Broadcast"}
            {phase === "dispatching" && "Dispatching…"}
            {phase === "complete" && "Broadcast Sent"}
          </DialogTitle>
        </DialogHeader>

        {phase === "compose" && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold">Message</label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 min-h-[80px] text-xs"
              />
              <p className="mt-1 text-[10px] text-muted-foreground">
                You can edit shelter details and custom instructions before sending.
              </p>
            </div>

            <Card>
              <CardContent className="space-y-2 p-3">
                <p className="text-xs font-semibold">Channel Summary</p>
                {(["whatsapp", "sms", "mosque_loudspeaker", "door_to_door"] as CommunicationChannel[]).map(
                  (c) => {
                    const Icon = CHANNEL_ICON[c]
                    return (
                      <div key={c} className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5">
                          <Icon className={`h-3.5 w-3.5 ${CHANNEL_COLOR[c]}`} />
                          {getChannelLabel(c)}
                        </span>
                        <span className="font-semibold">{breakdown[c]} households</span>
                      </div>
                    )
                  },
                )}
                <div className="mt-2 flex items-center justify-between border-t border-border pt-2 text-xs">
                  <span className="font-semibold">Total recipients</span>
                  <span className="font-bold text-primary">{totalRecipients}</span>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleSend}
              className="h-12 w-full gap-2 bg-red-600 text-base font-bold text-white hover:bg-red-700"
            >
              <Radio className="h-5 w-5" />
              Send Emergency Broadcast
            </Button>
          </div>
        )}

        {phase === "dispatching" && (
          <div className="space-y-3">
            {(["whatsapp", "sms", "mosque_loudspeaker", "door_to_door"] as CommunicationChannel[]).map(
              (c) => {
                const Icon = CHANNEL_ICON[c]
                const total = breakdown[c]
                const sent = progress[c]
                const pct = total === 0 ? 100 : (sent / total) * 100
                const label =
                  c === "mosque_loudspeaker"
                    ? sent >= total && total > 0
                      ? "Mosque loudspeaker request sent"
                      : "Requesting mosque loudspeaker…"
                    : c === "door_to_door"
                    ? sent >= total && total > 0
                      ? "Door-to-door queue prepared"
                      : "Preparing door-to-door queue…"
                    : `Sending ${getChannelLabel(c)} messages… ${sent}/${total}`
                return (
                  <div key={c}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5">
                        <Icon className={`h-3.5 w-3.5 ${CHANNEL_COLOR[c]}`} />
                        {label}
                      </span>
                      {sent >= total && total > 0 && <Check className="h-4 w-4 text-green-600" />}
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                )
              },
            )}
          </div>
        )}

        {phase === "complete" && (
          <div className="space-y-3 py-2">
            <div className="flex flex-col items-center gap-2 py-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-base font-bold">Broadcast Complete</p>
              <p className="text-center text-xs text-muted-foreground">
                Alert sent to {totalRecipients} households across {Object.values(breakdown).filter((v) => v > 0).length} channels.
              </p>
            </div>
            <Button onClick={handleFinish} className="h-11 w-full bg-primary font-bold">
              View Response Tracking
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
