import React, { useEffect, useState } from "react";

export default function Toast() {
  const [msg, setMsg] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // solo mostramos el mensaje genérico esperado
      const incoming = e?.detail || "";
      // aceptar mensajes, pero forzar el texto requerido
      if (incoming === "Producto agregado" || incoming === "") {
        setMsg("Producto agregado");
      } else {
        // por seguridad también aceptar otros eventos pero no mostrar nombre
        setMsg("Producto agregado");
      }
      setVisible(true);
      setTimeout(() => setVisible(false), 2200);
    };
    window.addEventListener("show-toast", handler);
    return () => window.removeEventListener("show-toast", handler);
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed",
      right: 18,
      bottom: 18,
      background: "rgba(0,0,0,.85)",
      color: "#fff",
      padding: "10px 14px",
      borderRadius: 10,
      zIndex: 9999,
      boxShadow: "0 6px 18px rgba(0,0,0,.2)"
    }}>
      {msg}
    </div>
  );
}