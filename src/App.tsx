import React, { useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Sidebar from "./components/sidebar/Sidebar";
import Layout from "./components/layout/layout";

import Dashboard from "./containers/Dashboard";
import Usuarios from "./containers/Usuarios";
import CrearUsuario from "./containers/CrearUsuario";
// import Reportes from "./containers/Reportes";
// import Logs from "./containers/Logs";
// import Sucursales from "./containers/Sucursales";

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Sidebar notifica el estado al Layout
  const handleSidebarToggle = (isOpen: boolean) => {
    setSidebarOpen(isOpen);
  };

  return (
    <>
      <Sidebar onToggle={handleSidebarToggle} />
      <Router>
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
            path="/usuarios/crear"
            element={
              <Layout
                sidebarOpen={sidebarOpen}
                title="Crear Usuario"
                description="Agregar un nuevo usuario al sistema"
              >
                <CrearUsuario />
              </Layout>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
