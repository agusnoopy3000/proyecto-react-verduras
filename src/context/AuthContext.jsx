import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext();
const STORAGE_KEY = 'hh_user';
const TOKEN_KEY = 'hh_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [user]);

  async function login(email, password) {
    try {
      const { data } = await api.post('/v1/auth/login', { email, password });
      // Backend devuelve: { token, user: { email, nombre, apellido, rol, ... } }
      const role = data.user?.rol || data.role || 'USER';
      const authUser = { 
        email: data.user?.email || data.email || email, 
        role: role.toUpperCase(),
        nombre: data.user?.nombre,
        apellido: data.user?.apellido
      };
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(authUser);
      return { ok: true, user: authUser };
    } catch (error) {
      const message = error.response?.data?.message || 'Credenciales inválidas';
      return { ok: false, message };
    }
  }

  function logout() {
    setUser(null);
  }

  async function register(payload) {
    try {
      await api.post('/v1/auth/register', payload);
      return { ok: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al registrar usuario';
      return { ok: false, message };
    }
  }

  const value = { user, login, logout, register, isAuthenticated: !!user, isAdmin: user?.role === 'ADMIN' };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
