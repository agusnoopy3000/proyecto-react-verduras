import { apiGet, apiPost, apiPut } from "./apiClient";

export function obtenerProductos() {
  return apiGet("/productos");
}

export function obtenerProducto(id) {
  return apiGet(`/productos/${id}`);
}

export function obtenerProductosPorCategoria(codigo) {
  return apiGet(`/productos/categoria/${codigo}`);
}

export function obtenerOfertas() {
  return apiGet("/productos/ofertas");
}

export function crearProducto(producto) {
  return apiPost("/productos", producto);
}

export function actualizarProducto(id, producto) {
  return apiPut(`/productos/${id}`, producto);
}
