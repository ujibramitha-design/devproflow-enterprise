"use client"

import { UserPlus, Mail, Phone } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const customers = [
  { name: "Andi Wijaya", email: "andi.w@email.com", phone: "0812-3456-7890", segment: "Priority", id: "CUST-9921", initials: "AW" },
  { name: "Siska Putri", email: "siska.p@email.com", phone: "0856-9876-5432", segment: "Regular", id: "CUST-8812", initials: "SP" },
  { name: "Robert Han", email: "robert.h@email.com", phone: "0811-2233-4455", segment: "Corporate", id: "CUST-7731", initials: "RH" },
]

export default function CustomerPage() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Database Customer</h2>
          <p className="mt-1 text-[13px] text-muted-foreground">Manajemen profil nasabah enterprise secara terpusat.</p>
        </div>
        <button className="flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-[13px] font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all">
          <UserPlus className="size-4" /> Registrasi Baru
        </button>
      </div>

      <div className="grid gap-3">
        {customers.map((c, i) => (
          <div key={i} className="group flex items-center justify-between rounded-3xl bg-card p-5 shadow-sm ring-1 ring-border/40 hover:ring-primary/30 transition-all">
            <div className="flex items-center gap-5">
              <Avatar className="size-14 ring-4 ring-secondary/50">
                <AvatarImage src={`https://api.dicebear.com/9.x/initials/svg?seed=${c.initials}`} />
                <AvatarFallback className="bg-primary/10 text-primary font-black">{c.initials}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-[16px] font-black text-foreground">{c.name}</h4>
                  <span className="text-[10px] font-mono text-muted-foreground/60">{c.id}</span>
                </div>
                <div className="flex gap-4 mt-1 text-[12px] text-muted-foreground font-medium">
                  <span className="flex items-center gap-1.5"><Mail className="size-3.5 text-primary/60" /> {c.email}</span>
                  <span className="flex items-center gap-1.5"><Phone className="size-3.5 text-primary/60" /> {c.phone}</span>
                </div>
              </div>
            </div>
            <Badge className="rounded-full bg-amber-100 text-amber-700 border-0">{c.segment}</Badge>
          </div>
        ))}
      </div>
    </div>
  )
}
