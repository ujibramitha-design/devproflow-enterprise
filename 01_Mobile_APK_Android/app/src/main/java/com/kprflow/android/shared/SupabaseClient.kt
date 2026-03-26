package com.kprflow.android.shared

import android.util.Log
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.postgrest.Postgrest
import io.github.jan.supabase.realtime.RealtimeChannel
import io.github.jan.supabase.realtime.RealtimeStatus
import io.github.jan.supabase.realtime.RealtimeMessage
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.map
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive

// Supabase Client - Adapted from 06_Shared_Components
class SupabaseClient private constructor() {
    private var client: SupabaseClient? = null
    private var isInitialized = false
    
    companion object {
        private const val TAG = "SupabaseClient"
        
        @Volatile
        private var INSTANCE: SupabaseClient? = null
        
        fun getInstance(): SupabaseClient {
            return INSTANCE ?: synchronized(this) {
                INSTANCE ?: SupabaseClient().also { INSTANCE = it }
            }
        }
    }
    
    /**
     * Initialize Supabase client
     */
    fun initialize(
        supabaseUrl: String,
        supabaseKey: String
    ) {
        try {
            client = createSupabaseClient(
                supabaseUrl = supabaseUrl,
                supabaseKey = supabaseKey
            )
            isInitialized = true
            Log.d(TAG, "Supabase client initialized successfully")
        } catch (e: Exception) {
            Log.e(TAG, "Failed to initialize Supabase client", e)
            throw e
        }
    }
    
    /**
     * Get the Supabase client
     */
    fun getClient(): SupabaseClient {
        if (!isInitialized) {
            throw IllegalStateException("Supabase client not initialized. Call initialize() first.")
        }
        return client!!
    }
    
    /**
     * Select data from a table
     */
    suspend fun select(
        table: String,
        columns: String = "*",
        orderBy: String? = null,
        limit: Int? = null,
        offset: Int? = null
    ): Result<List<Map<String, Any>>> {
        return try {
            val query = getClient().from(table)
                .select(columns)
            
            val queryWithOrder = orderBy?.let { query.order(it) } ?: query
            val queryWithLimit = limit?.let { queryWithOrder.limit(it) } ?: queryWithOrder
            val queryWithOffset = offset?.let { queryWithLimit.range(it, it + (limit ?: 100)) } ?: queryWithLimit
            
            val result = queryWithOffset.data
            Result.success(result ?: emptyList())
        } catch (e: Exception) {
            Log.e(TAG, "Error selecting from table: $table", e)
            Result.failure(e)
        }
    }
    
    /**
     * Insert data into a table
     */
    suspend fun insert(
        table: String,
        data: Map<String, Any>
    ): Result<Map<String, Any>> {
        return try {
            val result = getClient().from(table)
                .insert(data)
                .data
            Result.success(result?.first() ?: emptyMap())
        } catch (e: Exception) {
            Log.e(TAG, "Error inserting into table: $table", e)
            Result.failure(e)
        }
    }
    
    /**
     * Update data in a table
     */
    suspend fun update(
        table: String,
        data: Map<String, Any>,
        filter: Map<String, Any>
    ): Result<List<Map<String, Any>>> {
        return try {
            var query = getClient().from(table).update(data)
            
            filter.forEach { (key, value) ->
                query = query.eq(key, value)
            }
            
            val result = query.data
            Result.success(result ?: emptyList())
        } catch (e: Exception) {
            Log.e(TAG, "Error updating table: $table", e)
            Result.failure(e)
        }
    }
    
    /**
     * Delete data from a table
     */
    suspend fun delete(
        table: String,
        filter: Map<String, Any>
    ): Result<List<Map<String, Any>>> {
        return try {
            var query = getClient().from(table).delete()
            
            filter.forEach { (key, value) ->
                query = query.eq(key, value)
            }
            
            val result = query.data
            Result.success(result ?: emptyList())
        } catch (e: Exception) {
            Log.e(TAG, "Error deleting from table: $table", e)
            Result.failure(e)
        }
    }
    
    /**
     * Subscribe to real-time updates
     */
    fun subscribeToTable(
        table: String,
        event: RealtimeChannel.PgChannel = RealtimeChannel.PgChannel.ALL
    ): Flow<RealtimeMessage> {
        return flow {
            if (!isInitialized) {
                throw IllegalStateException("Supabase client not initialized")
            }
            
            val channel = getClient().channel(table)
            
            channel.onPostgresChanges(event) { message ->
                try {
                    emit(message)
                } catch (e: Exception) {
                    Log.e(TAG, "Error processing real-time message", e)
                }
            }.subscribe()
            
            // Keep the flow active
            while (true) {
                kotlinx.coroutines.delay(1000)
            }
        }
    }
    
    /**
     * Call a Supabase Edge Function
     */
    suspend fun callFunction(
        functionName: String,
        payload: Map<String, Any> = emptyMap()
    ): Result<Map<String, Any>> {
        return try {
            val result = getClient().invoke(functionName, payload)
            Result.success(result ?: emptyMap())
        } catch (e: Exception) {
            Log.e(TAG, "Error calling function: $functionName", e)
            Result.failure(e)
        }
    }
    
    /**
     * Upload file to Supabase Storage
     */
    suspend fun uploadFile(
        bucket: String,
        path: String,
        fileBytes: ByteArray,
        contentType: String
    ): Result<String> {
        return try {
            val result = getClient().storage[bucket]
                .upload(path, fileBytes, contentType)
                .data
            Result.success(result?.path ?: "")
        } catch (e: Exception) {
            Log.e(TAG, "Error uploading file to bucket: $bucket", e)
            Result.failure(e)
        }
    }
    
    /**
     * Download file from Supabase Storage
     */
    suspend fun downloadFile(
        bucket: String,
        path: String
    ): Result<ByteArray> {
        return try {
            val result = getClient().storage[bucket]
                .download(path)
                .data
            Result.success(result ?: ByteArray(0))
        } catch (e: Exception) {
            Log.e(TAG, "Error downloading file from bucket: $bucket", e)
            Result.failure(e)
        }
    }
    
    /**
     * Get public URL for a file
     */
    fun getPublicUrl(
        bucket: String,
        path: String
    ): String {
        return try {
            getClient().storage[bucket].getPublicUrl(path)
        } catch (e: Exception) {
            Log.e(TAG, "Error getting public URL for file: $path", e)
            ""
        }
    }
    
    /**
     * Check if client is initialized
     */
    fun isInitialized(): Boolean = isInitialized
    
    /**
     * Reset client (for testing)
     */
    fun reset() {
        client = null
        isInitialized = false
    }
}

// Extension functions for easier usage
suspend fun SupabaseClient.getApplications(
    limit: Int? = null,
    offset: Int? = null
): Result<List<Map<String, Any>>> {
    return select(
        table = "kpr_applications",
        orderBy = "created_at.desc",
        limit = limit,
        offset = offset
    )
}

suspend fun SupabaseClient.getApplicationById(id: String): Result<Map<String, Any>> {
    return try {
        val result = select(
            table = "kpr_applications",
            filter = mapOf("id" to id)
        )
        Result.success(result.getOrNull()?.firstOrNull() ?: emptyMap())
    } catch (e: Exception) {
        Result.failure(e)
    }
}

suspend fun SupabaseClient.createApplication(application: Map<String, Any>): Result<Map<String, Any>> {
    return insert(
        table = "kpr_applications",
        data = application
    )
}

suspend fun SupabaseClient.updateApplication(
    id: String,
    data: Map<String, Any>
): Result<Map<String, Any>> {
    return try {
        val result = update(
            table = "kpr_applications",
            data = data,
            filter = mapOf("id" to id)
        )
        Result.success(result.getOrNull()?.firstOrNull() ?: emptyMap())
    } catch (e: Exception) {
        Result.failure(e)
    }
}

suspend fun SupabaseClient.deleteApplication(id: String): Result<Boolean> {
    return try {
        delete(
            table = "kpr_applications",
            filter = mapOf("id" to id)
        )
        Result.success(true)
    } catch (e: Exception) {
        Result.failure(e)
    }
}

// Real-time subscription extensions
fun SupabaseClient.subscribeToApplications(): Flow<RealtimeMessage> {
    return subscribeToTable("kpr_applications")
}

fun SupabaseClient.subscribeToApplicationUpdates(id: String): Flow<RealtimeMessage> {
    return flow {
        val channel = getClient().channel("application_$id")
        
        channel.onPostgresChanges(
            event = RealtimeChannel.PgChannel.UPDATE
        ) { message ->
            emit(message)
        }.subscribe()
        
        while (true) {
            kotlinx.coroutines.delay(1000)
        }
    }
}

// Utility functions
object SupabaseUtils {
    fun parseApplicationData(data: Map<String, Any>): ApplicationData {
        return ApplicationData(
            id = data["id"] as? String ?: "",
            customerName = data["customer_name"] as? String ?: "",
            customerEmail = data["customer_email"] as? String ?: "",
            customerPhone = data["customer_phone"] as? String ?: "",
            unitType = data["unit_type"] as? String ?: "",
            unitBlock = data["unit_block"] as? String ?: "",
            unitNumber = data["unit_number"] as? String ?: "",
            status = data["status"] as? String ?: "",
            createdAt = data["created_at"] as? String ?: "",
            updatedAt = data["updated_at"] as? String ?: ""
        )
    }
    
    fun formatPhoneNumber(phone: String): String {
        return phone.replace(Regex("[^0-9]"), "")
            .let { if (it.startsWith("62")) it else "62$it" }
    }
    
    fun validateEmail(email: String): Boolean {
        return email.matches(Regex("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"))
    }
}

// Data classes
data class ApplicationData(
    val id: String,
    val customerName: String,
    val customerEmail: String,
    val customerPhone: String,
    val unitType: String,
    val unitBlock: String,
    val unitNumber: String,
    val status: String,
    val createdAt: String,
    val updatedAt: String
)
