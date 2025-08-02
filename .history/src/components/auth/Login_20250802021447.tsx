import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Alert,
  CircularProgress 
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';


interface LoginProps {
  onLogin: () => Promise<void>;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  loadingText?: string;
  infoText?: string;
  footerText?: string;
}

const Login: React.FC<LoginProps> = ({
  onLogin,
  title = "RondiTrack",
  subtitle = "Sistema de Gestión de Rondines",
  buttonText = "Iniciar Sesión OAuth2",
  loadingText = "Iniciando sesión...",
  infoText = "Utiliza tus credenciales corporativas para acceder al sistema",
  footerText = "© 2024 RondiTrack - Sistema de Gestión de Rondines"
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOAuthLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await onLogin();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setLoading(false);
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

        {/* Error message */}
        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            <Typography sx={{ fontFamily: "Barlow, sans-serif" }}>
              {error}
            </Typography>
          </Alert>
        )}

        {/* Login button */}
        <Button
          onClick={handleOAuthLogin}
          disabled={loading}
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
            boxShadow: '0 4px 12px rgba(59, 142, 231, 0.3)',
            '&:hover': {
              backgroundColor: '#1E2A38',
              boxShadow: '0 6px 16px rgba(30, 42, 56, 0.4)',
            },
            '&:disabled': {
              backgroundColor: '#ccc',
            },
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} sx={{ color: 'white' }} />
              <span>{loadingText}</span>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FontAwesomeIcon icon={faGoogle} style={{ fontSize: '18px', marginRight: '8px' }} />
              <span>{buttonText}</span>
            </Box>
          )}
        </Button>

        {/* Additional info */}
        <Typography variant="body2" sx={{
          fontFamily: 'Barlow, sans-serif',
          color: '#999',
          marginTop: 3,
          fontSize: '14px'
        }}>
          {infoText}
        </Typography>

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

export default Login; 