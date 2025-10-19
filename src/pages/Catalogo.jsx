import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ProductList from "../components/ProductList";

export default function Catalogo() {
  useEffect(() => {
    const cur = 'catalogo';
    document.querySelectorAll('nav a').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href.includes(cur)) a.classList.add('active');
    });
  }, []);

  return (
    <>
      <main className="container">
        <section>
          <h2>Catálogo</h2>
          <ProductList />
        </section>
      </main>

      <footer className="site">
        <div className="container inner">
          <div className="cols">
            <div>
              <strong>HuertoHogar</strong>
              <p>Productos frescos y orgánicos. Calidad local.</p>
            </div>
            <div>
              <p><strong>Tiendas</strong></p>
              <p>Santiago · Puerto Montt · Villarrica · Nacimiento</p>
              <p>Viña del Mar · Valparaíso · Concepción</p>
            </div>
            <div>
              <p><strong>Contacto</strong></p>
              <p>contacto@huertohogar.cl</p>
            </div>
          </div>
          <div>© 2025 HuertoHogar · Sitio educativo</div>
        </div>
      </footer>
    </>
  );
}
