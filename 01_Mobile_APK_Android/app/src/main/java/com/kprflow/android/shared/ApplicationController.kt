package com.kprflow.android.shared

import android.util.Log
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.map

// Application Controller - Adapted from 06_Shared_Components
class ApplicationController private constructor() {
    
    companion object {
        private const val TAG = "ApplicationController"
        
        @Volatile
        private var INSTANCE: ApplicationController? = null
        
        fun getInstance(): ApplicationController {
            return INSTANCE ?: synchronized(this) {
                INSTANCE ?: ApplicationController().also { INSTANCE = it }
            }
        }
    }
    
    /**
     * Get all applications with optional filters
     */
    suspend fun getAllApplications(
        filters: ApplicationFilters? = null,
        page: Int = 1,
        limit: Int = 20
    ): Result<ApplicationListResponse> {
        return try {
            val supabaseClient = SupabaseClient.getInstance()
            
            // Build query with filters
            var query = "kpr_applications"
            var offset = (page - 1) * limit
            
            // Apply filters
            filters?.let { filter ->
                if (filter.status.isNotEmpty()) {
                    // In a real implementation, you'd build the query differently
                    // For now, we'll use the basic select and filter in the client
                }
            }
            
            // Get applications
            val result = supabaseClient.select(
                table = query,
                orderBy = "created_at.desc",
                limit = limit,
                offset = offset
            )
            
            val applications = result.getOrNull()?.map { app ->
                ApplicationData(
                    id = app["id"] as? String ?: "",
                    customerName = app["customer_name"] as? String ?: "",
                    customerEmail = app["customer_email"] as? String ?: "",
                    customerPhone = app["customer_phone"] as? String ?: "",
                    unitType = app["unit_type"] as? String ?: "",
                    unitBlock = app["unit_block"] as? String ?: "",
                    unitNumber = app["unit_number"] as? String ?: "",
                    status = app["status"] as? String ?: "",
                    bankId = app["bank_id"] as? String,
                    created_at = app["created_at"] as? String ?: "",
                    updated_at = app["updated_at"] as? String ?: "",
                    notes = app["notes"] as? String,
                    aging_days = calculateAging(app["created_at"] as? String ?: ""),
                    sla_status = getSLAStatus(app["created_at"] as? String ?: "", app["status"] as? String ?: "")
                )
            } ?: emptyList()
            
            // Calculate statistics
            val stats = calculateApplicationStatistics(applications)
            
            ApplicationListResponse(
                success = true,
                data = applications,
                count = applications.size,
                page = page,
                limit = limit,
                total = stats.total,
                hasMore = applications.size == limit
            )
        } catch (e: Exception) {
            Log.e(TAG, "Error fetching applications", e)
            ApplicationListResponse(
                success = false,
                data = emptyList(),
                count = 0,
                error = e.message
            )
        }
    }
    
    /**
     * Get application by ID
     */
    suspend fun getApplicationById(id: String): Result<ApplicationData> {
        return try {
            val supabaseClient = SupabaseClient.getInstance()
            val result = supabaseClient.getApplicationById(id)
            
            if (result.isSuccess) {
                val app = result.getOrNull() ?: emptyMap()
                val application = ApplicationData(
                    id = app["id"] as? String ?: "",
                    customerName = app["customer_name"] as? String ?: "",
                    customerEmail = app["customer_email"] as? String ?: "",
                    customerPhone = app["customer_phone"] as? String ?: "",
                    unitType = app["unit_type"] as? String ?: "",
                    unitBlock = app["unit_block"] as? String ?: "",
                    unitNumber = app["unit_number"] as? String ?: "",
                    status = app["status"] as? String ?: "",
                    bankId = app["bank_id"] as? String,
                    created_at = app["created_at"] as? String ?: "",
                    updated_at = app["updated_at"] as? String ?: "",
                    notes = app["notes"] as? String,
                    aging_days = calculateAging(app["created_at"] as? String ?: ""),
                    sla_status = getSLAStatus(app["created_at"] as? String ?: "", app["status"] as? String ?: "")
                )
                Result.success(application)
            } else {
                Result.failure(Exception("Application not found"))
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error fetching application by ID: $id", e)
            Result.failure(e)
        }
    }
    
    /**
     * Create new application
     */
    suspend fun createApplication(request: ApplicationCreateRequest): Result<ApplicationData> {
        return try {
            val supabaseClient = SupabaseClient.getInstance()
            
            // Validate request
            val validation = validateApplicationCreation(request)
            if (!validation.isValid) {
                return Result.failure(Exception(validation.errors.join(", ")))
            }
            
            // Create application data
            val applicationData = mapOf(
                "customer_id" to request.customerId,
                "unit_id" to request.unitId,
                "bank_id" to request.bankId,
                "status" to "PENDING",
                "notes" to request.notes,
                "created_at" to getCurrentTimestamp(),
                "updated_at" to getCurrentTimestamp()
            )
            
            val result = supabaseClient.createApplication(applicationData)
            
            if (result.isSuccess) {
                val createdApp = result.getOrNull() ?: emptyMap()
                val application = ApplicationData(
                    id = createdApp["id"] as? String ?: "",
                    customerName = "", // Would fetch from customer table
                    customerEmail = "",
                    customerPhone = "",
                    unitType = "", // Would fetch from unit table
                    unitBlock = "",
                    unitNumber = "",
                    status = "PENDING",
                    bankId = request.bankId,
                    created_at = createdApp["created_at"] as? String ?: "",
                    updated_at = createdApp["updated_at"] as? String ?: "",
                    notes = request.notes,
                    aging_days = 0,
                    sla_status = "on_track"
                )
                
                // Send notification
                sendStatusChangeNotification(application, null, "PENDING")
                
                Result.success(application)
            } else {
                Result.failure(Exception("Failed to create application"))
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error creating application", e)
            Result.failure(e)
        }
    }
    
    /**
     * Update application
     */
    suspend fun updateApplication(id: String, request: ApplicationUpdateRequest): Result<ApplicationData> {
        return try {
            val supabaseClient = SupabaseClient.getInstance()
            
            // Get current application
            val currentAppResult = getApplicationById(id)
            if (!currentAppResult.isSuccess) {
                return Result.failure(Exception("Application not found"))
            }
            
            val currentApp = currentAppResult.getOrNull()
            
            // Validate status change
            if (request.status != null && request.status != currentApp.status) {
                val validation = validateStatusChange(
                    currentApp.status,
                    request.status,
                    currentApp
                )
                if (!validation.isValid) {
                    return Result.failure(Exception(validation.errors.join(", ")))
                }
            }
            
            // Update application data
            val updateData = mutableMapOf<String, Any>()
            request.status?.let { updateData["status"] = it }
            request.notes?.let { updateData["notes"] = it }
            request.bankId?.let { updateData["bank_id"] = it }
            updateData["updated_at"] = getCurrentTimestamp()
            
            val result = supabaseClient.updateApplication(id, updateData)
            
            if (result.isSuccess) {
                val updatedApp = result.getOrNull() ?: emptyMap()
                val application = ApplicationData(
                    id = id,
                    customerName = currentApp.customerName,
                    customerEmail = currentApp.customerEmail,
                    customerPhone = currentApp.customerPhone,
                    unitType = currentApp.unitType,
                    unitBlock = currentApp.unitBlock,
                    unitNumber = currentApp.unitNumber,
                    status = request.status ?: currentApp.status,
                    bankId = request.bankId ?: currentApp.bankId,
                    created_at = currentApp.created_at,
                    updated_at = updatedApp["updated_at"] as? String ?: currentApp.updated_at,
                    notes = request.notes ?: currentApp.notes,
                    aging_days = calculateAging(currentApp.created_at),
                    sla_status = getSLAStatus(currentApp.created_at, request.status ?: currentApp.status)
                )
                
                // Log status change
                if (request.status != null && request.status != currentApp.status) {
                    logStatusChange(id, currentApp.status, request.status, request.notes)
                    
                    // Send notification
                    sendStatusChangeNotification(application, currentApp.status, request.status)
                }
                
                Result.success(application)
            } else {
                Result.failure(Exception("Failed to update application"))
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error updating application", e)
            Result.failure(e)
        }
    }
    
    /**
     * Delete application
     */
    suspend fun deleteApplication(id: String): Result<Unit> {
        return try {
            val supabaseClient = SupabaseClient.getInstance()
            
            // Get current application
            val currentAppResult = getApplicationById(id)
            if (!currentAppResult.isSuccess) {
                return Result.failure(Exception("Application not found"))
            }
            
            val currentApp = currentAppResult.getOrNull()
            
            // Check if can be deleted
            if (!canDeleteApplication(currentApp.status)) {
                return Result.failure(Exception("Application cannot be deleted on this status"))
            }
            
            // Delete application
            val result = supabaseClient.deleteApplication(id)
            
            if (result.isSuccess) {
                // Update unit status if needed
                // This would require unit management logic
                Result.success(Unit)
            } else {
                Result.failure(Exception("Failed to delete application"))
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error deleting application", e)
            Result.failure(e)
        }
    }
    
    /**
     * Get applications by status
     */
    suspend fun getApplicationsByStatus(
        status: String,
        page: Int = 1,
        limit: Int = 20
    ): Result<ApplicationListResponse> {
        val filters = ApplicationFilters(status = listOf(status))
        return getAllApplications(filters, page, limit)
    }
    
    /**
     * Get application statistics
     */
    suspend fun getApplicationStatistics(): Result<ApplicationStatistics> {
        return try {
            val supabaseClient = SupabaseClient.getInstance()
            val result = supabaseClient.getApplications()
            
            if (result.isSuccess) {
                val applications = result.getOrNull() ?: emptyList()
                val stats = calculateApplicationStatistics(applications)
                Result.success(stats)
            } else {
                Result.failure(Exception("Failed to fetch application statistics"))
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error fetching application statistics", e)
            Result.failure(e)
        }
    }
    
    /**
     * Real-time application updates
     */
    fun observeApplicationUpdates(): Flow<ApplicationData> {
        return flow {
            val supabaseClient = SupabaseClient.getInstance()
            
            supabaseClient.subscribeToApplications()
                .collect { message ->
                    // Parse real-time message and emit application data
                    try {
                        val applicationId = message.payload["id"] as? String
                        if (applicationId != null) {
                            // Fetch updated application
                            val appResult = getApplicationById(applicationId)
                            if (appResult.isSuccess) {
                                emit(appResult.getOrNull())
                            }
                        }
                    } catch (e: Exception) {
                        Log.e(TAG, "Error processing real-time update", e)
                    }
                }
        }
    }
    
    // Private helper methods
    private fun validateApplicationCreation(request: ApplicationCreateRequest): ValidationResult {
        val errors = mutableListOf<String>()
        
        // Validate customer exists (in real implementation)
        if (request.customerId.isEmpty()) {
            errors.add("Customer ID is required")
        }
        
        // Validate unit exists (in real implementation)
        if (request.unitId.isEmpty()) {
            errors.add("Unit ID is required")
        }
        
        // Validate bank if provided
        if (request.bankId?.isEmpty() == false) {
            // In real implementation, validate bank exists
        }
        
        return ValidationResult(
            isValid = errors.isEmpty(),
            errors = errors
        )
    }
    
    private fun validateStatusChange(
        fromStatus: String,
        toStatus: String,
        application: ApplicationData
    ): ValidationResult {
        val errors = mutableListOf<String>()
        
        // Define valid status transitions
        val validTransitions = mapOf(
            "PENDING" to listOf("DOCUMENT_COLLECTION", "CANCELLED"),
            "DOCUMENT_COLLECTION" to listOf("BANK_SUBMISSION", "CANCELLED"),
            "BANK_SUBMISSION" to listOf("BANK_VERIFICATION", "CANCELLED"),
            "BANK_VERIFICATION" to listOf("BANK_APPROVAL", "REJECTED", "CANCELLED"),
            "BANK_APPROVAL" to listOf("APPROVED", "CANCELLED"),
            "APPROVED" to listOf("COMPLETED", "CANCELLED"),
            "COMPLETED" to listOf("BAST_COMPLETED"),
            "BAST_COMPLETED" to listOf(),
            "REJECTED" to listOf(),
            "CANCELLED" to listOf()
        )
        
        val allowedStatuses = validTransitions[fromStatus] ?: emptyList()
        if (!allowedStatuses.contains(toStatus)) {
            errors.add("Status change from $fromStatus to $toStatus is not allowed")
        }
        
        return ValidationResult(
            isValid = errors.isEmpty(),
            errors = errors
        )
    }
    
    private fun canDeleteApplication(status: String): Boolean {
        return listOf("PENDING", "DOCUMENT_COLLECTION").contains(status)
    }
    
    private fun calculateAging(createdDate: String): Int {
        return try {
            val created = java.time.Instant.parse(createdDate)
            val now = java.time.Instant.now()
            val days = java.time.Duration.between(created, now).days
            days.toInt()
        } catch (e: Exception) {
            0
        }
    }
    
    private fun getSLADaysByStatus(status: String): Int {
        return when (status) {
            "PENDING" -> 3
            "DOCUMENT_COLLECTION" -> 7
            "BANK_SUBMISSION" -> 2
            "BANK_VERIFICATION" -> 14
            "BANK_APPROVAL" -> 3
            "APPROVED" -> 30
            "COMPLETED" -> 0
            "BAST_COMPLETED" -> 0
            "REJECTED" -> 0
            "CANCELLED" -> 0
            else -> 30
        }
    }
    
    private fun getSLAStatus(createdDate: String, status: String): String {
        val slaDays = getSLADaysByStatus(status)
        val daysUsed = calculateAging(createdDate)
        
        return when {
            daysUsed <= slaDays -> "on_track"
            daysUsed <= slaDays + 7 -> "warning"
            daysUsed > slaDays + 7 -> "overdue"
            else -> "critical"
        }
    }
    
    private fun calculateApplicationStatistics(applications: List<ApplicationData>): ApplicationStatistics {
        val statusCounts = applications.groupBy { it.status }
        
        return ApplicationStatistics(
            total = applications.size,
            byStatus = statusCounts.mapValues { it.size },
            byBank = emptyMap(), // Would need to implement
            byMonth = emptyMap(), // Would need to implement
            averageProcessingTime = 0, // Would need to implement
            approvalRate = 0.0, // Would need to implement
            rejectionRate = 0.0  // Would need to implement
        )
    }
    
    private fun logStatusChange(
        applicationId: String,
        fromStatus: String,
        toStatus: String,
        notes: String?
    ) {
        Log.d(TAG, "Status changed for application $applicationId: $fromStatus -> $toStatus")
        // In real implementation, this would log to audit trail
    }
    
    private fun sendStatusChangeNotification(
        application: ApplicationData,
        fromStatus: String?,
        toStatus: String
    ) {
        Log.d(TAG, "Sending status change notification for application ${application.id}")
        // In real implementation, this would send notification
    }
    
    private fun getCurrentTimestamp(): String {
        return java.time.Instant.now().toString()
    }
}

// Data classes
data class ApplicationFilters(
    val status: List<String> = emptyList(),
    val customerId: String? = null,
    val unitId: String? = null,
    val bankId: String? = null,
    val dateFrom: String? = null,
    val dateTo: String? = null,
    val search: String? = null
)

data class ApplicationCreateRequest(
    val customerId: String,
    val unitId: String,
    val bankId: String? = null,
    val notes: String? = null
)

data class ApplicationUpdateRequest(
    val status: String? = null,
    val notes: String? = null,
    val bankId: String? = null
)

data class ApplicationData(
    val id: String,
    val customerName: String,
    val customerEmail: String,
    val customerPhone: String,
    val unitType: String,
    val unitBlock: String,
    val unitNumber: String,
    val status: String,
    val bankId: String?,
    val created_at: String,
    val updated_at: String,
    val notes: String?,
    val aging_days: Int,
    val sla_status: String
)

data class ApplicationListResponse(
    val success: Boolean,
    val data: List<ApplicationData>,
    val count: Int,
    val page: Int,
    val limit: Int,
    val total: Int = 0,
    val hasMore: Boolean = false,
    val error: String? = null
)

data class ApplicationStatistics(
    val total: Int,
    val byStatus: Map<String, Int>,
    val byBank: Map<String, Int>,
    val byMonth: Map<String, Int>,
    val averageProcessingTime: Int,
    val approvalRate: Double,
    val rejectionRate: Double
)

data class ValidationResult(
    val isValid: Boolean,
    val errors: List<String>
)
