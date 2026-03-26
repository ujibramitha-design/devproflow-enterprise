/**
 * KPRFlow Enterprise - Email Scanner Service
 * Adapted from Google Apps Script for Node.js/Supabase integration
 * Syncs Gmail prospects to Supabase prospek_temp table
 */

import { createClient } from '@supabase/supabase-js'

interface EmailConfig {
  keywords: string[]
  targetTable: string
  scanInterval: number // minutes
}

interface ProspectData {
  id_unit?: string
  nama_customer?: string
  email_customer?: string
  phone_customer?: string
  sumber_data: string
  tanggal_email: Date
  subject_email: string
  status_prospek: 'BARU' | 'DIPROSES' | 'SELESAI'
  catatan?: string
  created_at: Date
}

interface EmailMessage {
  id: string
  subject: string
  from: string
  date: Date
  body: string
  snippet: string
}

export class EmailScannerService {
  private supabase: any
  private config: EmailConfig
  private isRunning: boolean = false
  private scanTimer: NodeJS.Timeout | null = null

  constructor(supabaseUrl: string, supabaseKey: string, config?: Partial<EmailConfig>) {
    this.supabase = createClient(supabaseUrl, supabaseKey)
    this.config = {
      keywords: ['Notifikasi', 'Booking', 'Pembayaran', 'KPR', 'Properti', 'Rumah'],
      targetTable: 'prospek_temp',
      scanInterval: 30, // 30 minutes
      ...config
    }
  }

  /**
   * Start automatic email scanning
   */
  startAutoScan(): void {
    if (this.isRunning) {
      console.log('🔍 Email Scanner: Already running')
      return
    }

    console.log('🚀 Email Scanner: Starting automatic scan')
    this.isRunning = true

    // Initial scan
    this.scanEmails()

    // Set up recurring scan
    this.scanTimer = setInterval(() => {
      this.scanEmails()
    }, this.config.scanInterval * 60 * 1000)
  }

  /**
   * Stop automatic email scanning
   */
  stopAutoScan(): void {
    if (!this.isRunning) {
      console.log('🔍 Email Scanner: Not running')
      return
    }

    console.log('🛑 Email Scanner: Stopping automatic scan')
    this.isRunning = false

    if (this.scanTimer) {
      clearInterval(this.scanTimer)
      this.scanTimer = null
    }
  }

  /**
   * Manual email scan
   */
  async manualScan(startDate?: Date, endDate?: Date): Promise<void> {
    console.log('🔍 Email Scanner: Starting manual scan')
    await this.scanEmails(startDate, endDate)
  }

  /**
   * Core email scanning logic
   */
  private async scanEmails(startDate?: Date, endDate?: Date): Promise<void> {
    try {
      console.log('📧 Email Scanner: Scanning emails...')

      // For demonstration, we'll simulate email scanning
      // In production, this would integrate with Gmail API or other email service
      const emails = await this.fetchEmails(startDate, endDate)
      
      console.log(`📧 Email Scanner: Found ${emails.length} emails`)

      let processedCount = 0
      for (const email of emails) {
        const prospectData = this.extractProspectData(email)
        
        if (prospectData) {
          const saved = await this.saveProspect(prospectData)
          if (saved) {
            processedCount++
            console.log(`✅ Email Scanner: Processed prospect - ${prospectData.nama_customer}`)
          }
        }
      }

      console.log(`📊 Email Scanner: Processed ${processedCount} new prospects`)

    } catch (error: any) {
      console.error('❌ Email Scanner Error:', error.message)
    }
  }

  /**
   * Fetch emails from email service
   * Note: This is a mock implementation - replace with actual Gmail API integration
   */
  private async fetchEmails(startDate?: Date, endDate?: Date): Promise<EmailMessage[]> {
    // Mock email data for demonstration
    // In production, integrate with Gmail API, Outlook API, or IMAP
    const mockEmails: EmailMessage[] = [
      {
        id: '1',
        subject: 'Booking Unit A-001 - John Doe',
        from: 'john.doe@email.com',
        date: new Date(),
        body: 'Saya tertarik dengan unit A-001, mohon info lebih lanjut.',
        snippet: 'Booking Unit A-001 - John Doe'
      },
      {
        id: '2',
        subject: 'Pembayaran DP Rumah type 36',
        from: 'jane.smith@email.com',
        date: new Date(),
        body: 'Saya ingin melakukan pembayaran DP untuk rumah type 36.',
        snippet: 'Pembayaran DP Rumah type 36'
      },
      {
        id: '3',
        subject: 'Notifikasi Peminjaman KPR',
        from: 'ahmad.wijaya@email.com',
        date: new Date(),
        body: 'Mohon informasi mengenai persyaratan KPR.',
        snippet: 'Notifikasi Peminjaman KPR'
      }
    ]

    // Filter by keywords
    return mockEmails.filter(email => 
      this.config.keywords.some(keyword => 
        email.subject.toLowerCase().includes(keyword.toLowerCase()) ||
        email.body.toLowerCase().includes(keyword.toLowerCase())
      )
    )
  }

  /**
   * Extract prospect data from email
   */
  private extractProspectData(email: EmailMessage): ProspectData | null {
    try {
      // Extract information from email
      const nameMatch = email.body.match(/([A-Z][a-z]+\s+[A-Z][a-z]+)/) || 
                       email.from.match(/([A-Z][a-z]+\s+[A-Z][a-z]+)/)
      
      const unitMatch = email.subject.match(/([A-Z]-\d+)/) ||
                       email.body.match(/unit\s+([A-Z]-\d+)/i)

      const phoneMatch = email.body.match(/(\d{10,13})/) ||
                        email.body.match(/0(\d{9,12})/)

      // Extract basic prospect data
      const prospectData: ProspectData = {
        nama_customer: nameMatch ? nameMatch[1] : email.from.split('@')[0],
        email_customer: email.from,
        phone_customer: phoneMatch ? phoneMatch[0] : '',
        id_unit: unitMatch ? unitMatch[1] : '',
        sumber_data: 'EMAIL_SCANNER',
        tanggal_email: email.date,
        subject_email: email.subject,
        status_prospek: 'BARU',
        catatan: email.snippet,
        created_at: new Date()
      }

      return prospectData

    } catch (error: any) {
      console.error('❌ Error extracting prospect data:', error.message)
      return null
    }
  }

  /**
   * Save prospect to Supabase
   */
  private async saveProspect(prospectData: ProspectData): Promise<boolean> {
    try {
      // Check if prospect already exists (by email + date)
      const { data: existing } = await this.supabase
        .from(this.config.targetTable)
        .select('id')
        .eq('email_customer', prospectData.email_customer)
        .eq('tanggal_email', prospectData.tanggal_email.toISOString())
        .single()

      if (existing) {
        console.log(`📧 Email Scanner: Prospect already exists - ${prospectData.email_customer}`)
        return false
      }

      // Insert new prospect
      const { data, error } = await this.supabase
        .from(this.config.targetTable)
        .insert({
          ...prospectData,
          tanggal_email: prospectData.tanggal_email.toISOString(),
          created_at: prospectData.created_at.toISOString()
        })
        .select()

      if (error) {
        console.error('❌ Error saving prospect:', error)
        return false
      }

      console.log(`✅ Email Scanner: Saved prospect - ${prospectData.nama_customer}`)
      return true

    } catch (error: any) {
      console.error('❌ Error saving prospect:', error.message)
      return false
    }
  }

  /**
   * Get scan statistics
   */
  async getScanStats(): Promise<{
    totalProspects: number
    newProspects: number
    lastScanTime: Date | null
    isRunning: boolean
  }> {
    try {
      const { count: totalProspects } = await this.supabase
        .from(this.config.targetTable)
        .select('*', { count: 'exact', head: true })

      const { count: newProspects } = await this.supabase
        .from(this.config.targetTable)
        .select('*', { count: 'exact', head: true })
        .eq('status_prospek', 'BARU')

      return {
        totalProspects: totalProspects || 0,
        newProspects: newProspects || 0,
        lastScanTime: new Date(), // In production, store actual last scan time
        isRunning: this.isRunning
      }

    } catch (error: any) {
      console.error('❌ Error getting scan stats:', error.message)
      return {
        totalProspects: 0,
        newProspects: 0,
        lastScanTime: null,
        isRunning: this.isRunning
      }
    }
  }

  /**
   * Update prospect status
   */
  async updateProspectStatus(
    prospectId: string, 
    status: 'BARU' | 'DIPROSES' | 'SELESAI',
    catatan?: string
  ): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from(this.config.targetTable)
        .update({
          status_prospek: status,
          catatan: catatan,
          updated_at: new Date().toISOString()
        })
        .eq('id', prospectId)

      if (error) {
        console.error('❌ Error updating prospect status:', error)
        return false
      }

      console.log(`✅ Email Scanner: Updated prospect ${prospectId} to ${status}`)
      return true

    } catch (error: any) {
      console.error('❌ Error updating prospect status:', error.message)
      return false
    }
  }
}

// Export singleton instance
export const emailScannerService = new EmailScannerService(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)
