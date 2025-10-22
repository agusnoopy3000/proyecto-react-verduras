import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useCart } from "../context/CartContext";
import productosData from "../data/productos";

export default function ProductList() {
  const [productos, setProductos] = useState([]);
  const [q, setQ] = useState('');
  const [categoria, setCategoria] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    setProductos(productosData);
  }, []);

  const categorias = Array.from(new Set(productos.map(p => p.categoria))).filter(Boolean);

  const filtered = productos.filter(p => {
    const matchQ = q.trim() === '' || (p.nombre || '').toLowerCase().includes(q.toLowerCase()) || (p.codigo || '').toLowerCase().includes(q.toLowerCase());
    const matchCat = !categoria || p.categoria === categoria;
    return matchQ && matchCat;
  });

  return (
    <div>
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
