// Definición de la interfaz para los elementos del menú
export interface MenuItem {
  id: string; // Identificador único del elemento del menú
  label: string; // Texto que se mostrará en el menú
  icon?: string; // Icono para el elemento del menú
  href?: string; // URL para la navegación
  submenu?: MenuItem[]; // Array de sub-elementos para crear menús desplegables
}

// Array de elementos del menú principal de la aplicación
export const menuItems: MenuItem[] = [
  {
    id: "inicio",
    label: "Inicio",
    href: "#", // Enlace placeholder - debería apuntar a la página de inicio
  },
  {
    id: "usuarios",
    label: "Usuarios",
    // Este elemento tiene un submenú con opciones relacionadas a usuarios
    submenu: [
      { id: "crear-usuario", label: "Crear Usuario", href: "#" },
      { id: "ver-usuarios", label: "Ver Usuarios", href: "#" },
    ],
  },
  {
    id: "logs",
    label: "Logs",
    href: "#", // Enlace para ver los logs del sistema
  },
  {
    id: "sucursales",
    label: "Sucursales",
    href: "#", // Enlace para gestionar sucursales
  },
  {
    id: "reportes",
    label: "Reportes",
    href: "#", // Enlace para generar reportes
  },
];
