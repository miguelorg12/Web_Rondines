import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ListItem,
  ListItemButton,
  ListItemText,
  List,
  Collapse,
  Box,
  Typography,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import type { MenuItem as MenuItemType } from "../../utils/menuData";

interface MenuItemProps {
  item: MenuItemType;
}

const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSubmenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (item.submenu) {
      e.preventDefault();
      toggleSubmenu();
    } else if (item.href) {
      e.preventDefault();
      navigate(item.href);
    }
  };

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton
          component="a"
          href={item.href || "#"}
          onClick={handleClick}
          sx={{
            color: "#fff",
            "&:hover": {
              backgroundColor: "rgba(59, 142, 231, 0.1)",
              color: "#3b8ee7",
            },
            paddingLeft: 3,
          }}
        >
          <ListItemText
            primary={
              <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                {item.label}
              </Typography>
            }
          />
          {item.submenu && (
            <Box sx={{ color: "inherit" }}>
              {isOpen ? <ExpandLess /> : <ExpandMore />}
            </Box>
          )}
        </ListItemButton>
      </ListItem>

      {item.submenu && (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.submenu.map((subItem) => (
              <ListItem key={subItem.id} disablePadding>
                <ListItemButton
                  component="a"
                  href={subItem.href}
                  sx={{
                    color: "#bbb",
                    paddingLeft: 5,
                    "&:hover": {
                      backgroundColor: "rgba(59, 142, 231, 0.1)",
                      color: "#3b8ee7",
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontSize: "1rem" }}>
                        {subItem.label}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default MenuItem;
