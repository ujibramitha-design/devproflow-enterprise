"use client"

import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2,
  Database, ArrowRight, X, FileText, Sparkles,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { supabaseClient } from "@/lib/supabase-client"

// 113-column mapping keys (subset of critical columns for validation)
const CRITICAL_COLUMNS = [
  "nama_customer", "nik_cust", "wa_cust", "id_unit", "tipe_unit",
  "siteplan", "blok", "nomor", "status_unit", "harga_jual_dpp",
  "bank_final", "plafon", "cair", "tgl_spr", "tgl_akad",
]

interface PorterState {
  file: File | null
  parsing: boolean
  parsed: boolean
  rows: Record<string, any>[]
  mappedColumns: string[]
  unmappedColumns: string[]
  validating: boolean
  validated: boolean
  validationErrors: string[]
  upserting: boolean
  upserted: boolean
  upsertCount: number
  error: string | null
}

export function DataPorter() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [state, setState] = useState<PorterState>({
    file: null, parsing: false, parsed: false, rows: [],
    mappedColumns: [], unmappedColumns: [],
    validating: false, validated: false, validationErrors: [],
    upserting: false, upserted: false, upsertCount: 0, error: null,
  })
  const [showConfetti, setShowConfetti] = useState(false)

  // Step 1: Parse Excel/CSV
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ]
    if (!validTypes.includes(file.type) && !file.name.endsWith(".csv") && !file.name.endsWith(".xlsx")) {
      setState(p => ({ ...p, error: "Format tidak didukung. Gunakan .xlsx atau .csv" }))
      return
    }

    setState(p => ({ ...p, file, parsing: true, error: null, parsed: false, validated: false, upserted: false }))

    try {
      // Dynamic import xlsx
      const XLSX = await import("xlsx")
      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: "array" })
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(firstSheet, { defval: "" })

      if (jsonData.length === 0) throw new Error("File kosong, tidak ada data")

      // Map columns
      const fileColumns = Object.keys(jsonData[0]).map(c => c.toLowerCase().replace(/\s+/g, "_"))
      const mapped = fileColumns.filter(c => CRITICAL_COLUMNS.includes(c))
      const unmapped = fileColumns.filter(c => !CRITICAL_COLUMNS.includes(c))

      // Normalize keys
      const normalizedRows = jsonData.map(row => {
        const normalized: Record<string, any> = {}
        Object.entries(row).forEach(([key, val]) => {
          normalized[key.toLowerCase().replace(/\s+/g, "_")] = val
        })
        return normalized
      })

      setState(p => ({
        ...p, parsing: false, parsed: true,
        rows: normalizedRows, mappedColumns: mapped, unmappedColumns: unmapped,
      }))
    } catch (err: any) {
      setState(p => ({ ...p, parsing: false, error: `Gagal parsing: ${err.message}` }))
    }
  }, [])

  // Step 2: Validate
  const handleValidate = useCallback(() => {
    setState(p => ({ ...p, validating: true, validationErrors: [] }))

    const errors: string[] = []
    state.rows.forEach((row, i) => {
      if (!row.nama_customer && !row.id_unit) {
        errors.push(`Baris ${i + 1}: nama_customer atau id_unit kosong`)
      }
    })

    if (!state.mappedColumns.includes("nama_customer")) {
      errors.push("Kolom 'nama_customer' tidak ditemukan di file")
    }

    setTimeout(() => {
      setState(p => ({
        ...p, validating: false, validated: true,
        validationErrors: errors,
      }))
    }, 800)
  }, [state.rows, state.mappedColumns])

  // Step 3: Upsert to Supabase
  const handleUpsert = useCallback(async () => {
    setState(p => ({ ...p, upserting: true, error: null }))

    try {
      const client = supabaseClient.getClient()

      // Batch upsert in chunks of 50
      const chunkSize = 50
      let totalUpserted = 0

      for (let i = 0; i < state.rows.length; i += chunkSize) {
        const chunk = state.rows.slice(i, i + chunkSize)
        const { error } = await (client as any)
          .from("data global master")
          .upsert(chunk, { onConflict: "id_unit" })

        if (error) throw error
        totalUpserted += chunk.length
      }

      setState(p => ({ ...p, upserting: false, upserted: true, upsertCount: totalUpserted }))
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2500)
      console.log(`✅ Data Porter: Upserted ${totalUpserted} rows to Supabase`)
    } catch (err: any) {
      setState(p => ({ ...p, upserting: false, error: `Gagal upsert: ${err.message}` }))
    }
  }, [state.rows])

  const reset = () => {
    setState({
      file: null, parsing: false, parsed: false, rows: [],
      mappedColumns: [], unmappedColumns: [],
      validating: false, validated: false, validationErrors: [],
      upserting: false, upserted: false, upsertCount: 0, error: null,
    })
    if (fileRef.current) fileRef.current.value = ""
  }

  // Current step
  const step = state.upserted ? 4 : state.validated ? 3 : state.parsed ? 2 : 1

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-[var(--border)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white">
              <Database className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base">Universal Data Porter</CardTitle>
              <p className="text-xs text-[var(--muted-foreground)]">Upload Excel/CSV → 113 Kolom Mapping → Upsert Supabase</p>
            </div>
          </div>
          {state.file && (
            <Button variant="ghost" size="sm" onClick={reset} className="text-xs">
              <X className="size-3 mr-1" /> Reset
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-6">
          {[
            { n: 1, label: "Upload" },
            { n: 2, label: "Mapping" },
            { n: 3, label: "Validasi" },
            { n: 4, label: "Sync" },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center gap-2 flex-1">
              <div className={cn(
                "size-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                step >= s.n
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--muted)] text-[var(--muted-foreground)]"
              )}>
                {step > s.n ? <CheckCircle className="size-4" /> : s.n}
              </div>
              <span className={cn("text-[10px] font-semibold uppercase tracking-wider", step >= s.n ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]")}>
                {s.label}
              </span>
              {i < 3 && <div className={cn("flex-1 h-px", step > s.n ? "bg-[var(--primary)]" : "bg-[var(--border)]")} />}
            </div>
          ))}
        </div>

        {/* Error */}
        {state.error && (
          <div className="flex items-start gap-2 p-3 mb-4 rounded-lg border border-rose-500/30 bg-rose-500/10">
            <AlertCircle className="size-4 text-rose-400 mt-0.5 shrink-0" />
            <p className="text-xs text-rose-400">{state.error}</p>
          </div>
        )}

        {/* Step 1: Upload */}
        {step === 1 && (
          <div className="text-center">
            <input ref={fileRef} type="file" accept=".xlsx,.csv,.xls" onChange={handleFileSelect} className="hidden" id="porter-file" />
            <label htmlFor="porter-file" className="cursor-pointer inline-flex flex-col items-center gap-3 p-8 rounded-xl border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)] transition-colors">
              {state.parsing ? (
                <Loader2 className="size-8 text-[var(--primary)] animate-spin" />
              ) : (
                <FileSpreadsheet className="size-8 text-[var(--primary)]" />
              )}
              <div>
                <p className="font-semibold text-[var(--foreground)]">{state.parsing ? "Parsing file..." : "Klik untuk upload Excel / CSV"}</p>
                <p className="text-xs text-[var(--muted-foreground)]">.xlsx atau .csv — maksimal 5000 baris</p>
              </div>
            </label>
          </div>
        )}

        {/* Step 2: Mapping Result */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Badge className="bg-emerald-500/10 text-emerald-500 border-0">
                <FileText className="size-3 mr-1" /> {state.file?.name}
              </Badge>
              <Badge className="bg-blue-500/10 text-blue-400 border-0">
                {state.rows.length} baris terdeteksi
              </Badge>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <p className="text-xs font-bold text-emerald-500 mb-2">✅ Kolom Ter-mapping ({state.mappedColumns.length})</p>
                <div className="flex flex-wrap gap-1">
                  {state.mappedColumns.map(c => (
                    <Badge key={c} className="bg-emerald-500/20 text-emerald-400 border-0 text-[9px]">{c}</Badge>
                  ))}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                <p className="text-xs font-bold text-amber-500 mb-2">⚠️ Kolom Tambahan ({state.unmappedColumns.length})</p>
                <div className="flex flex-wrap gap-1">
                  {state.unmappedColumns.slice(0, 10).map(c => (
                    <Badge key={c} className="bg-amber-500/20 text-amber-400 border-0 text-[9px]">{c}</Badge>
                  ))}
                  {state.unmappedColumns.length > 10 && (
                    <Badge className="bg-[var(--muted)] text-[var(--muted-foreground)] border-0 text-[9px]">+{state.unmappedColumns.length - 10} lainnya</Badge>
                  )}
                </div>
              </div>
            </div>

            <Button onClick={handleValidate} disabled={state.validating} className="w-full">
              {state.validating ? <Loader2 className="size-4 mr-2 animate-spin" /> : <ArrowRight className="size-4 mr-2" />}
              Validasi Data
            </Button>
          </div>
        )}

        {/* Step 3: Validation Result */}
        {step === 3 && (
          <div className="space-y-4">
            {state.validationErrors.length === 0 ? (
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
                <CheckCircle className="size-6 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-emerald-500">Validasi berhasil! {state.rows.length} baris siap di-sync.</p>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-xs font-bold text-amber-500 mb-2">⚠️ {state.validationErrors.length} peringatan:</p>
                <ul className="space-y-1">
                  {state.validationErrors.slice(0, 5).map((e, i) => (
                    <li key={i} className="text-[11px] text-amber-400">• {e}</li>
                  ))}
                </ul>
              </div>
            )}

            <Button onClick={handleUpsert} disabled={state.upserting} className="w-full">
              {state.upserting ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Database className="size-4 mr-2" />}
              Upsert ke Supabase ({state.rows.length} baris)
            </Button>
          </div>
        )}

        {/* Step 4: Done */}
        {step === 4 && (
          <div className="text-center space-y-4">
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
              <Sparkles className="size-12 text-emerald-500 mx-auto mb-2" />
            </motion.div>
            <p className="text-lg font-bold text-emerald-500">🎉 Sync Berhasil!</p>
            <p className="text-sm text-[var(--muted-foreground)]">{state.upsertCount} baris berhasil di-upsert ke tabel "data global master"</p>
            <Button onClick={reset} variant="outline">Upload File Baru</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
