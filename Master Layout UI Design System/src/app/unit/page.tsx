"use client"

import { Tag, Plus, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const units = [
  { id: "U-101", name: "Grand Emerald Residence", type: "Cluster Type A", status: "Ready", price: "Rp 1.2M", location: "Tangerang Selatan", img: "1" },
  { id: "U-102", name: "Skyview Apartment", type: "Studio Suite", status: "Sold Out", price: "Rp 850jt", location: "Jakarta Barat", img: "2" },
  { id: "U-103", name: "Pine Wood Mansion", type: "Exclusive Villa", status: "Available", price: "Rp 3.5M", location: "Bogor", img: "3" },
  { id: "U-104", name: "Citra Gardenia", type: "Family House", status: "Ready", price: "Rp 1.8M", location: "Depok", img: "4" },
  { id: "U-105", name: "The Zenith Office", type: "Commercial Space", status: "Available", price: "Rp 12M", location: "Jakarta Pusat", img: "5" },
  { id: "U-106", name: "Lake Side Estate", type: "Lakeside Cluster", status: "Maintenance", price: "Rp 2.4M", location: "Bekasi", img: "6" },
]

export default function UnitPage() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Data Unit Properti</h2>
          <p className="mt-1 text-[13px] text-muted-foreground">Monitoring stok dan ketersediaan unit proyek secara real-time.</p>
        </div>
        <button className="flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-[13px] font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90">
          <Plus className="size-4" /> Tambah Unit
        </button>
      </div>

      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
        <input type="text" placeholder="Cari unit..." className="h-11 w-full rounded-2xl bg-card border border-border/40 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/15" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {units.map((unit) => (
          <div key={unit.id} className="group rounded-3xl bg-card overflow-hidden shadow-sm ring-1 ring-border/40 transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="aspect-[16/10] bg-secondary/30 relative">
              <img src={`https://picsum.photos/seed/${unit.img}/600/400`} alt={unit.name} className="size-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-4 right-4">
                <Badge className="rounded-full bg-emerald-500 text-white border-0 font-black px-3 py-1 text-[10px]">{unit.status}</Badge>
              </div>
            </div>
            <div className="p-5">
              <span className="text-[10px] font-black text-primary uppercase">{unit.type}</span>
              <h4 className="mt-1 text-[16px] font-black text-foreground">{unit.name}</h4>
              <div className="mt-4 flex items-center justify-between border-t border-border/20 pt-4">
                <div className="flex items-center gap-2 font-black text-foreground">
                  <Tag className="size-4 text-primary" />
                  <span>{unit.price}</span>
                </div>
                <button className="text-[11px] font-bold text-primary">Detail →</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
