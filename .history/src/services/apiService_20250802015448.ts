// Interceptor para incluir token automáticamente en todas las peticiones
class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = 'http://localhost:3343'; // Puerto por defecto
  }

  // Obtener headers con token
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Método genérico para peticiones
  async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers
      }
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      // Si es 401, redirigir al login
      if (response.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_expiration');
        window.location.href = '/login';
        throw new Error('Sesión expirada');
      }
      
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return response.json();
  }

  // Métodos específicos
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    const expiration = localStorage.getItem('token_expiration');
    
    if (!token || !expiration) {
      return false;
    }

    // Verificar si el token no ha expirado
    return Date.now() < parseInt(expiration);
  }

  // Obtener información del usuario
  getUserInfo() {
    const userInfo = localStorage.getItem('user_info');
    return userInfo ? JSON.parse(userInfo) : null;
  }

  // Cerrar sesión
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_expiration');
    localStorage.removeItem('user_info');
    window.location.href = '/login';
  }
}

export const apiService = new ApiService(); 