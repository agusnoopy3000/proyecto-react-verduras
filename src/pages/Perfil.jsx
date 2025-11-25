import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Perfil() {
  const { user, logout, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cur = 'perfil';
    document.querySelectorAll('nav a').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href.includes(cur)) a.classList.add('active');
    });

    if (isAuthenticated) {
      (async () => {
        try {
          const { data } = await api.get('/v1/users/me');
          setProfile(data);
        } catch (e) {
          console.error('Error cargando perfil', e);
        }
      })();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    toast.success('Sesión Cerrada Exitosamente', { icon: '🚪' });
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <main className="container">
        <section>
          <h2>Perfil</h2>
          <p>No se ha registrado, cree una <Link to="/registro">cuenta</Link>.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="container">
      <section>
        <h2>Perfil de Usuario</h2>
        <div className="row">
          <div className="col-md-6">
            <div className="card shadow-sm mb-3">
              <div className="card-body">
                <h5 className="card-title">Información Personal</h5>
                <p className="card-text">
                  <strong>RUN:</strong> {profile?.run || 'No especificado'}<br />
                  <strong>Nombre:</strong> {profile?.nombre || 'No especificado'}<br />
                  <strong>Apellidos:</strong> {profile?.apellidos || 'No especificado'}<br />
                  <strong>Email:</strong> {profile?.email || user?.email}
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm mb-3">
              <div className="card-body">
                <h5 className="card-title">Ubicación</h5>
                <p className="card-text">
                  <strong>Región:</strong> {profile?.region || 'No especificada'}<br />
                  <strong>Comuna:</strong> {profile?.comuna || 'No especificada'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <button className="btn btn-danger" onClick={handleLogout}>Cerrar Sesión</button>
      </section>
    </main>
  );
}