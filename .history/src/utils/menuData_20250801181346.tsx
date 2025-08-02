import type { ReactNode } from "react";

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
    href: "/usuarios",
  },

  {
    id: "empresas",
    label: "Empresas",
    href: "/empresas",
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
