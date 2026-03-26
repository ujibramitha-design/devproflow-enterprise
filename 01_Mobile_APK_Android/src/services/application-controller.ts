/**
 * KPRFlow Mobile Application - Application Controller Service
 * Integration with shared components (fixed version)
 */

import { applicationController, Application, ApplicationFilters, ApplicationListResponse } from '../../../06_Shared_Components/index'

export class MobileApplicationController {
  private static instance: MobileApplicationController

  private constructor() {}

  static getInstance(): MobileApplicationController {
    if (!MobileApplicationController.instance) {
      MobileApplicationController.instance = new MobileApplicationController()
    }
    return MobileApplicationController.instance
  }

  /**
   * Get all applications with filters
   */
  async getAllApplications(
    filters?: ApplicationFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<ApplicationListResponse> {
    try {
      return await applicationController.getAllApplications(filters, page, limit)
    } catch (error) {
      return {
        data: undefined,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get application by ID
   */
  async getApplicationById(id: string) {
    try {
      return await applicationController.getApplicationById(id)
    } catch (error) {
      return {
        data: undefined,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Create new application
   */
  async createApplication(request: any) {
    try {
      return await applicationController.createApplication(request)
    } catch (error) {
      return {
        data: undefined,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Update application
   */
  async updateApplication(id: string, request: any) {
    try {
      return await applicationController.updateApplication(id, request)
    } catch (error) {
      return {
        data: undefined,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Delete application
   */
  async deleteApplication(id: string) {
    try {
      return await applicationController.deleteApplication(id)
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get application statistics
   */
  async getApplicationStatistics() {
    try {
      return await applicationController.getApplicationStatistics()
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Unknown error')
    }
  }
}

// Export singleton instance
export const mobileApplicationController = MobileApplicationController.getInstance()
