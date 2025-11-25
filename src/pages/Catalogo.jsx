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
    </>
  );
}
