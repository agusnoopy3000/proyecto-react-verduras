// filepath: /Users/agustingarridosnoopy/Downloads/proyecto-react-verduras-main/src/pages/Registro.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import regionesData from "../data/regiones_comunas";
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

export default function Registro() {
  const [form, setForm] = useState({ 
    run: '', 
    nombre: '', 
    apellidos: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [regMsg, setRegMsg] = useState("");
  const [region, setRegion] = useState("");
  const [comuna, setComuna] = useState("");
  const [comunasList, setComunasList] = useState([]);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { register } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function validarRun(rutInput) {
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
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validateStep1 = () => {
    const newErrors = {};
    const rutRaw = (form.run || '').toString().replace(/[\.\-\s]/g, '');
    if (!rutRaw) newErrors.run = 'El RUN es obligatorio.';
    else if (!/^\d{7,8}[\dKk]$/.test(rutRaw) || !validarRun(rutRaw)) 
      newErrors.run = 'RUT no válido. Formato: 12345678-9';
    if (!form.nombre || form.nombre.trim().length < 2) 
      newErrors.nombre = 'El nombre es obligatorio (mínimo 2 caracteres).';
    if (!form.apellidos || form.apellidos.trim().length < 2) 
      newErrors.apellidos = 'Los apellidos son obligatorios (mínimo 2 caracteres).';
    if (!form.email) newErrors.email = 'El email es obligatorio.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Email inválido.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    const specialCharRegex = /[^A-Za-z0-9]/;
    if (!form.password) newErrors.password = 'La contraseña es obligatoria.';
    else if (form.password.length < 8) newErrors.password = 'Mínimo 8 caracteres.';
    else if (!specialCharRegex.test(form.password)) 
      newErrors.password = 'Debe incluir al menos un carácter especial.';
    if (!form.confirmPassword) newErrors.confirmPassword = 'Confirma tu contraseña.';
    else if (form.password !== form.confirmPassword) 
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
    if (region && !comuna) newErrors.comuna = 'Selecciona una comuna.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => { if (validateStep1()) { setStep(2); setRegMsg(''); } };
  const handleBack = () => { setStep(1); setErrors({}); setRegMsg(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) { handleNext(); return; }
    if (!validateStep2()) { setRegMsg('Corrige los errores.'); return; }
    setLoading(true); setRegMsg('');
    const raw = (form.run || '').toString().replace(/[\.\-\s]/g, '').toUpperCase();
    const cuerpo = raw.slice(0, -1);
    const dv = raw.slice(-1);
    const formattedRut = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "-" + dv;
    const payload = {
      run: formattedRut, nombre: form.nombre, apellidos: form.apellidos,
      email: form.email, password: form.password,
      direccion: `${region ? region + ', ' : ''}${comuna ? comuna + ', ' : ''}`.trim(), telefono: ''
    };
    const res = await register(payload);
    setLoading(false);
    if (res.ok) { setRegisteredEmail(form.email); setShowSuccessModal(true); }
    else { setRegMsg(res.message || 'Error al registrar'); }
  };

  const handleSuccessClose = () => { setShowSuccessModal(false); navigate('/login'); };

  const getPasswordStrength = () => {
    const pwd = form.password;
    if (!pwd) return { level: 0, text: '', color: '#e9ecef' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 2) return { level: 1, text: 'Débil', color: '#dc3545' };
    if (score <= 4) return { level: 2, text: 'Media', color: '#ffc107' };
    return { level: 3, text: 'Fuerte', color: '#28a745' };
  };
  const passwordStrength = getPasswordStrength();

  const styles = {
    container: { minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' },
    card: { width: '100%', maxWidth: 520, background: '#fff', borderRadius: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.1)', overflow: 'hidden' },
    header: { background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', padding: '40px 32px 30px', textAlign: 'center', color: '#fff' },
    iconCircle: { width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 36 },
    title: { fontSize: 28, fontWeight: 700, marginBottom: 8 },
    subtitle: { opacity: 0.9, fontSize: 15 },
    stepIndicator: { display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 },
    stepDot: { width: 10, height: 10, borderRadius: '50%', transition: 'all 0.3s' },
    formBody: { padding: '32px' },
    inputGroup: { marginBottom: 18 },
    label: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontWeight: 600, color: '#2d3436', fontSize: 14 },
    inputWrapper: { position: 'relative' },
    input: { width: '100%', padding: '14px 16px', fontSize: 15, border: '2px solid #e9ecef', borderRadius: 12, outline: 'none', boxSizing: 'border-box' },
    inputError: { borderColor: '#dc3545' },
    select: { width: '100%', padding: '14px 16px', fontSize: 15, border: '2px solid #e9ecef', borderRadius: 12, background: '#fff', cursor: 'pointer', outline: 'none', boxSizing: 'border-box' },
    errorText: { color: '#dc3545', fontSize: 13, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 },
    passwordToggle: { position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#adb5bd', cursor: 'pointer', fontSize: 18, padding: 0 },
    strengthBar: { display: 'flex', gap: 4, marginTop: 8 },
    strengthSegment: { flex: 1, height: 4, borderRadius: 2, background: '#e9ecef' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
    buttonRow: { display: 'flex', gap: 12, marginTop: 24 },
    btnPrimary: { flex: 1, padding: '16px', fontSize: 16, fontWeight: 600, color: '#fff', background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', border: 'none', borderRadius: 12, cursor: 'pointer', boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)' },
    btnSecondary: { padding: '16px 24px', fontSize: 16, fontWeight: 600, color: '#636e72', background: '#f8f9fa', border: '2px solid #e9ecef', borderRadius: 12, cursor: 'pointer' },
    globalError: { background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', padding: '12px 16px', borderRadius: 10, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 },
    footer: { textAlign: 'center', paddingTop: 16, borderTop: '1px solid #f0f0f0', marginTop: 20 },
    hint: { color: '#999', fontSize: 12, marginTop: 4 }
  };

  return (
    <>
      <main style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.iconCircle}>🌿</div>
            <h1 style={styles.title}>Crear Cuenta</h1>
            <p style={styles.subtitle}>Únete a la comunidad HuertoHogar</p>
            <div style={styles.stepIndicator}>
              <div style={{...styles.stepDot, background: step >= 1 ? '#fff' : 'rgba(255,255,255,0.3)', transform: step === 1 ? 'scale(1.3)' : 'scale(1)'}}></div>
              <div style={{...styles.stepDot, background: step >= 2 ? '#fff' : 'rgba(255,255,255,0.3)', transform: step === 2 ? 'scale(1.3)' : 'scale(1)'}}></div>
            </div>
          </div>

          <div style={styles.formBody}>
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <>
                  <p style={{ color: '#636e72', marginBottom: 24, fontSize: 14 }}>📋 <strong>Paso 1 de 2:</strong> Datos personales</p>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}><span>🪪</span> RUN</label>
                    <input type="text" name="run" value={form.run} onChange={handleChange} placeholder="12.345.678-9" style={{...styles.input, ...(errors.run ? styles.inputError : {})}} onFocus={(e) => e.target.style.borderColor = '#28a745'} onBlur={(e) => e.target.style.borderColor = errors.run ? '#dc3545' : '#e9ecef'} />
                    {errors.run && <div style={styles.errorText}>⚠️ {errors.run}</div>}
                  </div>
                  <div style={styles.row}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}><span>👤</span> Nombre</label>
                      <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Tu nombre" style={{...styles.input, ...(errors.nombre ? styles.inputError : {})}} onFocus={(e) => e.target.style.borderColor = '#28a745'} onBlur={(e) => e.target.style.borderColor = errors.nombre ? '#dc3545' : '#e9ecef'} />
                      {errors.nombre && <div style={styles.errorText}>⚠️ {errors.nombre}</div>}
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}><span>👥</span> Apellidos</label>
                      <input type="text" name="apellidos" value={form.apellidos} onChange={handleChange} placeholder="Tus apellidos" style={{...styles.input, ...(errors.apellidos ? styles.inputError : {})}} onFocus={(e) => e.target.style.borderColor = '#28a745'} onBlur={(e) => e.target.style.borderColor = errors.apellidos ? '#dc3545' : '#e9ecef'} />
                      {errors.apellidos && <div style={styles.errorText}>⚠️ {errors.apellidos}</div>}
                    </div>
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}><span>📧</span> Correo Electrónico</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" style={{...styles.input, ...(errors.email ? styles.inputError : {})}} onFocus={(e) => e.target.style.borderColor = '#28a745'} onBlur={(e) => e.target.style.borderColor = errors.email ? '#dc3545' : '#e9ecef'} />
                    {errors.email && <div style={styles.errorText}>⚠️ {errors.email}</div>}
                  </div>
                  <div style={{ marginTop: 24 }}>
                    <button type="button" onClick={handleNext} style={styles.btnPrimary} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(40, 167, 69, 0.4)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(40, 167, 69, 0.3)'; }}>Continuar →</button>
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  <p style={{ color: '#636e72', marginBottom: 24, fontSize: 14 }}>🔐 <strong>Paso 2 de 2:</strong> Ubicación y seguridad</p>
                  <div style={styles.row}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}><span>📍</span> Región</label>
                      <select value={region} onChange={e => { const r = e.target.value; setRegion(r); const found = regionesData.find(x => x.region === r); setComunasList(found ? found.comunas : []); setComuna(''); }} style={styles.select}>
                        <option value="">Seleccionar...</option>
                        {regionesData.map(r => <option key={r.region} value={r.region}>{r.region}</option>)}
                      </select>
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}><span>🏘️</span> Comuna</label>
                      <select value={comuna} onChange={e => setComuna(e.target.value)} style={{...styles.select, ...(errors.comuna ? styles.inputError : {})}} disabled={!region}>
                        <option value="">Seleccionar...</option>
                        {comunasList.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {errors.comuna && <div style={styles.errorText}>⚠️ {errors.comuna}</div>}
                    </div>
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}><span>🔒</span> Contraseña</label>
                    <div style={styles.inputWrapper}>
                      <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="Mínimo 8 caracteres" style={{...styles.input, paddingRight: 48, ...(errors.password ? styles.inputError : {})}} onFocus={(e) => e.target.style.borderColor = '#28a745'} onBlur={(e) => e.target.style.borderColor = errors.password ? '#dc3545' : '#e9ecef'} />
                      <button type="button" style={styles.passwordToggle} onClick={() => setShowPassword(!showPassword)}>{showPassword ? '🙈' : '👁️'}</button>
                    </div>
                    {form.password && (
                      <div>
                        <div style={styles.strengthBar}>{[1, 2, 3].map(i => <div key={i} style={{...styles.strengthSegment, background: i <= passwordStrength.level ? passwordStrength.color : '#e9ecef'}}></div>)}</div>
                        <div style={{ fontSize: 12, color: passwordStrength.color, marginTop: 4 }}>Seguridad: {passwordStrength.text}</div>
                      </div>
                    )}
                    {errors.password && <div style={styles.errorText}>⚠️ {errors.password}</div>}
                    <div style={styles.hint}>Incluye letras, números y un carácter especial</div>
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}><span>🔐</span> Confirmar Contraseña</label>
                    <div style={styles.inputWrapper}>
                      <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Repite tu contraseña" style={{...styles.input, paddingRight: 48, ...(errors.confirmPassword ? styles.inputError : {}), ...(form.confirmPassword && form.password === form.confirmPassword ? { borderColor: '#28a745' } : {})}} onFocus={(e) => e.target.style.borderColor = '#28a745'} onBlur={(e) => e.target.style.borderColor = errors.confirmPassword ? '#dc3545' : '#e9ecef'} />
                      <button type="button" style={styles.passwordToggle} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? '🙈' : '👁️'}</button>
                    </div>
                    {form.confirmPassword && form.password === form.confirmPassword && <div style={{ color: '#28a745', fontSize: 13, marginTop: 6 }}>✓ Las contraseñas coinciden</div>}
                    {errors.confirmPassword && <div style={styles.errorText}>⚠️ {errors.confirmPassword}</div>}
                  </div>
                  {regMsg && <div style={styles.globalError}><span>⚠️</span><span>{regMsg}</span></div>}
                  <div style={styles.buttonRow}>
                    <button type="button" onClick={handleBack} style={styles.btnSecondary}>← Atrás</button>
                    <button type="submit" disabled={loading} style={{...styles.btnPrimary, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer'}} onMouseOver={(e) => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(40, 167, 69, 0.4)'; }}} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(40, 167, 69, 0.3)'; }}>
                      {loading ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}><span className="spinner-border spinner-border-sm" role="status"></span>Registrando...</span> : 'Crear Cuenta'}
                    </button>
                  </div>
                </>
              )}
              <div style={styles.footer}>
                <p style={{ color: '#636e72', margin: 0 }}>¿Ya tienes cuenta? <Link to="/login" style={{ color: '#28a745', fontWeight: 600, textDecoration: 'none' }}>Inicia Sesión</Link></p>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Modal open={showSuccessModal} title="" onClose={handleSuccessClose}>
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, #28a745, #20c997)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 10px 30px rgba(40, 167, 69, 0.3)' }}><span style={{ fontSize: 50, color: '#fff' }}>🎉</span></div>
          <h2 style={{ color: '#2d3436', marginBottom: 8, fontSize: 28 }}>¡Bienvenido a HuertoHogar!</h2>
          <p style={{ color: '#636e72', marginBottom: 20, fontSize: 16 }}>Tu cuenta ha sido creada exitosamente</p>
          <div style={{ background: 'linear-gradient(135deg, #f0fff4, #e6ffed)', padding: '16px 20px', borderRadius: 12, marginBottom: 24, border: '1px solid #c6f6d5' }}>
            <div style={{ color: '#636e72', fontSize: 13, marginBottom: 4 }}>Email registrado</div>
            <div style={{ color: '#28a745', fontWeight: 600 }}>{registeredEmail}</div>
          </div>
          <p style={{ color: '#999', fontSize: 14, marginBottom: 24 }}>Ya puedes iniciar sesión y comenzar a disfrutar de productos frescos 🌱</p>
          <button onClick={handleSuccessClose} style={{ width: '100%', padding: '16px 32px', fontSize: 16, fontWeight: 600, color: '#fff', background: 'linear-gradient(135deg, #28a745, #20c997)', border: 'none', borderRadius: 12, cursor: 'pointer', boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)' }}>Ir a Iniciar Sesión →</button>
        </div>
      </Modal>
    </>
  );
}
