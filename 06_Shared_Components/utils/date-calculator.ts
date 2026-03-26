/**
 * KPRFlow Enterprise - Date Calculator Utility
 * Adapted from bramsray1 Google Apps Script for cross-platform use
 */

export interface DateRange {
  start: Date
  end: Date
}

export interface AgingInfo {
  days: number
  weeks: number
  months: number
  years: number
  businessDays: number
  isOverdue: boolean
  status: 'fresh' | 'normal' | 'aging' | 'critical' | 'overdue'
}

export interface WorkingDaysConfig {
  startHour: number
  endHour: number
  workingDays: number[] // 0 = Sunday, 1 = Monday, etc.
  holidays: Date[]
}

export class DateCalculator {
  private static readonly INDONESIAN_TIMEZONE = 'Asia/Jakarta'
  private static readonly WORKING_DAYS_CONFIG: WorkingDaysConfig = {
    startHour: 9,
    endHour: 17,
    workingDays: [1, 2, 3, 4, 5], // Monday - Friday
    holidays: []
  }

  /**
   * Calculate aging between two dates
   */
  static calculateAging(startDate: Date | string, endDate: Date | string = new Date()): AgingInfo {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate

    const timeDiff = end.getTime() - start.getTime()
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30.44) // Average month length
    const years = Math.floor(days / 365.25) // Account for leap years

    const businessDays = this.calculateBusinessDays(start, end)
    const isOverdue = days > 30 // Consider overdue after 30 days

    let status: AgingInfo['status'] = 'fresh'
    if (days <= 7) status = 'fresh'
    else if (days <= 14) status = 'normal'
    else if (days <= 21) status = 'aging'
    else if (days <= 30) status = 'critical'
    else status = 'overdue'

    return {
      days,
      weeks,
      months,
      years,
      businessDays,
      isOverdue,
      status
    }
  }

  /**
   * Calculate business days between two dates
   */
  static calculateBusinessDays(startDate: Date, endDate: Date, config?: Partial<WorkingDaysConfig>): number {
    const workingConfig = { ...this.WORKING_DAYS_CONFIG, ...config }
    let businessDays = 0
    let currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay()
      
      if (workingConfig.workingDays.includes(dayOfWeek)) {
        // Check if it's not a holiday
        const isHoliday = workingConfig.holidays.some(holiday => 
          this.isSameDay(holiday, currentDate)
        )
        
        if (!isHoliday) {
          businessDays++
        }
      }
      
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return businessDays
  }

  /**
   * Add working days to a date
   */
  static addWorkingDays(startDate: Date, days: number, config?: Partial<WorkingDaysConfig>): Date {
    const workingConfig = { ...this.WORKING_DAYS_CONFIG, ...config }
    const result = new Date(startDate)
    let daysAdded = 0

    while (daysAdded < days) {
      result.setDate(result.getDate() + 1)
      const dayOfWeek = result.getDay()
      
      if (workingConfig.workingDays.includes(dayOfWeek)) {
        const isHoliday = workingConfig.holidays.some(holiday => 
          this.isSameDay(holiday, result)
        )
        
        if (!isHoliday) {
          daysAdded++
        }
      }
    }

    return result
  }

  /**
   * Get due date based on aging
   */
  static getDueDate(startDate: Date | string, agingDays: number): Date {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate
    const dueDate = new Date(start)
    dueDate.setDate(dueDate.getDate() + agingDays)
    return dueDate
  }

  /**
   * Check if date is within range
   */
  static isDateInRange(date: Date, range: DateRange): boolean {
    return date >= range.start && date <= range.end
  }

  /**
   * Get date ranges for different periods
   */
  static getDateRanges(baseDate: Date = new Date()): {
    today: DateRange
    week: DateRange
    month: DateRange
    quarter: DateRange
    year: DateRange
  } {
    const today = new Date(baseDate)
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)

    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    const quarter = Math.floor(today.getMonth() / 3)
    const startOfQuarter = new Date(today.getFullYear(), quarter * 3, 1)
    const endOfQuarter = new Date(today.getFullYear(), quarter * 3 + 3, 0)

    const startOfYear = new Date(today.getFullYear(), 0, 1)
    const endOfYear = new Date(today.getFullYear(), 11, 31)

    return {
      today: { start: startOfDay, end: endOfDay },
      week: { start: startOfWeek, end: endOfWeek },
      month: { start: startOfMonth, end: endOfMonth },
      quarter: { start: startOfQuarter, end: endOfQuarter },
      year: { start: startOfYear, end: endOfYear }
    }
  }

  /**
   * Format date in Indonesian format
   */
  static formatIndonesian(date: Date | string, includeTime: boolean = false): string {
    const d = typeof date === 'string' ? new Date(date) : date
    
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }

    if (includeTime) {
      options.hour = '2-digit'
      options.minute = '2-digit'
      options.hour12 = false
    }

    return d.toLocaleDateString('id-ID', options)
  }

  /**
   * Parse Indonesian date string
   */
  static parseIndonesian(dateString: string): Date | null {
    try {
      // Handle common Indonesian date formats
      const formats = [
        /(\d{1,2})\s+(\w+)\s+(\d{4})/, // "1 Januari 2024"
        /(\d{1,2})-(\d{1,2})-(\d{4})/, // "1-1-2024"
        /(\d{4})-(\d{1,2})-(\d{1,2})/, // "2024-1-1"
        /(\d{1,2})\/(\d{1,2})\/(\d{4})/ // "1/1/2024"
      ]

      for (const format of formats) {
        const match = dateString.match(format)
        if (match) {
          let day: number, month: number, year: number

          if (format.source.includes('\\w+')) {
            // Indonesian month name format
            day = parseInt(match[1])
            const monthName = match[2].toLowerCase()
            year = parseInt(match[3])
            
            const monthMap: Record<string, number> = {
              'januari': 1, 'februari': 2, 'maret': 3, 'april': 4,
              'mei': 5, 'juni': 6, 'juli': 7, 'agustus': 8,
              'september': 9, 'oktober': 10, 'november': 11, 'desember': 12
            }
            
            month = monthMap[monthName] || 1
          } else {
            // Numeric format
            if (format.source.startsWith('(\\d{4})')) {
              year = parseInt(match[1])
              month = parseInt(match[2])
              day = parseInt(match[3])
            } else {
              day = parseInt(match[1])
              month = parseInt(match[2])
              year = parseInt(match[3])
            }
          }

          return new Date(year, month - 1, day)
        }
      }

      return null
    } catch {
      return null
    }
  }

  /**
   * Check if two dates are the same day
   */
  static isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate()
  }

  /**
   * Get relative time string (e.g., "2 days ago")
   */
  static getRelativeTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Hari ini'
    if (diffDays === 1) return 'Kemarin'
    if (diffDays < 7) return `${diffDays} hari yang lalu`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu yang lalu`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan yang lalu`
    return `${Math.floor(diffDays / 365)} tahun yang lalu`
  }

  /**
   * Get Indonesian public holidays for a year
   */
  static getIndonesianHolidays(year: number): Date[] {
    const holidays: Date[] = []

    // Fixed holidays
    holidays.push(new Date(year, 0, 1)) // New Year
    holidays.push(new Date(year, 4, 1)) // Labor Day
    holidays.push(new Date(year, 7, 17)) // Independence Day
    holidays.push(new Date(year, 11, 25)) // Christmas

    // Islamic holidays (approximate, need proper calculation)
    // These would need proper Hijri calendar calculation
    // holidays.push(new Date(year, 2, 22)) // Eid al-Fitr (approximate)
    // holidays.push(new Date(year, 6, 19)) // Eid al-Adha (approximate)

    // Other holidays that change yearly
    // holidays.push(new Date(year, 3, 10)) // Good Friday (approximate)
    // holidays.push(new Date(year, 4, 1)) // Ascension Day (approximate)

    return holidays
  }

  /**
   * Check if date is a working day
   */
  static isWorkingDay(date: Date, config?: Partial<WorkingDaysConfig>): boolean {
    const workingConfig = { ...this.WORKING_DAYS_CONFIG, ...config }
    const dayOfWeek = date.getDay()
    
    if (!workingConfig.workingDays.includes(dayOfWeek)) {
      return false
    }

    const isHoliday = workingConfig.holidays.some(holiday => 
      this.isSameDay(holiday, date)
    )

    return !isHoliday
  }

  /**
   * Get next working day
   */
  static getNextWorkingDay(date: Date, config?: Partial<WorkingDaysConfig>): Date {
    const workingConfig = { ...this.WORKING_DAYS_CONFIG, ...config }
    const nextDay = new Date(date)
    
    do {
      nextDay.setDate(nextDay.getDate() + 1)
    } while (!this.isWorkingDay(nextDay, workingConfig))

    return nextDay
  }

  /**
   * Get previous working day
   */
  static getPreviousWorkingDay(date: Date, config?: Partial<WorkingDaysConfig>): Date {
    const workingConfig = { ...this.WORKING_DAYS_CONFIG, ...config }
    const prevDay = new Date(date)
    
    do {
      prevDay.setDate(prevDay.getDate() - 1)
    } while (!this.isWorkingDay(prevDay, workingConfig))

    return prevDay
  }

  /**
   * Calculate SLA deadline
   */
  static calculateSLADeadline(
    startDate: Date | string,
    slaDays: number,
    config?: Partial<WorkingDaysConfig>
  ): Date {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate
    return this.addWorkingDays(start, slaDays, config)
  }

  /**
   * Check if SLA is met
   */
  static isSLAMet(
    startDate: Date | string,
    endDate: Date | string,
    slaDays: number,
    config?: Partial<WorkingDaysConfig>
  ): boolean {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate
    const businessDays = this.calculateBusinessDays(start, end, config)
    return businessDays <= slaDays
  }

  /**
   * Get SLA status
   */
  static getSLAStatus(
    startDate: Date | string,
    endDate: Date | string = new Date(),
    slaDays: number,
    config?: Partial<WorkingDaysConfig>
  ): {
    status: 'on_track' | 'warning' | 'overdue' | 'completed'
    daysUsed: number
    daysRemaining: number
    percentageUsed: number
  } {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate
    const businessDays = this.calculateBusinessDays(start, end, config)
    
    const daysUsed = Math.min(businessDays, slaDays)
    const daysRemaining = Math.max(slaDays - businessDays, 0)
    const percentageUsed = Math.min((daysUsed / slaDays) * 100, 100)

    let status: 'on_track' | 'warning' | 'overdue' | 'completed' = 'on_track'
    
    if (end < start) {
      status = 'completed'
    } else if (businessDays > slaDays) {
      status = 'overdue'
    } else if (percentageUsed >= 80) {
      status = 'warning'
    }

    return {
      status,
      daysUsed,
      daysRemaining,
      percentageUsed
    }
  }
}

// Export utility functions for convenience
export const calculateAging = DateCalculator.calculateAging
export const formatIndonesianDate = DateCalculator.formatIndonesian
export const getRelativeTime = DateCalculator.getRelativeTime
export const isSLAMet = DateCalculator.isSLAMet
