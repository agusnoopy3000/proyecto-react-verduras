import React, { useEffect, useState } from "react";
import Modal from "../components/Modal";

export default function AdminUsers(){
  const key = "admin_users";
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({id:'',nombre:'',email:''});

  useEffect(()=>{
    const saved = localStorage.getItem(key);
    setItems(saved ? JSON.parse(saved) : []);
  },[]);

  useEffect(()=> localStorage.setItem(key, JSON.stringify(items)), [items]);

  const openAdd = () => { setEdit(null); setForm({id:'',nombre:'',email:''}); setOpen(true); };
  const openEdit = (it) => { setEdit(it.id); setForm({...it}); setOpen(true); };

  const save = () => {
    if (edit) {
      setItems(prev => prev.map(u => (u.id===edit ? {...u,...form} : u)));
    } else {
      setItems(prev => [{...form, id: form.id || `U${Date.now()}`}, ...prev]);
    }
    setOpen(false);
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