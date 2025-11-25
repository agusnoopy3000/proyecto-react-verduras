import React, { useEffect, useState } from "react";

export default function Contacto() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [msj, setMsj] = useState("");
  const [conMsg, setConMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validateAndSend = (e) => {
    e.preventDefault();
    let msg = '';
    if (!nombre.trim()) msg = 'El nombre es requerido.';
    else if (nombre.length > 100) msg = 'El nombre no puede superar 100 caracteres.';
    else if (!email.trim()) msg = 'El email es requerido.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) msg = 'Email inválido.';
    else if (!msj.trim()) msg = 'El mensaje es requerido.';
    else if (msj.length > 500) msg = 'El mensaje no puede superar 500 caracteres.';

    setConMsg(msg);
    setSuccess(false);
    
    if (!msg) {
      // Simulación de envío exitoso
      setSuccess(true);
      setConMsg('¡Mensaje enviado correctamente! Te responderemos pronto.');
      setNombre('');
      setEmail('');
      setMsj('');
    }
  };

  return (
    <main className="container">
      <section>
        <h2>Contacto</h2>
        <p>Envíanos un mensaje o visita nuestras tiendas.</p>
        <form onSubmit={validateAndSend}>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input 
              type="text" 
              className="form-control" 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mensaje</label>
            <textarea 
              className="form-control"
              value={msj}
              onChange={(e) => setMsj(e.target.value)}
              placeholder="¿En qué podemos ayudarte?"
              rows={4}
            ></textarea>
          </div>
          {conMsg && (
            <div className={`alert ${success ? 'alert-success' : 'alert-danger'}`} style={{ marginBottom: 16 }}>
              {conMsg}
            </div>
          )}
          <button type="submit" className="btn btn-primary">Enviar</button>
        </form>
      </section>
    </main>
  );
}
