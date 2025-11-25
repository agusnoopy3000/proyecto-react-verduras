export let productos = [
  { id: 1, nombre: "Tomate", precio: 1000, categoria: "Verduras", oferta: false },
  { id: 2, nombre: "Lechuga", precio: 800, categoria: "Verduras", oferta: true },
  { id: 3, nombre: "Zanahoria", precio: 1200, categoria: "Hortalizas", oferta: false }
];

// CRUD simulado
export const getProductos = () => productos;
export const addProducto = (p) => productos.push(p);
export const deleteProducto = (id) => { productos = productos.filter(p => p.id !== id); };
