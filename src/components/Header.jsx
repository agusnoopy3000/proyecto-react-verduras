export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
      <div className="container">
        <a className="navbar-brand" href="/">HuertoHogar 🌿</a>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><a className="nav-link" href="/catalogo">Catálogo</a></li>
            <li className="nav-item"><a className="nav-link" href="/ofertas">Ofertas</a></li>
            <li className="nav-item"><a className="nav-link" href="/checkout">Carrito</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
