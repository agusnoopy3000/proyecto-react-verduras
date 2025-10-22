import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  const linkClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");
  return (
    <header className="site">
      <div className="container nav">
        <div className="brand"><NavLink to="/">HuertoHogar</NavLink></div>
        <nav>
          <ul>
            <li><NavLink className={linkClass} to="/">Inicio</NavLink></li>
            <li><NavLink className={linkClass} to="/catalogo">Catálogo</NavLink></li>
            <li><NavLink className={linkClass} to="/carrito">Carrito</NavLink></li>
            {/* se quita enlace directo a /pedido según lo pediste */}
            <li><NavLink className={linkClass} to="/nosotros">Nosotros</NavLink></li>
            <li><NavLink className={linkClass} to="/blog">Blog</NavLink></li>
            <li><NavLink className={linkClass} to="/contacto">Contacto</NavLink></li>
            <li><NavLink className={linkClass} to="/login">Ingresar</NavLink></li>
            <li><NavLink className={linkClass} to="/registro">Registro</NavLink></li>
            <li><NavLink className={linkClass} to="/perfil">Perfil</NavLink></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
