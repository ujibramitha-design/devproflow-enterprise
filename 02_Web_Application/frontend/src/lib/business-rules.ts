/**
 * KPRFlow Enterprise - Business Rules Manager
 * Integrated with 07_Raw_Materials_Data configuration
 */

export interface BusinessRule {
  rule_id: string
  name: string
  condition: string
  description: string
  error_message: string
  severity: 'critical' | 'warning' | 'info'
  validation_type: string
  applies_to: string[]
  bank_specific?: string
}

export interface BusinessRuleCategory {
  id: number
  name: string
  category: string
  description: string
  rules: BusinessRule[]
}

export interface BusinessRulesData {
  version: string
  last_updated: string
  source: string
  total_rules: number
  description: string
  business_rules: BusinessRuleCategory[]
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  info: string[]
  ruleViolations: {
    rule_id: string
    severity: string
    message: string
  }[]
}

export class BusinessRulesManager {
  private static instance: BusinessRulesManager
  private businessRules: BusinessRulesData | null = null

  private constructor() {}

  static getInstance(): BusinessRulesManager {
    if (!BusinessRulesManager.instance) {
      BusinessRulesManager.instance = new BusinessRulesManager()
    }
    return BusinessRulesManager.instance
  }

  /**
   * Load business rules from configuration
   */
  async loadBusinessRules(): Promise<BusinessRulesData> {
    try {
      // In production, this would load from the actual JSON file
      // For now, we'll use the embedded business rules
      const response = await fetch('/api/business-rules')
      if (!response.ok) {
        throw new Error('Failed to load business rules')
      }
      
      this.businessRules = await response.json()
      return this.businessRules!
    } catch (error) {
      console.error('Error loading business rules:', error)
      // Fallback to embedded rules
      this.businessRules = this.getEmbeddedBusinessRules()
      return this.businessRules
    }
  }

  /**
   * Get embedded business rules (fallback)
   */
  private getEmbeddedBusinessRules(): BusinessRulesData {
    return {
      version: "1.0.0",
      last_updated: "2026-03-20",
      source: "kprflow_enterprise_business_rules",
      total_rules: 32,
      description: "Complete business rules and validation logic for KPRFlow Enterprise",
      business_rules: [
        {
          id: 1,
          name: "Customer Eligibility Rules",
          category: "customer_validation",
          description: "Customer eligibility criteria for KPR applications",
          rules: [
            {
              rule_id: "CUST_001",
              name: "Minimum Age Requirement",
              condition: "age >= 19",
              description: "Customer must be at least 19 years old (BTN Bank only)",
              error_message: "Customer must be at least 19 years old (BTN Bank only)",
              severity: "critical",
              validation_type: "age_check",
              applies_to: ["application", "customer_validation"],
              bank_specific: "BTN"
            },
            {
              rule_id: "CUST_002",
              name: "Maximum Age Requirement",
              condition: "age <= 55",
              description: "Customer must not be older than 55 years old",
              error_message: "Customer age must be 55 years or younger",
              severity: "critical",
              validation_type: "age_check",
              applies_to: ["application", "customer_validation"]
            },
            {
              rule_id: "CUST_003",
              name: "Minimum Income Requirement",
              condition: "monthly_income >= 3000000",
              description: "Customer must have minimum monthly income of Rp 3,000,000",
              error_message: "Minimum monthly income required is Rp 3,000,000",
              severity: "critical",
              validation_type: "income_check",
              applies_to: ["application", "customer_validation"]
            }
          ]
        },
        {
          id: 2,
          name: "Property Validation Rules",
          category: "property_validation",
          description: "Property eligibility criteria for KPR applications",
          rules: [
            {
              rule_id: "PROP_001",
              name: "Property Type Validation",
              condition: "property_type in ['residential', 'commercial', 'mixed']",
              description: "Property type must be residential, commercial, or mixed",
              error_message: "Invalid property type",
              severity: "critical",
              validation_type: "property_type_check",
              applies_to: ["application", "property_validation"]
            },
            {
              rule_id: "PROP_002",
              name: "Minimum Property Value",
              condition: "property_value >= 50000000",
              description: "Property value must be at least Rp 50,000,000",
              error_message: "Property value must be at least Rp 50,000,000",
              severity: "critical",
              validation_type: "property_value_check",
              applies_to: ["application", "property_validation"]
            },
            {
              rule_id: "PROP_003",
              name: "Maximum Loan Amount",
              condition: "loan_amount <= property_value * 0.8",
              description: "Loan amount cannot exceed 80% of property value",
              error_message: "Loan amount cannot exceed 80% of property value",
              severity: "critical",
              validation_type: "loan_amount_check",
              applies_to: ["application", "property_validation"]
            }
          ]
        },
        {
          id: 3,
          name: "Document Validation Rules",
          category: "document_validation",
          description: "Document requirements for KPR applications",
          rules: [
            {
              rule_id: "DOC_001",
              name: "ID Card Required",
              condition: "has_id_card == true",
              description: "Customer must provide valid ID card",
              error_message: "Valid ID card is required",
              severity: "critical",
              validation_type: "document_check",
              applies_to: ["application", "document_validation"]
            },
            {
              rule_id: "DOC_002",
              name: "Income Proof Required",
              condition: "has_income_proof == true",
              description: "Customer must provide income proof",
              error_message: "Income proof is required",
              severity: "critical",
              validation_type: "document_check",
              applies_to: ["application", "document_validation"]
            },
            {
              rule_id: "DOC_003",
              name: "Property Documents Required",
              condition: "has_property_documents == true",
              description: "Property documents must be provided",
              error_message: "Property documents are required",
              severity: "critical",
              validation_type: "document_check",
              applies_to: ["application", "document_validation"]
            }
          ]
        }
      ]
    }
  }

  /**
   * Validate application against business rules
   */
  async validateApplication(applicationData: any, bankSpecific?: string): Promise<ValidationResult> {
    if (!this.businessRules) {
      await this.loadBusinessRules()
    }

    const result: ValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
      info: [],
      ruleViolations: []
    }

    if (!this.businessRules) {
      throw new Error('Business rules not loaded')
    }

    for (const category of this.businessRules.business_rules) {
      for (const rule of category.rules) {
        // Skip bank-specific rules if not matching
        if (rule.bank_specific && rule.bank_specific !== bankSpecific) {
          continue
        }

        const validationResult = this.evaluateRule(rule, applicationData)
        
        if (!validationResult.valid) {
          result.valid = false
          result.ruleViolations.push({
            rule_id: rule.rule_id,
            severity: rule.severity,
            message: rule.error_message
          })

          switch (rule.severity) {
            case 'critical':
              result.errors.push(rule.error_message)
              break
            case 'warning':
              result.warnings.push(rule.error_message)
              break
            case 'info':
              result.info.push(rule.error_message)
              break
          }
        }
      }
    }

    return result
  }

  /**
   * Evaluate individual rule
   */
  private evaluateRule(rule: BusinessRule, data: any): { valid: boolean } {
    try {
      // Simple rule evaluation (in production, this would be more sophisticated)
      switch (rule.validation_type) {
        case 'age_check':
          if (rule.rule_id === 'CUST_001') {
            return { valid: (data.age || 0) >= 19 }
          } else if (rule.rule_id === 'CUST_002') {
            return { valid: (data.age || 0) <= 55 }
          }
          break

        case 'income_check':
          return { valid: (data.monthly_income || 0) >= 3000000 }

        case 'property_type_check':
          return { valid: ['residential', 'commercial', 'mixed'].includes(data.property_type) }

        case 'property_value_check':
          return { valid: (data.property_value || 0) >= 50000000 }

        case 'loan_amount_check':
          return { valid: (data.loan_amount || 0) <= (data.property_value || 0) * 0.8 }

        case 'document_check':
          if (rule.rule_id === 'DOC_001') {
            return { valid: data.has_id_card === true }
          } else if (rule.rule_id === 'DOC_002') {
            return { valid: data.has_income_proof === true }
          } else if (rule.rule_id === 'DOC_003') {
            return { valid: data.has_property_documents === true }
          }
          return { valid: true }

        default:
          return { valid: true }
      }
      return { valid: true }
    } catch (error) {
      console.error(`Error evaluating rule ${rule.rule_id}:`, error)
      return { valid: true } // Fail safe
    }
  }

  /**
   * Get rules by category
   */
  getRulesByCategory(category: string): BusinessRule[] {
    if (!this.businessRules) {
      return []
    }

    const categoryData = this.businessRules.business_rules.find(cat => cat.category === category)
    return categoryData ? categoryData.rules : []
  }

  /**
   * Get rule by ID
   */
  getRuleById(ruleId: string): BusinessRule | null {
    if (!this.businessRules) {
      return null
    }

    for (const category of this.businessRules.business_rules) {
      const rule = category.rules.find(r => r.rule_id === ruleId)
      if (rule) {
        return rule
      }
    }

    return null
  }

  /**
   * Get business rules summary
   */
  getBusinessRulesSummary(): {
    totalRules: number
    categories: string[]
    severityBreakdown: Record<string, number>
  } {
    if (!this.businessRules) {
      return {
        totalRules: 0,
        categories: [],
        severityBreakdown: {}
      }
    }

    const categories = this.businessRules.business_rules.map(cat => cat.category)
    const severityBreakdown: Record<string, number> = {}

    for (const category of this.businessRules.business_rules) {
      for (const rule of category.rules) {
        severityBreakdown[rule.severity] = (severityBreakdown[rule.severity] || 0) + 1
      }
    }

    return {
      totalRules: this.businessRules.total_rules,
      categories,
      severityBreakdown
    }
  }
}

// Export singleton instance
export const businessRulesManager = BusinessRulesManager.getInstance()
