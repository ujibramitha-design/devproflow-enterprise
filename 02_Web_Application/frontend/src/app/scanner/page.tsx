"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { 
  Upload, 
  Camera, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Eye,
  Save,
  Loader2,
  Scan
} from "lucide-react"
import { aiScannerEngine } from "@/services/ai-scanner-engine"
import { supabaseClient } from "@/lib/supabase-client"
import { FadeIn } from "@/components/ui/page-transition"

interface ExtractedField {
  label: string
  value: string
  confidence?: number
}

interface ScanResult {
  success: boolean
  data?: any
  extractedFields?: Record<string, string>
  error?: string
}

export default function ScannerPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [previewUrl, setPreviewUrl] = useState<string>("")

  // Handle file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
      if (!validTypes.includes(uploadedFile.type)) {
        setScanResult({
          success: false,
          error: 'Format file tidak didukung. Gunakan JPG, PNG, atau PDF.'
        })
        return
      }

      // Validate file size (max 10MB)
      if (uploadedFile.size > 10 * 1024 * 1024) {
        setScanResult({
          success: false,
          error: 'Ukuran file terlalu besar. Maksimal 10MB.'
        })
        return
      }

      setFile(uploadedFile)
      setScanResult(null)
      setValidationErrors([])

      // Create preview
      if (uploadedFile.type.startsWith('image/')) {
        const url = URL.createObjectURL(uploadedFile)
        setPreviewUrl(url)
      } else {
        setPreviewUrl("")
      }
    }
  }, [])

  // Start scanning process
  const startScanning = useCallback(async () => {
    if (!file) return

    setIsScanning(true)
    setScanResult(null)
    setValidationErrors([])

    try {
      const result = await aiScannerEngine.processFile(file)
      setScanResult(result)

      if (result.success && result.data) {
        // Validate extracted data
        const validation = aiScannerEngine.validateExtractedData(result.data)
        if (!validation.isValid) {
          setValidationErrors(validation.errors)
        }
      }
    } catch (error: any) {
      setScanResult({
        success: false,
        error: error.message || 'Terjadi kesalahan saat memindai dokumen'
      })
    } finally {
      setIsScanning(false)
    }
  }, [file])

  // Save to Supabase
  const saveToSupabase = useCallback(async () => {
    if (!scanResult?.data || !scanResult.success) return

    setIsSaving(true)
    try {
      // Get Supabase client
      const client = supabaseClient.getClient()
      
      // Prepare data for insertion
      const insertData = {
        ...scanResult.data,
        created_at: new Date().toISOString(),
        scan_source: 'web_scanner'
      }

      // Insert into "data global master" table
      const { data, error } = await (client as any)
        .from("data global master")
        .insert(insertData)
        .select()

      if (error) throw error

      setScanResult({
        ...scanResult,
        success: true,
        data: { ...scanResult.data, saved: true, recordId: data?.[0]?.no }
      })

      console.log('✅ Data berhasil disimpan ke Supabase:', data)
    } catch (error: any) {
      console.error('❌ Gagal menyimpan ke Supabase:', error)
      setScanResult({
        ...scanResult,
        error: `Gagal menyimpan: ${error.message}`
      })
    } finally {
      setIsSaving(false)
    }
  }, [scanResult])

  // Extracted fields for display
  const extractedFields: ExtractedField[] = scanResult?.extractedFields 
    ? Object.entries(scanResult.extractedFields).map(([label, value]) => ({
        label,
        value,
        confidence: 0.85 // Mock confidence for now
      }))
    : []

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <FadeIn>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-devpro-primary/10 text-devpro-primary">
            <Scan className="size-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-devpro-foreground">AI Document Scanner</h1>
            <p className="text-devpro-muted-foreground">
              Scan KTP atau SPR dengan AI untuk mengisi form otomatis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-500/10 text-emerald-600 border-0">
            <CheckCircle className="size-3 mr-1" />
            Gemini AI Ready
          </Badge>
          <Badge className="bg-devpro-primary/10 text-devpro-primary border-0">
            <FileText className="size-3 mr-1" />
            113 Kolom Mapping
          </Badge>
          <Badge className="bg-amber-500/10 text-amber-600 border-0">
            <Eye className="size-3 mr-1" />
            Validation Check
          </Badge>
        </div>
      </div>

      </FadeIn>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Section */}
        <FadeIn delay={0.1}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="size-5" />
              Upload Dokumen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* File Upload */}
            <div className="border-2 border-dashed border-devpro-slate/30 rounded-xl p-8 text-center hover:border-devpro-neon/50 transition-colors">
              <input
                type="file"
                id="file-upload"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isScanning}
              />
              <label 
                htmlFor="file-upload" 
                className="cursor-pointer inline-flex flex-col items-center gap-3"
              >
                <div className="p-4 rounded-full bg-devpro-primary/10 text-devpro-primary">
                  <Camera className="size-8" />
                </div>
                <div>
                  <p className="font-semibold text-devpro-foreground">
                    {file ? file.name : 'Klik untuk upload atau drag & drop'}
                  </p>
                  <p className="text-sm text-devpro-muted-foreground">
                    JPG, PNG, PDF (Maks. 10MB)
                  </p>
                </div>
              </label>
            </div>

            {/* Preview */}
            {previewUrl && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-devpro-text-secondary">Preview:</p>
                <img 
                  src={previewUrl} 
                  alt="Document preview" 
                  className="w-full h-auto rounded-lg border border-devpro-slate/20"
                />
              </div>
            )}

            {/* Scan Button */}
            <Button 
              onClick={startScanning}
              disabled={!file || isScanning}
              className="w-full"
              size="lg"
            >
              {isScanning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memindai dokumen...
                </>
              ) : (
                <>
                  <Scan className="mr-2 h-4 w-4" />
                  Mulai Scan AI
                </>
              )}
            </Button>

            {/* Progress */}
            {isScanning && (
              <div className="space-y-2">
                <Progress value={65} className="h-2" />
                <p className="text-xs text-devpro-muted-foreground text-center">
                  AI sedang menganalisis dokumen...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        </FadeIn>

        {/* Results Section */}
        <FadeIn delay={0.2}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5" />
              Hasil Ekstraksi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error Display */}
            {scanResult?.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{scanResult.error}</AlertDescription>
              </Alert>
            )}

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p className="font-semibold">Data perlu divalidasi:</p>
                    <ul className="list-disc list-inside text-sm">
                      {validationErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Success Display */}
            {scanResult?.success && scanResult.extractedFields && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="size-4" />
                  <span className="font-medium">Scan berhasil!</span>
                </div>

                {/* Extracted Fields */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {extractedFields.map((field, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-devpro-navy/50 rounded-lg">
                      <span className="text-sm font-medium text-devpro-text-secondary">
                        {field.label}
                      </span>
                      <span className="text-sm text-devpro-text-primary font-mono">
                        {field.value || '-'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Save Button */}
                {!scanResult.data?.saved && (
                  <Button 
                    onClick={saveToSupabase}
                    disabled={isSaving || validationErrors.length > 0}
                    className="w-full"
                    size="lg"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Menyimpan ke database...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Simpan ke Supabase
                      </>
                    )}
                  </Button>
                )}

                {/* Saved Confirmation */}
                {scanResult.data?.saved && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Data berhasil disimpan ke database! 
                      {scanResult.data.recordId && ` Record ID: ${scanResult.data.recordId}`}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Empty State */}
            {!scanResult && !isScanning && (
              <div className="text-center py-12 text-devpro-muted-foreground">
                <FileText className="size-12 mx-auto mb-4 opacity-50" />
                <p>Upload dokumen dan mulai scan untuk melihat hasilnya</p>
              </div>
            )}
          </CardContent>
        </Card>
        </FadeIn>
      </div>
    </div>
  )
}
