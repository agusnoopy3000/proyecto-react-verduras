import React, { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const cur = 'login';
    document.querySelectorAll('nav a').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href.includes(cur)) a.classList.add('active');
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Verificar admin fijo
    if (form.email === 'admin@huertohogar.cl' && form.password === 'admin123') {
      localStorage.setItem('huertohogar_user', JSON.stringify({ email: form.email, rol: 'admin' }));
      navigate('/admin');
      return;
    }
    // Verificar contra usuarios registrados (asumiendo que Registro.jsx guarda en 'users' con campo 'password')
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const found = users.find(u => u.email === form.email && u.password === form.password);
    if (found) {
      localStorage.setItem('huertohogar_user', JSON.stringify(found));
      navigate('/perfil');
    } else {
      alert('Credenciales inválidas');
    }
  };

  return (
    <>
      <main className="container">
        <section>
          <h2>Ingresar</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary">Ingresar</button>
          </form>
          <p><Link to="/registro">¿No tienes cuenta? Regístrate</Link></p>
        </section>
      </main>
    </>
  );
}
