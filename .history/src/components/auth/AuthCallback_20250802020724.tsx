import React, { useEffect, useState } from 'react';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Alert, 
  Button, 
  Paper 
} from '@mui/material';

interface AuthCallbackProps {
  onAuthCallback: () => Promise<void>;
  onRetry?: () => void;
  title?: string;
  subtitle?: string;
  loadingText?: string;
  successText?: string;
  errorText?: string;
  retryText?: string;
  footerText?: string;
  redirectDelay?: number;
}

const AuthCallback: React.FC<AuthCallbackProps> = ({
  onAuthCallback,
  onRetry,
  title = "RondiTrack",
  subtitle = "Sistema de Gestión de Rondines",
  loadingText = "Procesando autenticación...",
  successText = "¡Autenticación exitosa!",
  errorText = "Por favor intenta nuevamente",
  retryText = "🔄 Intentar nuevamente",
  footerText = "© 2024 RondiTrack - Sistema de Gestión de Rondines",
  redirectDelay = 1000
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isCodeExpired, setIsCodeExpired] = useState(false);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setLoading(true);
        setError(null);
        
        await onAuthCallback();
        
        setSuccess(true);
        setLoading(false);
        
        // Redirigir después del delay
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, redirectDelay);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        setLoading(false);
      }
    };

    handleCallback();
  }, [onAuthCallback, redirectDelay]);

  const handleRetryLogin = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 2,
      width: '100%'
    }}>
      <Paper sx={{
        padding: 6,
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        maxWidth: 400,
        width: '100%',
        textAlign: 'center',
        backgroundColor: '#ffffff',
        margin: '0 auto'
      }}>
        {/* Logo o título */}
        <Box sx={{ marginBottom: 4, textAlign: 'center' }}>
          <Typography variant="h3" sx={{
            fontFamily: 'Barlow, sans-serif',
            fontWeight: 'bold',
            color: '#1E2A38',
            marginBottom: 2
          }}>
            {title}
          </Typography>
          <Typography variant="h6" sx={{
            fontFamily: 'Barlow, sans-serif',
            color: '#666',
            marginBottom: 3
          }}>
            {subtitle}
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
              {loadingText}
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
              ✅ {successText}
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
                {retryText}
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
            {footerText}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default AuthCallback; 