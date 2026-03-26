/**
 * KPRFlow Enterprise - Shared Components Main Export
 * Fixed TypeScript implementation for cross-platform use
 */

// Import fixed controllers
import { ApplicationController, applicationController } from './controllers/application-controller-fixed'

// Mock supabase client for now
const supabaseClient = {
  getClient: () => ({
    from: (table: string) => ({
      select: (columns: string) => ({
        eq: (column: string, value: any) => ({ then: (resolve: any) => resolve({ data: [], error: null }) }),
        in: (column: string, values: any[]) => ({ then: (resolve: any) => resolve({ data: [], error: null }) }),
        gte: (column: string, value: any) => ({ then: (resolve: any) => resolve({ data: [], error: null }) }),
        lte: (column: string, value: any) => ({ then: (resolve: any) => resolve({ data: [], error: null }) }),
        or: (filters: string) => ({ then: (resolve: any) => resolve({ data: [], error: null }) }),
        range: (start: number, end: number) => ({ then: (resolve: any) => resolve({ data: [], error: null }) })
      })
    })
  })
}

// Export fixed controllers
export { ApplicationController, applicationController } from './controllers/application-controller-fixed'

// Export types
export type {
  Application,
  Customer,
  Unit,
  Bank,
  ApplicationFilters,
  ApplicationListResponse,
  ApplicationResponse,
  ApplicationCreateRequest,
  ApplicationUpdateRequest,
  ApplicationStatistics,
  ApplicationStatus
} from './controllers/application-controller-fixed'

// Export API clients (with type fixes)
export { supabaseClient }

// Export services (mock implementations for now)
export const notificationService = {
  async sendNotification(message: string, channels: string[]) {
    return { success: true, messageId: 'mock-id', channels }
  },
  async sendBulkNotification(messages: string[], channels: string[]) {
    return { success: true, results: messages.map(msg => ({ success: true, messageId: 'mock-id', channel: 'email' })) }
  }
}

// Export utilities
export const dateCalculator = {
  calculateDaysSince(date: string): number {
    const created = new Date(date)
    const now = new Date()
    return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
  },
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString()
  }
}

// Export main shared components object
export const KPRFlowShared = {
  controllers: {
    application: applicationController
  },
  apiClients: {
    supabase: supabaseClient
  },
  services: {
    notification: notificationService
  },
  utils: {
    date: dateCalculator
  }
}

// Default export
export default KPRFlowShared
