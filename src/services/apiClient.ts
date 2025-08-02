import { ronditrackApiUrl } from '../app/apiConfig';
import AuthService from './authService';

// Interceptor personalizado para fetch que maneja automáticamente los tokens
export class ApiClient {
  private static baseUrl = ronditrackApiUrl;

  static async request<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Obtener token de acceso
    const token = AuthService.getAccessToken();
    
    // Configurar headers por defecto
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    // Agregar token si está disponible
    if (token) {
      (defaultHeaders as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
    
    // Merge headers
    const headers = {
      ...defaultHeaders,
      ...options.headers,
    };
    
    // Configurar opciones de la petición
    const config: RequestInit = {
      ...options,
      headers,
    };
    
    try {
      console.log(`🚀 API Request: ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      
      // Si la respuesta es 401 y tenemos un token, intentar renovarlo
      if (response.status === 401 && token) {
        console.log('🔄 Token expirado, intentando renovar...');
        
        const renewed = await AuthService.refreshToken();
        if (renewed) {
          // Reintentar la petición con el nuevo token
          const newToken = AuthService.getAccessToken();
          if (newToken) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
            config.headers = headers;
            
            console.log('🔄 Reintentando petición con nuevo token...');
            const retryResponse = await fetch(url, config);
            
            if (!retryResponse.ok) {
              throw new Error(`HTTP error! status: ${retryResponse.status}`);
            }
            
            const data = await retryResponse.json();
            console.log(`✅ API Response (retry): ${retryResponse.status}`, data);
            return data;
          }
        }
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error: ${response.status}`, errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      console.log(`✅ API Response: ${response.status}`, data);
      
      return data;
      
    } catch (error) {
      console.error(`❌ API Request failed for ${url}:`, error);
      throw error;
    }
  }
  
  // Métodos de conveniencia
  static get<T = unknown>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }
  
  static post<T = unknown>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
  
  static put<T = unknown>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
  
  static delete<T = unknown>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
  
  // Método especial para FormData (sin Content-Type header)
  static postFormData<T = unknown>(endpoint: string, formData: FormData): Promise<T> {
    const token = AuthService.getAccessToken();
    const headers: HeadersInit = {
      'Accept': 'application/json',
    };
    
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
    
    return this.request<T>(endpoint, {
      method: 'POST',
      headers,
      body: formData,
    });
  }
}

export default ApiClient; 