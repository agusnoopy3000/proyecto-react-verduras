import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Carrito from '../pages/Carrito';

// Mock del contexto
const mockCartContext = {
  cart: [
    { id: 1, nombre: 'Tomate', precio: 1000, cantidad: 2 },
    { id: 2, nombre: 'Lechuga', precio: 800, cantidad: 1 }
  ],
  removeFromCart: vi.fn(),
  updateQuantity: vi.fn(),
  clearCart: vi.fn(),
  total: 2800
};

// Mock del hook useCart
vi.mock('../context/CartContext', () => ({
  useCart: () => mockCartContext,
  CartContext: {
    Provider: ({ children }) => children
  }
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Carrito component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('debe mostrar los productos en el carrito', () => {
    renderWithRouter(<Carrito />);
    expect(screen.getByText(/Tomate/)).toBeTruthy();
    expect(screen.getByText(/Lechuga/)).toBeTruthy();
  });

  test('debe mostrar el total correcto', () => {
    renderWithRouter(<Carrito />);
    expect(screen.getByText(/2.800/)).toBeTruthy();
  });

  test('debe llamar a removeFromCart cuando se elimina un producto', () => {
    const mockRemoveFromCart = vi.fn();
    vi.mocked(mockCartContext.removeFromCart).mockImplementation(mockRemoveFromCart);

    renderWithRouter(<Carrito />);
    
    const deleteButton = screen.getByRole('button', { name: /eliminar/i });
    fireEvent.click(deleteButton);
    
    expect(mockRemoveFromCart).toHaveBeenCalledWith(1);
  });

  test('debe mostrar mensaje cuando el carrito está vacío', () => {
    vi.mock('../context/CartContext', () => ({
      useCart: () => ({
        cart: [],
        total: 0,
        removeFromCart: vi.fn(),
        updateQuantity: vi.fn(),
        clearCart: vi.fn()
      })
    }));

    renderWithRouter(<Carrito />);
    expect(screen.getByText(/carrito está vacío/i)).toBeTruthy();
  });
});