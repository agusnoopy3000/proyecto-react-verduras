import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();
const STORAGE_KEY = 'cart';

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  function addToCart(producto, cantidad = 1) {
    const codigo = producto?.codigo ?? producto?.id ?? String(producto);
    setCart(prev => ({ ...prev, [codigo]: (prev[codigo] || 0) + cantidad }));
  }

  function setItemQuantity(codigo, cantidad) {
    setCart(prev => {
      const next = { ...prev };
      if (cantidad <= 0) delete next[codigo];
      else next[codigo] = cantidad;
      return next;
    });
  }

  function removeFromCart(codigo) {
    setCart(prev => {
      const next = { ...prev };
      delete next[codigo];
      return next;
    });
  }

  function clearCart() {
    setCart({});
  }

  function getTotalItems() {
    return Object.values(cart).reduce((s, n) => s + n, 0);
  }

  const value = {
    cart,
    addToCart,
    setItemQuantity,
    removeFromCart,
    clearCart,
    getTotalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}

export default CartContext;
