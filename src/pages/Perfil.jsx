import React from "react";

const Perfil = () => (
  <>
    {/* Puedes importar y usar <Header /> y <Footer /> si ya existen como en Home.jsx */}
    <main className="container">
      <section className="form">
        <h2>Mi perfil</h2>
        <label className="form-label" htmlFor="perNombre">Nombre</label>
        <input id="perNombre" type="text" className="form-control" />
        <label className="form-label" htmlFor="perEmail">Email</label>
        <input id="perEmail" type="email" disabled className="form-control" />
        <label className="form-label" htmlFor="perTel">Teléfono</label>
        <input id="perTel" type="tel" className="form-control" />
        <button className="btn btn-success" id="btnGuardarPerfil">Guardar</button>
        <p id="perfilMsg" className="help"></p>
      </section>
    </main>
  </>
);

export default Perfil;
