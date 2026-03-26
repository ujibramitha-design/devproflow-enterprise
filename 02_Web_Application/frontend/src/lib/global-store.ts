/**
 * KPRFlow Enterprise — Global Store for "data global master" (113 columns)
 * READ-ONLY: hanya SELECT dari Supabase, tidak ada CREATE/ALTER/DROP
 */

import { create } from "zustand"
import { supabaseClient } from "./supabase-client"

// ── Tipe untuk 113 kolom "data global master" ────────────────────────────────
export interface GlobalMasterRow {
  // Grup A — Identitas Transaksi (12 kolom)
  id?: string
  no?: number
  tgl_spr?: string
  no_spr?: string
  id_unit?: string
  aging_hari?: number
  status_unit?: string
  sumber?: string
  koordinat?: string
  siteplan_index?: number
  timestamp?: string
  created_at?: string
  updated_at?: string

  // Grup B — Data Customer (12 kolom)
  nama_customer?: string
  wa_cust?: string
  email_cust?: string
  ttl_cust?: string
  nik_cust?: string
  npwp_cust?: string
  alamat_ktp_cust?: string
  alamat_dom_cust?: string
  sales_koordinator?: string
  mbr_status?: string
  mbr_date?: string
  payment_method?: string

  // Grup C — Data Pasangan (8 kolom)
  nama_pasangan?: string
  ttl_pasangan?: string
  nik_pasangan?: string
  npwp_pasangan?: string
  alamat_ktp_pasangan?: string
  alamat_dom_pasangan?: string

  // Grup D — Emergency Contact (4 kolom)
  nama_ec?: string
  no_telp_ec?: string
  alamat_ec?: string
  hubungan_ec?: string

  // Grup E — Bank & KPR Financing (16 kolom)
  bjb?: string
  mandiri?: string
  bni?: string
  bri?: string
  btn?: string
  bsi?: string
  bank_final?: string
  pic_bank?: string
  plafon?: number
  cair?: number
  potensi_app?: string
  rencana_akad?: string
  tgl_akad?: string
  potensi_batal?: string
  harga_jual_dpp?: number

  // Grup F — Finance & Pajak (8 kolom)
  pph?: number
  bphtb?: number
  bphtb_subsidy?: number
  vat_incentive?: string
  ssp?: string
  validasi_ssp?: string
  validasi_bphtb?: string

  // Grup G — Legal & Notaris (10 kolom)
  notaris?: string
  tgl_ppjb?: string
  no_ppjb_notaril?: string
  salinan_ajb_notaril?: string
  no_akta_buyback?: string
  bast_bank?: string
  bast_developer?: string
  ajb_ppjb?: string
  balik_nama?: string

  // Grup H — Siteplan & Properti (10 kolom)
  siteplan?: string
  no_id_rumah?: string
  cluster?: string
  blok?: string
  nomor?: string
  jenis_produk?: string
  tipe_unit?: string
  progres_rumah?: string
  aging_fisik?: number

  // Grup I — Progress & Catatan (8 kolom)
  keterangan?: string
  isu_kendala?: string
  proses_pemberkasan?: string
  solusi_masalah?: string

  // Grup J — Metadata (5 kolom)
  created_by?: string
  updated_by?: string
}

export interface GlobalStoreState {
  // Data
  data: GlobalMasterRow[]
  loading: boolean
  error: string | null
  lastSync: string | null

  // Actions
  fetchAllData: () => Promise<void>
  refreshData: () => Promise<void>
  clearError: () => void
}

// ── Helper Format: Rupiah & Tanggal Indonesia ─────────────────────────────────
export const Format = {
  // Rupiah: 1000000 → "Rp 1.000.000"
  rupiah(val: unknown): string {
    const n = Number(val)
    if (!n || isNaN(n)) return "Rp 0"
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(n)
  },

  // Tanggal: "2026-03-25" → "25 Mar 2026"
  dateShort(val: unknown): string {
    if (!val) return "—"
    const d = new Date(String(val))
    if (isNaN(d.getTime())) return "—"
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  },

  // Tanggal lengkap: "2026-03-25" → "Senin, 25 Maret 2026"
  dateLong(val: unknown): string {
    if (!val) return "—"
    const d = new Date(String(val))
    if (isNaN(d.getTime())) return "—"
    return d.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  },

  // Status Badge mapping
  statusBadge(raw: unknown): { label: string; color: string } {
    const s = String(raw ?? "").toUpperCase().trim()
    const map: Record<string, { label: string; color: string }> = {
      AVAILABLE:    { label: "Tersedia",   color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
      TERSEDIA:     { label: "Tersedia",   color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
      AKAD:         { label: "Akad",       color: "bg-blue-500/20   text-blue-400   border-blue-500/30" },
      CAIR:         { label: "Cair",       color: "bg-violet-500/20 text-violet-400 border-violet-500/30" },
      SOLD:         { label: "Terjual",    color: "bg-rose-500/20   text-rose-400   border-rose-500/30" },
      TERJUAL:      { label: "Terjual",    color: "bg-rose-500/20   text-rose-400   border-rose-500/30" },
    }
    return map[s] ?? { label: s || "—", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" }
  },

  // Bank icon mapping
  bankIcon(bank: unknown): string {
    const b = String(bank ?? "").toLowerCase()
    const icons: Record<string, string> = {
      bjb: "🏦", mandiri: "🏛️", bni: "🏦", bri: "🏦", btn: "🏦", bsi: "🏦",
    }
    return icons[b] || "🏦"
  },
}

// ── Zustand Store ───────────────────────────────────────────────────────────────
export const useGlobalStore = create<GlobalStoreState>((set, get) => ({
  data: [],
  loading: false,
  error: null,
  lastSync: null,

  fetchAllData: async () => {
    set({ loading: true, error: null })
    try {
      // READ-ONLY: SELECT semua kolom dari "data global master"
      const client = supabaseClient.getClient()
      const { data, error: sbError } = await (client as any)
        .from("data global master")
        .select("*")
        .order("no", { ascending: true })
        .limit(500)

      if (sbError) throw new Error(sbError.message)

      set({
        data: (data as GlobalMasterRow[]) ?? [],
        loading: false,
        lastSync: new Date().toISOString(),
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memuat data"
      set({
        error: msg.includes("not initialized")
          ? "Supabase belum dikonfigurasi — tambahkan NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY ke .env.local"
          : msg,
        loading: false,
      })
    }
  },

  refreshData: async () => {
    await get().fetchAllData()
  },

  clearError: () => set({ error: null }),
}))

// ── Helper Hooks ───────────────────────────────────────────────────────────────
export const useGlobalData = () => {
  const store = useGlobalStore()
  return {
    ...store,
    // Quick getters
    totalUnits: store.data.length,
    totalCustomers: new Set(store.data.map(r => r.nama_customer).filter(Boolean)).size,
    totalCair: store.data.reduce((s, r) => s + (Number(r.cair) || 0), 0),
    totalPlafon: store.data.reduce((s, r) => s + (Number(r.plafon) || 0), 0),
    // Status breakdown
    statusCounts: {
      available: store.data.filter(r => ["AVAILABLE","TERSEDIA"].includes(String(r.status_unit ?? "").toUpperCase())).length,
      akad:      store.data.filter(r => "AKAD" === String(r.status_unit ?? "").toUpperCase()).length,
      cair:      store.data.filter(r => "CAIR" === String(r.status_unit ?? "").toUpperCase()).length,
      sold:      store.data.filter(r => ["SOLD","TERJUAL"].includes(String(r.status_unit ?? "").toUpperCase())).length,
      reserved:  store.data.filter(r => !["AVAILABLE","TERSEDIA","AKAD","CAIR","SOLD","TERJUAL"].includes(String(r.status_unit ?? "").toUpperCase())).length,
    },
  }
}
