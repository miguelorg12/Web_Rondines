import { ronditrackApiUrl } from "../app/apiConfig";
import OAUTH_CONFIG from "../config/oauthConfig";

// Funciones para generar PKCE
function generateCodeVerifier(length = 64): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Aplica SHA256 y codifica en Base64URL
async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  const base64 = btoa(String.fromCharCode(...new Uint8Array(digest)));
  // Base64URL encode
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export class AuthService {
  
  // Limpiar datos de autenticación anteriores
  private static cleanupPreviousAuth(): void {
    localStorage.removeItem('pkce_code_verifier');
    localStorage.removeItem('oauth_start_time');
    localStorage.removeItem('user_info');
    sessionStorage.removeItem('oauth_callback_processing');
  }
  
  // Iniciar el flujo de autenticación OAuth2
  static async initiateLogin(): Promise<void> {
    try {
      // Limpiar cualquier proceso anterior antes de iniciar uno nuevo
      this.cleanupPreviousAuth();
      
      // Verificar si el servidor OAuth está disponible
      const isOAuthAvailable = await OAUTH_CONFIG.checkOAuthServer();
      if (!isOAuthAvailable) {
        throw new Error('No se pudo conectar al servidor OAuth2. Verifica que esté ejecutándose.');
      }
      
      const clientId = OAUTH_CONFIG.CLIENT_ID;
      const redirectUri = `https://qa.ronditrack.online/auth/callback`;
      const responseType = "code";
      const codeVerifier = generateCodeVerifier();
      
      localStorage.setItem('pkce_code_verifier', codeVerifier);
      localStorage.setItem('oauth_start_time', Date.now().toString());
      
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      
      const codeChallengeMethod = "S256";
      const authorizeUrl = `${OAUTH_CONFIG.getAuthorizeUrl()}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&code_challenge=${codeChallenge}&code_challenge_method=${codeChallengeMethod}`;
      
      window.location.href = authorizeUrl;
      
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'No se pudo iniciar el proceso de autenticación');
    }
  }
  
  // Verificar si el usuario está autenticado
  static isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    const expiration = localStorage.getItem('token_expiration');
    
    if (!token || !expiration) {
      return false;
    }
    
    // Verificar si el token ha expirado
    const now = Date.now();
    const expirationTime = parseInt(expiration);
    
    if (now >= expirationTime) {
      // Token expirado, limpiar localStorage
      this.logout();
      return false;
    }
    
    return true;
  }
  
  // Obtener el token de acceso
  static getAccessToken(): string | null {
    if (!this.isAuthenticated()) {
      return null;
    }
    return localStorage.getItem('access_token');
  }
  
  // Logout
  static logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expiration');
    localStorage.removeItem('pkce_code_verifier');
    localStorage.removeItem('oauth_start_time');
    localStorage.removeItem('user_info');
    sessionStorage.removeItem('oauth_callback_processing');
    
    // Redirigir al login
    window.location.href = '/login';
  }
  
  // Renovar el token usando refresh token
  static async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (!refreshToken) {
        throw new Error('No hay refresh token disponible');
      }
      
      const response = await fetch(OAUTH_CONFIG.getTokenUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'token',
          refresh_token: refreshToken,
          client_id: OAUTH_CONFIG.CLIENT_ID,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Error al renovar el token');
      }
      
      const tokenData = await response.json();
      
      // Actualizar los tokens
      if (tokenData.access_token) {
        localStorage.setItem('access_token', tokenData.access_token);
        
        if (tokenData.refresh_token) {
          localStorage.setItem('refresh_token', tokenData.refresh_token);
        }
        
        if (tokenData.expires_in) {
          const expirationTime = Date.now() + (tokenData.expires_in * 1000);
          localStorage.setItem('token_expiration', expirationTime.toString());
        }
        
        return true;
      }
      
      return false;
      
    } catch {
      this.logout();
      return false;
    }
  }
  
  // Obtener información del usuario
  static async getUserInfo(): Promise<unknown> {
    const token = this.getAccessToken();
    
    if (!token) {
      throw new Error('No hay token de acceso');
    }
    
    const response = await fetch(`${ronditrackApiUrl}user/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener información del usuario');
    }
    
    return await response.json();
  }
}

export default AuthService; 