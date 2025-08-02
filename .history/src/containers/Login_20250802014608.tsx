import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Alert,
  CircularProgress 
} from '@mui/material';
import { AuthService } from '../services/authService';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOAuthLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await AuthService.initiateLogin();
      
    } catch (err) {
      console.error('Error en login:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: '#ffffff !important',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999
    }}>
      <Box sx={{
        padding: 6,
        maxWidth: '100%',
        width: '100%',
        height: '100vh',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
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
            '&:hover': {
              backgroundColor: '#1E2A38',
            },
            '&:disabled': {
              backgroundColor: '#ccc',
            },
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} sx={{ color: 'white' }} />
              <span>Iniciando sesión...</span>
            </Box>
          ) : (
            <span>Iniciar Sesión OAuth2</span>
          )}
        </Button>

        {/* Additional info */}
        <Typography variant="body2" sx={{
          fontFamily: 'Barlow, sans-serif',
          color: '#999',
          marginTop: 3,
          fontSize: '14px'
        }}>
          Utiliza tus credenciales corporativas para acceder al sistema
        </Typography>

        {/* Footer info */}
        <Box sx={{ 
          position: 'absolute', 
          bottom: 20, 
          left: 0, 
          right: 0, 
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
       </Box>
     </Box>
  );
};

export default Login; 