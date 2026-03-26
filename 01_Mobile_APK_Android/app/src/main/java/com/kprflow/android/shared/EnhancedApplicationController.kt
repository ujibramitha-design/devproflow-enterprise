package com.kprflow.android.shared

import android.util.Log
import com.kprflow.android.data.RawDataManager
import com.kprflow.android.data.CustomerData
import com.kprflow.android.data.ValidationResult
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.map

// Enhanced Application Controller - Integrates with 07_Raw_Materials_Data
class EnhancedApplicationController private constructor(
    private val rawDataManager: RawDataManager
) {
    
    companion object {
        private const val TAG = "EnhancedApplicationController"
        
        @Volatile
        private var INSTANCE: EnhancedApplicationController? = null
        
        fun getInstance(rawDataManager: RawDataManager): EnhancedApplicationController {
            return INSTANCE ?: synchronized(this) {
                INSTANCE ?: EnhancedApplicationController(rawDataManager).also { INSTANCE = it }
            }
        }
    }
    
    /**
     * Enhanced application creation with business rules validation
     */
    suspend fun createApplicationWithValidation(request: ApplicationCreateRequest): Result<ApplicationData> {
        return try {
            // Validate customer data using business rules
            val customerData = CustomerData(
                name = request.customerName,
                email = request.customerEmail,
                phoneNumber = request.customerPhone,
                birthDate = request.customerBirthDate,
                monthlyIncome = request.customerIncome,
                address = request.customerAddress
            )
            
            val validationResult = rawDataManager.validateCustomer(customerData)
            
            if (!validationResult.isValid) {
                return Result.failure(Exception("Validation failed: ${validationResult.errors.join(", ")}"))
            }
            
            // Check if bank is supported
            if (request.bankId != null) {
                val bank = rawDataManager.getBankById(request.bankId)
                if (bank == null) {
                    return Result.failure(Exception("Bank not found"))
                }
                
                // Validate bank-specific rules
                val bankValidation = validateBankSpecificRules(bank, customerData)
                if (!bankValidation.isValid) {
                    return Result.failure(Exception("Bank validation failed: ${bankValidation.errors.join(", ")}"))
                }
            }
            
            // Create application using base controller
            val baseController = ApplicationController.getInstance()
            val result = baseController.createApplication(request)
            
            if (result.isSuccess) {
                val application = result.getOrNull()
                
                // Apply SLA rules
                val slaAppliedApplication = applySLARules(application)
                
                // Send notification using templates
                sendNotificationWithTemplates(slaAppliedApplication, "application_created")
                
                Result.success(slaAppliedApplication)
            } else {
                result
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error creating application with validation", e)
            Result.failure(e)
        }
    }
    
    /**
     * Enhanced application update with business rules validation
     */
    suspend fun updateApplicationWithValidation(
        id: String,
        request: ApplicationUpdateRequest
    ): Result<ApplicationData> {
        return try {
            // Get current application
            val baseController = ApplicationController.getInstance()
            val currentAppResult = baseController.getApplicationById(id)
            
            if (!currentAppResult.isSuccess) {
                return Result.failure(Exception("Application not found"))
            }
            
            val currentApp = currentAppResult.getOrNull()
            
            // Validate status change using business rules
            if (request.status != null && request.status != currentApp.status) {
                val statusValidation = validateStatusChangeWithRules(
                    currentApp.status,
                    request.status,
                    currentApp
                )
                
                if (!statusValidation.isValid) {
                    return Result.failure(Exception("Status validation failed: ${statusValidation.errors.join(", ")}"))
                }
                
                // Apply SLA rules for status change
                val slaValidation = validateSLAForStatusChange(
                    currentApp.status,
                    request.status,
                    currentApp
                )
                
                if (!slaValidation.isValid) {
                    return Result.failure(Exception("SLA validation failed: ${slaValidation.errors.join(", ")}"))
                }
            }
            
            // Update application
            val result = baseController.updateApplication(id, request)
            
            if (result.isSuccess) {
                val updatedApp = result.getOrNull()
                
                // Apply SLA rules
                val slaAppliedApplication = applySLARules(updatedApp)
                
                // Send notification using templates
                if (request.status != null && request.status != currentApp.status) {
                    sendNotificationWithTemplates(slaAppliedApplication, "status_changed")
                }
                
                Result.success(slaAppliedApplication)
            } else {
                result
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error updating application with validation", e)
            Result.failure(e)
        }
    }
    
    /**
     * Get applications with enhanced filtering
     */
    suspend fun getApplicationsWithFilters(
        filters: EnhancedApplicationFilters
    ): Result<ApplicationListResponse> {
        return try {
            val baseController = ApplicationController.getInstance()
            
            // Convert enhanced filters to base filters
            val baseFilters = ApplicationFilters(
                status = filters.status,
                customerId = filters.customerId,
                unitId = filters.unitId,
                bankId = filters.bankId,
                dateFrom = filters.dateFrom,
                dateTo = filters.dateTo,
                search = filters.search
            )
            
            val result = baseController.getAllApplications(
                filters = baseFilters,
                page = filters.page,
                limit = filters.limit
            )
            
            if (result.isSuccess) {
                val applications = result.getOrNull()?.data ?: emptyList()
                
                // Apply additional filtering based on raw data
                val filteredApplications = applications.filter { app ->
                    var passesFilter = true
                    
                    // Filter by bank name
                    if (filters.bankName != null && app.bankId != null) {
                        val bank = rawDataManager.getBankById(app.bankId)
                        if (bank != null && !bank.name.contains(filters.bankName, ignoreCase = true)) {
                            passesFilter = false
                        }
                    }
                    
                    // Filter by bank type
                    if (filters.bankType != null && app.bankId != null) {
                        val bank = rawDataManager.getBankById(app.bankId)
                        if (bank != null && bank.type != filters.bankType) {
                            passesFilter = false
                        }
                    }
                    
                    // Filter by SLA status
                    if (filters.slaStatus != null) {
                        if (app.sla_status != filters.slaStatus) {
                            passesFilter = false
                        }
                    }
                    
                    passesFilter
                }
                
                val enhancedResult = ApplicationListResponse(
                    success = true,
                    data = filteredApplications,
                    count = filteredApplications.size,
                    page = result.page,
                    limit = result.limit,
                    total = result.total,
                    hasMore = result.hasMore
                )
                
                Result.success(enhancedResult)
            } else {
                result
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error getting applications with enhanced filters", e)
            Result.failure(e)
        }
    }
    
    /**
     * Get application statistics with enhanced metrics
     */
    suspend fun getEnhancedApplicationStatistics(): Result<EnhancedApplicationStatistics> {
        return try {
            val baseController = ApplicationController.getInstance()
            val result = baseController.getApplicationStatistics()
            
            if (result.isSuccess) {
                val stats = result.getOrNull()
                
                // Calculate enhanced statistics
                val enhancedStats = EnhancedApplicationStatistics(
                    total = stats.total,
                    byStatus = stats.byStatus,
                    byBank = calculateBankStatistics(stats.byStatus),
                    byMonth = stats.byMonth,
                    averageProcessingTime = stats.averageProcessingTime,
                    approvalRate = stats.approvalRate,
                    rejectionRate = stats.rejectionRate,
                    slaComplianceRate = calculateSLAComplianceRate(),
                    bankPerformance = calculateBankPerformance(),
                    statusTransitionMetrics = calculateStatusTransitionMetrics()
                )
                
                Result.success(enhancedStats)
            } else {
                result
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error getting enhanced application statistics", e)
            Result.failure(e)
        }
    }
    
    /**
     * Get bank information
     */
    fun getBankInformation(bankId: Int): BankInfo? {
        val bank = rawDataManager.getBankById(bankId)
        return bank?.let {
            BankInfo(
                id = it.id,
                name = it.name,
                fullName = it.fullName,
                code = it.code,
                type = it.type,
                category = it.category,
                headquarters = it.headquarters,
                foundedYear = it.foundedYear,
                website = it.website,
                contact = it.contact,
                kprPrograms = it.kprPrograms,
                averageApprovalRate = calculateBankApprovalRate(it.id),
                averageProcessingTime = calculateBankProcessingTime(it.id)
            )
        }
    }
    
    /**
     * Get all banks
     */
    fun getAllBanks(): List<BankInfo> {
        return rawDataManager.getBanks()?.map { bank ->
            BankInfo(
                id = bank.id,
                name = bank.name,
                fullName = bank.fullName,
                code = bank.code,
                type = bank.type,
                category = bank.category,
                headquarters = bank.headquarters,
                foundedYear = bank.foundedYear,
                website = bank.website,
                contact = bank.contact,
                kprPrograms = bank.kprPrograms,
                averageApprovalRate = calculateBankApprovalRate(bank.id),
                averageProcessingTime = calculateBankProcessingTime(bank.id)
            )
        } ?: emptyList()
    }
    
    /**
     * Get KPR programs for a bank
     */
    fun getKPRProgramsForBank(bankId: Int): List<KPRProgram> {
        return rawDataManager.getKPRProgramsForBank(bankId)
    }
    
    /**
     * Get notification template
     */
    fun getNotificationTemplate(templateId: String, channel: String): NotificationTemplateChannel? {
        return rawDataManager.getNotificationTemplateForChannel(templateId, channel)
    }
    
    /**
     * Send notification using templates
     */
    private suspend fun sendNotificationWithTemplates(
        application: ApplicationData,
        templateType: String
    ) {
        try {
            val templateId = when (templateType) {
                "application_created" -> "application_created_notification"
                "status_changed" -> "status_changed_notification"
                else -> "default_notification"
            }
            
            val template = rawDataManager.getNotificationTemplateForChannel(templateId, "whatsapp")
            if (template != null) {
                // Replace template variables
                val message = template.body
                    .replace("{{customer_name}}", application.customerName)
                    .replace("{{application_id}}", application.id)
                    .replace("{{status}}", application.status)
                    .replace("{{unit_type}}", application.unitType)
                    .replace("{{unit_block}}", application.unitBlock)
                    .replace("{{unit_number}}", application.unitNumber)
                
                // Send notification (implementation depends on notification service)
                Log.d(TAG, "Sending notification: $message")
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error sending notification with templates", e)
        }
    }
    
    // Private helper methods
    private fun validateBankSpecificRules(bank: Bank, customer: CustomerData): ValidationResult {
        val errors = mutableListOf<String>()
        
        // Get bank-specific business rules
        val bankRules = rawDataManager.getBusinessRules()
            ?.businessRules
            ?.filter { it.bankSpecific == bank.code }
        
        bankRules?.forEach { rule ->
            when (rule.validationType) {
                "income_check" -> {
                    if (!evaluateCondition(rule.condition, customer.monthlyIncome)) {
                        errors.add(rule.errorMessage)
                    }
                }
                "age_check" -> {
                    val age = calculateAge(customer.birthDate)
                    if (!evaluateCondition(rule.condition, age)) {
                        errors.add(rule.errorMessage)
                    }
                }
            }
        }
        
        return ValidationResult(
            isValid = errors.isEmpty(),
            errors = errors
        )
    }
    
    private fun validateStatusChangeWithRules(
        fromStatus: String,
        toStatus: String,
        application: ApplicationData
    ): ValidationResult {
        val errors = mutableListOf<String>()
        
        // Get status transition rules
        val statusTemplate = rawDataManager.getStatusTemplates()
            ?.statusTemplates
            ?.find { it.status == fromStatus }
        
        if (statusTemplate != null) {
            if (!statusTemplate.nextStatuses.contains(toStatus)) {
                errors.add("Status change from $fromStatus to $toStatus is not allowed")
            }
        }
        
        return ValidationResult(
            isValid = errors.isEmpty(),
            errors = errors
        )
    }
    
    private fun validateSLAForStatusChange(
        fromStatus: String,
        toStatus: String,
        application: ApplicationData
    ): ValidationResult {
        val errors = mutableListOf<String>()
        
        // Get SLA configuration
        val slaConfig = rawDataManager.getSLAConfiguration()
        
        // Check if status change violates SLA
        val slaRule = slaConfig?.slaRules?.find { it.status == toStatus }
        if (slaRule != null) {
            val aging = application.aging_days
            if (aging > slaRule.maxDays) {
                errors.add("Cannot change status: SLA exceeded for $toStatus")
            }
        }
        
        return ValidationResult(
            isValid = errors.isEmpty(),
            errors = errors
        )
    }
    
    private fun applySLARules(application: ApplicationData): ApplicationData {
        val slaConfig = rawDataManager.getSLAConfiguration()
        val slaRule = slaConfig?.slaRules?.find { it.status == application.status }
        
        return if (slaRule != null) {
            application.copy(
                sla_status = when {
                    application.aging_days <= slaRule.maxDays -> "on_track"
                    application.aging_days <= slaRule.maxDays + slaRule.warningDays -> "warning"
                    application.aging_days <= slaRule.maxDays + slaRule.warningDays + slaRule.criticalDays -> "overdue"
                    else -> "critical"
                }
            )
        } else {
            application
        }
    }
    
    private fun calculateBankStatistics(byStatus: Map<String, Int>): Map<String, Int> {
        // This would require joining with bank data
        // For now, return empty map
        return emptyMap()
    }
    
    private fun calculateSLAComplianceRate(): Double {
        // This would require calculating based on actual data
        // For now, return a placeholder value
        return 0.85
    }
    
    private fun calculateBankPerformance(): Map<String, BankPerformance> {
        // This would require calculating based on actual data
        // For now, return empty map
        return emptyMap()
    }
    
    private fun calculateStatusTransitionMetrics(): Map<String, TransitionMetrics> {
        // This would require calculating based on actual data
        // For now, return empty map
        return emptyMap()
    }
    
    private fun calculateBankApprovalRate(bankId: Int): Double {
        // This would require calculating based on actual data
        // For now, return a placeholder value
        return 0.75
    }
    
    private fun calculateBankProcessingTime(bankId: Int): Int {
        // This would require calculating based on actual data
        // For now, return a placeholder value
        return 14
    }
    
    private fun evaluateCondition(condition: String, value: Any): Boolean {
        return try {
            when {
                condition.contains(">=") -> {
                    val parts = condition.split(">=")
                    val threshold = parts[1].trim().toDouble()
                    (value as Number).toDouble() >= threshold
                }
                condition.contains("<=") -> {
                    val parts = condition.split("<=")
                    val threshold = parts[1].trim().toDouble()
                    (value as Number).toDouble() <= threshold
                }
                condition.contains(">") -> {
                    val parts = condition.split(">")
                    val threshold = parts[1].trim().toDouble()
                    (value as Number).toDouble() > threshold
                }
                condition.contains("<") -> {
                    val parts = condition.split("<")
                    val threshold = parts[1].trim().toDouble()
                    (value as Number).toDouble() < threshold
                }
                else -> true
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error evaluating condition: $condition", e)
            false
        }
    }
    
    private fun calculateAge(birthDate: String): Int {
        return try {
            val birth = java.time.LocalDate.parse(birthDate)
            val now = java.time.LocalDate.now()
            java.time.Period.between(birth, now).years
        } catch (e: Exception) {
            0
        }
    }
}

// Enhanced data classes
data class EnhancedApplicationFilters(
    val status: List<String> = emptyList(),
    val customerId: String? = null,
    val unitId: String? = null,
    val bankId: String? = null,
    val bankName: String? = null,
    val bankType: String? = null,
    val slaStatus: String? = null,
    val dateFrom: String? = null,
    val dateTo: String? = null,
    val search: String? = null,
    val page: Int = 1,
    val limit: Int = 20
)

data class EnhancedApplicationCreateRequest(
    val customerName: String,
    val customerEmail: String,
    val customerPhone: String,
    val customerBirthDate: String,
    val customerIncome: Double,
    val customerAddress: String,
    val customerId: String,
    val unitId: String,
    val bankId: String? = null,
    val notes: String? = null
)

data class EnhancedApplicationStatistics(
    val total: Int,
    val byStatus: Map<String, Int>,
    val byBank: Map<String, Int>,
    val byMonth: Map<String, Int>,
    val averageProcessingTime: Int,
    val approvalRate: Double,
    val rejectionRate: Double,
    val slaComplianceRate: Double,
    val bankPerformance: Map<String, BankPerformance>,
    val statusTransitionMetrics: Map<String, TransitionMetrics>
)

data class BankPerformance(
    val approvalRate: Double,
    val averageProcessingTime: Int,
    val totalApplications: Int,
    val slaComplianceRate: Double
)

data class TransitionMetrics(
    val fromStatus: String,
    val toStatus: String,
    val count: Int,
    val averageTime: Int
)

data class BankInfo(
    val id: Int,
    val name: String,
    val fullName: String,
    val code: String,
    val type: String,
    val category: String,
    val headquarters: String,
    val foundedYear: Int,
    val website: String,
    val contact: ContactInfo,
    val kprPrograms: List<KPRProgram>,
    val averageApprovalRate: Double,
    val averageProcessingTime: Int
)
