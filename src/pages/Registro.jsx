import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import regionesData from "../data/regiones_comunas";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [regMsg, setRegMsg] = useState("");
  const [region, setRegion] = useState("");
  const [comuna, setComuna] = useState("");
  const [comunasList, setComunasList] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const cur = 'registro';
    document.querySelectorAll('nav a').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href.includes(cur)) a.classList.add('active');
    });
    // precargar regiones (opcional)
    if (regionesData && regionesData.length) {
      // dejamos la lista de comunas vacía hasta seleccionar
    }
  }, []);

  function validarRun(rutInput) {
    // Normalizar: quitar puntos, guion y espacios, y pasar a mayúsculas
    const raw = (rutInput || '').toString().replace(/[\.\-\s]/g, '').toUpperCase();
    if (!/^\d{7,8}[\dK]$/.test(raw)) return false;
    const cuerpo = raw.slice(0, -1);
    const dv = raw.slice(-1);
    let suma = 0;
    let multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i], 10) * multiplo;
      multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }
    let dvEsperado = 11 - (suma % 11);
    dvEsperado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
    return dv === dvEsperado;
  }

  const handleRegistro = (e) => {
    e?.preventDefault();
    const newErrors = {};

    // nombre
    if (!nombre || nombre.trim().length < 3) newErrors.nombre = 'El nombre debe tener al menos 3 caracteres.';
    else if (nombre.length > 100) newErrors.nombre = 'El nombre no puede superar 100 caracteres.';

    // RUT: normalizamos y validamos con función
    const rutRaw = (rut || '').toString().replace(/[\.\-\s]/g, '');
    if (!rutRaw) newErrors.rut = 'El RUN es obligatorio.';
    else if (!/^\d{7,8}[\dKk]$/.test(rutRaw) || !validarRun(rutRaw)) newErrors.rut = 'RUT no válido. Formato esperado: 19011022K o 19.011.022-K';

    // email
    if (!email) newErrors.email = 'El email es obligatorio.';
    else if (email.length > 100) newErrors.email = 'El email no puede superar 100 caracteres.';
    else if (!/^.+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(email)) newErrors.email = 'Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.';

    // teléfono
    if (!tel) newErrors.tel = 'El teléfono es obligatorio.';
    else if (!/^\+?\d[\d\s-]{6,}$/.test(tel)) newErrors.tel = 'Teléfono inválido. Debe tener al menos 7 dígitos.';

    // contraseña: mínimo 7 caracteres y al menos 1 carácter especial
    const specialCharRegex = /[^A-Za-z0-9]/;
    if (!pass) newErrors.pass = 'La contraseña es obligatoria.';
    else if (pass.length < 7) newErrors.pass = 'La contraseña debe tener al menos 7 caracteres.';
    else if (!specialCharRegex.test(pass)) newErrors.pass = 'La contraseña debe incluir al menos un carácter especial (ej: !@#$%).';
    else if (pass.length > 100) newErrors.pass = 'La contraseña es demasiado larga.';

    // repetir contraseña
    if (!pass2) newErrors.pass2 = 'Repite la contraseña.';
    else if (pass !== pass2) newErrors.pass2 = 'Las contraseñas no coinciden.';

    // región/comuna
    if (region && !comuna) {
      newErrors.comuna = 'Si seleccionas región, debes seleccionar comuna.';
    }

    setErrors(newErrors);

    const anyError = Object.keys(newErrors).length > 0;
    setRegMsg(anyError ? 'Hay errores en el formulario. Revisa los campos señalados.' : '');

    if (!anyError) {
      // Normalizar rut para persistir si se necesita (formateado con guion)
      const raw = rutRaw.toUpperCase();
      const cuerpo = raw.slice(0, -1);
      const dv = raw.slice(-1);
      const formattedRut = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "-" + dv;
      const user = { nombre, rut: formattedRut, email, tel, region, comuna };
      localStorage.setItem('huertohogar_user', JSON.stringify(user));
      // aquí podrías enviar datos al servidor...
      alert('Registro exitoso');
      // opcional: limpiar formulario o navegar
      navigate('/perfil');
    }
  };

  return (
    <>
      <main className="container">
        <section className="form">
          <h2>Crear cuenta</h2>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
            <div>
              <label className="form-label" htmlFor="regNombre">Nombre</label>
              <input id="regNombre" type="text" autoComplete="name" className="form-control" value={nombre} onChange={e => setNombre(e.target.value)} />
              {errors.nombre && <div className="error">{errors.nombre}</div>}

              <label className="form-label" htmlFor="regRut">RUN</label>
              <input id="regRut" type="text" autoComplete="off" className="form-control" required placeholder="Ej: 19011022K o 19.011.022-K" value={rut} onChange={e => setRut(e.target.value)} />
              {errors.rut && <div className="error">{errors.rut}</div>}

              <label className="form-label" htmlFor="regEmail">Email</label>
              <input id="regEmail" type="email" autoComplete="email" className="form-control" required value={email} onChange={e => setEmail(e.target.value)} />
              {errors.email && <div className="error">{errors.email}</div>}

              <label className="form-label" htmlFor="regTel">Teléfono</label>
              <input id="regTel" type="tel" autoComplete="tel" className="form-control" required pattern="\+?\d[\d\s-]{6,}" value={tel} onChange={e => setTel(e.target.value)} />
              {errors.tel && <div className="error">{errors.tel}</div>}

              <label className="form-label" htmlFor="regRegion">Región</label>
              <select id="regRegion" className="form-select" value={region} onChange={e => { const r = e.target.value; setRegion(r); const found = regionesData.find(x => x.region === r); setComunasList(found ? found.comunas : []); setComuna(''); }}>
                <option value="">Seleccione región...</option>
                {regionesData.map(r => <option key={r.region} value={r.region}>{r.region}</option>)}
              </select>

              <label className="form-label" htmlFor="regComuna">Comuna</label>
              <select id="regComuna" className="form-select" value={comuna} onChange={e => setComuna(e.target.value)}>
                <option value="">Seleccione comuna...</option>
                {comunasList.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.comuna && <div className="error">{errors.comuna}</div>}

              <label className="form-label" htmlFor="regPass">Contraseña</label>
              <input id="regPass" type="password" autoComplete="new-password" className="form-control" required minLength={7} maxLength={100} value={pass} onChange={e => setPass(e.target.value)} />
              {errors.pass && <div className="error">{errors.pass}</div>}

              <label className="form-label" htmlFor="regPass2">Repite contraseña</label>
              <input id="regPass2" type="password" autoComplete="new-password" className="form-control" required minLength={7} maxLength={100} value={pass2} onChange={e => setPass2(e.target.value)} />
              {errors.pass2 && <div className="error">{errors.pass2}</div>}

              <div style={{height:12}} />
              <button className="btn btn-success mt-3" id="btnRegistro" type="button" onClick={handleRegistro}>Registrarme</button>
              <p id="regMsg" className="error" style={{color: regMsg ? 'var(--bs-danger)' : 'inherit'}}>{regMsg}</p>
              <p className="help">Al registrarte aceptas términos del curso.</p>
            </div>

            <div>
              <p><strong>Ventajas</strong></p>
              <ul>
                <li>Seguimiento de pedidos</li>
                <li>Historial de compras</li>
                <li>Ofertas personalizadas</li>
              </ul>
            </div>
          </div>
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
