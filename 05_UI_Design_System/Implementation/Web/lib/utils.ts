import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// DevPro-Enterprise specific utility functions
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(dateObj)
}

export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Format for Indonesian phone numbers
  if (cleaned.startsWith('62')) {
    return `+62 ${cleaned.slice(2, 4)} ${cleaned.slice(4, 8)} ${cleaned.slice(8)}`
  } else if (cleaned.startsWith('0')) {
    return `+62 ${cleaned.slice(1, 3)} ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`
  }
  
  return phone
}

export function calculateMonthlyInstallment(
  principal: number,
  annualRate: number,
  years: number
): number {
  const monthlyRate = annualRate / 100 / 12
  const months = years * 12
  
  if (monthlyRate === 0) {
    return principal / months
  }
  
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
         (Math.pow(1 + monthlyRate, months) - 1)
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'text-devpro-warning bg-devpro-warning/10'
    case 'approved':
      return 'text-devpro-success bg-devpro-success/10'
    case 'rejected':
      return 'text-devpro-error bg-devpro-error/10'
    case 'completed':
      return 'text-devpro-primary bg-devpro-primary/10'
    default:
      return 'text-devpro-muted-foreground bg-devpro-muted'
  }
}

export function getPropertyTypeColor(type: string): string {
  switch (type.toLowerCase()) {
    case 'residential':
      return 'devpro-type-residential'
    case 'commercial':
      return 'devpro-type-commercial'
    case 'mixed':
      return 'devpro-type-mixed'
    default:
      return 'text-devpro-foreground bg-devpro-muted'
  }
}

export function getLoanAmountColor(amount: number): string {
  if (amount <= 500000000) {
    return 'devpro-loan-low'
  } else if (amount <= 1500000000) {
    return 'devpro-loan-medium'
  } else {
    return 'devpro-loan-high'
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
