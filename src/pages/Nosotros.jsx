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
        <section>
          <h2>Sobre Nosotros</h2>
          <p>HuertoHogar es una tienda dedicada a productos frescos y orgánicos, conectando a los consumidores con agricultores locales.</p>
          <p>Nuestra misión es promover una alimentación saludable y sostenible.</p>
        </section>
      </main>
    </>
  );
}
