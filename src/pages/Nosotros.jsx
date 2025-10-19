import React, { useEffect } from "react";

export default function Nosotros() {
  useEffect(() => {
    const cur = 'nosotros';
    document.querySelectorAll('nav a').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href.includes(cur)) a.classList.add('active');
    });
  }, []);

  return (
    <>
      <main className="container">
        <section className="card shadow-sm p-3">
          <h2>Nuestras tiendas</h2>
          <p className="help">Cobertura: Santiago, Puerto Montt, Villarrica, Nacimiento, Viña del Mar, Valparaíso, Concepción.</p>
          <div className="grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
            <div id="mapa" className="card shadow-sm p-3" style={{minHeight:260,padding:0}}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.567282974839!2d-70.6482696848006!3d-33.4378309807777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c5a0e3b7b7b1%3A0x7b8b8b8b8b8b8b8b!2sSantiago%2C%20Regi%C3%B3n%20Metropolitana%2C%20Chile!5e0!3m2!1ses-419!2scl!4v1630000000000!5m2!1ses-419!2scl"
                width="100%"
                height={260}
                style={{border:0}}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div>
              <ul id="listaTiendas"></ul>
            </div>
          </div>
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
