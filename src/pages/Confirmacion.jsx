import React from "react";

const Confirmacion = () => (
  <>
    {/* Puedes importar y usar <Header /> y <Footer /> si ya existen como en Home.jsx */}
    <main className="container my-4">
      <section className="card p-4">
        <div style={{fontSize:"4rem",color:"#198754",display:"block",margin:"24px auto 12px auto",textAlign:"center"}}>✔️</div>
        <h2 className="text-center text-success">¡Compra confirmada!</h2>
        <p className="text-center">Gracias por tu compra. Aquí tienes el resumen de tu pedido:</p>
        <div id="resumenPedido"></div>
        <div className="text-center mt-4">
          <a href="/catalogo" className="btn btn-outline-success">Seguir comprando</a>
        </div>
      </section>
    </main>
  </>
);

export default Confirmacion;
