import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();
const STORAGE_KEY = 'hh_user';

// Usuarios demo
const demoUsers = [
  { email: 'admin@huertohogar.cl', password: 'admin123', role: 'Administrador', nombre: 'Admin Huerto' },
  { email: 'cliente@huertohogar.cl', password: 'cliente123', role: 'Cliente', nombre: 'Cliente Demo' }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    } catch { return null; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  function login(email, password) {
    // buscar en demoUsers
    const found = demoUsers.find(u => u.email === email && u.password === password);
    if (found) {
      const u = { email: found.email, role: found.role, nombre: found.nombre };
      setUser(u);
      return { ok: true, user: u };
    }
    // buscar en usuarios registrados en localStorage
    const stored = JSON.parse(localStorage.getItem('hh_users') || '[]');
    const reg = stored.find(u => u.email === email && u.password === password);
    if (reg) {
      const u = { email: reg.email, role: reg.role || 'Cliente', nombre: reg.nombre || '' };
      setUser(u);
      return { ok: true, user: u };
    }
    return { ok: false, message: 'Credenciales inválidas' };
  }

  function logout() {
    setUser(null);
  }

  function register({ email, password, nombre, role = 'Cliente' }) {
    const stored = JSON.parse(localStorage.getItem('hh_users') || '[]');
    if (stored.find(u => u.email === email)) return { ok: false, message: 'Email ya registrado' };
    const nuevo = { email, password, nombre, role };
    stored.push(nuevo);
    localStorage.setItem('hh_users', JSON.stringify(stored));
    const u = { email: nuevo.email, role: nuevo.role, nombre: nuevo.nombre };
    setUser(u);
    return { ok: true, user: u };
  }

  const value = { user, login, logout, register, isAuthenticated: !!user };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
