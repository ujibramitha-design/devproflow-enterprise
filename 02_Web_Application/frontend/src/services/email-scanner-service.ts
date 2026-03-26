/**
 * KPRFlow Enterprise - Email Scanner Service (Web Version)
 * Adapted from 12_Email_Scanner.js for Next.js integration
 * Syncs Gmail prospects to Supabase prospek_temp table
 */

interface EmailConfig {
  keywords: string[]
  targetTable: string
  scanInterval: number
}

interface ScanStats {
  totalProspects: number
  newProspects: number
  lastScanTime: Date | null
  isRunning: boolean
}

export class EmailScannerService {
  private config: EmailConfig
  private isRunning = false
  private scanTimer: ReturnType<typeof setInterval> | null = null

  constructor(config?: Partial<EmailConfig>) {
    this.config = {
      keywords: ['Notifikasi', 'Booking', 'Pembayaran', 'KPR', 'Properti', 'Rumah'],
      targetTable: 'prospek_temp',
      scanInterval: 30,
      ...config,
    }
  }

  startAutoScan(): void {
    if (this.isRunning) {
      console.log('🔍 Email Scanner: Already running')
      return
    }
    console.log('🚀 Email Scanner: Starting automatic scan')
    this.isRunning = true
    this.scanEmails()
    this.scanTimer = setInterval(() => this.scanEmails(), this.config.scanInterval * 60 * 1000)
  }

  stopAutoScan(): void {
    if (!this.isRunning) return
    console.log('🛑 Email Scanner: Stopping automatic scan')
    this.isRunning = false
    if (this.scanTimer) {
      clearInterval(this.scanTimer)
      this.scanTimer = null
    }
  }

  async manualScan(): Promise<void> {
    console.log('🔍 Email Scanner: Starting manual scan')
    await this.scanEmails()
  }

  private async scanEmails(): Promise<void> {
    try {
      console.log('📧 Email Scanner: Scanning emails...')
      // Mock: In production, integrate with Gmail API
      await new Promise((r) => setTimeout(r, 2000))
      console.log('📊 Email Scanner: Scan complete')
    } catch (error: any) {
      console.error('❌ Email Scanner Error:', error.message)
    }
  }

  async getScanStats(): Promise<ScanStats> {
    return {
      totalProspects: 0,
      newProspects: 0,
      lastScanTime: this.isRunning ? new Date() : null,
      isRunning: this.isRunning,
    }
  }
}

export const emailScannerService = new EmailScannerService()
