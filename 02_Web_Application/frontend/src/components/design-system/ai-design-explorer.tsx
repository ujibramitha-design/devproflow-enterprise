"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Palette, 
  Type, 
  Layout, 
  Sparkles, 
  Eye, 
  Copy, 
  Download,
  Settings,
  Zap
} from "lucide-react"
import { useAIDesignSystem, designSystemVariations } from "@/lib/ai-design-system"
import { cn } from "@/lib/utils"

export function AIDesignExplorer() {
  const { 
    currentSystem, 
    variations, 
    generateDesignSystem, 
    isGenerating,
    setCurrentSystem 
  } = useAIDesignSystem()

  const [activeTab, setActiveTab] = useState<'variations' | 'generate' | 'preview'>('variations')
  const [generationPreferences, setGenerationPreferences] = useState({
    style: 'modern' as const,
    colorScheme: 'blue' as const,
    target: 'enterprise' as const
  })

  const handleGenerateSystem = async () => {
    const newSystem = await generateDesignSystem(generationPreferences)
    console.log('Generated design system:', newSystem)
  }

  const copyCSSVariables = () => {
    const css = `
:root {
  --color-primary: ${currentSystem.colors.primary};
  --color-secondary: ${currentSystem.colors.secondary};
  --color-accent: ${currentSystem.colors.accent};
  --color-background: ${currentSystem.colors.background};
  --color-surface: ${currentSystem.colors.surface};
  --font-primary: ${currentSystem.typography.fontFamily.primary};
  --font-secondary: ${currentSystem.typography.fontFamily.secondary};
}
    `.trim()
    
    navigator.clipboard.writeText(css)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-devpro-foreground">AI Design System Explorer</h2>
          <p className="text-devpro-muted-foreground">Generate and explore design system variations with AI</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Sparkles className="size-3" />
            AI Powered
          </Badge>
          <Badge variant="secondary">{currentSystem.name}</Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-devpro-background rounded-lg">
        <Button
          variant={activeTab === 'variations' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('variations')}
          className="flex items-center gap-2"
        >
          <Palette className="size-4" />
          Variations
        </Button>
        <Button
          variant={activeTab === 'generate' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('generate')}
          className="flex items-center gap-2"
        >
          <Zap className="size-4" />
          Generate
        </Button>
        <Button
          variant={activeTab === 'preview' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('preview')}
          className="flex items-center gap-2"
        >
          <Eye className="size-4" />
          Preview
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === 'variations' && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {variations.map((system, index) => (
              <Card 
                key={system.name}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
                  currentSystem.name === system.name && "ring-2 ring-devpro-primary"
                )}
                onClick={() => setCurrentSystem(system)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{system.name}</CardTitle>
                    <div className="flex gap-1">
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: system.colors.primary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: system.colors.secondary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: system.colors.accent }}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="text-xs text-devpro-muted-foreground">
                      Font: {system.typography.fontFamily.primary.split(',')[0].replace(/"/g, '')}
                    </div>
                    <div className="flex gap-2">
                      <div 
                        className="w-6 h-6 rounded"
                        style={{ 
                          backgroundColor: system.colors.background,
                          border: `1px solid ${system.colors.text.muted}`
                        }}
                      />
                      <div 
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: system.colors.surface }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'generate' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="size-5" />
                AI Generation Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Style</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['modern', 'classic', 'minimal', 'bold'].map((style) => (
                    <Button
                      key={style}
                      variant={generationPreferences.style === style ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setGenerationPreferences(prev => ({ 
                        ...prev, 
                        style: style as any 
                      }))}
                    >
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Color Scheme</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {['blue', 'green', 'purple', 'orange', 'dark'].map((scheme) => (
                    <Button
                      key={scheme}
                      variant={generationPreferences.colorScheme === scheme ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setGenerationPreferences(prev => ({ 
                        ...prev, 
                        colorScheme: scheme as any 
                      }))}
                    >
                      {scheme.charAt(0).toUpperCase() + scheme.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Target</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['dashboard', 'mobile', 'enterprise', 'startup'].map((target) => (
                    <Button
                      key={target}
                      variant={generationPreferences.target === target ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setGenerationPreferences(prev => ({ 
                        ...prev, 
                        target: target as any 
                      }))}
                    >
                      {target.charAt(0).toUpperCase() + target.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleGenerateSystem}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4 mr-2" />
                    Generate Design System
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'preview' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="size-5" />
                  {currentSystem.name}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyCSSVariables}>
                    <Copy className="size-4 mr-2" />
                    Copy CSS
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="size-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Color Palette */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Palette className="size-5" />
                  Color Palette
                </h3>
                <div className="grid gap-3">
                  {Object.entries(currentSystem.colors).map(([key, value]) => {
                    if (key === 'text') return null
                    return (
                      <div key={key} className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-lg border"
                          style={{ backgroundColor: value as string }}
                        />
                        <div className="flex-1">
                          <div className="font-medium capitalize">{key}</div>
                          <div className="text-sm text-devpro-muted-foreground">{value as string}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Typography */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Type className="size-5" />
                  Typography
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="font-medium">Primary Font</div>
                    <div className="text-sm text-devpro-muted-foreground">
                      {currentSystem.typography.fontFamily.primary}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Secondary Font</div>
                    <div className="text-sm text-devpro-muted-foreground">
                      {currentSystem.typography.fontFamily.secondary}
                    </div>
                  </div>
                </div>
              </div>

              {/* Component Preview */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Layout className="size-5" />
                  Component Preview
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button 
                      style={{ 
                        backgroundColor: currentSystem.colors.primary,
                        borderRadius: currentSystem.components.button.borderRadius,
                        padding: currentSystem.components.button.padding,
                        fontSize: currentSystem.components.button.fontSize,
                        fontWeight: currentSystem.components.button.fontWeight,
                        transition: currentSystem.components.button.transition
                      }}
                    >
                      Primary Button
                    </Button>
                    <Button 
                      variant="outline"
                      style={{ 
                        borderColor: currentSystem.colors.primary,
                        color: currentSystem.colors.primary,
                        borderRadius: currentSystem.components.button.borderRadius,
                        padding: currentSystem.components.button.padding,
                        fontSize: currentSystem.components.button.fontSize,
                        fontWeight: currentSystem.components.button.fontWeight,
                        transition: currentSystem.components.button.transition
                      }}
                    >
                      Secondary Button
                    </Button>
                  </div>
                  
                  <Card 
                    style={{
                      backgroundColor: currentSystem.colors.surface,
                      borderRadius: currentSystem.components.card.borderRadius,
                      padding: currentSystem.components.card.padding,
                      boxShadow: currentSystem.components.card.shadow,
                      border: currentSystem.components.card.border
                    }}
                  >
                    <div style={{ color: currentSystem.colors.text.primary }}>
                      <h4 className="font-semibold mb-2">Sample Card</h4>
                      <p style={{ color: currentSystem.colors.text.secondary }}>
                        This is how a card component would look with this design system.
                      </p>
                    </div>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
