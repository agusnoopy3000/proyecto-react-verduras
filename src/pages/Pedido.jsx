import React, { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import productos from "../data/productos";
import regionesYComunas from "../data/regiones_comunas";
import api from '../api/client';

export default function Pedido() {
  const { cart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  // TODOS los hooks deben estar antes de cualquier return condicional
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

  useEffect(() => { window.scrollTo(0,0); }, []);

  // Pre-llenar datos del usuario autenticado
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
    // Validar fecha - debe ser una fecha futura
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
    
    // Verificar autenticación antes de enviar
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
        fechaEntrega: fecha, // formato YYYY-MM-DD del input date
        items,
      };
      
      console.log('Enviando pedido:', payload);
      console.log('Token presente:', !!token);
      
      const { data } = await api.post('/v1/orders', payload);
      console.log('Respuesta del servidor:', data);
      navigate("/confirmacion", { state: { orderId: data.id } });
    } catch (err) {
      console.error("Error confirmando pedido:", err);
      console.error("Response status:", err.response?.status);
      console.error("Response data:", err.response?.data);
      
      if (err.response?.status === 401 || err.response?.status === 403) {
        setMsg("Sesión expirada o no autorizada. Por favor, inicia sesión nuevamente.");
      } else if (err.response?.status === 400) {
        // Error de validación del backend
        const backendMsg = err.response?.data?.message || err.response?.data?.error || 'Error en los datos del pedido.';
        setMsg(backendMsg);
      } else if (err.response?.data?.message) {
        setMsg(err.response.data.message);
      } else if (err.code === 'ERR_NETWORK' || err.message?.includes('Network')) {
        setMsg("Error de conexión. Verifica tu conexión a internet e intenta nuevamente.");
      } else {
        setMsg(`Error al procesar tu pedido: ${err.message || 'Intenta nuevamente.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Si no está autenticado, mostrar mensaje
  if (!isAuthenticated) {
    return (
      <main className="container">
        <section>
          <h2>Realizar Pedido</h2>
          <div className="alert alert-warning" style={{ padding: '20px', borderRadius: '8px', backgroundColor: '#fff3cd', border: '1px solid #ffc107' }}>
            <p style={{ marginBottom: '10px' }}>
              <strong>⚠️ Debes iniciar sesión para realizar un pedido.</strong>
            </p>
            <p>
              <Link to="/login" className="btn btn-primary" style={{ marginRight: '10px' }}>Iniciar sesión</Link>
              <Link to="/registro" className="btn btn-outline-secondary">Crear cuenta</Link>
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="container">
      <section className="form">
        <h2>Pedido y información de entrega</h2>
        <div style={{height:24}} />
        <form onSubmit={handleConfirm} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <div>
            <label className="form-label">Fecha preferida de entrega *</label>
            <input 
              type="date" 
              className="form-control" 
              value={fecha} 
              onChange={e=>setFecha(e.target.value)} 
              min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
            />
            {errors.fecha && <div className="error">{errors.fecha}</div>}
            <p className="help">Selecciona cualquier día a partir de mañana.</p>

            <label className="form-label">Nombre *</label>
            <input className="form-control" value={nombre} onChange={e=>setNombre(e.target.value)} />
            {errors.nombre && <div className="error">{errors.nombre}</div>}

            <label className="form-label">Dirección</label>
            <input className="form-control" placeholder="Calle, número, comuna" value={direccion} onChange={e=>setDireccion(e.target.value)} />
            {errors.direccion && <div className="error">{errors.direccion}</div>}

            <label className="form-label">Email</label>
            <input className="form-control" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
            {errors.email && <div className="error">{errors.email}</div>}

            <label className="form-label">Teléfono</label>
            <input className="form-control" value={tel} onChange={e=>setTel(e.target.value)} />
            {errors.tel && <div className="error">{errors.tel}</div>}

            <div className="col-12 col-md-6">
              <label className="form-label">Región</label>
              <select
                className="form-select"
                value={region || ""}
                onChange={e => {
                  setRegion(e.target.value);
                  setComuna('');
                }}
              >
                <option value="">Seleccione región</option>
                {regionesYComunas.map(r => (
                  <option key={r.region} value={r.region}>{r.region}</option>
                ))}
              </select>
              {errors.region && <div className="error">{errors.region}</div>}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Comuna</label>
              <select
                className="form-select"
                value={comuna || ""}
                onChange={e => setComuna(e.target.value)}
                disabled={!region}
              >
                <option value="">{region ? "Seleccione comuna" : "Seleccione región primero"}</option>
                {(regionesYComunas.find(r => r.region === region)?.comunas || []).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.comuna && <div className="error">{errors.comuna}</div>}
            </div>

            <label className="form-label">Comentarios</label>
            <input className="form-control" placeholder="Instrucciones para el repartidor" value={comentarios} onChange={e=>setComentarios(e.target.value)} />

            <div style={{height:12}} />
            <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:8}}>
              <button type="button" className="btn ghost" onClick={()=>navigate("/catalogo")} disabled={loading}>Volver al catálogo</button>
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? 'Procesando...' : 'Confirmar pedido'}
              </button>
            </div>

            {msg && <p className="error" style={{marginTop:8}}>{msg}</p>}
          </div>

          <div>
            <h3>Estado</h3>
            <ul id="estadoPedido">
              <li>Carrito creado</li>
              <li>Pedido confirmado</li>
              <li>En preparación</li>
              <li>En camino</li>
              <li>Entregado</li>
            </ul>
            <p className="help">Al confirmar se guardará el pedido y se mostrará la pantalla de confirmación.</p>
          </div>
        </form>
      </section>
    </main>
  );
}
