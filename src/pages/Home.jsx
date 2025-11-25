import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import videoSrc from "../assets/video/video.mp4";

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <main className="container" style={{ maxWidth: 1200, padding: '40px 20px' }}>
        {/* Hero Section */}
        <section style={{ marginBottom: 60 }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
            gap: 40, 
            alignItems: 'center' 
          }}>
            {/* Columna izquierda - Texto */}
            <div>
              <h1 style={{ 
                fontSize: '3rem', 
                fontWeight: 700, 
                color: '#2d3436',
                marginBottom: 20,
                lineHeight: 1.2
              }}>
                Del campo <span style={{ color: '#28a745' }}>a tu hogar</span>
              </h1>
              <p style={{ 
                fontSize: 18, 
                color: '#636e72', 
                marginBottom: 32,
                lineHeight: 1.7
              }}>
                Frutas y verduras orgánicas. Productos lácteos y alimentos saludables. 
                Compra simple, rápida y directa del productor.
              </p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <Link 
                  to="/catalogo"
                  style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '14px 32px', 
                    fontSize: 16, 
                    fontWeight: 600,
                    borderRadius: 10,
                    background: '#28a745',
                    color: '#fff',
                    textDecoration: 'none',
                    boxShadow: '0 4px 15px rgba(40, 167, 69, 0.4)',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                >
                  🛒 Ver Catálogo
                </Link>
                <Link 
                  to="/registro" 
                  style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '14px 32px', 
                    fontSize: 16,
                    fontWeight: 600, 
                    borderRadius: 10,
                    background: 'transparent',
                    color: '#28a745',
                    textDecoration: 'none',
                    border: '2px solid #28a745',
                    transition: 'background 0.2s, color 0.2s'
                  }}
                >
                  Crear Cuenta
                </Link>
              </div>
            </div>
            
            {/* Columna derecha - Video */}
            <div style={{ 
              background: '#fff',
              padding: 20, 
              borderRadius: 20, 
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }}>
              <video 
                controls 
                style={{ 
                  width: '100%', 
                  borderRadius: 12,
                  aspectRatio: '16/9',
                  objectFit: 'cover',
                  background: '#000'
                }}
              >
                <source src={videoSrc} type="video/mp4" />
                Tu navegador no soporta el elemento de video.
              </video>
              <p style={{ 
                textAlign: 'center', 
                color: '#666', 
                fontSize: 14, 
                marginTop: 16,
                marginBottom: 0
              }}>
                🎬 Video demostrativo de HuertoHogar
              </p>
            </div>
          </div>
        </section>

        <section className="category-descriptions" style={{ 
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', 
          padding: '50px 0',
          marginTop: 40,
          borderRadius: 20
        }}>
          <div className="container">
            <h2 style={{ 
              textAlign: 'center', 
              marginBottom: 40, 
              color: '#2d3436',
              fontSize: '2rem',
              fontWeight: 700
            }}>
              🌿 Nuestras Categorías
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: 24 
            }}>
              {/* Frutas Frescas */}
              <div className="card" style={{ 
                border: 'none', 
                borderRadius: 16, 
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s, box-shadow 0.3s'
              }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)', 
                  padding: 20,
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: 48 }}>🍎</span>
                </div>
                <div style={{ padding: 20 }}>
                  <h4 style={{ color: '#2d3436', marginBottom: 12 }}>Frutas Frescas</h4>
                  <p style={{ color: '#636e72', fontSize: 14, lineHeight: 1.6, marginBottom: 0 }}>
                    Frutas cultivadas y cosechadas en su punto óptimo de madurez. 
                    Vitaminas y nutrientes esenciales directamente del campo a tu mesa.
                  </p>
                </div>
              </div>

              {/* Verduras Orgánicas */}
              <div className="card" style={{ 
                border: 'none', 
                borderRadius: 16, 
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s, box-shadow 0.3s'
              }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #00b894, #00a86b)', 
                  padding: 20,
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: 48 }}>🥬</span>
                </div>
                <div style={{ padding: 20 }}>
                  <h4 style={{ color: '#2d3436', marginBottom: 12 }}>Verduras Orgánicas</h4>
                  <p style={{ color: '#636e72', fontSize: 14, lineHeight: 1.6, marginBottom: 0 }}>
                    Sin pesticidas ni químicos, con sabor auténtico y natural. 
                    Excelente fuente de vitaminas, minerales y fibra.
                  </p>
                </div>
              </div>

              {/* Productos Orgánicos */}
              <div className="card" style={{ 
                border: 'none', 
                borderRadius: 16, 
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s, box-shadow 0.3s'
              }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #fdcb6e, #f39c12)', 
                  padding: 20,
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: 48 }}>🍯</span>
                </div>
                <div style={{ padding: 20 }}>
                  <h4 style={{ color: '#2d3436', marginBottom: 12 }}>Productos Orgánicos</h4>
                  <p style={{ color: '#636e72', fontSize: 14, lineHeight: 1.6, marginBottom: 0 }}>
                    Aceites, miel, granos y semillas elaborados con ingredientes naturales. 
                    Bienestar sin comprometer el sabor.
                  </p>
                </div>
              </div>

              {/* Productos Lácteos */}
              <div className="card" style={{ 
                border: 'none', 
                borderRadius: 16, 
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s, box-shadow 0.3s'
              }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #74b9ff, #0984e3)', 
                  padding: 20,
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: 48 }}>🥛</span>
                </div>
                <div style={{ padding: 20 }}>
                  <h4 style={{ color: '#2d3436', marginBottom: 12 }}>Productos Lácteos</h4>
                  <p style={{ color: '#636e72', fontSize: 14, lineHeight: 1.6, marginBottom: 0 }}>
                    Leches, yogures y derivados de granjas locales responsables. 
                    Ricos en calcio y nutrientes para toda la familia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
