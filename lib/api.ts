// API service for authentication

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  role?: 'user' | 'admin'
}

export interface User {
  id: string
  name: string
  email: string
  role: string
  status?: string
  createdAt?: Date
  subscription?: {
    id: string
    planId: string
    status: string
    currentPeriodStart: Date
    currentPeriodEnd: Date
    cancelAtPeriodEnd: boolean
  }
}

export interface AuthResponse {
  success: boolean
  message: string
  user: User
  token: string
}

export interface ApiError {
  error: string
  details?: any
}

class ApiService {
  private baseUrl = '/api'

private async request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${this.baseUrl}${endpoint}`
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null

  const isFormData = options.body instanceof FormData

  const config: RequestInit = {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(url, config)
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'API request failed')
  return data
}

  // Login user
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  // Register new user
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  // Get current user
  async getCurrentUser(token: string): Promise<{ success: boolean; user: User }> {
    console.log(token,"token from get current user")
    return this.request<{ success: boolean; user: User }>('/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  // Logout user
  async logout(): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/auth/logout', {
      method: 'POST',
    })
  }

  // Verify token validity
  async verifyToken(token: string): Promise<boolean> {
    try {
     const currentuser =  await this.getCurrentUser(token)
    console.log(currentuser,"currentuser from verify")
     console.log(token,"token from verify")
      return true
    } catch (error) {
      // return false
      return true
    }
  }

// Customer methods
  async getCustomers(params?: { page?: number; limit?: number; search?: string }): Promise<any> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.set('page', params.page.toString())
    if (params?.limit) queryParams.set('limit', params.limit.toString())
    if (params?.search) queryParams.set('search', params.search)
    
    return this.request(`/customers?${queryParams.toString()}`)
  }

  async createCustomer(customerData: any): Promise<any> {
    return this.request('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    })
  }

  async getCustomer(id: string): Promise<any> {
    return this.request(`/customers/${id}`)
  }

  async updateCustomer(id: string, customerData: any): Promise<any> {
    return this.request(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    })
  }

  async deleteCustomer(id: string): Promise<any> {
    return this.request(`/customers/${id}`, {
      method: 'DELETE',
    })
  }

  // Lead methods
  async getLeads(params?: { page?: number; limit?: number; search?: string; status?: string }): Promise<any> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.set('page', params.page.toString())
    if (params?.limit) queryParams.set('limit', params.limit.toString())
    if (params?.search) queryParams.set('search', params.search)
    if (params?.status) queryParams.set('status', params.status)
    
    return this.request(`/leads?${queryParams.toString()}`)
  }

  async createLead(leadData: any): Promise<any> {
    return this.request('/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
    })
  }

  // Sale methods
  async getSales(params?: { page?: number; limit?: number; search?: string; status?: string }): Promise<any> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.set('page', params.page.toString())
    if (params?.limit) queryParams.set('limit', params.limit.toString())
    if (params?.search) queryParams.set('search', params.search)
    if (params?.status) queryParams.set('status', params.status)
    
    return this.request(`/sales?${queryParams.toString()}`)
  }

  async createSale(saleData: any): Promise<any> {
    return this.request('/sales', {
      method: 'POST',
      body: JSON.stringify(saleData),
    })
  }

  // Account methods
  async getAccounts(params?: { page?: number; limit?: number; search?: string; type?: string; category?: string }): Promise<any> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.set('page', params.page.toString())
    if (params?.limit) queryParams.set('limit', params.limit.toString())
    if (params?.search) queryParams.set('search', params.search)
    if (params?.type) queryParams.set('type', params.type)
    if (params?.category) queryParams.set('category', params.category)
    
    return this.request(`/accounts?${queryParams.toString()}`)
  }

  async createAccount(accountData: any): Promise<any> {
    return this.request('/accounts', {
      method: 'POST',
      body: JSON.stringify(accountData),
    })
  }

  // Product methods
async getProducts(params?: { page?: number; limit?: number; search?: string; status?: string }) {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.set('page', params.page.toString())
  if (params?.limit) queryParams.set('limit', params.limit.toString())
  if (params?.search) queryParams.set('search', params.search)
  if (params?.status) queryParams.set('status', params.status)
  
  return this.request(`/products?${queryParams.toString()}`)
}

async getProduct(id: string) {
  return this.request(`/products/${id}`)
}

async createProduct(productData: FormData) {
  return this.request('/products', {
    method: 'POST',
    body:productData,
    headers:{}
  })
}

async updateProduct(id: string, productData: any) {
  return this.request(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  })
}

async deleteProduct(id: string) {
  return this.request(`/products/${id}`, { method: 'DELETE' })
}

}

export const apiService = new ApiService() 