/**
 * KPRFlow Enterprise - Phone Formatter Utility
 * Adapted from bramsray2 whatsapp-engine for cross-platform use
 */

export interface PhoneValidationResult {
  isValid: boolean
  formatted: string
  original: string
  country: string
  type: 'mobile' | 'landline' | 'tollfree' | 'unknown'
  error?: string
}

export class PhoneFormatter {
  private static readonly INDONESIA_COUNTRY_CODE = '62'
  private static readonly WHATSAPP_SUFFIX = '@c.us'
  
  private static readonly PHONE_PATTERNS = {
    // Indonesian mobile patterns
    mobile: /^(\+?62|0)8[1-9]\d{7,10}$/,
    // Indonesian landline patterns
    landline: /^(\+?62|0)(2[1-9]|3[1-9]|4[1-9]|6[1-9]|7[1-9]|9[1-9])\d{6,8}$/,
    // Toll-free patterns
    tollfree: /^(\+?62|0)800\d{5,7}$/,
    // General Indonesian pattern
    indonesia: /^(\+?62|0)\d{8,12}$/
  }

  /**
   * Format phone number for WhatsApp
   */
  static formatForWhatsApp(phone: string): string {
    const cleaned = this.cleanPhoneNumber(phone)
    const formatted = this.addIndonesiaCountryCode(cleaned)
    return formatted + this.WHATSAPP_SUFFIX
  }

  /**
   * Clean phone number (remove non-digits)
   */
  static cleanPhoneNumber(phone: string): string {
    return phone.replace(/\D/g, '')
  }

  /**
   * Add Indonesia country code if not present
   */
  static addIndonesiaCountryCode(phone: string): string {
    if (!phone.startsWith(this.INDONESIA_COUNTRY_CODE)) {
      if (phone.startsWith('0')) {
        return this.INDONESIA_COUNTRY_CODE + phone.substring(1)
      } else {
        return this.INDONESIA_COUNTRY_CODE + phone
      }
    }
    return phone
  }

  /**
   * Remove country code for display
   */
  static removeCountryCode(phone: string): string {
    if (phone.startsWith(this.INDONESIA_COUNTRY_CODE)) {
      return '0' + phone.substring(this.INDONESIA_COUNTRY_CODE.length)
    }
    return phone
  }

  /**
   * Format phone number for display
   */
  static formatForDisplay(phone: string): string {
    const cleaned = this.cleanPhoneNumber(phone)
    const withCountryCode = this.addIndonesiaCountryCode(cleaned)
    return this.removeCountryCode(withCountryCode)
  }

  /**
   * Validate phone number
   */
  static validatePhone(phone: string): PhoneValidationResult {
    const original = phone
    const cleaned = this.cleanPhoneNumber(phone)
    
    // Check basic length
    if (cleaned.length < 10 || cleaned.length > 15) {
      return {
        isValid: false,
        formatted: '',
        original,
        country: 'unknown',
        type: 'unknown',
        error: 'Phone number length must be between 10-15 digits'
      }
    }

    // Check if Indonesian number
    if (!this.PHONE_PATTERNS.indonesia.test(cleaned) && 
        !this.PHONE_PATTERNS.indonesia.test('0' + cleaned)) {
      return {
        isValid: false,
        formatted: '',
        original,
        country: 'unknown',
        type: 'unknown',
        error: 'Not a valid Indonesian phone number'
      }
    }

    // Determine phone type
    let type: 'mobile' | 'landline' | 'tollfree' | 'unknown' = 'unknown'
    
    if (this.PHONE_PATTERNS.mobile.test(cleaned) || 
        this.PHONE_PATTERNS.mobile.test('0' + cleaned)) {
      type = 'mobile'
    } else if (this.PHONE_PATTERNS.landline.test(cleaned) || 
               this.PHONE_PATTERNS.landline.test('0' + cleaned)) {
      type = 'landline'
    } else if (this.PHONE_PATTERNS.tollfree.test(cleaned) || 
               this.PHONE_PATTERNS.tollfree.test('0' + cleaned)) {
      type = 'tollfree'
    }

    const formatted = this.formatForDisplay(phone)

    return {
      isValid: true,
      formatted,
      original,
      country: 'Indonesia',
      type
    }
  }

  /**
   * Format phone number with international format
   */
  static formatInternational(phone: string): string {
    const cleaned = this.cleanPhoneNumber(phone)
    return this.addIndonesiaCountryCode(cleaned)
  }

  /**
   * Format phone number with local format (with leading 0)
   */
  static formatLocal(phone: string): string {
    const cleaned = this.cleanPhoneNumber(phone)
    const withCountryCode = this.addIndonesiaCountryCode(cleaned)
    return this.removeCountryCode(withCountryCode)
  }

  /**
   * Check if phone number is mobile
   */
  static isMobile(phone: string): boolean {
    const cleaned = this.cleanPhoneNumber(phone)
    return this.PHONE_PATTERNS.mobile.test(cleaned) || 
           this.PHONE_PATTERNS.mobile.test('0' + cleaned)
  }

  /**
   * Check if phone number is landline
   */
  static isLandline(phone: string): boolean {
    const cleaned = this.cleanPhoneNumber(phone)
    return this.PHONE_PATTERNS.landline.test(cleaned) || 
           this.PHONE_PATTERNS.landline.test('0' + cleaned)
  }

  /**
   * Extract area code from landline number
   */
  static getAreaCode(phone: string): string | null {
    const cleaned = this.cleanPhoneNumber(phone)
    const local = this.formatLocal(phone)
    
    // Indonesian area codes
    const areaCodePatterns = {
      'Jakarta': /^021/,
      'Surabaya': /^031/,
      'Bandung': /^022/,
      'Medan': /^061/,
      'Semarang': /^024/,
      'Makassar': /^0411/,
      'Palembang': /^0711/,
      'Tangerang': /^021/,
      'Depok': /^021/,
      'Bekasi': /^021/,
      'Bogor': /^0251/
    }

    for (const [city, pattern] of Object.entries(areaCodePatterns)) {
      if (pattern.test(local)) {
        return city
      }
    }

    return null
  }

  /**
   * Mask phone number for privacy
   */
  static maskPhone(phone: string, visibleDigits: number = 4): string {
    const formatted = this.formatForDisplay(phone)
    if (formatted.length <= visibleDigits) {
      return formatted
    }
    
    const start = formatted.substring(0, 2)
    const end = formatted.substring(formatted.length - visibleDigits)
    const middle = '*'.repeat(formatted.length - 2 - visibleDigits)
    
    return start + middle + end
  }

  /**
   * Generate phone number examples for testing
   */
  static generateExamples(): {
    mobile: string[]
    landline: string[]
    tollfree: string[]
    international: string[]
  } {
    return {
      mobile: [
        '08123456789',
        '082345678901',
        '083456789012',
        '+628123456789',
        '628234567890'
      ],
      landline: [
        '0211234567',
        '0222345678',
        '0313456789',
        '0614567890',
        '+62211234567'
      ],
      tollfree: [
        '080012345',
        '08001234567',
        '0800234567',
        '+628001234567'
      ],
      international: [
        '+628123456789',
        '+62211234567',
        '+628001234567'
      ]
    }
  }

  /**
   * Normalize phone number from various formats
   */
  static normalize(phone: string): string {
    // Remove common formatting characters
    let normalized = phone.replace(/[\s\-\(\)\.]/g, '')
    
    // Handle common prefixes
    if (normalized.startsWith('+62')) {
      return normalized
    } else if (normalized.startsWith('62')) {
      return '+' + normalized
    } else if (normalized.startsWith('0')) {
      return '+62' + normalized.substring(1)
    } else {
      return '+62' + normalized
    }
  }

  /**
   * Compare two phone numbers (ignores formatting)
   */
  static compare(phone1: string, phone2: string): boolean {
    const norm1 = this.normalize(phone1)
    const norm2 = this.normalize(phone2)
    return norm1 === norm2
  }

  /**
   * Extract phone numbers from text
   */
  static extractFromText(text: string): string[] {
    const phoneRegex = /(\+?62|0)[0-9]{8,12}/g
    const matches = text.match(phoneRegex) || []
    return matches.filter(phone => this.validatePhone(phone).isValid)
  }

  /**
   * Format phone number for SMS gateway
   */
  static formatForSMS(phone: string): string {
    return this.formatInternational(phone)
  }

  /**
   * Get phone number metadata
   */
  static getMetadata(phone: string): {
    isValid: boolean
    type: string
    country: string
    areaCode?: string
    carrier?: string
    isWhatsAppCompatible: boolean
  } {
    const validation = this.validatePhone(phone)
    
    return {
      isValid: validation.isValid,
      type: validation.type,
      country: validation.country,
      areaCode: validation.type === 'landline' ? this.getAreaCode(phone) || undefined : undefined,
      carrier: this.getCarrier(phone),
      isWhatsAppCompatible: validation.type === 'mobile'
    }
  }

  /**
   * Get mobile carrier based on prefix
   */
  private static getCarrier(phone: string): string | undefined {
    const cleaned = this.cleanPhoneNumber(phone)
    const local = this.formatLocal(phone)
    
    const carrierPatterns = {
      'Telkomsel': /^081[1-3]|^082[1-3]|^085[2-3]|^0812/,
      'Indosat': /^081[4-6]|^085[6-8]|^0814|^0815|^0816/,
      'XL': /^081[7-9]|^083[1-8]|^085[1-9]|^0817|^0818|^0819/,
      'Tri': /^089[5-9]|^089[6-9]|^0895|^0896|^0897|^0898|^0899/,
      'Smartfren': /^088[1-8]/,
      'Axis': /^083[1-8]|^0831|^0832|^0833|^0838/
    }

    for (const [carrier, pattern] of Object.entries(carrierPatterns)) {
      if (pattern.test(local)) {
        return carrier
      }
    }

    return undefined
  }
}

// Export utility functions for convenience
export const formatPhoneForWhatsApp = PhoneFormatter.formatForWhatsApp
export const validatePhoneNumber = PhoneFormatter.validatePhone
export const formatPhoneForDisplay = PhoneFormatter.formatForDisplay
export const maskPhoneNumber = PhoneFormatter.maskPhone
