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
import { faLock } from '@fortawesome/free-solid-svg-icons';
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span>🔐</span>
              <span>Iniciar sesión con OAuth2</span>
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
          Utiliza tus credenciales autorizadas para acceder al sistema
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

export default Login; 