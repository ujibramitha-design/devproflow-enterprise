/**
 * KPRFlow Enterprise - Shared Supabase Client
 * Adapted from bramsray2 backend for cross-platform use
 */

// Type-only import for Supabase types
import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'

export interface SupabaseConfig {
  url: string
  anonKey: string
  serviceKey?: string
}

export class SupabaseClientManager {
  private static instance: SupabaseClientManager
  private client: SupabaseClient | null = null
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
    this.client = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  }

  /**
   * Get Supabase client instance
   */
  getClient(): SupabaseClient {
    if (!this.client) {
      throw new Error('Supabase client not initialized. Call initialize() first.')
    }
    return this.client
  }

  /**
   * Get admin client with service role key
   */
  getAdminClient(): SupabaseClient {
    if (!this.config?.serviceKey) {
      throw new Error('Service key not configured')
    }
    
    return createClient(this.config.url, this.config.serviceKey, {
      auth: {
        persistSession: false,
      },
    })
  }

  /**
   * Test connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const client = this.getClient()
      const { data, error } = await client.from('_temp_connection_test').select('count').limit(1)
      return !error
    } catch (error) {
      console.error('Supabase connection test failed:', error)
      return false
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser() {
    try {
      const client = this.getClient()
      const { data: { user }, error } = await client.auth.getUser()
      return { user, error }
    } catch (error) {
      console.error('Error getting current user:', error)
      return { user: null, error }
    }
  }

  /**
   * Sign in with email and password
   */
  async signInWithEmail(email: string, password: string) {
    try {
      const client = this.getClient()
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      })
      return { data, error }
    } catch (error) {
      console.error('Error signing in:', error)
      return { data: null, error }
    }
  }

  /**
   * Sign out
   */
  async signOut() {
    try {
      const client = this.getClient()
      const { error } = await client.auth.signOut()
      return { error }
    } catch (error) {
      console.error('Error signing out:', error)
      return { error }
    }
  }

  /**
   * Generic select operation
   */
  async select<T = any>(
    table: string,
    columns: string = '*',
    filters?: Record<string, any>,
    orderBy?: { column: string; ascending?: boolean }
  ) {
    try {
      let query = this.getClient().from(table).select(columns)
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value)
        })
      }
      
      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true })
      }
      
      const { data, error } = await query
      return { data: data as T[], error }
    } catch (error) {
      console.error(`Error selecting from ${table}:`, error)
      return { data: null, error }
    }
  }

  /**
   * Generic insert operation
   */
  async insert<T = any>(
    table: string,
    data: Partial<T> | Partial<T>[]
  ) {
    try {
      const { data: result, error } = await this.getClient()
        .from(table)
        .insert(data)
        .select()
      
      return { data: result as T[], error }
    } catch (error) {
      console.error(`Error inserting into ${table}:`, error)
      return { data: null, error }
    }
  }

  /**
   * Generic update operation
   */
  async update<T = any>(
    table: string,
    data: Partial<T>,
    filters: Record<string, any>
  ) {
    try {
      let query = this.getClient().from(table).update(data)
      
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
      
      const { data: result, error } = await query.select()
      return { data: result as T[], error }
    } catch (error) {
      console.error(`Error updating ${table}:`, error)
      return { data: null, error }
    }
  }

  /**
   * Generic delete operation
   */
  async delete(
    table: string,
    filters: Record<string, any>
  ) {
    try {
      let query = this.getClient().from(table).delete()
      
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
      
      const { data, error } = await query.select()
      return { data, error }
    } catch (error) {
      console.error(`Error deleting from ${table}:`, error)
      return { data: null, error }
    }
  }
}

// Export singleton instance
export const supabaseClient = SupabaseClientManager.getInstance()
