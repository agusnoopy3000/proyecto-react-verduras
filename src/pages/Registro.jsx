import React, { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import regionesData from "../data/regiones_comunas";
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

export default function Registro() {
  const [form, setForm] = useState({ run: '', nombre: '', apellidos: '', email: '', password: '', confirmPassword: '' });
  const [regMsg, setRegMsg] = useState("");
  const [region, setRegion] = useState("");
  const [comuna, setComuna] = useState("");
  const [comunasList, setComunasList] = useState([]);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth();

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // nombre - Requerido por backend
    if (!form.nombre || form.nombre.trim().length < 2) newErrors.nombre = 'El nombre es obligatorio (mínimo 2 caracteres).';
    else if (form.nombre.length > 100) newErrors.nombre = 'El nombre no puede superar 100 caracteres.';

    // apellidos - Requerido por backend (campo "apellidos", no "apellido")
    if (!form.apellidos || form.apellidos.trim().length < 2) newErrors.apellidos = 'Los apellidos son obligatorios (mínimo 2 caracteres).';
    else if (form.apellidos.length > 100) newErrors.apellidos = 'Los apellidos no pueden superar 100 caracteres.';

    // RUT: normalizamos y validamos con función
    const rutRaw = (form.run || '').toString().replace(/[\.\-\s]/g, '');
    if (!rutRaw) newErrors.run = 'El RUN es obligatorio.';
    else if (!/^\d{7,8}[\dKk]$/.test(rutRaw) || !validarRun(rutRaw)) newErrors.run = 'RUT no válido. Formato esperado: 19011022K o 19.011.022-K';

    // email - Requerido por backend, formato email válido
    if (!form.email) newErrors.email = 'El email es obligatorio.';
    else if (form.email.length > 100) newErrors.email = 'El email no puede superar 100 caracteres.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Ingresa un email válido.';

    // contraseña - Backend requiere mínimo 8 caracteres y al menos 1 carácter especial
    const specialCharRegex = /[^A-Za-z0-9]/;
    if (!form.password) newErrors.password = 'La contraseña es obligatoria.';
    else if (form.password.length < 8) newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
    else if (!specialCharRegex.test(form.password)) newErrors.password = 'La contraseña debe incluir al menos un carácter especial (ej: !@#$%).';
    else if (form.password.length > 100) newErrors.password = 'La contraseña es demasiado larga.';

    // confirmar contraseña
    if (!form.confirmPassword) newErrors.confirmPassword = 'Confirmar contraseña es obligatorio.';
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden.';

    // región/comuna
    if (region && !comuna) {
      newErrors.comuna = 'Si seleccionas región, debes seleccionar comuna.';
    }

    setErrors(newErrors);

    const anyError = Object.keys(newErrors).length > 0;
    setRegMsg(anyError ? 'Hay errores en el formulario. Revisa los campos señalados.' : '');
    if (anyError) return;

    const raw = (form.run || '').toString().replace(/[\.\-\s]/g, '').toUpperCase();
    const cuerpo = raw.slice(0, -1);
    const dv = raw.slice(-1);
    const formattedRut = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "-" + dv;

    const payload = {
      run: formattedRut,
      nombre: form.nombre,
      apellidos: form.apellidos,
      email: form.email,
      password: form.password,
      direccion: `${region ? region + ', ' : ''}${comuna ? comuna + ', ' : ''}`.trim(),
      telefono: ''
    };

    const res = await register(payload);
    if (res.ok) {
      setRegisteredEmail(form.email);
      setShowSuccessModal(true);
    } else {
      setRegMsg(res.message || 'Error al registrar usuario');
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate('/login');
  };

  return (
    <>
      <main className="container">
        <section>
          <h2>Registro</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">RUN</label>
              <input type="text" name="run" className="form-control" value={form.run} onChange={handleChange} required />
              {errors.run && <div className="error">{errors.run}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input type="text" name="nombre" className="form-control" value={form.nombre} onChange={handleChange} required />
              {errors.nombre && <div className="error">{errors.nombre}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Apellidos</label>
              <input type="text" name="apellidos" className="form-control" value={form.apellidos} onChange={handleChange} required />
              {errors.apellidos && <div className="error">{errors.apellidos}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
              {errors.email && <div className="error">{errors.email}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required />
              {errors.password && <div className="error">{errors.password}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Confirmar Contraseña</label>
              <input type="password" name="confirmPassword" className="form-control" value={form.confirmPassword} onChange={handleChange} required />
              {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Región</label>
              <select id="regRegion" className="form-select" value={region} onChange={e => { const r = e.target.value; setRegion(r); const found = regionesData.find(x => x.region === r); setComunasList(found ? found.comunas : []); setComuna(''); }}>
                <option value="">Seleccione región...</option>
                {regionesData.map(r => <option key={r.region} value={r.region}>{r.region}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Comuna</label>
              <select id="regComuna" className="form-select" value={comuna} onChange={e => setComuna(e.target.value)}>
                <option value="">Seleccione comuna...</option>
                {comunasList.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.comuna && <div className="error">{errors.comuna}</div>}
            </div>
            <button type="submit" className="btn btn-primary">Registrar</button>
          </form>
          <p id="regMsg" className="error" style={{color: regMsg ? 'var(--bs-danger)' : 'inherit'}}>{regMsg}</p>
          <p><Link to="/login">¿Ya tienes cuenta? Ingresa</Link></p>
        </section>
      </main>

      {/* Modal de registro exitoso */}
      <Modal open={showSuccessModal} title="🎉 ¡Registro Exitoso!" onClose={handleSuccessClose}>
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ 
            width: 80, 
            height: 80, 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #28a745, #20c997)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
          }}>
            <span style={{ fontSize: 40, color: '#fff' }}>✓</span>
          </div>
          
          <h3 style={{ color: '#28a745', marginBottom: 12 }}>¡Bienvenido a HuertoHogar!</h3>
          
          <p style={{ color: '#666', marginBottom: 8 }}>
            Tu cuenta ha sido creada correctamente.
          </p>
          
          <p style={{ 
            background: '#f8f9fa', 
            padding: '12px 16px', 
            borderRadius: 8, 
            marginBottom: 20,
            color: '#495057'
          }}>
            <strong>Email registrado:</strong><br />
            <span style={{ color: '#28a745' }}>{registeredEmail}</span>
          </p>
          
          <p style={{ color: '#666', fontSize: 14, marginBottom: 20 }}>
            Ya puedes iniciar sesión con tus credenciales y comenzar a disfrutar de nuestros productos frescos.
          </p>
          
          <button 
            className="btn btn-success" 
            onClick={handleSuccessClose}
            style={{ 
              padding: '12px 32px', 
              fontSize: 16,
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(40, 167, 69, 0.3)'
            }}
          >
            Ir a Iniciar Sesión
          </button>
        </div>
      </Modal>
    </>
  );
}
