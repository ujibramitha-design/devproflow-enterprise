/**
 * KPRFlow Enterprise - Shared WhatsApp Client
 * Adapted from bramsray2 whatsapp-engine for cross-platform use
 * 
 * ⚠️ TEMPORARILY DISABLED - AI & AUDIT PHASE
 * All WhatsApp messaging functions are mocked and only log to console
 * No API calls will be made to WhatsApp services
 */

export interface WhatsAppMessage {
  to: string
  type: 'text' | 'document' | 'image'
  content: string
  fileName?: string
  fileUrl?: string
}

export interface NotificationData {
  userId?: string
  title: string
  message: string
  type: 'lead_generated' | 'status_change' | 'document_uploaded' | 'unit_cancelled' | 'payment_reminder'
  data?: Record<string, any>
  referenceId?: string
}

export interface WhatsAppConfig {
  apiKey: string
  gatewayUrl: string
}

export interface WhatsAppResponse {
  success: boolean
  messageId?: string
  error?: string
  response?: any
}

export class WhatsAppClient {
  private config: WhatsAppConfig | null = null
  private readonly DISABLED = true // Feature lock for audit phase

  /**
   * Initialize WhatsApp client with configuration
   */
  initialize(config: WhatsAppConfig): void {
    console.log('🔒 WhatsApp Client: Initialize called - FEATURE DISABLED FOR AUDIT')
    console.log('🔒 Config:', { apiKey: config.apiKey ? '***' : 'none', gatewayUrl: config.gatewayUrl })
    this.config = config
  }

  /**
   * Send WhatsApp notification - MOCKED
   */
  async sendNotification(notification: NotificationData): Promise<WhatsAppResponse> {
    console.log('🔒 WhatsApp Client: sendNotification called - FEATURE DISABLED FOR AUDIT')
    console.log('🔒 Notification data:', {
      userId: notification.userId,
      title: notification.title,
      type: notification.type,
      referenceId: notification.referenceId,
      dataKeys: notification.data ? Object.keys(notification.data) : []
    })

    if (this.DISABLED) {
      // Mock response - no actual API calls
      const mockMessageId = `MOCK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      console.log(`🔒 MOCK: Would send WhatsApp notification: ${notification.title}`)
      console.log(`🔒 MOCK: Message ID: ${mockMessageId}`)
      
      return {
        success: true,
        messageId: mockMessageId,
        response: { status: 'mocked', message: 'WhatsApp service temporarily disabled for audit' }
      }
    }

    // Original implementation (commented out during audit phase)
    /*
    if (!this.config) {
      return { success: false, error: 'WhatsApp client not initialized' }
    }

    try {
      // Format phone number (will be handled by getPhoneNumber method)
      const phoneNumber = this.getPhoneNumber(notification)
      if (!phoneNumber) {
        return { success: false, error: 'No phone number available' }
      }

      // Craft message based on notification type
      const message = this.craftMessage(notification)
      
      // Send WhatsApp message
      const waMessage: WhatsAppMessage = {
        to: this.formatPhoneNumber(phoneNumber),
        type: 'text',
        content: message
      }

      return await this.sendWhatsAppMessage(waMessage)
    } catch (error: any) {
      console.error('Error sending WhatsApp notification:', error)
      return { success: false, error: error.message }
    }
    */

    return { success: false, error: 'WhatsApp service disabled for audit phase' }
  }

  /**
   * Send bulk WhatsApp notifications - MOCKED
   */
  async sendBulkNotifications(notifications: NotificationData[]): Promise<{
    success: boolean
    total: number
    results: Array<{
      notificationId?: string
      success: boolean
      messageId?: string
      error?: string
    }>
  }> {
    console.log('🔒 WhatsApp Client: sendBulkNotifications called - FEATURE DISABLED FOR AUDIT')
    console.log(`🔒 Would send ${notifications.length} bulk notifications`)
    
    const results = []
    
    for (const notification of notifications) {
      console.log(`🔒 MOCK: Processing bulk notification: ${notification.title}`)
      const result = await this.sendNotification(notification)
      results.push({
        notificationId: notification.referenceId || notification.userId,
        ...result
      })
      
      // Mock delay (no actual rate limiting needed)
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    console.log(`🔒 MOCK: Bulk notifications completed - ${notifications.length} processed`)
    
    return {
      success: true,
      total: notifications.length,
      results
    }
  }

  /**
   * Get phone number from notification data
   */
  private getPhoneNumber(notification: NotificationData): string | null {
    if (notification.data?.customer_phone) {
      return notification.data.customer_phone
    }
    
    if (notification.data?.phone) {
      return notification.data.phone
    }
    
    return null
  }

  /**
   * Format phone number for WhatsApp
   */
  private formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '')
    
    // Add Indonesia country code if not present
    if (!cleaned.startsWith('62')) {
      if (cleaned.startsWith('0')) {
        cleaned = '62' + cleaned.substring(1)
      } else {
        cleaned = '62' + cleaned
      }
    }
    
    return cleaned + '@c.us' // WhatsApp format
  }

  /**
   * Craft message based on notification type
   */
  private craftMessage(notification: NotificationData): string {
    const { title, message, type, data } = notification
    
    switch (type) {
      case 'lead_generated':
        return `🎉 *${title}*\n\n${message}\n\nUnit: ${data?.unit_block || '-'}\nCustomer: ${data?.customer_name || '-'}\n\nTerima kasih telah menggunakan KPRFlow Enterprise.\n\nHubungi kami untuk info lebih lanjut.`

      case 'status_change':
        return `📋 *${title}*\n\n${message}\n\nStatus: ${data?.new_status || '-'}\n${data?.previous_status ? `Previous: ${data.previous_status}` : ''}\n\nLogin ke dashboard untuk detail lengkap.\n\nKPRFlow Enterprise`

      case 'document_uploaded':
        return `📄 *${title}*\n\n${message}\n\nDocument: ${data?.document_type || '-'}\nUploaded: ${new Date().toLocaleString('id-ID')}\n\nDocument sedang diproses oleh tim kami.\n\nKPRFlow Enterprise`

      case 'unit_cancelled':
        return `⚠️ *${title}*\n\n${message}\n\nUnit: ${data?.unit_block || '-'}\nReason: ${data?.cancellation_reason || '-'}\n\nHubungi marketing untuk informasi lebih lanjut.\n\nKPRFlow Enterprise`

      case 'payment_reminder':
        return `💰 *${title}*\n\n${message}\n\nAmount: ${data?.amount || '-'}\nDue Date: ${data?.due_date || '-'}\n\nSegera lakukan pembayaran untuk menghindari keterlambatan.\n\nKPRFlow Enterprise`

      default:
        return `*${title}*\n\n${message}\n\nKPRFlow Enterprise`
    }
  }

  /**
   * Send WhatsApp message via gateway - MOCKED
   */
  private async sendWhatsAppMessage(message: WhatsAppMessage): Promise<WhatsAppResponse> {
    console.log('🔒 WhatsApp Client: sendWhatsAppMessage called - FEATURE DISABLED FOR AUDIT')
    console.log('🔒 Message data:', {
      to: message.to,
      type: message.type,
      contentLength: message.content.length,
      hasFile: !!message.fileUrl
    })

    if (this.DISABLED) {
      // Mock response - no actual API calls
      const mockMessageId = `MOCK_MSG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      console.log(`🔒 MOCK: Would send WhatsApp message to ${message.to}`)
      console.log(`🔒 MOCK: Message ID: ${mockMessageId}`)
      
      return {
        success: true,
        messageId: mockMessageId,
        response: { status: 'mocked', message: 'WhatsApp service temporarily disabled for audit' }
      }
    }

    // Original implementation (commented out during audit phase)
    /*
    if (!this.config) {
      return { success: false, error: 'WhatsApp client not initialized' }
    }

    try {
      const payload: any = {
        apikey: this.config.apiKey,
        target: message.to,
        message: message.content,
        type: message.type
      }

      if (message.type === 'document' && message.fileUrl) {
        payload.file_url = message.fileUrl
        payload.file_name = message.fileName
      }

      const response = await fetch(this.config.gatewayUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()
      
      if (result.status) {
        return {
          success: true,
          messageId: result.id || result.message_id,
          response: result
        }
      } else {
        return {
          success: false,
          error: result.message || 'Failed to send WhatsApp message'
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      }
    }
    */

    return { success: false, error: 'WhatsApp service disabled for audit phase' }
  }

  /**
   * Handle webhook status update
   */
  async handleWebhookStatus(data: { messageId: string; status: string; timestamp: string }) {
    try {
      const { messageId, status, timestamp } = data
      
      console.log(`WhatsApp message ${messageId} status updated to ${status} at ${timestamp}`)
      
      // This would typically update the database
      // Implementation depends on your database client
      
      return { success: true }
    } catch (error: any) {
      console.error('Error handling webhook status:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Validate phone number format
   */
  validatePhoneNumber(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '')
    return cleaned.length >= 10 && cleaned.length <= 15
  }

  /**
   * Get message templates
   */
  getMessageTemplates() {
    return {
      lead_generated: {
        title: 'Lead Baru Terdeteksi',
        message: 'Ada lead baru yang perlu diproses'
      },
      status_change: {
        title: 'Status Aplikasi Berubah',
        message: 'Status aplikasi KPR telah diperbarui'
      },
      document_uploaded: {
        title: 'Dokumen Terunggah',
        message: 'Dokumen baru telah diunggah'
      },
      unit_cancelled: {
        title: 'Unit Dibatalkan',
        message: 'Unit telah dibatalkan'
      },
      payment_reminder: {
        title: 'Pengingat Pembayaran',
        message: 'Ada pembayaran yang jatuh tempo'
      }
    }
  }
}

// Export singleton instance
export const whatsAppClient = new WhatsAppClient()
