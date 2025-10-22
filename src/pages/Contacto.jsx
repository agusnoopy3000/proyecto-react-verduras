import React, { useEffect, useState } from "react";

export default function Contacto() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [msj, setMsj] = useState("");
  const [conMsg, setConMsg] = useState("");

  useEffect(() => {
    const cur = 'contacto';
    document.querySelectorAll('nav a').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href.includes(cur)) a.classList.add('active');
    });
  }, []);

  const validateAndSend = (e) => {
    e.preventDefault();
    let msg = '';
    if (!nombre.trim()) msg = 'El nombre es requerido.';
    else if (nombre.length > 100) msg = 'El nombre no puede superar 100 caracteres.';
    else if (email.length > 100) msg = 'El email no puede superar 100 caracteres.';
    else if (!/^.+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(email)) msg = 'Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) msg = 'Email inválido.';
    else if (!msj.trim()) msg = 'El comentario es requerido.';
    else if (msj.length > 500) msg = 'El comentario no puede superar 500 caracteres.';

    setConMsg(msg);
    if (!msg) {
      // Aquí podrías enviar a una API. Por ahora solo confirmamos.
      alert('Mensaje enviado correctamente.');
      setNombre('');
      setEmail('');
      setMsj('');
    }
  };

  return (
    <>
      <main className="container">
        <section>
          <h2>Contacto</h2>
          <p>Envíanos un mensaje o visita nuestras tiendas.</p>
          <form>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input type="text" className="form-control" />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" />
            </div>
            <div className="mb-3">
              <label className="form-label">Mensaje</label>
              <textarea className="form-control"></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Enviar</button>
          </form>
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
