// filepath: /Users/agustingarridosnoopy/Downloads/proyecto-react-verduras-main/src/pages/Pedido.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import productosLocales from "../data/productos";
import regionesYComunas from "../data/regiones_comunas";
import api from '../api/client';

export default function Pedido() {
  const { cart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [fecha, setFecha] = useState("");
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [region, setRegion] = useState("");
  const [comuna, setComuna] = useState("");
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [productos, setProductos] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Cargar productos del backend al montar el componente
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/v1/products');
        const normalized = data.map(p => ({
          ...p,
          img: p.imagen || p.img || '/data/placeholder.png',
          precio: Number(p.precio) || 0,
        }));
        setProductos(normalized);
      } catch (err) {
        console.error('Error cargando productos, usando datos locales:', err);
        setProductos(productosLocales);
      } finally {
        setLoadingProducts(false);
      }
    })();
  }, []);

  useEffect(() => { window.scrollTo(0,0); }, []);

  useEffect(() => {
    if (user) {
      if (user.nombre) setNombre(user.nombre + (user.apellido ? ' ' + user.apellido : ''));
      if (user.email) setEmail(user.email);
    }
  }, [user]);

  const validar = () => {
    const e = {};
    if (!nombre.trim()) e.nombre = "Nombre requerido.";
    if (!direccion.trim()) e.direccion = "Dirección requerida.";
    if (!email.trim()) e.email = "Email requerido.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Email inválido.";
    if (!tel.trim()) e.tel = "Teléfono requerido.";
    if (!region) e.region = "Región requerida.";
    if (!comuna) e.comuna = "Comuna requerida.";
    if (!fecha) {
      e.fecha = "Fecha de entrega requerida.";
    } else {
      const selectedDate = new Date(fecha);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate <= today) {
        e.fecha = "La fecha debe ser a partir de mañana.";
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleConfirm = async (ev) => {
    ev?.preventDefault();
    if (!validar()) return;
    if (!cart || Object.keys(cart).length === 0) {
      setMsg("El carrito está vacío. Agrega productos antes de confirmar.");
      return;
    }
    
    const token = localStorage.getItem('hh_token');
    if (!token) {
      setMsg("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      return;
    }
    
    setLoading(true);
    setMsg("");
    
    try {
      const items = Object.entries(cart).map(([codigo, qty]) => ({
        productoId: codigo,
        cantidad: qty,
      }));
      if (items.length === 0) {
        setMsg("No se encontraron productos válidos en el carrito.");
        setLoading(false);
        return;
      }
      const payload = {
        direccionEntrega: direccion.trim(),
        region: region,
        comuna: comuna,
        comentarios: comentarios.trim() || "",
        fechaEntrega: fecha,
        items,
      };
      
      const { data } = await api.post('/v1/orders', payload);
      navigate("/confirmacion", { state: { orderId: data.id } });
    } catch (err) {
      console.error("Error confirmando pedido:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setMsg("Sesión expirada o no autorizada. Por favor, inicia sesión nuevamente.");
      } else if (err.response?.status === 400) {
        const backendMsg = err.response?.data?.message || err.response?.data?.error || 'Error en los datos del pedido.';
        setMsg(backendMsg);
      } else if (err.response?.data?.message) {
        setMsg(err.response.data.message);
      } else if (err.code === 'ERR_NETWORK' || err.message?.includes('Network')) {
        setMsg("Error de conexión. Verifica tu conexión a internet e intenta nuevamente.");
      } else {
        setMsg("Error al procesar tu pedido: " + (err.message || 'Intenta nuevamente.'));
      }
    } finally {
      setLoading(false);
    }
  };

  // Buscar producto por id (numérico del backend) o codigo (string local)
  const findProduct = (key) => {
    const numericId = Number(key);
    // Buscar por id numérico
    let prod = productos.find(p => p.id === numericId || p.id === key);
    // Si no se encuentra, buscar por codigo string
    if (!prod) {
      prod = productos.find(p => p.codigo === key || p.codigo === String(key));
    }
    return prod || { nombre: `Producto ${key}`, precio: 0 };
  };

  const cartItems = Object.entries(cart || {}).map(([key, qty]) => {
    const prod = findProduct(key);
    return { ...prod, codigo: key, qty };
  });
  const subtotal = cartItems.reduce((sum, item) => sum + (item.precio * item.qty), 0);
  const formatCLP = (v) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(v);

  const styles = {
    container: { padding: '40px 20px', maxWidth: 1100, margin: '0 auto' },
    header: { background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', padding: '40px 30px', borderRadius: 20, color: '#fff', marginBottom: 30, textAlign: 'center' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: 30, alignItems: 'start' },
    card: { background: '#fff', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden' },
    cardHeader: { background: '#f8f9fa', padding: '16px 24px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 10 },
    cardBody: { padding: 24 },
    inputGroup: { marginBottom: 20 },
    label: { display: 'block', fontWeight: 600, color: '#2d3436', marginBottom: 8, fontSize: 14 },
    input: { width: '100%', padding: '14px 16px', fontSize: 15, border: '2px solid #e9ecef', borderRadius: 10, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' },
    select: { width: '100%', padding: '14px 16px', fontSize: 15, border: '2px solid #e9ecef', borderRadius: 10, background: '#fff', cursor: 'pointer', outline: 'none', boxSizing: 'border-box' },
    error: { color: '#dc3545', fontSize: 13, marginTop: 6 },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
    summaryItem: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0f0f0' },
    totalRow: { display: 'flex', justifyContent: 'space-between', padding: '16px 0', marginTop: 8 },
    stepItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0' },
    stepNumber: { width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600 },
    btnPrimary: { flex: 1, padding: '16px', fontSize: 16, fontWeight: 600, color: '#fff', background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', border: 'none', borderRadius: 12, cursor: 'pointer', boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)', transition: 'transform 0.2s' },
    btnSecondary: { padding: '14px 24px', fontSize: 15, fontWeight: 600, color: '#636e72', background: '#f8f9fa', border: '2px solid #e9ecef', borderRadius: 10, cursor: 'pointer' }
  };

  if (!isAuthenticated) {
    return (
      <main style={styles.container}>
        <div style={{ maxWidth: 500, margin: '60px auto', textAlign: 'center', background: '#fff', padding: 40, borderRadius: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🔒</div>
          <h2 style={{ color: '#2d3436', marginBottom: 16 }}>Inicia sesión para continuar</h2>
          <p style={{ color: '#636e72', marginBottom: 24 }}>Necesitas una cuenta para realizar pedidos.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/login" style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #28a745, #20c997)', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 600 }}>Iniciar Sesión</Link>
            <Link to="/registro" style={{ padding: '14px 28px', background: 'transparent', color: '#28a745', borderRadius: 10, textDecoration: 'none', fontWeight: 600, border: '2px solid #28a745' }}>Crear Cuenta</Link>
          </div>
        </div>
      </main>
    );
  }

  if (!cart || Object.keys(cart).length === 0) {
    return (
      <main style={styles.container}>
        <div style={{ maxWidth: 500, margin: '60px auto', textAlign: 'center', background: '#fff', padding: 40, borderRadius: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🛒</div>
          <h2 style={{ color: '#2d3436', marginBottom: 16 }}>Tu carrito está vacío</h2>
          <p style={{ color: '#636e72', marginBottom: 24 }}>Agrega productos antes de realizar un pedido.</p>
          <Link to="/catalogo" style={{ display: 'inline-block', padding: '14px 32px', background: 'linear-gradient(135deg, #28a745, #20c997)', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 600 }}>Ir al Catálogo</Link>
        </div>
      </main>
    );
  }

  const steps = [
    { num: 1, text: 'Carrito creado', done: true },
    { num: 2, text: 'Datos de entrega', done: false, active: true },
    { num: 3, text: 'Pedido confirmado', done: false },
    { num: 4, text: 'En preparación', done: false },
    { num: 5, text: 'Entregado', done: false },
  ];

  return (
    <main style={styles.container}>
      <div style={styles.header}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 8 }}>📦 Finalizar Pedido</h1>
        <p style={{ opacity: 0.9, marginBottom: 0 }}>Completa tus datos de entrega</p>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={{ fontSize: 20 }}>📋</span>
            <h3 style={{ margin: 0, fontWeight: 600 }}>Información de Entrega</h3>
          </div>
          <div style={styles.cardBody}>
            <form onSubmit={handleConfirm}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>📅 Fecha preferida de entrega *</label>
                <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} style={{...styles.input, ...(errors.fecha ? {borderColor: '#dc3545'} : {})}} onFocus={e => e.target.style.borderColor = '#28a745'} onBlur={e => e.target.style.borderColor = errors.fecha ? '#dc3545' : '#e9ecef'} />
                {errors.fecha && <div style={styles.error}>⚠️ {errors.fecha}</div>}
              </div>

              <div style={styles.row}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>👤 Nombre completo *</label>
                  <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre" style={{...styles.input, ...(errors.nombre ? {borderColor: '#dc3545'} : {})}} onFocus={e => e.target.style.borderColor = '#28a745'} onBlur={e => e.target.style.borderColor = errors.nombre ? '#dc3545' : '#e9ecef'} />
                  {errors.nombre && <div style={styles.error}>⚠️ {errors.nombre}</div>}
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>📧 Email *</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" style={{...styles.input, ...(errors.email ? {borderColor: '#dc3545'} : {})}} onFocus={e => e.target.style.borderColor = '#28a745'} onBlur={e => e.target.style.borderColor = errors.email ? '#dc3545' : '#e9ecef'} />
                  {errors.email && <div style={styles.error}>⚠️ {errors.email}</div>}
                </div>
              </div>

              <div style={styles.row}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>📞 Teléfono *</label>
                  <input value={tel} onChange={e => setTel(e.target.value)} placeholder="+56 9 1234 5678" style={{...styles.input, ...(errors.tel ? {borderColor: '#dc3545'} : {})}} onFocus={e => e.target.style.borderColor = '#28a745'} onBlur={e => e.target.style.borderColor = errors.tel ? '#dc3545' : '#e9ecef'} />
                  {errors.tel && <div style={styles.error}>⚠️ {errors.tel}</div>}
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>🏠 Dirección *</label>
                  <input value={direccion} onChange={e => setDireccion(e.target.value)} placeholder="Calle, número, depto." style={{...styles.input, ...(errors.direccion ? {borderColor: '#dc3545'} : {})}} onFocus={e => e.target.style.borderColor = '#28a745'} onBlur={e => e.target.style.borderColor = errors.direccion ? '#dc3545' : '#e9ecef'} />
                  {errors.direccion && <div style={styles.error}>⚠️ {errors.direccion}</div>}
                </div>
              </div>

              <div style={styles.row}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>📍 Región *</label>
                  <select value={region} onChange={e => { setRegion(e.target.value); setComuna(''); }} style={{...styles.select, ...(errors.region ? {borderColor: '#dc3545'} : {})}}>
                    <option value="">Seleccionar región...</option>
                    {regionesYComunas.map(r => (<option key={r.region} value={r.region}>{r.region}</option>))}
                  </select>
                  {errors.region && <div style={styles.error}>⚠️ {errors.region}</div>}
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>🏘️ Comuna *</label>
                  <select value={comuna} onChange={e => setComuna(e.target.value)} disabled={!region} style={{...styles.select, ...(errors.comuna ? {borderColor: '#dc3545'} : {})}}>
                    <option value="">{region ? "Seleccionar comuna..." : "Primero selecciona región"}</option>
                    {(regionesYComunas.find(r => r.region === region)?.comunas || []).map(c => (<option key={c} value={c}>{c}</option>))}
                  </select>
                  {errors.comuna && <div style={styles.error}>⚠️ {errors.comuna}</div>}
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>💬 Comentarios (opcional)</label>
                <textarea value={comentarios} onChange={e => setComentarios(e.target.value)} placeholder="Instrucciones especiales para la entrega..." rows={3} style={{...styles.input, resize: 'none'}} onFocus={e => e.target.style.borderColor = '#28a745'} onBlur={e => e.target.style.borderColor = '#e9ecef'} />
              </div>

              {msg && (<div style={{ background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', padding: '14px 18px', borderRadius: 10, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}><span>⚠️</span> {msg}</div>)}

              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="button" onClick={() => navigate("/carrito")} style={styles.btnSecondary} disabled={loading}>← Volver</button>
                <button type="submit" style={{...styles.btnPrimary, opacity: loading ? 0.7 : 1}} disabled={loading} onMouseOver={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>{loading ? '⏳ Procesando...' : '✓ Confirmar Pedido'}</button>
              </div>
            </form>
          </div>
        </div>

        <div>
          <div style={{...styles.card, marginBottom: 20}}>
            <div style={styles.cardHeader}><span style={{ fontSize: 20 }}>🛒</span><h3 style={{ margin: 0, fontWeight: 600 }}>Resumen</h3></div>
            <div style={styles.cardBody}>
              {cartItems.slice(0, 5).map((item) => (<div key={item.codigo} style={styles.summaryItem}><div><div style={{ fontWeight: 600, color: '#2d3436' }}>{item.nombre}</div><div style={{ fontSize: 13, color: '#999' }}>x{item.qty}</div></div><div style={{ fontWeight: 600, color: '#28a745' }}>{formatCLP(item.precio * item.qty)}</div></div>))}
              {cartItems.length > 5 && (<div style={{ color: '#999', fontSize: 13, padding: '12px 0' }}>+{cartItems.length - 5} productos más...</div>)}
              <div style={styles.totalRow}><span style={{ fontSize: 18, fontWeight: 700, color: '#2d3436' }}>Total</span><span style={{ fontSize: 22, fontWeight: 700, color: '#28a745' }}>{formatCLP(subtotal)}</span></div>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}><span style={{ fontSize: 20 }}>📊</span><h3 style={{ margin: 0, fontWeight: 600 }}>Estado</h3></div>
            <div style={styles.cardBody}>
              {steps.map((step, i) => (<div key={i} style={styles.stepItem}><div style={{...styles.stepNumber, background: step.done ? '#28a745' : step.active ? '#fff3cd' : '#f8f9fa', color: step.done ? '#fff' : step.active ? '#856404' : '#adb5bd', border: step.active ? '2px solid #ffc107' : 'none'}}>{step.done ? '✓' : step.num}</div><span style={{ color: step.done ? '#28a745' : step.active ? '#2d3436' : '#adb5bd', fontWeight: step.active ? 600 : 400 }}>{step.text}</span></div>))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
