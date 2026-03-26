import { initializeApp } from 'firebase/app'
import { getDatabase, ref, get, set, push, update, remove, onValue } from 'firebase/database'
import { firebaseConfig, FIREBASE_PATHS } from '../../firebase.config'

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

// Firebase Real-time Database service
export class FirebaseService {
  // Get all units from SUBSIDI collection
  static async getUnits() {
    try {
      const dbRef = ref(database, FIREBASE_PATHS.SUBSIDI)
      const snapshot = await get(dbRef)
      return snapshot.val()
    } catch (error) {
      console.error('Error fetching units:', error)
      return null
    }
  }

  // Get single unit by ID
  static async getUnit(unitId: string) {
    try {
      const dbRef = ref(database, `${FIREBASE_PATHS.SUBSIDI}/${unitId}`)
      const snapshot = await get(dbRef)
      return snapshot.val()
    } catch (error) {
      console.error('Error fetching unit:', error)
      return null
    }
  }

  // Update unit data
  static async updateUnit(unitId: string, data: any) {
    try {
      const dbRef = ref(database, `${FIREBASE_PATHS.SUBSIDI}/${unitId}`)
      await update(dbRef, data)
      return true
    } catch (error) {
      console.error('Error updating unit:', error)
      return false
    }
  }

  // Add new unit
  static async addUnit(unitData: any) {
    try {
      const dbRef = ref(database, FIREBASE_PATHS.SUBSIDI)
      const newUnitRef = push(dbRef)
      await set(newUnitRef, unitData)
      return newUnitRef.key
    } catch (error) {
      console.error('Error adding unit:', error)
      return null
    }
  }

  // Delete unit
  static async deleteUnit(unitId: string) {
    try {
      const dbRef = ref(database, `${FIREBASE_PATHS.SUBSIDI}/${unitId}`)
      await remove(dbRef)
      return true
    } catch (error) {
      console.error('Error deleting unit:', error)
      return false
    }
  }

  // Real-time listener for units
  static onUnitsChange(callback: (data: any) => void) {
    const dbRef = ref(database, FIREBASE_PATHS.SUBSIDI)
    return onValue(dbRef, (snapshot) => {
      callback(snapshot.val())
    })
  }

  // Get dashboard statistics
  static async getDashboardStats() {
    try {
      const units = await this.getUnits()
      if (!units) return null

      const stats = {
        total: 0,
        available: 0,
        sold: 0,
        akad: 0,
        cair: 0,
        totalOmset: 0
      }

      Object.values(units).forEach((unit: any) => {
        stats.total++
        const status = (unit.status_unit || '').toUpperCase()
        
        if (status === 'AVAILABLE' || status === 'TERSEDIA') {
          stats.available++
        } else if (status === 'SOLD') {
          stats.sold++
        } else if (status === 'AKAD') {
          stats.akad++
        } else if (status === 'CAIR') {
          stats.cair++
          stats.totalOmset += Number(unit.harga_jual_dpp || 0)
        }
      })

      return stats
    } catch (error) {
      console.error('Error getting dashboard stats:', error)
      return null
    }
  }

  // Search units by criteria
  static async searchUnits(criteria: string) {
    try {
      const units = await this.getUnits()
      if (!units) return []

      const searchLower = criteria.toLowerCase()
      return Object.entries(units).filter(([id, unit]: [string, any]) => 
        id.toLowerCase().includes(searchLower) ||
        (unit.nama_customer && unit.nama_customer.toLowerCase().includes(searchLower)) ||
        (unit.tipe_unit && unit.tipe_unit.toLowerCase().includes(searchLower)) ||
        (unit.status_unit && unit.status_unit.toLowerCase().includes(searchLower))
      )
    } catch (error) {
      console.error('Error searching units:', error)
      return []
    }
  }

  // Get units by status
  static async getUnitsByStatus(status: string) {
    try {
      const units = await this.getUnits()
      if (!units) return []

      return Object.entries(units).filter(([id, unit]: [string, any]) => 
        (unit.status_unit || '').toUpperCase() === status.toUpperCase()
      )
    } catch (error) {
      console.error('Error getting units by status:', error)
      return []
    }
  }
}

export default FirebaseService
