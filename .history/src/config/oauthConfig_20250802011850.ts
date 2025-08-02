const OAUTH_CONFIG = {
  CLIENT_ID: "ronditrack-web-app",
  PORTS: [3343, 3344, 3345, 3346, 3347], // Puertos para probar
  DEFAULT_PORT: 3343,
  
  // URL base para autorización
  getAuthorizeUrl: (port: number) => `http://localhost:${port}/oauth/v1/authorize`,
  
  // URL para obtener token
  getTokenUrl: (port: number) => `http://localhost:${port}/oauth/v1/token`,
  
  // Buscar puerto OAuth2 disponible
  async findWorkingPort(): Promise<number | null> {
    console.log('🔍 OAUTH_CONFIG.findWorkingPort: Buscando puerto OAuth2 disponible...');
    
    for (const port of this.PORTS) {
      try {
        console.log(`🔍 OAUTH_CONFIG.findWorkingPort: Probando puerto ${port}...`);
        
        const response = await fetch(`http://localhost:${port}/oauth/v1/authorize`, {
          method: 'HEAD',
          mode: 'no-cors', // Para evitar errores CORS en la verificación
        });
        
        console.log(`✅ OAUTH_CONFIG.findWorkingPort: Puerto ${port} disponible`);
        return port;
        
      } catch (error) {
        console.log(`❌ OAUTH_CONFIG.findWorkingPort: Puerto ${port} no disponible:`, error);
        continue;
      }
    }
    
    console.error('❌ OAUTH_CONFIG.findWorkingPort: Ningún puerto OAuth2 disponible');
    return null;
  }
};

export default OAUTH_CONFIG; 