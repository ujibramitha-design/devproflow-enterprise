import { WHATSAPP_CONFIG } from '../../firebase.config'

// WhatsApp Business integration service
export class WhatsAppService {
  // Generate WhatsApp link with message
  static generateWhatsAppLink(phone: string, message: string): string {
    const cleanPhone = phone.replace(/\D/g, '')
    const encodedMessage = encodeURIComponent(message)
    return `${WHATSAPP_CONFIG.baseUrl}${cleanPhone}?text=${encodedMessage}`
  }

  // Generate unit inquiry message
  static generateUnitInquiryMessage(unitId: string): string {
    return WHATSAPP_CONFIG.templates.UNIT_INQUIRY.replace('{unitId}', unitId)
  }

  // Generate application status message
  static generateApplicationStatusMessage(unitId: string, status: string): string {
    return WHATSAPP_CONFIG.templates.APPLICATION_STATUS
      .replace('{unitId}', unitId)
      .replace('{status}', status)
  }

  // Generate payment reminder message
  static generatePaymentReminderMessage(unitId: string, amount: string): string {
    return WHATSAPP_CONFIG.templates.PAYMENT_REMINDER
      .replace('{unitId}', unitId)
      .replace('{amount}', amount)
  }

  // Create WhatsApp link for unit inquiry
  static createUnitInquiryLink(unitId: string): string {
    const message = this.generateUnitInquiryMessage(unitId)
    return this.generateWhatsAppLink(WHATSAPP_CONFIG.phoneNumber, message)
  }

  // Create WhatsApp link for application status
  static createApplicationStatusLink(unitId: string, status: string): string {
    const message = this.generateApplicationStatusMessage(unitId, status)
    return this.generateWhatsAppLink(WHATSAPP_CONFIG.phoneNumber, message)
  }

  // Create WhatsApp link for payment reminder
  static createPaymentReminderLink(unitId: string, amount: string): string {
    const message = this.generatePaymentReminderMessage(unitId, amount)
    return this.generateWhatsAppLink(WHATSAPP_CONFIG.phoneNumber, message)
  }

  // Open WhatsApp in new window
  static openWhatsApp(phone: string, message: string): void {
    const link = this.generateWhatsAppLink(phone, message)
    window.open(link, '_blank')
  }

  // Open unit inquiry WhatsApp
  static openUnitInquiry(unitId: string): void {
    const link = this.createUnitInquiryLink(unitId)
    window.open(link, '_blank')
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
