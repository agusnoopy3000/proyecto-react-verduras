import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from "../context/CartContext";
import api from "../api/client";

export default function Confirmacion() {
  const loc = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const orderId = loc.state?.orderId;

    (async () => {
      if (orderId) {
        try {
          // Intentar cargar el pedido desde el backend
          const { data } = await api.get(`/v1/orders/${orderId}`);
          setOrder(data);
          clearCart();
        } catch (err) {
          console.error('Error cargando pedido:', err);
          // Si falla, mostrar info básica con el ID
          setOrder({
            id: orderId,
            created: new Date().toISOString(),
            items: []
          });
        }
      } else {
        setOrder(null);
      }
      setLoading(false);
    })();
  }, [loc.state, clearCart]);

  if (loading) {
    return (
      <main className="container">
        <h2>Confirmación</h2>
        <p>Cargando información del pedido...</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="container">
        <h2>Confirmación</h2>
        <p>No se encontró información del pedido.</p>
        <div style={{display:'flex',gap:8,marginTop:12}}>
          <button className="btn ghost" onClick={() => navigate("/catalogo")}>Volver al catálogo</button>
          <button className="btn" onClick={() => navigate("/")}>Ir al inicio</button>
        </div>
      </main>
    );
  }

  // El backend devuelve 'total' calculado, o calculamos desde items
  const total = order.total || (order.items || []).reduce((s, it) => {
    const precio = Number(it.precioUnitario || it.precio) || 0;
    const cantidad = Number(it.cantidad || it.qty) || 1;
    return s + (precio * cantidad);
  }, 0);
  
  const formatCLP = (v) => {
    try {
      return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Math.round(Number(v) || 0));
    } catch { return v; }
  };

  return (
    <main className="container" style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:20,alignItems:'start'}}>
      <div>
        <h2>Pedido confirmado</h2>
        <p>Gracias, tu pedido <strong>{order.id}</strong> ha sido registrado.</p>

        <section style={{marginTop:12}}>
          <h4>Datos de entrega</h4>
          <p><strong>Dirección:</strong> {order.direccionEntrega || order.customer?.direccion || '—'}</p>
          {(order.region || order.customer?.region) && <p><strong>Región:</strong> {order.region || order.customer?.region}</p>}
          {(order.comuna || order.customer?.comuna) && <p><strong>Comuna:</strong> {order.comuna || order.customer?.comuna}</p>}
          {order.fechaEntrega && <p><strong>Fecha preferida:</strong> {order.fechaEntrega}</p>}
          {order.comentarios && <p><strong>Comentarios:</strong> {order.comentarios}</p>}
          {(order.estado || order.status) && <p><strong>Estado:</strong> {order.estado || order.status}</p>}
        </section>

        <section style={{marginTop:12}}>
          <h4>Resumen</h4>
          <table className="table">
            <thead><tr><th>Producto</th><th>Cant.</th><th>Precio</th></tr></thead>
            <tbody>
              {(order.items || []).map((it, i) => (
                <tr key={it.codigo || it.productoId || it.id || i}>
                  <td>{it.nombre || it.productoId || it.codigo || it.id}</td>
                  <td>{it.cantidad || it.qty || 1}</td>
                  <td>{formatCLP((it.precioUnitario || it.precio || 0) * (it.cantidad || it.qty || 1))}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2"><strong>Total</strong></td>
                <td><strong>{formatCLP(total)}</strong></td>
              </tr>
            </tfoot>
          </table>
        </section>

        <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:12}}>
          <button className="btn ghost" onClick={() => navigate("/catalogo")}>Volver al catálogo</button>
          <button className="btn" onClick={() => navigate("/")}>Ir al inicio</button>
        </div>
      </div>

      {/* Ticket animado */}
      <aside style={{alignSelf:'start'}}>
        <style>{`
          .ticket {
            width: 280px;
            background: linear-gradient(135deg,#fffef0,#f7ffec);
            border-radius:12px;
            padding:16px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.08);
            position:relative;
            overflow:hidden;
            transform-origin:center;
            animation: floatTicket 1600ms ease-in-out infinite;
          }
          .ticket:before, .ticket:after {
            content: "";
            position: absolute;
            width: 36px;
            height: 36px;
            background: #fff;
            border-radius: 50%;
            right: -18px;
            top: 24px;
            box-shadow: inset 0 0 0 6px #f7fff0;
          }
          .ticket:after { top:auto; bottom:24px; }
          @keyframes floatTicket {
            0% { transform: translateY(0) rotate(-1deg); }
            50% { transform: translateY(-6px) rotate(1deg); }
            100% { transform: translateY(0) rotate(-1deg); }
          }
          .ticket h3 { margin:0 0 8px 0; font-size:18px; }
          .ticket .id { color:#666; font-size:13px; margin-bottom:12px; }
          .ticket .lines { display:flex; flex-direction:column; gap:8px; }
          .ticket .line { display:flex; justify-content:space-between; font-weight:600; }
          .ticket .total { margin-top:12px; font-size:16px; text-align:right; }
        `}</style>

        <div className="ticket" role="img" aria-label="Ticket de confirmación">
          <h3>Recibo</h3>
          <div className="id">Pedido #{order.id}</div>
          <div style={{height:8}} />
          <div className="lines">
            {(order.items || []).slice(0,5).map((it, i) => (
              <div className="line" key={i}>
                <span style={{fontWeight:500,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:160}}>{it.nombre || it.productoId || it.codigo}</span>
                <span style={{color:'#444'}}>{it.qty || it.cantidad || 1}</span>
              </div>
            ))}
          </div>
          <div className="total"><strong>{formatCLP(total)}</strong></div>
        </div>
      </aside>
    </main>
  );
}
