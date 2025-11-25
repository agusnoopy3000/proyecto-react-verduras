import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import Modal from "../components/Modal";
import api from '../api/client';

export default function AdminProducts(){
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({codigo:'',nombre:'',precio:'',origen:'',stock:''});
  const [errors, setErrors] = useState({});

  useEffect(()=>{
    (async () => {
      try {
        const { data } = await api.get('/v1/products');
        setItems(data);
      } catch (e) {
        console.error('Error cargando productos', e);
      }
    })();
  },[]);

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

  const save = async () => {
    if (!validateForm()) return;
    const toSave = { ...form, precio: parseFloat(form.precio), stock: parseInt(form.stock||0,10) };
    try {
      if (edit) {
        const { data } = await api.put(`/v1/products/${edit}`, toSave);
        setItems(prev => prev.map(p => (p.codigo===edit ? data : p)));
        toast.success('Producto modificado');
      } else {
        const { data } = await api.post('/v1/products', toSave);
        setItems(prev => [data, ...prev]);
        toast.success('Producto añadido');
      }
      setOpen(false);
    } catch (e) {
      console.error('Error guardando producto', e);
      toast.error('No se pudo guardar el producto');
    }
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
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Código</label>
            <input value={form.codigo} onChange={e=>setForm(f=>({...f,codigo:e.target.value}))} className="form-control"/>
          </div>
          <div className="col-md-6">
            <label className="form-label">Nombre</label>
            <input value={form.nombre} onChange={e=>setForm(f=>({...f,nombre:e.target.value}))} className="form-control"/>
            {errors.nombre && <div className="text-danger">{errors.nombre}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Origen</label>
            <input value={form.origen} onChange={e=>setForm(f=>({...f,origen:e.target.value}))} className="form-control"/>
            {errors.origen && <div className="text-danger">{errors.origen}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Stock</label>
            <input type="number" value={form.stock} onChange={e=>setForm(f=>({...f,stock:e.target.value}))} className="form-control"/>
            {errors.stock && <div className="text-danger">{errors.stock}</div>}
          </div>
          <div className="col-12">
            <label className="form-label">Precio</label>
            <input type="number" step="0.01" value={form.precio} onChange={e=>setForm(f=>({...f,precio:e.target.value}))} className="form-control"/>
            {errors.precio && <div className="text-danger">{errors.precio}</div>}
          </div>
          <div className="col-12" style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
            <button className="btn ghost" onClick={()=>setOpen(false)}>Cancelar</button>
            <button className="btn btn-success" onClick={save}>Guardar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}