import React, { useEffect, useState } from "react";
import Modal from "../components/Modal";
import productosDefault from "../data/productos"; // tu data inicial

export default function AdminProducts(){
  const key = "admin_products";
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({codigo:'',nombre:'',precio:'',origen:'',stock:''});
  const [errors, setErrors] = useState({});

  useEffect(()=>{
    const saved = localStorage.getItem(key);
    setItems(saved ? JSON.parse(saved) : productosDefault || []);
  },[]);

  useEffect(()=> localStorage.setItem(key, JSON.stringify(items)), [items]);

  const openAdd = () => { setEdit(null); setForm({codigo:'',nombre:'',precio:'',origen:'',stock:''}); setErrors({}); setOpen(true); };
  const openEdit = (it) => { setEdit(it.codigo || it.id); setForm({codigo:it.codigo||'', nombre:it.nombre||'', precio:it.precio||0, origen:it.origen||'', stock:it.stock||0}); setErrors({}); setOpen(true); };

  const validateForm = () => {
    const e = {};
    if (!form.nombre || !form.nombre.trim()) e.nombre = "Nombre requerido.";
    if (!form.origen || !form.origen.trim()) e.origen = "Origen requerido.";
    const precioNum = parseFloat(form.precio);
    if (isNaN(precioNum) || precioNum < 0) e.precio = "Precio inválido (>= 0).";
    const stockNum = parseInt(form.stock, 10);
    if (isNaN(stockNum) || stockNum < 0) e.stock = "Stock inválido (entero >= 0).";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = () => {
    if (!validateForm()) return;
    const toSave = { ...form, precio: parseFloat(form.precio), stock: parseInt(form.stock||0,10) };
    if (edit) {
      setItems(prev => prev.map(p => (p.codigo===edit ? {...p,...toSave} : p)));
    } else {
      setItems(prev => [{...toSave, codigo: form.codigo || `PX${Date.now()}`}, ...prev]);
    }
    setOpen(false);
  };

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <h3>Productos</h3>
        <div>
          <button className="btn ghost" onClick={openAdd}>Agregar Producto</button>
        </div>
      </div>

      <table className="table">
        <thead><tr><th>Código</th><th>Nombre</th><th>Origen</th><th>Stock</th><th>Precio</th><th>Acciones</th></tr></thead>
        <tbody>
          {items.map(p => (
            <tr key={p.codigo || p.id}>
              <td>{p.codigo}</td>
              <td>{p.nombre}</td>
              <td>{p.origen}</td>
              <td>{p.stock}</td>
              <td>{p.precio}</td>
              <td>
                <button className="btn ghost" onClick={()=>openEdit(p)}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal open={open} title={edit ? "Editar producto" : "Agregar producto"} onClose={()=>setOpen(false)}>
        <div style={{display:'grid',gap:8}}>
          <label>Código</label>
          <input value={form.codigo} onChange={e=>setForm(f=>({...f,codigo:e.target.value}))} className="form-control"/>
          <label>Nombre</label>
          <input value={form.nombre} onChange={e=>setForm(f=>({...f,nombre:e.target.value}))} className="form-control"/>
          {errors.nombre && <div className="error" style={{color:'#b00020'}}>{errors.nombre}</div>}
          <label>Origen</label>
          <input value={form.origen} onChange={e=>setForm(f=>({...f,origen:e.target.value}))} className="form-control"/>
          {errors.origen && <div className="error" style={{color:'#b00020'}}>{errors.origen}</div>}
          <label>Stock</label>
          <input type="number" value={form.stock} onChange={e=>setForm(f=>({...f,stock:e.target.value}))} className="form-control"/>
          {errors.stock && <div className="error" style={{color:'#b00020'}}>{errors.stock}</div>}
          <label>Precio</label>
          <input type="number" step="0.01" value={form.precio} onChange={e=>setForm(f=>({...f,precio:e.target.value}))} className="form-control"/>
          {errors.precio && <div className="error" style={{color:'#b00020'}}>{errors.precio}</div>}
          <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:8}}>
            <button className="btn ghost" onClick={()=>setOpen(false)}>Cancelar</button>
            <button className="btn btn-success" onClick={save}>Guardar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}