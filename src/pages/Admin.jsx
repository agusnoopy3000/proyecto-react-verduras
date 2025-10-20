import React, { useEffect, useState } from "react";
import productosDefault from "../data/productos";

export default function Admin() {
  const [view, setView] = useState("productos"); // 'productos' | 'usuarios'
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showProdModal, setShowProdModal] = useState(false);
  const [editingUserIdx, setEditingUserIdx] = useState(null);
  const [editingProdIdx, setEditingProdIdx] = useState(null);
  const emptyUser = { run: "", nombre: "", apellidos: "", email: "", tipo: "Cliente", region: "", comuna: "", direccion: "", fechaNac: "" };
  const emptyProd = { codigo: "", nombre: "", desc: "", precio: 0, stock: 0, stockCritico: 0, categoria: "", img: "" };
  const [userForm, setUserForm] = useState(emptyUser);
  const [prodForm, setProdForm] = useState(emptyProd);
  const [msg, setMsg] = useState("");

  // storage keys
  const USERS_KEY = "users";
  const PRODS_KEY = "admin_products"; // use admin_products if present, fallback to 'productos' or productosDefault

  useEffect(() => {
    loadUsers();
    loadProducts();
  }, []);

  const loadUsers = () => {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      setUsers(Array.isArray(parsed) ? parsed : []);
    } catch {
      setUsers([]);
    }
  };

  const saveUsers = (arr) => {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(arr));
      setUsers(arr);
      window.dispatchEvent(new CustomEvent("users-changed", { detail: arr }));
    } catch (err) {
      console.error("Error guardando users:", err);
    }
  };

  const loadProducts = () => {
    try {
      const raw = localStorage.getItem(PRODS_KEY) || localStorage.getItem("productos") || localStorage.getItem("products");
      if (raw) {
        const parsed = JSON.parse(raw);
        setProducts(Array.isArray(parsed) ? parsed : (parsed?.items ?? productosDefault));
        return;
      }
    } catch (err) {
      console.debug("No admin_products:", err);
    }
    setProducts(Array.isArray(productosDefault) ? productosDefault : []);
  };

  const saveProducts = (arr) => {
    try {
      localStorage.setItem(PRODS_KEY, JSON.stringify(arr));
      setProducts(arr);
      window.dispatchEvent(new CustomEvent("products-changed", { detail: arr }));
    } catch (err) {
      console.error("Error guardando products:", err);
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
    // minimal validation
    if (!userForm.run || !userForm.nombre || !userForm.apellidos || !userForm.email) {
      setMsg("RUN, Nombre, Apellidos y Correo son obligatorios.");
      return;
    }
    const copy = [...users];
    if (editingUserIdx === null) {
      // add
      copy.push({ ...userForm });
    } else {
      copy[editingUserIdx] = { ...userForm };
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
    } else {
      copy[editingProdIdx] = { ...prodForm };
    }
    saveProducts(copy);
    setShowProdModal(false);
  };
  const deleteProd = (idx) => {
    if (!confirm("Eliminar producto?")) return;
    const next = products.filter((_, i) => i !== idx);
    saveProducts(next);
  };

  // small input helpers
  const onUserChange = (k, v) => setUserForm(prev => ({ ...prev, [k]: v }));
  const onProdChange = (k, v) => setProdForm(prev => ({ ...prev, [k]: v }));

  return (
    <main className="container">
      <h2>Panel Administrador</h2>

      <div className="mb-3">
        <div className="d-flex flex-wrap gap-2">
          <button className={`btn ${view === "productos" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setView("productos")}>Lista de Productos</button>
          <button className="btn btn-success" onClick={openNewProd}>＋ Nuevo Producto</button>
          <button className={`btn ${view === "usuarios" ? "btn-secondary" : "btn-outline-secondary"}`} onClick={() => setView("usuarios")}>Lista de Usuarios</button>
          <button className="btn btn-info" onClick={openNewUser}>＋ Nuevo Usuario</button>
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
                    <tr key={u.run || i}>
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
        ) : (
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
        )}
      </div>

      {/* User Modal */}
      {showUserModal && (
        <div className="modal-backdrop" style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.45)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1100}}>
          <div className="modal-dialog" style={{maxWidth:720, width:'95%'}}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingUserIdx === null ? "Nuevo Usuario" : "Editar Usuario"}</h5>
                <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setShowUserModal(false)} />
              </div>

              <div className="modal-body" style={{maxHeight:'65vh', overflowY:'auto', paddingTop:8, paddingBottom:8}}>
                <form onSubmit={(e)=>{ e.preventDefault(); saveUser(); }}>
                  <div className="row g-2">
                    <div className="col-12 col-md-4">
                      <label className="form-label">RUN *</label>
                      <input className="form-control" value={userForm.run} onChange={e=>onUserChange('run', e.target.value)} />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label">Nombre *</label>
                      <input className="form-control" value={userForm.nombre} onChange={e=>onUserChange('nombre', e.target.value)} />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label">Apellidos *</label>
                      <input className="form-control" value={userForm.apellidos} onChange={e=>onUserChange('apellidos', e.target.value)} />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">Correo *</label>
                      <input className="form-control" type="email" value={userForm.email} onChange={e=>onUserChange('email', e.target.value)} />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Tipo de Usuario *</label>
                      <select className="form-select" value={userForm.tipo} onChange={e=>onUserChange('tipo', e.target.value)}>
                        <option>Administrador</option>
                        <option>Cliente</option>
                        <option>Vendedor</option>
                      </select>
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">Región</label>
                      <input className="form-control" value={userForm.region} onChange={e=>onUserChange('region', e.target.value)} />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Comuna</label>
                      <input className="form-control" value={userForm.comuna} onChange={e=>onUserChange('comuna', e.target.value)} />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Dirección</label>
                      <input className="form-control" value={userForm.direccion} onChange={e=>onUserChange('direccion', e.target.value)} />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">Fecha Nacimiento</label>
                      <input className="form-control" type="date" value={userForm.fechaNac} onChange={e=>onUserChange('fechaNac', e.target.value)} />
                    </div>

                    {msg && <div className="col-12"><div className="text-danger">{msg}</div></div>}
                  </div>
                </form>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowUserModal(false)}>Cancelar</button>
                <button type="button" className="btn btn-success" onClick={saveUser}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {showProdModal && (
        <div className="modal-backdrop" style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.45)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1100}}>
          <div className="modal-dialog" style={{maxWidth:720, width:'95%'}}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingProdIdx === null ? "Nuevo Producto" : "Editar Producto"}</h5>
                <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setShowProdModal(false)} />
              </div>

              <div className="modal-body" style={{maxHeight:'65vh', overflowY:'auto', paddingTop:8, paddingBottom:8}}>
                <form onSubmit={(e)=>{ e.preventDefault(); saveProd(); }}>
                  <div className="row g-2">
                    <div className="col-12 col-md-4">
                      <label className="form-label">Código *</label>
                      <input className="form-control" value={prodForm.codigo} onChange={e=>onProdChange('codigo', e.target.value)} />
                    </div>
                    <div className="col-12 col-md-8">
                      <label className="form-label">Nombre *</label>
                      <input className="form-control" value={prodForm.nombre} onChange={e=>onProdChange('nombre', e.target.value)} />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Descripción</label>
                      <textarea className="form-control" rows={3} value={prodForm.desc} onChange={e=>onProdChange('desc', e.target.value)} />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label">Precio *</label>
                      <input className="form-control" type="number" value={prodForm.precio} onChange={e=>onProdChange('precio', e.target.value)} />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label">Stock *</label>
                      <input className="form-control" type="number" value={prodForm.stock} onChange={e=>onProdChange('stock', e.target.value)} />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label">Stock Crítico</label>
                      <input className="form-control" type="number" value={prodForm.stockCritico} onChange={e=>onProdChange('stockCritico', e.target.value)} />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">Categoría</label>
                      <input className="form-control" value={prodForm.categoria} onChange={e=>onProdChange('categoria', e.target.value)} />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Imagen (URL)</label>
                      <input className="form-control" value={prodForm.img} onChange={e=>onProdChange('img', e.target.value)} />
                    </div>

                    {msg && <div className="col-12"><div className="text-danger">{msg}</div></div>}
                  </div>
                </form>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowProdModal(false)}>Cancelar</button>
                <button type="button" className="btn btn-success" onClick={saveProd}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
