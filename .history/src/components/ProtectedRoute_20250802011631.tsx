import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  console.log('🛡️ ProtectedRoute: Verificando autenticación...');
  
  const isAuth = AuthService.isAuthenticated();
  console.log('🛡️ ProtectedRoute: Usuario autenticado?', isAuth);
  
  if (!isAuth) {
    console.log('🛡️ ProtectedRoute: No autenticado, redirigiendo a /login');
    return <Navigate to="/login" replace />;
  }

  // Verificar si hay información del usuario
  const userInfo = localStorage.getItem('user_info');
  if (!userInfo) {
    console.log('🛡️ ProtectedRoute: No hay información del usuario, limpiando sesión');
    AuthService.logout();
    return <Navigate to="/login" replace />;
  }

  // Verificar si hay branch_id asignado
  const branchId = localStorage.getItem('assigned_branch_id');
  if (!branchId) {
    console.log('🛡️ ProtectedRoute: No hay sucursal asignada, limpiando sesión');
    AuthService.logout();
    return <Navigate to="/login" replace />;
  }
  
  console.log('🛡️ ProtectedRoute: Autenticado correctamente, renderizando children');
  return <>{children}</>;
};

export default ProtectedRoute; 