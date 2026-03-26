"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { WhatsAppService } from "@/lib/whatsapp"
import { FirebaseService } from "@/lib/firebase"
import { Search, Phone, CheckCircle, XCircle, Clock, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

interface UnitData {
  id: string
  nama_customer?: string
  tipe_unit?: string
  harga_jual_dpp?: number
  status_unit?: string
}

export function RealTimeUnits() {
  const [units, setUnits] = useState<UnitData[]>([])
  const [filteredUnits, setFilteredUnits] = useState<UnitData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "error">("connecting")

  useEffect(() => {
    // Load initial data
    loadUnits()
    
    // Set up real-time listener
    const unsubscribe = FirebaseService.onUnitsChange((data) => {
      if (data) {
        const unitsArray = Object.entries(data).map(([id, unit]: [string, any]) => ({
          id,
          ...unit
        }))
        setUnits(unitsArray)
        setFilteredUnits(unitsArray)
        setConnectionStatus("connected")
      } else {
        setUnits([])
        setFilteredUnits([])
      }
      setLoading(false)
    })

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

  useEffect(() => {
    // Filter units based on search term
    if (searchTerm) {
      const filtered = units.filter(unit => 
        unit.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (unit.nama_customer && unit.nama_customer.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (unit.tipe_unit && unit.tipe_unit.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (unit.status_unit && unit.status_unit.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setFilteredUnits(filtered)
    } else {
      setFilteredUnits(units)
    }
  }, [searchTerm, units])

  async function loadUnits() {
    try {
      const data = await FirebaseService.getUnits()
      if (data) {
        const unitsArray = Object.entries(data).map(([id, unit]: [string, any]) => ({
          id,
          ...unit
        }))
        setUnits(unitsArray)
        setFilteredUnits(unitsArray)
      }
    } catch (error) {
      console.error("Error loading units:", error)
      setConnectionStatus("error")
    } finally {
      setLoading(false)
    }
  }

  function getStatusColor(status: string) {
    const statusUpper = (status || "").toUpperCase()
    switch (statusUpper) {
      case "AVAILABLE":
      case "TERSEDIA":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      case "SOLD":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      case "AKAD":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
      case "CAIR":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  function getStatusIcon(status: string) {
    const statusUpper = (status || "").toUpperCase()
    switch (statusUpper) {
      case "AVAILABLE":
      case "TERSEDIA":
        return <Clock className="size-4" />
      case "SOLD":
        return <DollarSign className="size-4" />
      case "AKAD":
        return <CheckCircle className="size-4" />
      case "CAIR":
        return <CheckCircle className="size-4" />
      default:
        return <XCircle className="size-4" />
    }
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  function handleWhatsAppInquiry(unitId: string) {
    WhatsAppService.openUnitInquiry(unitId)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="size-5" />
            Real-Time Unit Catalog
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-devpro-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading units...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Search className="size-5" />
            Real-Time Unit Catalog
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              connectionStatus === "connected" ? "bg-emerald-500 animate-pulse" :
              connectionStatus === "connecting" ? "bg-amber-500 animate-pulse" :
              "bg-red-500"
            )} />
            <span className="text-xs text-muted-foreground">
              {connectionStatus === "connected" ? "Live" :
               connectionStatus === "connecting" ? "Connecting" : "Error"}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
            <Input
              placeholder="Search by unit ID, customer name, type, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Units Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredUnits.map((unit) => (
              <Card key={unit.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-devpro-primary">
                        Blok {unit.id}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {unit.tipe_unit || "36/60"}
                      </p>
                    </div>
                    <Badge className={cn("flex items-center gap-1", getStatusColor(unit.status_unit || ""))}>
                      {getStatusIcon(unit.status_unit || "")}
                      {(unit.status_unit || "AVAILABLE").toUpperCase()}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Customer:</span>
                      <span className="font-medium">
                        {unit.nama_customer || "Available"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-bold text-devpro-primary">
                        {unit.harga_jual_dpp ? formatCurrency(unit.harga_jual_dpp) : "Call for price"}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleWhatsAppInquiry(unit.id)}
                    className="w-full devpro-gradient"
                    size="sm"
                  >
                    <Phone className="size-4 mr-2" />
                    Inquire via WhatsApp
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredUnits.length === 0 && (
            <div className="text-center py-8">
              <Search className="size-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? "No units found matching your search." : "No units available."}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
