/**
 * KPRFlow Enterprise - Application Types (Local)
 * Temporary local types until shared components integration
 */

export interface ApplicationTypes {
  id: string
  customer_id: string
  unit_id: string
  application_number: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  source: string
  campaign_id?: string
  created_at: string
  updated_at: string
  customer_name?: string
  unit_type?: string
  unit_price?: number
  progress?: number
  notes?: string
}

export interface ApplicationStats {
  total: number
  pending: number
  approved: number
  rejected: number
  in_progress: number
}

export interface ApplicationFilters {
  status?: string
  priority?: string
  date_range?: {
    start: string
    end: string
  }
  customer_name?: string
}
