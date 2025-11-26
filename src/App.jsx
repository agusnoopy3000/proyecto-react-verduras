import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
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
        
        {/* 🔒 Rutas protegidas - Requieren autenticación */}
        <Route path="/carrito" element={<ProtectedRoute><Carrito /></ProtectedRoute>} />
        <Route path="/pedido" element={<ProtectedRoute><Pedido /></ProtectedRoute>} />
        <Route path="/confirmacion" element={<ProtectedRoute><Confirmacion /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/exito" element={<ProtectedRoute><Success /></ProtectedRoute>} />
        <Route path="/error-pago" element={<ProtectedRoute><ErrorPayment /></ProtectedRoute>} />
        
        {/* Rutas públicas */}
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/ofertas" element={<Offers />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
      <Footer />
    </CartProvider>
  );
}
