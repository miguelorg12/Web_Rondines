import React, { useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Sidebar from "./components/sidebar/Sidebar";
import Layout from "./components/layout/layout";
import { ToastProvider } from "./contexts/ToastContext";

import Dashboard from "./containers/Dashboard";
import Usuarios from "./containers/Usuarios";
import Logs from "./containers/Logs";
import Reportes from "./containers/Reportes";
import Empresas from "./containers/Empresas";
import Sucursales from "./containers/Sucursales";

// Memoizar componentes para evitar re-renders innecesarios
const MemoizedDashboard = React.memo(Dashboard);
const MemoizedUsuarios = React.memo(Usuarios);
const MemoizedLogs = React.memo(Logs);
const MemoizedReportes = React.memo(Reportes);
const MemoizedEmpresas = React.memo(Empresas);
const MemoizedSucursales = React.memo(Sucursales);

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Sidebar notifica el estado al Layout
  const handleSidebarToggle = (isOpen: boolean) => {
    setSidebarOpen(isOpen);
  };

  return (
    <Router>
      <ToastProvider>
        <Sidebar onToggle={handleSidebarToggle} />
        <Routes>
          <Route
            path="/"
            element={
              <Layout
                sidebarOpen={sidebarOpen}
                title="Dashboard"
                description="En este apoartado podras ver las Comparar el rendimiento día a día, Identificar picos y caídas de actividad Tomar decisiones informadas al instante"
              >
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/usuarios"
            element={
              <Layout
                sidebarOpen={sidebarOpen}
                title="Usuarios"
                description="En este apoartado podras ver, editar y crear usuarios"
              >
                <Usuarios />
              </Layout>
            }
          />
          <Route
            path="/logs"
            element={
              <Layout
                sidebarOpen={sidebarOpen}
                title="Logs"
                description="En este apoartado podras ver las acciones de los usuarios"
              >
                <Logs />
              </Layout>
            }
          />
          <Route
            path="/empresas"
            element={
              <Layout
                sidebarOpen={sidebarOpen}
                title="Empresas"
                description="En este apartado podras ver las empresas"
              >
                <Empresas />
              </Layout>
            }
          />
          <Route
            path="/sucursales"
            element={
              <Layout
                sidebarOpen={sidebarOpen}
                title="Sucursales"
                description="En este apartado podras ver las sucursales"
              >
                <Sucursales />
              </Layout>
            }
          />
          <Route
            path="/reportes"
            element={
              <Layout
                sidebarOpen={sidebarOpen}
                title="Reportes"
                description="En este apartado podras ver los reportes de los guardias"
              >
                <Reportes />
              </Layout>
            }
          />
        </Routes>
        </ToastProvider>
      </Router>
  );
}

export default App;
