/**
 * KPRFlow Enterprise - Shared Security Service
 * Adapted from bramsray2 backend securityService.js for cross-platform use
 */

export interface SecurityConfig {
  supabase: {
    url: string
    anonKey: string
    serviceKey?: string
  }
  google: {
    geminiKey?: string
    mapsKey?: string
    visionKey?: string
  }
  openai: {
    apiKey?: string
  }
  cloudflare: {
    accountId?: string
    accessKey?: string
    secretKey?: string
  }
  github: {
    token?: string
  }
  firebase: {
    apiKey?: string
    databaseUrl?: string
  }
  communication: {
    telegramBotToken?: string
    twilioKey?: string
    wablasToken?: string
  }
}

export interface SecurityValidationResult {
  isValid: boolean
  missingKeys: string[]
  invalidKeys: string[]
  warnings: string[]
}

export class SecurityService {
  private static instance: SecurityService
  private config: SecurityConfig | null = null
  private isProductionMode = false

  private constructor() {}

  static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService()
    }
    return SecurityService.instance
  }

  /**
   * Initialize security service with configuration
   */
  initialize(config: SecurityConfig, isProduction = false): void {
    this.config = config
    this.isProductionMode = isProduction
  }

  /**
   * Validate that required environment variables are set
   */
  validateConfig(requiredKeys?: string[]): SecurityValidationResult {
    const result: SecurityValidationResult = {
      isValid: true,
      missingKeys: [],
      invalidKeys: [],
      warnings: []
    }

    if (!this.config) {
      result.isValid = false
      result.missingKeys.push('Security config not initialized')
      return result
    }

    // Default required keys
    const defaultRequired = ['SUPABASE_URL', 'SUPABASE_ANON_KEY']
    const keysToCheck = requiredKeys || defaultRequired

    // Check required variables
    keysToCheck.forEach(key => {
      const value = this.getEnvironmentVariable(key)
      if (!value) {
        result.missingKeys.push(key)
        result.isValid = false
      }
    })

    // Validate API key formats
    if (this.config.supabase.anonKey) {
      if (!this.validateApiKey(this.config.supabase.anonKey, 'supabase')) {
        result.invalidKeys.push('SUPABASE_ANON_KEY')
        result.isValid = false
      }
    }

    if (this.config.openai.apiKey) {
      if (!this.validateApiKey(this.config.openai.apiKey, 'openai')) {
        result.invalidKeys.push('OPENAI_API_KEY')
        result.isValid = false
      }
    }

    if (this.config.google.geminiKey) {
      if (!this.validateApiKey(this.config.google.geminiKey, 'gemini')) {
        result.invalidKeys.push('GEMINI_API_KEY')
        result.isValid = false
      }
    }

    // Production warnings
    if (this.isProductionMode) {
      if (!this.config.supabase.serviceKey) {
        result.warnings.push('SUPABASE_SERVICE_ROLE_KEY recommended in production')
      }
    }

    return result
  }

  /**
   * Get environment variable value
   */
  private getEnvironmentVariable(key: string): string | null {
    // This would be adapted based on the platform
    // For web: process.env, for mobile: secure storage, etc.
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key] || null
    }
    
    // For mobile platforms, this would use secure storage
    return this.getSecureValue(key)
  }

  /**
   * Get secure value from storage (platform-specific implementation)
   */
  private getSecureValue(key: string): string | null {
    // This would be implemented differently for each platform
    // Android: Keystore, iOS: Keychain, Web: Secure localStorage
    return null
  }

  /**
   * Get API key by service (secure)
   */
  getApiKey(service: string): string | null {
    if (!this.config) return null

    const keyMap: Record<string, string | undefined> = {
      'gemini': this.config.google.geminiKey,
      'openai': this.config.openai.apiKey,
      'maps': this.config.google.mapsKey,
      'vision': this.config.google.visionKey,
      'github': this.config.github.token,
      'telegram': this.config.communication.telegramBotToken,
      'twilio': this.config.communication.twilioKey,
      'wablas': this.config.communication.wablasToken,
      'supabase': this.config.supabase.anonKey,
      'supabase_service': this.config.supabase.serviceKey,
      'firebase': this.config.firebase.apiKey
    }
    
    return keyMap[service] || null
  }

  /**
   * Validate API key format
   */
  validateApiKey(key: string, service: string): boolean {
    if (!key || key.length < 8) return false

    const patterns: Record<string, RegExp> = {
      'supabase': /^eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*$/,
      'openai': /^sk-[a-zA-Z0-9]{48}$/,
      'gemini': /^AIza[a-zA-Z0-9_-]{35}$/,
      'github': /^ghp_[a-zA-Z0-9]{36}$/,
      'telegram': /^[0-9]+:[a-zA-Z0-9_-]{35}$/,
      'firebase': /^[a-zA-Z0-9_-]{39}$/
    }
    
    return patterns[service] ? patterns[service].test(key) : true
  }

  /**
   * Mask API key for logging
   */
  maskApiKey(key: string): string {
    if (!key || key.length < 8) return '***'
    return key.substring(0, 4) + '***' + key.substring(key.length - 4)
  }

  /**
   * Check if environment is production
   */
  isProduction(): boolean {
    return this.isProductionMode
  }

  /**
   * Get security headers for web requests
   */
  getSecurityHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    }

    if (this.isProductionMode) {
      headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
      headers['Content-Security-Policy'] = "default-src 'self'"
    }

    return headers
  }

  /**
   * Validate input data against common threats
   */
  sanitizeInput(input: string): string {
    if (!input) return ''
    
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
      .replace(/javascript:/gi, '') // Remove javascript protocols
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim()
  }

  /**
   * Validate email format
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Validate phone number (Indonesia format)
   */
  validatePhoneNumber(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '')
    return cleaned.length >= 10 && cleaned.length <= 15
  }

  /**
   * Generate secure random token
   */
  generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    
    return result
  }

  /**
   * Hash password (platform-specific implementation)
   */
  async hashPassword(password: string): Promise<string> {
    // This would use platform-specific crypto libraries
    // Web: Web Crypto API, Mobile: platform crypto
    // For now, return a simple hash (NOT for production)
    const encoder = new TextEncoder()
    const data = encoder.encode(password + 'kprflow_salt')
    
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    }
    
    // Fallback for environments without crypto
    return btoa(password).split('').reverse().join('')
  }

  /**
   * Verify password
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    const hashedPassword = await this.hashPassword(password)
    return hashedPassword === hash
  }

  /**
   * Rate limiting implementation
   */
  private rateLimitMap = new Map<string, { count: number; resetTime: number }>()

  isRateLimited(identifier: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now()
    const record = this.rateLimitMap.get(identifier)

    if (!record || now > record.resetTime) {
      this.rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
      return false
    }

    if (record.count >= maxRequests) {
      return true
    }

    record.count++
    return false
  }

  /**
   * Clear rate limit for identifier
   */
  clearRateLimit(identifier: string): void {
    this.rateLimitMap.delete(identifier)
  }

  /**
   * Get security audit log
   */
  getSecurityAudit(): {
    configValidated: boolean
    productionMode: boolean
    rateLimitEntries: number
    warnings: string[]
  } {
    const validation = this.validateConfig()
    
    return {
      configValidated: validation.isValid,
      productionMode: this.isProductionMode,
      rateLimitEntries: this.rateLimitMap.size,
      warnings: validation.warnings
    }
  }

  /**
   * Encrypt sensitive data (platform-specific)
   */
  async encrypt(data: string): Promise<string> {
    // This would use platform-specific encryption
    // For now, return base64 encoded (NOT secure for production)
    return btoa(data)
  }

  /**
   * Decrypt sensitive data (platform-specific)
   */
  async decrypt(encryptedData: string): Promise<string> {
    // This would use platform-specific decryption
    // For now, decode base64 (NOT secure for production)
    try {
      return atob(encryptedData)
    } catch {
      return ''
    }
  }
}

// Export singleton instance
export const securityService = SecurityService.getInstance()
