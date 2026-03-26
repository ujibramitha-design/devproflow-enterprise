/**
 * KPRFlow Enterprise - AI Scanner Engine (Web/Node.js Version)
 * Adapted from Google Apps Script version for Web & Mobile integration
 * Uses Google Gemini Vision API for OCR document extraction
 */

interface ScanResult {
  success: boolean
  data?: Record<string, any>
  error?: string
  extractedFields?: Record<string, string>
}

interface ExtractedData {
  // Core customer information
  nama_customer?: string
  nik_cust?: string
  wa_cust?: string
  alamat_ktp_cust?: string
  
  // Unit and transaction information
  id_unit?: string
  tgl_spr?: string
  harga_jual_dpp?: string
  
  // Akad information
  lokasi_akad?: string
  tgl_akad?: string
  
  // Additional parties
  nama_pasangan?: string
  nik_pasangan?: string
  nama_ec?: string
  no_telp_ec?: string
  
  // Sales information
  sales_koordinator?: string
  
  // Bank detection
  bank_final?: string
  bjb?: string
  mandiri?: string
  bni?: string
  bri?: string
  btn?: string
  bsi?: string
  
  // Metadata
  timestamp?: Date
}

export class AIScannerEngine {
  private geminiApiKey: string
  private model = 'gemini-2.0-flash-latest'

  constructor(geminiApiKey?: string) {
    // Use embedded API key or provided key
    this.geminiApiKey = geminiApiKey || process.env.GOOGLE_GEMINI_API_KEY || ''
    
    if (!this.geminiApiKey) {
      console.warn('⚠️ AI Scanner Engine: No Google Gemini API key provided')
    }
  }

  /**
   * Process uploaded file for OCR extraction
   */
  async processFile(file: File): Promise<ScanResult> {
    try {
      if (!this.geminiApiKey) {
        throw new Error('Google Gemini API key not configured')
      }

      console.log('🔍 AI Scanner: Processing file:', file.name, file.type)

      // Convert file to base64
      const base64Data = await this.fileToBase64(file)
      
      // Extract text using Gemini Vision
      const extractedText = await this.extractWithGemini(base64Data, file.type)
      
      // Parse and map extracted data
      const mappedData = this.mapExtractedData(extractedText)
      
      console.log('✅ AI Scanner: Extraction complete', {
        fieldsFound: Object.keys(mappedData).length,
        customerName: mappedData.nama_customer,
        unitId: mappedData.id_unit
      })

      return {
        success: true,
        data: mappedData,
        extractedFields: this.formatExtractedFields(mappedData)
      }
    } catch (error: any) {
      console.error('❌ AI Scanner Error:', error.message)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Convert file to base64
   */
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        // Remove data URL prefix to get pure base64
        const base64 = result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  /**
   * Extract text using Google Gemini Vision API
   */
  private async extractWithGemini(base64Data: string, mimeType: string): Promise<any> {
    const prompt = `EKSTRAK DATA KE JSON. 
    WAJIB CARI: nama_customer, id_unit, tgl_spr, harga_jual_dpp, nik_cust, wa_cust, lokasi_akad, tgl_akad, nama_pasangan, nik_pasangan, nama_ec, no_telp_ec.
    ATURAN KERAS: 
    - HANYA BERIKAN JSON. 
    - JANGAN ADA TEKS PEMBUKA/PENUTUP. 
    - DIMULAI DENGAN { DAN DIAKHIRI DENGAN }.`

    const requestBody = {
      contents: [{
        parts: [
          { text: prompt },
          { 
            inline_data: { 
              mime_type: mimeType, 
              data: base64Data 
            } 
          }
        ]
      }]
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      }
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || ''
    
    // Clean and parse JSON response
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim()
    const match = cleanJson.match(/\{[\s\S]*\}/)
    
    if (!match) {
      throw new Error('AI tidak memberikan format JSON yang valid')
    }

    return JSON.parse(match[0])
  }

  /**
   * Map extracted data to our format
   */
  private mapExtractedData(rawData: any): ExtractedData {
    const cariNilaiDeep = (obj: any, targetKeys: string[]): string => {
      for (let key in obj) {
        let keyLower = key.toLowerCase()
        let isMatch = targetKeys.some(t => keyLower.includes(t))
        if (isMatch && typeof obj[key] !== 'object') return obj[key]
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          let res = cariNilaiDeep(obj[key], targetKeys)
          if (res) return res
        }
      }
      return ''
    }

    // Deep search for values
    const namaFix = cariNilaiDeep(rawData, ["nama", "customer", "penerima", "kepada", "name"])
    const unitFix = cariNilaiDeep(rawData, ["unit", "blok", "block", "id_unit"])
    
    if (!namaFix) {
      throw new Error('Nama Customer tidak ditemukan dalam dokumen')
    }

    // Bank detection
    const teksLengkap = JSON.stringify(rawData).toUpperCase()
    let bankDitemukan = ""
    const bankStatus: Record<string, string> = { "bjb": "", "mandiri": "", "bni": "", "bri": "", "btn": "", "bsi": "" }
    const listBank = ["BRI", "BJB", "MANDIRI", "BNI", "BTN", "BSI"]
    
    for (let b of listBank) {
      if (teksLengkap.includes(b)) {
        bankDitemukan = b
        bankStatus[b.toLowerCase()] = "✅"
        break
      }
    }

    // Map to 113-column format
    return {
      tgl_spr: cariNilaiDeep(rawData, ["spr", "tanggal_surat"]),
      id_unit: unitFix,
      nama_customer: namaFix,
      sales_koordinator: cariNilaiDeep(rawData, ["sales", "marketing"]),
      harga_jual_dpp: cariNilaiDeep(rawData, ["dpp", "harga", "jual"]),
      bjb: bankStatus["bjb"],
      mandiri: bankStatus["mandiri"],
      bni: bankStatus["bni"],
      bri: bankStatus["bri"],
      btn: bankStatus["btn"],
      bsi: bankStatus["bsi"],
      bank_final: bankDitemukan,
      tgl_akad: cariNilaiDeep(rawData, ["akad", "tanggal_akad"]),
      wa_cust: cariNilaiDeep(rawData, ["wa", "telepon", "hp", "kontak"]),
      nik_cust: cariNilaiDeep(rawData, ["nik", "ktp", "identitas"]),
      alamat_ktp_cust: cariNilaiDeep(rawData, ["alamat", "ktp"]),
      nama_pasangan: cariNilaiDeep(rawData, ["pasangan", "suami", "istri"]),
      nik_pasangan: cariNilaiDeep(rawData, ["nik_pasangan", "ktp_pasangan"]),
      nama_ec: cariNilaiDeep(rawData, ["ec", "marketing_consultan"]),
      no_telp_ec: cariNilaiDeep(rawData, ["telp_ec", "telepon_ec"]),
      timestamp: new Date()
    }
  }

  /**
   * Format extracted fields for UI display
   */
  private formatExtractedFields(data: ExtractedData): Record<string, string> {
    const fieldLabels: Record<string, string> = {
      nama_customer: 'Nama Customer',
      nik_cust: 'NIK Customer',
      wa_cust: 'No. WhatsApp',
      alamat_ktp_cust: 'Alamat KTP',
      id_unit: 'ID Unit',
      tgl_spr: 'Tanggal SPR',
      harga_jual_dpp: 'Harga Jual (DPP)',
      lokasi_akad: 'Lokasi Akad',
      tgl_akad: 'Tanggal Akad',
      nama_pasangan: 'Nama Pasangan',
      nik_pasangan: 'NIK Pasangan',
      nama_ec: 'Nama EC',
      no_telp_ec: 'No. Telp EC',
      sales_koordinator: 'Sales Koordinator',
      bank_final: 'Bank',
      bjb: 'Bank BJB',
      mandiri: 'Bank Mandiri',
      bni: 'Bank BNI',
      bri: 'Bank BRI',
      btn: 'Bank BTN',
      bsi: 'Bank BSI'
    }

    const formatted: Record<string, string> = {}
    
    Object.entries(data).forEach(([key, value]) => {
      if (value && fieldLabels[key]) {
        formatted[fieldLabels[key]] = String(value)
      }
    })

    return formatted
  }

  /**
   * Validate extracted data
   */
  validateExtractedData(data: ExtractedData): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!data.nama_customer) errors.push('Nama Customer wajib diisi')
    if (!data.nik_cust) errors.push('NIK Customer wajib diisi')
    if (!data.id_unit) errors.push('ID Unit wajib diisi')
    if (!data.wa_cust) errors.push('No. WhatsApp wajib diisi')

    // Validate NIK format (16 digits)
    if (data.nik_cust && !/^\d{16}$/.test(data.nik_cust.replace(/\D/g, ''))) {
      errors.push('Format NIK tidak valid (harus 16 digit)')
    }

    // Validate phone format
    if (data.wa_cust && !/^08\d{8,12}$/.test(data.wa_cust.replace(/\D/g, ''))) {
      errors.push('Format No. WhatsApp tidak valid (dimulai dengan 08)')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

// Export singleton instance
export const aiScannerEngine = new AIScannerEngine()
