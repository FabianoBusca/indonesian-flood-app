"use client"

import { useState } from "react"
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

const languages = [
  { code: "en", label: "English" },
  { code: "id", label: "Indonesian" },
  { code: "su", label: "Sundanese" },
]

type ConnectionStatus = "online" | "limited" | "offline"

interface HouseholdStats {
  safe: number
  evacuating: number
  needsHelp: number
  noResponse: number
}

export function FloodApp() {
  const [language, setLanguage] = useState("en")
  const [activeTab, setActiveTab] = useState("home")
  const [connectionStatus] = useState<ConnectionStatus>("online")

  const currentLanguage = languages.find((l) => l.code === language)

  // Mock data for the dashboard
  const alertLevel = "WARNING" // NORMAL, WATCH, WARNING, DANGER
  const affectedHouseholds = 47
  const totalHouseholds = 156
  const waterLevel = 2.3 // meters
  const rainfallRisk = "High"

  const householdStats: HouseholdStats = {
    safe: 89,
    evacuating: 12,
    needsHelp: 8,
    noResponse: 47,
  }

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
      case "DANGER": return "BAHAYA - Evacuate Immediately"
      case "WARNING": return "SIAGA - Flood Warning Active"
      case "WATCH": return "WASPADA - Monitor Conditions"
      default: return "AMAN - No Current Alerts"
    }
  }

  const ConnectionIndicator = () => {
    const config = {
      online: { icon: Wifi, color: "text-green-600", bg: "bg-green-100", label: "Online" },
      limited: { icon: Wifi, color: "text-yellow-600", bg: "bg-yellow-100", label: "Limited" },
      offline: { icon: WifiOff, color: "text-red-600", bg: "bg-red-100", label: "Offline" },
    }
    const { icon: Icon, color, bg, label } = config[connectionStatus]
    
    return (
      <div className={`flex items-center justify-center rounded-full p-1.5 ${bg}`}>
        <Icon className={`h-3.5 w-3.5 ${color}`} />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Status Bar - Android style */}
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
      <main className="flex-1 space-y-3 overflow-y-auto p-3">
        {/* Alert Status Banner */}
        <Card className={`border-0 ${getAlertColor(alertLevel)}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20">
                <AlertTriangle className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold text-white">{getAlertText(alertLevel)}</p>
                <p className="text-sm text-white/80">Last updated: 5 min ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Summary */}
        <div className="grid grid-cols-2 gap-2">
          <Card className="border-border">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-primary" />
                <span className="text-xs text-muted-foreground">Water Level</span>
              </div>
              <p className="mt-1 text-xl font-bold text-foreground">{waterLevel}m</p>
              <p className="text-xs text-orange-600">Above normal</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <CloudRain className="h-5 w-5 text-primary" />
                <span className="text-xs text-muted-foreground">Rainfall Risk</span>
              </div>
              <p className="mt-1 text-xl font-bold text-foreground">{rainfallRisk}</p>
              <p className="text-xs text-orange-600">Heavy rain expected</p>
            </CardContent>
          </Card>
        </div>

        {/* Affected Households */}
        <Card className="border-border">
          <CardContent className="p-3">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold text-foreground">Household Status</span>
              </div>
              <span className="text-xs text-muted-foreground">{affectedHouseholds}/{totalHouseholds} affected</span>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              <div className="rounded-lg bg-green-50 p-2 text-center">
                <p className="text-lg font-bold text-green-700">{householdStats.safe}</p>
                <p className="text-[10px] font-medium text-green-600">SAFE</p>
              </div>
              <div className="rounded-lg bg-yellow-50 p-2 text-center">
                <p className="text-lg font-bold text-yellow-700">{householdStats.evacuating}</p>
                <p className="text-[10px] font-medium text-yellow-600">EVACUATING</p>
              </div>
              <div className="rounded-lg bg-red-50 p-2 text-center">
                <p className="text-lg font-bold text-red-700">{householdStats.needsHelp}</p>
                <p className="text-[10px] font-medium text-red-600">NEEDS HELP</p>
              </div>
              <div className="rounded-lg bg-gray-100 p-2 text-center">
                <p className="text-lg font-bold text-gray-700">{householdStats.noResponse}</p>
                <p className="text-[10px] font-medium text-gray-600">NO RESPONSE</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Broadcast Warning Button */}
        <Button 
          className="h-14 w-full gap-3 bg-primary text-lg font-bold text-primary-foreground shadow-lg hover:bg-primary/90"
          size="lg"
        >
          <Radio className="h-6 w-6" />
          Broadcast Warning
        </Button>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Card className="cursor-pointer border-border transition-colors hover:border-primary/50">
            <CardContent className="flex items-center gap-3 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Alert Details</p>
                <p className="text-xs text-muted-foreground">View BPBD info</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
          <Card className="cursor-pointer border-border transition-colors hover:border-primary/50">
            <CardContent className="flex items-center gap-3 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Households</p>
                <p className="text-xs text-muted-foreground">Manage follow-up</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </div>
      </main>
      )}

      {/* Bottom Navigation */}
      <nav className="border-t border-border bg-card px-2 pb-4 pt-2">
        <div className="flex items-center justify-around">
          {[
            { id: "home", icon: Home, label: "Home" },
            { id: "alerts", icon: Bell, label: "Alerts", badge: true },
            { id: "community", icon: MessageSquare, label: "Community" },
            { id: "settings", icon: Settings, label: "Settings" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
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
    </div>
  )
}
