import React from "react";

const Contacto = () => (
  <>
    {/* Puedes importar y usar <Header /> y <Footer /> si ya existen como en Home.jsx */}
    <main className="container">
      <section className="form">
        <h2>Contacto</h2>
        <label className="form-label" htmlFor="conNombre">Nombre</label>
        <input id="conNombre" type="text" className="form-control" required maxLength={100} />
        <label className="form-label" htmlFor="conEmail">Email</label>
        <input id="conEmail" type="email" className="form-control" maxLength={100} required />
        <label className="form-label" htmlFor="conMsj">Mensaje</label>
        <input id="conMsj" type="text" placeholder="¿En qué podemos ayudarte?" className="form-control" required maxLength={500} />
        <div style={{height:32}}></div>
        <button className="btn btn-success mt-3" id="btnContacto">Enviar</button>
      </section>
    </main>
  </>
);

export default Contacto;
