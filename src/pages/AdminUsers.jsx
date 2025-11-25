import React, { useEffect, useState } from "react";
import Modal from "../components/Modal";
import api from '../api/client';

export default function AdminUsers(){
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({id:'',nombre:'',email:''});

  useEffect(()=>{
    (async () => {
      try {
        const { data } = await api.get('/v1/users', { params: { page: 0, size: 50 } });
        setItems(data?.content || data || []);
      } catch (e) {
        console.error('Error cargando usuarios', e);
      }
    })();
  },[]);

  const openAdd = () => { setEdit(null); setForm({id:'',nombre:'',email:''}); setOpen(true); };
  const openEdit = (it) => { setEdit(it.id); setForm({...it}); setOpen(true); };

  const save = async () => {
    try {
      if (edit) {
        const { data } = await api.put(`/v1/users/${edit}`, form);
        setItems(prev => prev.map(u => (u.email===edit || u.id===edit ? data : u)));
      } else {
        const { data } = await api.post('/v1/users', form);
        setItems(prev => [data, ...prev]);
      }
      setOpen(false);
    } catch (e) {
      console.error('Error guardando usuario', e);
    }
  };

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <h3>Usuarios</h3>
        <div>
          <button className="btn ghost" onClick={openAdd}>Agregar Usuario</button>
        </div>
      </div>

      <table className="table">
        <thead><tr><th>ID</th><th>Nombre</th><th>Email</th><th>Acciones</th></tr></thead>
        <tbody>
          {items.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombre}</td>
              <td>{u.email}</td>
              <td>
                <button className="btn ghost" onClick={()=>openEdit(u)}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal open={open} title={edit ? "Editar usuario" : "Agregar usuario"} onClose={()=>setOpen(false)}>
        <div style={{display:'grid',gap:8}}>
          <label>ID</label>
          <input value={form.id} onChange={e=>setForm(f=>({...f,id:e.target.value}))} className="form-control"/>
          <label>Nombre</label>
          <input value={form.nombre} onChange={e=>setForm(f=>({...f,nombre:e.target.value}))} className="form-control"/>
          <label>Email</label>
          <input value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} className="form-control"/>
          <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:8}}>
            <button className="btn ghost" onClick={()=>setOpen(false)}>Cancelar</button>
            <button className="btn btn-success" onClick={save}>Guardar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}