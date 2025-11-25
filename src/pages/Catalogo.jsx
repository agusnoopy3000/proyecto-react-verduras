import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ProductList from "../components/ProductList";

export default function Catalogo() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <main className="container" style={{ padding: '40px 20px' }}>
        <section>
          {/* Header del catálogo */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: 40,
            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
            padding: '40px 20px',
            borderRadius: 16,
            color: '#fff'
          }}>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 700, 
              marginBottom: 12 
            }}>
              🛒 Nuestro Catálogo
            </h1>
            <p style={{ 
              fontSize: 18, 
              opacity: 0.9,
              maxWidth: 600,
              margin: '0 auto'
            }}>
              Productos frescos y orgánicos directamente del campo a tu hogar
            </p>
          </div>
          
          <ProductList />
        </section>
      </main>
    </>
  );
}
