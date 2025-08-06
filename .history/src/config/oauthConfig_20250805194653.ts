import { oauthUrl } from '../app/apiConfig';

const OAUTH_CONFIG = {
  CLIENT_ID: "ronditrack-web-app",
  
  // URL base para autorización (derivada de oauthUrl)
  getAuthorizeUrl: () => {
    const baseUrl = oauthUrl.replace('/oauth/v1/token', '');
    return `${baseUrl}/oauth/v1/authorize`;
  },
  
  // URL para obtener token (desde apiConfig)
  getTokenUrl: () => oauthUrl,
  
  // Verificar si el servidor OAuth está disponible
  async checkOAuthServer(): Promise<boolean> {
    try {
      const authorizeUrl = this.getAuthorizeUrl();
      console.log('🔍 OAUTH_CONFIG.checkOAuthServer: Verificando servidor OAuth...');
      console.log('🔍 OAUTH_CONFIG.checkOAuthServer: URL:', authorizeUrl);
      
      const response = await fetch(authorizeUrl, {
        method: 'HEAD',
        mode: 'no-cors', // Para evitar errores CORS en la verificación
      });
      
      console.log('✅ OAUTH_CONFIG.checkOAuthServer: Servidor OAuth disponible');
      return true;
      
    } catch (error) {
      console.error('❌ OAUTH_CONFIG.checkOAuthServer: Servidor OAuth no disponible:', error);
      return false;
    }
  }
};

export default OAUTH_CONFIG; 