# 🎯 GUÍA DE INTEGRACIÓN FRONTEND - HUERTO HOGAR

## ⚡ RESUMEN EJECUTIVO

Esta guía explica **qué cambios debes hacer en el frontend React** una vez que el backend implemente los nuevos endpoints de CRUD para Usuarios, Productos y actualización de Estados de Pedidos.

---

## 🔴 CAMBIOS CRÍTICOS (BREAKING CHANGES)

### 1️⃣ **ACTUALIZAR ENUM DE ESTADOS DE PEDIDOS**

El backend ahora usa estados en inglés en MAYÚSCULAS. Debes actualizar tu código:

**❌ ANTES (si usabas español):**
```javascript
order.estado = "Pendiente"
order.estado = "Confirmado"
```

**✅ AHORA:**
```javascript
order.status = "PENDIENTE"
order.status = "CONFIRMADO"
order.status = "ENVIADO"
order.status = "ENTREGADO"
order.status = "CANCELADO"
```

**Estados válidos:**
- `PENDIENTE` - Pedido recién creado, esperando confirmación
- `CONFIRMADO` - Admin confirmó el pedido
- `ENVIADO` - Pedido en camino al cliente
- `ENTREGADO` - Pedido entregado exitosamente (estado final)
- `CANCELADO` - Pedido cancelado (estado final)

---

## 🆕 NUEVOS ENDPOINTS DISPONIBLES

### 📋 **1. ACTUALIZAR ESTADO DE PEDIDO**

```javascript
// Solo usuarios con rol ADMIN
PUT /api/v1/orders/{id}/status
Headers: { 
  "Authorization": "Bearer <admin_token>",
  "Content-Type": "application/json"
}
Body: { 
  "status": "CONFIRMADO" 
}

// Ejemplo con fetch
const updateOrderStatus = async (orderId, newStatus) => {
  const response = await fetch(`http://52.2.172.54:8080/api/v1/orders/${orderId}/status`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status: newStatus })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar estado');
  }
  
  return await response.json();
};

// Uso en componente
const handleStatusChange = async (orderId, newStatus) => {
  try {
    const updatedOrder = await updateOrderStatus(orderId, newStatus);
    console.log('Pedido actualizado:', updatedOrder);
    // Actualizar estado local o recargar pedidos
    loadOrders();
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
};
```

---

### 📦 **2. CRUD DE PRODUCTOS (Solo ADMIN)**

#### **Crear Producto**
```javascript
POST /api/v1/products
Headers: { 
  "Authorization": "Bearer <admin_token>",
  "Content-Type": "application/json"
}
Body: {
  "codigo": "VRD-003",
  "nombre": "Zanahoria",
  "desc": "Zanahoria fresca orgánica",
  "precio": 1800,
  "stock": 75,
  "stockCritico": 10,
  "categoria": "Verduras",
  "img": "https://example.com/zanahoria.jpg"
}

// Ejemplo
const createProduct = async (productData) => {
  const response = await api.post('/v1/products', productData);
  return response.data;
};
```

#### **Actualizar Producto**
```javascript
PUT /api/v1/products/{id}
Headers: { 
  "Authorization": "Bearer <admin_token>",
  "Content-Type": "application/json"
}
Body: {
  "codigo": "VRD-003",
  "nombre": "Zanahoria Premium",  // Modificado
  "desc": "Zanahoria fresca orgánica certificada",
  "precio": 2200,  // Modificado
  "stock": 50,
  "stockCritico": 10,
  "categoria": "Verduras Premium",  // Modificado
  "img": "https://example.com/zanahoria-premium.jpg"
}

// Ejemplo
const updateProduct = async (productId, productData) => {
  const response = await api.put(`/v1/products/${productId}`, productData);
  return response.data;
};
```

#### **Eliminar Producto**
```javascript
DELETE /api/v1/products/{id}
Headers: { 
  "Authorization": "Bearer <admin_token>"
}

// Ejemplo
const deleteProduct = async (productId) => {
  await api.delete(`/v1/products/${productId}`);
};
```

---

### 👥 **3. CRUD DE USUARIOS (Solo ADMIN)**

#### **Crear Usuario**
```javascript
POST /api/v1/users
Headers: { 
  "Authorization": "Bearer <admin_token>",
  "Content-Type": "application/json"
}
Body: {
  "run": "20.123.456-7",
  "nombre": "María",
  "apellidos": "González Pérez",
  "email": "maria.gonzalez@example.com",
  "password": "Segur@123",  // Solo al crear
  "tipo": "Cliente",  // "Cliente" | "Administrador" | "Vendedor"
  "region": "Metropolitana",
  "comuna": "Santiago",
  "direccion": "Av. Libertador 1234",
  "fechaNac": "1995-03-20"
}

// Ejemplo
const createUser = async (userData) => {
  const response = await api.post('/v1/users', userData);
  return response.data;
};
```

#### **Actualizar Usuario**
```javascript
PUT /api/v1/users/{id}
Headers: { 
  "Authorization": "Bearer <admin_token>",
  "Content-Type": "application/json"
}
Body: {
  "run": "20.123.456-7",
  "nombre": "María Fernanda",  // Modificado
  "apellidos": "González Pérez",
  "email": "maria.gonzalez@example.com",
  // password es OPCIONAL en actualizaciones
  "tipo": "Vendedor",  // Modificado
  "region": "Valparaíso",  // Modificado
  "comuna": "Viña del Mar",
  "direccion": "Nueva Calle 456",
  "fechaNac": "1995-03-20"
}

// Ejemplo
const updateUser = async (userId, userData) => {
  const response = await api.put(`/v1/users/${userId}`, userData);
  return response.data;
};
```

#### **Eliminar Usuario**
```javascript
DELETE /api/v1/users/{id}
Headers: { 
  "Authorization": "Bearer <admin_token>"
}

// Ejemplo
const deleteUser = async (userId) => {
  await api.delete(`/v1/users/${userId}`);
};
```

---

## 🔐 SEGURIDAD Y PERMISOS

### **Verificar Rol ADMIN en el Frontend**

```javascript
// Decodificar JWT para obtener el rol
import jwtDecode from 'jwt-decode';

const token = localStorage.getItem('hh_token');
if (!token) {
  // No hay sesión
  return;
}

try {
  const decoded = jwtDecode(token);
  const isAdmin = decoded.role === 'ADMIN' || decoded.authorities?.includes('ROLE_ADMIN');
  
  if (!isAdmin) {
    console.warn('Usuario no tiene permisos de administrador');
    // Ocultar opciones de admin
  }
} catch (error) {
  console.error('Token inválido:', error);
  // Redirigir a login
}
```

### **Renderizado Condicional**

```jsx
import { useAuth } from '../context/AuthContext';

function AdminPanel() {
  const { user, isAdmin } = useAuth();
  
  if (!isAdmin) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div>
      <h2>Panel de Administración</h2>
      
      {/* Solo mostrar si es admin */}
      {isAdmin && (
        <>
          <button onClick={handleCreateProduct}>Crear Producto</button>
          <button onClick={handleCreateUser}>Crear Usuario</button>
        </>
      )}
    </div>
  );
}
```

### **Manejar Errores 403 (Forbidden)**

```javascript
// En tu cliente API (src/api/client.js)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 403) {
      alert('No tienes permisos para realizar esta acción');
      // Opcional: redirigir a home
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);
```

---

## 📋 COMPONENTES A ACTUALIZAR/CREAR

### **1. Panel de Gestión de Pedidos**

```jsx
// src/pages/Admin.jsx - Sección de Pedidos
function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/v1/orders');
      setOrders(data);
    } catch (error) {
      console.error('Error cargando pedidos:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/v1/orders/${orderId}/status`, { status: newStatus });
      toast.success('Estado actualizado');
      loadOrders(); // Recargar
    } catch (error) {
      toast.error('Error al actualizar estado');
    }
  };
  
  return (
    <div>
      <h3>Gestión de Pedidos</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.cliente?.email || 'N/D'}</td>
              <td>${order.total?.toLocaleString('es-CL')}</td>
              <td>
                <span className={`badge badge-${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </td>
              <td>
                <select 
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  disabled={order.status === 'ENTREGADO' || order.status === 'CANCELADO'}
                >
                  <option value="PENDIENTE">PENDIENTE</option>
                  <option value="CONFIRMADO">CONFIRMADO</option>
                  <option value="ENVIADO">ENVIADO</option>
                  <option value="ENTREGADO">ENTREGADO</option>
                  <option value="CANCELADO">CANCELADO</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getStatusColor(status) {
  const colors = {
    PENDIENTE: 'warning',
    CONFIRMADO: 'info',
    ENVIADO: 'primary',
    ENTREGADO: 'success',
    CANCELADO: 'danger'
  };
  return colors[status] || 'secondary';
}
```

### **2. Panel de Gestión de Productos**

```jsx
// src/pages/Admin.jsx - Sección de Productos
function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    desc: '',
    precio: 0,
    stock: 0,
    stockCritico: 10,
    categoria: '',
    img: ''
  });
  
  const loadProducts = async () => {
    const { data } = await api.get('/v1/products');
    setProducts(data);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        // Actualizar
        await api.put(`/v1/products/${editingProduct.id}`, formData);
        toast.success('Producto actualizado');
      } else {
        // Crear
        await api.post('/v1/products', formData);
        toast.success('Producto creado');
      }
      
      setShowModal(false);
      loadProducts();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar');
    }
  };
  
  const handleDelete = async (productId) => {
    if (!confirm('¿Eliminar este producto?')) return;
    
    try {
      await api.delete(`/v1/products/${productId}`);
      toast.success('Producto eliminado');
      loadProducts();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };
  
  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowModal(true);
  };
  
  const openCreateModal = () => {
    setEditingProduct(null);
    resetForm();
    setShowModal(true);
  };
  
  const resetForm = () => {
    setFormData({
      codigo: '',
      nombre: '',
      desc: '',
      precio: 0,
      stock: 0,
      stockCritico: 10,
      categoria: '',
      img: ''
    });
  };
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h3>Gestión de Productos</h3>
        <button className="btn btn-primary" onClick={openCreateModal}>
          ➕ Nuevo Producto
        </button>
      </div>
      
      <table className="table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.codigo}</td>
              <td>{product.nombre}</td>
              <td>${product.precio?.toLocaleString('es-CL')}</td>
              <td>
                <span className={product.stock < product.stockCritico ? 'text-danger' : 'text-success'}>
                  {product.stock}
                </span>
              </td>
              <td>{product.categoria}</td>
              <td>
                <button className="btn btn-sm btn-outline-primary" onClick={() => openEditModal(product)}>
                  ✏️ Editar
                </button>
                <button className="btn btn-sm btn-outline-danger ms-2" onClick={() => handleDelete(product.id)}>
                  🗑️ Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Modal de crear/editar */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h4>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h4>
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Código (ej: VH-001)" 
              value={formData.codigo}
              onChange={e => setFormData({...formData, codigo: e.target.value})}
              required
            />
            <input 
              type="text" 
              placeholder="Nombre" 
              value={formData.nombre}
              onChange={e => setFormData({...formData, nombre: e.target.value})}
              required
            />
            <textarea 
              placeholder="Descripción" 
              value={formData.desc}
              onChange={e => setFormData({...formData, desc: e.target.value})}
            />
            <input 
              type="number" 
              placeholder="Precio" 
              value={formData.precio}
              onChange={e => setFormData({...formData, precio: parseInt(e.target.value)})}
              required
            />
            <input 
              type="number" 
              placeholder="Stock" 
              value={formData.stock}
              onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})}
              required
            />
            <input 
              type="number" 
              placeholder="Stock Crítico" 
              value={formData.stockCritico}
              onChange={e => setFormData({...formData, stockCritico: parseInt(e.target.value)})}
            />
            <input 
              type="text" 
              placeholder="Categoría" 
              value={formData.categoria}
              onChange={e => setFormData({...formData, categoria: e.target.value})}
            />
            <input 
              type="url" 
              placeholder="URL de imagen" 
              value={formData.img}
              onChange={e => setFormData({...formData, img: e.target.value})}
            />
            
            <div style={{ marginTop: 20 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary ms-2">
                {editingProduct ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
```

### **3. Panel de Gestión de Usuarios**

```jsx
// Similar a ProductsManagement pero con campos de usuario
function UsersManagement() {
  // Implementación similar usando los endpoints de usuarios
  // POST /v1/users, PUT /v1/users/{id}, DELETE /v1/users/{id}
}
```

---

## 🐛 MANEJO DE ERRORES COMUNES

### **Error 400 - Bad Request**
```javascript
try {
  await api.post('/v1/products', productData);
} catch (error) {
  if (error.response?.status === 400) {
    const validationErrors = error.response.data.errors || {};
    Object.entries(validationErrors).forEach(([field, message]) => {
      console.error(`${field}: ${message}`);
    });
    alert('Por favor corrige los errores en el formulario');
  }
}
```

### **Error 403 - Forbidden**
```javascript
if (error.response?.status === 403) {
  alert('No tienes permisos de administrador');
  navigate('/');
}
```

### **Error 404 - Not Found**
```javascript
if (error.response?.status === 404) {
  alert('El recurso no existe');
  loadProducts(); // Recargar lista
}
```

### **Error 409 - Conflict (Duplicado)**
```javascript
if (error.response?.status === 409) {
  alert('Ya existe un producto con ese código');
}
```

---

## 📊 ESTADOS Y COLORES RECOMENDADOS

```css
/* src/index.css o src/App.css */

/* Badges de estado de pedidos */
.badge-pendiente {
  background-color: #ffc107;
  color: #000;
}

.badge-confirmado {
  background-color: #17a2b8;
  color: #fff;
}

.badge-enviado {
  background-color: #007bff;
  color: #fff;
}

.badge-entregado {
  background-color: #28a745;
  color: #fff;
}

.badge-cancelado {
  background-color: #dc3545;
  color: #fff;
}

/* Stock crítico */
.text-danger {
  color: #dc3545;
}

.text-success {
  color: #28a745;
}
```

---

## 🔗 URLs Y ENDPOINTS

### **Backend API**
- **Base URL Producción**: `http://52.2.172.54:8080/api`
- **Swagger Docs**: `http://52.2.172.54:8080/swagger-ui/index.html`
- **Health Check**: `http://52.2.172.54:8080/actuator/health`

### **Frontend**
- **S3 Website**: `http://app-react-huerto-s3.s3-website-us-east-1.amazonaws.com`
- **Local Dev**: `http://localhost:5173`

---

## ✅ CHECKLIST DE INTEGRACIÓN

- [ ] **Actualizar tipos/interfaces** con nuevos campos (status, estados)
- [ ] **Implementar selector de estados** en gestión de pedidos
- [ ] **Crear formularios CRUD** para productos
- [ ] **Crear formularios CRUD** para usuarios
- [ ] **Agregar validación de permisos** (isAdmin)
- [ ] **Implementar manejo de errores** (400, 403, 404, 409)
- [ ] **Agregar indicadores visuales** (badges, colores)
- [ ] **Actualizar AuthContext** para verificar roles
- [ ] **Probar todos los flujos** con usuario ADMIN
- [ ] **Probar acceso denegado** con usuario Cliente
- [ ] **Validar formularios** antes de enviar
- [ ] **Agregar confirmaciones** antes de eliminar
- [ ] **Actualizar documentación** del proyecto

---

## 📞 SOPORTE

Si tienes dudas o problemas durante la integración:

1. **Consulta el backend**: Ver archivo `PROMPT_PARA_BACKEND.md`
2. **Revisa Swagger**: http://52.2.172.54:8080/swagger-ui/index.html
3. **Verifica logs del backend**: En EC2 con `sudo journalctl -u huerto-hogar -f`
4. **Prueba con Postman/cURL**: Antes de integrar en el frontend

---

**✅ ¡Listo para integrar!** Una vez que el backend implemente los endpoints, tu frontend ya sabrá exactamente qué hacer. 🚀
