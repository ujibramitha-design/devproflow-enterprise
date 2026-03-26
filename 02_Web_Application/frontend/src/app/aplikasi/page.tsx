"use client"

import { useState, useEffect } from "react"
import { 
  FileText, 
  User, 
  CheckCircle2, 
  Upload, 
  ChevronRight, 
  ChevronLeft,
  ShieldCheck,
  CreditCard,
  Building2,
  AlertCircle,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Format } from "@/lib/global-store"

const steps = [
  { id: 1, title: "Personal Data", icon: User },
  { id: 2, title: "NIK Verification", icon: ShieldCheck },
  { id: 3, title: "Document Upload", icon: Upload },
  { id: 4, title: "Loan Details", icon: CreditCard },
]

export default function KprApplicationPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [units, setUnits] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true)
      try {
        const apiBase = (process.env.NEXT_PUBLIC_API_URL || "https://devproflow.com/api").replace(/\/+$/, "")
        const [unitsRes, applicationsRes] = await Promise.all([
          fetch(`${apiBase}/units`, { cache: "no-store" }),
          fetch(`${apiBase}/applications`, { cache: "no-store" }),
        ])
        if (!unitsRes.ok) {
          throw new Error(`Failed to fetch units: HTTP ${unitsRes.status}`)
        }
        if (!applicationsRes.ok) {
          throw new Error(`Failed to fetch applications: HTTP ${applicationsRes.status}`)
        }
        const unitsPayload: unknown = await unitsRes.json()
        const applicationsPayload: unknown = await applicationsRes.json()
        const unitsRows: any[] = Array.isArray(unitsPayload)
          ? unitsPayload
          : Array.isArray((unitsPayload as any)?.data)
            ? (unitsPayload as any).data
            : []
        const applicationsRows: any[] = Array.isArray(applicationsPayload)
          ? applicationsPayload
          : Array.isArray((applicationsPayload as any)?.data)
            ? (applicationsPayload as any).data
            : []
        const mappedUnits = unitsRows.map((unit, index) => ({
          ...unit,
          no: unit.no ?? index + 1,
          status_unit: unit.status_unit ?? unit.status ?? "AVAILABLE",
          siteplan: unit.siteplan ?? unit.project ?? unit.project_name ?? "—",
          blok: unit.blok ?? unit.block ?? "",
          nomor: unit.nomor ?? unit.number ?? unit.unit_number ?? "",
          tipe_unit: unit.tipe_unit ?? unit.unit_type ?? unit.type ?? "—",
          jenis_produk: unit.jenis_produk ?? unit.product_type ?? unit.tipe_unit ?? unit.unit_type ?? "—",
          harga_jual_dpp: unit.harga_jual_dpp ?? unit.price ?? unit.unit_price ?? 0,
        }))
        setUnits(mappedUnits)
        setApplications(applicationsRows)
      } finally {
        setLoading(false)
      }
    }
    fetchInitialData()
  }, [])

  // Get available units for selection
  const availableUnits = units.filter(r => {
    const status = r.status_unit ? String(r.status_unit).toUpperCase() : ""
    return ["AVAILABLE", "TERSEDIA"].includes(status)
  }).slice(0, 10)

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

  const handleVerify = () => {
    setIsVerifying(true)
    setTimeout(() => {
      setIsVerifying(false)
      setIsVerified(true)
    }, 2000)
  }

  return (
    <div className="flex flex-col gap-8 devpro-animate-fade-in bg-devpro-navy min-h-screen">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black tracking-tight text-devpro-text-primary uppercase">
          New KPR <span className="text-devpro-neon">Application</span>
        </h2>
        <p className="text-devpro-text-secondary font-medium uppercase tracking-tighter text-sm">
          Multi-step submission process for enterprise housing loans
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between max-w-4xl mx-auto w-full mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2 relative">
              <div className={cn(
                "size-12 rounded-xl flex items-center justify-center border-2 transition-all duration-500 shadow-lg",
                currentStep >= step.id 
                  ? "bg-devpro-neon border-devpro-neon text-devpro-navy shadow-[0_0_15px_rgba(0,255,204,0.4)]" 
                  : "bg-devpro-charcoal border-devpro-slate/50 text-devpro-text-secondary"
              )}>
                <step.icon className="size-6" strokeWidth={currentStep >= step.id ? 2.5 : 2} />
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest absolute -bottom-6 whitespace-nowrap",
                currentStep >= step.id ? "text-devpro-neon" : "text-devpro-text-secondary/50"
              )}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "h-1 flex-1 mx-4 rounded-full transition-all duration-500",
                currentStep > step.id ? "bg-devpro-neon shadow-[0_0_10px_rgba(0,255,204,0.3)]" : "bg-devpro-charcoal"
              )} />
            )}
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto w-full mt-4">
        <Card className="bg-devpro-charcoal border-devpro-slate/30 shadow-2xl overflow-hidden">
          <div className="h-1 w-full bg-devpro-neon/30" />
          <CardHeader className="px-8 pt-8 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black text-devpro-text-primary uppercase tracking-wider">
                  Step {currentStep}: {steps.find(s => s.id === currentStep)?.title}
                </CardTitle>
                <CardDescription className="text-devpro-text-secondary mt-1">
                  Please provide accurate information for system verification.
                </CardDescription>
              </div>
              <Badge className="bg-devpro-navy text-devpro-neon border-devpro-neon/30 px-3 py-1 text-[10px] font-black tracking-widest uppercase">
                {applications.length} Applications
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="px-8 py-6">
            {currentStep === 1 && (
              <div className="grid gap-6 devpro-animate-slide-in">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-devpro-text-secondary">Full Name (As per KTP)</Label>
                    <Input className="bg-devpro-navy border-devpro-slate/50 text-devpro-text-primary focus:border-devpro-neon/50 rounded-xl" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-devpro-text-secondary">Email Address</Label>
                    <Input className="bg-devpro-navy border-devpro-slate/50 text-devpro-text-primary focus:border-devpro-neon/50 rounded-xl" type="email" placeholder="john@enterprise.com" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-devpro-text-secondary">Phone Number</Label>
                    <Input className="bg-devpro-navy border-devpro-slate/50 text-devpro-text-primary focus:border-devpro-neon/50 rounded-xl" placeholder="+62 812 XXXX XXXX" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-devpro-text-secondary">Occupation</Label>
                    <Input className="bg-devpro-navy border-devpro-slate/50 text-devpro-text-primary focus:border-devpro-neon/50 rounded-xl" placeholder="Software Engineer" />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8 devpro-animate-slide-in">
                <div className="p-6 rounded-xl bg-devpro-navy border border-devpro-slate/50 flex flex-col items-center text-center gap-4">
                  <div className={cn(
                    "size-16 rounded-full flex items-center justify-center transition-all duration-500",
                    isVerified ? "bg-devpro-emerald/20 text-devpro-emerald border-2 border-devpro-emerald" : "bg-devpro-neon/10 text-devpro-neon border-2 border-devpro-neon/30"
                  )}>
                    {isVerified ? <CheckCircle2 className="size-8" /> : <ShieldCheck className="size-8" />}
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-devpro-text-primary uppercase tracking-tight">Biometric NIK Verification</h4>
                    <p className="text-xs text-devpro-text-secondary mt-1 max-w-sm">Secure connection to national registry for instant identity validation.</p>
                  </div>
                  <div className="w-full max-w-sm space-y-4">
                    <div className="space-y-2 text-left">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-devpro-text-secondary">National ID Number (NIK)</Label>
                      <Input 
                        className="bg-devpro-charcoal border-devpro-slate/50 text-devpro-text-primary focus:border-devpro-neon/50 rounded-xl text-center text-lg tracking-[0.3em] font-black" 
                        placeholder="3201XXXXXXXXXXXX" 
                        maxLength={16}
                      />
                    </div>
                    <Button 
                      onClick={handleVerify}
                      disabled={isVerifying || isVerified}
                      className={cn(
                        "w-full h-12 rounded-xl font-black uppercase tracking-widest transition-all",
                        isVerified 
                          ? "bg-devpro-emerald text-devpro-navy" 
                          : "bg-devpro-neon text-devpro-navy hover:scale-[1.02] shadow-[0_0_20px_rgba(0,255,204,0.3)]"
                      )}
                    >
                      {isVerifying ? "Verifying Registry..." : isVerified ? "Verification Successful" : "Run Security Check"}
                    </Button>
                  </div>
                </div>
                {isVerified && (
                  <div className="p-4 rounded-lg bg-devpro-emerald/5 border border-devpro-emerald/20 flex items-center gap-3 text-devpro-emerald">
                    <CheckCircle2 className="size-5" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Identity Confirmed - Access Token Generated</span>
                  </div>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="grid grid-cols-2 gap-6 devpro-animate-slide-in">
                {[
                  { label: "Identity Card (KTP)", desc: "Required for legal validation" },
                  { label: "Tax Number (NPWP)", desc: "Required for financial audit" },
                  { label: "Salary Slip", desc: "Latest 3 months required" },
                  { label: "Bank Statement", desc: "Last 6 months required" },
                ].map((doc) => (
                  <div key={doc.label} className="p-5 rounded-xl bg-devpro-navy border border-devpro-slate/50 hover:border-devpro-neon/30 transition-all group cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-lg bg-devpro-charcoal text-devpro-text-secondary group-hover:text-devpro-neon transition-colors">
                        <FileText className="size-5" />
                      </div>
                      <Badge className="bg-devpro-charcoal text-[9px] font-black uppercase tracking-tighter text-devpro-text-secondary">Pending</Badge>
                    </div>
                    <h5 className="text-sm font-black text-devpro-text-primary uppercase tracking-tight">{doc.label}</h5>
                    <p className="text-[10px] text-devpro-text-secondary mt-1 font-medium">{doc.desc}</p>
                    <Button variant="ghost" className="w-full mt-4 h-9 rounded-lg border border-dashed border-devpro-slate/50 text-[10px] font-black uppercase tracking-widest text-devpro-text-secondary hover:text-devpro-neon hover:border-devpro-neon transition-all">
                      <Upload className="size-3 mr-2" /> Upload File
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6 devpro-animate-slide-in">
                <div className="p-6 rounded-xl bg-devpro-navy border border-devpro-slate/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-devpro-neon/10 text-devpro-neon border border-devpro-neon/20">
                      <Building2 className="size-5" />
                    </div>
                    <h4 className="text-base font-black text-devpro-text-primary uppercase tracking-wider">Available Units Selection</h4>
                  </div>
                  
                  {loading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="p-4 rounded-xl bg-devpro-charcoal border border-devpro-slate/50">
                          <div className="h-4 w-32 bg-muted animate-pulse rounded mb-2" />
                          <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                        </div>
                      ))}
                    </div>
                  ) : availableUnits.length > 0 ? (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {availableUnits.map((unit) => (
                        <div 
                          key={unit.no}
                          className={cn(
                            "p-4 rounded-xl border cursor-pointer transition-all",
                            selectedUnit?.no === unit.no 
                              ? "bg-devpro-neon/10 border-devpro-neon" 
                              : "bg-devpro-charcoal border-devpro-slate/50 hover:border-devpro-neon/50"
                          )}
                          onClick={() => setSelectedUnit(unit)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-black text-devpro-text-primary">
                                {unit.siteplan} - {unit.blok}{unit.nomor ? `-${unit.nomor}` : ""}
                              </p>
                              <p className="text-xs text-devpro-text-secondary">
                                {unit.tipe_unit || unit.jenis_produk} • {Format.rupiah(unit.harga_jual_dpp)}
                              </p>
                            </div>
                            {selectedUnit?.no === unit.no && (
                              <CheckCircle2 className="size-5 text-devpro-neon" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-devpro-text-secondary">
                      <Building2 className="size-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No available units at the moment</p>
                    </div>
                  )}

                  {selectedUnit && (
                    <div className="mt-6 p-4 rounded-xl bg-devpro-charcoal border border-devpro-slate/50">
                      <h5 className="text-sm font-black text-devpro-text-primary mb-4">Selected Unit Details</h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-devpro-text-secondary">Housing Project</Label>
                          <Input className="bg-devpro-navy border-devpro-slate/50 text-devpro-text-primary rounded-xl" value={selectedUnit.siteplan} readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-devpro-text-secondary">Unit Code</Label>
                          <Input className="bg-devpro-navy border-devpro-slate/50 text-devpro-text-primary rounded-xl font-mono" value={`${selectedUnit.blok}-${selectedUnit.nomor}`} readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-devpro-text-secondary">Unit Type</Label>
                          <Input className="bg-devpro-navy border-devpro-slate/50 text-devpro-text-primary rounded-xl" value={selectedUnit.tipe_unit || selectedUnit.jenis_produk} readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-devpro-text-secondary">Price</Label>
                          <Input className="bg-devpro-navy border-devpro-slate/50 text-devpro-neon font-black rounded-xl" value={Format.rupiah(selectedUnit.harga_jual_dpp)} readOnly />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4 rounded-lg bg-amber-400/5 border border-amber-400/20 flex gap-3 text-amber-400">
                  <AlertCircle className="size-5 shrink-0" />
                  <p className="text-[10px] font-medium leading-relaxed uppercase tracking-tight">
                    Final confirmation required. By proceeding, you authorize the enterprise system to transmit data to integrated bank gateways for final approval.
                  </p>
                </div>
              </div>
            )}
          </CardContent>

          <div className="px-8 py-6 border-t border-devpro-navy/50 bg-devpro-navy/20 flex items-center justify-between">
            <Button 
              onClick={prevStep}
              disabled={currentStep === 1}
              variant="outline" 
              className="rounded-xl border-devpro-slate/50 text-devpro-text-secondary hover:text-devpro-text-primary h-11 px-6 font-black uppercase tracking-widest text-xs transition-all disabled:opacity-30"
            >
              <ChevronLeft className="size-4 mr-2" /> Previous
            </Button>
            <Button 
              onClick={nextStep}
              className="rounded-xl bg-devpro-neon text-devpro-navy hover:scale-105 h-11 px-8 font-black uppercase tracking-widest text-xs transition-all shadow-[0_0_20px_rgba(0,255,204,0.3)]"
            >
              {currentStep === steps.length ? "Submit Application" : "Continue"} <ChevronRight className="size-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
