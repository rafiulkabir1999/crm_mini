export interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  company: string
  position: string
  location: string
  website: string
  bio: string
  avatar: string
  role: string
  status: string
  createdAt: string
  lastLogin: string | null
  updatedAt?: string
}

export interface UserSubscription {
  id: string
  planId: string
  status: string
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
}

export interface UserUsage {
  customers: number
  leads: number
  landingPages: number
  storageUsed: number
  teamMembers: number
}

export interface User extends UserProfile {
  subscription: UserSubscription
  usage: UserUsage
}

export interface CreateUserData {
  email: string
  name: string
  role?: string
  status?: string
  subscriptionPlan?: string
  phone?: string
  company?: string
  position?: string
  location?: string
  website?: string
  bio?: string
}

export interface UpdateUserData {
  name?: string
  email?: string
  phone?: string
  company?: string
  position?: string
  location?: string
  website?: string
  bio?: string
  status?: string
  role?: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  total?: number
}

class UserService {
  private baseUrl = '/api/users'

  // Get user profile
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await fetch('/api/users/profile')
      const result: ApiResponse<UserProfile> = await response.json()
      
      if (!result.success || !result.data) {
        throw new Error(result.message || 'Failed to fetch profile')
      }
      
      return result.data
    } catch (error) {
      console.error('Error fetching profile:', error)
      throw error
    }
  }

  // Update user profile
  async updateProfile(data: UpdateUserData): Promise<UserProfile> {
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      const result: ApiResponse<UserProfile> = await response.json()
      
      if (!result.success || !result.data) {
        throw new Error(result.message || 'Failed to update profile')
      }
      
      return result.data
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  // Get all users (admin only)
  async getUsers(params?: {
    search?: string
    status?: string
    role?: string
  }): Promise<User[]> {
    try {
      const searchParams = new URLSearchParams()
      if (params?.search) searchParams.append('search', params.search)
      if (params?.status) searchParams.append('status', params.status)
      if (params?.role) searchParams.append('role', params.role)

      const url = `${this.baseUrl}?${searchParams.toString()}`
      const response = await fetch(url)
      const result: ApiResponse<User[]> = await response.json()
      
      if (!result.success || !result.data) {
        throw new Error(result.message || 'Failed to fetch users')
      }
      
      return result.data
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  }

  // Get user by ID (admin only)
  async getUserById(userId: string): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}?userId=${userId}`)
      const result: ApiResponse<User> = await response.json()
      
      if (!result.success || !result.data) {
        throw new Error(result.message || 'Failed to fetch user')
      }
      
      return result.data
    } catch (error) {
      console.error('Error fetching user:', error)
      throw error
    }
  }

  // Create new user (admin only)
  async createUser(data: CreateUserData): Promise<User> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      const result: ApiResponse<User> = await response.json()
      
      if (!result.success || !result.data) {
        throw new Error(result.message || 'Failed to create user')
      }
      
      return result.data
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  // Update user (admin only)
  async updateUser(userId: string, data: UpdateUserData): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}?userId=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      const result: ApiResponse<User> = await response.json()
      
      if (!result.success || !result.data) {
        throw new Error(result.message || 'Failed to update user')
      }
      
      return result.data
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  // Delete user (admin only)
  async deleteUser(userId: string): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}?userId=${userId}`, {
        method: 'DELETE',
      })
      
      const result: ApiResponse<User> = await response.json()
      
      if (!result.success || !result.data) {
        throw new Error(result.message || 'Failed to delete user')
      }
      
      return result.data
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  }

  // Update user status (admin only)
  async updateUserStatus(userId: string, status: string): Promise<User> {
    return this.updateUser(userId, { status })
  }

  // Update user role (admin only)
  async updateUserRole(userId: string, role: string): Promise<User> {
    return this.updateUser(userId, { role })
  }

  // Get user statistics
  async getUserStats(): Promise<{
    total: number
    active: number
    suspended: number
    expired: number
  }> {
    try {
      const users = await this.getUsers()
      
      return {
        total: users.length,
        active: users.filter(u => u.status === 'active').length,
        suspended: users.filter(u => u.status === 'suspended').length,
        expired: users.filter(u => u.subscription.status === 'expired').length,
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
      throw error
    }
  }
}

export const userService = new UserService()
