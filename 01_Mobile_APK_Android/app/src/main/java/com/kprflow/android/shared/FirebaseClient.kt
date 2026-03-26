package com.kprflow.android.shared

import android.util.Log
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.ktx.auth
import com.google.firebase.database.*
import com.google.firebase.database.ktx.database
import com.google.firebase.ktx.Firebase
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.tasks.await

// Firebase Client - Adapted from 06_Shared_Components
class FirebaseClient private constructor() {
    private var auth: FirebaseAuth? = null
    private var database: FirebaseDatabase? = null
    private var isInitialized = false
    
    companion object {
        private const val TAG = "FirebaseClient"
        
        @Volatile
        private var INSTANCE: FirebaseClient? = null
        
        fun getInstance(): FirebaseClient {
            return INSTANCE ?: synchronized(this) {
                INSTANCE ?: FirebaseClient().also { INSTANCE = it }
            }
        }
    }
    
    /**
     * Initialize Firebase
     */
    fun initialize(
        projectId: String,
        databaseUrl: String
    ) {
        try {
            // Initialize Firebase Auth
            auth = FirebaseAuth.getInstance()
            
            // Initialize Firebase Database
            database = FirebaseDatabase.getInstance(databaseUrl)
            
            isInitialized = true
            Log.d(TAG, "Firebase client initialized successfully")
        } catch (e: Exception) {
            Log.e(TAG, "Failed to initialize Firebase client", e)
            throw e
        }
    }
    
    /**
     * Get Firebase Auth instance
     */
    fun getAuth(): FirebaseAuth {
        if (!isInitialized) {
            throw IllegalStateException("Firebase client not initialized. Call initialize() first.")
        }
        return auth!!
    }
    
    /**
     * Get Firebase Database instance
     */
    fun getDatabase(): FirebaseDatabase {
        if (!isInitialized) {
            throw IllegalStateException("Firebase client not initialized. Call initialize() first.")
        }
        return database!!
    }
    
    /**
     * Sign in with email and password
     */
    suspend fun signInWithEmailAndPassword(
        email: String,
        password: String
    ): Result<FirebaseUser> {
        return try {
            val result = getAuth().signInWithEmailAndPassword(email, password).await()
            Result.success(result.user!!)
        } catch (e: Exception) {
            Log.e(TAG, "Error signing in with email and password", e)
            Result.failure(e)
        }
    }
    
    /**
     * Sign in anonymously
     */
    suspend fun signInAnonymously(): Result<FirebaseUser> {
        return try {
            val result = getAuth().signInAnonymously().await()
            Result.success(result.user!!)
        } catch (e: Exception) {
            Log.e(TAG, "Error signing in anonymously", e)
            Result.failure(e)
        }
    }
    
    /**
     * Sign out
     */
    suspend fun signOut(): Result<Unit> {
        return try {
            getAuth().signOut()
            Result.success(Unit)
        } catch (e: Exception) {
            Log.e(TAG, "Error signing out", e)
            Result.failure(e)
        }
    }
    
    /**
     * Get current user
     */
    fun getCurrentUser(): FirebaseUser? {
        return if (isInitialized) {
            getAuth().currentUser
        } else {
            null
        }
    }
    
    /**
     * Get user profile
     */
    suspend fun getUserProfile(userId: String): Result<Map<String, Any>> {
        return try {
            val snapshot = getDatabase().getReference("users/$userId").get().await()
            val profile = snapshot.getValue() as? Map<String, Any>
            Result.success(profile ?: emptyMap())
        } catch (e: Exception) {
            Log.e(TAG, "Error getting user profile for user: $userId", e)
            Result.failure(e)
        }
    }
    
    /**
     * Update user profile
     */
    suspend fun updateUserProfile(
        userId: String,
        profile: Map<String, Any>
    ): Result<Unit> {
        return try {
            getDatabase().getReference("users/$userId").updateChildren(profile).await()
            Result.success(Unit)
        } catch (e: Exception) {
            Log.e(TAG, "Error updating user profile for user: $userId", e)
            Result.failure(e)
        }
    }
    
    /**
     * Write data to database
     */
    suspend fun writeData(
        path: String,
        data: Any
    ): Result<Unit> {
        return try {
            getDatabase().getReference(path).setValue(data).await()
            Result.success(Unit)
        } catch (e: Exception) {
            Log.e(TAG, "Error writing data to path: $path", e)
            Result.failure(e)
        }
    }
    
    /**
     * Read data from database
     */
    suspend fun readData(path: String): Result<Any?> {
        return try {
            val snapshot = getDatabase().getReference(path).get().await()
            Result.success(snapshot.getValue())
        } catch (e: Exception) {
            Log.e(TAG, "Error reading data from path: $path", e)
            Result.failure(e)
        }
    }
    
    /**
     * Update data in database
     */
    suspend fun updateData(
        path: String,
        data: Map<String, Any>
    ): Result<Unit> {
        return try {
            getDatabase().getReference(path).updateChildren(data).await()
            Result.success(Unit)
        } catch (e: Exception) {
            Log.e(TAG, "Error updating data in path: $path", e)
            Result.failure(e)
        }
    }
    
    /**
     * Delete data from database
     */
    suspend fun deleteData(path: String): Result<Unit> {
        return try {
            getDatabase().getReference(path).removeValue().await()
            Result.success(Unit)
        } catch (e: Exception) {
            Log.e(TAG, "Error deleting data from path: $path", e)
            Result.failure(e)
        }
    }
    
    /**
     * Push data to database
     */
    suspend fun pushData(
        path: String,
        data: Any
    ): Result<String> {
        return try {
            val reference = getDatabase().getReference(path).push()
            reference.setValue(data).await()
            Result.success(reference.key ?: "")
        } catch (e: Exception) {
            Log.e(TAG, "Error pushing data to path: $path", e)
            Result.failure(e)
        }
    }
    
    /**
     * Listen to real-time changes
     */
    fun listenToChanges(path: String): Flow<Map<String, Any>?> {
        return callbackFlow {
            if (!isInitialized) {
                throw IllegalStateException("Firebase client not initialized")
            }
            
            val databaseReference = getDatabase().getReference(path)
            val listener = object : ValueEventListener {
                override fun onDataChange(snapshot: DataSnapshot) {
                    try {
                        val data = snapshot.getValue() as? Map<String, Any>
                        trySend(data)
                    } catch (e: Exception) {
                        Log.e(TAG, "Error processing real-time data", e)
                    }
                }
                
                override fun onCancelled(error: DatabaseError) {
                    Log.e(TAG, "Real-time listener cancelled", error.toException())
                    close(error.toException())
                }
            }
            
            databaseReference.addValueEventListener(listener)
            
            awaitClose {
                databaseReference.removeEventListener(listener)
            }
        }
    }
    
    /**
     * Listen to child events
     */
    fun listenToChildEvents(path: String): Flow<RealtimeEvent> {
        return callbackFlow {
            if (!isInitialized) {
                throw IllegalStateException("Firebase client not initialized")
            }
            
            val databaseReference = getDatabase().getReference(path)
            val listener = object : ChildEventListener {
                override fun onChildAdded(snapshot: DataSnapshot) {
                    try {
                        val data = snapshot.getValue() as? Map<String, Any>
                        trySend(RealtimeEvent.ChildAdded(snapshot.key ?: "", data))
                    } catch (e: Exception) {
                        Log.e(TAG, "Error processing child added event", e)
                    }
                }
                
                override fun onChildChanged(snapshot: DataSnapshot, previousChildName: String?) {
                    try {
                        val data = snapshot.getValue() as? Map<String, Any>
                        trySend(RealtimeEvent.ChildChanged(snapshot.key ?: "", data))
                    } catch (e: Exception) {
                        Log.e(TAG, "Error processing child changed event", e)
                    }
                }
                
                override fun onChildRemoved(snapshot: DataSnapshot) {
                    try {
                        val data = snapshot.getValue() as? Map<String, Any>
                        trySend(RealtimeEvent.ChildRemoved(snapshot.key ?: "", data))
                    } catch (e: Exception) {
                        Log.e(TAG, "Error processing child removed event", e)
                    }
                }
                
                override fun onChildMoved(snapshot: DataSnapshot, previousChildName: String?) {
                    try {
                        val data = snapshot.getValue() as? Map<String, Any>
                        trySend(RealtimeEvent.ChildMoved(snapshot.key ?: "", data, previousChildName))
                    } catch (e: Exception) {
                        Log.e(TAG, "Error processing child moved event", e)
                    }
                }
                
                override fun onCancelled(error: DatabaseError) {
                    Log.e(TAG, "Child event listener cancelled", error.toException())
                    close(error.toException())
                }
            }
            
            databaseReference.addChildEventListener(listener)
            
            awaitClose {
                databaseReference.removeEventListener(listener)
            }
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
        auth = null
        database = null
        isInitialized = false
    }
}

// Real-time event types
sealed class RealtimeEvent {
    data class ChildAdded(
        val key: String,
        val data: Map<String, Any>?
    ) : RealtimeEvent()
    
    data class ChildChanged(
        val key: String,
        val data: Map<String, Any>?
    ) : RealtimeEvent()
    
    data class ChildRemoved(
        val key: String,
        val data: Map<String, Any>?
    ) : RealtimeEvent()
    
    data class ChildMoved(
        val key: String,
        val data: Map<String, Any>?,
        val previousChildName: String?
    ) : RealtimeEvent()
}

// Extension functions for easier usage
suspend fun FirebaseClient.getUserProfileData(userId: String): Result<UserProfileData> {
    return try {
        val result = getUserProfile(userId)
        val data = result.getOrNull() ?: emptyMap()
        Result.success(
            UserProfileData(
                userId = userId,
                displayName = data["displayName"] as? String ?: "",
                email = data["email"] as? String ?: "",
                phone = data["phone"] as? String ?: "",
                photoUrl = data["photoUrl"] as? String ?: "",
                createdAt = data["createdAt"] as? String ?: "",
                updatedAt = data["updatedAt"] as? String ?: ""
            )
        )
    } catch (e: Exception) {
        Result.failure(e)
    }
}

suspend fun FirebaseClient.createUserProfile(
    userId: String,
    profile: UserProfileData
): Result<Unit> {
    return try {
        val profileMap = mapOf(
            "displayName" to profile.displayName,
            "email" to profile.email,
            "phone" to profile.phone,
            "photoUrl" to profile.photoUrl,
            "createdAt" to profile.createdAt,
            "updatedAt" to profile.updatedAt
        )
        updateUserProfile(userId, profileMap)
    } catch (e: Exception) {
        Result.failure(e)
    }
}

// Log user activity
suspend fun FirebaseClient.logUserActivity(
    userId: String,
    activity: String,
    metadata: Map<String, Any> = emptyMap()
): Result<String> {
    return try {
        val activityData = mapOf(
            "userId" to userId,
            "activity" to activity,
            "metadata" to metadata,
            "timestamp" to System.currentTimeMillis()
        )
        pushData("user_activities", activityData)
    } catch (e: Exception) {
        Result.failure(e)
    }
}

// Listen to user activities
fun FirebaseClient.listenToUserActivities(userId: String): Flow<List<Map<String, Any>>> {
    return listenToChildEvents("user_activities")
        .map { events ->
            // Convert events to list (simplified implementation)
            emptyList<Map<String, Any>>()
        }
}

// Data classes
data class UserProfileData(
    val userId: String,
    val displayName: String,
    val email: String,
    val phone: String,
    val photoUrl: String,
    val createdAt: String,
    val updatedAt: String
)

data class UserActivity(
    val userId: String,
    val activity: String,
    val metadata: Map<String, Any>,
    val timestamp: Long
)

// Utility functions
object FirebaseUtils {
    fun validateEmail(email: String): Boolean {
        return email.matches(Regex("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"))
    }
    
    fun validatePhone(phone: String): Boolean {
        return phone.matches(Regex("^\\+?[0-9]{10,15}$"))
    }
    
    fun sanitizeString(input: String): String {
        return input.trim().replace(Regex("[^a-zA-Z0-9\\s]"), "")
    }
    
    fun generateRandomId(): String {
        return (100000..999999).random().toString()
    }
}
