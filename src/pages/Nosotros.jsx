import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Nosotros() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const teamMembers = [
    { name: 'María González', role: 'Fundadora', emoji: '👩‍🌾', desc: 'Apasionada por la agricultura sostenible' },
    { name: 'Carlos Mendoza', role: 'Productor', emoji: '👨‍🌾', desc: 'Experto en cultivos orgánicos' },
    { name: 'Ana Rodríguez', role: 'Logística', emoji: '👩‍💼', desc: 'Asegura la frescura en cada entrega' },
  ];

  return (
    <>
      <main className="container" style={{ padding: '40px 20px' }}>
        {/* Hero Section */}
        <section style={{ 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #00b894 0%, #00a86b 100%)',
          padding: '60px 30px',
          borderRadius: 20,
          color: '#fff',
          marginBottom: 50
        }}>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 700, marginBottom: 16 }}>
            🌱 Sobre HuertoHogar
          </h1>
          <p style={{ fontSize: 20, opacity: 0.95, maxWidth: 700, margin: '0 auto' }}>
            Conectamos el campo con tu mesa, llevando productos frescos y orgánicos 
            directamente desde agricultores locales a tu hogar.
          </p>
        </section>

        {/* Misión y Visión */}
        <section style={{ marginBottom: 50 }}>
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card h-100" style={{ 
                border: 'none', 
                borderRadius: 16, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #74b9ff, #0984e3)', 
                  padding: 20, 
                  textAlign: 'center' 
                }}>
                  <span style={{ fontSize: 48 }}>🎯</span>
                </div>
                <div className="card-body" style={{ padding: 24 }}>
                  <h3 style={{ color: '#2d3436', marginBottom: 16 }}>Nuestra Misión</h3>
                  <p style={{ color: '#636e72', lineHeight: 1.7 }}>
                    Promover una alimentación saludable y sostenible, facilitando el acceso 
                    a productos frescos y orgánicos de alta calidad. Apoyamos a los 
                    agricultores locales mientras cuidamos el medio ambiente.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100" style={{ 
                border: 'none', 
                borderRadius: 16, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #a29bfe, #6c5ce7)', 
                  padding: 20, 
                  textAlign: 'center' 
                }}>
                  <span style={{ fontSize: 48 }}>🔭</span>
                </div>
                <div className="card-body" style={{ padding: 24 }}>
                  <h3 style={{ color: '#2d3436', marginBottom: 16 }}>Nuestra Visión</h3>
                  <p style={{ color: '#636e72', lineHeight: 1.7 }}>
                    Ser la plataforma líder en comercio de productos orgánicos en Chile, 
                    creando una comunidad comprometida con el consumo responsable y el 
                    apoyo a la agricultura local.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Valores */}
        <section style={{ 
          background: '#f8f9fa', 
          padding: '50px 30px', 
          borderRadius: 20, 
          marginBottom: 50 
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: 40, color: '#2d3436' }}>
            💚 Nuestros Valores
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: 24 
          }}>
            {[
              { icon: '🌿', title: 'Sostenibilidad', desc: 'Cuidamos el planeta' },
              { icon: '🤝', title: 'Confianza', desc: 'Relaciones duraderas' },
              { icon: '✨', title: 'Calidad', desc: 'Solo lo mejor' },
              { icon: '❤️', title: 'Compromiso', desc: 'Con nuestra comunidad' },
            ].map((v, i) => (
              <div key={i} style={{ 
                textAlign: 'center', 
                background: '#fff', 
                padding: 24, 
                borderRadius: 12,
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
              }}>
                <span style={{ fontSize: 40 }}>{v.icon}</span>
                <h4 style={{ color: '#2d3436', margin: '12px 0 8px' }}>{v.title}</h4>
                <p style={{ color: '#636e72', fontSize: 14, marginBottom: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Equipo */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ textAlign: 'center', marginBottom: 40, color: '#2d3436' }}>
            👥 Nuestro Equipo
          </h2>
          <div className="row justify-content-center">
            {teamMembers.map((member, i) => (
              <div key={i} className="col-md-4 mb-4">
                <div className="card text-center h-100" style={{ 
                  border: 'none', 
                  borderRadius: 16, 
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  padding: 30
                }}>
                  <div style={{ 
                    width: 100, 
                    height: 100, 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #28a745, #20c997)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    fontSize: 48
                  }}>
                    {member.emoji}
                  </div>
                  <h4 style={{ color: '#2d3436', marginBottom: 4 }}>{member.name}</h4>
                  <p style={{ color: '#28a745', fontWeight: 600, marginBottom: 8 }}>{member.role}</p>
                  <p style={{ color: '#636e72', fontSize: 14, marginBottom: 0 }}>{member.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ 
          textAlign: 'center', 
          background: 'linear-gradient(135deg, #2d3436, #636e72)',
          padding: '50px 30px',
          borderRadius: 20,
          color: '#fff'
        }}>
          <h3 style={{ marginBottom: 16 }}>¿Listo para probar productos frescos?</h3>
          <p style={{ opacity: 0.9, marginBottom: 24 }}>
            Explora nuestro catálogo y descubre la diferencia de lo orgánico.
          </p>
          <Link 
            to="/catalogo" 
            className="btn btn-success btn-lg"
            style={{ 
              padding: '14px 32px', 
              borderRadius: 8,
              boxShadow: '0 4px 15px rgba(40, 167, 69, 0.4)'
            }}
          >
            🛒 Ver Catálogo
          </Link>
        </section>
      </main>
    </>
  );
}
