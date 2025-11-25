import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useCart } from "../context/CartContext";
import api from "../api/client";
import productosData, { getImg } from "../data/productos";

// Mapa de código de producto a imagen
const imagesByCodigo = {
  'FR001': '/data/Manza_fuji.jpg',
  'FR002': '/data/naranja.webp',
  'FR003': '/data/platano.webp',
  'VR001': '/data/lechuga-hidroponica.jpeg',
  'VR002': '/data/zanahoria.webp',
  'VR003': '/data/Tomates.webp',
  'PO001': '/data/Avena_integral.webp',
  'PO002': '/data/miel_de_ulmo.webp',
  'PO003': '/data/harina.webp',
  'PL001': '/data/leche_entera.webp',
  'PL002': '/data/queso_chanco.webp',
  'PL003': '/data/yogurt.webp',
};

// Función para asignar imagen a producto del backend
const enrichWithImage = (producto) => {
  if (producto.img && producto.img.startsWith('/data/')) {
    return producto; // Ya tiene imagen correcta
  }
  const imgPath = imagesByCodigo[producto.codigo] || '/data/placeholder.png';
  return { ...producto, img: imgPath };
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
        // Enriquecer productos del backend con imágenes locales
        const enriched = data.map(enrichWithImage);
        setProductos(enriched);
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
