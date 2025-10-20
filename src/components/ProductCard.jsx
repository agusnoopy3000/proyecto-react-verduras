import React from "react";

export default function ProductCard({ producto, onAdd }) {
  const addToCart = () => {
    try {
      const raw = localStorage.getItem("cart");
      let cart = raw ? JSON.parse(raw) : [];
      // asegurar que cart sea un array (admitir también { items: [...] } por compatibilidad)
      if (!Array.isArray(cart)) {
        if (cart && Array.isArray(cart.items)) cart = cart.items.slice();
        else cart = [];
      }

      // identificar producto por codigo/id/nombre
      const idKey = producto.codigo ?? producto.id ?? producto.nombre;
      const findIdx = cart.findIndex(
        (p) => (p.codigo ?? p.id ?? p.nombre) === idKey
      );

      if (findIdx > -1) {
        // ya existe -> incrementar qty sin exceder stock (si existe)
        const existing = { ...cart[findIdx] };
        const maxStock =
          typeof producto.stock === "number" ? producto.stock : Infinity;
        existing.qty = Math.min((existing.qty ?? 1) + 1, maxStock);
        cart[findIdx] = existing;
      } else {
        // nuevo item
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
        cart.push(itemToAdd);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      if (typeof onAdd === "function") onAdd(cart);
      window.dispatchEvent(new CustomEvent("show-toast", { detail: "Producto agregado" }));
      window.dispatchEvent(new CustomEvent("cart-changed", { detail: cart }));
      console.debug("[ProductCard] cart updated:", cart);
    } catch (err) {
      console.error("Error agregando al carrito:", err);
      window.dispatchEvent(new CustomEvent("show-toast", { detail: "Error agregando producto" }));
    }
  };

  return (
    <div className="card">
      <img
        src={producto.img || ""}
        alt={producto.nombre}
        style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 12 }}
      />
      <div style={{ paddingTop: 10 }}>
        <h3>{producto.nombre}</h3>
        <p className="price">${producto.precio}</p>
        <p><strong>Origen:</strong> {producto.origen}</p>
        <p><strong>Stock:</strong> {producto.stock}</p>
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
