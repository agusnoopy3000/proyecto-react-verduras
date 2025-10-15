import React from "react";

const Login = () => (
  <>
    {/* Puedes importar y usar <Header /> y <Footer /> si ya existen como en Home.jsx */}
    <main className="container">
      <section className="form">
        <h2>Ingresar</h2>
        <label className="form-label" htmlFor="logEmail">Email</label>
        <input id="logEmail" type="email" autoComplete="email" className="form-control" />
        <label className="form-label" htmlFor="logPass">Contraseña</label>
        <input id="logPass" type="password" autoComplete="current-password" className="form-control" required minLength={4} maxLength={10} />
        <button className="btn btn-success" id="btnLogin">Ingresar</button>
        <p id="loginMsg" className="error"></p>
      </section>
    </main>
  </>
);

export default Login;
