import type { ReactNode } from "react";
import {
  Home as HomeIcon,
  People as PeopleIcon,
  Assignment as LogsIcon,
  Store as StoreIcon,
  Assessment as ReportsIcon,
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
    icon: <HomeIcon />,
    href: "#",
  },
  {
    id: "usuarios",
    label: "Usuarios",
    icon: <PeopleIcon />,
    submenu: [
      {
        id: "crear-usuario",
        label: "Crear Usuario",
        icon: <PersonAddIcon />,
        href: "#",
      },
      {
        id: "ver-usuarios",
        label: "Ver Usuarios",
        icon: <VisibilityIcon />,
        href: "#",
      },
    ],
  },
  {
    id: "logs",
    label: "Logs",
    icon: <LogsIcon />,
    href: "#",
  },
  {
    id: "sucursales",
    label: "Sucursales",
    icon: <StoreIcon />,
    href: "#",
  },
  {
    id: "reportes",
    label: "Reportes",
    icon: <ReportsIcon />,
    href: "#",
  },
];
