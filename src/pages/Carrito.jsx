import React from "react";

const Carrito = () => (
  <>
    {/* Puedes importar y usar <Header /> y <Footer /> si ya existen como en Home.jsx */}
    <main className="container">
      <section>
        <h2>Carrito</h2>
        <div className="card shadow-sm p-3">
          <table className="table table-striped table-bordered align-middle" id="tablaCarrito">
            <thead><tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th></th></tr></thead>
            <tbody></tbody>
            <tfoot><tr><td colSpan="3">Total</td><td id="total">$0</td><td></td></tr></tfoot>
          </table>
          <div className="controls" style={{justifyContent:"flex-end",marginTop:12}}>
            <a className="btn btn-success" href="/pedido">Confirmar pedido</a>
          </div>
        </div>
      </section>
    </main>
  </>
);

export default Carrito;
