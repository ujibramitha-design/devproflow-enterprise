"use client"

import { RealTimeUnits } from "@/components/dashboard/real-time-units"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Phone, Database, Zap } from "lucide-react"

export default function UnitCatalogPage() {
  return (
    <div className="flex flex-col gap-8 devpro-animate-fade-in">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-devpro-primary/10 text-devpro-primary">
            <Building2 className="size-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-devpro-foreground">Unit Catalog</h1>
            <p className="text-devpro-muted-foreground">Real-time property listings with WhatsApp integration</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-500/10 text-emerald-600 border-0">
            <Database className="size-3 mr-1" />
            Firebase Connected
          </Badge>
          <Badge className="bg-rose-500/10 text-rose-400 border-0">
            <Phone className="size-3 mr-1" />
            WhatsApp Disabled
          </Badge>
          <Badge className="bg-amber-500/10 text-amber-600 border-0">
            <Zap className="size-3 mr-1" />
            Real-time Updates
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="size-5" />
            Customer-Facing Property Portal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-devpro-muted-foreground">
              Browse available properties in real-time. All data is synchronized directly from our Firebase database, 
              ensuring you always see the latest availability and pricing information.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-xl bg-devpro-primary/5 border border-devpro-primary/10">
                <h3 className="font-semibold text-devpro-primary mb-2">Live Inventory</h3>
                <p className="text-sm text-devpro-muted-foreground">Real-time property availability updates</p>
              </div>
              <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10">
                <h3 className="font-semibold text-rose-400 mb-2">WhatsApp Integration</h3>
                <p className="text-sm text-devpro-muted-foreground">Temporarily disabled for audit phase</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <h3 className="font-semibold text-amber-600 mb-2">Mobile Optimized</h3>
                <p className="text-sm text-devpro-muted-foreground">Perfect for on-the-go browsing</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <RealTimeUnits />
    </div>
  )
}
