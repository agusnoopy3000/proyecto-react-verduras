# 📋 Endpoints Backend Pendientes - Panel Admin

## 🔴 **OPERACIONES QUE TRABAJAN SOLO LOCALMENTE**

Actualmente, las siguientes operaciones en el panel de administración **NO están integradas con el backend** y solo modifican el estado local del frontend:

---

## 1️⃣ **USUARIOS** (User Management)

### ✅ **Ya Implementado:**
- `GET /v1/users?page=0&size=50` - Listar usuarios (paginado)

### ❌ **Pendientes de Implementar:**

#### **Crear Usuario**
```http
POST /v1/users
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  "run": "12.345.678-9",
  "nombre": "Juan",
  "apellidos": "Pérez González",
  "email": "juan@ejemplo.com",
  "password": "password123",
  "tipo": "Cliente",  // "Cliente" | "Administrador" | "Vendedor"
  "region": "Metropolitana",
  "comuna": "Santiago",
  "direccion": "Av. Principal 123",
  "fechaNac": "1990-01-15"
}

Response 201:
{
  "id": 1,
  "run": "12.345.678-9",
  "nombre": "Juan",
  "apellidos": "Pérez González",
  "email": "juan@ejemplo.com",
  "tipo": "Cliente",
  ...
}
```

#### **Actualizar Usuario**
```http
PUT /v1/users/{id}
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  "run": "12.345.678-9",
  "nombre": "Juan Actualizado",
  "apellidos": "Pérez González",
  "email": "juan@ejemplo.com",
  "tipo": "Vendedor",
  "region": "Metropolitana",
  "comuna": "Santiago",
  "direccion": "Nueva Dirección 456",
  "fechaNac": "1990-01-15"
}

Response 200:
{
  "id": 1,
  "run": "12.345.678-9",
  "nombre": "Juan Actualizado",
  ...
}
```

#### **Eliminar Usuario**
```http
DELETE /v1/users/{id}
Authorization: Bearer {token}

Response 204: No Content
```

---

## 2️⃣ **PRODUCTOS** (Product Management)

### ✅ **Ya Implementado:**
- `GET /v1/products` - Listar productos

### ❌ **Pendientes de Implementar:**

#### **Crear Producto**
```http
POST /v1/products
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  "codigo": "VH-005",
  "nombre": "Lechuga Orgánica",
  "desc": "Lechuga fresca cultivada sin pesticidas",
  "precio": 1990,
  "stock": 50,
  "stockCritico": 10,
  "categoria": "Verduras",
  "img": "https://ejemplo.com/lechuga.jpg"
}

Response 201:
{
  "id": 5,
  "codigo": "VH-005",
  "nombre": "Lechuga Orgánica",
  "desc": "Lechuga fresca cultivada sin pesticidas",
  "precio": 1990,
  "stock": 50,
  "stockCritico": 10,
  "categoria": "Verduras",
  "img": "https://ejemplo.com/lechuga.jpg",
  "createdAt": "2025-11-26T03:00:00Z"
}
```

#### **Actualizar Producto**
```http
PUT /v1/products/{id}
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  "codigo": "VH-005",
  "nombre": "Lechuga Orgánica Premium",
  "desc": "Lechuga fresca cultivada sin pesticidas - Tamaño grande",
  "precio": 2490,
  "stock": 45,
  "stockCritico": 10,
  "categoria": "Verduras",
  "img": "https://ejemplo.com/lechuga-premium.jpg"
}

Response 200:
{
  "id": 5,
  "codigo": "VH-005",
  "nombre": "Lechuga Orgánica Premium",
  ...
}
```

#### **Eliminar Producto**
```http
DELETE /v1/products/{id}
Authorization: Bearer {token}

Response 204: No Content
```

---

## 3️⃣ **PEDIDOS** (Order Management)

### ✅ **Ya Implementado:**
- `GET /v1/orders` - Listar pedidos

### ⚠️ **Parcialmente Implementado (requiere ajustes):**

#### **Actualizar Estado de Pedido**
```http
PUT /v1/orders/{id}/status
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  "status": "ENVIADO"  // PENDIENTE | CONFIRMADO | ENVIADO | ENTREGADO | CANCELADO
}

Response 200:
{
  "id": "ORD-001",
  "status": "ENVIADO",
  "cliente": {
    "email": "cliente@ejemplo.com",
    "nombre": "Cliente Ejemplo"
  },
  "total": 15990,
  "fechaCreacion": "2025-11-25T10:00:00Z",
  "fechaActualizacion": "2025-11-26T03:00:00Z"
}
```

**NOTA:** El frontend actualmente intenta múltiples formatos:
1. `PUT /v1/orders/{id}/status` con body `{ status: "..." }`
2. `PATCH /v1/orders/{id}/status` con body
3. `PUT /v1/orders/{id}/status?status=...` con query param
4. `PUT /v1/orders/{id}` con pedido completo

**Recomendación:** Implementar la opción 1 (PUT con body JSON) que es la más RESTful.

---

## 4️⃣ **DOCUMENTOS S3** (File Management)

### ✅ **Ya Implementado:**
- `GET /documentos` - Listar documentos
- `POST /documentos` - Subir documento (multipart/form-data)
- `DELETE /documentos/{id}` - Eliminar documento

**¡Estos endpoints ya funcionan correctamente!** ✅

---

## 📊 **RESUMEN DE IMPLEMENTACIÓN**

| Entidad    | GET (Listar) | POST (Crear) | PUT (Actualizar) | DELETE (Eliminar) |
|------------|--------------|--------------|------------------|-------------------|
| **Usuarios**   | ✅ Implementado | ❌ Pendiente | ❌ Pendiente    | ❌ Pendiente      |
| **Productos**  | ✅ Implementado | ❌ Pendiente | ❌ Pendiente    | ❌ Pendiente      |
| **Pedidos**    | ✅ Implementado | N/A          | ⚠️ Ajustar      | N/A               |
| **Documentos** | ✅ Implementado | ✅ Implementado | N/A         | ✅ Implementado   |

---

## 🔐 **SEGURIDAD Y AUTORIZACIÓN**

**Todos los endpoints de administración deben:**

1. ✅ Requerir autenticación (JWT token en header `Authorization: Bearer {token}`)
2. ✅ Validar que el usuario tenga rol `ADMIN` o `Administrador`
3. ✅ Retornar `403 Forbidden` si el usuario no tiene permisos
4. ✅ Validar datos de entrada (DTO/validación con annotations)

### Ejemplo de validación en Spring Boot:

```java
@RestController
@RequestMapping("/v1/users")
@PreAuthorize("hasRole('ADMIN')")  // Solo ADMIN puede acceder
public class UserAdminController {
    
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody CreateUserRequest request) {
        // Implementación
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
        @PathVariable Long id, 
        @Valid @RequestBody UpdateUserRequest request
    ) {
        // Implementación
    }
    
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id) {
        // Implementación
    }
}
```

---

## 🧪 **PRUEBAS RECOMENDADAS**

Para cada endpoint nuevo, probar:

1. ✅ **Usuario ADMIN** - Debe poder crear/editar/eliminar
2. ❌ **Usuario Cliente** - Debe recibir 403 Forbidden
3. ❌ **Sin token** - Debe recibir 401 Unauthorized
4. ✅ **Validación de datos** - Campos requeridos, formatos correctos
5. ✅ **Datos inválidos** - Debe retornar 400 Bad Request con mensaje claro

---

## 🚀 **PRIORIDAD DE IMPLEMENTACIÓN**

### **Alta Prioridad:**
1. **Productos** (CRUD completo) - Los más usados en ecommerce
2. **Pedidos** (actualizar estado) - Ya parcialmente implementado

### **Media Prioridad:**
3. **Usuarios** (CRUD completo) - Gestión de clientes y admins

---

## 📝 **NOTAS ADICIONALES**

### **Estructura de Response Esperada por el Frontend:**

#### Usuarios:
```typescript
interface User {
  id?: number;
  run: string;
  nombre: string;
  apellidos: string;
  email: string;
  tipo: "Cliente" | "Administrador" | "Vendedor";
  region?: string;
  comuna?: string;
  direccion?: string;
  fechaNac?: string;
}
```

#### Productos:
```typescript
interface Product {
  id?: number;
  codigo: string;
  nombre: string;
  desc?: string;
  precio: number;
  stock: number;
  stockCritico: number;
  categoria?: string;
  img?: string;
}
```

#### Pedidos:
```typescript
interface Order {
  id: string;
  status: "PENDIENTE" | "CONFIRMADO" | "ENVIADO" | "ENTREGADO" | "CANCELADO";
  cliente?: {
    email: string;
    nombre?: string;
  };
  clienteEmail?: string;
  total?: number;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  createdAt?: string;
}
```

---

## 🔧 **CAMBIOS EN EL FRONTEND DESPUÉS DE IMPLEMENTAR**

Una vez implementados los endpoints, actualizar en `Admin.jsx`:

```javascript
// ❌ ANTES (solo local):
const saveUsers = async (arr) => {
  setUsers(arr);
};

// ✅ DESPUÉS (con backend):
const saveUsers = async (userData) => {
  try {
    if (editingUserIdx === null) {
      // Crear nuevo
      const { data } = await api.post('/v1/users', userData);
      setUsers(prev => [...prev, data]);
      toast.success('Usuario creado exitosamente');
    } else {
      // Actualizar existente
      const userId = users[editingUserIdx].id;
      const { data } = await api.put(`/v1/users/${userId}`, userData);
      setUsers(prev => prev.map((u, i) => i === editingUserIdx ? data : u));
      toast.success('Usuario actualizado exitosamente');
    }
  } catch (error) {
    toast.error('Error al guardar usuario');
    throw error;
  }
};
```

---

**Última actualización:** 26 de noviembre de 2025  
**Autor:** Análisis del código frontend Admin.jsx
