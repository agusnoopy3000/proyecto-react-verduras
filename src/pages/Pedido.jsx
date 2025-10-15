import React from "react";

const Pedido = () => (
  <>
    {/* Puedes importar y usar <Header /> y <Footer /> si ya existen como en Home.jsx */}
    <main className="container">
      <section className="form">
        <h2>Pedido y Informacion entrega</h2>
        <div style={{height:24}}></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div>
            <label className="form-label" htmlFor="fecha">Fecha preferida de entrega</label>
            <input type="date" id="fecha" className="form-control" />
            <p className="help">Selecciona cualquier día a partir de mañana.</p>
            <label className="form-label" htmlFor="direccion">Dirección</label>
            <input id="direccion" type="text" placeholder="Calle, número, comuna" className="form-control" />
            <label className="form-label" htmlFor="comentarios">Comentarios</label>
            <input id="comentarios" type="text" placeholder="Instrucciones para el repartidor" className="form-control" />
            <button className="btn btn-success" id="confirmarPedido">Confirmar</button>
            <p id="msgPedido" className="help"></p>
          </div>
        </div>
      </section>
    </main>
  </>
);

export default Pedido;
