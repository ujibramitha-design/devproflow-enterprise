/**
 * KPRFlow Enterprise - Supabase Types
 * Fixed TypeScript types for Supabase query builders
 */

// Supabase query builder types (using any for compatibility)
export interface SupabaseQueryBuilder {
  in(column: string, values: any[]): any
  eq(column: string, value: any): any
  gte(column: string, value: any): any
  lte(column: string, value: any): any
  or(filters: string): any
  then<TResult = any>(resolve?: (value: TResult) => TResult | PromiseLike<TResult>, reject?: (reason: any) => void): Promise<TResult>
}

// Enhanced Application types with proper Supabase query support
export interface ApplicationFilters {
  status?: ApplicationStatus[]
  customer_id?: string
  unit_id?: string
  bank_id?: string
  date_from?: string
  date_to?: string
  search?: string
}

export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'warning' | 'overdue' | 'on_track'

export interface ApplicationListResponse {
  data?: Application[]
  error?: string
  count?: number
  has_more?: boolean
  page?: number
  limit?: number
}

export interface ApplicationResponse {
  data?: Application
  error?: string
}

export interface Application {
  id: string
  customer_id: string
  unit_id: string
  bank_id?: string
  status: ApplicationStatus
  created_at: string
  updated_at: string
  notes?: string
  data?: Record<string, any>
  customer?: Customer
  unit?: Unit
  bank?: Bank
  documents?: ApplicationDocument[]
  status_history?: ApplicationStatusHistory[]
  sla_info?: ApplicationSLAInfo
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  nik: string
  npwp?: string
  birth_date?: string
  birth_place?: string
  address_ktp: string
  address_domisili: string
  marital_status: 'single' | 'married' | 'divorced' | 'widowed'
  occupation?: string
  monthly_income?: number
  emergency_contact?: EmergencyContact
  created_at: string
  updated_at: string
}

export interface Unit {
  id: string
  block: string
  unit_number: string
  type: string
  price: number
  status: string
  created_at: string
  updated_at: string
}

export interface Bank {
  id: string
  name: string
  code: string
  created_at: string
  updated_at: string
}

export interface EmergencyContact {
  name: string
  phone: string
  address: string
  relationship: string
}

export interface ApplicationDocument {
  id: string
  application_id: string
  document_type: string
  file_url: string
  file_name: string
  status: string
  created_at: string
  updated_at: string
}

export interface ApplicationStatusHistory {
  id: string
  application_id: string
  from_status: ApplicationStatus
  to_status: ApplicationStatus
  changed_by: string
  notes?: string
  created_at: string
}

export interface ApplicationSLAInfo {
  status: 'on_track' | 'warning' | 'overdue'
  days_remaining?: number
  sla_deadline?: string
  current_stage: string
}

// Enhanced Supabase query builder types (simplified for compatibility)
export interface EnhancedQueryBuilder {
  in(column: string, values: any[]): any
  eq(column: string, value: any): any
  gte(column: string, value: any): any
  lte(column: string, value: any): any
  or(filters: string): any
  then<TResult = any>(resolve?: (value: TResult) => TResult | PromiseLike<TResult>, reject?: (reason: any) => void): Promise<TResult>
}

// Common types
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  success: boolean
  message?: string
}

export interface PaginatedResponse<T = any> {
  data: T[]
  count?: number
  page?: number
  limit?: number
  has_more?: boolean
}

export interface ApplicationCreateRequest {
  customer_id: string
  unit_id: string
  bank_id?: string
  notes?: string
  data?: Record<string, any>
}

export interface ApplicationUpdateRequest {
  status?: ApplicationStatus
  notes?: string
  data?: Record<string, any>
}

export interface ApplicationStatistics {
  total_applications: number
  by_status: Record<ApplicationStatus, number>
  by_bank: Record<string, number>
  by_unit_type: Record<string, number>
  average_processing_time: number
  completion_rate: number
}
