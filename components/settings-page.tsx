"use client"

import { Volume2, Eye, Type, Maximize2, Zap, Moon, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { t, type Locale } from "@/lib/i18n"

interface AccessibilitySettings {
  textSize: 'small' | 'medium' | 'large'
  highContrast: boolean
  boldText: boolean
  reducedMotion: boolean
  screenReaderEnabled: boolean
  colorblindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'
  lineSpacing: 'normal' | 'comfortable' | 'wide'
}

export function SettingsPage({
  language = "en",
  accessibility,
  onAccessibilityChange,
}: {
  language?: Locale
  accessibility: AccessibilitySettings
  onAccessibilityChange: (settings: AccessibilitySettings) => void
}) {
  const handleTextSizeChange = (size: 'small' | 'medium' | 'large') => {
    onAccessibilityChange({ ...accessibility, textSize: size })
  }

  const handleToggle = (key: keyof AccessibilitySettings) => {
    onAccessibilityChange({
      ...accessibility,
      [key]: !(accessibility[key as keyof typeof accessibility]),
    })
  }

  const handleColorblindMode = (mode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia') => {
    onAccessibilityChange({ ...accessibility, colorblindMode: mode })
  }

  const handleLineSpacing = (spacing: 'normal' | 'comfortable' | 'wide') => {
    onAccessibilityChange({ ...accessibility, lineSpacing: spacing })
  }

  const textSizeLabels = {
    en: { small: 'Small', medium: 'Normal', large: 'Large' },
    id: { small: 'Kecil', medium: 'Normal', large: 'Besar' },
    su: { small: 'Leutik', medium: 'Normal', large: 'Gedé' },
  }

  const colorblindModeLabels = {
    en: { none: 'Normal', protanopia: 'Red-blind', deuteranopia: 'Green-blind', tritanopia: 'Blue-blind' },
    id: { none: 'Normal', protanopia: 'Buta merah', deuteranopia: 'Buta hijau', tritanopia: 'Buta biru' },
    su: { none: 'Normal', protanopia: 'Buta beureum', deuteranopia: 'Buta héjo', tritanopia: 'Buta biru' },
  }

  const lineSpacingLabels = {
    en: { normal: 'Normal', comfortable: 'Comfortable', wide: 'Wide' },
    id: { normal: 'Normal', comfortable: 'Nyaman', wide: 'Luas' },
    su: { normal: 'Normal', comfortable: 'Nyaman', wide: 'Luas' },
  }

  const labels = textSizeLabels[language] || textSizeLabels.en
  const colorblindLabels = colorblindModeLabels[language] || colorblindModeLabels.en
  const spacingLabels = lineSpacingLabels[language] || lineSpacingLabels.en

  return (
    <div className="h-full space-y-3 overflow-y-auto bg-background p-3">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-foreground">
          {language === 'id' ? 'Pengaturan' : language === 'su' ? 'Setélan' : 'Settings'}
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          {language === 'id' ? 'Kelola aksesibilitas dan preferensi tampilan' : language === 'su' ? 'Atur aksésibilitas jeung karapihan' : 'Manage accessibility and display preferences'}
        </p>
      </div>

      {/* Text Size */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Type className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">
              {language === 'id' ? 'Ukuran Teks' : language === 'su' ? 'Ukuran Teks' : 'Text Size'}
            </h3>
          </div>
          <div className="flex gap-2">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <Button
                key={size}
                onClick={() => handleTextSizeChange(size)}
                variant={accessibility.textSize === size ? 'default' : 'outline'}
                className={`flex-1 ${
                  size === 'small' ? 'text-xs' : size === 'large' ? 'text-base' : 'text-sm'
                }`}
              >
                {labels[size]}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            {language === 'id'
              ? 'Atur ukuran teks untuk kenyamanan membaca'
              : language === 'su'
              ? 'Ayeuna ukuran teks pikeun kanyamanan maca'
              : 'Adjust text size for reading comfort'}
          </p>
        </CardContent>
      </Card>

      {/* Line Spacing */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Maximize2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">
              {language === 'id' ? 'Jarak Baris' : language === 'su' ? 'Jarak Baris' : 'Line Spacing'}
            </h3>
          </div>
          <div className="flex gap-2">
            {(['normal', 'comfortable', 'wide'] as const).map((spacing) => (
              <Button
                key={spacing}
                onClick={() => handleLineSpacing(spacing)}
                variant={accessibility.lineSpacing === spacing ? 'default' : 'outline'}
                size="sm"
              >
                {spacingLabels[spacing]}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            {language === 'id'
              ? 'Pilih jarak antar baris yang nyaman'
              : language === 'su'
              ? 'Pilih jarak antara baris nu nyaman'
              : 'Choose comfortable line spacing'}
          </p>
        </CardContent>
      </Card>

      {/* Bold Text Toggle */}
      <Card className="cursor-pointer" onClick={() => handleToggle('boldText')}>
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 rounded bg-primary/20 flex items-center justify-center">
              <span className="font-bold text-primary text-xs">B</span>
            </div>
            <h3 className="font-semibold text-foreground">
              {language === 'id' ? 'Teks Tebal' : language === 'su' ? 'Teks Kandel' : 'Bold Text'}
            </h3>
          </div>
          <div className={`w-12 h-6 rounded-full flex items-center transition-colors ${
            accessibility.boldText ? 'bg-primary' : 'bg-gray-300'
          }`}>
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
              accessibility.boldText ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </div>
        </CardContent>
      </Card>

      {/* High Contrast Toggle */}
      <Card className="cursor-pointer" onClick={() => handleToggle('highContrast')}>
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Eye className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">
              {language === 'id' ? 'Kontras Tinggi' : language === 'su' ? 'Kontras Luhur' : 'High Contrast'}
            </h3>
          </div>
          <div className={`w-12 h-6 rounded-full flex items-center transition-colors ${
            accessibility.highContrast ? 'bg-primary' : 'bg-gray-300'
          }`}>
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
              accessibility.highContrast ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </div>
        </CardContent>
      </Card>

      {/* Reduced Motion Toggle */}
      <Card className="cursor-pointer" onClick={() => handleToggle('reducedMotion')}>
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">
              {language === 'id' ? 'Gerakan Berkurang' : language === 'su' ? 'Gerakan Kurang' : 'Reduced Motion'}
            </h3>
          </div>
          <div className={`w-12 h-6 rounded-full flex items-center transition-colors ${
            accessibility.reducedMotion ? 'bg-primary' : 'bg-gray-300'
          }`}>
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
              accessibility.reducedMotion ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </div>
        </CardContent>
      </Card>

      {/* Screen Reader Toggle */}
      <Card className="cursor-pointer" onClick={() => handleToggle('screenReaderEnabled')}>
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Volume2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">
              {language === 'id' ? 'Pembaca Layar' : language === 'su' ? 'Bacaan Layar' : 'Screen Reader'}
            </h3>
          </div>
          <div className={`w-12 h-6 rounded-full flex items-center transition-colors ${
            accessibility.screenReaderEnabled ? 'bg-primary' : 'bg-gray-300'
          }`}>
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
              accessibility.screenReaderEnabled ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </div>
        </CardContent>
      </Card>

      {/* Color Blind Mode */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Eye className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">
              {language === 'id' ? 'Mode Buta Warna' : language === 'su' ? 'Mode Buta Warna' : 'Color Blind Mode'}
            </h3>
          </div>
          <div className="space-y-2">
            {(['none', 'protanopia', 'deuteranopia', 'tritanopia'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => handleColorblindMode(mode)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-colors ${
                  accessibility.colorblindMode === mode
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30'
                }`}
              >
                <span className="text-sm font-medium text-foreground">{colorblindLabels[mode]}</span>
                {accessibility.colorblindMode === mode && (
                  <Badge className="bg-primary text-white">
                    {language === 'id' ? 'Aktif' : language === 'su' ? 'Aktif' : 'Active'}
                  </Badge>
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            {language === 'id'
              ? 'Pilih mode untuk kesuksesan membedakan warna'
              : language === 'su'
              ? 'Pilih mode pikeun kasuksesan ngabédakan warna'
              : 'Choose a mode to improve color differentiation'}
          </p>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground mb-2">
            {language === 'id' ? 'Tentang' : language === 'su' ? 'Ngeunaan' : 'About'}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">RakyatBanjir v1.0</p>
          <p className="text-xs text-muted-foreground">
            {language === 'id'
              ? 'Alat koordinasi peringatan banjir untuk pemimpin RT'
              : language === 'su'
              ? 'Alat koordinasi panggeuing banjir pikeun pamimpin RT'
              : 'Flood warning coordination tool for RT leaders'}
          </p>
        </CardContent>
      </Card>

      <div className="pb-4" />
    </div>
  )
}
