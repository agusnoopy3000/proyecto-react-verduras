import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useCart } from "../context/CartContext";
import productos from "../data/productos";
import regionesYComunas from "../data/regiones_comunas";
import api from '../api/client';

export default function Pedido() {
  const { cart } = useCart();
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
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo(0,0); }, []);

  const validar = () => {
    const e = {};
    if (!nombre.trim()) e.nombre = "Nombre requerido.";
    if (!direccion.trim()) e.direccion = "Dirección requerida.";
    if (!email.trim()) e.email = "Email requerido.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Email inválido.";
    if (!tel.trim()) e.tel = "Teléfono requerido.";
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
    try {
      const items = Object.entries(cart).map(([codigo, qty]) => ({
        productoId: codigo,
        cantidad: qty,
      }));
      if (items.length === 0) {
        setMsg("No se encontraron productos válidos en el carrito.");
        return;
      }
      const payload = {
        direccionEntrega: direccion,
        region,
        comuna,
        comentarios,
        fechaEntrega: fecha || null,
        items,
      };
      const { data } = await api.post('/v1/orders', payload);
      navigate("/confirmacion", { state: { orderId: data.id } });
    } catch (err) {
      console.error("Error confirmando pedido:", err);
      setMsg("Ocurrió un error. Intenta nuevamente.");
    }
  };

  return (
    <main className="container">
      <section className="form">
        <h2>Pedido y información de entrega</h2>
        <div style={{height:24}} />
        <form onSubmit={handleConfirm} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <div>
            <label className="form-label">Fecha preferida de entrega</label>
            <input type="date" className="form-control" value={fecha} onChange={e=>setFecha(e.target.value)} />
            <p className="help">Selecciona cualquier día a partir de mañana.</p>

            <label className="form-label">Nombre</label>
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
            </div>

            <label className="form-label">Comentarios</label>
            <input className="form-control" placeholder="Instrucciones para el repartidor" value={comentarios} onChange={e=>setComentarios(e.target.value)} />

            <div style={{height:12}} />
            <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:8}}>
              <button type="button" className="btn ghost" onClick={()=>navigate("/catalogo")}>Volver al catálogo</button>
              <button type="submit" className="btn btn-success">Confirmar pedido</button>
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
