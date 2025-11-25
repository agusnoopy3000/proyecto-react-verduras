/**
 * Carga imágenes compatible con:
 * - Vite: import.meta.glob (eager, as: 'url')
 * - Webpack (Karma tests): require.context
 * - Fallback estático cuando no hay bundler de assets
 */
const imagesMap = (() => {
  // Intentar Vite import.meta.glob de forma dinámica (evita que webpack lo analice)
  try {
    const globFn = new Function(
      'return (typeof import !== "undefined" && typeof import.meta !== "undefined" && import.meta.glob) ? import.meta.glob : undefined'
    )();
    if (globFn) {
      const modules = globFn('../assets/img/*', { eager: true, as: 'url' });  // Nota: Esto no funciona para public; usa fallback
      return Object.fromEntries(Object.entries(modules).map(([path, url]) => [path.split('/').pop().toLowerCase(), url]));
    }
  } catch (e) { /* no Vite */ }

  // Intentar Webpack require.context
  try {
    if (typeof require === 'function' && typeof require.context === 'function') {
      const ctx = require.context('../assets/img', false, /\.(png|jpe?g|webp|gif)$/);
      const entries = ctx.keys().map(k => [k.split('/').pop().toLowerCase(), ctx(k)]);
      return Object.fromEntries(entries);
    }
  } catch (e) { /* no webpack context */ }

  // Fallback mínimo: nombres conocidos con rutas absolutas a /data/ (para S3)
  return {
    'manza_fuji.jpg': '/data/Manza_fuji.jpg',
    'naranja.webp': '/data/naranja.webp',
    'lechuga-hidroponica.jpeg': '/data/lechuga-hidroponica.jpeg',
    'zanahoria.webp': '/data/zanahoria.webp',
    'avena_integral.webp': '/data/Avena_integral.webp',
    'miel_de_ulmo.webp': '/data/miel_de_ulmo.webp',
    'leche_entera.webp': '/data/leche_entera.webp',
    'queso_chanco.webp': '/data/queso_chanco.webp',
    'platano.webp': '/data/platano.webp',
    'tomates.webp': '/data/Tomates.webp',
    'harina.webp': '/data/harina.webp',
    'yogurt.webp': '/data/yogurt.webp',
    'placeholder.png': '/data/placeholder.png'
  };
})();

// Agrega función getImg si no existe (devuelve rutas absolutas)
export const getImg = (filename) => {
  const key = (filename || '').toLowerCase();
  return imagesMap[key] || '/data/placeholder.png';
};

export default [
  {
    codigo: "FR001",
    nombre: "Manzana Fuji",
    categoria: "Frutas Frescas",
    precio: 1490,
    origen: "Curicó",
    stock: 50,
    img: getImg('Manza_fuji.jpg')  // Ya correcto, asume archivo existe
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
    img: getImg('Avena_integral.webp')  // Ya correcto, asume archivo existe
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
    img: getImg('Tomates.webp')  // Ya correcto, asume archivo existe
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