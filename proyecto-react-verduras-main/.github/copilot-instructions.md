## Propósito

Este archivo orienta a agentes de codificación (Copilot/GPT-agents) sobre cómo trabajar eficazmente en este frontend React + Vite llamado `HuertoHogar`.
Incluye el panorama general, comandos clave, patrones recurrentes y ejemplos concretos extraídos del código.

## Panorama (Big picture)
- **Stack:** React + Vite (bundler), Bootstrap para estilos opcionales, react-router-dom para ruteo, react-toastify para notificaciones.
- **Estructura principal:**
  - `src/pages/` — vistas/“rutas” (ej. `Registro.jsx`, `Home.jsx`, `Admin.jsx`).
  - `src/components/` — componentes reutilizables (ej. `ProductCard.jsx`, `Header.jsx`).
  - `src/context/` — providers globales: `AuthContext.jsx` y `CartContext.jsx` (persisten en localStorage).
  - `public/data/productos.json` y `src/data/productos.js` — fuentes de datos de productos.

## Comandos útiles
- Instalar dependencias:
  ```powershell
  npm install
  ```
- Desarrollo (Vite):
  ```powershell
  npm run dev
  ```
- Compilar para producción:
  ```powershell
  npm run build
  ```
- corregir vulneravildiades:
  ```powershell
  npm audit fix
  ```
- Tests (Vitest):
  ```powershell
  npm run test
  ```
- Nota: `package.json` contiene todavía `"test:watch": "karma start"` (resto legacy). Para ver tests en modo watch preferir `npx vitest --watch` o actualizar el script a `vitest --watch`.

## Tests y entorno de pruebas
- Vitest está configurado con `environment: 'jsdom'` y `setupFiles: './src/tests/setupTests.ts'` (ver `vitest.config.ts`).
- Mocks/expect helpers se cargan desde `src/tests/setupTests.ts` (ahí se importa `@testing-library/jest-dom`).
- Tests de ejemplo: `src/tests/ProductCard.spec.js`, `src/tests/Registro.spec.js`, `src/tests/Perfil.test.js`.

## Patrones y convenciones del proyecto
- **Persistencia simple en localStorage:** claves observables:
  - `hh_user` — usuario actualmente logueado (AuthContext)
  - `hh_users` — usuarios registrados (AuthContext)
  - `cart` — contenido del carrito (CartContext)
- **AuthContext:** contiene `demoUsers` en memoria y funciones `login`, `logout`, `register`. Evitar eliminar la lógica de demo sin adaptar tests.
- **CartContext:** API simple: `addToCart(producto, cantidad)`, `setItemQuantity`, `removeFromCart`, `clearCart`, `getTotalItems`.
- **Ruteo:** `src/App.jsx` centraliza las `Route` que apuntan a archivos en `src/pages/`. Para añadir una ruta: crear `src/pages/Nueva.jsx` y registrar `<Route path="/nueva" element={<Nueva/>} />` en `App.jsx`.
- **Duplicación de providers:** actualmente `CartProvider` aparece tanto en `src/main.jsx` como en `src/App.jsx`. No modifiques el envoltorio de providers sin validar que no rompe el estado compartido.

## Integraciones y dependencias externas
- `react-router-dom` v7 — revisar la API de `Routes`/`Route` al modificar rutas.
- `react-toastify` usado en `App.jsx` (`ToastContainer`).
- Bootstrap está listado en dependencias pero las importaciones están comentadas en `src/main.jsx` — verifica si tu cambio requiere habilitar Bootstrap CSS/JS.

## Datos y recursos estáticos
- Productos JSON desde `public/data/productos.json`. Para cambios de producto en tiempo de desarrollo puedes modificar `src/data/productos.js` o `public/data/productos.json` según el caso de uso.

## Cómo abordar cambios comunes (ejemplos)
- Añadir un nuevo page + test:
  1. Crear `src/pages/MiPage.jsx` exportando componente por defecto.
  2. Registrar ruta en `src/App.jsx`.
  3. Añadir test en `src/tests/MiPage.spec.js` usando Testing Library y `vitest`.
- Modificar persistencia de `AuthContext`:
  - Actualizar `STORAGE_KEY = 'hh_user'` y armonizar con `src/tests` mocks.
  - Los cambios en `localStorage` requieren limpiar localStorage en los tests o adaptar `setupTests.ts`.

## Precauciones / cosas detectadas
- Hay archivos y configuraciones legacy (Karma/Jasmine, backups en `backups/`) — evita ejecutar `karma` salvo que entiendas la migración histórica.
- No asumas que `bootstrap` está activo; comprueba si los imports en `src/main.jsx` están descomentados antes de usarlos.
- Evita refactorizaciones profundas de providers/context sin ejecutar la suite de `vitest` y probar manualmente la navegación / persistencia.

## Archivos clave para inspeccionar rápido
- `package.json` — scripts y dependencias.
- `vitest.config.ts` — configuración de tests (jsdom, setupFiles).
- `src/context/AuthContext.jsx` — lógica de login/register, claves de localStorage.
- `src/context/CartContext.jsx` — API del carrito y persistencia.
- `src/App.jsx` — rutas y composición principal de la app.
- `public/data/productos.json` y `src/data/productos.js` — fuente de productos.

## Si necesitas más información
- Pide que te muestre tests relevantes (`src/tests/*`) o archivos de páginas específicas a modificar.
- Indica si quieres que actualice `package.json` para reemplazar `karma` watch por `vitest --watch`.

---
Por favor revisa este borrador y dime si quieres que incorpore ejemplos de tests concretos o instrucciones de CI (GitHub Actions) basadas en `vitest`.
