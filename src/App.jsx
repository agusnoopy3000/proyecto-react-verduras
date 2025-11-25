import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Catalogo from "./pages/Catalogo";
import Carrito from "./pages/Carrito";
import Pedido from "./pages/Pedido";
import Confirmacion from "./pages/Confirmacion";
import Registro from "./pages/Registro";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import Admin from "./pages/Admin";
import Contacto from "./pages/Contacto";
import Nosotros from "./pages/Nosotros";
import Blog from "./pages/Blog.jsx";
import Offers from "./pages/Offers";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import ErrorPayment from "./pages/ErrorPayment";

export default function App() {
  return (
    <CartProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/pedido" element={<Pedido />} />
        <Route path="/confirmacion" element={<Confirmacion />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/ofertas" element={<Offers />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/exito" element={<Success />} />
        <Route path="/error-pago" element={<ErrorPayment />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
      <Footer />
    </CartProvider>
  );
}
