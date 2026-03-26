/**
 * KPRFlow Enterprise - Notification Types
 * Adapted from bramsray2 whatsapp-engine for cross-platform use
 */

export interface BaseNotification {
  id: string
  user_id?: string
  title: string
  message: string
  type: NotificationType
  channel: NotificationChannel
  status: NotificationStatus
  data?: Record<string, any>
  reference_id?: string
  created_at: string
  updated_at?: string
  sent_at?: string
  delivered_at?: string
  read_at?: string
  message_id?: string
  error?: string
}

export interface Notification extends BaseNotification {
  template?: NotificationTemplate
  recipient?: NotificationRecipient
  delivery_attempts?: number
  priority?: NotificationPriority
  scheduled_at?: string
  expires_at?: string
}

export interface NotificationTemplate {
  id: string
  name: string
  type: NotificationType
  channel: NotificationChannel
  subject: string
  body: string
  variables: string[]
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string
}

export interface NotificationRecipient {
  user_id?: string
  phone?: string
  email?: string
  device_token?: string
  preferred_channel?: NotificationChannel
  timezone?: string
  language?: string
}

export interface NotificationSettings {
  user_id: string
  channels: {
    whatsapp: boolean
    email: boolean
    push: boolean
    sms: boolean
  }
  types: {
    lead_generated: boolean
    status_change: boolean
    document_uploaded: boolean
    unit_cancelled: boolean
    payment_reminder: boolean
    system_updates: boolean
    marketing: boolean
  }
  quiet_hours: {
    enabled: boolean
    start_time?: string
    end_time?: string
    timezone?: string
  }
  frequency_limits: {
    per_hour: number
    per_day: number
    per_week: number
  }
  created_at: string
  updated_at: string
}

export interface NotificationQueue {
  id: string
  notification_id: string
  channel: NotificationChannel
  priority: NotificationPriority
  scheduled_at: string
  attempts: number
  last_attempt_at?: string
  next_attempt_at?: string
  status: QueueStatus
  error?: string
  created_at: string
}

export interface NotificationLog {
  id: string
  notification_id: string
  channel: NotificationChannel
  action: LogAction
  status: NotificationStatus
  message_id?: string
  response?: any
  error?: string
  duration?: number
  created_at: string
  metadata?: Record<string, any>
}

export interface NotificationStatistics {
  total_sent: number
  total_delivered: number
  total_failed: number
  total_read: number
  delivery_rate: number
  read_rate: number
  failure_rate: number
  average_delivery_time: number
  by_channel: Record<NotificationChannel, ChannelStats>
  by_type: Record<NotificationType, TypeStats>
  by_date: Record<string, DailyStats>
  top_errors: Array<{
    error: string
    count: number
    percentage: number
  }>
}

export interface ChannelStats {
  sent: number
  delivered: number
  failed: number
  delivery_rate: number
  average_time: number
}

export interface TypeStats {
  sent: number
  delivered: number
  failed: number
  delivery_rate: number
  average_time: number
}

export interface DailyStats {
  sent: number
  delivered: number
  failed: number
  read: number
}

export interface NotificationBatch {
  id: string
  name: string
  type: NotificationType
  channel: NotificationChannel
  total_recipients: number
  processed: number
  successful: number
  failed: number
  status: BatchStatus
  started_at?: string
  completed_at?: string
  created_by: string
  created_at: string
}

export interface NotificationRule {
  id: string
  name: string
  description: string
  trigger: NotificationTrigger
  conditions: NotificationCondition[]
  actions: NotificationAction[]
  is_active: boolean
  priority: number
  created_at: string
  updated_at: string
  created_by: string
}

export interface NotificationTrigger {
  event: string
  entity_type: string
  conditions?: Record<string, any>
}

export interface NotificationCondition {
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'in' | 'not_in'
  value: any
}

export interface NotificationAction {
  type: 'send_notification' | 'update_status' | 'create_task' | 'send_webhook'
  config: Record<string, any>
}

// Type definitions
export type NotificationType = 
  | 'lead_generated'
  | 'status_change'
  | 'document_uploaded'
  | 'unit_cancelled'
  | 'payment_reminder'
  | 'system_updates'
  | 'marketing'
  | 'security_alert'
  | 'maintenance'
  | 'custom'

export type NotificationChannel = 
  | 'whatsapp'
  | 'email'
  | 'push'
  | 'sms'
  | 'in_app'

export type NotificationStatus = 
  | 'pending'
  | 'processing'
  | 'sent'
  | 'delivered'
  | 'read'
  | 'failed'
  | 'cancelled'
  | 'expired'

export type NotificationPriority = 
  | 'low'
  | 'normal'
  | 'high'
  | 'urgent'

export type QueueStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'

export type BatchStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'

export type LogAction = 
  | 'created'
  | 'queued'
  | 'sent'
  | 'delivered'
  | 'read'
  | 'failed'
  | 'cancelled'
  | 'retried'

// Request/Response types
export interface NotificationCreateRequest {
  user_id?: string
  title: string
  message: string
  type: NotificationType
  channel?: NotificationChannel
  data?: Record<string, any>
  reference_id?: string
  priority?: NotificationPriority
  scheduled_at?: string
  expires_at?: string
  recipient?: NotificationRecipient
}

export interface NotificationUpdateRequest {
  status?: NotificationStatus
  message_id?: string
  error?: string
  delivered_at?: string
  read_at?: string
}

export interface NotificationSearchRequest {
  user_id?: string
  type?: NotificationType
  channel?: NotificationChannel
  status?: NotificationStatus
  date_from?: string
  date_to?: string
  search?: string
  limit?: number
  offset?: number
}

export interface NotificationSearchResponse {
  notifications: Notification[]
  total: number
  limit: number
  offset: number
  has_more: boolean
}

export interface NotificationBulkRequest {
  notifications: NotificationCreateRequest[]
  batch_name?: string
  priority?: NotificationPriority
  scheduled_at?: string
}

// Template types
export interface TemplateVariable {
  name: string
  type: 'string' | 'number' | 'boolean' | 'date' | 'object'
  required: boolean
  default_value?: any
  description?: string
}

export interface TemplatePreview {
  id: string
  variables: Record<string, any>
  rendered_subject: string
  rendered_body: string
  preview_mode: 'text' | 'html' | 'whatsapp'
}

// Webhook types
export interface NotificationWebhook {
  id: string
  url: string
  events: NotificationType[]
  secret?: string
  is_active: boolean
  retry_count: number
  timeout: number
  headers?: Record<string, string>
  created_at: string
  updated_at: string
}

export interface WebhookPayload {
  event: NotificationType
  notification: Notification
  timestamp: string
  signature?: string
}

// Utility types
export type NotificationWithRecipient = Notification & {
  recipient: NotificationRecipient
}

export type NotificationWithTemplate = Notification & {
  template: NotificationTemplate
}

export type NotificationFull = Notification & {
  recipient: NotificationRecipient
  template?: NotificationTemplate
  logs: NotificationLog[]
}

// Type guards
export function isValidNotificationType(type: string): type is NotificationType {
  const validTypes: NotificationType[] = [
    'lead_generated', 'status_change', 'document_uploaded', 'unit_cancelled',
    'payment_reminder', 'system_updates', 'marketing', 'security_alert',
    'maintenance', 'custom'
  ]
  return validTypes.includes(type as NotificationType)
}

export function isValidNotificationChannel(channel: string): channel is NotificationChannel {
  const validChannels: NotificationChannel[] = ['whatsapp', 'email', 'push', 'sms', 'in_app']
  return validChannels.includes(channel as NotificationChannel)
}

export function isValidNotificationStatus(status: string): status is NotificationStatus {
  const validStatuses: NotificationStatus[] = [
    'pending', 'processing', 'sent', 'delivered', 'read', 'failed', 'cancelled', 'expired'
  ]
  return validStatuses.includes(status as NotificationStatus)
}

export function isValidNotificationPriority(priority: string): priority is NotificationPriority {
  const validPriorities: NotificationPriority[] = ['low', 'normal', 'high', 'urgent']
  return validPriorities.includes(priority as NotificationPriority)
}

// Default values
export const DEFAULT_NOTIFICATION_PRIORITY: NotificationPriority = 'normal'
export const DEFAULT_NOTIFICATION_STATUS: NotificationStatus = 'pending'
export const DEFAULT_NOTIFICATION_CHANNEL: NotificationChannel = 'in_app'

// Configuration constants
export const NOTIFICATION_LIMITS = {
  MAX_TITLE_LENGTH: 200,
  MAX_MESSAGE_LENGTH: 2000,
  MAX_BATCH_SIZE: 1000,
  MAX_RETRY_ATTEMPTS: 5,
  DEFAULT_RETRY_DELAY: 60000, // 1 minute
  MAX_RETRY_DELAY: 3600000, // 1 hour
  QUIET_HOURS_START: '22:00',
  QUIET_HOURS_END: '08:00'
}

export const NOTIFICATION_TEMPLATES = {
  LEAD_GENERATED: {
    subject: '🎉 Lead Baru Terdeteksi',
    body: 'Ada lead baru yang perlu diproses. Customer: {{customer_name}} | Unit: {{unit_block}} | Phone: {{customer_phone}}'
  },
  STATUS_CHANGE: {
    subject: '📋 Status Aplikasi Berubah',
    body: 'Status aplikasi KPR Anda telah berubah menjadi {{new_status}}. {{previous_status ? `Status sebelumnya: {{previous_status}}` : ""}}'
  },
  DOCUMENT_UPLOADED: {
    subject: '📄 Dokumen Terunggah',
    body: 'Dokumen {{document_type}} telah berhasil diunggah. Dokumen sedang diproses oleh tim kami.'
  },
  UNIT_CANCELLED: {
    subject: '⚠️ Unit Dibatalkan',
    body: 'Unit {{unit_block}} telah dibatalkan. Alasan: {{cancellation_reason}}. Hubungi marketing untuk info lebih lanjut.'
  },
  PAYMENT_REMINDER: {
    subject: '💰 Pengingat Pembayaran',
    body: 'Pembayaran sebesar {{amount}} jatuh tempo pada {{due_date}}. Segera lakukan pembayaran.'
  }
}

export const NOTIFICATION_COLORS: Record<NotificationStatus, string> = {
  'pending': 'gray',
  'processing': 'blue',
  'sent': 'yellow',
  'delivered': 'green',
  'read': 'emerald',
  'failed': 'red',
  'cancelled': 'gray',
  'expired': 'orange'
}

export const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  'lead_generated': '🎉',
  'status_change': '📋',
  'document_uploaded': '📄',
  'unit_cancelled': '⚠️',
  'payment_reminder': '💰',
  'system_updates': '🔧',
  'marketing': '📢',
  'security_alert': '🚨',
  'maintenance': '🔧',
  'custom': '📌'
}
