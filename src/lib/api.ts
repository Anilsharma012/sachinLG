const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  token?: string;
}

class ApiClient {
  private getHeaders(token?: string) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: unknown,
    token?: string
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_URL}${endpoint}`;
      const config: RequestInit = {
        method,
        headers: this.getHeaders(token),
      };

      if (body) {
        config.body = JSON.stringify(body);
      }

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.error || 'An error occurred',
        };
      }

      return {
        data,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'An error occurred',
      };
    }
  }

  // Auth endpoints
  async register(name: string, email: string, password: string, role?: string) {
    return this.request('/auth/register', 'POST', { name, email, password, role });
  }

  async login(email: string, password: string) {
    return this.request('/auth/login', 'POST', { email, password });
  }

  async verifyToken(token: string) {
    return this.request('/auth/verify', 'POST', { token }, token);
  }

  // User endpoints
  async getUsers(token: string) {
    return this.request('/users', 'GET', undefined, token);
  }

  async getUser(userId: string, token: string) {
    return this.request(`/users/${userId}`, 'GET', undefined, token);
  }

  async updateUser(userId: string, data: unknown, token: string) {
    return this.request(`/users/${userId}`, 'PUT', data, token);
  }

  async deleteUser(userId: string, token: string) {
    return this.request(`/users/${userId}`, 'DELETE', undefined, token);
  }

  // Customer endpoints
  async getCustomers(token: string) {
    return this.request('/customers', 'GET', undefined, token);
  }

  async getCustomer(customerId: string, token: string) {
    return this.request(`/customers/${customerId}`, 'GET', undefined, token);
  }

  async createCustomer(data: unknown, token: string) {
    return this.request('/customers', 'POST', data, token);
  }

  async updateCustomer(customerId: string, data: unknown, token: string) {
    return this.request(`/customers/${customerId}`, 'PUT', data, token);
  }

  async deleteCustomer(customerId: string, token: string) {
    return this.request(`/customers/${customerId}`, 'DELETE', undefined, token);
  }

  // Agent endpoints
  async getAgents(token: string) {
    return this.request('/agents', 'GET', undefined, token);
  }

  async getAgent(agentId: string, token: string) {
    return this.request(`/agents/${agentId}`, 'GET', undefined, token);
  }

  async createAgent(data: unknown, token: string) {
    return this.request('/agents', 'POST', data, token);
  }

  async updateAgent(agentId: string, data: unknown, token: string) {
    return this.request(`/agents/${agentId}`, 'PUT', data, token);
  }

  async deleteAgent(agentId: string, token: string) {
    return this.request(`/agents/${agentId}`, 'DELETE', undefined, token);
  }
}

export const apiClient = new ApiClient();
