export default function ProductCard({ producto }) {
  return (
    <div className="card m-2" style={{ width: "18rem" }}>
      <div className="card-body text-center">
        <h5 className="card-title">{producto.nombre}</h5>
        <p className="card-text">${producto.precio}</p>
        <button className="btn btn-success">Agregar al carrito</button>
      </div>
    </div>
  );
}
