import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Carrito from '../pages/Carrito';
import { CartContext } from '../context/CartContext';

describe('Carrito component', () => {
  const mockCartItems = [
    { id: 1, nombre: 'Tomate', precio: 1000, cantidad: 2 },
    { id: 2, nombre: 'Lechuga', precio: 800, cantidad: 1 }
  ];

  const mockCartContext = {
    cart: mockCartItems,
    removeFromCart: vi.fn(),
    updateQuantity: vi.fn(),
    clearCart: vi.fn(),
    total: 2800
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe mostrar los productos en el carrito', () => {
    render(
      <CartContext.Provider value={mockCartContext}>
        <Carrito />
      </CartContext.Provider>
    );
    
    expect(screen.getByText('Tomate')).toBeInTheDocument();
    expect(screen.getByText('Lechuga')).toBeInTheDocument();
  });

  it('debe mostrar el total correcto', () => {
    render(
      <CartContext.Provider value={mockCartContext}>
        <Carrito />
      </CartContext.Provider>
    );
    
    expect(screen.getByText('$2.800')).toBeInTheDocument();
  });

  it('debe llamar a removeFromCart cuando se elimina un producto', () => {
    render(
      <CartContext.Provider value={mockCartContext}>
        <Carrito />
      </CartContext.Provider>
    );
    
    const deleteButton = screen.getAllByRole('button', { name: /eliminar/i })[0];
    fireEvent.click(deleteButton);
    
    expect(mockCartContext.removeFromCart).toHaveBeenCalledWith(1);
  });

  it('debe mostrar mensaje cuando el carrito está vacío', () => {
    const emptyCartContext = {
      ...mockCartContext,
      cart: [],
      total: 0
    };

    render(
      <CartContext.Provider value={emptyCartContext}>
        <Carrito />
      </CartContext.Provider>
    );
    
    expect(screen.getByText(/carrito está vacío/i)).toBeInTheDocument();
  });
});