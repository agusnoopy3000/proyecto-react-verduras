import { apiPost, apiGet, apiPut } from "./apiClient";

export function crearPedido(pedido) {
  return apiPost("/pedidos", pedido);
}

export function misPedidos() {
  return apiGet("/pedidos/mios");
}

export function listarPedidosAdmin() {
  return apiGet("/pedidos");
}

export function cambiarEstadoPedido(id, estado) {
  return apiPut(`/pedidos/${id}/estado?estado=${estado}`);
}
