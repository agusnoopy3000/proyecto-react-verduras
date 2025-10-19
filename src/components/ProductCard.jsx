import React from "react";

export default function ProductCard({ producto, onAdd }) {
  const formatoPrecio = (n) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);
  const imgPath = producto?.img ? `/${producto.img.replace(/^\//, '')}` : '/assets/img/placeholder.png';

  return (
    <div className="card m-2" style={{ width: '18rem' }}>
      <img src={imgPath} className="card-img-top" alt={producto?.nombre || 'Producto'} style={{ height: 160, objectFit: 'cover' }} />
      <div className="card-body text-center">
        <h5 className="card-title">{producto?.nombre}</h5>
        <p className="card-text">{formatoPrecio(producto?.precio || 0)}</p>
        <button className="btn btn-success" onClick={() => onAdd ? onAdd(producto) : null}>Agregar al carrito</button>
      </div>
    </div>
  );
}
