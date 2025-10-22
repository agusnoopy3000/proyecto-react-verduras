import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';

export default function Perfil() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const cur = 'perfil';
    document.querySelectorAll('nav a').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href.includes(cur)) a.classList.add('active');
    });

    // Cargar datos del usuario desde localStorage
    const storedUser = localStorage.getItem('huertohogar_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('huertohogar_user');
    setUser(null);
    toast.success('Sesión Cerrada Exitosamente', { icon: '🚪' });
  };

  if (!user) {
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
                  <strong>RUN:</strong> {user.run}<br />
                  <strong>Nombre:</strong> {user.nombre}<br />
                  <strong>Apellidos:</strong> {user.apellidos}<br />
                  <strong>Email:</strong> {user.email}
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm mb-3">
              <div className="card-body">
                <h5 className="card-title">Ubicación</h5>
                <p className="card-text">
                  <strong>Región:</strong> {user.region || 'No especificada'}<br />
                  <strong>Comuna:</strong> {user.comuna || 'No especificada'}
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