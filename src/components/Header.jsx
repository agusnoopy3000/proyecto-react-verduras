import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="site">
      <div className="container nav">
        <div className="brand">
          <img src="/assets/img/huerto_hogar.jpeg" alt="Logo" style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 8, marginRight: 8 }} />
          <Link to="/">HuertoHogar</Link>
        </div>
        <nav className="navbar navbar-expand-lg">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link className="nav-link" to="/">Inicio</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/catalogo">Catálogo</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/carrito">Carrito</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/pedido">Pedido</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/nosotros">Nosotros</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/blog">Blog</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/contacto">Contacto</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/login">Ingresar</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/registro">Registro</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/perfil">Perfil</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
