import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  useEffect(() => {
    const cur = 'home';
    document.querySelectorAll('nav a').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href.includes(cur)) a.classList.add('active');
    });
  }, []);

  return (
    <>
      <main className="container">
        <section className="hero">
          <div>
            <h1>Del campo a tu hogar</h1>
            <p>Frutas y verduras orgánicas. Productos lácteos y alimentos saludables. Compra simple y rápida.</p>
            <div className="controls">
              <Link className="btn btn-success" to="/catalogo">Ver catálogo</Link>
              <Link className="btn btn-outline-success" to="/registro" style={{background: 'none'}}>Crear cuenta</Link>
            </div>
          </div>
          <div className="card shadow-sm p-3 mb-4" style={{maxWidth: '600px', margin: 'auto'}}>
            <video controls poster="assets/img/huerto_hogar.jpeg" style={{width: '100%', borderRadius: '8px'}}>
              <source src="assets/video/video.mp4" type="video/mp4" />
              
            </video>
            <p className="help text-center">Video demostrativo del funcionamiento de HuertoHogar y Productos orgánicos</p>
          </div>
        </section>

        <section className="category-descriptions mb-4" style={{background: '#f8f9fa', paddingTop: '1.5rem', paddingBottom: '0.5rem'}}>
          <div className="container">
            <h2 className="mb-3">Categorías y Descripciones</h2>
            <div className="mb-3">
              <h4>Frutas Frescas</h4>
              <p>Nuestra selección de frutas frescas ofrece una experiencia directa del campo a tu hogar. Estas frutas se cultivan y cosechan en el punto óptimo de madurez para asegurar su sabor y frescura. Disfruta de una variedad de frutas de temporada que aportan vitaminas y nutrientes esenciales a tu dieta diaria. Perfectas para consumir solas, en ensaladas o como ingrediente principal en postres y smoothies.</p>
            </div>
            <div className="mb-3">
              <h4>Verduras Orgánicas</h4>
              <p>Descubre nuestra gama de verduras orgánicas, cultivadas sin el uso de pesticidas ni químicos, garantizando un sabor auténtico y natural. Cada verdura es seleccionada por su calidad y valor nutricional, ofreciendo una excelente fuente de vitaminas, minerales y fibra. Ideales para ensaladas, guisos y platos saludables, nuestras verduras orgánicas promueven una alimentación consciente y sostenible.</p>
            </div>
            <div className="mb-3">
              <h4>Productos Orgánicos</h4>
              <p>Nuestros productos orgánicos están elaborados con ingredientes naturales y procesados de manera responsable para mantener sus beneficios saludables. Desde aceites y miel hasta granos y semillas, ofrecemos una selección que apoya un estilo de vida saludable y respetuoso con el medio ambiente. Estos productos son perfectos para quienes buscan opciones alimenticias que aporten bienestar sin comprometer el sabor ni la calidad.</p>
            </div>
            <div className="mb-3">
              <h4>Productos Lácteos</h4>
              <p>Los productos lácteos de HuertoHogar provienen de granjas locales que se dedican a la producción responsable y de calidad. Ofrecemos una gama de leches, yogures y otros derivados que conservan su frescura y sabor auténtico. Ricos en calcio y nutrientes esenciales, nuestros lácteos son perfectos para complementar una dieta equilibrada, proporcionando el mejor sabor y nutrición para toda la familia.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
