"use client"

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Printer, 
  FileDown, 
  ChevronLeft, 
  ShieldCheck, 
  Building2,
  TrendingUp,
  FileSpreadsheet
} from "lucide-react"
import Link from "next/link"
import * as XLSX from 'xlsx'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts'

const chartData = [
  { name: 'Emerald', sales: 45 },
  { name: 'Skyview', sales: 32 },
  { name: 'Pine Wood', sales: 58 },
  { name: 'Zenith', sales: 24 },
  { name: 'Citra', sales: 39 },
]

const tableData = [
  { id: "U-101", customer: "Andi Wijaya", unit: "Emerald A-12", amount: 1200000000, status: "Akad" },
  { id: "U-102", customer: "Siska Putri", unit: "Skyview B-05", amount: 850000000, status: "Review" },
  { id: "U-103", customer: "Robert Han", unit: "Pine Wood C-01", amount: 3500000000, status: "Appraisal" },
  { id: "U-104", customer: "Dewi Kartika", unit: "Citra G-09", amount: 1800000000, status: "Verified" },
]

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']

export default function ReportViewPage() {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  const exportToExcel = () => {
    const dataToExport = tableData.map(item => ({
      "ID Unit": item.id,
      "Nama Nasabah": item.customer,
      "Unit Properti": item.unit,
      "Plafon (Rp)": item.amount,
      "Status": item.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Transaksi");
    XLSX.writeFile(workbook, "Laporan_Eksekutif_DEVPro_2026.xlsx");
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up bg-secondary/5 min-h-screen pb-20">
      {/* Action Header - Hidden on Print */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl shadow-sm border border-border/40 sticky top-0 z-50 print:hidden">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 rounded-xl hover:bg-secondary transition-all">
            <ChevronLeft className="size-5" />
          </Link>
          <div>
            <h2 className="text-sm font-black uppercase tracking-tight">Pratinjau Laporan Bulanan</h2>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Generated: 12 Mar 2026 • ID: RPT-2026-03-001</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={exportToExcel}
            className="h-10 px-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-black flex items-center gap-2 hover:bg-emerald-100 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="size-4" /> Export Excel
          </button>
          <button 
            onClick={handlePrint}
            className="h-10 px-4 rounded-xl border border-border/60 text-xs font-black flex items-center gap-2 hover:bg-secondary transition-all cursor-pointer"
          >
            <Printer className="size-4" /> Cetak PDF
          </button>
          <button className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-black flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
            <FileDown className="size-4" /> Download Dokumen
          </button>
        </div>
      </div>

      {/* The Report Page (A4 Paper Style) */}
      <div className="mx-auto w-full max-w-[900px] bg-white shadow-2xl shadow-black/5 min-h-[1200px] p-12 md:p-16 border border-border/20 relative overflow-hidden print:shadow-none print:p-0 print:border-0 print:m-0">
        
        {/* Report Header */}
        <div className="flex justify-between items-start border-b-4 border-primary pb-8 mb-10 relative z-10">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-primary/20">D</div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-foreground leading-none">DEVPro FLOW</h1>
              <p className="text-[10px] font-black tracking-[0.3em] uppercase text-primary mt-1">Enterprise System 2026</p>
            </div>
          </div>
          <div className="text-right">
            <Badge className="bg-emerald-500 text-white font-black mb-2 rounded-full px-3 py-1 text-[9px]">FINAL VERSION</Badge>
            <h3 className="text-sm font-black uppercase text-foreground">Laporan Eksekutif Bulanan</h3>
            <p className="text-[11px] text-muted-foreground font-bold mt-1">Periode Maret 2026</p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mb-12 relative z-10">
          <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-4 flex items-center gap-2">
            <ShieldCheck className="size-4" /> Ringkasan Eksekutif
          </h4>
          <p className="text-[13px] leading-relaxed text-slate-600 font-medium text-justify">
            Laporan ini menyajikan analisis komprehensif mengenai kinerja operasional properti dan alur kerja KPR selama bulan Maret 2026. 
            Terdapat peningkatan signifikan sebesar 14.2% pada realisasi plafon disetujui dibandingkan bulan sebelumnya. 
          </p>
        </div>

        {/* Performance Chart */}
        <div className="mb-12 relative z-10">
          <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-6 flex items-center gap-2">
            <TrendingUp className="size-4" /> Distribusi Penjualan per Cluster
          </h4>
          <div className="h-[300px] w-full border border-border/20 rounded-3xl p-8 bg-secondary/5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}} />
                <Tooltip 
                  cursor={{fill: 'rgba(0,0,0,0.02)'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                />
                <Bar dataKey="sales" radius={[6, 6, 0, 0]} barSize={45}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Table */}
        <div className="mb-12 relative z-10">
          <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-4 flex items-center gap-2">
            <Building2 className="size-4" /> Detail Transaksi Teratas
          </h4>
          <div className="overflow-hidden rounded-2xl border border-border/40">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary text-white text-[10px] font-black uppercase tracking-widest">
                  <th className="p-4 text-left">ID Unit</th>
                  <th className="p-4 text-left">Nasabah</th>
                  <th className="p-4 text-right">Plafon KPR</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {tableData.map((row, i) => (
                  <tr key={i} className="text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono text-primary">{row.id}</td>
                    <td className="p-4 uppercase text-foreground">{row.customer}</td>
                    <td className="p-4 text-right font-black text-foreground">
                      Rp {row.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="p-4 text-right">
                      <span className="px-2 py-1 rounded-full bg-secondary text-[9px] font-black uppercase">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}