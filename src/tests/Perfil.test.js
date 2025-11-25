import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { toast } from 'react-toastify';
import Perfil from '../pages/Perfil.jsx';

describe('Perfil Component', () => {
  let mockLocalStorage;

  beforeEach(() => {
    mockLocalStorage = {
      data: {},
      getItem: vi.fn((key) => mockLocalStorage.data[key] || null),
      setItem: vi.fn((key, value) => { mockLocalStorage.data[key] = value; }),
      removeItem: vi.fn((key) => { delete mockLocalStorage.data[key]; }),
      clear: vi.fn(() => { mockLocalStorage.data = {}; }),
    };
    vi.stubGlobal('localStorage', mockLocalStorage);
    vi.spyOn(toast, 'success').mockImplementation(() => {});
    vi.spyOn(toast, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('cerrar sesión borra localStorage y muestra toast', async () => {
    localStorage.setItem('huertohogar_user', JSON.stringify({ run: '12345678-9', nombre: 'Usuario' }));

    render(React.createElement(Perfil, null), {
      wrapper: ({ children }) => React.createElement(MemoryRouter, null, children),
    });

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /cerrar sesión/i }) || screen.queryByText(/Cerrar Sesión/i)).toBeTruthy();
    }, { timeout: 5000 });

    const logoutBtn = screen.queryByRole('button', { name: /cerrar sesión/i }) || screen.queryByText(/Cerrar Sesión/i);
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(localStorage.getItem('huertohogar_user')).toBeNull();
      expect(toast.success).toHaveBeenCalled();
    }, { timeout: 5000 });
  }, { timeout: 10000 });
});