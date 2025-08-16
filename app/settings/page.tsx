"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Palette, 
  Type, 
  Layout, 
  Save, 
  RotateCcw,
  Eye,
  Moon,
  Sun,
  Monitor
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"

interface ThemeSettings {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  sidebarColor: string
  fontFamily: string
  fontSize: string
  themeMode: 'light' | 'dark' | 'auto'
  enableAnimations: boolean
  enableShadows: boolean
}

const defaultSettings: ThemeSettings = {
  primaryColor: "#3b82f6",
  secondaryColor: "#64748b",
  accentColor: "#f59e0b",
  backgroundColor: "#ffffff",
  textColor: "#1f2937",
  sidebarColor: "#f8fafc",
  fontFamily: "Inter",
  fontSize: "14px",
  themeMode: 'light',
  enableAnimations: true,
  enableShadows: true
}

const fontOptions = [
  { value: "Inter", label: "Inter" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Poppins", label: "Poppins" },
  { value: "Montserrat", label: "Montserrat" }
]

const fontSizeOptions = [
  { value: "12px", label: "Small" },
  { value: "14px", label: "Medium" },
  { value: "16px", label: "Large" },
  { value: "18px", label: "Extra Large" }
]

export default function SettingsPage() {
  const [settings, setSettings] = useState<ThemeSettings>(defaultSettings)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    const savedSettings = localStorage.getItem('dashboardSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--primary-color', settings.primaryColor)
    root.style.setProperty('--secondary-color', settings.secondaryColor)
    root.style.setProperty('--accent-color', settings.accentColor)
    root.style.setProperty('--background-color', settings.backgroundColor)
    root.style.setProperty('--text-color', settings.textColor)
    root.style.setProperty('--sidebar-color', settings.sidebarColor)
    root.style.setProperty('--font-family', settings.fontFamily)
    root.style.setProperty('--font-size', settings.fontSize)
    
    document.body.className = `theme-${settings.themeMode}`
    
    if (!settings.enableAnimations) {
      document.body.classList.add('no-animations')
    } else {
      document.body.classList.remove('no-animations')
    }
    
    if (!settings.enableShadows) {
      document.body.classList.add('no-shadows')
    } else {
      document.body.classList.remove('no-shadows')
    }
  }, [settings])

  const handleSettingChange = (key: keyof ThemeSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    localStorage.setItem('dashboardSettings', JSON.stringify(settings))
    setHasChanges(false)
  }

  const handleReset = () => {
    setSettings(defaultSettings)
    setHasChanges(true)
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground">Customize your dashboard appearance</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleSave} disabled={!hasChanges}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>

          <Tabs defaultValue="colors" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="colors">
                <Palette className="w-4 h-4 mr-2" />
                Colors
              </TabsTrigger>
              <TabsTrigger value="typography">
                <Type className="w-4 h-4 mr-2" />
                Typography
              </TabsTrigger>
              <TabsTrigger value="layout">
                <Layout className="w-4 h-4 mr-2" />
                Layout
              </TabsTrigger>
              <TabsTrigger value="theme">
                <Sun className="w-4 h-4 mr-2" />
                Theme
              </TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Primary Colors</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={settings.primaryColor}
                          onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                          className="w-16 h-10"
                        />
                        <Input
                          value={settings.primaryColor}
                          onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                          placeholder="#3b82f6"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="secondaryColor">Secondary Color</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={settings.secondaryColor}
                          onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
                          className="w-16 h-10"
                        />
                        <Input
                          value={settings.secondaryColor}
                          onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
                          placeholder="#64748b"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="accentColor">Accent Color</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="accentColor"
                          type="color"
                          value={settings.accentColor}
                          onChange={(e) => handleSettingChange('accentColor', e.target.value)}
                          className="w-16 h-10"
                        />
                        <Input
                          value={settings.accentColor}
                          onChange={(e) => handleSettingChange('accentColor', e.target.value)}
                          placeholder="#f59e0b"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Background Colors</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="backgroundColor">Background Color</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="backgroundColor"
                          type="color"
                          value={settings.backgroundColor}
                          onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                          className="w-16 h-10"
                        />
                        <Input
                          value={settings.backgroundColor}
                          onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="sidebarColor">Sidebar Color</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="sidebarColor"
                          type="color"
                          value={settings.sidebarColor}
                          onChange={(e) => handleSettingChange('sidebarColor', e.target.value)}
                          className="w-16 h-10"
                        />
                        <Input
                          value={settings.sidebarColor}
                          onChange={(e) => handleSettingChange('sidebarColor', e.target.value)}
                          placeholder="#f8fafc"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="textColor">Text Color</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="textColor"
                          type="color"
                          value={settings.textColor}
                          onChange={(e) => handleSettingChange('textColor', e.target.value)}
                          className="w-16 h-10"
                        />
                        <Input
                          value={settings.textColor}
                          onChange={(e) => handleSettingChange('textColor', e.target.value)}
                          placeholder="#1f2937"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="typography" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Font Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="fontFamily">Font Family</Label>
                      <Select value={settings.fontFamily} onValueChange={(value) => handleSettingChange('fontFamily', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontOptions.map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              {font.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="fontSize">Font Size</Label>
                      <Select value={settings.fontSize} onValueChange={(value) => handleSettingChange('fontSize', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontSizeOptions.map((size) => (
                            <SelectItem key={size.value} value={size.value}>
                              {size.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Typography Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="space-y-4"
                      style={{ 
                        fontFamily: settings.fontFamily,
                        fontSize: settings.fontSize
                      }}
                    >
                      <div>
                        <h3 className="font-bold text-lg">Heading Example</h3>
                        <p className="text-muted-foreground">This is how your text will look with the selected font and size.</p>
                      </div>
                      <div className="space-y-2">
                        <div className="p-3 border rounded">
                          Sample card with custom font
                        </div>
                        <Button>Button with custom font</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="layout" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Layout Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableAnimations">Enable Animations</Label>
                      <p className="text-sm text-muted-foreground">Smooth transitions and hover effects</p>
                    </div>
                    <Switch
                      id="enableAnimations"
                      checked={settings.enableAnimations}
                      onCheckedChange={(checked) => handleSettingChange('enableAnimations', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableShadows">Enable Shadows</Label>
                      <p className="text-sm text-muted-foreground">Card and button shadow effects</p>
                    </div>
                    <Switch
                      id="enableShadows"
                      checked={settings.enableShadows}
                      onCheckedChange={(checked) => handleSettingChange('enableShadows', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="theme" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Theme Mode</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div 
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        settings.themeMode === 'light' ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                      onClick={() => handleSettingChange('themeMode', 'light')}
                    >
                      <Sun className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm font-medium text-center">Light</p>
                    </div>
                    
                    <div 
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        settings.themeMode === 'dark' ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                      onClick={() => handleSettingChange('themeMode', 'dark')}
                    >
                      <Moon className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm font-medium text-center">Dark</p>
                    </div>
                    
                    <div 
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        settings.themeMode === 'auto' ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                      onClick={() => handleSettingChange('themeMode', 'auto')}
                    >
                      <Monitor className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm font-medium text-center">Auto</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
