import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Perfil() {
  const { user, logout, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (isAuthenticated) {
      (async () => {
        try {
          const { data } = await api.get('/v1/users/me');
          setProfile(data);
        } catch (e) {
          console.error('Error cargando perfil', e);
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    toast.success('Sesión Cerrada Exitosamente', { icon: '🚪' });
    navigate('/');
  };

  // Estilos inline para mejor visualización
  const styles = {
    profileHeader: {
      background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
      borderRadius: '16px',
      padding: '40px 30px',
      color: '#fff',
      textAlign: 'center',
      marginBottom: '30px',
      boxShadow: '0 10px 30px rgba(40, 167, 69, 0.3)'
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
      fontSize: 48,
      border: '4px solid rgba(255,255,255,0.4)'
    },
    userName: {
      fontSize: 28,
      fontWeight: 700,
      marginBottom: 4
    },
    userEmail: {
      opacity: 0.9,
      fontSize: 16
    },
    badge: {
      display: 'inline-block',
      background: 'rgba(255,255,255,0.25)',
      padding: '4px 16px',
      borderRadius: 20,
      fontSize: 13,
      marginTop: 12,
      fontWeight: 500
    },
    card: {
      border: 'none',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
      marginBottom: 20,
      transition: 'transform 0.2s, box-shadow 0.2s'
    },
    cardHeader: {
      background: '#f8f9fa',
      borderBottom: '1px solid #eee',
      padding: '16px 20px',
      borderRadius: '12px 12px 0 0',
      display: 'flex',
      alignItems: 'center',
      gap: 10
    },
    cardIcon: {
      width: 36,
      height: 36,
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 18
    },
    cardBody: {
      padding: '20px'
    },
    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '12px 0',
      borderBottom: '1px solid #f0f0f0'
    },
    infoLabel: {
      color: '#666',
      fontWeight: 500
    },
    infoValue: {
      color: '#333',
      fontWeight: 600
    },
    logoutBtn: {
      background: 'linear-gradient(135deg, #dc3545, #c82333)',
      border: 'none',
      padding: '12px 32px',
      fontSize: 16,
      borderRadius: 8,
      boxShadow: '0 4px 15px rgba(220, 53, 69, 0.3)',
      transition: 'transform 0.2s, box-shadow 0.2s'
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="container" style={{ padding: '60px 20px' }}>
        <div style={{ 
          maxWidth: 500, 
          margin: '0 auto', 
          textAlign: 'center',
          background: '#fff',
          borderRadius: 16,
          padding: 40,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: 60, marginBottom: 20 }}>🔒</div>
          <h2 style={{ color: '#333', marginBottom: 16 }}>Acceso Restringido</h2>
          <p style={{ color: '#666', marginBottom: 24 }}>
            Debes iniciar sesión para ver tu perfil.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/login" className="btn btn-primary" style={{ padding: '10px 24px' }}>
              Iniciar Sesión
            </Link>
            <Link to="/registro" className="btn btn-outline-primary" style={{ padding: '10px 24px' }}>
              Crear Cuenta
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p style={{ marginTop: 16, color: '#666' }}>Cargando perfil...</p>
      </main>
    );
  }

  const fullName = profile?.nombre 
    ? `${profile.nombre} ${profile.apellidos || profile.apellido || ''}`.trim()
    : user?.nombre || 'Usuario';

  return (
    <main className="container" style={{ padding: '40px 20px', maxWidth: 900 }}>
      {/* Header del perfil */}
      <div style={styles.profileHeader}>
        <div style={styles.avatar}>
          👤
        </div>
        <div style={styles.userName}>{fullName}</div>
        <div style={styles.userEmail}>{profile?.email || user?.email}</div>
        <div style={styles.badge}>
          {profile?.rol === 'ADMIN' || user?.role === 'ADMIN' ? '⭐ Administrador' : '🌱 Cliente HuertoHogar'}
        </div>
      </div>

      <div className="row">
        {/* Información Personal */}
        <div className="col-lg-6">
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={{ ...styles.cardIcon, background: '#e8f5e9', color: '#28a745' }}>
                👤
              </div>
              <h5 style={{ margin: 0, fontWeight: 600 }}>Información Personal</h5>
            </div>
            <div style={styles.cardBody}>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>RUN</span>
                <span style={styles.infoValue}>{profile?.run || '—'}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Nombre</span>
                <span style={styles.infoValue}>{profile?.nombre || '—'}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Apellidos</span>
                <span style={styles.infoValue}>{profile?.apellidos || profile?.apellido || '—'}</span>
              </div>
              <div style={{ ...styles.infoRow, borderBottom: 'none' }}>
                <span style={styles.infoLabel}>Email</span>
                <span style={styles.infoValue}>{profile?.email || user?.email || '—'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ubicación */}
        <div className="col-lg-6">
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={{ ...styles.cardIcon, background: '#e3f2fd', color: '#2196f3' }}>
                📍
              </div>
              <h5 style={{ margin: 0, fontWeight: 600 }}>Ubicación</h5>
            </div>
            <div style={styles.cardBody}>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Región</span>
                <span style={styles.infoValue}>{profile?.region || '—'}</span>
              </div>
              <div style={{ ...styles.infoRow, borderBottom: 'none' }}>
                <span style={styles.infoLabel}>Comuna</span>
                <span style={styles.infoValue}>{profile?.comuna || '—'}</span>
              </div>
            </div>
          </div>

          {/* Card de acciones rápidas */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={{ ...styles.cardIcon, background: '#fff3e0', color: '#ff9800' }}>
                ⚡
              </div>
              <h5 style={{ margin: 0, fontWeight: 600 }}>Acciones Rápidas</h5>
            </div>
            <div style={{ ...styles.cardBody, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/catalogo" className="btn btn-outline-success" style={{ flex: 1, minWidth: 120 }}>
                🛒 Ver Catálogo
              </Link>
              <Link to="/carrito" className="btn btn-outline-primary" style={{ flex: 1, minWidth: 120 }}>
                🛍️ Mi Carrito
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Botón de cerrar sesión */}
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <button 
          className="btn btn-danger" 
          onClick={handleLogout}
          style={styles.logoutBtn}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(220, 53, 69, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(220, 53, 69, 0.3)';
          }}
        >
          🚪 Cerrar Sesión
        </button>
      </div>
    </main>
  );
}