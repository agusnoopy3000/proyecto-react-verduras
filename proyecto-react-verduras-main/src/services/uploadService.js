import { API_URL } from "../config/api";
import { authHeader } from "./apiClient";

export async function subirImagenProducto(id, archivo) {
  const formData = new FormData();
  formData.append("archivo", archivo);

  const res = await fetch(`${API_URL}/productos/${id}/imagen`, {
    method: "POST",
    headers: {
      ...authHeader()
    },
    body: formData
  });

  return res.json();
}
