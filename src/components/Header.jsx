import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Header = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const linkClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

  const handleLogout = () => {
    const wasAdmin = isAdmin;
    logout();
    if (wasAdmin) {
      toast.info('Sesión como administrador cerrada', { 
        position: 'top-center',
        autoClose: 3000 
      });
    } else {
      toast.info('Sesión cerrada correctamente', { 
        position: 'top-center',
        autoClose: 2000 
      });
    }
    navigate('/');
  };

  return (
    <header className="site">
      <div className="container nav">
        <div className="brand"><NavLink to="/">HuertoHogar</NavLink></div>
        <nav>
          <ul>
            <li><NavLink className={linkClass} to="/">Inicio</NavLink></li>
            <li><NavLink className={linkClass} to="/catalogo">Catálogo</NavLink></li>
            
            {/* Si es Admin: solo muestra Inicio, Catálogo, Admin y Cerrar Sesión */}
            {isAdmin ? (
              <>
                <li><NavLink className={linkClass} to="/admin">Panel Admin</NavLink></li>
                <li>
                  <span style={{ color: '#28a745', fontWeight: 500, fontSize: 14 }}>
                    👤 {user?.nombre || user?.email}
                  </span>
                </li>
                <li>
                  <button 
                    onClick={handleLogout} 
                    className="btn btn-outline-danger btn-sm"
                    style={{ padding: '4px 12px' }}
                  >
                    Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                {/* Menú completo para usuarios normales */}
                <li><NavLink className={linkClass} to="/carrito">Carrito</NavLink></li>
                <li><NavLink className={linkClass} to="/nosotros">Nosotros</NavLink></li>
                <li><NavLink className={linkClass} to="/blog">Blog</NavLink></li>
                <li><NavLink className={linkClass} to="/contacto">Contacto</NavLink></li>
                
                {isAuthenticated ? (
                  <>
                    <li><NavLink className={linkClass} to="/perfil">Mi Perfil</NavLink></li>
                    <li>
                      <span style={{ color: '#666', fontSize: 14 }}>
                        {user?.nombre || user?.email}
                      </span>
                    </li>
                    <li>
                      <button 
                        onClick={handleLogout} 
                        className="btn btn-outline-secondary btn-sm"
                        style={{ padding: '4px 12px' }}
                      >
                        Salir
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li><NavLink className={linkClass} to="/login">Ingresar</NavLink></li>
                    <li><NavLink className={linkClass} to="/registro">Registro</NavLink></li>
                  </>
                )}
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
