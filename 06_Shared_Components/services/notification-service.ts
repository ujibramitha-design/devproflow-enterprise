/**
 * KPRFlow Enterprise - Shared Notification Service
 * Adapted from bramsray2 whatsapp-engine for cross-platform use
 */

import { whatsAppClient, NotificationData } from '../api_clients/whatsapp-client'

export interface NotificationChannel {
  type: 'whatsapp' | 'email' | 'push' | 'sms'
  enabled: boolean
  config?: any
}

export interface NotificationTemplate {
  id: string
  name: string
  type: NotificationData['type']
  subject: string
  body: string
  variables: string[]
}

export interface NotificationLog {
  id: string
  userId?: string
  title: string
  message: string
  type: NotificationData['type']
  channel: string
  status: 'pending' | 'sent' | 'delivered' | 'failed'
  messageId?: string
  data?: any
  referenceId?: string
  createdAt: string
  deliveredAt?: string
  error?: string
}

export interface NotificationServiceConfig {
  channels: NotificationChannel[]
  templates: NotificationTemplate[]
  rateLimiting: {
    enabled: boolean
    maxPerMinute: number
    maxPerHour: number
  }
  retryPolicy: {
    enabled: boolean
    maxRetries: number
    retryDelay: number
  }
}

export class NotificationService {
  private static instance: NotificationService
  private config: NotificationServiceConfig | null = null
  private notificationQueue: NotificationData[] = []
  private isProcessing = false

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  /**
   * Initialize notification service
   */
  initialize(config: NotificationServiceConfig): void {
    this.config = config
  }

  /**
   * Send notification through configured channels
   */
  async sendNotification(notification: NotificationData): Promise<{
    success: boolean
    results: Array<{
      channel: string
      success: boolean
      messageId?: string
      error?: string
    }>
  }> {
    if (!this.config) {
      throw new Error('Notification service not initialized')
    }

    const results = []
    const enabledChannels = this.config.channels.filter(ch => ch.enabled)

    for (const channel of enabledChannels) {
      try {
        const result = await this.sendViaChannel(notification, channel.type)
        results.push({
          channel: channel.type,
          ...result
        })
      } catch (error: any) {
        results.push({
          channel: channel.type,
          success: false,
          error: error.message
        })
      }
    }

    const success = results.some(r => r.success)
    
    // Log notification
    await this.logNotification(notification, results)
    
    return { success, results }
  }

  /**
   * Send notification via specific channel
   */
  private async sendViaChannel(
    notification: NotificationData,
    channel: NotificationChannel['type']
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    switch (channel) {
      case 'whatsapp':
        return await this.sendWhatsApp(notification)
      
      case 'email':
        return await this.sendEmail(notification)
      
      case 'push':
        return await this.sendPush(notification)
      
      case 'sms':
        return await this.sendSMS(notification)
      
      default:
        return { success: false, error: `Unsupported channel: ${channel}` }
    }
  }

  /**
   * Send WhatsApp notification
   */
  private async sendWhatsApp(notification: NotificationData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const result = await whatsAppClient.sendNotification(notification)
      return {
        success: result.success,
        messageId: result.messageId,
        error: result.error
      }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Send email notification
   */
  private async sendEmail(notification: NotificationData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // This would integrate with email service (SendGrid, SES, etc.)
      console.log('Sending email notification:', notification)
      
      // Mock implementation
      const messageId = `email_${Date.now()}`
      return { success: true, messageId }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Send push notification
   */
  private async sendPush(notification: NotificationData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // This would integrate with push notification service (FCM, APNs, etc.)
      console.log('Sending push notification:', notification)
      
      // Mock implementation
      const messageId = `push_${Date.now()}`
      return { success: true, messageId }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Send SMS notification
   */
  private async sendSMS(notification: NotificationData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // This would integrate with SMS service (Twilio, etc.)
      console.log('Sending SMS notification:', notification)
      
      // Mock implementation
      const messageId = `sms_${Date.now()}`
      return { success: true, messageId }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Send bulk notifications
   */
  async sendBulkNotifications(notifications: NotificationData[]): Promise<{
    success: boolean
    total: number
    results: Array<{
      notificationId?: string
      success: boolean
      results: Array<{
        channel: string
        success: boolean
        messageId?: string
        error?: string
      }>
    }>
  }> {
    const results = []
    
    for (const notification of notifications) {
      const result = await this.sendNotification(notification)
      results.push({
        notificationId: notification.referenceId || notification.userId,
        success: result.success,
        results: result.results
      })
      
      // Add delay to respect rate limiting
      if (this.config?.rateLimiting.enabled) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
    
    return {
      success: true,
      total: notifications.length,
      results
    }
  }

  /**
   * Queue notification for later processing
   */
  queueNotification(notification: NotificationData): void {
    this.notificationQueue.push(notification)
    
    if (!this.isProcessing) {
      this.processQueue()
    }
  }

  /**
   * Process notification queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.notificationQueue.length === 0) {
      return
    }

    this.isProcessing = true

    while (this.notificationQueue.length > 0) {
      const notification = this.notificationQueue.shift()
      if (notification) {
        try {
          await this.sendNotification(notification)
        } catch (error) {
          console.error('Error processing queued notification:', error)
        }
      }
    }

    this.isProcessing = false
  }

  /**
   * Get notification template
   */
  getTemplate(templateId: string): NotificationTemplate | null {
    if (!this.config) return null
    
    return this.config.templates.find(t => t.id === templateId) || null
  }

  /**
   * Create notification from template
   */
  createFromTemplate(
    templateId: string,
    variables: Record<string, any>,
    userId?: string,
    referenceId?: string
  ): NotificationData | null {
    const template = this.getTemplate(templateId)
    if (!template) return null

    // Replace variables in template
    let subject = template.subject
    let body = template.body
    
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`
      subject = subject.replace(new RegExp(placeholder, 'g'), String(value))
      body = body.replace(new RegExp(placeholder, 'g'), String(value))
    })

    return {
      userId,
      title: subject,
      message: body,
      type: template.type,
      data: variables,
      referenceId
    }
  }

  /**
   * Log notification
   */
  private async logNotification(
    notification: NotificationData,
    results: Array<{ channel: string; success: boolean; messageId?: string; error?: string }>
  ): Promise<void> {
    const logs: NotificationLog[] = results.map(result => ({
      id: `log_${Date.now()}_${Math.random()}`,
      userId: notification.userId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      channel: result.channel,
      status: result.success ? 'sent' : 'failed',
      messageId: result.messageId,
      data: notification.data,
      referenceId: notification.referenceId,
      createdAt: new Date().toISOString(),
      error: result.error
    }))

    // This would store logs in database
    console.log('Notification logs:', logs)
  }

  /**
   * Get notification logs
   */
  async getNotificationLogs(
    userId?: string,
    limit: number = 50
  ): Promise<NotificationLog[]> {
    // This would fetch logs from database
    console.log('Getting notification logs for user:', userId, 'limit:', limit)
    return []
  }

  /**
   * Handle webhook for delivery status
   */
  async handleDeliveryWebhook(data: {
    messageId: string
    status: 'delivered' | 'failed' | 'pending'
    timestamp: string
    channel: string
  }): Promise<void> {
    try {
      console.log('Delivery webhook:', data)
      
      // This would update notification status in database
      // Implementation depends on your database client
      
    } catch (error) {
      console.error('Error handling delivery webhook:', error)
    }
  }

  /**
   * Get notification statistics
   */
  async getStatistics(
    startDate?: string,
    endDate?: string
  ): Promise<{
    total: number
    sent: number
    delivered: number
    failed: number
    byChannel: Record<string, number>
    byType: Record<string, number>
  }> {
    // This would calculate statistics from database
    console.log('Getting notification statistics from', startDate, 'to', endDate)
    
    return {
      total: 0,
      sent: 0,
      delivered: 0,
      failed: 0,
      byChannel: {},
      byType: {}
    }
  }

  /**
   * Test notification service
   */
  async testNotification(): Promise<{
    success: boolean
    results: Array<{
      channel: string
      success: boolean
      error?: string
    }>
  }> {
    const testNotification: NotificationData = {
      title: 'Test Notification',
      message: 'This is a test notification from KPRFlow Enterprise',
      type: 'status_change',
      data: { test: true }
    }

    return await this.sendNotification(testNotification)
  }

  /**
   * Get service status
   */
  getStatus(): {
    initialized: boolean
    queueSize: number
    isProcessing: boolean
    channels: NotificationChannel[]
  } {
    return {
      initialized: !!this.config,
      queueSize: this.notificationQueue.length,
      isProcessing: this.isProcessing,
      channels: this.config?.channels || []
    }
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance()
