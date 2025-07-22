import type { ReactNode } from "react";
import {
  PersonAdd as PersonAddIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";

export interface MenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  submenu?: MenuItem[];
}

export const menuItems: MenuItem[] = [
  {
    id: "inicio",
    label: "Inicio",
    href: "/",
  },
  {
    id: "usuarios",
    label: "Usuarios",
    submenu: [
      {
        id: "crear-usuario",
        label: "Crear Usuario",
        icon: <PersonAddIcon />,
        href: "/usuarios/crear",
      },
      {
        id: "ver-usuarios",
        label: "Ver Usuarios",
        icon: <VisibilityIcon />,
        href: "/usuarios",
      },
    ],
  },
  {
    id: "logs",
    label: "Logs",
    href: "/logs",
  },
  {
    id: "sucursales",
    label: "Sucursales",
    href: "/sucursales",
  },
  {
    id: "reportes",
    label: "Reportes",
    href: "/reportes",
  },
];
