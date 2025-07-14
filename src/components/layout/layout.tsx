import React from "react";
import "./Layout.css"; // Importa los estilos CSS del layout

// Definición de la interfaz para las propiedades del componente
interface LayoutProps {
  children: React.ReactNode; // Contenido hijo que se renderizará dentro del layout
  title?: string; // Título opcional para la página
  description?: string; // Descripción opcional para la página
}

// Componente funcional que define la estructura base de todas las vistas
function Layout({ children, title, description }: LayoutProps) {
  return (
    <div className="main">
      {" "}
      {/* Contenedor principal del layout */}
      <nav className="navbar"></nav>{" "}
      {/* Barra de navegación superior (vacía por ahora) */}
      <div className="scrollable-content">
        {" "}
        {/* Contenedor con scroll para el contenido */}
        {/* Título dinámico - solo se renderiza si se proporciona */}
        {title && <p className="title">{title}</p>}
        {/* Descripción dinámica - solo se renderiza si se proporciona */}
        {description && <p className="description">{description}</p>}
        {/* Contenedor para el contenido principal de cada vista */}
        <div className="container-div">{children}</div>
      </div>
    </div>
  );
}

export default Layout;
