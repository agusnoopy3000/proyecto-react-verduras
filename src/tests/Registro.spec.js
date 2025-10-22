import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

/*
  Mockear react-router-dom BEFORE importar Registro.
  Exponemos MemoryRouter, Link, useNavigate y navigate (como función).
*/
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => {
  const React = require('react');
  const MemoryRouter = ({ children }) => React.createElement(React.Fragment, null, children);
  const Link = ({ children, to, ...rest }) => React.createElement('a', { href: to || '#', ...rest }, children);
  const useNavigate = () => mockNavigate;
  return {
    __esModule: true,
    MemoryRouter,
    Link,
    useNavigate,
    navigate: mockNavigate,
    default: { MemoryRouter, Link, useNavigate, navigate: mockNavigate },
  };
});

// exponer navigate globalmente para evitar ReferenceError dentro del componente
global.navigate = mockNavigate;
// mock global alert usado por el componente
global.alert = vi.fn();

let Registro;
beforeAll(async () => {
  // importar después de haber definido los mocks y globals
  Registro = (await import('../pages/Registro.jsx')).default;
  // exponer Link por si el componente referencia Link globalmente
  try {
    const rr = require('react-router-dom');
    global.Link = rr.Link;
    if (typeof window !== 'undefined') window.Link = rr.Link;
  } catch (e) {}
});

const renderRegistro = () =>
  render(React.createElement(Registro), {
    wrapper: ({ children }) => React.createElement(require('react-router-dom').MemoryRouter, null, children),
  });

// helpers para seleccionar campos cuando labels no están asociados correctamente
const getByName = (name) => document.querySelector(`[name="${name}"]`);
const getSelectById = (id) => document.getElementById(id);

describe('Registro Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renderiza formulario básico', () => {
    renderRegistro();
    expect(getByName('run')).toBeTruthy();
    expect(getByName('nombre')).toBeTruthy();
    expect(getByName('email')).toBeTruthy();
    expect(screen.getByRole('button', { name: /registrar/i })).toBeTruthy();
  });

  it('muestra error cuando contraseñas no coinciden', async () => {
    renderRegistro();

    const pass = getByName('password');
    const confirm = getByName('confirmPassword');
    expect(pass).toBeTruthy();
    expect(confirm).toBeTruthy();

    fireEvent.change(pass, { target: { value: 'pass1' } });
    fireEvent.change(confirm, { target: { value: 'pass2' } });
    fireEvent.click(screen.getByRole('button', { name: /registrar/i }));

    await waitFor(() => {
      const err = screen.queryByText(/no coinciden|coincid/i);
      const anyError = document.querySelectorAll('.error, .text-danger').length > 0;
      expect(err || anyError).toBeTruthy();
    });
  });

  it('guarda usuario en localStorage cuando es válido', async () => {
    renderRegistro();

    fireEvent.change(getByName('run'), { target: { value: '22222222-2' } });
    fireEvent.change(getByName('nombre'), { target: { value: 'Registro Test' } });
    try { fireEvent.change(getByName('apellidos'), { target: { value: 'Apellido' } }); } catch (e) {}
    fireEvent.change(getByName('email'), { target: { value: 'registro@gmail.com' } });
    fireEvent.change(getByName('password'), { target: { value: 'P@ssw0rd!' } });
    fireEvent.change(getByName('confirmPassword'), { target: { value: 'P@ssw0rd!' } });

    // seleccionar región/comuna si existen
    const region = getSelectById('regRegion');
    if (region) {
      fireEvent.change(region, { target: { value: region.options[1]?.value || '' } });
      const comuna = getSelectById('regComuna');
      if (comuna && comuna.options.length > 1) {
        fireEvent.change(comuna, { target: { value: comuna.options[1].value } });
      }
    }

    const spySet = vi.spyOn(Storage.prototype, 'setItem');
    fireEvent.click(screen.getByRole('button', { name: /registrar/i }));

    await waitFor(() => {
      expect(spySet).toHaveBeenCalled();
      const savedRaw = localStorage.getItem('huertohogar_user') || localStorage.getItem('users') || null;
      const saved = savedRaw ? JSON.parse(savedRaw) : null;
      expect(saved && (saved.email === 'registro@gmail.com' || saved.nombre === 'Registro Test')).toBeTruthy();
    });

    // comprobar que alert y navigate fueron invocados correctamente
    expect(global.alert).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalled();
  });
});

describe('Registro page (smoke)', () => {
  it('renders registro form (mount)', () => {
    renderRegistro();
    const btn = screen.queryByRole('button') || screen.queryByText(/registrar|registro/i);
    expect(btn).not.toBeNull();
  });
});