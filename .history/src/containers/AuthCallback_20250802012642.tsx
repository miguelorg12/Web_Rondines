import React, { useEffect, useState } from 'react';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Alert, 
  Button, 
  Paper 
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

const AuthCallback: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isCodeExpired, setIsCodeExpired] = useState(false);

  useEffect(() => {
    // Prevenir múltiples ejecuciones del callback
    const isProcessing = sessionStorage.getItem('oauth_callback_processing');
    if (isProcessing === 'true') {
      console.log('📡 AuthCallback: Ya se está procesando el callback, evitando duplicado');
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
      background: 'linear-gradient(135deg, #1E2A38 0%, #3B8EE7 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 2
    }}>
      <Paper sx={{
        padding: 4,
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        maxWidth: 400,
        width: '100%',
        textAlign: 'center'
      }}>
        {/* Logo o título */}
        <Box sx={{ marginBottom: 3 }}>
          <FontAwesomeIcon 
            icon={faLock} 
            size="3x" 
            style={{ color: '#3B8EE7', marginBottom: '16px' }}
          />
          <Typography variant="h4" sx={{
            fontFamily: 'Barlow, sans-serif',
            fontWeight: 'bold',
            color: '#1E2A38',
            marginBottom: 1
          }}>
            RondiTrack
          </Typography>
          <Typography variant="subtitle1" sx={{
            fontFamily: 'Barlow, sans-serif',
            color: '#666',
            marginBottom: 2
          }}>
            Sistema de Gestión de Rondas
          </Typography>
        </Box>

        {/* Estado de carga principal (siempre visible durante loading) */}
        {loading && (
          <Box
            sx={{
              backgroundColor: '#3B8EE7',
              color: '#FFFFFF',
              fontFamily: 'Barlow, sans-serif',
              fontWeight: 'bold',
              textTransform: 'none',
              borderRadius: 2,
              padding: '12px 24px',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              marginBottom: 3,
              width: '100%',
              minHeight: '48px'
            }}
          >
            <CircularProgress size={20} sx={{ color: 'white' }} />
            <span>Procesando autenticación...</span>
          </Box>
        )}

        {/* Estado de éxito (solo cuando success es true) */}
        {success && (
          <Box
            sx={{
              backgroundColor: '#4caf50',
              color: '#FFFFFF',
              fontFamily: 'Barlow, sans-serif',
              fontWeight: 'bold',
              textTransform: 'none',
              borderRadius: 2,
              padding: '12px 24px',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              marginBottom: 3,
              width: '100%',
              minHeight: '48px'
            }}
          >
            <span>✅</span>
            <span>¡Autenticación exitosa!</span>
          </Box>
        )}

        {/* Estado de error (solo cuando hay error) */}
        {error && (
          <Box sx={{ marginBottom: 3 }}>
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              <Typography sx={{ fontFamily: "Barlow, sans-serif" }}>
                {error}
              </Typography>
            </Alert>
            
            {isCodeExpired && (
              <Button
                onClick={handleRetryLogin}
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  backgroundColor: '#3B8EE7',
                  color: '#FFFFFF',
                  fontFamily: 'Barlow, sans-serif',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  borderRadius: 2,
                  padding: '12px 24px',
                  fontSize: '16px',
                  '&:hover': {
                    backgroundColor: '#1E2A38',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>🔄</span>
                  <span>Intentar nuevamente</span>
                </Box>
              </Button>
            )}
          </Box>
        )}

        {/* Additional info */}
        <Typography variant="body2" sx={{
          fontFamily: 'Barlow, sans-serif',
          color: '#999',
          marginTop: 3,
          fontSize: '14px'
        }}>
          {loading && "Verificando credenciales del sistema OAuth2"}
          {success && "Redirigiendo al dashboard..."}
          {error && "Por favor intenta nuevamente"}
        </Typography>

        {/* Footer info */}
        <Box sx={{ marginTop: 4, paddingTop: 2, borderTop: '1px solid #eee' }}>
          <Typography variant="caption" sx={{
            fontFamily: 'Barlow, sans-serif',
            color: '#bbb',
            fontSize: '12px'
          }}>
            Versión 1.0.0 - Sistema Seguro OAuth2 + PKCE
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default AuthCallback; 