import React from "react";

const Catalogo = () => (
  <>
    {/* Puedes importar y usar <Header /> y <Footer /> si ya existen como en Home.jsx */}
    <main className="container">
      <section className="controls card">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"12px"}}>
          <div>
            <label className="form-label" htmlFor="q">Buscar</label>
            <input id="q" type="text" placeholder="Nombre o código" className="form-control" />
          </div>
          <div>
            <label className="form-label" htmlFor="categoria">Categoría</label>
            <select id="categoria" className="form-select"><option value="">Todas</option></select>
          </div>
          <div style={{alignSelf:"end"}}>
            <button className="btn btn-success ghost" id="btnLimpiar">Limpiar</button>
          </div>
        </div>
      </section>
      {/* Aquí iría el listado de productos */}
    </main>
  </>
);

export default Catalogo;
