import React from "react";

const Admin = () => (
  <>
    {/* Puedes importar y usar <Header /> y <Footer /> si ya existen como en Home.jsx */}
    <main className="container my-4">
      <h2>Panel de Administración</h2>
      <div className="mb-4">
        <div className="d-flex flex-wrap gap-3">
          <button className="btn btn-primary" id="btnVerProductos">Lista de Productos</button>
          <button className="btn btn-success" id="btnNuevoProducto"><span style={{fontWeight:"bold",fontSize:"1.2em",verticalAlign:"middle"}}>＋</span> Nuevo Producto</button>
          <button className="btn btn-secondary" id="btnVerUsuarios">Lista de Usuarios</button>
        </div>
      </div>
      <div id="adminContent"></div>
      {/* Aquí iría el modal de producto y más contenido admin */}
    </main>
  </>
);

export default Admin;
