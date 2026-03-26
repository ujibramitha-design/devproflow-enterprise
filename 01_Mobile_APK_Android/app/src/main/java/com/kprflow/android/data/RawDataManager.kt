package com.kprflow.android.data

import android.content.Context
import android.util.Log
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.IOException

// Raw Data Manager - Integrates 07_Raw_Materials_Data with Android
class RawDataManager private constructor(
    private val context: Context,
    private val gson: Gson = Gson()
) {
    
    companion object {
        private const val TAG = "RawDataManager"
        
        @Volatile
        private var INSTANCE: RawDataManager? = null
        
        fun getInstance(context: Context): RawDataManager {
            return INSTANCE ?: synchronized(this) {
                INSTANCE ?: RawDataManager(context).also { INSTANCE = it }
            }
        }
    }
    
    // Business Rules
    private var businessRules: BusinessRules? = null
    private var systemConfiguration: SystemConfiguration? = null
    private var slaConfiguration: SLAConfiguration? = null
    private var notificationConfiguration: NotificationConfiguration? = null
    private var whatsappConfiguration: WhatsAppConfiguration? = null
    private var userRoles: UserRoles? = null
    
    // Master Data
    private var banks: List<Bank>? = null
    private var developers: List<Developer>? = null
    private var provinces: List<Province>? = null
    
    // Templates
    private var notificationTemplates: NotificationTemplates? = null
    private var statusTemplates: StatusTemplates? = null
    
    /**
     * Load all raw data from assets
     */
    suspend fun loadAllRawData(): Result<Unit> {
        return try {
            withContext(Dispatchers.IO) {
                // Load Business Rules
                loadBusinessRules()
                
                // Load System Configuration
                loadSystemConfiguration()
                
                // Load SLA Configuration
                loadSLAConfiguration()
                
                // Load Notification Configuration
                loadNotificationConfiguration()
                
                // Load WhatsApp Configuration
                loadWhatsAppConfiguration()
                
                // Load User Roles
                loadUserRoles()
                
                // Load Master Data
                loadBanks()
                loadDevelopers()
                loadProvinces()
                
                // Load Templates
                loadNotificationTemplates()
                loadStatusTemplates()
                
                Log.d(TAG, "All raw data loaded successfully")
                Result.success(Unit)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error loading raw data", e)
            Result.failure(e)
        }
    }
    
    /**
     * Get business rules
     */
    fun getBusinessRules(): BusinessRules? = businessRules
    
    /**
     * Get system configuration
     */
    fun getSystemConfiguration(): SystemConfiguration? = systemConfiguration
    
    /**
     * Get SLA configuration
     */
    fun getSLAConfiguration(): SLAConfiguration? = slaConfiguration
    
    /**
     * Get notification configuration
     */
    fun getNotificationConfiguration(): NotificationConfiguration? = notificationConfiguration
    
    /**
     * Get WhatsApp configuration
     */
    fun getWhatsAppConfiguration(): WhatsAppConfiguration? = whatsappConfiguration
    
    /**
     * Get user roles
     */
    fun getUserRoles(): UserRoles? = userRoles
    
    /**
     * Get banks
     */
    fun getBanks(): List<Bank>? = banks
    
    /**
     * Get developers
     */
    fun getDevelopers(): List<Developer>? = developers
    
    /**
     * Get provinces
     */
    fun getProvinces(): List<Province>? = provinces
    
    /**
     * Get notification templates
     */
    fun getNotificationTemplates(): NotificationTemplates? = notificationTemplates
    
    /**
     * Get status templates
     */
    fun getStatusTemplates(): StatusTemplates? = statusTemplates
    
    /**
     * Get bank by ID
     */
    fun getBankById(id: Int): Bank? {
        return banks?.find { it.id == id }
    }
    
    /**
     * Get bank by code
     */
    fun getBankByCode(code: String): Bank? {
        return banks?.find { it.code.equals(code, ignoreCase = true) }
    }
    
    /**
     * Get developer by ID
     */
    fun getDeveloperById(id: Int): Developer? {
        return developers?.find { it.id == id }
    }
    
    /**
     * Get province by ID
     */
    fun getProvinceById(id: Int): Province? {
        return provinces?.find { it.id == id }
    }
    
    /**
     * Get business rule by ID
     */
    fun getBusinessRuleById(ruleId: String): BusinessRule? {
        return businessRules?.businessRules?.find { it.ruleId == ruleId }
    }
    
    /**
     * Get notification template by ID
     */
    fun getNotificationTemplateById(templateId: String): NotificationTemplate? {
        return notificationTemplates?.notificationTemplates?.find { it.templateId == templateId }
    }
    
    /**
     * Validate customer against business rules
     */
    fun validateCustomer(customer: CustomerData): ValidationResult {
        val errors = mutableListOf<String>()
        
        businessRules?.businessRules?.forEach { rule ->
            if (rule.category == "customer_validation") {
                val validationResult = applyBusinessRule(rule, customer)
                if (!validationResult.isValid) {
                    errors.addAll(validationResult.errors)
                }
            }
        }
        
        return ValidationResult(
            isValid = errors.isEmpty(),
            errors = errors
        )
    }
    
    /**
     * Get KPR programs for a bank
     */
    fun getKPRProgramsForBank(bankId: Int): List<KPRProgram> {
        return getBankById(bankId)?.kprPrograms ?: emptyList()
    }
    
    /**
     * Get notification template for channel
     */
    fun getNotificationTemplateForChannel(
        templateId: String,
        channel: String
    ): NotificationTemplateChannel? {
        return getNotificationTemplateById(templateId)?.templates?.get(channel)
    }
    
    // Private methods
    private fun loadBusinessRules() {
        try {
            val json = readJsonFromAssets("raw_data/configuration/business_rules.json")
            businessRules = gson.fromJson(json, BusinessRules::class.java)
        } catch (e: Exception) {
            Log.e(TAG, "Error loading business rules", e)
        }
    }
    
    private fun loadSystemConfiguration() {
        try {
            val json = readJsonFromAssets("raw_data/configuration/system_configuration.json")
            systemConfiguration = gson.fromJson(json, SystemConfiguration::class.java)
        } catch (e: Exception) {
            Log.e(TAG, "Error loading system configuration", e)
        }
    }
    
    private fun loadSLAConfiguration() {
        try {
            val json = readJsonFromAssets("raw_data/configuration/sla_configuration.json")
            slaConfiguration = gson.fromJson(json, SLAConfiguration::class.java)
        } catch (e: Exception) {
            Log.e(TAG, "Error loading SLA configuration", e)
        }
    }
    
    private fun loadNotificationConfiguration() {
        try {
            val json = readJsonFromAssets("raw_data/configuration/notification_configuration.json")
            notificationConfiguration = gson.fromJson(json, NotificationConfiguration::class.java)
        } catch (e: Exception) {
            Log.e(TAG, "Error loading notification configuration", e)
        }
    }
    
    private fun loadWhatsAppConfiguration() {
        try {
            val json = readJsonFromAssets("raw_data/configuration/whatsapp_configuration.json")
            whatsappConfiguration = gson.fromJson(json, WhatsAppConfiguration::class.java)
        } catch (e: Exception) {
            Log.e(TAG, "Error loading WhatsApp configuration", e)
        }
    }
    
    private fun loadUserRoles() {
        try {
            val json = readJsonFromAssets("raw_data/configuration/user_roles.json")
            userRoles = gson.fromJson(json, UserRoles::class.java)
        } catch (e: Exception) {
            Log.e(TAG, "Error loading user roles", e)
        }
    }
    
    private fun loadBanks() {
        try {
            val json = readJsonFromAssets("raw_data/master_data/banks.json")
            val type = object : TypeToken<BanksResponse>() {}.type
            val response = gson.fromJson<BanksResponse>(json, type)
            banks = response.banks
        } catch (e: Exception) {
            Log.e(TAG, "Error loading banks", e)
        }
    }
    
    private fun loadDevelopers() {
        try {
            val json = readJsonFromAssets("raw_data/master_data/developers.json")
            val type = object : TypeToken<DevelopersResponse>() {}.type
            val response = gson.fromJson<DevelopersResponse>(json, type)
            developers = response.developers
        } catch (e: Exception) {
            Log.e(TAG, "Error loading developers", e)
        }
    }
    
    private fun loadProvinces() {
        try {
            val json = readJsonFromAssets("raw_data/reference_data/provinces.json")
            val type = object : TypeToken<ProvincesResponse>() {}.type
            val response = gson.fromJson<ProvincesResponse>(json, type)
            provinces = response.provinces
        } catch (e: Exception) {
            Log.e(TAG, "Error loading provinces", e)
        }
    }
    
    private fun loadNotificationTemplates() {
        try {
            val json = readJsonFromAssets("raw_data/templates/notification_templates.json")
            notificationTemplates = gson.fromJson(json, NotificationTemplates::class.java)
        } catch (e: Exception) {
            Log.e(TAG, "Error loading notification templates", e)
        }
    }
    
    private fun loadStatusTemplates() {
        try {
            val json = readJsonFromAssets("raw_data/templates/status_templates.json")
            statusTemplates = gson.fromJson(json, StatusTemplates::class.java)
        } catch (e: Exception) {
            Log.e(TAG, "Error loading status templates", e)
        }
    }
    
    private fun readJsonFromAssets(fileName: String): String {
        return try {
            context.assets.open(fileName).bufferedReader().use { it.readText() }
        } catch (e: IOException) {
            Log.e(TAG, "Error reading file: $fileName", e)
            "{}"
        }
    }
    
    private fun applyBusinessRule(rule: BusinessRule, customer: CustomerData): ValidationResult {
        val errors = mutableListOf<String>()
        
        // Apply rule logic based on rule type
        when (rule.validationType) {
            "age_check" -> {
                // Calculate age from birth date
                val age = calculateAge(customer.birthDate)
                if (!evaluateCondition(rule.condition, age)) {
                    errors.add(rule.errorMessage)
                }
            }
            "income_check" -> {
                if (!evaluateCondition(rule.condition, customer.monthlyIncome)) {
                    errors.add(rule.errorMessage)
                }
            }
            "phone_check" -> {
                if (!isValidPhoneNumber(customer.phoneNumber)) {
                    errors.add(rule.errorMessage)
                }
            }
            "email_check" -> {
                if (!isValidEmail(customer.email)) {
                    errors.add(rule.errorMessage)
                }
            }
        }
        
        return ValidationResult(
            isValid = errors.isEmpty(),
            errors = errors
        )
    }
    
    private fun evaluateCondition(condition: String, value: Any): Boolean {
        // Simple condition evaluation
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
    
    private fun isValidPhoneNumber(phone: String): Boolean {
        return phone.matches(Regex("^\\+?[0-9]{10,15}$"))
    }
    
    private fun isValidEmail(email: String): Boolean {
        return email.matches(Regex("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"))
    }
}

// Data classes
data class BusinessRules(
    val version: String,
    val lastUpdated: String,
    val source: String,
    val totalRules: Int,
    val description: String,
    val businessRules: List<BusinessRule>
)

data class BusinessRule(
    val ruleId: String,
    val name: String,
    val condition: String,
    val description: String,
    val errorMessage: String,
    val severity: String,
    val validationType: String,
    val appliesTo: List<String>,
    val bankSpecific: String? = null
)

data class SystemConfiguration(
    val version: String,
    val lastUpdated: String,
    val appSettings: AppSettings,
    val securitySettings: SecuritySettings,
    val performanceSettings: PerformanceSettings
)

data class AppSettings(
    val appName: String,
    val version: String,
    val theme: String,
    val language: String,
    val enableNotifications: Boolean,
    val enableBiometrics: Boolean
)

data class SecuritySettings(
    val sessionTimeout: Int,
    val maxLoginAttempts: Int,
    val passwordMinLength: Int,
    val enableTwoFactor: Boolean
)

data class PerformanceSettings(
    val cacheSize: Int,
    val maxCacheAge: Int,
    val enableCompression: Boolean,
    val batchSize: Int
)

data class SLAConfiguration(
    val version: String,
    val lastUpdated: String,
    val slaRules: List<SLARule>
)

data class SLARule(
    val status: String,
    val maxDays: Int,
    val warningDays: Int,
    val criticalDays: Int,
    val escalationRules: List<EscalationRule>
)

data class EscalationRule(
    val condition: String,
    val action: String,
    val recipient: String
)

data class NotificationConfiguration(
    val version: String,
    val lastUpdated: String,
    val channels: List<NotificationChannel>,
    val settings: NotificationSettings
)

data class NotificationChannel(
    val name: String,
    val type: String,
    val enabled: Boolean,
    val settings: ChannelSettings
)

data class ChannelSettings(
    val retryAttempts: Int,
    val retryDelay: Int,
    val batchSize: Int
)

data class NotificationSettings(
    val enableEmail: Boolean,
    val enableSMS: Boolean,
    val enableWhatsApp: Boolean,
    val enablePush: Boolean
)

data class WhatsAppConfiguration(
    val version: String,
    val lastUpdated: String,
    val phoneNumber: String,
    val baseUrl: String,
    val templates: Map<String, String>,
    val settings: WhatsAppSettings
)

data class WhatsAppSettings(
    val enableAutoReply: Boolean,
    val enableTracking: Boolean,
    val maxRetries: Int,
    val retryDelay: Int
)

data class UserRoles(
    val version: String,
    val lastUpdated: String,
    val roles: List<Role>
)

data class Role(
    val id: String,
    val name: String,
    val permissions: List<String>,
    val description: String
)

// Master Data
data class BanksResponse(
    val version: String,
    val lastUpdated: String,
    val source: String,
    val totalBanks: Int,
    val description: String,
    val banks: List<Bank>
)

data class Bank(
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
    val kprPrograms: List<KPRProgram>
)

data class ContactInfo(
    val phone: String,
    val email: String,
    val address: String
)

data class KPRProgram(
    val programName: String,
    val interestRateType: String,
    val interestRateRange: InterestRateRange,
    val maxLoanAmount: Double,
    val minDownPayment: Double,
    val maxTenure: Int,
    val requirements: List<String>
)

data class InterestRateRange(
    val min: Double,
    val max: Double
)

data class DevelopersResponse(
    val version: String,
    val lastUpdated: String,
    val source: String,
    val totalDevelopers: Int,
    val description: String,
    val developers: List<Developer>
)

data class Developer(
    val id: Int,
    val name: String,
    val fullName: String,
    val type: String,
    val headquarters: String,
    val foundedYear: Int,
    val website: String,
    val contact: ContactInfo,
    val projects: List<Project>
)

data class Project(
    val id: String,
    val name: String,
    val location: String,
    val totalUnits: Int,
    val availableUnits: Int,
    val priceRange: PriceRange
)

data class PriceRange(
    val min: Double,
    val max: Double
)

data class ProvincesResponse(
    val version: String,
    val lastUpdated: String,
    val source: String,
    val totalProvinces: Int,
    val description: String,
    val provinces: List<Province>
)

data class Province(
    val id: Int,
    val name: String,
    val code: String,
    val capital: String,
    val region: String,
    val population: Int,
    val area: Double
)

// Templates
data class NotificationTemplates(
    val version: String,
    val lastUpdated: String,
    val source: String,
    val description: String,
    val notificationTemplates: List<NotificationTemplate>
)

data class NotificationTemplate(
    val templateId: String,
    val name: String,
    val description: String,
    val category: String,
    val channels: List<String>,
    val templates: Map<String, NotificationTemplateChannel>,
    val variables: List<String>,
    val triggers: List<String>
)

data class NotificationTemplateChannel(
    val subject: String? = null,
    val body: String,
    val htmlTemplate: Boolean? = null
)

data class StatusTemplates(
    val version: String,
    val lastUpdated: String,
    val source: String,
    val description: String,
    val statusTemplates: List<StatusTemplate>
)

data class StatusTemplate(
    val status: String,
    val displayName: String,
    val description: String,
    val color: String,
    val icon: String,
    val nextStatuses: List<String>
)

// Validation
data class ValidationResult(
    val isValid: Boolean,
    val errors: List<String>
)

// Customer Data
data class CustomerData(
    val name: String,
    val email: String,
    val phoneNumber: String,
    val birthDate: String,
    val monthlyIncome: Double,
    val address: String
)
