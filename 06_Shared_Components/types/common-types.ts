/**
 * KPRFlow Enterprise - Common Types
 * Shared types used across the application
 */

// Base response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp?: string
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  pagination: {
    page: number
    limit: number
    total: number
    has_more: boolean
    next_page?: number
    prev_page?: number
  }
}

export interface ErrorResponse {
  success: false
  error: string
  code?: string
  details?: any
  timestamp?: string
}

// Common entity types
export interface BaseEntity {
  id: string
  created_at: string
  updated_at?: string
  created_by?: string
  updated_by?: string
}

export interface User extends BaseEntity {
  name: string
  email: string
  phone?: string
  avatar?: string
  role: UserRole
  status: UserStatus
  last_login?: string
  permissions: Permission[]
  preferences: UserPreferences
}

export interface UserProfile {
  user_id: string
  bio?: string
  address?: string
  city?: string
  province?: string
  country?: string
  postal_code?: string
  timezone?: string
  language?: string
  notifications: NotificationPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  currency: string
  date_format: string
  time_format: '12h' | '24h'
  notifications: NotificationPreferences
}

export interface NotificationPreferences {
  email: boolean
  push: boolean
  sms: boolean
  whatsapp: boolean
  marketing: boolean
  updates: boolean
  quiet_hours: {
    enabled: boolean
    start_time?: string
    end_time?: string
  }
}

// Permission and role types
export type UserRole = 
  | 'super_admin'
  | 'admin'
  | 'manager'
  | 'supervisor'
  | 'agent'
  | 'customer'
  | 'guest'

export type UserStatus = 
  | 'active'
  | 'inactive'
  | 'suspended'
  | 'pending'
  | 'deleted'

export interface Permission {
  id: string
  name: string
  resource: string
  action: string
  conditions?: Record<string, any>
}

// File and media types
export interface FileUpload {
  id: string
  name: string
  original_name: string
  mime_type: string
  size: number
  url: string
  thumbnail_url?: string
  path: string
  bucket: string
  uploaded_by: string
  created_at: string
  metadata?: Record<string, any>
}

export interface ImageFile extends FileUpload {
  width?: number
  height?: number
  aspect_ratio?: number
  dominant_color?: string
}

export interface DocumentFile extends FileUpload {
  pages?: number
  extracted_text?: string
  is_searchable?: boolean
}

// Location types
export interface Address {
  street?: string
  city?: string
  province?: string
  country?: string
  postal_code?: string
  coordinates?: Coordinates
}

export interface Coordinates {
  latitude: number
  longitude: number
}

export interface Location {
  id?: string
  name: string
  address: Address
  type: LocationType
  coordinates?: Coordinates
  radius?: number
  metadata?: Record<string, any>
}

export type LocationType = 
  | 'office'
  | 'project'
  | 'customer'
  | 'bank'
  | 'notary'
  | 'other'

// Financial types
export interface Money {
  amount: number
  currency: string
  formatted?: string
}

export interface CurrencyRate {
  from: string
  to: string
  rate: number
  date: string
}

export interface Payment {
  id: string
  reference_id: string
  amount: Money
  method: PaymentMethod
  status: PaymentStatus
  paid_at?: string
  due_date?: string
  paid_by?: string
  payment_details?: Record<string, any>
  created_at: string
}

export type PaymentMethod = 
  | 'cash'
  | 'transfer'
  | 'check'
  | 'credit_card'
  | 'debit_card'
  | 'digital_wallet'
  | 'installment'
  | 'other'

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded'
  | 'partial'

// Search and filter types
export interface SearchRequest {
  query?: string
  filters?: Record<string, any>
  sort?: SortOption[]
  pagination?: PaginationOptions
  facets?: string[]
}

export interface SearchResponse<T = any> {
  results: T[]
  total: number
  facets?: Record<string, Array<{ value: string; count: number }>>
  suggestions?: string[]
  took: number
}

export interface SortOption {
  field: string
  direction: 'asc' | 'desc'
}

export interface PaginationOptions {
  page: number
  limit: number
  offset?: number
}

export interface FilterOption {
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'in' | 'not_in' | 'between'
  value: any
}

// Audit and logging types
export interface AuditLog extends BaseEntity {
  user_id?: string
  action: string
  entity_type: string
  entity_id?: string
  old_values?: Record<string, any>
  new_values?: Record<string, any>
  ip_address?: string
  user_agent?: string
  metadata?: Record<string, any>
}

export interface ActivityLog extends BaseEntity {
  user_id?: string
  activity: string
  description?: string
  entity_type?: string
  entity_id?: string
  metadata?: Record<string, any>
  ip_address?: string
}

// Configuration types
export interface AppConfig {
  app_name: string
  version: string
  environment: 'development' | 'staging' | 'production'
  features: Record<string, boolean>
  limits: Record<string, number>
  maintenance?: MaintenanceInfo
}

export interface MaintenanceInfo {
  enabled: boolean
  message?: string
  start_time?: string
  end_time?: string
  affected_modules?: string[]
}

// Validation types
export interface ValidationResult {
  is_valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export interface ValidationError {
  field: string
  message: string
  code?: string
  value?: any
}

export interface ValidationWarning {
  field: string
  message: string
  code?: string
  value?: any
}

// Export and import types
export interface ExportRequest {
  type: ExportType
  format: ExportFormat
  filters?: Record<string, any>
  fields?: string[]
  options?: ExportOptions
}

export interface ExportOptions {
  include_headers?: boolean
  date_format?: string
  timezone?: string
  encoding?: string
}

export type ExportType = 
  | 'applications'
  | 'customers'
  | 'units'
  | 'reports'
  | 'audit_logs'
  | 'custom'

export type ExportFormat = 
  | 'csv'
  | 'xlsx'
  | 'pdf'
  | 'json'
  | 'xml'

// Workflow types
export interface Workflow {
  id: string
  name: string
  description?: string
  entity_type: string
  steps: WorkflowStep[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface WorkflowStep {
  id: string
  name: string
  description?: string
  type: StepType
  config: Record<string, any>
  conditions?: WorkflowCondition[]
  actions?: WorkflowAction[]
  order: number
  is_required: boolean
}

export type StepType = 
  | 'manual'
  | 'automated'
  | 'approval'
  | 'notification'
  | 'validation'
  | 'integration'

export interface WorkflowCondition {
  field: string
  operator: string
  value: any
}

export interface WorkflowAction {
  type: 'send_notification' | 'update_status' | 'create_task' | 'call_api' | 'custom'
  config: Record<string, any>
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// Type guards
export function isValidUserRole(role: string): role is UserRole {
  const validRoles: UserRole[] = ['super_admin', 'admin', 'manager', 'supervisor', 'agent', 'customer', 'guest']
  return validRoles.includes(role as UserRole)
}

export function isValidUserStatus(status: string): status is UserStatus {
  const validStatuses: UserStatus[] = ['active', 'inactive', 'suspended', 'pending', 'deleted']
  return validStatuses.includes(status as UserStatus)
}

export function isValidPaymentMethod(method: string): method is PaymentMethod {
  const validMethods: PaymentMethod[] = ['cash', 'transfer', 'check', 'credit_card', 'debit_card', 'digital_wallet', 'installment', 'other']
  return validMethods.includes(method as PaymentMethod)
}

export function isValidPaymentStatus(status: string): status is PaymentStatus {
  const validStatuses: PaymentStatus[] = ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'partial']
  return validStatuses.includes(status as PaymentStatus)
}

// Default values
export const DEFAULT_USER_ROLE: UserRole = 'customer'
export const DEFAULT_USER_STATUS: UserStatus = 'active'
export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 20
}

export const DEFAULT_CURRENCY = 'IDR'
export const DEFAULT_TIMEZONE = 'Asia/Jakarta'
export const DEFAULT_LANGUAGE = 'id'

// Constants
export const USER_ROLES: UserRole[] = ['super_admin', 'admin', 'manager', 'supervisor', 'agent', 'customer', 'guest']
export const USER_STATUSES: UserStatus[] = ['active', 'inactive', 'suspended', 'pending', 'deleted']
export const PAYMENT_METHODS: PaymentMethod[] = ['cash', 'transfer', 'check', 'credit_card', 'debit_card', 'digital_wallet', 'installment', 'other']
export const PAYMENT_STATUSES: PaymentStatus[] = ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'partial']

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  'super_admin': ['*'],
  'admin': ['users.*', 'applications.*', 'units.*', 'reports.*', 'settings.*'],
  'manager': ['applications.*', 'units.read', 'customers.*', 'reports.read'],
  'supervisor': ['applications.*', 'customers.read', 'reports.read'],
  'agent': ['applications.create', 'applications.read', 'customers.create', 'customers.read'],
  'customer': ['applications.own', 'profile.own'],
  'guest': ['applications.read', 'customers.read']
}

export const FILE_SIZE_LIMITS = {
  IMAGE: 10 * 1024 * 1024, // 10MB
  DOCUMENT: 50 * 1024 * 1024, // 50MB
  VIDEO: 100 * 1024 * 1024, // 100MB
  AUDIO: 20 * 1024 * 1024   // 20MB
}

export const SUPPORTED_FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  SPREADSHEET: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  PRESENTATION: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']
}
