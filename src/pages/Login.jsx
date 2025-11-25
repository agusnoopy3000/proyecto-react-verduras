import React, { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(form.email, form.password);
    if (res.ok) {
      if (res.user.role === 'ADMIN') navigate('/admin');
      else navigate('/perfil');
    } else {
      setError(res.message || 'Credenciales inválidas');
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
            {error && <p className="text-danger">{error}</p>}
            <button type="submit" className="btn btn-primary">Ingresar</button>
          </form>
          <p><Link to="/registro">¿No tienes cuenta? Regístrate</Link></p>
        </section>
      </main>
    </>
  );
}
