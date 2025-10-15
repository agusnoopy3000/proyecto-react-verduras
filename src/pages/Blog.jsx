import React from "react";

const Blog = () => (
  <>
    {/* Puedes importar y usar <Header /> y <Footer /> si ya existen como en Home.jsx */}
    <main className="container">
      <section className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        <article className="card shadow-sm p-3">
          <h3 className="destacado">Cómo elegir frutas de temporada</h3>
          {/* ...más contenido del blog... */}
        </article>
      </section>
    </main>
  </>
);

export default Blog;
