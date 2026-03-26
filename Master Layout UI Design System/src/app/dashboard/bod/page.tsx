"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts'
import { Wallet, Users, Building2, TrendingUp, Download, Calendar, ArrowUpRight, BarChart2, FileDown, ShieldCheck, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const revenueData = [
  { name: 'Jan', revenue: 4200, target: 4000 },
  { name: 'Feb', revenue: 3800, target: 4000 },
  { name: 'Mar', revenue: 5100, target: 4500 },
  { name: 'Apr', revenue: 4800, target: 4500 },
  { name: 'May', revenue: 6200, target: 5000 },
  { name: 'Jun', revenue: 7500, target: 5500 },
];

const salesByEstate = [
  { name: 'Grand Emerald', value: 45 },
  { name: 'Skyview Apt', value: 25 },
  { name: 'Pine Wood', value: 20 },
  { name: 'Citra Garden', value: 10 },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

export default function BODDashboard() {
  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-foreground uppercase">Executive Analytics</h2>
          <p className="text-muted-foreground text-sm mt-1 font-medium italic">Data-driven insights for Board of Directors strategic decisions.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-10 px-4 rounded-xl bg-card border border-border/40 text-xs font-bold flex items-center gap-2 shadow-sm hover:bg-secondary transition-all">
            <Calendar className="size-4" /> Period: Jan - Jun 2026
          </button>
          <Link 
            href="/reports/view"
            className="h-10 px-4 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
          >
            <Eye className="size-4" /> View Full Report
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Gross Revenue", value: "Rp 128.4 M", trend: "+14.2%", icon: Wallet, color: "text-indigo-500", bg: "bg-indigo-500/10" },
          { label: "Active Investors", value: "1,248", trend: "+8.1%", icon: Users, color: "text-sky-500", bg: "bg-sky-500/10" },
          { label: "Realized Sales", value: "156 Units", trend: "+24.5%", icon: Building2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Net Margin", value: "18.4%", trend: "-2.1%", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10", negative: true },
        ].map((stat, i) => (
          <Card key={i} className="group hover:ring-primary/20 transition-all border-0 shadow-sm ring-1 ring-border/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("size-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg)}>
                  <stat.icon className={cn("size-6", stat.color)} />
                </div>
                <Badge className={cn("text-[10px] font-black border-0", stat.negative ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600")}>
                  {stat.trend}
                </Badge>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{stat.label}</p>
              <h3 className="text-2xl font-black text-foreground mt-1 tracking-tight">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-8">
          <CardHeader className="flex flex-row items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                <BarChart2 className="size-4" />
              </div>
              <CardTitle>Revenue vs Target Growth</CardTitle>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-indigo-500" /><span className="text-[10px] font-bold text-muted-foreground uppercase">Actual</span></div>
              <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-slate-300" /><span className="text-[10px] font-bold text-muted-foreground uppercase">Target</span></div>
            </div>
          </CardHeader>
          <CardContent className="h-[350px] w-full pb-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fontStyle: 'bold', fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fontStyle: 'bold', fill: '#94a3b8'}} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="target" stroke="#cbd5e1" strokeWidth={2} fillOpacity={0} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card className="flex flex-col border-0 shadow-sm ring-1 ring-border/40">
            <CardHeader className="pb-2">
              <CardTitle>Estate Contribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={salesByEstate} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={8} dataKey="value">
                      {salesByEstate.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2.5 mt-4">
                {salesByEstate.map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-secondary/20 hover:bg-secondary/40 transition-all group cursor-default">
                    <div className="flex items-center gap-2.5">
                      <div className="size-2 rounded-full" style={{ background: COLORS[i] }} />
                      <span className="text-[10px] font-black text-foreground uppercase truncate max-w-[100px]">{s.name}</span>
                    </div>
                    <span className="text-[10px] font-black text-foreground">{s.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Executive Vault Card - ACTIVE LAYER */}
          <Card className="overflow-hidden border-0 shadow-lg ring-1 ring-primary/20 bg-primary/5">
            <CardHeader className="bg-primary/10 border-b py-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                <CardTitle>Executive Vault</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {[
                { name: "Executive Summary PDF", date: "Today, 08:00" },
                { name: "Market Forecast Q3", date: "Yesterday" },
              ].map((doc, i) => (
                <Link key={i} href="/reports/view" className="w-full flex items-center justify-between p-3 rounded-xl bg-white/80 hover:bg-white group transition-all shadow-sm border border-primary/5">
                  <div className="flex items-center gap-3">
                    <FileDown className="size-4 text-primary" />
                    <div className="text-left">
                      <p className="text-[10px] font-black text-foreground uppercase leading-none">{doc.name}</p>
                      <p className="text-[8px] font-bold text-muted-foreground mt-1">{doc.date}</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500 text-white border-0 text-[8px] h-4">Active</Badge>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
