import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Perfil() {
  const { user, logout, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (isAuthenticated) {
      // Cargar perfil
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
      
      // Cargar pedidos del usuario
      (async () => {
        try {
          const { data } = await api.get('/v1/orders/my-orders');
          setPedidos(Array.isArray(data) ? data : []);
        } catch (e) {
          console.error('Error cargando pedidos', e);
          // Si falla, intentar con /v1/orders y filtrar por usuario
          try {
            const { data } = await api.get('/v1/orders');
            const myOrders = Array.isArray(data) ? data : [];
            setPedidos(myOrders);
          } catch (e2) {
            console.error('Error cargando pedidos (fallback)', e2);
            setPedidos([]);
          }
        } finally {
          setLoadingPedidos(false);
        }
      })();
    } else {
      setLoading(false);
      setLoadingPedidos(false);
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
    },
    orderCard: {
      background: '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      cursor: 'pointer',
      transition: 'all 0.2s',
      border: '1px solid #eee'
    },
    orderHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8
    },
    orderId: {
      fontWeight: 700,
      color: '#28a745',
      fontSize: 15
    },
    orderDate: {
      fontSize: 13,
      color: '#888'
    },
    orderStatus: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600
    },
    orderTotal: {
      fontSize: 18,
      fontWeight: 700,
      color: '#2d3436'
    },
    orderDetails: {
      marginTop: 12,
      paddingTop: 12,
      borderTop: '1px dashed #eee'
    },
    orderItem: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '6px 0',
      fontSize: 14,
      color: '#555'
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

      {/* Historial de Pedidos */}
      <div style={{ marginTop: 30 }}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={{ ...styles.cardIcon, background: '#f3e5f5', color: '#9c27b0' }}>
              📦
            </div>
            <h5 style={{ margin: 0, fontWeight: 600 }}>Historial de Pedidos</h5>
            {pedidos.length > 0 && (
              <span style={{ 
                marginLeft: 'auto', 
                background: '#28a745', 
                color: '#fff', 
                padding: '2px 10px', 
                borderRadius: 12, 
                fontSize: 13 
              }}>
                {pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div style={styles.cardBody}>
            {loadingPedidos ? (
              <div style={{ textAlign: 'center', padding: 20 }}>
                <div className="spinner-border spinner-border-sm text-success" role="status"></div>
                <p style={{ marginTop: 8, color: '#888', fontSize: 14 }}>Cargando pedidos...</p>
              </div>
            ) : pedidos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 30 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
                <p style={{ color: '#888', marginBottom: 16 }}>Aún no has realizado ningún pedido</p>
                <Link to="/catalogo" className="btn btn-success btn-sm">
                  Explorar Catálogo
                </Link>
              </div>
            ) : (
              <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                {pedidos.slice().reverse().map((pedido) => {
                  const statusColors = {
                    'PENDIENTE': { bg: '#fff3cd', color: '#856404' },
                    'CONFIRMADO': { bg: '#cce5ff', color: '#004085' },
                    'EN_PREPARACION': { bg: '#d4edda', color: '#155724' },
                    'ENVIADO': { bg: '#d1ecf1', color: '#0c5460' },
                    'ENTREGADO': { bg: '#d4edda', color: '#155724' },
                    'CANCELADO': { bg: '#f8d7da', color: '#721c24' }
                  };
                  const statusLabels = {
                    'PENDIENTE': '⏳ Pendiente',
                    'CONFIRMADO': '✓ Confirmado',
                    'EN_PREPARACION': '👨‍🍳 En Preparación',
                    'ENVIADO': '🚚 Enviado',
                    'ENTREGADO': '✅ Entregado',
                    'CANCELADO': '❌ Cancelado'
                  };
                  const estado = pedido.estado || pedido.status || 'PENDIENTE';
                  const statusStyle = statusColors[estado] || statusColors['PENDIENTE'];
                  const isExpanded = expandedOrder === pedido.id;
                  
                  const formatCLP = (v) => new Intl.NumberFormat('es-CL', { 
                    style: 'currency', currency: 'CLP', maximumFractionDigits: 0 
                  }).format(v || 0);
                  
                  const formatDate = (dateStr) => {
                    if (!dateStr) return '—';
                    try {
                      return new Date(dateStr).toLocaleDateString('es-CL', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      });
                    } catch { return dateStr; }
                  };

                  return (
                    <div 
                      key={pedido.id} 
                      style={{
                        ...styles.orderCard,
                        borderLeft: `4px solid ${statusStyle.color}`,
                        ...(isExpanded ? { boxShadow: '0 4px 15px rgba(0,0,0,0.1)' } : {})
                      }}
                      onClick={() => setExpandedOrder(isExpanded ? null : pedido.id)}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                    >
                      <div style={styles.orderHeader}>
                        <div>
                          <span style={styles.orderId}>Pedido #{pedido.id}</span>
                          <div style={styles.orderDate}>
                            📅 {formatDate(pedido.fechaCreacion || pedido.createdAt || pedido.fecha)}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ 
                            ...styles.orderStatus, 
                            background: statusStyle.bg, 
                            color: statusStyle.color 
                          }}>
                            {statusLabels[estado] || estado}
                          </span>
                          <div style={{ ...styles.orderTotal, marginTop: 4 }}>
                            {formatCLP(pedido.total || pedido.totalAmount)}
                          </div>
                        </div>
                      </div>
                      
                      {/* Información de entrega */}
                      <div style={{ fontSize: 13, color: '#666' }}>
                        📍 {pedido.direccionEntrega || pedido.direccion || '—'}
                        {pedido.comuna && `, ${pedido.comuna}`}
                      </div>

                      {/* Detalles expandibles */}
                      {isExpanded && (
                        <div style={styles.orderDetails}>
                          <div style={{ fontWeight: 600, marginBottom: 8, color: '#333' }}>
                            Productos:
                          </div>
                          {(pedido.items || pedido.productos || []).map((item, idx) => (
                            <div key={idx} style={styles.orderItem}>
                              <span>
                                {item.nombre || item.productoNombre || item.producto?.nombre || `Producto ${item.productoId}`}
                                {' '}
                                <span style={{ color: '#999' }}>x{item.cantidad || item.qty || 1}</span>
                              </span>
                              <span style={{ fontWeight: 600 }}>
                                {formatCLP((item.precioUnitario || item.precio || 0) * (item.cantidad || item.qty || 1))}
                              </span>
                            </div>
                          ))}
                          {pedido.comentarios && (
                            <div style={{ marginTop: 10, padding: 10, background: '#f8f9fa', borderRadius: 8, fontSize: 13 }}>
                              💬 <em>{pedido.comentarios}</em>
                            </div>
                          )}
                          {pedido.fechaEntrega && (
                            <div style={{ marginTop: 8, fontSize: 13, color: '#28a745' }}>
                              🚚 Entrega programada: {formatDate(pedido.fechaEntrega)}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div style={{ textAlign: 'center', marginTop: 8, fontSize: 12, color: '#aaa' }}>
                        {isExpanded ? '▲ Click para cerrar' : '▼ Click para ver detalles'}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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