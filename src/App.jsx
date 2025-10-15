import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Offers from "./pages/Offers";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import ErrorPayment from "./pages/ErrorPayment";

export default function App() {
  return (
    <>
      <Header />
      <main className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/ofertas" element={<Offers />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/exito" element={<Success />} />
          <Route path="/error-pago" element={<ErrorPayment />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
