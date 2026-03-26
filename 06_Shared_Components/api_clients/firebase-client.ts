/**
 * KPRFlow Enterprise - Shared Firebase Client
 * Adapted from bramsray2 for cross-platform use
 */

import { initializeApp, FirebaseApp } from 'firebase/app'
import { getAuth, Auth, signInWithEmailAndPassword, signOut, User } from 'firebase/auth'
import { getDatabase, Database, ref, get, set, update, remove, push, onValue } from 'firebase/database'

export interface FirebaseConfig {
  apiKey: string
  authDomain: string
  databaseURL: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId?: string
}

export interface FirebaseResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export class FirebaseClientManager {
  private static instance: FirebaseClientManager
  private app: FirebaseApp | null = null
  private auth: Auth | null = null
  private database: Database | null = null
  private config: FirebaseConfig | null = null

  private constructor() {}

  static getInstance(): FirebaseClientManager {
    if (!FirebaseClientManager.instance) {
      FirebaseClientManager.instance = new FirebaseClientManager()
    }
    return FirebaseClientManager.instance
  }

  /**
   * Initialize Firebase with configuration
   */
  initialize(config: FirebaseConfig): void {
    this.config = config
    this.app = initializeApp(config)
    this.auth = getAuth(this.app)
    this.database = getDatabase(this.app)
  }

  /**
   * Get Firebase app instance
   */
  getApp(): FirebaseApp {
    if (!this.app) {
      throw new Error('Firebase app not initialized. Call initialize() first.')
    }
    return this.app
  }

  /**
   * Get Auth instance
   */
  getAuth(): Auth {
    if (!this.auth) {
      throw new Error('Firebase auth not initialized.')
    }
    return this.auth
  }

  /**
   * Get Database instance
   */
  getDatabase(): Database {
    if (!this.database) {
      throw new Error('Firebase database not initialized.')
    }
    return this.database
  }

  /**
   * Sign in with email and password
   */
  async signInWithEmail(email: string, password: string): Promise<FirebaseResponse<User>> {
    try {
      if (!this.auth) {
        return { success: false, error: 'Firebase auth not initialized' }
      }

      const userCredential = await signInWithEmailAndPassword(this.auth, email, password)
      return { success: true, data: userCredential.user }
    } catch (error: any) {
      console.error('Error signing in with Firebase:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<FirebaseResponse> {
    try {
      if (!this.auth) {
        return { success: false, error: 'Firebase auth not initialized' }
      }

      await signOut(this.auth)
      return { success: true }
    } catch (error: any) {
      console.error('Error signing out from Firebase:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.auth?.currentUser || null
  }

  /**
   * Read data from database
   */
  async readData<T = any>(path: string): Promise<FirebaseResponse<T>> {
    try {
      if (!this.database) {
        return { success: false, error: 'Firebase database not initialized' }
      }

      const dbRef = ref(this.database, path)
      const snapshot = await get(dbRef)
      
      if (snapshot.exists()) {
        return { success: true, data: snapshot.val() as T }
      } else {
        return { success: false, error: 'Data not found' }
      }
    } catch (error: any) {
      console.error(`Error reading data from ${path}:`, error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Write data to database
   */
  async writeData<T = any>(path: string, data: T): Promise<FirebaseResponse> {
    try {
      if (!this.database) {
        return { success: false, error: 'Firebase database not initialized' }
      }

      const dbRef = ref(this.database, path)
      await set(dbRef, data)
      
      return { success: true }
    } catch (error: any) {
      console.error(`Error writing data to ${path}:`, error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Update data in database
   */
  async updateData<T = any>(path: string, data: Partial<T>): Promise<FirebaseResponse> {
    try {
      if (!this.database) {
        return { success: false, error: 'Firebase database not initialized' }
      }

      const dbRef = ref(this.database, path)
      await update(dbRef, data)
      
      return { success: true }
    } catch (error: any) {
      console.error(`Error updating data at ${path}:`, error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Delete data from database
   */
  async deleteData(path: string): Promise<FirebaseResponse> {
    try {
      if (!this.database) {
        return { success: false, error: 'Firebase database not initialized' }
      }

      const dbRef = ref(this.database, path)
      await remove(dbRef)
      
      return { success: true }
    } catch (error: any) {
      console.error(`Error deleting data at ${path}:`, error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Push new data to database (generates unique key)
   */
  async pushData<T = any>(path: string, data: T): Promise<FirebaseResponse<string>> {
    try {
      if (!this.database) {
        return { success: false, error: 'Firebase database not initialized' }
      }

      const dbRef = ref(this.database, path)
      const newRef = push(dbRef, data)
      
      return { success: true, data: newRef.key || '' }
    } catch (error: any) {
      console.error(`Error pushing data to ${path}:`, error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Listen to real-time data changes
   */
  onDataChanged<T = any>(path: string, callback: (data: T | null) => void): () => void {
    if (!this.database) {
      console.error('Firebase database not initialized')
      return () => {}
    }

    const dbRef = ref(this.database, path)
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val() as T)
      } else {
        callback(null)
      }
    })

    return unsubscribe
  }

  /**
   * Test Firebase connection
   */
  async testConnection(): Promise<boolean> {
    try {
      if (!this.database) {
        return false
      }

      const testRef = ref(this.database, '_connection_test')
      await set(testRef, { timestamp: Date.now() })
      await remove(testRef)
      
      return true
    } catch (error) {
      console.error('Firebase connection test failed:', error)
      return false
    }
  }

  /**
   * Get user profile data
   */
  async getUserProfile(userId: string): Promise<FirebaseResponse<any>> {
    return this.readData(`users/${userId}`)
  }

  /**
   * Update user profile data
   */
  async updateUserProfile(userId: string, data: any): Promise<FirebaseResponse> {
    return this.updateData(`users/${userId}`, data)
  }

  /**
   * Log user activity
   */
  async logActivity(userId: string, activity: string, data?: any): Promise<FirebaseResponse<string>> {
    const logData = {
      userId,
      activity,
      data,
      timestamp: Date.now(),
      date: new Date().toISOString()
    }

    return this.pushData(`activity_logs/${userId}`, logData)
  }

  /**
   * Get user activities
   */
  async getUserActivities(userId: string, limit: number = 50): Promise<FirebaseResponse<any[]>> {
    try {
      const response = await this.readData(`activity_logs/${userId}`)
      
      if (response.success && response.data) {
        const activities = Object.entries(response.data as any)
          .map(([key, value]) => ({ id: key, ...value }))
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, limit)
        
        return { success: true, data: activities }
      }
      
      return { success: false, error: 'No activities found' }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}

// Export singleton instance
export const firebaseClient = FirebaseClientManager.getInstance()
