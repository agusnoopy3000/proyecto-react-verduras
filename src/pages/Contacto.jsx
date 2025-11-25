import React, { useEffect, useState } from "react";

export default function Contacto() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [msj, setMsj] = useState("");
  const [conMsg, setConMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validateAndSend = (e) => {
    e.preventDefault();
    let msg = '';
    if (!nombre.trim()) msg = 'El nombre es requerido.';
    else if (nombre.length > 100) msg = 'El nombre no puede superar 100 caracteres.';
    else if (!email.trim()) msg = 'El email es requerido.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) msg = 'Email inválido.';
    else if (!msj.trim()) msg = 'El mensaje es requerido.';
    else if (msj.length > 500) msg = 'El mensaje no puede superar 500 caracteres.';

    setConMsg(msg);
    setSuccess(false);
    
    if (!msg) {
      setSuccess(true);
      setConMsg('¡Mensaje enviado correctamente! Te responderemos pronto.');
      setNombre('');
      setEmail('');
      setMsj('');
    }
  };

  const contactInfo = [
    { icon: '📍', title: 'Dirección', value: 'Av. Principal 1234, Santiago, Chile' },
    { icon: '📞', title: 'Teléfono', value: '+56 9 1234 5678' },
    { icon: '📧', title: 'Email', value: 'contacto@huertohogar.cl' },
    { icon: '🕐', title: 'Horario', value: 'Lun-Vie: 9:00 - 18:00' },
  ];

  return (
    <main className="container" style={{ padding: '40px 20px' }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: 40,
        background: 'linear-gradient(135deg, #00cec9 0%, #0984e3 100%)',
        padding: '50px 30px',
        borderRadius: 20,
        color: '#fff'
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: 12 }}>
          📬 Contáctanos
        </h1>
        <p style={{ fontSize: 18, opacity: 0.95, maxWidth: 600, margin: '0 auto' }}>
          ¿Tienes alguna pregunta? Estamos aquí para ayudarte
        </p>
      </div>

      <div className="row">
        {/* Formulario */}
        <div className="col-lg-7 mb-4">
          <div className="card" style={{ 
            border: 'none', 
            borderRadius: 16, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            padding: 32
          }}>
            <h3 style={{ color: '#2d3436', marginBottom: 24 }}>
              ✉️ Envíanos un mensaje
            </h3>
            <form onSubmit={validateAndSend}>
              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: 600, color: '#2d3436' }}>
                  Nombre
                </label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre completo"
                  style={{ 
                    padding: '12px 16px', 
                    borderRadius: 10, 
                    border: '2px solid #e9ecef',
                    fontSize: 15
                  }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: 600, color: '#2d3436' }}>
                  Email
                </label>
                <input 
                  type="email" 
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  style={{ 
                    padding: '12px 16px', 
                    borderRadius: 10, 
                    border: '2px solid #e9ecef',
                    fontSize: 15
                  }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: 600, color: '#2d3436' }}>
                  Mensaje
                </label>
                <textarea 
                  className="form-control"
                  value={msj}
                  onChange={(e) => setMsj(e.target.value)}
                  placeholder="¿En qué podemos ayudarte?"
                  rows={5}
                  style={{ 
                    padding: '12px 16px', 
                    borderRadius: 10, 
                    border: '2px solid #e9ecef',
                    fontSize: 15,
                    resize: 'none'
                  }}
                ></textarea>
                <small style={{ color: '#999' }}>{msj.length}/500 caracteres</small>
              </div>
              
              {conMsg && (
                <div 
                  className={`alert ${success ? 'alert-success' : 'alert-danger'}`} 
                  style={{ 
                    marginBottom: 16, 
                    borderRadius: 10,
                    padding: '14px 20px'
                  }}
                >
                  {success ? '✅ ' : '⚠️ '}{conMsg}
                </div>
              )}
              
              <button 
                type="submit" 
                className="btn btn-primary w-100"
                style={{ 
                  padding: '14px', 
                  borderRadius: 10,
                  fontSize: 16,
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #0984e3, #00cec9)',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(9, 132, 227, 0.3)'
                }}
              >
                Enviar Mensaje 📤
              </button>
            </form>
          </div>
        </div>

        {/* Información de contacto */}
        <div className="col-lg-5">
          <div className="card" style={{ 
            border: 'none', 
            borderRadius: 16, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            padding: 32,
            marginBottom: 20
          }}>
            <h3 style={{ color: '#2d3436', marginBottom: 24 }}>
              📍 Información de Contacto
            </h3>
            
            {contactInfo.map((item, i) => (
              <div 
                key={i} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 16,
                  padding: '16px 0',
                  borderBottom: i < contactInfo.length - 1 ? '1px solid #f0f0f0' : 'none'
                }}
              >
                <div style={{ 
                  width: 48, 
                  height: 48, 
                  background: '#f0f9ff', 
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  flexShrink: 0
                }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ color: '#999', fontSize: 13 }}>{item.title}</div>
                  <div style={{ color: '#2d3436', fontWeight: 600 }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Redes sociales */}
          <div className="card" style={{ 
            border: 'none', 
            borderRadius: 16, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            padding: 24,
            textAlign: 'center'
          }}>
            <h5 style={{ color: '#2d3436', marginBottom: 16 }}>Síguenos</h5>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              {['📘', '📸', '🐦', '📺'].map((icon, i) => (
                <div 
                  key={i}
                  style={{ 
                    width: 48, 
                    height: 48, 
                    background: '#f8f9fa', 
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
