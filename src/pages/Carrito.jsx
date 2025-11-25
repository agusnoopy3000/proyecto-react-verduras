import React, { useEffect, useState } from "react";
import productosDefault from "../data/productos";
import { useCart } from "../context/CartContext";
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function Carrito() {
  const { cart: cartObj, removeFromCart, clearCart, setItemQuantity } = useCart();
  const [cart, setCart] = useState([]);
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  // Cargar productos del backend al iniciar
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/v1/products');
        setProductos(data);
      } catch (err) {
        console.debug("[Carrito] Error cargando productos del backend, usando datos locales:", err);
        setProductos(Array.isArray(productosDefault) ? productosDefault : []);
      }
    })();
  }, []);

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
    // Backend usa 'imagen', frontend usa 'img'
    const imgRaw = (base?.img ?? base?.imagen ?? base?.image) ?? (found?.img ?? found?.imagen ?? found?.image) ?? null;
    const img = typeof imgRaw === "string" && imgRaw.trim().length ? imgRaw : null;
    const stock = base?.stock ?? found?.stock ?? null;
    const id = base?.id ?? found?.id ?? undefined;
    const codigo = base?.codigo ?? found?.codigo ?? code ?? undefined;

    return { codigo, id, nombre, precio, img, stock, qty: Math.max(1, Number(qty) || 1) };
  };

  const resolveAndMerge = (items, products) => {
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
    if (productos.length === 0) return;
    const items = Object.entries(cartObj).map(([codigo, qty]) => ({ codigo, qty }));
    const enriched = resolveAndMerge(items, productos);
    setCart(enriched);
  }, [cartObj, productos]);

  const removeItem = (codigo) => {
    removeFromCart(codigo);
  };

  const incrementQty = (codigo) => {
    const item = cart.find(p => p.codigo === codigo);
    if (item) {
      setItemQuantity(codigo, (item.qty || 1) + 1);
    }
  };

  const decrementQty = (codigo) => {
    const item = cart.find(p => p.codigo === codigo);
    if (item) {
      const newQty = (item.qty || 1) - 1;
      if (newQty <= 0) {
        removeFromCart(codigo);
      } else {
        setItemQuantity(codigo, newQty);
      }
    }
  };

  const vaciar = () => {
    clearCart();
  };

  const total = cart.reduce((s, p) => s + (Number(p.precio) || 0) * (Number(p.qty) || 1), 0);

  return (
    <main className="container" style={{ padding: '40px 20px', maxWidth: 900 }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: 30,
        background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
        padding: '30px 20px',
        borderRadius: 16,
        color: '#fff'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 8 }}>
          🛒 Tu Carrito
        </h1>
        <p style={{ opacity: 0.9, marginBottom: 0 }}>
          {cart.length === 0 ? 'No tienes productos aún' : `${cart.length} producto${cart.length > 1 ? 's' : ''} en tu carrito`}
        </p>
      </div>

      {cart.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          background: '#f8f9fa',
          borderRadius: 16
        }}>
          <span style={{ fontSize: 64, display: 'block', marginBottom: 20 }}>🛒</span>
          <h3 style={{ color: '#636e72', marginBottom: 16 }}>Tu carrito está vacío</h3>
          <p style={{ color: '#999', marginBottom: 24 }}>
            Explora nuestro catálogo y añade productos frescos.
          </p>
          <button 
            className="btn btn-success btn-lg" 
            onClick={() => navigate('/catalogo')}
            style={{ padding: '12px 32px', borderRadius: 8 }}
          >
            🛍️ Ir al Catálogo
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gap: 16 }}>
            {cart.map((p, i) => (
              <div 
                key={p.codigo || p.id || i} 
                className="card" 
                style={{ 
                  border: 'none', 
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)', 
                  borderRadius: 12,
                  overflow: 'hidden'
                }}
              >
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', padding: 16 }}>
                  {/* Imagen */}
                  {p.img ? (
                    <img 
                      src={p.img} 
                      alt={p.nombre || p.codigo} 
                      style={{ 
                        width: 100, 
                        height: 80, 
                        objectFit: 'cover', 
                        borderRadius: 10,
                        flexShrink: 0
                      }} 
                    />
                  ) : (
                    <div style={{ 
                      width: 100, 
                      height: 80, 
                      background: 'linear-gradient(135deg, #dfe6e9, #b2bec3)', 
                      borderRadius: 10, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: '#636e72', 
                      fontSize: 24,
                      flexShrink: 0
                    }}>
                      🥬
                    </div>
                  )}
                  
                  {/* Info del producto */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h5 style={{ 
                      margin: 0, 
                      color: '#2d3436', 
                      fontWeight: 600,
                      fontSize: 16 
                    }}>
                      {p.nombre ?? 'Producto'}
                    </h5>
                    <p style={{ 
                      margin: '4px 0 0', 
                      color: '#636e72', 
                      fontSize: 14 
                    }}>
                      {formatCLP(p.precio)} c/u
                    </p>
                  </div>

                  {/* Controles de cantidad */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 8,
                    background: '#f8f9fa',
                    borderRadius: 8,
                    padding: '6px 12px'
                  }}>
                    <button 
                      onClick={() => decrementQty(p.codigo)}
                      style={{ 
                        width: 36, 
                        height: 36, 
                        padding: 0, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        background: '#dc3545',
                        border: 'none',
                        borderRadius: 8,
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 20,
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      title="Quitar uno"
                    >
                      -
                    </button>
                    <span style={{ 
                      minWidth: 40, 
                      textAlign: 'center', 
                      fontWeight: 700,
                      fontSize: 18,
                      color: '#2d3436'
                    }}>
                      {p.qty || 1}
                    </span>
                    <button 
                      onClick={() => incrementQty(p.codigo)}
                      style={{ 
                        width: 36, 
                        height: 36, 
                        padding: 0, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        background: '#28a745',
                        border: 'none',
                        borderRadius: 8,
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 20,
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      title="Agregar uno"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div style={{ 
                    textAlign: 'right', 
                    minWidth: 100,
                    paddingLeft: 16
                  }}>
                    <div style={{ 
                      fontWeight: 700, 
                      fontSize: 18, 
                      color: '#28a745' 
                    }}>
                      {formatCLP((Number(p.precio) || 0) * (Number(p.qty) || 1))}
                    </div>
                  </div>

                  {/* Botón eliminar */}
                  <button 
                    className="btn" 
                    onClick={() => removeItem(p.codigo)}
                    title="Eliminar del carrito"
                    style={{ 
                      padding: 8,
                      background: '#fee',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 18,
                      cursor: 'pointer'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen y acciones */}
          <div className="card" style={{ 
            marginTop: 24, 
            border: 'none',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            borderRadius: 16,
            overflow: 'hidden'
          }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #2d3436, #636e72)', 
              padding: '20px 24px',
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ opacity: 0.8 }}>Total a pagar</span>
                <div style={{ fontSize: 28, fontWeight: 700 }}>{formatCLP(total)}</div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button 
                  className="btn btn-outline-light" 
                  onClick={vaciar}
                  style={{ padding: '10px 20px', borderRadius: 8 }}
                >
                  Vaciar
                </button>
                <button 
                  className="btn btn-success btn-lg" 
                  onClick={() => navigate("/pedido")}
                  style={{ 
                    padding: '10px 28px', 
                    borderRadius: 8,
                    boxShadow: '0 4px 15px rgba(40, 167, 69, 0.4)'
                  }}
                >
                  Proceder al Pedido →
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}