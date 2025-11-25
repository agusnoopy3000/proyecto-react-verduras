import React, { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const res = await login(form.email, form.password);
    setLoading(false);
    
    if (res.ok) {
      setLoggedUser(res.user);
      setShowSuccessModal(true);
    } else {
      setError(res.message || 'Credenciales inválidas');
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    if (loggedUser?.role === 'ADMIN') {
      navigate('/admin');
    } else {
      navigate('/catalogo');
    }
  };

  const styles = {
    container: {
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
    },
    card: {
      width: '100%',
      maxWidth: 440,
      background: '#fff',
      borderRadius: 24,
      boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    },
    header: {
      background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
      padding: '40px 32px 30px',
      textAlign: 'center',
      color: '#fff'
    },
    iconCircle: {
      width: 80,
      height: 80,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
      fontSize: 36
    },
    title: {
      fontSize: 28,
      fontWeight: 700,
      marginBottom: 8
    },
    subtitle: {
      opacity: 0.9,
      fontSize: 15
    },
    formBody: {
      padding: '32px'
    },
    inputGroup: {
      marginBottom: 20
    },
    label: {
      display: 'block',
      marginBottom: 8,
      fontWeight: 600,
      color: '#2d3436',
      fontSize: 14
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      fontSize: 15,
      border: '2px solid #e9ecef',
      borderRadius: 12,
      transition: 'border-color 0.2s, box-shadow 0.2s',
      outline: 'none'
    },
    inputIcon: {
      position: 'absolute',
      left: 16,
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#adb5bd',
      fontSize: 18
    },
    inputWithIcon: {
      width: '100%',
      padding: '14px 16px 14px 48px',
      fontSize: 15,
      border: '2px solid #e9ecef',
      borderRadius: 12,
      transition: 'border-color 0.2s, box-shadow 0.2s',
      outline: 'none'
    },
    passwordToggle: {
      position: 'absolute',
      right: 16,
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: '#adb5bd',
      cursor: 'pointer',
      fontSize: 18,
      padding: 0
    },
    submitBtn: {
      width: '100%',
      padding: '16px',
      fontSize: 16,
      fontWeight: 600,
      color: '#fff',
      background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
      border: 'none',
      borderRadius: 12,
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
    },
    error: {
      background: '#fff5f5',
      border: '1px solid #fed7d7',
      color: '#c53030',
      padding: '12px 16px',
      borderRadius: 10,
      marginBottom: 20,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontSize: 14
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      margin: '24px 0',
      color: '#adb5bd',
      fontSize: 13
    },
    dividerLine: {
      flex: 1,
      height: 1,
      background: '#e9ecef'
    },
    footer: {
      textAlign: 'center',
      paddingTop: 8
    },
    link: {
      color: '#28a745',
      textDecoration: 'none',
      fontWeight: 600
    }
  };

  return (
    <>
      <main style={styles.container}>
        <div style={styles.card}>
          {/* Header con gradiente */}
          <div style={styles.header}>
            <div style={styles.iconCircle}>🌱</div>
            <h1 style={styles.title}>¡Bienvenido!</h1>
            <p style={styles.subtitle}>Inicia sesión en HuertoHogar</p>
          </div>

          {/* Formulario */}
          <div style={styles.formBody}>
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>Correo Electrónico</label>
                <div style={{ position: 'relative' }}>
                  <span style={styles.inputIcon}>📧</span>
                  <input 
                    type="email" 
                    name="email" 
                    value={form.email} 
                    onChange={handleChange} 
                    placeholder="tu@email.com"
                    required 
                    style={styles.inputWithIcon}
                    onFocus={(e) => e.target.style.borderColor = '#28a745'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>Contraseña</label>
                <div style={{ position: 'relative' }}>
                  <span style={styles.inputIcon}>🔒</span>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    name="password" 
                    value={form.password} 
                    onChange={handleChange} 
                    placeholder="••••••••"
                    required 
                    style={{ ...styles.inputWithIcon, paddingRight: 48 }}
                    onFocus={(e) => e.target.style.borderColor = '#28a745'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                  />
                  <button 
                    type="button"
                    style={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={styles.error}>
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Botón submit */}
              <button 
                type="submit" 
                disabled={loading}
                style={{
                  ...styles.submitBtn,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(40, 167, 69, 0.4)';
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(40, 167, 69, 0.3)';
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                    Ingresando...
                  </span>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>

              {/* Divider */}
              <div style={styles.divider}>
                <div style={styles.dividerLine}></div>
                <span>¿Nuevo en HuertoHogar?</span>
                <div style={styles.dividerLine}></div>
              </div>

              {/* Link a registro */}
              <div style={styles.footer}>
                <Link 
                  to="/registro" 
                  style={{
                    display: 'inline-block',
                    width: '100%',
                    padding: '14px',
                    fontSize: 15,
                    fontWeight: 600,
                    color: '#28a745',
                    background: '#f0fff4',
                    border: '2px solid #28a745',
                    borderRadius: 12,
                    textDecoration: 'none',
                    textAlign: 'center',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#e6ffed'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#f0fff4'}
                >
                  Crear una Cuenta
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Modal de login exitoso */}
      <Modal open={showSuccessModal} title="" onClose={handleSuccessClose}>
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ 
            width: 100, 
            height: 100, 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #28a745, #20c997)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 10px 30px rgba(40, 167, 69, 0.3)',
            animation: 'pulse 2s infinite'
          }}>
            <span style={{ fontSize: 50, color: '#fff' }}>👋</span>
          </div>
          
          <h2 style={{ color: '#2d3436', marginBottom: 8, fontSize: 28 }}>
            ¡Hola, {loggedUser?.nombre || 'Usuario'}!
          </h2>
          
          <p style={{ color: '#636e72', marginBottom: 20, fontSize: 16 }}>
            Has iniciado sesión correctamente
          </p>
          
          <div style={{ 
            background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)', 
            padding: '16px 20px', 
            borderRadius: 12, 
            marginBottom: 24
          }}>
            <div style={{ color: '#636e72', fontSize: 13, marginBottom: 4 }}>Conectado como</div>
            <div style={{ color: '#2d3436', fontWeight: 600 }}>{loggedUser?.email}</div>
          </div>
          
          <p style={{ color: '#999', fontSize: 14, marginBottom: 24 }}>
            {loggedUser?.role === 'ADMIN' 
              ? '🛡️ Acceso de Administrador' 
              : '🌱 Cliente HuertoHogar'}
          </p>
          
          <button 
            onClick={handleSuccessClose}
            style={{ 
              width: '100%',
              padding: '16px 32px', 
              fontSize: 16,
              fontWeight: 600,
              color: '#fff',
              background: 'linear-gradient(135deg, #28a745, #20c997)',
              border: 'none',
              borderRadius: 12,
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
            }}
          >
            {loggedUser?.role === 'ADMIN' ? '🛡️ Ir al Panel Admin' : '🛒 Explorar Catálogo'}
          </button>
        </div>
      </Modal>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </>
  );
}
