import React, { useEffect } from "react";

export default function Blog() {
  useEffect(() => {
    const cur = 'blog';
    document.querySelectorAll('nav a').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href.includes(cur)) a.classList.add('active');
    });
  }, []);

  return (
    <>
      <style>{`
        h3.destacado {
          color: #198754;
          background: #e9fbe7;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: bold;
          box-shadow: 0 2px 8px #0001;
          margin-bottom: 12px;
          display: inline-block;
        }
      `}</style>

      <main className="container">
        <section className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
          <article className="card shadow-sm p-3">
            <h3 className="destacado">Cómo elegir frutas de temporada</h3>
            <p>Elegir frutas de temporada es clave para disfrutar de productos más frescos, sabrosos y económicos. Las frutas de temporada suelen estar en su punto óptimo de maduración, lo que significa mejor sabor y mayor valor nutricional. Además, al consumir productos locales y de temporada, apoyas a los agricultores de tu zona y reduces la huella de carbono. Antes de comprar, infórmate sobre cuáles son las frutas propias de cada estación y busca aquellas que luzcan firmes, con buen color y aroma natural. Evita las que tengan golpes o manchas oscuras.</p>
            <a href="https://www.odepa.gob.cl/precios/mejores-alimentos-de-temporada" target="_blank" rel="noopener noreferrer">Ver más sobre frutas de temporada</a>
          </article>

          <article className="card shadow-sm p-3">
            <h3 className="destacado">Beneficios de productos orgánicos</h3>
            <p>Los productos orgánicos se cultivan sin pesticidas ni fertilizantes sintéticos, lo que los hace más saludables para ti y para el medio ambiente. Consumir orgánicos puede reducir la exposición a residuos químicos y aportar más antioxidantes y nutrientes. Además, la agricultura orgánica promueve la biodiversidad, cuida los suelos y utiliza prácticas sostenibles. Al elegir productos orgánicos, contribuyes a una alimentación más natural y apoyas métodos de producción responsables con la naturaleza.</p>
            <a href="https://www.tuasaude.com/es/que-son-los-alimentos-organicos/" target="_blank" rel="noopener noreferrer">Ver mas sobre los beneficios de alimentos organicos</a>
          </article>
        </section>
      </main>
    </>
  );
}
