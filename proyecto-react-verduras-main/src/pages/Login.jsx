import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";
import { toast } from "react-toastify";

export default function Login() {
  const [form, setForm] = useState({
    correoElectronico: "",
    contrasena: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const cur = "login";
    document.querySelectorAll("nav a").forEach((a) => {
      const href = a.getAttribute("href") || "";
      if (href.includes(cur)) a.classList.add("active");
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.correoElectronico, form.contrasena);
      toast.success("Has iniciado sesión correctamente");
      navigate("/"); // puedes cambiar a /perfil si quieres
    } catch (error) {
      console.error(error);
      toast.error("Correo o contraseña incorrectos");
    }
  };

  return (
    <main className="container">
      <section className="auth-form">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              name="correoElectronico"
              className="form-control"
              value={form.correoElectronico}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name="contrasena"
              className="form-control"
              value={form.contrasena}
              onChange={handleChange}
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-success w-100 native-submit"
            style={{ marginTop: "10px" }}
          >
            Ingresar
          </button>


        </form>
        <p>
          <Link to="/registro">¿No tienes cuenta? Regístrate</Link>
        </p>
      </section>
    </main>
  );
}
