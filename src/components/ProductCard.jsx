import React from "react";
import { toast } from 'react-toastify';

export default function ProductCard({ producto, onAdd }) {
  const addToCart = () => {
    try {
      const itemToAdd = {
        codigo: producto.codigo,
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio ?? 0,
        img: producto.img ?? "",
        stock: producto.stock ?? null,
        origen: producto.origen ?? "",
        qty: 1,
      };

      // Usar onAdd (del contexto) para añadir al carrito
      if (typeof onAdd === "function") onAdd(itemToAdd);

      toast.success('Producto agregado');
      console.debug("[ProductCard] added via onAdd:", itemToAdd);
    } catch (err) {
      console.error("Error agregando al carrito:", err);
      toast.error('Error agregando producto');
    }
  };

  return (
    <div className="card">
      <img
        src={producto.img || producto.imagen || ""}
        alt={producto.nombre}
        style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 12 }}
      />
      <div style={{ paddingTop: 10 }}>
        <h3>{producto.nombre}</h3>
        <p className="price">${producto.precio?.toLocaleString('es-CL') || producto.precio}</p>
        {producto.descripcion && (
          <p className="descripcion" style={{ fontSize: '0.9rem', color: '#666', marginBottom: 8 }}>
            {producto.descripcion}
          </p>
        )}
        <p><strong>Origen:</strong> {producto.origen || 'No especificado'}</p>
        <p><strong>Stock:</strong> {producto.stock ?? 'Disponible'}</p>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button
            className="btn btn-success"
            style={{ color: "#fff", padding: "8px 12px" }}
            onClick={addToCart}
          >
            Agregar
          </button>
          <button className="btn ghost">Ver</button>
        </div>
      </div>
    </div>
  );
}
