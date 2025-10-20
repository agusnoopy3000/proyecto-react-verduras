import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import regionesData from "../data/regiones_comunas";
import { useAuth } from "../context/AuthContext";

export default function Perfil() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("huertohogar_user");
    setUser(saved ? JSON.parse(saved) : null);
  }, []);

  if (!user) {
    return (
      <main className="container">
        <h2>Perfil</h2>
        <p>No hay usuario registrado. <a href="/registro">Crear cuenta</a></p>
      </main>
    );
  }

  const { user: authUser } = useAuth();
  const [nombre, setNombre] = useState(authUser?.nombre || "");
  const [email] = useState(authUser?.email || ""); // campo disabled
  const [tel, setTel] = useState("");
  const [msg, setMsg] = useState("");
  const [region, setRegion] = useState("");
  const [comuna, setComuna] = useState("");
  const [comunasList, setComunasList] = useState([]);

  useEffect(() => {
    const cur = 'perfil';
    document.querySelectorAll('nav a').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href.includes(cur)) a.classList.add('active');
    });
  }, []);

  const guardar = (e) => {
    e?.preventDefault();
    let m = '';
    if (!nombre.trim()) m = 'El nombre es requerido.';
    else if (nombre.length > 100) m = 'El nombre no puede superar 100 caracteres.';
    else if (tel && tel.length > 20) m = 'Teléfono demasiado largo.';

    setMsg(m);
    if (!m) {
      setMsg('Perfil guardado correctamente.');
    }
  };

  return (
    <>
      <main className="container">
        <section className="form">
          <h2>Mi perfil</h2>
          <label className="form-label" htmlFor="perNombre">Nombre</label>
          <input id="perNombre" type="text" className="form-control" value={nombre} onChange={e => setNombre(e.target.value)} />

          <label className="form-label" htmlFor="perEmail">Email</label>
          <input id="perEmail" type="email" disabled className="form-control" value={email} />

          <label className="form-label" htmlFor="perRegion">Región</label>
          <select id="perRegion" className="form-select" value={region} onChange={e => { const r = e.target.value; setRegion(r); const found = regionesData.find(x => x.region === r); setComunasList(found ? found.comunas : []); setComuna(''); }}>
            <option value="">Seleccione región...</option>
            {regionesData.map(r => <option key={r.region} value={r.region}>{r.region}</option>)}
          </select>

          <label className="form-label" htmlFor="perComuna">Comuna</label>
          <select id="perComuna" className="form-select" value={comuna} onChange={e => setComuna(e.target.value)}>
            <option value="">Seleccione comuna...</option>
            {comunasList.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <label className="form-label" htmlFor="perTel">Teléfono</label>
          <input id="perTel" type="tel" className="form-control" value={tel} onChange={e => setTel(e.target.value)} />

          <div style={{height:12}} />
          <button className="btn btn-success mt-3" id="btnGuardarPerfil" onClick={guardar}>Guardar</button>
          <p id="perfilMsg" className="help" style={{color: msg ? 'var(--bs-success)' : 'inherit'}}>{msg}</p>
        </section>
      </main>

      <footer className="site">
        <div className="container inner">
          <div className="cols">
            <div>
              <strong>HuertoHogar</strong>
              <p>Productos frescos y orgánicos. Calidad local.</p>
            </div>
            <div>
              <p><strong>Tiendas</strong></p>
              <p>Santiago · Puerto Montt · Villarrica · Nacimiento</p>
              <p>Viña del Mar · Valparaíso · Concepción</p>
            </div>
            <div>
              <p><strong>Contacto</strong></p>
              <p>contacto@huertohogar.cl</p>
            </div>
          </div>
          <div>© 2025 HuertoHogar · Sitio educativo</div>
        </div>
      </footer>
    </>
  );
}
