// Backend API configuration
export const API_CONFIG = {
  BASE_URL: (process.env.NEXT_PUBLIC_API_URL || 'https://devproflow.com/api').replace(/\/+$/, ''),
  ENDPOINTS: {
    // NOTE: BASE_URL diasumsikan sudah termasuk prefix `/api`.
    // Contoh: NEXT_PUBLIC_API_URL=https://devproflow.com/api
    // sehingga HEALTH => https://devproflow.com/api/health
    HEALTH: '/health',
    UNITS: '/units',
    CUSTOMERS: '/customers',
    APPLICATIONS: '/applications',
    DASHBOARD_STATS: '/dashboard/stats',
    WHATSAPP: '/whatsapp/send'
  }
}

// API service for backend communication
export class BackendAPI {
  private static baseURL = API_CONFIG.BASE_URL

  static async request(endpoint: string, options: RequestInit = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Health check
  static async health() {
    return this.request(API_CONFIG.ENDPOINTS.HEALTH)
  }

  // Units API
  static async getUnits() {
    return this.request(API_CONFIG.ENDPOINTS.UNITS)
  }

  static async createUnit(unitData: any) {
    return this.request(API_CONFIG.ENDPOINTS.UNITS, {
      method: 'POST',
      body: JSON.stringify(unitData),
    })
  }

  // Customers API
  static async getCustomers() {
    return this.request(API_CONFIG.ENDPOINTS.CUSTOMERS)
  }

  static async createCustomer(customerData: any) {
    return this.request(API_CONFIG.ENDPOINTS.CUSTOMERS, {
      method: 'POST',
      body: JSON.stringify(customerData),
    })
  }

  // Applications API
  static async getApplications() {
    return this.request(API_CONFIG.ENDPOINTS.APPLICATIONS)
  }

  static async createApplication(applicationData: any) {
    return this.request(API_CONFIG.ENDPOINTS.APPLICATIONS, {
      method: 'POST',
      body: JSON.stringify(applicationData),
    })
  }

  // Dashboard Statistics
  static async getDashboardStats() {
    return this.request(API_CONFIG.ENDPOINTS.DASHBOARD_STATS)
  }

  // WhatsApp Integration
  static async sendWhatsApp(phone: string, message: string) {
    return this.request(API_CONFIG.ENDPOINTS.WHATSAPP, {
      method: 'POST',
      body: JSON.stringify({ phone, message }),
    })
  }
}

// Error handling
export class APIError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'APIError'
  }
}

// Response utilities
export const createSuccessResponse = (data: any, message = 'Success') => {
  return Response.json({ success: true, message, data })
}

export const createErrorResponse = (message: string, status = 500) => {
  return Response.json({ success: false, message }, { status })
}
