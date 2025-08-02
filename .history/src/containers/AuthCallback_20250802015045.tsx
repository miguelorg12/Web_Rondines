import React, { useEffect, useState } from 'react';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Alert, 
  Button, 
  Paper 
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

const AuthCallback: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isCodeExpired, setIsCodeExpired] = useState(false);

  useEffect(() => {
    // Prevenir múltiples ejecuciones del callback
    const isProcessing = sessionStorage.getItem('oauth_callback_processing');
    if (isProcessing === 'true') {
      return;
    }

    const handleAuthCallback = async () => {
      try {
        // Marcar que estamos procesando
        sessionStorage.setItem('oauth_callback_processing', 'true');

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const codeVerifier = localStorage.getItem("pkce_code_verifier");
        const error = urlParams.get("error");

        // Si hay un error en la URL
        if (error) {
          setError(`Error de autenticación: ${error}`);
          setLoading(false);
          return;
        }

        // Verificar que tenemos el código y el code verifier
        if (!code || !codeVerifier) {
          setError("Faltan parámetros de autenticación. Por favor, intenta de nuevo.");
          setLoading(false);
          return;
        }

        // Verificar si el código de autorización no ha expirado (límite de 5 minutos)
        const startTime = localStorage.getItem('oauth_start_time');
        if (startTime) {
          const elapsed = Date.now() - parseInt(startTime);
          const maxTime = 5 * 60 * 1000; // 5 minutos en millisegundos
          
          if (elapsed > maxTime) {
            console.error('📡 AuthCallback: Código de autorización expirado. Tiempo transcurrido:', elapsed / 1000, 'segundos');
            setError("El código de autorización ha expirado. Por favor, inicia sesión nuevamente.");
            setIsCodeExpired(true);
            setLoading(false);
            
            // Limpiar datos del proceso anterior
            localStorage.removeItem('pkce_code_verifier');
            localStorage.removeItem('oauth_start_time');
            sessionStorage.removeItem('oauth_callback_processing');
            
            return;
          }
          
          console.log('📡 AuthCallback: Código válido. Tiempo transcurrido:', elapsed / 1000, 'segundos');
        }

        // Verificar si ya tenemos un token válido
        const existingToken = localStorage.getItem("access_token");
        const tokenExpiration = localStorage.getItem("token_expiration");
        
        if (existingToken && tokenExpiration) {
          const expirationTime = parseInt(tokenExpiration);
          if (Date.now() < expirationTime) {
            console.log('📡 AuthCallback: Token válido encontrado, redirigiendo...');
            setSuccess(true);
            setLoading(false);
            setTimeout(() => {
              window.location.href = "/dashboard";
            }, 1000);
            return;
          }
        }

        console.log("Intercambiando código por token...");

        // Obtener el puerto guardado durante el login
        const savedPort = localStorage.getItem('oauth_port');
        const oauthPort = savedPort ? parseInt(savedPort) : 3343;
        
        console.log("📡 AuthCallback: Usando puerto OAuth2:", oauthPort);

        // Usar tu código exacto para el callback
        const tokenUrl = `http://localhost:${oauthPort}/oauth/v1/token`;
        console.log("📡 AuthCallback: Token URL:", tokenUrl);
        
        const response = await fetch(tokenUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            grant_type: "code",
            code,
            redirect_uri: `${window.location.origin}/auth/callback`,
            client_id: "ronditrack-web-app",
            code_verifier: codeVerifier,
          }),
        });

        console.log("📡 AuthCallback: Response status:", response.status);
        console.log("📡 AuthCallback: Response headers:", [...response.headers.entries()]);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("📡 AuthCallback: Error response text:", errorText);
          
          // Buscar específicamente el error de código expirado
          const isExpiredCode = errorText.includes('Authorization code expired') || 
                               errorText.includes('expired') ||
                               response.status === 500;
          
          if (isExpiredCode) {
            console.error("📡 AuthCallback: Detectado código de autorización expirado");
            setError("El código de autorización ha expirado. Este error suele ocurrir cuando pasa demasiado tiempo entre la autorización y el intercambio del token.");
            setIsCodeExpired(true);
            setLoading(false);
            
            // Limpiar datos
            localStorage.removeItem('pkce_code_verifier');
            localStorage.removeItem('oauth_start_time');
            sessionStorage.removeItem('oauth_callback_processing');
            
            return;
          }
          
          try {
            const errorData = JSON.parse(errorText);
            console.error("📡 AuthCallback: Error data parsed:", errorData);
            throw new Error(errorData.error_description || errorData.error || `HTTP ${response.status}: Error al obtener el token`);
          } catch (parseError) {
            console.error("📡 AuthCallback: Could not parse error response:", parseError);
            throw new Error(`HTTP ${response.status}: Error al obtener el token - ${errorText}`);
          }
        }

        const tokenData = await response.json();
        console.log("🔥 RESPUESTA COMPLETA DEL TOKEN:", JSON.stringify(tokenData, null, 2));
        
        // Guardar los tokens y datos del usuario en localStorage
        if (tokenData.accessToken) {
          localStorage.setItem("access_token", tokenData.accessToken);
          
          // Guardar información del usuario
          if (tokenData.user) {
            localStorage.setItem("user_info", JSON.stringify(tokenData.user));
            

          }
          
          // Manejar expiración del token
          if (tokenData.expires_in) {
            const expirationTime = Date.now() + (tokenData.expires_in * 1000);
            localStorage.setItem("token_expiration", expirationTime.toString());
          }

          // Calcular tiempo total del proceso
          const startTime = localStorage.getItem('oauth_start_time');
          if (startTime) {
            const processingTime = (Date.now() - parseInt(startTime)) / 1000;
            console.log('✅ AuthCallback: Proceso completado en', processingTime, 'segundos');
          }

          // Limpiar el code verifier, timestamp y marcador de procesamiento
          localStorage.removeItem("pkce_code_verifier");
          localStorage.removeItem("oauth_start_time");
          sessionStorage.removeItem('oauth_callback_processing');
          
          setSuccess(true);
          
          // Redirigir al dashboard inmediatamente
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 1000);
        } else {
          throw new Error("No se recibió un token de acceso válido");
        }

      } catch (err) {
        console.error("Error en el callback de autenticación:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
        // Limpiar marcador en caso de error
        sessionStorage.removeItem('oauth_callback_processing');
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, []);

  const handleRetryLogin = () => {
    window.location.href = "/login";
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 2
    }}>
      <Paper sx={{
        padding: 6,
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        maxWidth: 400,
        width: '100%',
        textAlign: 'center',
        backgroundColor: '#ffffff'
      }}>
        {/* Logo o título */}
        <Box sx={{ marginBottom: 4, textAlign: 'center' }}>
          <Typography variant="h3" sx={{
            fontFamily: 'Barlow, sans-serif',
            fontWeight: 'bold',
            color: '#1E2A38',
            marginBottom: 2
          }}>
            RondiTrack
          </Typography>
          <Typography variant="h6" sx={{
            fontFamily: 'Barlow, sans-serif',
            color: '#666',
            marginBottom: 3
          }}>
            Sistema de Gestión de Rondines
          </Typography>
        </Box>

        {/* Estado de carga principal */}
        {loading && (
          <Box sx={{ marginBottom: 4, textAlign: 'center' }}>
            <CircularProgress size={60} sx={{ color: '#3B8EE7', marginBottom: 2 }} />
            <Typography variant="h6" sx={{
              fontFamily: 'Barlow, sans-serif',
              color: '#666',
              marginBottom: 2
            }}>
              Procesando autenticación...
            </Typography>
            <Typography variant="body2" sx={{
              fontFamily: 'Barlow, sans-serif',
              color: '#999',
              fontSize: '14px'
            }}>
              Verificando credenciales del sistema OAuth2
            </Typography>
          </Box>
        )}

        {/* Estado de éxito */}
        {success && (
          <Box sx={{ marginBottom: 4, textAlign: 'center' }}>
            <Typography variant="h6" sx={{
              fontFamily: 'Barlow, sans-serif',
              color: '#4caf50',
              marginBottom: 2
            }}>
              ✅ ¡Autenticación exitosa!
            </Typography>
            <Typography variant="body2" sx={{
              fontFamily: 'Barlow, sans-serif',
              color: '#999',
              fontSize: '14px'
            }}>
              Redirigiendo al dashboard...
            </Typography>
          </Box>
        )}

        {/* Estado de error */}
        {error && (
          <Box sx={{ marginBottom: 4, textAlign: 'center' }}>
            <Alert severity="error" sx={{ marginBottom: 3 }}>
              <Typography sx={{ fontFamily: "Barlow, sans-serif" }}>
                {error}
              </Typography>
            </Alert>
            
            {isCodeExpired && (
              <Button
                onClick={handleRetryLogin}
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: '#3B8EE7',
                  color: '#FFFFFF',
                  fontFamily: 'Barlow, sans-serif',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  borderRadius: 2,
                  padding: '16px 48px',
                  fontSize: '18px',
                  minWidth: '300px',
                  '&:hover': {
                    backgroundColor: '#1E2A38',
                  },
                }}
              >
                🔄 Intentar nuevamente
              </Button>
            )}
          </Box>
        )}

        {/* Footer info */}
        <Box sx={{ 
          marginTop: 4, 
          paddingTop: 2, 
          borderTop: '1px solid #eee',
          textAlign: 'center' 
        }}>
          <Typography variant="caption" sx={{
            fontFamily: 'Barlow, sans-serif',
            color: '#bbb',
            fontSize: '12px'
          }}>
            © 2024 RondiTrack - Sistema de Gestión de Rondines
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default AuthCallback; 