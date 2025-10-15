import React from "react";

const Registro = () => (
  <>
    {/* Puedes importar y usar <Header /> y <Footer /> si ya existen como en Home.jsx */}
    <main className="container">
      <section className="form">
        <h2>Crear cuenta</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div>
            <label className="form-label" htmlFor="regNombre">Nombre</label>
            <input id="regNombre" type="text" autoComplete="name" className="form-control" />
            <label className="form-label" htmlFor="regRut">RUN</label>
            <input id="regRut" type="text" autoComplete="off" className="form-control" required minLength={7} maxLength={9} placeholder="Ej: 19011022K" />
            <label className="form-label" htmlFor="regEmail">Email</label>
            <input id="regEmail" type="email" autoComplete="email" className="form-control" required />
            <label className="form-label" htmlFor="regTel">Teléfono</label>
            <input id="regTel" type="tel" autoComplete="tel" className="form-control" required pattern="\+?\d[\d\s-]{6,}" />
            <label className="form-label" htmlFor="regPass">Contraseña</label>
            <input id="regPass" type="password" autoComplete="new-password" className="form-control" required minLength={4} maxLength={10} />
            <label className="form-label" htmlFor="regPass2">Repite contraseña</label>
            <input id="regPass2" type="password" autoComplete="new-password" className="form-control" required minLength={4} maxLength={10} />
          </div>
        </div>
      </section>
    </main>
  </>
);

export default Registro;
