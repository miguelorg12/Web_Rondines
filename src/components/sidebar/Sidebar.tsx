import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  List,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Menu as MenuIcon, ExitToApp as LogoutIcon } from "@mui/icons-material";
import Logo from "../../assets/images/logos/logo4.png";
import MenuItem from "./menuItem";
import { menuItems } from "../../utils/menuData";

const drawerWidth = 240;

interface SidebarProps {
  onToggle?: (isOpen: boolean) => void;
}

function Sidebar({ onToggle }: SidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isOpen, setIsOpen] = useState(!isMobile);

  const toggleDrawer = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  };

  const handleClose = () => {
    setIsOpen(false);
    onToggle?.(false);
  };

  return (
    <>
      {/* Botón para abrir el sidebar - posición dinámica */}
      <IconButton
        onClick={toggleDrawer}
        sx={{
          position: "fixed",
          top: 10,
          left: 10,
          zIndex: 1300,
          backgroundColor: "#1e2a38",
          color: "#fff",
          transition: "left 0.3s ease",
          "&:hover": {
            backgroundColor: "#3b8ee7",
          },
        }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        variant="persistent"
        open={isOpen}
        sx={{
          width: isOpen ? drawerWidth : 0,
          flexShrink: 0,
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#1e2a38",
            color: "#fff",
            position: "relative",
          },
        }}
      >
        {/* Header del sidebar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            padding: theme.spacing(1, 2),
            minHeight: 60,
          }}
        >
          <Box
            component="img"
            src={Logo}
            alt="Logo"
            sx={{ height: 35, marginLeft: 5 }}
          />
        </Box>

        <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }} />

        {/* Navegación principal */}
        <Box sx={{ overflow: "auto", flex: 1 }}>
          <List sx={{ padding: 0 }}>
            {menuItems.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </List>
        </Box>

        {/* Footer del sidebar */}
        <Box
          sx={{
            padding: theme.spacing(2),
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Box
            component="a"
            href="#"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "#fff",
              textDecoration: "none",
              "&:hover": {
                color: "#3b8ee7",
              },
            }}
          >
            <Typography variant="body2">Logout</Typography>
            <LogoutIcon />
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

export default Sidebar;
