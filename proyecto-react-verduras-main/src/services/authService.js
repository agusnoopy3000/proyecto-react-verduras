import { API_URL } from "../config/api";

// Llamada al backend para hacer login
export async function login(correoElectronico, contrasena) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ correoElectronico, contrasena }),
  });

  if (!res.ok) {
    throw new Error("Credenciales incorrectas");
  }

  const data = await res.json();
  // Guardar token en localStorage
  localStorage.setItem("token", data.token);
  return data;
}

// Helpers de autenticación

export function obtenerToken() {
  return localStorage.getItem("token");
}

export function cerrarSesion() {
  localStorage.removeItem("token");
}

export function obtenerRol() {
  const token = obtenerToken();
  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    // En el backend guardamos "rol" en el JWT
    return payload.rol || null;
  } catch (e) {
    console.error("Error al leer el token JWT", e);
    return null;
  }
}

export function estaAutenticado() {
  return !!obtenerToken();
}
