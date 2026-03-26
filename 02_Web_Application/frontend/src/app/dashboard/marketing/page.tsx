"use client"

import { useEffect, useState } from "react"
import { Zap, Target, Users, TrendingUp, BarChart3, Megaphone, AlertCircle, Loader2, CheckCircle, Map, Search, RefreshCw, MessageSquare, Diamond, Phone, Grid3x3, Package, Edit } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useGlobalData, Format } from "@/lib/global-store"
import { HoverScale, FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/page-transition"
import { DsSkeletonCard } from "@/components/ui/ds-skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MarketingPanelPage() {
  const { loading, error, fetchAllData, data: units } = useGlobalData()

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  // Marketing metrics from global data
  const marketingMetrics = {
    totalLeads: units.length,
    soldUnits: units.filter(r => r.status_unit && ["SOLD","TERJUAL"].includes(String(r.status_unit).toUpperCase())).length,
    conversionRate: units.length > 0 ? ((units.filter(r => r.status_unit && ["SOLD","TERJUAL"].includes(String(r.status_unit).toUpperCase())).length / units.length) * 100) : 0,
    activeSales: new Set(units.map(r => r.sales_koordinator).filter(Boolean)).size,
  }

  // Sales coordinator distribution
  const salesDistribution = units.reduce((acc, r) => {
    const sales = String(r.sales_koordinator || "Unknown")
    acc[sales] = (acc[sales] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Source distribution
  const sourceDistribution = units.reduce((acc, r) => {
    const source = String(r.sumber || "Unknown")
    acc[source] = (acc[source] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Payment method distribution
  const paymentDistribution = units.reduce((acc, r) => {
    const payment = String(r.payment_method || "Unknown")
    acc[payment] = (acc[payment] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Generate campaign data from actual sales performance
  const campaigns = Object.entries(salesDistribution).slice(0, 5).map(([sales, count], i) => {
    const soldCount = units.filter(r => r.sales_koordinator === sales && ["SOLD","TERJUAL"].includes(String(r.status_unit || "").toUpperCase())).length
    const conversionRate = count > 0 ? (soldCount / count) * 100 : 0
    
    return {
      id: `M-${String(i + 101).padStart(3, '0')}`,
      name: `Sales: ${sales}`,
      reach: String(count),
      conversions: String(soldCount),
      status: count > 0 ? "Active" : "Scheduled",
      conversionRate: conversionRate.toFixed(1),
    }
  })

  const statsCards = [
    { label: "Total Leads", value: loading ? "—" : String(marketingMetrics.totalLeads), icon: Users, color: "text-devpro-emerald" },
    { label: "Sold Units", value: loading ? "—" : String(marketingMetrics.soldUnits), icon: Target, color: "text-devpro-neon" },
    { label: "Conversion Rate", value: loading ? "—" : `${marketingMetrics.conversionRate.toFixed(1)}%`, icon: TrendingUp, color: "text-devpro-neon" },
  ]

  // Marketing Dashboard states
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [waDialogOpen, setWaDialogOpen] = useState(false);
  const [waMessage, setWaMessage] = useState('');
  const [siteplanDialogOpen, setSiteplanDialogOpen] = useState(false);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('');
  const [generating, setGenerating] = useState(false);

  // Marketing functions
  const handleBookingConfirm = (lead: any) => {
    setSelectedLead(lead);
    setBookingDialogOpen(true);
  };

  const handleWAMock = () => {
    setWaMessage(`🏡 *Selamat Datang di [Nama Proyek]!* 🏡\n\nTerima kasih telah melakukan booking. Kami siap membantu Anda mendapatkan rumah impian.\n\n📞 *Butuh bantuan?*\nHubungi marketing kami sekarang!\n\n📍 *Lokasi:* [Alamat Proyek]\n🌐 *Website:* www.example.com\n`);
    setWaDialogOpen(true);
  };

  const handleSiteplanView = () => {
    setSiteplanDialogOpen(true);
  };

  const handleStockCheck = () => {
    setStockDialogOpen(true);
  };

  const handleStatusUpdate = (unit: any) => {
    setSelectedUnit(unit);
    setStatusDialogOpen(true);
  };

  const handleSendWA = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setWaDialogOpen(false);
      // Show success notification
    }, 2000);
  };

  const handleConfirmBooking = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setBookingDialogOpen(false);
      // Show success notification
    }, 2000);
  };

  const handleUpdateStatus = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setStatusDialogOpen(false);
      // Show success notification
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-8 devpro-animate-fade-in bg-devpro-navy min-h-screen">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black tracking-tight text-devpro-text-primary uppercase">
          Marketing <span className="text-devpro-neon">Panel</span>
        </h2>
        <p className="text-devpro-text-secondary font-medium uppercase tracking-tighter text-sm">
          Enterprise campaign management and lead tracking
        </p>
      </div>

      {/* ── Error Banner ───────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-rose-500/30 bg-rose-500/10">
          <AlertCircle className="size-4 text-rose-400 mt-0.5 shrink-0" />
          <p className="text-xs text-rose-300 leading-relaxed">{error}</p>
        </div>
      )}

      {/* ── Action Hub ───────────────────────────────────────────────────────── */}
      <Card className="bg-devpro-charcoal border-devpro-slate/30 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-black uppercase tracking-wider text-devpro-text-primary flex items-center gap-2">
            <Zap className="size-4 text-devpro-neon" />
            Marketing Action Hub
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-5">
            <Button
              onClick={handleBookingConfirm}
              className="bg-devpro-neon text-devpro-navy hover:bg-devpro-neon/90 font-bold text-xs h-auto py-3 flex flex-col gap-2"
            >
              <CheckCircle className="size-5" />
              <span>Booking Confirm</span>
            </Button>
            <Button
              onClick={handleWAMock}
              variant="outline"
              className="border-devpro-slate/50 text-devpro-text-secondary hover:bg-devpro-slate/20 hover:text-devpro-neon font-bold text-xs h-auto py-3 flex flex-col gap-2"
            >
              <MessageSquare className="size-5" />
              <span>WA Mock</span>
            </Button>
            <Button
              onClick={handleSiteplanView}
              variant="outline"
              className="border-devpro-slate/50 text-devpro-text-secondary hover:bg-devpro-slate/20 hover:text-devpro-neon font-bold text-xs h-auto py-3 flex flex-col gap-2"
            >
              <Map className="size-5" />
              <span>Siteplan</span>
            </Button>
            <Button
              onClick={handleStockCheck}
              variant="outline"
              className="border-devpro-slate/50 text-devpro-text-secondary hover:bg-devpro-slate/20 hover:text-devpro-neon font-bold text-xs h-auto py-3 flex flex-col gap-2"
            >
              <Search className="size-5" />
              <span>Stock Check</span>
            </Button>
            <Button
              onClick={handleStatusUpdate}
              variant="outline"
              className="border-devpro-slate/50 text-devpro-text-secondary hover:bg-devpro-slate/20 hover:text-devpro-neon font-bold text-xs h-auto py-3 flex flex-col gap-2"
            >
              <RefreshCw className="size-5" />
              <span>Status Update</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Stats Cards (Live Data) ─────────────────────────────────────────────── */}
      <div className="grid gap-6 md:grid-cols-3">
        {statsCards.map((stat) => (
          <Card key={stat.label} className="bg-devpro-charcoal border-devpro-slate/30 shadow-xl group hover:border-devpro-neon/30 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-devpro-text-secondary">{stat.label}</CardTitle>
              <stat.icon className={cn("size-4", stat.color)} />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              ) : (
                <div className="text-2xl font-black text-devpro-text-primary">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Marketing Action Buttons ─────────────────────────────────────────── */}
      <FadeIn delay={0.3}>
        <Card className="bg-devpro-charcoal border-devpro-slate/30 shadow-xl overflow-hidden">
          <CardHeader className="bg-devpro-navy/50 border-b border-devpro-slate/30">
            <CardTitle className="text-devpro-neon font-black uppercase tracking-wider text-lg flex items-center gap-2">
              <Zap className="size-5" />
              Marketing Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <StaggerItem>
                <HoverScale>
                  <Button
                    onClick={() => handleBookingConfirm({ id: 1, name: 'John Doe', phone: '+62812345678' })}
                    className="w-full h-auto py-4 px-6 bg-gradient-to-r from-devpro-emerald to-devpro-neon hover:from-devpro-emerald/90 hover:to-devpro-neon/90 text-devpro-navy font-black text-sm flex flex-col gap-2 shadow-lg hover:shadow-devpro-neon/25 transition-all"
                  >
                    <Diamond className="size-6" />
                    <span>💎 Konfirmasi Booking</span>
                    <span className="text-xs font-normal opacity-80">Lead to Unit</span>
                  </Button>
                </HoverScale>
              </StaggerItem>
              
              <StaggerItem>
                <HoverScale>
                  <Button
                    onClick={handleWAMock}
                    className="w-full h-auto py-4 px-6 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-black text-sm flex flex-col gap-2 shadow-lg hover:shadow-green-500/25 transition-all"
                  >
                    <Phone className="size-6" />
                    <span>📱 Kirim Welcome Message</span>
                    <span className="text-xs font-normal opacity-80">WhatsApp Mockup</span>
                  </Button>
                </HoverScale>
              </StaggerItem>
              
              <StaggerItem>
                <HoverScale>
                  <Button
                    onClick={handleSiteplanView}
                    className="w-full h-auto py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black text-sm flex flex-col gap-2 shadow-lg hover:shadow-blue-500/25 transition-all"
                  >
                    <Grid3x3 className="size-6" />
                    <span>🗺️ Buka Siteplan Interaktif</span>
                    <span className="text-xs font-normal opacity-80">Live View</span>
                  </Button>
                </HoverScale>
              </StaggerItem>
              
              <StaggerItem>
                <HoverScale>
                  <Button
                    onClick={handleStockCheck}
                    className="w-full h-auto py-4 px-6 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-black text-sm flex flex-col gap-2 shadow-lg hover:shadow-purple-500/25 transition-all"
                  >
                    <Package className="size-6" />
                    <span>📊 Cek Stok Unit & Progress</span>
                    <span className="text-xs font-normal opacity-80">Site Status</span>
                  </Button>
                </HoverScale>
              </StaggerItem>
              
              <StaggerItem>
                <HoverScale>
                  <Button
                    onClick={() => handleStatusUpdate({ id: 'A1', status: 'Available' })}
                    className="w-full h-auto py-4 px-6 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-black text-sm flex flex-col gap-2 shadow-lg hover:shadow-orange-500/25 transition-all"
                  >
                    <Edit className="size-6" />
                    <span>✅ Update Status Unit</span>
                    <span className="text-xs font-normal opacity-80">Bulk Update</span>
                  </Button>
                </HoverScale>
              </StaggerItem>
            </StaggerContainer>
          </CardContent>
        </Card>
      </FadeIn>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-devpro-charcoal border-devpro-slate/30 shadow-xl overflow-hidden">
          <CardHeader className="px-6 py-4 border-b border-devpro-navy/50">
            <CardTitle className="text-sm font-black uppercase tracking-wider text-devpro-text-primary">Sales Performance</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-devpro-navy/30">
                    <th className="px-6 py-3 text-left text-[10px] font-black text-devpro-text-secondary uppercase">Campaign ID</th>
                    <th className="px-6 py-3 text-left text-[10px] font-black text-devpro-text-secondary uppercase">Sales</th>
                    <th className="px-6 py-3 text-left text-[10px] font-black text-devpro-text-secondary uppercase">Leads</th>
                    <th className="px-6 py-3 text-left text-[10px] font-black text-devpro-text-secondary uppercase">Sold</th>
                    <th className="px-6 py-3 text-left text-[10px] font-black text-devpro-text-secondary uppercase">Conv.</th>
                    <th className="px-6 py-3 text-left text-[10px] font-black text-devpro-text-secondary uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-t border-devpro-navy/50">
                        <td className="px-6 py-4"><div className="h-4 w-16 bg-muted animate-pulse rounded" /></td>
                        <td className="px-6 py-4"><div className="h-4 w-24 bg-muted animate-pulse rounded" /></td>
                        <td className="px-6 py-4"><div className="h-4 w-16 bg-muted animate-pulse rounded" /></td>
                        <td className="px-6 py-4"><div className="h-4 w-16 bg-muted animate-pulse rounded" /></td>
                        <td className="px-6 py-4"><div className="h-4 w-12 bg-muted animate-pulse rounded" /></td>
                        <td className="px-6 py-4"><div className="h-4 w-20 bg-muted animate-pulse rounded" /></td>
                      </tr>
                    ))
                  ) : campaigns.length > 0 ? (
                    campaigns.map((campaign) => (
                      <tr key={campaign.id} className="border-t border-devpro-navy/50 hover:bg-devpro-navy/40 transition-colors">
                        <td className="px-6 py-4 text-[11px] font-black text-devpro-neon font-mono">{campaign.id}</td>
                        <td className="px-6 py-4 text-xs font-bold text-devpro-text-primary">{campaign.name}</td>
                        <td className="px-6 py-4 text-xs font-medium text-devpro-text-secondary">{campaign.reach}</td>
                        <td className="px-6 py-4 text-xs font-bold text-devpro-neon">{campaign.conversions}</td>
                        <td className="px-6 py-4 text-xs font-bold text-devpro-neon">{campaign.conversionRate}%</td>
                        <td className="px-6 py-4">
                          <Badge className={cn(
                            "text-[9px] font-black uppercase px-2 py-0.5",
                            campaign.status === "Active" ? "bg-devpro-neon/10 text-devpro-neon border border-devpro-neon/20" : "bg-devpro-navy text-devpro-text-secondary"
                          )}>
                            {campaign.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-sm text-devpro-text-secondary">
                        {error ? "Gagal memuat data" : "Belum ada data sales"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-devpro-charcoal border-devpro-slate/30 shadow-xl">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-wider text-devpro-text-primary">Lead Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-8 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              ) : (
                <>
                  <div>
                    <h4 className="text-xs font-bold text-devpro-text-secondary mb-2">By Sales Coordinator</h4>
                    <div className="space-y-2">
                      {Object.entries(salesDistribution).slice(0, 4).map(([sales, count]) => (
                        <div key={sales} className="flex justify-between items-center">
                          <span className="text-sm font-medium">{sales}</span>
                          <span className="text-sm font-bold text-devpro-primary">{count} leads</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-devpro-text-secondary mb-2">By Source</h4>
                    <div className="space-y-2">
                      {Object.entries(sourceDistribution).slice(0, 4).map(([source, count]) => (
                        <div key={source} className="flex justify-between items-center">
                          <span className="text-sm font-medium">{source}</span>
                          <span className="text-sm font-bold text-devpro-primary">{count} leads</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-devpro-text-secondary mb-2">By Payment Method</h4>
                    <div className="space-y-2">
                      {Object.entries(paymentDistribution).slice(0, 4).map(([payment, count]) => (
                        <div key={payment} className="flex justify-between items-center">
                          <span className="text-sm font-medium">{payment}</span>
                          <span className="text-sm font-bold text-devpro-primary">{count} leads</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Booking Confirmation Dialog ─────────────────────────────────────── */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="bg-devpro-charcoal border-devpro-slate/30 text-devpro-text-primary max-w-md">
          <DialogHeader>
            <DialogTitle className="text-devpro-neon font-black text-lg">💎 Konfirmasi Booking</DialogTitle>
            <DialogDescription className="text-devpro-text-secondary">
              Konfirmasi booking lead ke unit yang tersedia.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-devpro-navy/30 p-4 rounded-lg border border-devpro-slate/30">
              <h4 className="font-bold text-devpro-text-primary mb-2">Detail Lead</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-devpro-text-secondary">Nama:</span>
                  <span className="font-medium">{selectedLead?.name || 'John Doe'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-devpro-text-secondary">Telepon:</span>
                  <span className="font-medium">{selectedLead?.phone || '+62812345678'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-devpro-text-secondary">Status:</span>
                  <Badge className="bg-devpro-emerald text-devpro-navy">Hot Lead</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-devpro-text-secondary">Pilih Unit</Label>
              <Select>
                <SelectTrigger className="bg-devpro-navy/30 border-devpro-slate/30 text-devpro-text-primary">
                  <SelectValue placeholder="Pilih unit tersedia" />
                </SelectTrigger>
                <SelectContent className="bg-devpro-charcoal border-devpro-slate/30">
                  <SelectItem value="A1">Unit A1 - Type 36/72</SelectItem>
                  <SelectItem value="B2">Unit B2 - Type 45/84</SelectItem>
                  <SelectItem value="C3">Unit C3 - Type 54/108</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setBookingDialogOpen(false)} className="border-devpro-slate/50 text-devpro-text-secondary">
              Batal
            </Button>
            <Button onClick={handleConfirmBooking} disabled={generating} className="bg-devpro-emerald hover:bg-devpro-emerald/90 text-devpro-navy font-bold">
              {generating ? 'Mengkonfirmasi...' : '✅ Konfirmasi Booking'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── WhatsApp Message Dialog ─────────────────────────────────────────── */}
      <Dialog open={waDialogOpen} onOpenChange={setWaDialogOpen}>
        <DialogContent className="bg-devpro-charcoal border-devpro-slate/30 text-devpro-text-primary max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-green-400 font-black text-lg">📱 WhatsApp Message Mockup</DialogTitle>
            <DialogDescription className="text-devpro-text-secondary">
              Simulasi pesan WhatsApp yang akan dikirim ke customer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-green-600/10 p-4 rounded-lg border border-green-600/30">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <Phone className="size-4 text-white" />
                </div>
                <div>
                  <div className="font-bold text-green-400">WhatsApp Business</div>
                  <div className="text-xs text-devpro-text-secondary">+62812345678</div>
                </div>
              </div>
              <div className="bg-devpro-navy/30 p-3 rounded-lg text-sm whitespace-pre-line text-devpro-text-primary">
                {waMessage}
              </div>
            </div>
            
            <div className="text-xs text-devpro-text-secondary">
              <p>📝 Pesan akan dikirim ke:</p>
              <p className="font-medium">• John Doe (+62812345678)</p>
              <p>• Jane Smith (+62898765432)</p>
              <p>• 3 leads lainnya</p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setWaDialogOpen(false)} className="border-devpro-slate/50 text-devpro-text-secondary">
              Batal
            </Button>
            <Button onClick={handleSendWA} disabled={generating} className="bg-green-600 hover:bg-green-500 text-white font-bold">
              {generating ? 'Mengirim...' : '📱 Kirim Sekarang'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Siteplan Interactive Dialog ─────────────────────────────────────── */}
      <Dialog open={siteplanDialogOpen} onOpenChange={setSiteplanDialogOpen}>
        <DialogContent className="bg-devpro-charcoal border-devpro-slate/30 text-devpro-text-primary max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-blue-400 font-black text-lg">🗺️ Siteplan Interaktif (Live)</DialogTitle>
            <DialogDescription className="text-devpro-text-secondary">
              Tampilan siteplan real-time dengan status unit.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-devpro-navy/30 p-4 rounded-lg border border-devpro-slate/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-devpro-slate/50 text-devpro-text-secondary">
                    <Grid3x3 className="size-4 mr-2" />
                    Grid View
                  </Button>
                  <Button size="sm" variant="outline" className="border-devpro-slate/50 text-devpro-text-secondary">
                    <Map className="size-4 mr-2" />
                    Map View
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-devpro-slate/50 text-devpro-text-secondary">
                    <ZoomIn className="size-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-devpro-slate/50 text-devpro-text-secondary">
                    <ZoomOut className="size-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-8 gap-2 p-4 bg-devpro-navy/20 rounded">
                {Array.from({ length: 32 }, (_, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded flex items-center justify-center text-xs font-bold cursor-pointer transition-all
                      ${i % 7 === 0 ? 'bg-red-600/20 border-2 border-red-600 text-red-400' : 
                        i % 5 === 0 ? 'bg-devpro-emerald/20 border-2 border-devpro-emerald text-devpro-emerald' :
                        'bg-devpro-slate/20 border border-devpro-slate/50 text-devpro-text-secondary hover:border-devpro-neon/50'}
                    `}
                  >
                    {String.fromCharCode(65 + Math.floor(i / 8))}{(i % 8) + 1}
                  </div>
                ))}
              </div>
              
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-devpro-emerald/20 border border-devpro-emerald rounded"></div>
                  <span className="text-devpro-text-secondary">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-600/20 border border-red-600 rounded"></div>
                  <span className="text-devpro-text-secondary">Sold</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-devpro-slate/20 border border-devpro-slate/50 rounded"></div>
                  <span className="text-devpro-text-secondary">Reserved</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setSiteplanDialogOpen(false)} className="border-devpro-slate/50 text-devpro-text-secondary">
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Stock Check Dialog ─────────────────────────────────────────────── */}
      <Dialog open={stockDialogOpen} onOpenChange={setStockDialogOpen}>
        <DialogContent className="bg-devpro-charcoal border-devpro-slate/30 text-devpro-text-primary max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-purple-400 font-black text-lg">📊 Cek Stok Unit & Progress Site</DialogTitle>
            <DialogDescription className="text-devpro-text-secondary">
              Monitor ketersediaan unit dan progress pembangunan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-devpro-navy/30 p-4 rounded-lg border border-devpro-slate/30">
                <h4 className="font-bold text-devpro-emerald mb-2">📦 Stok Unit</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-devpro-text-secondary">Total Unit:</span>
                    <span className="font-bold">120</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-devpro-text-secondary">Available:</span>
                    <span className="font-bold text-devpro-emerald">45</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-devpro-text-secondary">Sold:</span>
                    <span className="font-bold text-red-400">68</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-devpro-text-secondary">Reserved:</span>
                    <span className="font-bold text-yellow-400">7</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-devpro-navy/30 p-4 rounded-lg border border-devpro-slate/30">
                <h4 className="font-bold text-blue-400 mb-2">🏗️ Progress Site</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-devpro-text-secondary">Overall:</span>
                    <span className="font-bold text-blue-400">78%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-devpro-text-secondary">Foundation:</span>
                    <span className="font-bold text-green-400">100%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-devpro-text-secondary">Structure:</span>
                    <span className="font-bold text-blue-400">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-devpro-text-secondary">Finishing:</span>
                    <span className="font-bold text-yellow-400">45%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-devpro-navy/30 p-4 rounded-lg border border-devpro-slate/30">
              <h4 className="font-bold text-devpro-text-primary mb-3">Unit Available by Type</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Type 36/72</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-devpro-slate/20 rounded-full h-2">
                      <div className="bg-devpro-emerald h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-xs font-bold text-devpro-emerald">18 units</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Type 45/84</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-devpro-slate/20 rounded-full h-2">
                      <div className="bg-devpro-emerald h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                    <span className="text-xs font-bold text-devpro-emerald">12 units</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Type 54/108</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-devpro-slate/20 rounded-full h-2">
                      <div className="bg-devpro-emerald h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                    <span className="text-xs font-bold text-devpro-emerald">15 units</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setStockDialogOpen(false)} className="border-devpro-slate/50 text-devpro-text-secondary">
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Status Update Dialog ───────────────────────────────────────────── */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="bg-devpro-charcoal border-devpro-slate/30 text-devpro-text-primary max-w-md">
          <DialogHeader>
            <DialogTitle className="text-orange-400 font-black text-lg">✅ Update Status Unit</DialogTitle>
            <DialogDescription className="text-devpro-text-secondary">
              Perbarui status unit secara bulk atau individual.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-devpro-navy/30 p-4 rounded-lg border border-devpro-slate/30">
              <h4 className="font-bold text-devpro-text-primary mb-2">Unit yang Dipilih</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-devpro-text-secondary">Unit:</span>
                  <span className="font-medium">{selectedUnit?.id || 'A1'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-devpro-text-secondary">Status Saat Ini:</span>
                  <Badge className="bg-devpro-emerald text-devpro-navy">Available</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-devpro-text-secondary">Status Baru</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="bg-devpro-navy/30 border-devpro-slate/30 text-devpro-text-primary">
                  <SelectValue placeholder="Pilih status baru" />
                </SelectTrigger>
                <SelectContent className="bg-devpro-charcoal border-devpro-slate/30">
                  <SelectItem value="available">✅ Available</SelectItem>
                  <SelectItem value="sold">🔴 Sold</SelectItem>
                  <SelectItem value="reserved">🟡 Reserved</SelectItem>
                  <SelectItem value="maintenance">🔧 Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-devpro-text-secondary">Catatan (Opsional)</Label>
              <Input 
                placeholder="Tambahkan catatan..."
                className="bg-devpro-navy/30 border-devpro-slate/30 text-devpro-text-primary placeholder:text-devpro-text-secondary"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)} className="border-devpro-slate/50 text-devpro-text-secondary">
              Batal
            </Button>
            <Button onClick={handleUpdateStatus} disabled={generating} className="bg-orange-600 hover:bg-orange-500 text-white font-bold">
              {generating ? 'Mengupdate...' : '✅ Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
