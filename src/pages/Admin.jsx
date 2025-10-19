import React, { useEffect, useState } from "react";
import productosSeed from "../data/productos";
import regionesData from "../data/regiones_comunas";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const PROD_KEY = 'hh_products';
const USER_KEY = 'hh_users';

export default function Admin() {
  const { user } = useAuth();

  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [view, setView] = useState('productos'); // 'productos' | 'usuarios'

  // Product form state
  const emptyProd = { codigo: '', nombre: '', descripcion: '', precio: 0, stock: 0, stockCritico: 0, categoria: '', img: '' };
  const [prodForm, setProdForm] = useState(emptyProd);
  const [editingProdCodigo, setEditingProdCodigo] = useState(null);
  const [prodMsg, setProdMsg] = useState('');

  // User form state
  const emptyUser = { run: '', nombre: '', apellidos: '', email: '', tipo: '', region: '', comuna: '', direccion: '', fechaNac: '' };
  const [userForm, setUserForm] = useState(emptyUser);
  const [editingUserIndex, setEditingUserIndex] = useState(null);
  const [userMsg, setUserMsg] = useState('');
  const [comunasList, setComunasList] = useState([]);

  useEffect(() => {
    // cargar productos desde localStorage o seed
    try {
      const stored = JSON.parse(localStorage.getItem(PROD_KEY) || 'null');
      if (stored && Array.isArray(stored)) setProductos(stored);
      else setProductos(productosSeed || []);
    } catch {
      setProductos(productosSeed || []);
    }

    try {
      const u = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
      if (u && Array.isArray(u)) setUsuarios(u);
      else setUsuarios([]);
    } catch {
      setUsuarios([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(PROD_KEY, JSON.stringify(productos));
  }, [productos]);

  useEffect(() => {
    localStorage.setItem(USER_KEY, JSON.stringify(usuarios));
  }, [usuarios]);

  function handleProdChange(e) {
    const { name, value } = e.target;
    setProdForm(prev => ({ ...prev, [name]: name === 'precio' || name === 'stock' || name === 'stockCritico' ? Number(value) : value }));
  }

  function saveProducto() {
    // validaciones mínimas
    if (!prodForm.codigo || !prodForm.nombre || !prodForm.precio) {
      setProdMsg('Código, nombre y precio son obligatorios.');
      return;
    }
    setProdMsg('');
    const exists = productos.find(p => p.codigo === prodForm.codigo);
    if (editingProdCodigo) {
      // editar
      setProductos(prev => prev.map(p => p.codigo === editingProdCodigo ? { ...prodForm } : p));
      setEditingProdCodigo(null);
      setProdForm(emptyProd);
      return;
    }
    if (exists) {
      setProdMsg('Ya existe un producto con ese código.');
      return;
    }
    setProductos(prev => [...prev, prodForm]);
    setProdForm(emptyProd);
  }

  function editProducto(codigo) {
    const p = productos.find(x => x.codigo === codigo);
    if (!p) return;
    setProdForm({ ...p });
    setEditingProdCodigo(codigo);
    setView('productos');
  }

  function deleteProducto(codigo) {
    if (!confirm('¿Eliminar producto?')) return;
    setProductos(prev => prev.filter(p => p.codigo !== codigo));
  }

  // Usuarios
  function handleUserChange(e) {
    const { name, value } = e.target;
    setUserForm(prev => ({ ...prev, [name]: value }));
  }

  function onRegionChange(region) {
    setUserForm(prev => ({ ...prev, region, comuna: '' }));
    const found = regionesData.find(r => r.region === region);
    setComunasList(found ? found.comunas : []);
  }

  function saveUsuario() {
    if (!userForm.run || !userForm.nombre || !userForm.email) {
      setUserMsg('RUN, nombre y correo son obligatorios.');
      return;
    }
    // simple email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email)) {
      setUserMsg('Email inválido.');
      return;
    }
    setUserMsg('');
    if (editingUserIndex !== null) {
      setUsuarios(prev => prev.map((u, i) => i === editingUserIndex ? { ...userForm } : u));
      setEditingUserIndex(null);
      setUserForm(emptyUser);
      return;
    }
    setUsuarios(prev => [...prev, userForm]);
    setUserForm(emptyUser);
  }

  function editUsuario(i) {
    const u = usuarios[i];
    setUserForm({ ...u });
    setEditingUserIndex(i);
    const found = regionesData.find(r => r.region === u.region);
    setComunasList(found ? found.comunas : []);
    setView('usuarios');
  }

  function deleteUsuario(i) {
    if (!confirm('¿Eliminar usuario?')) return;
    setUsuarios(prev => prev.filter((_, idx) => idx !== i));
  }

  if (!user || user.role !== 'Administrador') {
    return (
      <div className="container my-4">
        <h2>Panel de Administración</h2>
        <p>Acceso restringido. Debes iniciar sesión como administrador.</p>
        <p>Usa <strong>admin@huertohogar.cl</strong> / <strong>admin123</strong> en <Link to="/login">Login</Link>.</p>
      </div>
    );
  }

  const categorias = Array.from(new Set(productos.map(p => p.categoria).filter(Boolean)));

  return (
    <div className="container my-4">
      <h2>Panel de Administración</h2>
      <div className="mb-3">
        <div className="d-flex flex-wrap gap-3">
          <button className="btn btn-primary" onClick={() => setView('productos')}>Lista de Productos</button>
          <button className="btn btn-success" onClick={() => { setView('productos'); setProdForm(emptyProd); setEditingProdCodigo(null); }}>＋ Nuevo Producto</button>
          <button className="btn btn-secondary" onClick={() => setView('usuarios')}>Lista de Usuarios</button>
        </div>
      </div>

      {view === 'productos' && (
        <section className="card p-3 mb-3">
          <h3>Productos</h3>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr><th>Código</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th></th></tr>
              </thead>
              <tbody>
                {productos.map(p => (
                  <tr key={p.codigo}>
                    <td>{p.codigo}</td>
                    <td>{p.nombre}</td>
                    <td>{p.categoria}</td>
                    <td>{new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0}).format(p.precio)}</td>
                    <td>{p.stock}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => editProducto(p.codigo)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => deleteProducto(p.codigo)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3">
            <h4>{editingProdCodigo ? 'Editar producto' : 'Nuevo producto'}</h4>
            <div className="row g-2">
              <div className="col-6">
                <label className="form-label">Código *</label>
                <input name="codigo" className="form-control" value={prodForm.codigo} onChange={handleProdChange} disabled={!!editingProdCodigo} />
              </div>
              <div className="col-6">
                <label className="form-label">Nombre *</label>
                <input name="nombre" className="form-control" value={prodForm.nombre} onChange={handleProdChange} />
              </div>
              <div className="col-6">
                <label className="form-label">Categoría</label>
                <select name="categoria" className="form-select" value={prodForm.categoria} onChange={handleProdChange}>
                  <option value="">Seleccione...</option>
                  {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-6">
                <label className="form-label">Precio *</label>
                <input name="precio" type="number" className="form-control" value={prodForm.precio} onChange={handleProdChange} />
              </div>
              <div className="col-6">
                <label className="form-label">Stock</label>
                <input name="stock" type="number" className="form-control" value={prodForm.stock} onChange={handleProdChange} />
              </div>
              <div className="col-6">
                <label className="form-label">Stock Crítico</label>
                <input name="stockCritico" type="number" className="form-control" value={prodForm.stockCritico} onChange={handleProdChange} />
              </div>
              <div className="col-12">
                <label className="form-label">Descripción</label>
                <textarea name="descripcion" className="form-control" value={prodForm.descripcion} onChange={handleProdChange} />
              </div>
              <div className="col-12">
                <label className="form-label">Imagen (ruta relativa en public/assets/img)</label>
                <input name="img" className="form-control" value={prodForm.img} onChange={handleProdChange} placeholder="assets/img/archivo.jpg" />
              </div>
            </div>
            <div className="mt-2 d-flex gap-2">
              <button className="btn btn-success" onClick={saveProducto}>Guardar</button>
              <button className="btn btn-secondary" onClick={() => { setProdForm(emptyProd); setEditingProdCodigo(null); }}>Cancelar</button>
            </div>
            {prodMsg && <p className="error mt-2">{prodMsg}</p>}
          </div>
        </section>
      )}

      {view === 'usuarios' && (
        <section className="card p-3">
          <h3>Usuarios</h3>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr><th>RUN</th><th>Nombre</th><th>Correo</th><th>Tipo</th><th></th></tr>
              </thead>
              <tbody>
                {usuarios.map((u, i) => (
                  <tr key={i}>
                    <td>{u.run}</td>
                    <td>{u.nombre} {u.apellidos}</td>
                    <td>{u.email}</td>
                    <td>{u.tipo}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => editUsuario(i)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => deleteUsuario(i)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3">
            <h4>{editingUserIndex !== null ? 'Editar usuario' : 'Nuevo usuario'}</h4>
            <div className="row g-2">
              <div className="col-6">
                <label className="form-label">RUN *</label>
                <input name="run" className="form-control" value={userForm.run} onChange={handleUserChange} />
              </div>
              <div className="col-6">
                <label className="form-label">Nombre *</label>
                <input name="nombre" className="form-control" value={userForm.nombre} onChange={handleUserChange} />
              </div>
              <div className="col-6">
                <label className="form-label">Apellidos</label>
                <input name="apellidos" className="form-control" value={userForm.apellidos} onChange={handleUserChange} />
              </div>
              <div className="col-6">
                <label className="form-label">Correo *</label>
                <input name="email" type="email" className="form-control" value={userForm.email} onChange={handleUserChange} />
              </div>
              <div className="col-6">
                <label className="form-label">Tipo</label>
                <select name="tipo" className="form-select" value={userForm.tipo} onChange={handleUserChange}>
                  <option value="">Seleccione...</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Cliente">Cliente</option>
                  <option value="Vendedor">Vendedor</option>
                </select>
              </div>

              <div className="col-6">
                <label className="form-label">Región</label>
                <select name="region" className="form-select" value={userForm.region} onChange={e => onRegionChange(e.target.value)}>
                  <option value="">Seleccione región...</option>
                  {regionesData.map(r => <option key={r.region} value={r.region}>{r.region}</option>)}
                </select>
              </div>

              <div className="col-6">
                <label className="form-label">Comuna</label>
                <select name="comuna" className="form-select" value={userForm.comuna} onChange={handleUserChange}>
                  <option value="">Seleccione comuna...</option>
                  {comunasList.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">Dirección</label>
                <input name="direccion" className="form-control" value={userForm.direccion} onChange={handleUserChange} />
              </div>

              <div className="col-6">
                <label className="form-label">Fecha Nacimiento</label>
                <input name="fechaNac" type="date" className="form-control" value={userForm.fechaNac} onChange={handleUserChange} />
              </div>
            </div>
            <div className="mt-2 d-flex gap-2">
              <button className="btn btn-success" onClick={saveUsuario}>Guardar</button>
              <button className="btn btn-secondary" onClick={() => { setUserForm(emptyUser); setEditingUserIndex(null); }}>Cancelar</button>
            </div>
            {userMsg && <p className="error mt-2">{userMsg}</p>}
          </div>
        </section>
      )}
    </div>
  );
}
