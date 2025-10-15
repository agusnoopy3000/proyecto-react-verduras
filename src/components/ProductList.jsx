import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { getProductos } from "../data/productosData";

export default function ProductList() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    setProductos(getProductos());
  }, []);

  return (
    <div className="d-flex flex-wrap justify-content-center">
      {productos.map(p => <ProductCard key={p.id} producto={p} />)}
    </div>
  );
}
