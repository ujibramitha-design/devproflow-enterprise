import { WHATSAPP_CONFIG } from '../../firebase.config'

/**
 * WhatsApp Business integration service
 * 
 * ⚠️ TEMPORARILY DISABLED - AI & AUDIT PHASE
 * All WhatsApp messaging functions are mocked and only log to console
 * No WhatsApp links will be opened or messages sent
 */

// WhatsApp Business integration service
export class WhatsAppService {
  private static readonly DISABLED = true // Feature lock for audit phase

  // Generate WhatsApp link with message - MOCKED
  static generateWhatsAppLink(phone: string, message: string): string {
    console.log('🔒 WhatsAppService: generateWhatsAppLink called - FEATURE DISABLED FOR AUDIT')
    console.log('🔒 Would generate link for phone:', phone.replace(/\D/g, '').replace(/(\d{2})(\d{3})(\d{4})(\d{4})/, '$1-$2-$3-$4'))
    console.log('🔒 Message preview:', message.substring(0, 100) + (message.length > 100 ? '...' : ''))
    
    if (this.DISABLED) {
      return '#disabled-for-audit'
    }

    // Original implementation (commented out during audit phase)
    /*
    const cleanPhone = phone.replace(/\D/g, '')
    const encodedMessage = encodeURIComponent(message)
    return `${WHATSAPP_CONFIG.baseUrl}${cleanPhone}?text=${encodedMessage}`
    */
    
    return '#disabled-for-audit'
  }

  // Generate unit inquiry message
  static generateUnitInquiryMessage(unitId: string): string {
    console.log('🔒 WhatsAppService: generateUnitInquiryMessage called - FEATURE DISABLED FOR AUDIT')
    console.log('🔒 Unit ID:', unitId)
    
    if (this.DISABLED) {
      return `[DISABLED] Unit inquiry for ${unitId}`
    }

    return WHATSAPP_CONFIG.templates.UNIT_INQUIRY.replace('{unitId}', unitId)
  }

  // Generate application status message
  static generateApplicationStatusMessage(unitId: string, status: string): string {
    console.log('🔒 WhatsAppService: generateApplicationStatusMessage called - FEATURE DISABLED FOR AUDIT')
    console.log('🔒 Unit ID:', unitId, 'Status:', status)
    
    if (this.DISABLED) {
      return `[DISABLED] Status update for ${unitId}: ${status}`
    }

    return WHATSAPP_CONFIG.templates.APPLICATION_STATUS
      .replace('{unitId}', unitId)
      .replace('{status}', status)
  }

  // Generate payment reminder message
  static generatePaymentReminderMessage(unitId: string, amount: string): string {
    console.log('🔒 WhatsAppService: generatePaymentReminderMessage called - FEATURE DISABLED FOR AUDIT')
    console.log('🔒 Unit ID:', unitId, 'Amount:', amount)
    
    if (this.DISABLED) {
      return `[DISABLED] Payment reminder for ${unitId}: ${amount}`
    }

    return WHATSAPP_CONFIG.templates.PAYMENT_REMINDER
      .replace('{unitId}', unitId)
      .replace('{amount}', amount)
  }

  // Create WhatsApp link for unit inquiry
  static createUnitInquiryLink(unitId: string): string {
    console.log('🔒 WhatsAppService: createUnitInquiryLink called - FEATURE DISABLED FOR AUDIT')
    const message = this.generateUnitInquiryMessage(unitId)
    const link = this.generateWhatsAppLink(WHATSAPP_CONFIG.phoneNumber, message)
    console.log('🔒 Would create inquiry link:', link)
    return link
  }

  // Create WhatsApp link for application status
  static createApplicationStatusLink(unitId: string, status: string): string {
    console.log('🔒 WhatsAppService: createApplicationStatusLink called - FEATURE DISABLED FOR AUDIT')
    const message = this.generateApplicationStatusMessage(unitId, status)
    const link = this.generateWhatsAppLink(WHATSAPP_CONFIG.phoneNumber, message)
    console.log('🔒 Would create status link:', link)
    return link
  }

  // Create WhatsApp link for payment reminder
  static createPaymentReminderLink(unitId: string, amount: string): string {
    console.log('🔒 WhatsAppService: createPaymentReminderLink called - FEATURE DISABLED FOR AUDIT')
    const message = this.generatePaymentReminderMessage(unitId, amount)
    const link = this.generateWhatsAppLink(WHATSAPP_CONFIG.phoneNumber, message)
    console.log('🔒 Would create payment link:', link)
    return link
  }

  // Open WhatsApp in new window - MOCKED
  static openWhatsApp(phone: string, message: string): void {
    console.log('🔒 WhatsAppService: openWhatsApp called - FEATURE DISABLED FOR AUDIT')
    console.log('🔒 Would open WhatsApp for phone:', phone.replace(/\D/g, '').replace(/(\d{2})(\d{3})(\d{4})(\d{4})/, '$1-$2-$3-$4'))
    console.log('🔒 Message preview:', message.substring(0, 100) + (message.length > 100 ? '...' : ''))
    
    if (this.DISABLED) {
      console.log('🔒 MOCK: WhatsApp opening disabled for audit phase')
      return
    }

    // Original implementation (commented out during audit phase)
    /*
    const link = this.generateWhatsAppLink(phone, message)
    window.open(link, '_blank')
    */
  }

  // Open unit inquiry WhatsApp - MOCKED
  static openUnitInquiry(unitId: string): void {
    console.log('🔒 WhatsAppService: openUnitInquiry called - FEATURE DISABLED FOR AUDIT')
    console.log('🔒 Would open WhatsApp inquiry for unit:', unitId)
    
    if (this.DISABLED) {
      console.log('🔒 MOCK: Unit inquiry WhatsApp disabled for audit phase')
      return
    }

    // Original implementation (commented out during audit phase)
    /*
    const link = this.createUnitInquiryLink(unitId)
    window.open(link, '_blank')
    */
  }

  // Format phone number for WhatsApp
  static formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '')
    
    // Ensure Indonesian format (62 prefix)
    if (cleaned.startsWith('0')) {
      return '62' + cleaned.substring(1)
    } else if (cleaned.startsWith('62')) {
      return cleaned
    } else {
      return '62' + cleaned
    }
  }

  // Validate phone number for WhatsApp
  static isValidWhatsAppNumber(phone: string): boolean {
    const cleaned = this.formatPhoneNumber(phone)
    return cleaned.length >= 10 && cleaned.length <= 15
  }

  // Generate custom message
  static generateCustomMessage(template: string, variables: Record<string, string>): string {
    let message = template
    Object.entries(variables).forEach(([key, value]) => {
      message = message.replace(new RegExp(`{${key}}`, 'g'), value)
    })
    return message
  }
}

export default WhatsAppService
