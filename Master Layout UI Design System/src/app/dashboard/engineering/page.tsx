"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Construction, Ruler, HardHat, Camera, Plus, MapPin, ArrowRight, AlertTriangle, CheckCircle2, Clock, Map, FileDown } from "lucide-react"
import { cn } from "@/lib/utils"

const projects = [
  { id: "PRJ-001", name: "Cluster Emerald Phase 2", units: 48, progress: 75, status: "On Track", deadline: "Dec 2026", manager: "Ir. Hendra", location: "South Area" },
  { id: "PRJ-002", name: "Skyview Tower B", units: 120, progress: 32, status: "Delayed", deadline: "Aug 2027", manager: "Archt. Siska", location: "West City" },
  { id: "PRJ-003", name: "Infrastructure Zenith", units: 0, progress: 90, status: "Finishing", deadline: "May 2026", manager: "Ir. Budi", location: "Central Hub" },
];

export default function EngineeringDashboard() {
  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-foreground uppercase">Engineering & Project</h2>
          <p className="text-muted-foreground text-sm mt-1 font-medium italic">Construction monitoring, quality control, and site logistics management.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-10 px-4 rounded-xl bg-card border border-border/40 text-xs font-bold flex items-center gap-2 shadow-sm hover:bg-secondary transition-all">
            <Camera className="size-4" /> Live Site Feed
          </button>
          <button className="h-10 px-4 rounded-xl bg-primary text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
            <Plus className="size-4" /> Add New Site
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Active Project Sites", value: "8 Sites", sub: "Operational Nationwide", icon: Construction, color: "text-indigo-500", bg: "bg-indigo-500/10" },
          { label: "National Progress Rate", value: "64.2%", sub: "Avg completion across sites", icon: Ruler, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "HSE Safety Score", value: "98.5", sub: "1.2M Safe Work Hours", icon: HardHat, color: "text-sky-500", bg: "bg-sky-500/10" },
        ].map((stat, i) => (
          <Card key={i} className="border-0 shadow-sm ring-1 ring-border/40">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={cn("size-12 rounded-2xl flex items-center justify-center", stat.bg)}>
                  <stat.icon className={cn("size-6", stat.color)} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none mb-1.5">{stat.label}</p>
                  <h3 className="text-xl font-black text-foreground leading-none tracking-tight">{stat.value}</h3>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase mt-2">{stat.sub}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-black text-xs uppercase tracking-widest text-primary flex items-center gap-2">
              <Clock className="size-4" /> Live Construction Tracking
            </h4>
          </div>
          {projects.map((prj) => (
            <Card key={prj.id} className="group hover:ring-primary/20 transition-all cursor-pointer border-0 shadow-sm ring-1 ring-border/40">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-secondary/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Construction className="size-6 text-muted-foreground/60" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-black text-sm text-foreground uppercase">{prj.name}</h5>
                        <Badge className={cn(
                          "text-[8px] font-black uppercase border-0",
                          prj.status === "On Track" ? "bg-emerald-500/10 text-emerald-600" : 
                          prj.status === "Finishing" ? "bg-sky-500/10 text-sky-600" : "bg-rose-500/10 text-rose-600"
                        )}>{prj.status}</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-medium italic">
                        <span className="flex items-center gap-1"><MapPin className="size-3" /> {prj.location}</span>
                        <span>• PM: {prj.manager}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 max-w-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Site Progress</span>
                      <span className="text-[10px] font-black text-primary">{prj.progress}%</span>
                    </div>
                    <Progress value={prj.progress} className="h-1.5" />
                  </div>
                  <div className="flex items-center gap-4 border-l border-border/20 pl-6">
                    <button className="p-2 rounded-xl bg-secondary/40 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <ArrowRight className="size-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card className="border-0 shadow-sm ring-1 ring-border/40">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-4 text-primary" />
                <CardTitle>Logistics Alerts</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="p-4 rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-500/20">
                <h5 className="font-black text-[11px] uppercase tracking-wider mb-2">Critical Supply Shortage</h5>
                <p className="text-[11px] font-bold text-rose-100 leading-relaxed italic">
                  Keterlambatan pengiriman semen di Skyview Tower B. Estimasi penundaan pengerjaan lantai 12: 3 Hari Kerja.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Project Blueprint Card - ACTIVE LAYER */}
          <Card className="overflow-hidden border-0 shadow-xl ring-1 ring-purple-500/20 bg-purple-500/5">
            <CardHeader className="bg-purple-500/10 border-b py-4">
              <div className="flex items-center gap-2">
                <Map className="size-4 text-purple-600" />
                <CardTitle className="text-purple-700">Project Blueprint</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {[
                { name: "Structural Design V2", type: "DWG" },
                { name: "Daily Site Progress Log", type: "PDF" },
                { name: "HSE Compliance Check", type: "XLSX" },
              ].map((doc, i) => (
                <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl bg-white/80 hover:bg-purple-100 transition-all group border border-purple-500/10">
                  <div className="flex items-center gap-3">
                    <FileDown className="size-4 text-purple-600" />
                    <p className="text-[10px] font-black text-foreground uppercase">{doc.name}</p>
                  </div>
                  <Badge variant="outline" className="text-[8px] bg-purple-100 border-purple-200">{doc.type}</Badge>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
