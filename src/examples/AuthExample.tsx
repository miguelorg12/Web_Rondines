import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../components/auth/Login';
import AuthCallback from '../components/auth/AuthCallback';
import '../styles/auth.css';

// Ejemplo de servicio de autenticación
const AuthService = {
  initiateLogin: async () => {
    // Simular redirección OAuth2
    console.log('Iniciando login OAuth2...');
    // Aquí iría tu lógica de OAuth2
    window.location.href = 'https://tu-servidor-oauth.com/auth';
  },
  
  handleCallback: async () => {
    // Simular procesamiento del callback
    console.log('Procesando callback...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simular token recibido
    localStorage.setItem('access_token', 'fake-token-123');
    localStorage.setItem('token_expiration', (Date.now() + 3600000).toString());
  }
};

const AuthExample: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta de Login */}
        <Route 
          path="/login" 
          element={
            <Login 
              onLogin={AuthService.initiateLogin}
              title="Mi Aplicación"
              subtitle="Sistema de Gestión"
              buttonText="Iniciar Sesión"
              loadingText="Conectando..."
              infoText="Usa tus credenciales corporativas"
              footerText="© 2024 Mi Empresa"
            />
          } 
        />
        
        {/* Ruta de Callback */}
        <Route 
          path="/auth/callback" 
          element={
            <AuthCallback 
              onAuthCallback={AuthService.handleCallback}
              title="Mi Aplicación"
              subtitle="Sistema de Gestión"
              loadingText="Verificando credenciales..."
              successText="¡Bienvenido!"
              errorText="Error en la autenticación"
              retryText="🔄 Intentar de nuevo"
              footerText="© 2024 Mi Empresa"
              redirectDelay={1500}
            />
          } 
        />
        
        {/* Ruta por defecto - redirigir al login */}
        <Route 
          path="/" 
          element={
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100vh',
              background: '#f5f5f5'
            }}>
              <button 
                onClick={() => window.location.href = '/login'}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#3B8EE7',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Ir al Login
              </button>
            </div>
          } 
        />
      </Routes>
    </Router>
  );
};

export default AuthExample; 