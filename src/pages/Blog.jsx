import React, { useEffect } from "react";

export default function Blog() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const articles = [
    {
      title: 'Cómo elegir frutas de temporada',
      emoji: '🍎',
      color: '#ff6b6b',
      content: 'Elegir frutas de temporada es clave para disfrutar de productos más frescos, sabrosos y económicos. Las frutas de temporada suelen estar en su punto óptimo de maduración, lo que significa mejor sabor y mayor valor nutricional.',
      link: 'https://www.odepa.gob.cl/precios/mejores-alimentos-de-temporada',
      linkText: 'Ver más sobre frutas de temporada'
    },
    {
      title: 'Beneficios de productos orgánicos',
      emoji: '🌿',
      color: '#00b894',
      content: 'Los productos orgánicos se cultivan sin pesticidas ni fertilizantes sintéticos, lo que los hace más saludables para ti y para el medio ambiente. Consumir orgánicos puede reducir la exposición a residuos químicos y aportar más antioxidantes.',
      link: 'https://www.tuasaude.com/es/que-son-los-alimentos-organicos/',
      linkText: 'Ver más sobre alimentos orgánicos'
    },
    {
      title: 'Recetas saludables con verduras',
      emoji: '🥗',
      color: '#0984e3',
      content: 'Incorporar más verduras a tu dieta nunca fue tan fácil. Descubre recetas deliciosas y nutritivas que puedes preparar en casa con ingredientes frescos de temporada. Desde ensaladas hasta guisos reconfortantes.',
      link: '#',
      linkText: 'Próximamente más recetas'
    },
    {
      title: 'Agricultura sostenible',
      emoji: '🌱',
      color: '#fdcb6e',
      content: 'La agricultura sostenible busca producir alimentos de manera que proteja el medio ambiente, mantenga la salud del suelo y apoye a las comunidades locales. Conoce cómo nuestros productores trabajan por un futuro más verde.',
      link: '#',
      linkText: 'Conoce a nuestros productores'
    }
  ];

  return (
    <main className="container" style={{ padding: '40px 20px' }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: 40,
        background: 'linear-gradient(135deg, #fd79a8 0%, #e84393 100%)',
        padding: '50px 30px',
        borderRadius: 20,
        color: '#fff'
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: 12 }}>
          📝 Nuestro Blog
        </h1>
        <p style={{ fontSize: 18, opacity: 0.95, maxWidth: 600, margin: '0 auto' }}>
          Consejos, recetas y todo sobre alimentación saludable y sostenible
        </p>
      </div>

      {/* Grid de artículos */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: 24 
      }}>
        {articles.map((article, i) => (
          <article 
            key={i} 
            className="card" 
            style={{ 
              border: 'none', 
              borderRadius: 16, 
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            }}
          >
            {/* Header del artículo */}
            <div style={{ 
              background: `linear-gradient(135deg, ${article.color}, ${article.color}dd)`, 
              padding: 24,
              textAlign: 'center'
            }}>
              <span style={{ fontSize: 48 }}>{article.emoji}</span>
            </div>
            
            {/* Contenido */}
            <div style={{ padding: 24 }}>
              <h3 style={{ 
                color: '#2d3436', 
                fontSize: 18, 
                fontWeight: 700,
                marginBottom: 12,
                lineHeight: 1.4
              }}>
                {article.title}
              </h3>
              <p style={{ 
                color: '#636e72', 
                fontSize: 14, 
                lineHeight: 1.7,
                marginBottom: 16
              }}>
                {article.content}
              </p>
              <a 
                href={article.link} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: article.color, 
                  fontWeight: 600, 
                  textDecoration: 'none',
                  fontSize: 14,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                {article.linkText} →
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Newsletter CTA */}
      <div style={{ 
        marginTop: 50,
        background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
        padding: '40px 30px',
        borderRadius: 20,
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#2d3436', marginBottom: 12 }}>
          📬 Suscríbete a nuestro newsletter
        </h3>
        <p style={{ color: '#636e72', marginBottom: 20 }}>
          Recibe consejos, recetas y ofertas exclusivas en tu correo.
        </p>
        <div style={{ 
          display: 'flex', 
          gap: 12, 
          justifyContent: 'center',
          flexWrap: 'wrap',
          maxWidth: 450,
          margin: '0 auto'
        }}>
          <input 
            type="email" 
            placeholder="tu@email.com" 
            className="form-control"
            style={{ 
              flex: 1, 
              minWidth: 200,
              borderRadius: 8,
              border: '2px solid #ddd'
            }}
          />
          <button 
            className="btn btn-success"
            style={{ 
              padding: '10px 24px', 
              borderRadius: 8,
              boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
            }}
          >
            Suscribirme
          </button>
        </div>
      </div>
    </main>
  );
}
