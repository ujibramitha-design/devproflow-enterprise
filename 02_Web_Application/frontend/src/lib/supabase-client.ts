/**
 * KPRFlow Enterprise - Enhanced Supabase Client for Desktop Application
 * Integrated with 06_Shared_Components and 04_Supabase_Database
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'

export interface SupabaseConfig {
  url: string
  anonKey: string
  serviceKey?: string
}

export interface Database {
  public: {
    Tables: {
      kpr_applications: {
        Row: {
          id: string
          applicant_id: string
          property_id: string
          amount: number
          status: 'pending' | 'approved' | 'rejected' | 'completed'
          created_at: string
          updated_at: string
          documents: string[]
          notes?: string
        }
        Insert: {
          id?: string
          applicant_id: string
          property_id: string
          amount: number
          status?: 'pending' | 'approved' | 'rejected' | 'completed'
          created_at?: string
          updated_at?: string
          documents?: string[]
          notes?: string
        }
        Update: {
          id?: string
          applicant_id?: string
          property_id?: string
          amount?: number
          status?: 'pending' | 'approved' | 'rejected' | 'completed'
          updated_at?: string
          documents?: string[]
          notes?: string
        }
      }
      applicants: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          nik: string
          income: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          nik: string
          income: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          nik?: string
          income?: number
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          name: string
          type: 'residential' | 'commercial' | 'mixed'
          price: number
          location: string
          developer_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'residential' | 'commercial' | 'mixed'
          price: number
          location: string
          developer_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'residential' | 'commercial' | 'mixed'
          price?: number
          location?: string
          developer_id?: string
          updated_at?: string
        }
      }
    }
  }
}

export class SupabaseClientManager {
  private static instance: SupabaseClientManager
  private client: SupabaseClient<Database> | null = null
  private config: SupabaseConfig | null = null

  private constructor() {}

  static getInstance(): SupabaseClientManager {
    if (!SupabaseClientManager.instance) {
      SupabaseClientManager.instance = new SupabaseClientManager()
    }
    return SupabaseClientManager.instance
  }

  /**
   * Initialize Supabase client with configuration
   */
  initialize(config: SupabaseConfig): void {
    this.config = config
    this.client = createClient<Database>(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  }

  /**
   * Get Supabase client instance
   */
  getClient(): SupabaseClient<Database> {
    if (!this.client) {
      throw new Error('Supabase client not initialized. Call initialize() first.')
    }
    return this.client
  }

  /**
   * KPR Application CRUD Operations
   */
  async createApplication(application: Database['public']['Tables']['kpr_applications']['Insert']) {
    const client = this.getClient()
    const { data, error } = await client
      .from('kpr_applications')
      .insert(application)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getApplications() {
    const client = this.getClient()
    const { data, error } = await client
      .from('kpr_applications')
      .select(`
        *,
        applicants (*),
        properties (*)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async getApplication(id: string) {
    const client = this.getClient()
    const { data, error } = await client
      .from('kpr_applications')
      .select(`
        *,
        applicants (*),
        properties (*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  async updateApplication(id: string, updates: Database['public']['Tables']['kpr_applications']['Update']) {
    const client = this.getClient()
    const { data, error } = await client
      .from('kpr_applications')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteApplication(id: string) {
    const client = this.getClient()
    const { error } = await client
      .from('kpr_applications')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  /**
   * Applicant CRUD Operations
   */
  async createApplicant(applicant: Database['public']['Tables']['applicants']['Insert']) {
    const client = this.getClient()
    const { data, error } = await client
      .from('applicants')
      .insert(applicant)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getApplicants() {
    const client = this.getClient()
    const { data, error } = await client
      .from('applicants')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  /**
   * Property CRUD Operations
   */
  async getProperties() {
    const client = this.getClient()
    const { data, error } = await client
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  /**
   * Real-time subscriptions
   */
  subscribeToApplications(callback: (payload: any) => void) {
    const client = this.getClient()
    return client
      .channel('kpr_applications')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'kpr_applications' },
        callback
      )
      .subscribe()
  }

  subscribeToApplication(id: string, callback: (payload: any) => void) {
    const client = this.getClient()
    return client
      .channel(`application_${id}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'kpr_applications', filter: `id=eq.${id}` },
        callback
      )
      .subscribe()
  }

  /**
   * File upload operations
   */
  async uploadDocument(file: File, path: string) {
    const client = this.getClient()
    const { data, error } = await client.storage
      .from('documents')
      .upload(path, file)

    if (error) throw error
    return data
  }

  async getDocumentUrl(path: string) {
    const client = this.getClient()
    const { data } = client.storage
      .from('documents')
      .getPublicUrl(path)

    return data.publicUrl
  }

  /**
   * Authentication operations
   */
  async signIn(email: string, password: string) {
    const client = this.getClient()
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  }

  async signUp(email: string, password: string, metadata?: any) {
    const client = this.getClient()
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })

    if (error) throw error
    return data
  }

  async signOut() {
    const client = this.getClient()
    const { error } = await client.auth.signOut()
    if (error) throw error
  }

  async getCurrentUser() {
    const client = this.getClient()
    const { data, error } = await client.auth.getUser()
    if (error) throw error
    return data.user
  }

  /**
   * Utility functions
   */
  async getApplicationStats() {
    const client = this.getClient()
    const { data, error } = await client
      .from('kpr_applications')
      .select('status')

    if (error) throw error

    const stats = data.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total: data.length,
      pending: stats.pending || 0,
      approved: stats.approved || 0,
      rejected: stats.rejected || 0,
      completed: stats.completed || 0,
    }
  }

  async searchApplications(query: string) {
    const client = this.getClient()
    const { data, error } = await client
      .from('kpr_applications')
      .select(`
        *,
        applicants (*),
        properties (*)
      `)
      .or(`
        applicants.name.ilike.%${query}%,
        applicants.email.ilike.%${query}%,
        properties.name.ilike.%${query}%
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
}

// Export singleton instance
export const supabaseClient = SupabaseClientManager.getInstance()

// Initialize with environment variables
if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  supabaseClient.initialize({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  })
}
