/**
 * KPRFlow Enterprise - Validation Rules
 * Adapted from bramsray1 Google Apps Script for cross-platform use
 */

import { ValidationError, ValidationWarning } from '../types/common-types'

export interface ValidationRule {
  field: string
  required?: boolean
  type?: ValidationType
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
  message?: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export type ValidationType = 
  | 'string'
  | 'number'
  | 'email'
  | 'phone'
  | 'date'
  | 'url'
  | 'boolean'
  | 'array'
  | 'object'
  | 'file'
  | 'nik'
  | 'npwp'

export class ValidationRules {
  // Indonesian-specific patterns
  private static readonly PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_ID: /^(\+62|0)[0-9]{9,12}$/,
    NIK: /^[0-9]{16}$/,
    NPWP: /^[0-9]{2}\.[0-9]{3}\.[0-9]{3}\.[0-9]-[0-9]{3}\.[0-9]{3}$/,
    URL: /^https?:\/\/.+/,
    MONEY: /^[0-9,.]+$/,
    NUMBERS_ONLY: /^[0-9]+$/,
    ALPHANUMERIC: /^[a-zA-Z0-9\s]+$/,
    INDONESIAN_NAME: /^[a-zA-Z\s'\-.,]+$/,
    ADDRESS: /^[a-zA-Z0-9\s\-\.,\/#]+$/,
    POSTAL_CODE: /^[0-9]{5}$/,
    BANK_ACCOUNT: /^[0-9]{8,16}$/,
    KTP_NUMBER: /^[0-9]{16}$/,
    PASSPORT_NUMBER: /^[A-Z][0-9]{7}$/,
    FAMILY_CARD_NUMBER: /^[0-9]{16}$/,
    BIRTH_PLACE: /^[a-zA-Z\s'\-.,]+$/
  }

  // Validation rules for different entities
  static readonly CUSTOMER_RULES: ValidationRule[] = [
    {
      field: 'name',
      required: true,
      type: 'string',
      minLength: 3,
      maxLength: 100,
      pattern: this.PATTERNS.INDONESIAN_NAME,
      message: 'Nama harus 3-100 karakter huruf saja'
    },
    {
      field: 'email',
      required: true,
      type: 'email',
      pattern: this.PATTERNS.EMAIL,
      message: 'Format email tidak valid'
    },
    {
      field: 'phone',
      required: true,
      type: 'phone',
      pattern: this.PATTERNS.PHONE_ID,
      message: 'Format nomor telepon Indonesia tidak valid'
    },
    {
      field: 'nik',
      required: true,
      type: 'nik',
      pattern: this.PATTERNS.NIK,
      message: 'NIK harus 16 digit angka'
    },
    {
      field: 'npwp',
      required: false,
      type: 'npwp',
      pattern: this.PATTERNS.NPWP,
      message: 'Format NPWP tidak valid (XX.XXX.XXX.XXX-XXX.XXX)'
    },
    {
      field: 'birth_date',
      required: true,
      type: 'date',
      custom: (value: string) => {
        const date = new Date(value)
        const now = new Date()
        const minAge = new Date(now.getFullYear() - 17, now.getMonth(), now.getDate())
        return date <= minAge || 'Minimal usia 17 tahun'
      },
      message: 'Format tanggal lahir tidak valid'
    },
    {
      field: 'birth_place',
      required: true,
      type: 'string',
      minLength: 2,
      maxLength: 50,
      pattern: this.PATTERNS.BIRTH_PLACE,
      message: 'Tempat lahir harus 2-50 karakter huruf saja'
    },
    {
      field: 'address_ktp',
      required: true,
      type: 'string',
      minLength: 10,
      maxLength: 255,
      pattern: this.PATTERNS.ADDRESS,
      message: 'Alamat KTP minimal 10 karakter'
    },
    {
      field: 'address_domisili',
      required: true,
      type: 'string',
      minLength: 10,
      maxLength: 255,
      pattern: this.PATTERNS.ADDRESS,
      message: 'Alamat domisili minimal 10 karakter'
    },
    {
      field: 'marital_status',
      required: true,
      type: 'string',
      custom: (value: string) => {
        const validStatuses = ['single', 'married', 'divorced', 'widowed']
        return validStatuses.includes(value) || 'Status pernikahan tidak valid'
      },
      message: 'Status pernikahan harus dipilih'
    },
    {
      field: 'monthly_income',
      required: false,
      type: 'number',
      min: 1000000,
      message: 'Penghasilan bulanan minimal Rp 1.000.000'
    }
  ]

  static readonly APPLICATION_RULES: ValidationRule[] = [
    {
      field: 'customer_id',
      required: true,
      type: 'string',
      message: 'Customer harus dipilih'
    },
    {
      field: 'unit_id',
      required: true,
      type: 'string',
      message: 'Unit harus dipilih'
    },
    {
      field: 'bank_id',
      required: false,
      type: 'string',
      message: 'Bank harus dipilih'
    },
    {
      field: 'status',
      required: true,
      type: 'string',
      custom: (value: string) => {
        const validStatuses = [
          'PENDING', 'DOCUMENT_COLLECTION', 'BANK_SUBMISSION', 
          'BANK_VERIFICATION', 'BANK_APPROVAL', 'APPROVED', 
          'REJECTED', 'CANCELLED', 'COMPLETED', 'BAST_COMPLETED'
        ]
        return validStatuses.includes(value) || 'Status tidak valid'
      },
      message: 'Status aplikasi tidak valid'
    },
    {
      field: 'notes',
      required: false,
      type: 'string',
      maxLength: 1000,
      message: 'Catatan maksimal 1000 karakter'
    }
  ]

  static readonly UNIT_RULES: ValidationRule[] = [
    {
      field: 'unit_type',
      required: true,
      type: 'string',
      minLength: 2,
      maxLength: 50,
      message: 'Tipe unit harus 2-50 karakter'
    },
    {
      field: 'block',
      required: true,
      type: 'string',
      minLength: 1,
      maxLength: 10,
      pattern: this.PATTERNS.ALPHANUMERIC,
      message: 'Blok harus 1-10 karakter alfanumerik'
    },
    {
      field: 'number',
      required: true,
      type: 'string',
      minLength: 1,
      maxLength: 10,
      pattern: this.PATTERNS.ALPHANUMERIC,
      message: 'Nomor unit harus 1-10 karakter alfanumerik'
    },
    {
      field: 'price',
      required: true,
      type: 'number',
      min: 100000000,
      message: 'Harga minimal Rp 100.000.000'
    },
    {
      field: 'unit_area',
      required: true,
      type: 'number',
      min: 20,
      message: 'Luas bangunan minimal 20 m²'
    },
    {
      field: 'land_area',
      required: true,
      type: 'number',
      min: 20,
      message: 'Luas tanah minimal 20 m²'
    },
    {
      field: 'bedroom',
      required: true,
      type: 'number',
      min: 0,
      max: 10,
      message: 'Jumlah kamar tidur 0-10'
    },
    {
      field: 'bathroom',
      required: true,
      type: 'number',
      min: 0,
      max: 10,
      message: 'Jumlah kamar mandi 0-10'
    },
    {
      field: 'garage',
      required: false,
      type: 'number',
      min: 0,
      max: 5,
      message: 'Jumlah garasi 0-5'
    },
    {
      field: 'floor',
      required: true,
      type: 'number',
      min: 1,
      max: 50,
      message: 'Jumlah lantai 1-50'
    },
    {
      field: 'facing',
      required: false,
      type: 'string',
      custom: (value: string) => {
        const validDirections = ['north', 'south', 'east', 'west']
        return validDirections.includes(value) || 'Arah hadap tidak valid'
      },
      message: 'Arah hadap harus dipilih'
    }
  ]

  static readonly BANK_RULES: ValidationRule[] = [
    {
      field: 'name',
      required: true,
      type: 'string',
      minLength: 3,
      maxLength: 100,
      message: 'Nama bank harus 3-100 karakter'
    },
    {
      field: 'code',
      required: true,
      type: 'string',
      minLength: 2,
      maxLength: 10,
      pattern: this.PATTERNS.ALPHANUMERIC,
      message: 'Kode bank harus 2-10 karakter alfanumerik'
    },
    {
      field: 'contact_person',
      required: false,
      type: 'string',
      maxLength: 100,
      message: 'Nama kontak person maksimal 100 karakter'
    },
    {
      field: 'phone',
      required: false,
      type: 'phone',
      pattern: this.PATTERNS.PHONE_ID,
      message: 'Format nomor telepon tidak valid'
    },
    {
      field: 'email',
      required: false,
      type: 'email',
      pattern: this.PATTERNS.EMAIL,
      message: 'Format email tidak valid'
    },
    {
      field: 'plafon_limit',
      required: false,
      type: 'number',
      min: 10000000,
      message: 'Plafon minimal Rp 10.000.000'
    },
    {
      field: 'interest_rate',
      required: false,
      type: 'number',
      min: 1,
      max: 30,
      message: 'Suku bunga 1-30%'
    }
  ]

  static readonly DOCUMENT_RULES: ValidationRule[] = [
    {
      field: 'document_type',
      required: true,
      type: 'string',
      custom: (value: string) => {
        const validTypes = [
          'KTP', 'KK', 'NPWP', 'AKTA_NIKAH', 'AKTA_CERAI', 
          'SURAT_KERJA', 'SLIP_GAJI', 'REKENING_KORAN', 'SKU', 
          'SERTIFIKAT', 'IMB', 'PBB', 'LAINNYA'
        ]
        return validTypes.includes(value) || 'Tipe dokumen tidak valid'
      },
      message: 'Tipe dokumen harus dipilih'
    },
    {
      field: 'file_name',
      required: true,
      type: 'string',
      minLength: 1,
      maxLength: 255,
      message: 'Nama file harus 1-255 karakter'
    },
    {
      field: 'file_size',
      required: true,
      type: 'number',
      min: 1,
      max: 50 * 1024 * 1024, // 50MB
      message: 'Ukuran file maksimal 50MB'
    },
    {
      field: 'mime_type',
      required: true,
      type: 'string',
      custom: (value: string) => {
        const validTypes = [
          'application/pdf',
          'image/jpeg',
          'image/png',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]
        return validTypes.includes(value) || 'Tipe file tidak didukung'
      },
      message: 'Tipe file tidak didukung'
    }
  ]

  // Validation methods
  static validate(data: any, rules: ValidationRule[]): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []

    for (const rule of rules) {
      const value = data[rule.field]
      const fieldErrors = this.validateField(rule.field, value, rule)
      errors.push(...fieldErrors)
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  static validateField(fieldName: string, value: any, rule: ValidationRule): ValidationError[] {
    const errors: ValidationError[] = []

    // Required validation
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push({
        field: fieldName,
        message: rule.message || `${fieldName} wajib diisi`,
        code: 'REQUIRED',
        value
      })
      return errors
    }

    // Skip other validations if field is empty and not required
    if (!rule.required && (value === undefined || value === null || value === '')) {
      return errors
    }

    // Type validation
    if (rule.type) {
      const typeError = this.validateType(fieldName, value, rule.type, rule.message)
      if (typeError) errors.push(typeError)
    }

    // Length validation for strings
    if (typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        errors.push({
          field: fieldName,
          message: rule.message || `${fieldName} minimal ${rule.minLength} karakter`,
          code: 'MIN_LENGTH',
          value
        })
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        errors.push({
          field: fieldName,
          message: rule.message || `${fieldName} maksimal ${rule.maxLength} karakter`,
          code: 'MAX_LENGTH',
          value
        })
      }
    }

    // Number validation
    if (typeof value === 'number') {
      if (rule.min !== undefined && value < rule.min) {
        errors.push({
          field: fieldName,
          message: rule.message || `${fieldName} minimal ${rule.min}`,
          code: 'MIN_VALUE',
          value
        })
      }

      if (rule.max !== undefined && value > rule.max) {
        errors.push({
          field: fieldName,
          message: rule.message || `${fieldName} maksimal ${rule.max}`,
          code: 'MAX_VALUE',
          value
        })
      }
    }

    // Pattern validation
    if (rule.pattern && typeof value === 'string') {
      if (!rule.pattern.test(value)) {
        errors.push({
          field: fieldName,
          message: rule.message || `${fieldName} format tidak valid`,
          code: 'PATTERN',
          value
        })
      }
    }

    // Custom validation
    if (rule.custom) {
      const result = rule.custom(value)
      if (result !== true) {
        errors.push({
          field: fieldName,
          message: typeof result === 'string' ? result : (rule.message || `${fieldName} tidak valid`),
          code: 'CUSTOM',
          value
        })
      }
    }

    return errors
  }

  private static validateType(fieldName: string, value: any, type: ValidationType, message?: string): ValidationError | null {
    switch (type) {
      case 'string':
        if (typeof value !== 'string') {
          return {
            field: fieldName,
            message: message || `${fieldName} harus berupa string`,
            code: 'INVALID_TYPE',
            value
          }
        }
        break

      case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
          return {
            field: fieldName,
            message: message || `${fieldName} harus berupa angka`,
            code: 'INVALID_TYPE',
            value
          }
        }
        break

      case 'email':
        if (typeof value !== 'string' || !this.PATTERNS.EMAIL.test(value)) {
          return {
            field: fieldName,
            message: message || `${fieldName} format email tidak valid`,
            code: 'INVALID_EMAIL',
            value
          }
        }
        break

      case 'phone':
        if (typeof value !== 'string' || !this.PATTERNS.PHONE_ID.test(value)) {
          return {
            field: fieldName,
            message: message || `${fieldName} format telepon tidak valid`,
            code: 'INVALID_PHONE',
            value
          }
        }
        break

      case 'nik':
        if (typeof value !== 'string' || !this.PATTERNS.NIK.test(value)) {
          return {
            field: fieldName,
            message: message || `${fieldName} NIK harus 16 digit`,
            code: 'INVALID_NIK',
            value
          }
        }
        break

      case 'npwp':
        if (typeof value !== 'string' || !this.PATTERNS.NPWP.test(value)) {
          return {
            field: fieldName,
            message: message || `${fieldName} format NPWP tidak valid`,
            code: 'INVALID_NPWP',
            value
          }
        }
        break

      case 'date':
        const date = new Date(value)
        if (isNaN(date.getTime())) {
          return {
            field: fieldName,
            message: message || `${fieldName} format tanggal tidak valid`,
            code: 'INVALID_DATE',
            value
          }
        }
        break

      case 'url':
        if (typeof value !== 'string' || !this.PATTERNS.URL.test(value)) {
          return {
            field: fieldName,
            message: message || `${fieldName} format URL tidak valid`,
            code: 'INVALID_URL',
            value
          }
        }
        break

      case 'boolean':
        if (typeof value !== 'boolean') {
          return {
            field: fieldName,
            message: message || `${fieldName} harus berupa boolean`,
            code: 'INVALID_TYPE',
            value
          }
        }
        break

      case 'array':
        if (!Array.isArray(value)) {
          return {
            field: fieldName,
            message: message || `${fieldName} harus berupa array`,
            code: 'INVALID_TYPE',
            value
          }
        }
        break

      case 'object':
        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
          return {
            field: fieldName,
            message: message || `${fieldName} harus berupa object`,
            code: 'INVALID_TYPE',
            value
          }
        }
        break

      case 'file':
        if (!(value instanceof File) && !(value instanceof Blob)) {
          return {
            field: fieldName,
            message: message || `${fieldName} harus berupa file`,
            code: 'INVALID_TYPE',
            value
          }
        }
        break
    }

    return null
  }

  // Utility validation methods
  static validateNIK(nik: string): boolean {
    return this.PATTERNS.NIK.test(nik)
  }

  static validateNPWP(npwp: string): boolean {
    return this.PATTERNS.NPWP.test(npwp)
  }

  static validatePhone(phone: string): boolean {
    return this.PATTERNS.PHONE_ID.test(phone)
  }

  static validateEmail(email: string): boolean {
    return this.PATTERNS.EMAIL.test(email)
  }

  static validatePostalCode(postalCode: string): boolean {
    return this.PATTERNS.POSTAL_CODE.test(postalCode)
  }

  static validateBankAccount(account: string): boolean {
    return this.PATTERNS.BANK_ACCOUNT.test(account)
  }

  // Format validation helpers
  static formatNIK(nik: string): string {
    return nik.replace(/\D/g, '').substring(0, 16)
  }

  static formatNPWP(npwp: string): string {
    const cleaned = npwp.replace(/\D/g, '')
    if (cleaned.length === 15) {
      return `${cleaned.substring(0, 2)}.${cleaned.substring(2, 5)}.${cleaned.substring(5, 8)}.${cleaned.substring(8, 9)}-${cleaned.substring(9, 12)}.${cleaned.substring(12, 15)}`
    }
    return cleaned
  }

  static formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.startsWith('62')) {
      return cleaned
    } else if (cleaned.startsWith('0')) {
      return '62' + cleaned.substring(1)
    }
    return '62' + cleaned
  }

  // Business logic validation
  static validateCustomerAge(birthDate: string, minAge: number = 17): boolean {
    const birth = new Date(birthDate)
    const now = new Date()
    const minDate = new Date(now.getFullYear() - minAge, now.getMonth(), now.getDate())
    return birth <= minDate
  }

  static validateLoanAmount(amount: number, minAmount: number = 100000000, maxAmount: number = 5000000000): boolean {
    return amount >= minAmount && amount <= maxAmount
  }

  static validateMonthlyIncome(income: number, minIncome: number = 3000000): boolean {
    return income >= minIncome
  }

  static validateDebtToIncomeRatio(debt: number, income: number, maxRatio: number = 0.4): boolean {
    return (debt / income) <= maxRatio
  }
}

// Export validation rule sets
export const VALIDATION_RULE_SETS = {
  CUSTOMER: ValidationRules.CUSTOMER_RULES,
  APPLICATION: ValidationRules.APPLICATION_RULES,
  UNIT: ValidationRules.UNIT_RULES,
  BANK: ValidationRules.BANK_RULES,
  DOCUMENT: ValidationRules.DOCUMENT_RULES
}

// Export convenience functions
export const validateCustomer = (data: any) => ValidationRules.validate(data, ValidationRules.CUSTOMER_RULES)
export const validateApplication = (data: any) => ValidationRules.validate(data, ValidationRules.APPLICATION_RULES)
export const validateUnit = (data: any) => ValidationRules.validate(data, ValidationRules.UNIT_RULES)
export const validateBank = (data: any) => ValidationRules.validate(data, ValidationRules.BANK_RULES)
export const validateDocument = (data: any) => ValidationRules.validate(data, ValidationRules.DOCUMENT_RULES)
