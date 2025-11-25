import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
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
            <li><NavLink className={linkClass} to="/nosotros">Nosotros</NavLink></li>
            <li><NavLink className={linkClass} to="/blog">Blog</NavLink></li>
            <li><NavLink className={linkClass} to="/contacto">Contacto</NavLink></li>
            {isAdmin && <li><NavLink className={linkClass} to="/admin">Admin</NavLink></li>}
            {isAuthenticated ? (
              <>
                <li><span>{user?.email}</span></li>
                <li><button onClick={logout}>Salir</button></li>
              </>
            ) : (
              <li><NavLink className={linkClass} to="/login">Ingresar</NavLink></li>
            )}
            <li><NavLink className={linkClass} to="/registro">Registro</NavLink></li>
            <li><NavLink className={linkClass} to="/perfil">Perfil</NavLink></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
