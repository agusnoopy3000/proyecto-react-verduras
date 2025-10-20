import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import productosDefault from "../data/productos";
import { useCart } from "../context/CartContext";

export default function Carrito() {
  const navigate = useNavigate();
  const { cart: cartObj, removeFromCart, clearCart } = useCart();
  const [cart, setCart] = useState([]);

  const loadCatalog = () => {
    try {
      const pRaw = localStorage.getItem("admin_products") || localStorage.getItem("productos") || localStorage.getItem("products");
      if (pRaw) {
        const parsed = JSON.parse(pRaw);
        if (Array.isArray(parsed)) return parsed;
        if (parsed && Array.isArray(parsed.items)) return parsed.items;
      }
    } catch (err) {
      console.debug("[Carrito] no admin_products:", err);
    }
    return Array.isArray(productosDefault) ? productosDefault : [];
  };

  const enrichItem = (raw, products) => {
    const qty = (() => {
      if (raw && typeof raw === "object") return Number(raw.qty ?? raw.cantidad ?? raw.q) || 1;
      return 1;
    })();

    let code = null;
    let base = null;
    if (typeof raw === "string" || typeof raw === "number") code = String(raw);
    else if (raw && typeof raw === "object") {
      code = String(raw.codigo ?? raw.id ?? raw.code ?? raw.sku ?? raw.nombre ?? "");
      base = raw;
    }

    const foundByCode = products.find(p => String(p.codigo ?? p.id ?? p.code ?? p.sku ?? p.nombre ?? "") === String(code));
    let found = foundByCode;
    if (!found && /^\d+$/.test(String(code))) {
      const idx = Number(code);
      if (products[idx]) found = products[idx];
    }

    const nombre = base?.nombre && String(base.nombre).trim() && !/^\d+$/.test(String(base.nombre)) ? base.nombre : (found?.nombre ?? found?.title ?? code ?? "Producto");
    const precio = Number(base?.precio ?? base?.price ?? found?.precio ?? found?.price ?? 0) || 0;
    const imgRaw = (base?.img ?? base?.image) ?? (found?.img ?? found?.image) ?? null;
    const img = typeof imgRaw === "string" && imgRaw.trim().length ? imgRaw : null;
    const stock = base?.stock ?? found?.stock ?? null;
    const id = base?.id ?? found?.id ?? undefined;
    const codigo = base?.codigo ?? found?.codigo ?? code ?? undefined;

    return { codigo, id, nombre, precio, img, stock, qty: Math.max(1, Number(qty) || 1) };
  };

  const resolveAndMerge = (items) => {
    const products = loadCatalog();
    const map = new Map();
    (Array.isArray(items) ? items : []).forEach(it => {
      const item = enrichItem(it, products);
      const key = String(item.codigo ?? item.id ?? JSON.stringify(item));
      if (map.has(key)) {
        const prev = map.get(key);
        prev.qty = (Number(prev.qty) || 0) + (Number(item.qty) || 0);
        map.set(key, prev);
      } else {
        map.set(key, { ...item, qty: Math.max(1, Number(item.qty) || 1) });
      }
    });
    return Array.from(map.values());
  };

  const formatCLP = (value) => {
    try { return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Math.round(Number(value) || 0)); } catch { return value; }
  };

  // Convertir el objeto {codigo: qty} del contexto a array enriquecido
  useEffect(() => {
    const items = Object.entries(cartObj).map(([codigo, qty]) => ({ codigo, qty }));
    const enriched = resolveAndMerge(items);
    setCart(enriched);
  }, [cartObj]);

  const removeItem = (codigo) => {
    removeFromCart(codigo);
  };

  const vaciar = () => {
    clearCart();
  };

  const total = cart.reduce((s, p) => s + (Number(p.precio) || 0) * (Number(p.qty) || 1), 0);

  return (
    <main className="container">
      <h2>Carrito</h2>
      {cart.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <div style={{ display: 'grid', gap: 12 }}>
            {cart.map((p, i) => (
              <div key={p.codigo || p.id || i} className="cart-row" style={{ display: 'flex', gap: 12, alignItems: 'center', border: '1px solid #eee', padding: 12, borderRadius: 8 }}>
                {p.img ? <img src={p.img} alt={p.nombre || p.codigo} style={{ width: 96, height: 72, objectFit: 'cover', borderRadius: 6 }} /> :
                  <div style={{ width: 96, height: 72, background: '#f0f0f0', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: 12 }}>Sin imagen</div>}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ display: 'block' }}>{p.nombre ?? 'Producto'}</strong>
                    <div style={{ fontSize: 13, color: '#666', marginTop: 6 }}>Stock: {p.stock ?? '—'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700 }}>{formatCLP((Number(p.precio) || 0) * (Number(p.qty) || 1))}</div>
                    <div style={{ fontSize: 12, color: '#999' }}>{formatCLP(p.precio)}{p.qty && p.qty > 1 ? ` x ${p.qty}` : ''}</div>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(p.codigo)} style={{ marginTop: 8 }}>Eliminar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <div><strong>Total:</strong> {formatCLP(total)}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-outline-secondary" onClick={vaciar}>Vaciar</button>
              <button className="btn btn-success" onClick={() => navigate("/pedido")}>Proceder a pedido</button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}