import React, { useEffect, useState, useRef } from "react";
import { useLocation, Link } from 'react-router-dom';
import { useCart } from "../context/CartContext";
import api from "../api/client";

export default function Confirmacion() {
  const loc = useLocation();
  const { clearCart } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const hasProcessed = useRef(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const orderId = loc.state?.orderId;

    (async () => {
      if (orderId) {
        try {
          const { data } = await api.get(`/v1/orders/${orderId}`);
          setOrder(data);
          clearCart();
        } catch (err) {
          console.error('Error cargando pedido:', err);
          setOrder({
            id: orderId,
            created: new Date().toISOString(),
            items: []
          });
          clearCart();
        }
      } else {
        setOrder(null);
      }
      setLoading(false);
    })();

    // Ocultar confetti después de 4 segundos
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, [loc.state, clearCart]);

  const total = order?.total || (order?.items || []).reduce((s, it) => {
    const precio = Number(it.precioUnitario || it.precio) || 0;
    const cantidad = Number(it.cantidad || it.qty) || 1;
    return s + (precio * cantidad);
  }, 0);
  
  const formatCLP = (v) => {
    try {
      return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Math.round(Number(v) || 0));
    } catch { return v; }
  };

  const styles = {
    container: { padding: '40px 20px', maxWidth: 900, margin: '0 auto', minHeight: '80vh' },
    successHeader: { 
      background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', 
      padding: '50px 30px', 
      borderRadius: 24, 
      color: '#fff', 
      textAlign: 'center',
      marginBottom: 30,
      position: 'relative',
      overflow: 'hidden'
    },
    checkCircle: {
      width: 80,
      height: 80,
      background: 'rgba(255,255,255,0.2)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px',
      fontSize: 40,
      animation: 'bounceIn 0.6s ease-out'
    },
    orderId: {
      display: 'inline-block',
      background: 'rgba(255,255,255,0.2)',
      padding: '8px 20px',
      borderRadius: 30,
      fontSize: 14,
      marginTop: 16,
      fontWeight: 500
    },
    grid: { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 340px', gap: 24, alignItems: 'start' },
    card: { background: '#fff', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden' },
    cardHeader: { background: '#f8f9fa', padding: '16px 24px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 10 },
    cardBody: { padding: 24 },
    infoRow: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0f0f0' },
    label: { color: '#636e72', fontSize: 14 },
    value: { fontWeight: 600, color: '#2d3436' },
    itemRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f0f0f0' },
    totalRow: { display: 'flex', justifyContent: 'space-between', padding: '20px 0', marginTop: 8, borderTop: '2px solid #28a745' },
    btnPrimary: { 
      flex: 1, 
      padding: '16px 24px', 
      fontSize: 16, 
      fontWeight: 600, 
      color: '#fff', 
      background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', 
      border: 'none', 
      borderRadius: 12, 
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)',
      transition: 'transform 0.2s'
    },
    btnSecondary: { 
      flex: 1,
      padding: '16px 24px', 
      fontSize: 16, 
      fontWeight: 600, 
      color: '#636e72', 
      background: '#f8f9fa', 
      border: '2px solid #e9ecef', 
      borderRadius: 12, 
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8
    },
    stepItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0' },
    stepNumber: { 
      width: 28, 
      height: 28, 
      borderRadius: '50%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontSize: 12, 
      fontWeight: 600 
    },
    confetti: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      overflow: 'hidden'
    }
  };

  // Generar confetti
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    color: ['#28a745', '#20c997', '#ffc107', '#ff6b6b', '#4ecdc4', '#45b7d1'][Math.floor(Math.random() * 6)]
  }));

  if (loading) {
    return (
      <main style={styles.container}>
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 20, animation: 'spin 1s linear infinite' }}>🌿</div>
          <h2 style={{ color: '#2d3436', marginBottom: 8 }}>Cargando tu pedido...</h2>
          <p style={{ color: '#636e72' }}>Un momento por favor</p>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </main>
    );
  }

  if (!order) {
    return (
      <main style={styles.container}>
        <div style={{ maxWidth: 500, margin: '60px auto', textAlign: 'center', background: '#fff', padding: 40, borderRadius: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>📦</div>
          <h2 style={{ color: '#2d3436', marginBottom: 16 }}>No hay información del pedido</h2>
          <p style={{ color: '#636e72', marginBottom: 24 }}>No encontramos datos de un pedido reciente.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/catalogo" style={styles.btnSecondary}>Ver Catálogo</Link>
            <Link to="/" style={styles.btnPrimary}>Ir al Inicio</Link>
          </div>
        </div>
      </main>
    );
  }

  const status = order.estado || order.status || 'PENDIENTE';
  const steps = [
    { num: 1, text: 'Pedido recibido', done: true },
    { num: 2, text: 'En preparación', done: ['EN_PREPARACION', 'ENVIADO', 'ENTREGADO'].includes(status) },
    { num: 3, text: 'Enviado', done: ['ENVIADO', 'ENTREGADO'].includes(status) },
    { num: 4, text: 'Entregado', done: status === 'ENTREGADO' },
  ];

  return (
    <main style={styles.container}>
      <style>{`
        @keyframes bounceIn {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fall {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(400px) rotate(720deg); opacity: 0; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 2px;
          animation: fall linear forwards;
        }
        .card-animated {
          animation: fadeSlideUp 0.5s ease-out forwards;
        }
      `}</style>

      {/* Header con éxito */}
      <div style={styles.successHeader}>
        {showConfetti && (
          <div style={styles.confetti}>
            {confettiPieces.map(p => (
              <div
                key={p.id}
                className="confetti-piece"
                style={{
                  left: `${p.left}%`,
                  background: p.color,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${p.duration}s`
                }}
              />
            ))}
          </div>
        )}
        <div style={styles.checkCircle}>✓</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 8 }}>¡Pedido Confirmado!</h1>
        <p style={{ opacity: 0.9, marginBottom: 0, fontSize: 18 }}>Gracias por tu compra en HuertoHogar</p>
        <div style={styles.orderId}>🧾 Pedido #{order.id}</div>
      </div>

      <div style={styles.grid}>
        {/* Columna izquierda - Detalles */}
        <div>
          {/* Información de entrega */}
          <div style={{...styles.card, marginBottom: 20}} className="card-animated">
            <div style={styles.cardHeader}>
              <span style={{ fontSize: 20 }}>📍</span>
              <h3 style={{ margin: 0, fontWeight: 600 }}>Información de Entrega</h3>
            </div>
            <div style={styles.cardBody}>
              <div style={styles.infoRow}>
                <span style={styles.label}>Dirección</span>
                <span style={styles.value}>{order.direccionEntrega || order.customer?.direccion || '—'}</span>
              </div>
              {(order.region || order.customer?.region) && (
                <div style={styles.infoRow}>
                  <span style={styles.label}>Región</span>
                  <span style={styles.value}>{order.region || order.customer?.region}</span>
                </div>
              )}
              {(order.comuna || order.customer?.comuna) && (
                <div style={styles.infoRow}>
                  <span style={styles.label}>Comuna</span>
                  <span style={styles.value}>{order.comuna || order.customer?.comuna}</span>
                </div>
              )}
              {order.fechaEntrega && (
                <div style={styles.infoRow}>
                  <span style={styles.label}>Fecha de entrega</span>
                  <span style={styles.value}>📅 {order.fechaEntrega}</span>
                </div>
              )}
              {order.comentarios && (
                <div style={{...styles.infoRow, borderBottom: 'none', flexDirection: 'column', alignItems: 'flex-start', gap: 8}}>
                  <span style={styles.label}>Comentarios</span>
                  <span style={{...styles.value, fontWeight: 400, fontStyle: 'italic'}}>"{order.comentarios}"</span>
                </div>
              )}
            </div>
          </div>

          {/* Productos */}
          <div style={styles.card} className="card-animated" >
            <div style={styles.cardHeader}>
              <span style={{ fontSize: 20 }}>🛒</span>
              <h3 style={{ margin: 0, fontWeight: 600 }}>Productos ({(order.items || []).length})</h3>
            </div>
            <div style={styles.cardBody}>
              {(order.items || []).map((it, i) => (
                <div key={it.codigo || it.productoId || it.id || i} style={styles.itemRow}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ 
                      width: 44, 
                      height: 44, 
                      background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)', 
                      borderRadius: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20
                    }}>
                      🥬
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#2d3436' }}>{it.nombre || it.productoId || it.codigo}</div>
                      <div style={{ fontSize: 13, color: '#999' }}>Cantidad: {it.cantidad || it.qty || 1}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 600, color: '#28a745', fontSize: 15 }}>
                    {formatCLP((it.precioUnitario || it.precio || 0) * (it.cantidad || it.qty || 1))}
                  </div>
                </div>
              ))}
              
              <div style={styles.totalRow}>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#2d3436' }}>Total del Pedido</span>
                <span style={{ fontSize: 24, fontWeight: 700, color: '#28a745' }}>{formatCLP(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha - Estado y acciones */}
        <div>
          {/* Estado del pedido */}
          <div style={{...styles.card, marginBottom: 20}} className="card-animated">
            <div style={styles.cardHeader}>
              <span style={{ fontSize: 20 }}>📊</span>
              <h3 style={{ margin: 0, fontWeight: 600 }}>Estado del Pedido</h3>
            </div>
            <div style={styles.cardBody}>
              {steps.map((step, i) => (
                <div key={i} style={styles.stepItem}>
                  <div style={{
                    ...styles.stepNumber,
                    background: step.done ? '#28a745' : '#f8f9fa',
                    color: step.done ? '#fff' : '#adb5bd',
                    border: step.done ? 'none' : '2px solid #e9ecef'
                  }}>
                    {step.done ? '✓' : step.num}
                  </div>
                  <span style={{ 
                    color: step.done ? '#28a745' : '#adb5bd', 
                    fontWeight: step.done ? 600 : 400 
                  }}>
                    {step.text}
                  </span>
                </div>
              ))}
              
              <div style={{ 
                marginTop: 16, 
                padding: '12px 16px', 
                background: '#e8f5e9', 
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}>
                <span style={{ fontSize: 18 }}>📧</span>
                <span style={{ fontSize: 13, color: '#2e7d32' }}>
                  Te notificaremos por email cuando tu pedido esté en camino
                </span>
              </div>
            </div>
          </div>

          {/* Ticket animado */}
          <div style={{...styles.card, background: 'linear-gradient(135deg, #fffef0, #f7ffec)'}} className="card-animated">
            <style>{`
              @keyframes floatTicket {
                0% { transform: translateY(0) rotate(-0.5deg); }
                50% { transform: translateY(-4px) rotate(0.5deg); }
                100% { transform: translateY(0) rotate(-0.5deg); }
              }
              .ticket-inner {
                animation: floatTicket 3s ease-in-out infinite;
              }
            `}</style>
            <div className="ticket-inner" style={{ padding: 24 }}>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🧾</div>
                <div style={{ fontWeight: 700, fontSize: 18, color: '#2d3436' }}>Recibo</div>
                <div style={{ color: '#666', fontSize: 13 }}>#{order.id}</div>
              </div>
              
              <div style={{ borderTop: '2px dashed #ddd', borderBottom: '2px dashed #ddd', padding: '16px 0', margin: '16px 0' }}>
                {(order.items || []).slice(0, 4).map((it, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14 }}>
                    <span style={{ color: '#555', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {it.nombre || it.productoId || it.codigo}
                    </span>
                    <span style={{ color: '#888' }}>x{it.qty || it.cantidad || 1}</span>
                  </div>
                ))}
                {(order.items || []).length > 4 && (
                  <div style={{ fontSize: 12, color: '#999', textAlign: 'center', paddingTop: 8 }}>
                    +{(order.items || []).length - 4} más
                  </div>
                )}
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>Total</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#28a745' }}>{formatCLP(total)}</div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
            <Link 
              to="/catalogo" 
              style={styles.btnPrimary}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              🛒 Seguir Comprando
            </Link>
            <Link to="/" style={styles.btnSecondary}>
              🏠 Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
