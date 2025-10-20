import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import productosDefault from "../data/productos";

export default function Carrito() {
  const navigate = useNavigate();
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

  const normalize = (raw) => {
    try {
      const parsedRaw = raw ? JSON.parse(raw) : [];
      // si ya es array de items (formato esperado), devolverlo
      if (Array.isArray(parsedRaw)) return parsedRaw;

      // si es objeto tipo { codigo: qty, ... } convertir a array enriqueciendo con catálogo
      if (parsedRaw && typeof parsedRaw === "object") {
        const map = parsedRaw;
        const products = loadCatalog();
        const arr = Object.entries(map).map(([code, qty]) => {
          const found = products.find(p => (String(p.codigo ?? p.id ?? p.nombre) === String(code)));
          return {
            codigo: code,
            id: found?.id,
            nombre: found?.nombre ?? found?.title ?? code,
            precio: found?.precio ?? found?.price ?? 0,
            img: found?.img ?? "",
            stock: found?.stock ?? null,
            origen: found?.origen ?? "",
            qty: (typeof qty === "object" && qty?.qty) ? Number(qty.qty) : Number(qty) || 1
          };
        });
        return arr;
      }

      return [];
    } catch (err) {
      console.error("[Carrito] normalize parse error:", err);
      return [];
    }
  };

  const readCart = () => {
    try {
      const raw = localStorage.getItem("cart");
      const parsed = normalize(raw);
      // si original era map, persistir como array para mantener formato anterior
      if (raw && !Array.isArray(JSON.parse(raw))) {
        try { localStorage.setItem("cart", JSON.stringify(parsed)); } catch {}
      }
      setCart(parsed);
      console.debug("[Carrito] readCart ->", parsed);
    } catch (err) {
      console.error("[Carrito] readCart error:", err);
      setCart([]);
    }
  };

  useEffect(() => {
    readCart();

    const onCartChanged = (e) => {
      if (Array.isArray(e?.detail)) setCart(e.detail);
      else readCart();
    };
    window.addEventListener("cart-changed", onCartChanged);

    const onStorage = (e) => {
      if (e.key === "cart") readCart();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("cart-changed", onCartChanged);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const persistAndNotify = (next) => {
    try {
      const arr = Array.isArray(next) ? next : [];
      localStorage.setItem("cart", JSON.stringify(arr));
      window.dispatchEvent(new CustomEvent("cart-changed", { detail: arr }));
      console.debug("[Carrito] persistAndNotify ->", arr);
    } catch (err) {
      console.error("[Carrito] persist error:", err);
    }
  };

  const updateQty = (index, delta) => {
    setCart(prev => {
      const next = [...prev];
      const item = { ...next[index] };
      item.qty = Math.max(1, (item.qty || 1) + delta);
      next[index] = item;
      persistAndNotify(next);
      return next;
    });
  };

  const removeItem = (index) => {
    setCart(prev => {
      const next = prev.filter((_, i) => i !== index);
      persistAndNotify(next);
      return next;
    });
  };

  const vaciar = () => {
    setCart([]);
    try {
      localStorage.removeItem("cart");
      window.dispatchEvent(new CustomEvent("cart-changed", { detail: [] }));
      console.debug("[Carrito] vaciar carrito");
    } catch (err) {
      console.error("[Carrito] error vaciar:", err);
    }
  };

  const formatCLP = (value) => {
    try {
      const v = Number(value) || 0;
      return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Math.round(v));
    } catch {
      return value;
    }
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
                <img src={p.img || ""} alt={p.nombre} style={{ width: 96, height: 72, objectFit: 'cover', borderRadius: 6 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>{p.nombre}</strong>
                    <div style={{ color: '#666' }}>{formatCLP(p.precio)}</div>
                  </div>
                  <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f8f9fa', padding: '4px 6px', borderRadius: 6 }}>
                      <button className="btn btn-sm" onClick={() => updateQty(i, -1)} style={{ padding: '4px 8px' }}>−</button>
                      <div style={{ minWidth: 34, textAlign: 'center', fontWeight: 600 }}>{p.qty || 1}</div>
                      <button className="btn btn-sm" onClick={() => updateQty(i, 1)} style={{ padding: '4px 8px' }}>+</button>
                    </div>

                    <div style={{ marginLeft: 12 }}>
                      <small><strong>Stock:</strong> {p.stock ?? '—'}</small>
                    </div>

                    <button className="btn ghost" onClick={() => removeItem(i)} style={{ marginLeft: 'auto' }}>Eliminar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <div><strong>Total:</strong> {formatCLP(total)}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn ghost" onClick={vaciar}>Vaciar</button>
              <button className="btn btn-success" onClick={() => navigate("/pedido")}>Proceder a pedido</button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}