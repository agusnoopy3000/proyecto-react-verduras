import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useCart } from "../context/CartContext";
import api from "../api/client";
import productosData from "../data/productos";

// Función para normalizar producto del backend al formato del frontend
const normalizeProduct = (producto) => {
  return {
    ...producto,
    // El backend usa 'imagen', el frontend usa 'img'
    img: producto.imagen || producto.img || '/data/placeholder.png',
    // Asegurar que precio sea número
    precio: Number(producto.precio) || 0,
  };
};

export default function ProductList() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [categoria, setCategoria] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/v1/products');
        // Normalizar productos del backend
        const normalized = data.map(normalizeProduct);
        setProductos(normalized);
      } catch (err) {
        console.error('Error cargando productos del backend, usando datos locales:', err);
        setProductos(productosData);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categorias = Array.from(new Set(productos.map(p => p.categoria))).filter(Boolean);

  const filtered = productos.filter(p => {
    const matchQ = q.trim() === '' || (p.nombre || '').toLowerCase().includes(q.toLowerCase()) || (p.codigo || '').toLowerCase().includes(q.toLowerCase());
    const matchCat = !categoria || p.categoria === categoria;
    return matchQ && matchCat;
  });

  return (
    <div>
      {loading && <p className="text-center">Cargando productos...</p>}
      <div className="controls mb-3">
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
          <div>
            <label className="form-label">Buscar</label>
            <input type="text" className="form-control" value={q} onChange={e => setQ(e.target.value)} placeholder="Nombre o código" />
          </div>
          <div>
            <label className="form-label">Categoría</label>
            <select className="form-select" value={categoria} onChange={e => setCategoria(e.target.value)}>
              <option value="">Todas</option>
              {categorias.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{alignSelf:'end'}}>
            <button className="btn btn-success ghost" onClick={() => { setQ(''); setCategoria(''); }}>Limpiar</button>
          </div>
        </div>
      </div>

      {/* grid responsivo: auto-ajusta columnas según espacio */}
      <div className="grid cards">
        {filtered.map(p => (
          <div key={p.codigo || p.id} className="card-container">
            <ProductCard producto={p} onAdd={() => addToCart(p, 1)} />
          </div>
        ))}
      </div>
    </div>
  );
}
