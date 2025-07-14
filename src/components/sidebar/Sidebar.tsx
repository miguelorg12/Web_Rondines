import "./Sidebar.css"; // Estilos CSS específicos del sidebar
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faBars } from "@fortawesome/free-solid-svg-icons";
import Logo from "../../assets/images/logos/logo4.png"; // Logo de la aplicación
import MenuItem from "./MenuItem"; // Componente para renderizar cada elemento del menú
import { menuItems } from "../../utils/menuData"; // Datos del menú importados

function Sidebar() {
  return (
    <div className="sidebar">
      {/* Encabezado del sidebar con botón toggle y logo */}
      <div className="sidebar-header">
        {/* Botón para mostrar/ocultar el sidebar (hamburger menu) */}
        <button className="toogle-btn" type="button">
          <FontAwesomeIcon icon={faBars} /> {/* Icono de hamburguesa */}
        </button>
        {/* Logo de la aplicación */}
        <img src={Logo} alt="" className="logo-nav" />
      </div>

      {/* Navegación principal del sidebar */}
      <ul className="sidebar-nav">
        {/* Mapea cada elemento del menú y renderiza un componente MenuItem */}
        {menuItems.map((item) => (
          <MenuItem key={item.id} item={item} /> /* Cada elemento del menú */
        ))}
      </ul>

      {/* Pie del sidebar con opción de logout */}
      <div className="sidebar-footer">
        <a href="#" id="logoutLink" className="sidebar-link">
          <span>Logout</span> {/* Texto del enlace */}
          <FontAwesomeIcon icon={faRightFromBracket} /> {/* Icono de salida */}
        </a>
      </div>
    </div>
  );
}

export default Sidebar;
