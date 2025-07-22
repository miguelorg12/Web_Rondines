import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";

// Definición de la interfaz para las propiedades del componente
interface LayoutProps {
  children: React.ReactNode; // Contenido hijo que se renderizará dentro del layout
  title?: string; // Título opcional para la página
  description?: string; // Descripción opcional para la página
  sidebarOpen?: boolean; // Estado del sidebar para ajustar el layout
}

const drawerWidth = 240;

// Componente funcional que define la estructura base de todas las vistas
function Layout({
  children,
  title,
  description,
  sidebarOpen = false,
}: LayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#e5e5e5",
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
        }}
      >
        {/* Barra de navegación superior dentro del main */}
        <AppBar
          position="static"
          sx={{
            backgroundColor: "#1e2a38",
            boxShadow: "none",
          }}
        >
          <Toolbar sx={{ minHeight: "60px !important" }}>
            {/* Aquí puedes agregar contenido de la navbar si es necesario */}
          </Toolbar>
        </AppBar>

        {/* Contenedor con scroll para el contenido */}
        <Box
          sx={{
            height: "calc(100vh - 60px)",
            overflowY: "auto",
            padding: theme.spacing(2, 3),
            boxSizing: "border-box",
            // Estilos personalizados para el scrollbar
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#1e2a38",
              borderRadius: "10px",
              "&:hover": {
                background: "#1e2a38",
              },
            },
          }}
        >
          {/* Título dinámico - solo se renderiza si se proporciona */}
          {title && (
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontSize: "2.5rem",
                fontWeight: 600,
                marginTop: "25px",
                color: "#1e2a38",
                fontFamily: "Barlow, sans-serif",
              }}
            >
              {title}
            </Typography>
          )}

          {/* Descripción dinámica - solo se renderiza si se proporciona */}
          {description && (
            <Typography
              variant="body1"
              sx={{
                fontSize: "1rem",
                marginBottom: "25px",
                color: "#000",
                fontFamily: "Barlow, sans-serif",
              }}
            >
              {description}
            </Typography>
          )}

          {/* Contenedor para el contenido principal de cada vista */}
          <Paper
            elevation={3}
            sx={{
              backgroundColor: "#fff",
              borderRadius: "20px",
              borderBottom: "3px solid #1e2a38",
              padding: theme.spacing(2.5),
              marginBottom: theme.spacing(2.5),
              boxSizing: "border-box",
              filter: "drop-shadow(0 0 1rem rgba(0, 0, 0, 0.1))",
              height: "90%",
              maxHeight: "100vh",
              overflow: "auto",
            }}
          >
            {children}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;
