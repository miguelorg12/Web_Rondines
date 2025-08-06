// Configuración basada en variables de entorno
const getApiConfig = () => {
  const env = import.meta.env.VITE_APP_ENV || 'development';
  
  switch (env) {
    case 'development':
      return {
        ronditrackApiUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3342/api/v1/',
        oauthUrl: import.meta.env.VITE_OAUTH_URL || 'http://localhost:3343/oauth/token',
        USE_TOKEN: true,
      };
    
    case 'qa':
      return {
        ronditrackApiUrl: import.meta.env.VITE_API_BASE_URL || 'https://qa.api.ronditrack.online/api/v1/',
        oauthUrl: import.meta.env.VITE_OAUTH_URL || 'https://api-sec-qa.ronditrack.online/oauth/token',
        USE_TOKEN: true,
      };
    
    case 'staging':
      return {
        ronditrackApiUrl: import.meta.env.VITE_API_BASE_URL || 'https://staging.api.ronditrack.online/api/v1/',
        oauthUrl: import.meta.env.VITE_OAUTH_URL || 'https://api-sec-staging.ronditrack.online/oauth/token',
        USE_TOKEN: true,
      };
    
    case 'production':
      return {
        ronditrackApiUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.ronditrack.online/api/v1/',
        oauthUrl: import.meta.env.VITE_OAUTH_URL || 'https://api-sec.ronditrack.online/oauth//token',
        USE_TOKEN: true,
      };
    
    default:
      return {
        ronditrackApiUrl: 'http://localhost:3342/api/v1/',
        oauthUrl: 'http://localhost:3343/oauth/v1/token',
        USE_TOKEN: true,
      };
  }
};

const ApiConfig = getApiConfig();

export const { ronditrackApiUrl, oauthUrl, USE_TOKEN } = ApiConfig;