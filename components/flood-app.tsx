"use client"

import { useState, useEffect } from "react"
import {
  AlertTriangle,
  Droplets,
  Bell,
  Home,
  Settings,
  Globe,
  Wifi,
  WifiOff,
  Check,
  Radio,
  Users,
  FileText,
  ChevronRight,
  CloudRain,
  Gauge,
  MessageSquare,
  Footprints,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { WhatsAppMonitor } from "@/components/whatsapp-monitor"
import { AlertsView } from "@/components/alerts-view"
import { HouseholdList } from "@/components/household-list"
import { BPBDAlertBanner } from "@/components/bpbd-alert"
import { BroadcastDialog } from "@/components/broadcast-dialog"
import { ResponseTracker } from "@/components/response-tracker"
import { RoutePlanner } from "@/components/route-planner"
import { useSimulation } from "@/hooks/use-simulation"
import { getNonResponsive, getStatusCounts, mockBPBDAlert } from "@/lib/mock-data"
import { t } from "@/lib/i18n"

const languages = [
  { code: "en", label: "English" },
  { code: "id", label: "Indonesian" },
  { code: "su", label: "Sundanese" },
]

type ConnectionStatus = "online" | "limited" | "offline"
type Screen = "main" | "households" | "route"

export function FloodApp() {
  const [language, setLanguage] = useState("en")
  const [activeTab, setActiveTab] = useState("home")
  const [connectionStatus] = useState<ConnectionStatus>("online")
  const [screen, setScreen] = useState<Screen>("main")
  const [alertOpen, setAlertOpen] = useState(false)
  const [broadcastOpen, setBroadcastOpen] = useState(false)
  const [broadcastSent, setBroadcastSent] = useState(false)

  const currentLanguage = languages.find((l) => l.code === language)

  const simulation = useSimulation({
    tickMs: 1500,
    responseProbability: 0.22,
    nonResponsiveTimeoutMs: 60_000,
  })

  const households = simulation.households
  const counts = getStatusCounts(households)
  const totalHouseholds = households.length
  const affectedHouseholds = totalHouseholds - counts.safe

  const alertLevel = broadcastSent ? "WARNING" : "WARNING"
  const waterLevel = mockBPBDAlert.predictedFloodLevel
  const rainfallRisk = "High"

  const getAlertColor = (level: string) => {
    switch (level) {
      case "DANGER": return "bg-red-600"
      case "WARNING": return "bg-orange-500"
      case "WATCH": return "bg-yellow-500"
      default: return "bg-green-500"
    }
  }

  const getAlertText = (level: string) => {
    switch (level) {
      case "DANGER": return t(language as any, "alertDanger")
      case "WARNING": return t(language as any, "alertWarning")
      case "WATCH": return t(language as any, "alertWatch")
      default: return t(language as any, "alertSafe")
    }
  }

  const handleBroadcastClick = () => {
    if (broadcastSent) {
      setBroadcastOpen(true)
    } else {
      setAlertOpen(true)
    }
  }

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('lang') : null
    if (saved && languages.find((l) => l.code === saved)) setLanguage(saved)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('lang', language)
  }, [language])

  const handleReviewAlert = () => {
    setAlertOpen(false)
    setBroadcastOpen(true)
  }

  const handleBroadcastComplete = () => {
    setBroadcastSent(true)
    simulation.start()
  }

  const ConnectionIndicator = () => {
    const config = {
      online: { icon: Wifi, color: "text-green-600", bg: "bg-green-100", label: "Online" },
      limited: { icon: Wifi, color: "text-yellow-600", bg: "bg-yellow-100", label: "Limited" },
      offline: { icon: WifiOff, color: "text-red-600", bg: "bg-red-100", label: "Offline" },
    }
    const { icon: Icon, color, bg } = config[connectionStatus]
    return (
      <div className={`flex items-center justify-center rounded-full p-1.5 ${bg}`}>
        <Icon className={`h-3.5 w-3.5 ${color}`} />
      </div>
    )
  }

  return (
    <div className="relative flex h-full flex-col bg-background">
      {/* Status Bar */}
      <div className="flex items-center justify-between bg-primary px-4 py-1.5">
        <span className="text-xs text-primary-foreground/80">9:41</span>
        <div className="flex items-center gap-2">
          <Wifi className="h-3.5 w-3.5 text-primary-foreground/80" />
          <div className="flex items-center gap-0.5">
            <div className="h-3 w-1 rounded-sm bg-primary-foreground/80" />
            <div className="h-3 w-1 rounded-sm bg-primary-foreground/80" />
            <div className="h-3 w-1 rounded-sm bg-primary-foreground/80" />
            <div className="h-3 w-1 rounded-sm bg-primary-foreground/40" />
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-primary px-4 pb-4 pt-2">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground">
              <Droplets className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-bold text-primary-foreground">RakyatBanjir</h1>
              <p className="text-[10px] text-primary-foreground/70">Citeureup Village</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ConnectionIndicator />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 px-2 text-xs text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span className="hidden min-[320px]:inline">{currentLanguage?.label}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[140px]">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className="flex items-center justify-between"
                  >
                    {lang.label}
                    {language === lang.code && <Check className="h-4 w-4 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {activeTab === "community" && (
        <main className="flex-1 overflow-hidden">
          <WhatsAppMonitor />
        </main>
      )}
      {activeTab === "alerts" && (
        <main className="flex-1 overflow-hidden">
          <AlertsView />
        </main>
      )}
      {(activeTab === "home" || activeTab === "offline" || activeTab === "settings") && (
        <>
          {screen === "households" && (
            <main className="flex-1 overflow-hidden">
              <HouseholdList
                households={households}
                onBack={() => setScreen("main")}
                highlightNonResponsive={simulation.timedOut}
              />
            </main>
          )}

          {screen === "route" && (
            <main className="flex-1 overflow-hidden">
              <RoutePlanner
                households={getNonResponsive(households)}
                onBack={() => setScreen("main")}
              />
            </main>
          )}

          {screen === "main" && (
            <main className="flex-1 space-y-3 overflow-y-auto p-3">
              {/* Alert Status Banner */}
              <Card className={`border-0 ${getAlertColor(alertLevel)}`}>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20">
                      <AlertTriangle className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-bold text-white">{getAlertText(alertLevel)}</p>
                      <p className="text-sm text-white/80">
                        {broadcastSent ? t(language as any, 'broadcastSent') : t(language as any, 'lastUpdated')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Summary */}
              <div className="grid grid-cols-2 gap-2">
                <Card className="border-border">
                  <CardContent className="p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Gauge className="h-5 w-5 text-primary" />
                      <span className="text-xs text-muted-foreground">{t(language as any, 'waterLevel')}</span>
                    </div>
                    <p className="mt-1 text-xl font-bold text-foreground">{waterLevel}m</p>
                    <p className="text-xs text-orange-600">{t(language as any, 'aboveNormal')}</p>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardContent className="p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <CloudRain className="h-5 w-5 text-primary" />
                      <span className="text-xs text-muted-foreground">{t(language as any, 'rainfallRisk')}</span>
                    </div>
                    <p className="mt-1 text-xl font-bold text-foreground">{rainfallRisk}</p>
                    <p className="text-xs text-orange-600">{t(language as any, 'heavyRain')}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Response tracker (after broadcast) or static household stats */}
              {broadcastSent ? (
                <ResponseTracker
                  households={households}
                  timedOut={simulation.timedOut}
                  elapsedMs={simulation.elapsedMs}
                  onViewHouseholds={() => setScreen("households")}
                  onPlanRoute={() => setScreen("route")}
                />
              ) : (
                <Card className="border-border">
                  <CardContent className="p-3 text-center">
                    <div className="mb-3 flex items-center justify-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span className="text-sm font-semibold text-foreground">Household Status</span>
                    </div>
                    <p className="mb-3 text-xs text-muted-foreground">
                      {affectedHouseholds}/{totalHouseholds} {t(language as any, 'affectedSuffix')}
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="rounded-lg bg-green-50 p-2 flex flex-col items-center justify-center text-center min-h-20">
                        <p className="text-lg font-bold text-green-700">{counts.safe}</p>
                        <p className="text-[10px] font-medium text-green-600">{t(language as any, 'safe')}</p>
                      </div>
                      <div className="rounded-lg bg-yellow-50 p-2 flex flex-col items-center justify-center text-center min-h-20">
                        <p className="text-lg font-bold text-yellow-700">{counts.evacuating}</p>
                        <p className="text-[10px] font-medium text-yellow-600">{t(language as any, 'evacuating')}</p>
                      </div>
                      <div className="rounded-lg bg-red-50 p-2 flex flex-col items-center justify-center text-center min-h-20">
                        <p className="text-lg font-bold text-red-700">{counts.needs_help}</p>
                        <p className="text-[10px] font-medium text-red-600">{t(language as any, 'needsHelp')}</p>
                      </div>
                      <div className="rounded-lg bg-gray-100 p-2 flex flex-col items-center justify-center text-center min-h-20">
                        <p className="text-lg font-bold text-gray-700">{counts.no_response}</p>
                        <p className="text-[10px] font-medium text-gray-600">{t(language as any, 'noResponse')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Broadcast Warning Button */}
              <Button
                onClick={handleBroadcastClick}
                className="h-14 w-full gap-3 bg-primary text-lg font-bold text-primary-foreground shadow-lg hover:bg-primary/90 flex items-center justify-center"
                size="lg"
              >
                <Radio className="h-6 w-6" />
                {broadcastSent ? t(language as any, 'broadcastAgain') : t(language as any, 'broadcastWarning')}
              </Button>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Card
                  className="cursor-pointer border-border transition-colors hover:border-primary/50"
                  onClick={() => setAlertOpen(true)}
                >
                  <CardContent className="flex flex-col items-center gap-3 p-3 text-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{t(language as any, 'alertDetails')}</p>
                      <p className="text-xs text-muted-foreground">{t(language as any, 'viewBPBD')}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card
                  className="cursor-pointer border-border transition-colors hover:border-primary/50"
                  onClick={() => setScreen("households")}
                >
                  <CardContent className="flex flex-col items-center gap-3 p-3 text-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{t(language as any, 'households')}</p>
                      <p className="text-xs text-muted-foreground">{t(language as any, 'manageFollowUp')}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {broadcastSent && (
                <Card
                  className="cursor-pointer border-border transition-colors hover:border-primary/50"
                  onClick={() => setScreen("route")}
                >
                  <CardContent className="flex flex-col items-center gap-3 p-3 text-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100">
                      <Footprints className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{t(language as any, 'doorToDoor')}</p>
                      <p className="text-xs text-muted-foreground">{t(language as any, 'prioritizedCheck')}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </main>
          )}
        </>
      )}

      {/* Bottom Navigation */}
      <nav className="border-t border-border bg-card px-2 pb-4 pt-2">
        <div className="flex items-center justify-around">
          {[
            { id: "home", icon: Home, label: t(language as any, 'navHome') },
            { id: "alerts", icon: Bell, label: t(language as any, 'navAlerts'), badge: true },
            { id: "community", icon: MessageSquare, label: t(language as any, 'navCommunity') },
            { id: "settings", icon: Settings, label: t(language as any, 'navSettings') },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id)
                setScreen("main")
              }}
              className={`relative flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-colors ${
                activeTab === item.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {"badge" in item && item.badge && (
                  <span className="absolute -right-1 -top-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-orange-500" />
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* BPBD Alert Banner Overlay */}
      {alertOpen && (
        <BPBDAlertBanner
          alert={mockBPBDAlert}
          households={households}
          onReview={handleReviewAlert}
          onDismiss={() => setAlertOpen(false)}
        />
      )}

      {/* Broadcast Dialog */}
      <BroadcastDialog
        open={broadcastOpen}
        onOpenChange={setBroadcastOpen}
        alert={mockBPBDAlert}
        households={households}
        onComplete={handleBroadcastComplete}
      />
    </div>
  )
}
