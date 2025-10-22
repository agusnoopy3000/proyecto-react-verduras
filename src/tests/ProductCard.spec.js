import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ProductCard from '../components/ProductCard.jsx';

const baseProducto = { nombre: 'Manzana', precio: 1000, img: 'manzana.jpg', stock: 10, origen: 'Chile', codigo: 'FR001' };
const mockOnAdd = vi.fn();

describe('ProductCard component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('monta y muestra título cuando recibe props simples (producto)', () => {
    const p = { nombre: 'Test', precio: 0, img: '' };
    render(React.createElement(ProductCard, { producto: p }));
    expect(screen.queryByText(/Test/)).not.toBeNull();
  });

  it('acepta prop producto (producto)', () => {
    render(React.createElement(ProductCard, { producto: baseProducto }));
    expect(screen.queryByText(/Manzana/)).not.toBeNull();
  });

  it('muestra imagen con alt cuando hay img', () => {
    render(React.createElement(ProductCard, { producto: baseProducto }));
    const img = screen.queryByRole('img');
    expect(img).not.toBeNull();
    if (img) expect((img.alt || '').toLowerCase()).toMatch(/manzana|producto/);
  });

  it('llama onAdd al hacer click si se pasa la prop', () => {
    render(React.createElement(ProductCard, { producto: baseProducto, onAdd: mockOnAdd }));
    const btn = screen.getByRole('button', { name: /añadir|agregar|add|añadir al carrito|add to cart/i }) || screen.queryByText(/añadir|agregar|add/i);
    expect(btn).not.toBeNull();
    if (btn) {
      fireEvent.click(btn);
      expect(mockOnAdd).toHaveBeenCalled();
      const arg = mockOnAdd.mock.calls && mockOnAdd.mock.calls[0] && mockOnAdd.mock.calls[0][0];
      expect(arg && arg.nombre === 'Manzana').toBeTruthy();
    }
  });
});