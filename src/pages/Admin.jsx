import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import productosDefault from "../data/productos";
import api from '../api/client';

export default function Admin() {
  const [view, setView] = useState("productos"); // 'productos' | 'usuarios' | 'pedidos'
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showProdModal, setShowProdModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [editingUserIdx, setEditingUserIdx] = useState(null);
  const [editingProdIdx, setEditingProdIdx] = useState(null);
  const [editingOrderIdx, setEditingOrderIdx] = useState(null);
  const emptyUser = { run: "", nombre: "", apellidos: "", email: "", tipo: "Cliente", region: "", comuna: "", direccion: "", fechaNac: "" };
  const emptyProd = { codigo: "", nombre: "", desc: "", precio: 0, stock: 0, stockCritico: 0, categoria: "", img: "" };
  const emptyOrder = { id: "", status: "PENDIENTE" };
  const [userForm, setUserForm] = useState(emptyUser);
  const [prodForm, setProdForm] = useState(emptyProd);
  const [orderForm, setOrderForm] = useState(emptyOrder);
  const [msg, setMsg] = useState("");

  // storage keys (solo para compatibilidad antigua de usuarios/productos)
  const USERS_KEY = "users";
  const PRODS_KEY = "admin_products";

  useEffect(() => {
    loadUsers();
    loadProducts();
    loadOrders();
  }, []);

  const loadUsers = async () => {
    try {
      const { data } = await api.get('/v1/users', { params: { page: 0, size: 50 } });
      setUsers(data?.content || data || []);
    } catch {
      setUsers([]);
    }
  };

  const saveUsers = async (arr) => {
    // implementación real debería hacer POST/PUT/DELETE; se mantiene local mientras tanto
    setUsers(arr);
  };

  const loadProducts = async () => {
    try {
      const { data } = await api.get('/v1/products');
      // Filtrar solo productos válidos (que tengan codigo o nombre de producto)
      const filteredProducts = (Array.isArray(data) ? data : []).filter(item => 
        item && (item.codigo || item.precio !== undefined) && !item.email
      );
      setProducts(filteredProducts);
    } catch (err) {
      console.error('Error cargando productos', err);
      setProducts(Array.isArray(productosDefault) ? productosDefault : []);
    }
  };

  const saveProducts = async (arr) => {
    setProducts(arr);
  };

  const loadOrders = async () => {
    try {
      const { data } = await api.get('/v1/orders');
      setOrders(data);
    } catch (err) {
      console.error('Error cargando pedidos', err);
      setOrders([]);
    }
  };

  // Users handlers
  const openNewUser = () => {
    setEditingUserIdx(null);
    setUserForm(emptyUser);
    setMsg("");
    setShowUserModal(true);
  };
  const openEditUser = (idx) => {
    setEditingUserIdx(idx);
    setUserForm(users[idx] || emptyUser);
    setMsg("");
    setShowUserModal(true);
  };
  const saveUser = () => {
    if (!userForm.run || !userForm.nombre || !userForm.apellidos || !userForm.email) {
      setMsg("RUN, Nombre, Apellidos y Correo son obligatorios.");
      return;
    }
    const copy = [...users];
    if (editingUserIdx === null) {
      copy.push({ ...userForm });
      toast.success('Usuario añadido (solo local, ajustar a backend si aplica)');
    } else {
      copy[editingUserIdx] = { ...userForm };
      toast.success('Usuario modificado (solo local, ajustar a backend si aplica)');
    }
    saveUsers(copy);
    setShowUserModal(false);
  };
  const deleteUser = (idx) => {
    if (!confirm("Eliminar usuario?")) return;
    const next = users.filter((_, i) => i !== idx);
    saveUsers(next);
  };

  // Products handlers
  const openNewProd = () => {
    setEditingProdIdx(null);
    setProdForm(emptyProd);
    setMsg("");
    setShowProdModal(true);
  };
  const openEditProd = (idx) => {
    setEditingProdIdx(idx);
    setProdForm(products[idx] || emptyProd);
    setMsg("");
    setShowProdModal(true);
  };
  const saveProd = () => {
    if (!prodForm.codigo || !prodForm.nombre) {
      setMsg("Código y Nombre son obligatorios.");
      return;
    }
    const copy = [...products];
    if (editingProdIdx === null) {
      copy.push({ ...prodForm });
      toast.success('Producto añadido (solo local, ajustar a backend)');
    } else {
      copy[editingProdIdx] = { ...prodForm };
      toast.success('Producto modificado (solo local, ajustar a backend)');
    }
    saveProducts(copy);
    setShowProdModal(false);
  };
  const deleteProd = (idx) => {
    if (!confirm("Eliminar producto?")) return;
    const next = products.filter((_, i) => i !== idx);
    saveProducts(next);
  };

  // Orders handlers
  const openEditOrder = (idx) => {
    setEditingOrderIdx(idx);
    const current = orders[idx];
    setOrderForm({ id: current?.id ?? '', status: current?.status ?? 'PENDIENTE' });
    setMsg("");
    setShowOrderModal(true);
  };

  const saveOrderStatus = async () => {
    if (!orderForm.id || !orderForm.status) {
      setMsg('ID y estado son obligatorios.');
      return;
    }
    try {
      await api.put(`/v1/orders/${orderForm.id}/status`, { status: orderForm.status });
      setOrders(prev => prev.map(o => (o.id === orderForm.id ? { ...o, status: orderForm.status } : o)));
      toast.success('Estado de pedido actualizado');
      setShowOrderModal(false);
    } catch (err) {
      console.error('Error actualizando estado de pedido', err);
      setMsg('No se pudo actualizar el estado.');
    }
  };

  const onUserChange = (k, v) => setUserForm(prev => ({ ...prev, [k]: v }));
  const onProdChange = (k, v) => setProdForm(prev => ({ ...prev, [k]: v }));
  const onOrderChange = (k, v) => setOrderForm(prev => ({ ...prev, [k]: v }));

  return (
    <main className="container">
      <h2>Panel Administrador</h2>

      <div className="mb-3">
        <div className="d-flex flex-wrap gap-2">
          <button className={`btn ${view === "productos" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setView("productos")}>Lista de Productos</button>
          <button className="btn btn-success" onClick={openNewProd}>＋ Nuevo Producto</button>
          <button className={`btn ${view === "usuarios" ? "btn-secondary" : "btn-outline-secondary"}`} onClick={() => setView("usuarios")}>Lista de Usuarios</button>
          <button className="btn btn-info" onClick={openNewUser}>＋ Nuevo Usuario</button>
          <button className={`btn ${view === "pedidos" ? "btn-warning" : "btn-outline-warning"}`} onClick={() => setView("pedidos")}>Lista de Pedidos</button>
        </div>
      </div>

      <div id="adminContent">
        {view === "usuarios" ? (
          <section>
            <h3>Usuarios ({users.length})</h3>
            {users.length === 0 ? <p>No hay usuarios registrados.</p> : (
              <table className="table">
                <thead><tr><th>RUN</th><th>Nombre</th><th>Apellidos</th><th>Email</th><th>Tipo</th><th>Acciones</th></tr></thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.run || u.id || i}>
                      <td>{u.run}</td>
                      <td>{u.nombre}</td>
                      <td>{u.apellidos}</td>
                      <td>{u.email}</td>
                      <td>{u.tipo}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditUser(i)}>Editar</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteUser(i)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        ) : view === "productos" ? (
          <section>
            <h3>Productos ({products.length})</h3>
            {products.length === 0 ? <p>No hay productos.</p> : (
              <table className="table">
                <thead><tr><th>Código</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Categoría</th><th>Acciones</th></tr></thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr key={p.codigo || p.id || i}>
                      <td>{p.codigo}</td>
                      <td>{p.nombre}</td>
                      <td>{Number(p.precio).toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 })}</td>
                      <td>{p.stock ?? "—"}</td>
                      <td>{p.categoria ?? p.categ ?? "—"}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditProd(i)}>Editar</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteProd(i)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        ) : (
          <section>
            <h3>Pedidos ({orders.length})</h3>
            {orders.length === 0 ? <p>No hay pedidos.</p> : (
              <table className="table">
                <thead><tr><th>ID</th><th>Cliente</th><th>Fecha</th><th>Estado</th><th>Total</th><th>Acciones</th></tr></thead>
                <tbody>
                  {orders.map((o, i) => (
                    <tr key={o.id || i}>
                      <td>{o.id}</td>
                      <td>{o.cliente?.email || o.clienteEmail || 'N/D'}</td>
                      <td>{o.fechaCreacion || o.createdAt || o.fecha}</td>
                      <td>{o.status}</td>
                      <td>{o.total != null ? Number(o.total).toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }) : '—'}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditOrder(i)}>Cambiar estado</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}
      </div>

      {/* User Modal */}
      {showUserModal && (
        <div
          className="modal-backdrop"
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(0,0,0,0.5)', 
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowUserModal(false); }}
        >
          <div
            style={{
              maxWidth: 600,
              width: '100%',
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '85vh',
              overflow: 'hidden'
            }}
            role="dialog"
            aria-modal="true"
            aria-label={editingUserIdx === null ? "Nuevo Usuario" : "Editar Usuario"}
          >
            <div style={{ 
              padding: '16px 20px', 
              borderBottom: '1px solid #e0e0e0', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: '#f8f9fa'
            }}>
              <h5 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{editingUserIdx === null ? "Nuevo Usuario" : "Editar Usuario"}</h5>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowUserModal(false)}>✕</button>
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); saveUser(); }}
              style={{ padding: '20px', overflowY: 'auto', flex: 1 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="row g-3">
                  <div className="col-12 col-sm-4">
                    <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>RUN *</label>
                    <input className="form-control" value={userForm.run} onChange={e => onUserChange('run', e.target.value)} placeholder="12.345.678-9" />
                  </div>
                  <div className="col-12 col-sm-4">
                    <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Nombre *</label>
                    <input className="form-control" value={userForm.nombre} onChange={e => onUserChange('nombre', e.target.value)} placeholder="Juan" />
                  </div>
                  <div className="col-12 col-sm-4">
                    <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Apellidos *</label>
                    <input className="form-control" value={userForm.apellidos} onChange={e => onUserChange('apellidos', e.target.value)} placeholder="Pérez González" />
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-sm-6">
                    <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Correo *</label>
                    <input className="form-control" type="email" value={userForm.email} onChange={e => onUserChange('email', e.target.value)} placeholder="correo@ejemplo.com" />
                  </div>
                  <div className="col-12 col-sm-6">
                    <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Tipo de Usuario</label>
                    <select className="form-select" value={userForm.tipo} onChange={e => onUserChange('tipo', e.target.value)}>
                      <option>Cliente</option>
                      <option>Administrador</option>
                      <option>Vendedor</option>
                    </select>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-sm-6">
                    <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Región</label>
                    <input className="form-control" value={userForm.region} onChange={e => onUserChange('region', e.target.value)} placeholder="Metropolitana" />
                  </div>
                  <div className="col-12 col-sm-6">
                    <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Comuna</label>
                    <input className="form-control" value={userForm.comuna} onChange={e => onUserChange('comuna', e.target.value)} placeholder="Santiago" />
                  </div>
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Dirección</label>
                  <input className="form-control" value={userForm.direccion} onChange={e => onUserChange('direccion', e.target.value)} placeholder="Av. Principal 123" />
                </div>

                <div className="row g-3">
                  <div className="col-12 col-sm-6">
                    <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Fecha Nacimiento</label>
                    <input className="form-control" type="date" value={userForm.fechaNac} onChange={e => onUserChange('fechaNac', e.target.value)} />
                  </div>
                </div>

                {msg && <div className="alert alert-danger" style={{ margin: 0, padding: '10px 14px' }}>{msg}</div>}
              </div>
            </form>

            <div style={{ 
              padding: '14px 20px', 
              borderTop: '1px solid #e0e0e0', 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: 10,
              background: '#f8f9fa'
            }}>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowUserModal(false)}>Cancelar</button>
              <button type="button" className="btn btn-success" onClick={saveUser}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {showProdModal && (
        <div
          className="modal-backdrop"
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(0,0,0,0.5)', 
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowProdModal(false); }}
        >
          <div
            style={{
              maxWidth: 600,
              width: '100%',
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '85vh',
              overflow: 'hidden'
            }}
            role="dialog"
            aria-modal="true"
            aria-label={editingProdIdx === null ? "Nuevo Producto" : "Editar Producto"}
          >
            <div style={{ 
              padding: '16px 20px', 
              borderBottom: '1px solid #e0e0e0', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: '#f8f9fa'
            }}>
              <h5 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{editingProdIdx === null ? "Nuevo Producto" : "Editar Producto"}</h5>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowProdModal(false)}>✕</button>
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); saveProd(); }}
              style={{ padding: '20px', overflowY: 'auto', flex: 1 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="row g-3">
                  <div className="col-12 col-sm-4">
                    <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Código *</label>
                    <input className="form-control" value={prodForm.codigo} onChange={e => onProdChange('codigo', e.target.value)} placeholder="PRD-001" />
                  </div>
                  <div className="col-12 col-sm-8">
                    <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Nombre *</label>
                    <input className="form-control" value={prodForm.nombre} onChange={e => onProdChange('nombre', e.target.value)} placeholder="Nombre del producto" />
                  </div>
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Descripción</label>
                  <textarea className="form-control" rows={3} value={prodForm.desc} onChange={e => onProdChange('desc', e.target.value)} placeholder="Descripción del producto..." />
                </div>

                <div className="row g-3">
                  <div className="col-12 col-sm-4">
                    <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Precio *</label>
                    <input className="form-control" type="number" value={prodForm.precio} onChange={e => onProdChange('precio', e.target.value)} placeholder="1990" />
                  </div>
                  <div className="col-12 col-sm-4">
                    <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Stock *</label>
                    <input className="form-control" type="number" value={prodForm.stock} onChange={e => onProdChange('stock', e.target.value)} placeholder="100" />
                  </div>
                  <div className="col-12 col-sm-4">
                    <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Stock Crítico</label>
                    <input className="form-control" type="number" value={prodForm.stockCritico} onChange={e => onProdChange('stockCritico', e.target.value)} placeholder="10" />
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-sm-6">
                    <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Categoría</label>
                    <input className="form-control" value={prodForm.categoria} onChange={e => onProdChange('categoria', e.target.value)} placeholder="Verduras" />
                  </div>
                  <div className="col-12 col-sm-6">
                    <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Imagen (URL)</label>
                    <input className="form-control" value={prodForm.img} onChange={e => onProdChange('img', e.target.value)} placeholder="https://..." />
                  </div>
                </div>

                {msg && <div className="alert alert-danger" style={{ margin: 0, padding: '10px 14px' }}>{msg}</div>}
              </div>
            </form>

            <div style={{ 
              padding: '14px 20px', 
              borderTop: '1px solid #e0e0e0', 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: 10,
              background: '#f8f9fa'
            }}>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowProdModal(false)}>Cancelar</button>
              <button type="button" className="btn btn-success" onClick={saveProd}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Order Modal */}
      {showOrderModal && (
        <div
          className="modal-backdrop"
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(0,0,0,0.5)', 
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowOrderModal(false); }}
        >
          <div
            style={{
              maxWidth: 400,
              width: '100%',
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Cambiar estado de pedido"
          >
            <div style={{ 
              padding: '16px 20px', 
              borderBottom: '1px solid #e0e0e0', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: '#f8f9fa'
            }}>
              <h5 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Cambiar estado de pedido</h5>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowOrderModal(false)}>✕</button>
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); saveOrderStatus(); }}
              style={{ padding: '20px' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>ID Pedido</label>
                  <input className="form-control" value={orderForm.id} readOnly style={{ background: '#f5f5f5' }} />
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Estado</label>
                  <select className="form-select" value={orderForm.status} onChange={e => onOrderChange('status', e.target.value)}>
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="CONFIRMADO">CONFIRMADO</option>
                    <option value="ENVIADO">ENVIADO</option>
                    <option value="ENTREGADO">ENTREGADO</option>
                    <option value="CANCELADO">CANCELADO</option>
                  </select>
                </div>
                {msg && <div className="alert alert-danger" style={{ margin: 0, padding: '10px 14px' }}>{msg}</div>}
              </div>
            </form>

            <div style={{ 
              padding: '14px 20px', 
              borderTop: '1px solid #e0e0e0', 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: 10,
              background: '#f8f9fa'
            }}>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowOrderModal(false)}>Cancelar</button>
              <button type="button" className="btn btn-success" onClick={saveOrderStatus}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
