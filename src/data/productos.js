// Cargar todas las imágenes de la carpeta como URLs (Vite)
const images = import.meta.glob('../assets/img/*', { eager: true, as: 'url' });

// Mapear por nombre de archivo en minúsculas para búsqueda tolerante a mayúsculas
const imagesMap = Object.fromEntries(
  Object.entries(images).map(([path, url]) => [path.split('/').pop().toLowerCase(), url])
);

const getImg = (filename) => imagesMap[filename.toLowerCase()] || imagesMap['placeholder.png'] || '';

// Datos de productos (usa getImg('nombreArchivo.ext') para la img)
export default [
  {
    codigo: "FR001",
    nombre: "Manzana Fuji",
    categoria: "Frutas Frescas",
    precio: 1490,
    origen: "Curicó",
    stock: 50,
    img: getImg('Manza_fuji.jpg')
  },
  {
    codigo: "FR002",
    nombre: "Naranja Valencia",
    categoria: "Frutas Frescas",
    precio: 1290,
    origen: "Coquimbo",
    stock: 60,
    img: getImg('naranja.webp')
  },
  {
    codigo: "VR001",
    nombre: "Lechuga Hidropónica",
    categoria: "Verduras Orgánicas",
    precio: 990,
    origen: "Quillota",
    stock: 40,
    img: getImg('lechuga-hidroponica.jpeg')
  },
  {
    codigo: "VR002",
    nombre: "Zanahoria Orgánica",
    categoria: "Verduras Orgánicas",
    precio: 1190,
    origen: "Talca",
    stock: 80,
    img: getImg('zanahoria.webp')
  },
  {
    codigo: "PO001",
    nombre: "Avena Integral 1kg",
    categoria: "Productos Orgánicos",
    precio: 1990,
    origen: "Chillán",
    stock: 30,
    img: getImg('Avena_integral.webp')
  },
  {
    codigo: "PO002",
    nombre: "Miel de Ulmo 500g",
    categoria: "Productos Orgánicos",
    precio: 4990,
    origen: "Osorno",
    stock: 25,
    img: getImg('miel_de_ulmo.webp')
  },
  {
    codigo: "PL001",
    nombre: "Leche Entera 1L",
    categoria: "Productos Lácteos",
    precio: 1290,
    origen: "Los Ángeles",
    stock: 70,
    img: getImg('leche_entera.webp')
  },
  {
    codigo: "PL002",
    nombre: "Queso Chanco 250g",
    categoria: "Productos Lácteos",
    precio: 3490,
    origen: "Valdivia",
    stock: 35,
    img: getImg('queso_chanco.webp')
  },
  {
    codigo: "FR003",
    nombre: "Plátano",
    categoria: "Frutas Frescas",
    precio: 1190,
    origen: "Importado",
    stock: 90,
    img: getImg('platano.webp')
  },
  {
    codigo: "VR003",
    nombre: "Tomate",
    categoria: "Verduras Orgánicas",
    precio: 1490,
    origen: "Limache",
    stock: 55,
    img: getImg('Tomates.webp')
  },
  {
    codigo: "PO003",
    nombre: "Harina Integral 1kg",
    categoria: "Productos Orgánicos",
    precio: 1790,
    origen: "Colchagua",
    stock: 45,
    img: getImg('harina.webp')
  },
  {
    codigo: "PL003",
    nombre: "Yogurt Natural 1L",
    categoria: "Productos Lácteos",
    precio: 1990,
    origen: "Osorno",
    stock: 40,
    img: getImg('yogurt.webp')
  }
];