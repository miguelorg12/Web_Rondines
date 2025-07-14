import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import type { MenuItem as MenuItemType } from "../../utils/menuData";

// Definición de las propiedades que recibe el componente
interface MenuItemProps {
  item: MenuItemType; // Objeto con los datos del elemento del menú
}

// Componente funcional que renderiza un elemento del menú
const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  // Estado para controlar si el submenú está abierto o cerrado
  const [isOpen, setIsOpen] = useState(false);

  // Función para alternar la visibilidad del submenú
  const toggleSubmenu = () => {
    setIsOpen(!isOpen); // Cambia el estado entre true y false
  };

  return (
    <li>
      {/* Enlace principal del elemento del menú */}
      <a
        href={item.href || "#"} // Usa la URL del item o "#" como fallback
        className="nav-link" // Clase CSS para estilos
        onClick={item.submenu ? toggleSubmenu : undefined} // Solo ejecuta toggle si hay submenú
      >
        {item.label} {/* Texto del elemento del menú */}
        {/* Icono de flecha solo si el elemento tiene submenú */}
        {item.submenu && (
          <FontAwesomeIcon
            icon={isOpen ? faAngleUp : faAngleDown} // Cambia el icono según el estado
          />
        )}
      </a>

      {/* Renderiza el submenú solo si existe y está abierto */}
      {item.submenu && isOpen && (
        <ul className="submenu">
          {/* Mapea cada elemento del submenú */}
          {item.submenu.map((subItem) => (
            <li key={subItem.id}>
              {" "}
              {/* Clave única para cada sub-elemento */}
              <a href={subItem.href} className="submenu-link">
                {subItem.label} {/* Texto del sub-elemento */}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default MenuItem;
