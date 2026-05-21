"use client"

import { useCallback, useEffect, useState } from "react"
import {
  AlertTriangle,
  Bell,
  ChevronRight,
  CloudRain,
  Droplets,
  FileText,
  Footprints,
  Gauge,
  Globe,
  Home,
  MessageSquare,
  Radio,
  Settings,
  Users,
  Wifi,
  WifiOff,
  Battery,
  Check,
} from "lucide-react"
import { BPBDAlertBanner } from "@/components/bpbd-alert"
import { AlertsView } from "@/components/alerts-view"
import { BroadcastDialog } from "@/components/broadcast-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HouseholdList } from "@/components/household-list"
import { LimitedConnectivityView } from "@/components/limited-connectivity-view"
import { ResponseTracker } from "@/components/response-tracker"
import { RoutePlanner } from "@/components/route-planner"
import { WhatsAppMonitor } from "@/components/whatsapp-monitor"
import { SettingsPage } from "@/components/settings-page"
import { useSimulation } from "@/hooks/use-simulation"
import { getNonResponsive, getStatusCounts, mockBPBDAlert } from "@/lib/mock-data"
import { t, type Locale } from "@/lib/i18n"

const languages = [
  { code: "en", label: "English" },
  { code: "id", label: "Indonesian" },
  { code: "su", label: "Sundanese" },
]

type ConnectionStatus = "online" | "limited" | "offline"
type Screen = "main" | "households" | "route"

interface AccessibilitySettings {
  textSize: 'small' | 'medium' | 'large'
  highContrast: boolean
  boldText: boolean
  reducedMotion: boolean
  screenReaderEnabled: boolean
  colorblindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'
  lineSpacing: 'normal' | 'comfortable' | 'wide'
}

export function FloodApp() {
  const [language, setLanguage] = useState<Locale>("en")
  const [activeTab, setActiveTab] = useState("home")
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("online")
  const [screen, setScreen] = useState<Screen>("main")
  const [alertOpen, setAlertOpen] = useState(false)
  const [broadcastOpen, setBroadcastOpen] = useState(false)
  const [broadcastSent, setBroadcastSent] = useState(false)
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    textSize: 'medium',
    highContrast: false,
    boldText: false,
    reducedMotion: false,
    screenReaderEnabled: false,
    colorblindMode: 'none',
    lineSpacing: 'normal',
  })

  const currentLanguage = languages.find((l) => l.code === language)
  const displayedConnectionStatus: ConnectionStatus = connectionStatus

  useEffect(() => {
    if (activeTab === "offline") setConnectionStatus("offline")
    else setConnectionStatus("online")
  }, [activeTab])

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
  const rainfallRisk =
    language === "id" ? "Tinggi" : language === "su" ? "Luhur" : "High"

  const getAlertColor = (level: string) => {
    switch (level) {
      case "DANGER":
        return "bg-red-600"
      case "WARNING":
        return "bg-orange-500"
      case "WATCH":
        return "bg-yellow-500"
      default:
        return "bg-green-500"
    }
  }

  const getAlertText = (level: string) => {
    switch (level) {
      case "DANGER":
        return t(language as any, "alertDanger")
      case "WARNING":
        return t(language as any, "alertWarning")
      case "WATCH":
        return t(language as any, "alertWatch")
      default:
        return t(language as any, "alertSafe")
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
    const saved = typeof window !== "undefined" ? localStorage.getItem("lang") : null
    if (saved && languages.find((l) => l.code === saved)) setLanguage(saved as Locale)
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("lang", language)
  }, [language])

  useEffect(() => {
    const savedAccessibility = typeof window !== "undefined" ? localStorage.getItem("accessibility") : null
    if (savedAccessibility) {
      try {
        setAccessibility(JSON.parse(savedAccessibility))
      } catch (e) {
        // Invalid JSON, use default
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("accessibility", JSON.stringify(accessibility))

    // Apply accessibility settings to document
    const root = document.documentElement
    
    // Text size
    const textSizeMap = { small: '0.875rem', medium: '1rem', large: '1.125rem' }
    root.style.fontSize = textSizeMap[accessibility.textSize]
    
    // Bold text
    if (accessibility.boldText) {
      root.style.fontWeight = '600'
    } else {
      root.style.fontWeight = '400'
    }
    
    // Line spacing
    const lineSpacingMap = { normal: '1.5', comfortable: '1.75', wide: '2' }
    root.style.lineHeight = lineSpacingMap[accessibility.lineSpacing]
    
    // High contrast
    if (accessibility.highContrast) {
      document.body.classList.add('high-contrast-mode')
    } else {
      document.body.classList.remove('high-contrast-mode')
    }
    
    // Reduced motion
    if (accessibility.reducedMotion) {
      document.body.classList.add('reduced-motion-mode')
    } else {
      document.body.classList.remove('reduced-motion-mode')
    }

    // Colorblind mode is applied via className on the root div, not body
  }, [accessibility])

  const speak = useCallback((text: string) => {
    if (!accessibility.screenReaderEnabled || typeof window === 'undefined') return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language === 'id' || language === 'su' ? 'id-ID' : 'en-US'
    utterance.rate = 0.95
    window.speechSynthesis.speak(utterance)
  }, [accessibility.screenReaderEnabled, language])

  const buildTabAnnouncement = useCallback((tab: string): string => {
    const lang = language as 'en' | 'id' | 'su'

    if (tab === 'home') {
      const alert = lang === 'id'
        ? `Peringatan banjir aktif. Ketinggian air ${waterLevel} meter, di atas normal. Risiko curah hujan: tinggi, hujan deras diperkirakan.`
        : lang === 'su'
        ? `Panggeuing banjir aktif. Luhur cai ${waterLevel} méter, leuwih ti normal. Résiko hujan: luhur, hujan deras diperkirakeun.`
        : `Flood warning active. Water level ${waterLevel} metres, above normal. Rainfall risk: high, heavy rain expected.`
      const status = lang === 'id'
        ? `Status rumah tangga: ${affectedHouseholds} dari ${totalHouseholds} terdampak. ${counts.safe} aman, ${counts.evacuating} mengungsi, ${counts.needs_help} butuh bantuan, ${counts.no_response} tidak merespon.`
        : lang === 'su'
        ? `Status rumah tangga: ${affectedHouseholds} ti ${totalHouseholds} kapangaruhan. ${counts.safe} aman, ${counts.evacuating} ngungsi, ${counts.needs_help} butuh bantosan, ${counts.no_response} teu ngaréspon.`
        : `Household status: ${affectedHouseholds} of ${totalHouseholds} affected. ${counts.safe} safe, ${counts.evacuating} evacuating, ${counts.needs_help} need help, ${counts.no_response} no response.`
      const action = broadcastSent
        ? (lang === 'id' ? 'Siaran sudah terkirim.' : lang === 'su' ? 'Siaran geus dikirim.' : 'Broadcast already sent.')
        : (lang === 'id' ? 'Tombol siarkan peringatan tersedia.' : lang === 'su' ? 'Tombol siarkeun panggeuing sayaga.' : 'Broadcast warning button available.')
      return `${lang === 'id' ? 'Tab Beranda.' : lang === 'su' ? 'Tab Beranda.' : 'Home tab.'} ${alert} ${status} ${action}`
    }

    if (tab === 'alerts') {
      return lang === 'id'
        ? `Tab Peringatan. Peringatan BPBD masuk. Level: SIAGA. Ketinggian banjir diprediksi ${waterLevel} meter. Rekomendasi evakuasi: ${mockBPBDAlert.evacuationRecommendation}. Lokasi posko: ${mockBPBDAlert.shelterLocations.join(', ')}.`
        : lang === 'su'
        ? `Tab Peringatan. Panggeuing BPBD asup. Level: SIAGA. Luhur banjir diprediksi ${waterLevel} méter. Saran evakuasi: ${mockBPBDAlert.evacuationRecommendation}. Lokasi pangungsian: ${mockBPBDAlert.shelterLocations.join(', ')}.`
        : `Alerts tab. Incoming BPBD alert. Level: WARNING. Predicted flood level ${waterLevel} metres. Evacuation recommendation: ${mockBPBDAlert.evacuationRecommendation}. Shelter locations: ${mockBPBDAlert.shelterLocations.join(', ')}.`
    }

    if (tab === 'community') {
      return lang === 'id'
        ? 'Tab Komunitas. Pemantauan AI aktif. Sinyal risiko terdeteksi dalam 20 menit terakhir. Warga melaporkan kondisi banjir melalui WhatsApp.'
        : lang === 'su'
        ? 'Tab Komunitas. Pangawasan AI aktif. Sinyal résiko kapanggih dina 20 menit panungtungan. Warga ngalaporkeun kaayaan banjir ngaliwatan WhatsApp.'
        : 'Community tab. AI monitoring active. Risk signals detected in the last 20 minutes. Residents reporting flood conditions via WhatsApp.'
    }

    if (tab === 'offline') {
      return lang === 'id'
        ? `Tab Luring. Mode darurat konektivitas terbatas aktif. 141 rumah tangga tersimpan di cache, 11 rentan, ${counts.no_response} belum sinkron. 3 kunjungan prioritas menunggu: Ibu Siti di Blok A, Pak Hendra di Gang Mawar, dan Dewi Marlina dekat Masjid Al-Hidayah.`
        : lang === 'su'
        ? `Tab Luring. Mode darurat konektifitas tebih aktif. 141 rumah tangga disimpen di cache, 11 rentan, ${counts.no_response} can sinkron. 3 kunjungan prioritas ngantos: Ibu Siti di Blok A, Pak Hendra di Gang Mawar, sareng Dewi Marlina deukeut Masjid Al-Hidayah.`
        : `Offline tab. Limited connectivity emergency mode active. 141 households cached, 11 vulnerable, ${counts.no_response} unsynced. 3 priority visits pending: Ibu Siti at Block A, Pak Hendra at Gang Mawar, and Dewi Marlina near Masjid Al-Hidayah.`
    }

    if (tab === 'settings') {
      return lang === 'id'
        ? 'Tab Pengaturan. Kelola aksesibilitas dan preferensi tampilan. Ukuran teks, jarak baris, teks tebal, kontras tinggi, gerakan berkurang, pembaca layar, dan mode buta warna tersedia.'
        : lang === 'su'
        ? 'Tab Setélan. Atur aksésibilitas jeung karapihan. Ukuran teks, jarak baris, teks kandel, kontras luhur, gerakan kurang, bacaan layar, sareng mode buta warna sayaga.'
        : 'Settings tab. Manage accessibility and display preferences. Text size, line spacing, bold text, high contrast, reduced motion, screen reader, and colour blind mode are available.'
    }

    return ''
  }, [language, waterLevel, affectedHouseholds, totalHouseholds, counts, broadcastSent])

  useEffect(() => {
    speak(buildTabAnnouncement(activeTab))
  }, [activeTab])

  useEffect(() => {
    if (activeTab === 'home' && broadcastSent) {
      const lang = language as 'en' | 'id' | 'su'
      speak(lang === 'id'
        ? `Status diperbarui: ${counts.safe} aman, ${counts.evacuating} mengungsi, ${counts.needs_help} butuh bantuan, ${counts.no_response} tidak merespon.`
        : lang === 'su'
        ? `Status diropéa: ${counts.safe} aman, ${counts.evacuating} ngungsi, ${counts.needs_help} butuh bantosan, ${counts.no_response} teu ngaréspon.`
        : `Status updated: ${counts.safe} safe, ${counts.evacuating} evacuating, ${counts.needs_help} need help, ${counts.no_response} no response.`)
    }
  }, [counts.safe, counts.evacuating, counts.needs_help, counts.no_response])

  useEffect(() => {
    if (alertOpen) {
      speak(language === 'id'
        ? 'Peringatan darurat masuk dari BPBD. Ketinggian air 2,3 meter. Tinjau dan siarkan peringatan.'
        : language === 'su'
        ? 'Panggeuing darurat asup ti BPBD. Luhur cai 2,3 méter. Tinjau jeung siarkeun panggeuing.'
        : 'Incoming emergency alert from BPBD. Water level 2.3 metres. Review and broadcast the warning.')
    }
  }, [alertOpen])

  const handleReviewAlert = () => {
    setAlertOpen(false)
    setBroadcastOpen(true)
  }

  const handleBroadcastComplete = () => {
    setBroadcastSent(true)
    simulation.start()
    speak(language === 'id'
      ? 'Siaran darurat terkirim ke 35 rumah tangga.'
      : language === 'su'
      ? 'Siaran darurat dikirim ka 35 rumah tangga.'
      : 'Emergency broadcast sent to 35 households.')
  }

  const ConnectionIndicator = () => {
    const config = {
      online: { icon: Wifi, color: "text-green-600", bg: "bg-green-100", label: "Online" },
      limited: { icon: Wifi, color: "text-yellow-600", bg: "bg-yellow-100", label: "Limited" },
      offline: { icon: WifiOff, color: "text-red-600", bg: "bg-red-100", label: "Offline" },
    }
    const { icon: Icon, color, bg, label } = config[displayedConnectionStatus]

    return (
      <div
        aria-label={`Connection status: ${label}`}
        className={`flex items-center justify-center rounded-full p-1.5 ${bg}`}
        title={`Connection status: ${label}`}
      >
        <Icon className={`h-3.5 w-3.5 ${color}`} />
      </div>
    )
  }

  const colorblindFilters: Record<string, string> = {
    protanopia:   'saturate(0.4) sepia(0.5) brightness(0.85)',
    deuteranopia: 'saturate(0.4) sepia(0.25) brightness(1.0)',
    tritanopia:   'saturate(0.6) hue-rotate(55deg)',
  }
  const colorblindFilterStyle = accessibility.colorblindMode !== 'none'
    ? { filter: colorblindFilters[accessibility.colorblindMode] }
    : {}

  return (
    <div style={colorblindFilterStyle} className="relative flex h-full flex-col bg-background">
      <div className="flex items-center justify-between bg-black px-4 py-1.5">
        <span className="status-bar-time text-xs text-white/90">
          9:41
        </span>
        <div className="flex items-center gap-2">
          {activeTab === 'offline' ? (
            <>
              <WifiOff className="h-3.5 w-3.5 text-white/90" aria-hidden />
              <div className="flex items-end gap-[2px]">
                <div className="h-2 w-1 bg-white/90 rounded-sm" />
                <div className="h-3 w-1 bg-white/40 rounded-sm" />
                <div className="h-4 w-1 bg-white/40 rounded-sm" />
              </div>
              <div className="relative h-4 w-7 rounded-[3px] border border-white/90">
                <div className="absolute top-0 left-0 h-full bg-white/90 rounded-l-[3px]" style={{ width: '100%' }} />
                <div className="absolute top-1 right-[-3px] h-2 w-1 rounded-sm bg-white/90" />
              </div>
            </>
          ) : (
            <>
              <Wifi className="h-3.5 w-3.5 text-white/90" />
              <div className="flex items-end gap-[2px]">
                <div className="h-2 w-1 bg-white/90 rounded-sm" />
                <div className="h-3 w-1 bg-white/90 rounded-sm" />
                <div className="h-4 w-1 bg-white/90 rounded-sm" />
              </div>
              <div className="relative h-4 w-7 rounded-[3px] border border-white/90">
                <div className="absolute top-0 left-0 h-full bg-white/90 rounded-l-[3px]" style={{ width: '100%' }} />
                <div className="absolute top-1 right-[-3px] h-2 w-1 rounded-sm bg-white/90" />
              </div>
            </>
          )}
        </div>
      </div>

      <header className="bg-primary px-4 pb-4 pt-2">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground">
              <Droplets className="h-5 w-5 text-primary" />
            </div>
            <div className="flex items-center gap-2">
              <div>
                <h1 className="text-base font-bold text-primary-foreground">RakyatBanjir</h1>
                <p className="text-[10px] text-primary-foreground/70">Citeureup Village</p>
              </div>
              {activeTab === 'offline' ? (
                <div className="flex items-center gap-1 rounded-full bg-red-100/30 px-2 py-1">
                  <WifiOff className="h-3 w-3 text-red-200" />
                  <span className="text-[9px] font-medium text-red-200">Offline</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 rounded-full bg-green-100/30 px-2 py-1">
                  <Wifi className="h-3 w-3 text-green-200" />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
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

      {activeTab === "community" && (
        <main className="flex-1 overflow-hidden">
          <WhatsAppMonitor language={language} />
        </main>
      )}
      {activeTab === "alerts" && (
        <main className="flex-1 overflow-hidden">
          <AlertsView language={language} />
        </main>
      )}
      {activeTab === "offline" && (
        <main className="flex-1 overflow-hidden">
          <LimitedConnectivityView language={language} />
        </main>
      )}
      {activeTab === "settings" && (
        <main className="flex-1 overflow-hidden">
          <SettingsPage
            language={language}
            accessibility={accessibility}
            onAccessibilityChange={setAccessibility}
          />
        </main>
      )}
      {(activeTab === "home") && (
        <>
          {screen === "households" && (
            <main className="flex-1 overflow-hidden">
              <HouseholdList
                households={households}
                onBack={() => setScreen("main")}
                highlightNonResponsive={simulation.timedOut}
                language={language}
              />
            </main>
          )}

          {screen === "route" && (
            <main className="flex-1 overflow-hidden">
              <RoutePlanner
                households={getNonResponsive(households)}
                onBack={() => setScreen("main")}
                language={language}
              />
            </main>
          )}

          {screen === "main" && (
            <main className="flex-1 space-y-3 overflow-y-auto p-3">
              <Card className={`border-0 ${getAlertColor(alertLevel)}`}>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20">
                      <AlertTriangle className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-bold text-white">{getAlertText(alertLevel)}</p>
                      <p className="text-sm text-white/80">
                        {broadcastSent ? t(language as any, "broadcastSent") : t(language as any, "lastUpdated")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-2">
                <Card className="border-border">
                  <CardContent className="p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Gauge className="h-5 w-5 text-primary" />
                      <span className="text-xs text-muted-foreground">{t(language as any, "waterLevel")}</span>
                    </div>
                    <p className="mt-1 text-xl font-bold text-foreground">{waterLevel}m</p>
                    <p className="text-xs text-orange-600">{t(language as any, "aboveNormal")}</p>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardContent className="p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <CloudRain className="h-5 w-5 text-primary" />
                      <span className="text-xs text-muted-foreground">{t(language as any, "rainfallRisk")}</span>
                    </div>
                    <p className="mt-1 text-xl font-bold text-foreground">{rainfallRisk}</p>
                    <p className="text-xs text-orange-600">{t(language as any, "heavyRain")}</p>
                  </CardContent>
                </Card>
              </div>

              {broadcastSent ? (
                <ResponseTracker
                  households={households}
                  timedOut={simulation.timedOut}
                  elapsedMs={simulation.elapsedMs}
                  onViewHouseholds={() => setScreen("households")}
                  onPlanRoute={() => setScreen("route")}
                  language={language}
                />
              ) : (
                <Card className="border-border">
                  <CardContent className="p-3 text-center">
                    <div className="mb-3 flex items-center justify-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span className="text-sm font-semibold text-foreground">{t(language as any, "householdStatus")}</span>
                    </div>
                    <p className="mb-3 text-xs text-muted-foreground">
                      {affectedHouseholds}/{totalHouseholds} {t(language as any, "affectedSuffix")}
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="flex min-h-20 flex-col items-center justify-center rounded-lg bg-green-50 p-2 text-center">
                        <p className="text-lg font-bold text-green-700">{counts.safe}</p>
                        <p className="text-[10px] font-medium text-green-600">{t(language as any, "safe")}</p>
                      </div>
                      <div className="flex min-h-20 flex-col items-center justify-center rounded-lg bg-yellow-50 p-2 text-center">
                        <p className="text-lg font-bold text-yellow-700">{counts.evacuating}</p>
                        <p className="text-[10px] font-medium text-yellow-600">{t(language as any, "evacuating")}</p>
                      </div>
                      <div className="flex min-h-20 flex-col items-center justify-center rounded-lg bg-red-50 p-2 text-center">
                        <p className="text-lg font-bold text-red-700">{counts.needs_help}</p>
                        <p className="text-[10px] font-medium text-red-600">{t(language as any, "needsHelp")}</p>
                      </div>
                      <div className="flex min-h-20 flex-col items-center justify-center rounded-lg bg-gray-100 p-2 text-center">
                        <p className="text-lg font-bold text-gray-700">{counts.no_response}</p>
                        <p className="text-[10px] font-medium text-gray-600">{t(language as any, "noResponse")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button
                onClick={handleBroadcastClick}
                className="flex h-14 w-full items-center justify-center gap-3 bg-primary text-lg font-bold text-primary-foreground shadow-lg hover:bg-primary/90"
                size="lg"
              >
                <Radio className="h-6 w-6" />
                {broadcastSent ? t(language as any, "broadcastAgain") : t(language as any, "broadcastWarning")}
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Card className="cursor-pointer border-border transition-colors hover:border-primary/50" onClick={() => setAlertOpen(true)}>
                  <CardContent className="flex flex-col items-center gap-3 p-3 text-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{t(language as any, "alertDetails")}</p>
                      <p className="text-xs text-muted-foreground">{t(language as any, "viewBPBD")}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer border-border transition-colors hover:border-primary/50" onClick={() => setScreen("households")}>
                  <CardContent className="flex flex-col items-center gap-3 p-3 text-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{t(language as any, "households")}</p>
                      <p className="text-xs text-muted-foreground">{t(language as any, "manageFollowUp")}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {broadcastSent && (
                <Card className="cursor-pointer border-border transition-colors hover:border-primary/50" onClick={() => setScreen("route")}>
                  <CardContent className="flex flex-col items-center gap-3 p-3 text-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100">
                      <Footprints className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{t(language as any, "doorToDoor")}</p>
                      <p className="text-xs text-muted-foreground">{t(language as any, "prioritizedCheck")}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </main>
          )}
        </>
      )}

      <nav className="border-t border-border bg-card px-2 pb-4 pt-2">
        <div className="flex items-center justify-around">
          {[
            { id: "home", icon: Home, label: t(language as any, "navHome") },
            { id: "alerts", icon: Bell, label: t(language as any, "navAlerts"), badge: true },
            { id: "community", icon: MessageSquare, label: t(language as any, "navCommunity") },
            { id: "offline", icon: WifiOff, label: t(language as any, "navOffline") },
            { id: "settings", icon: Settings, label: t(language as any, "navSettings") },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id)
                setScreen("main")
              }}
              className={`relative flex flex-col items-center gap-1 rounded-lg px-2 py-2 transition-colors ${
                activeTab === item.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
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

      {alertOpen && (
        <BPBDAlertBanner
          alert={mockBPBDAlert}
          households={households}
          onReview={handleReviewAlert}
          onDismiss={() => setAlertOpen(false)}
          language={language}
        />
      )}

      <BroadcastDialog
        open={broadcastOpen}
        onOpenChange={setBroadcastOpen}
        alert={mockBPBDAlert}
        households={households}
        onComplete={handleBroadcastComplete}
        language={language}
      />
    </div>
  )
}
