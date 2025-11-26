# 📋 Requisitos de Integración Backend - Panel de Administración HuertoHogar

## 🎯 OBJETIVO
Implementar los endpoints REST faltantes para completar la integración del panel de administración del frontend React con el backend Spring Boot desplegado en EC2 (`http://52.2.172.54:8080`).

---

## ✅ ESTADO ACTUAL (YA IMPLEMENTADO)

### Endpoints Funcionales:
- ✅ `POST /api/v1/auth/login` - Autenticación con JWT
- ✅ `POST /api/v1/auth/register` - Registro de usuarios
- ✅ `GET /api/v1/users?page=0&size=50` - Listar usuarios (paginado)
- ✅ `GET /api/v1/products` - Listar productos
- ✅ `GET /api/v1/orders` - Listar pedidos
- ✅ `GET /documentos` - Listar documentos S3
- ✅ `POST /documentos` - Subir documento a S3 (multipart/form-data)
- ✅ `DELETE /documentos/{id}` - Eliminar documento de S3

---

## ❌ ENDPOINTS PENDIENTES (ACTUALMENTE SOLO FUNCIONAN EN FRONTEND LOCAL)

### 1. 📦 **CRUD COMPLETO DE PRODUCTOS**

#### **A) Crear Producto**
```http
POST /api/v1/products
Content-Type: application/json
Authorization: Bearer {JWT_TOKEN}

Request Body:
{
  "codigo": "VH-004",
  "nombre": "Espinaca Orgánica",
  "desc": "Espinaca fresca cultivada sin pesticidas",
  "precio": 1990,
  "stock": 50,
  "stockCritico": 10,
  "categoria": "Verduras de Hoja",
  "img": "https://ejemplo.com/espinaca.jpg"
}

Response 201 Created:
{
  "id": 123,
  "codigo": "VH-004",
  "nombre": "Espinaca Orgánica",
  "desc": "Espinaca fresca cultivada sin pesticidas",
  "precio": 1990,
  "stock": 50,
  "stockCritico": 10,
  "categoria": "Verduras de Hoja",
  "img": "https://ejemplo.com/espinaca.jpg",
  "createdAt": "2025-11-26T10:30:00",
  "updatedAt": "2025-11-26T10:30:00"
}
```

**Validaciones:**
- `codigo`: Obligatorio, único, patrón alfanumérico + guion
- `nombre`: Obligatorio, max 100 caracteres
- `precio`: Obligatorio, >= 0
- `stock`: Obligatorio, >= 0
- `stockCritico`: Opcional, default = 10
- `categoria`: Opcional
- `img`: Opcional, debe ser URL válida si se proporciona

**Roles permitidos:** `ADMIN`

---

#### **B) Actualizar Producto**
```http
PUT /api/v1/products/{id}
Content-Type: application/json
Authorization: Bearer {JWT_TOKEN}

Request Body:
{
  "codigo": "VH-004",
  "nombre": "Espinaca Orgánica Premium",
  "desc": "Espinaca fresca cultivada sin pesticidas",
  "precio": 2490,
  "stock": 30,
  "stockCritico": 5,
  "categoria": "Verduras de Hoja",
  "img": "https://ejemplo.com/espinaca-premium.jpg"
}

Response 200 OK:
{
  "id": 123,
  "codigo": "VH-004",
  "nombre": "Espinaca Orgánica Premium",
  "desc": "Espinaca fresca cultivada sin pesticidas",
  "precio": 2490,
  "stock": 30,
  "stockCritico": 5,
  "categoria": "Verduras de Hoja",
  "img": "https://ejemplo.com/espinaca-premium.jpg",
  "createdAt": "2025-11-26T10:30:00",
  "updatedAt": "2025-11-26T11:45:00"
}
```

**Validaciones:**
- Mismo que crear producto
- Si se cambia el `codigo`, verificar que no exista otro producto con ese código

**Roles permitidos:** `ADMIN`

**Manejo de errores:**
- 404 si el producto no existe
- 400 si el código ya está en uso por otro producto
- 400 si las validaciones fallan

---

#### **C) Eliminar Producto**
```http
DELETE /api/v1/products/{id}
Authorization: Bearer {JWT_TOKEN}

Response 204 No Content
```

**Validaciones:**
- Verificar que el producto existe antes de eliminar
- Considerar soft delete (marcar como inactivo) en lugar de eliminación física
- Opcional: verificar que no hay pedidos pendientes con este producto

**Roles permitidos:** `ADMIN`

**Manejo de errores:**
- 404 si el producto no existe
- 409 si hay pedidos activos con este producto (opcional)

---

### 2. 👥 **CRUD COMPLETO DE USUARIOS**

#### **A) Crear Usuario (desde Admin)**
```http
POST /api/v1/users
Content-Type: application/json
Authorization: Bearer {JWT_TOKEN}

Request Body:
{
  "run": "12345678-9",
  "nombre": "Juan",
  "apellidos": "Pérez González",
  "email": "juan.perez@example.com",
  "password": "Password123!",
  "tipo": "Cliente",
  "region": "Metropolitana",
  "comuna": "Santiago",
  "direccion": "Av. Principal 123",
  "fechaNac": "1990-05-15"
}

Response 201 Created:
{
  "id": 456,
  "run": "12345678-9",
  "nombre": "Juan",
  "apellidos": "Pérez González",
  "email": "juan.perez@example.com",
  "tipo": "Cliente",
  "region": "Metropolitana",
  "comuna": "Santiago",
  "direccion": "Av. Principal 123",
  "fechaNac": "1990-05-15",
  "createdAt": "2025-11-26T10:30:00"
}
```

**Validaciones:**
- `run`: Obligatorio, único, validar formato chileno (XX.XXX.XXX-X)
- `nombre`: Obligatorio, min 2 caracteres
- `apellidos`: Obligatorio, min 2 caracteres
- `email`: Obligatorio, único, formato email válido
- `password`: Obligatorio, min 8 caracteres (debe cumplir política de seguridad)
- `tipo`: Obligatorio, valores permitidos: "Cliente", "Administrador", "Vendedor"
- Otros campos opcionales

**Roles permitidos:** `ADMIN`

**Notas importantes:**
- El password debe ser hasheado con BCrypt antes de guardar
- NO retornar el password en el response
- Enviar email de bienvenida (opcional)

---

#### **B) Actualizar Usuario**
```http
PUT /api/v1/users/{id}
Content-Type: application/json
Authorization: Bearer {JWT_TOKEN}

Request Body:
{
  "run": "12345678-9",
  "nombre": "Juan Carlos",
  "apellidos": "Pérez González",
  "email": "juan.perez@example.com",
  "tipo": "Vendedor",
  "region": "Valparaíso",
  "comuna": "Viña del Mar",
  "direccion": "Av. Libertad 456",
  "fechaNac": "1990-05-15"
}

Response 200 OK:
{
  "id": 456,
  "run": "12345678-9",
  "nombre": "Juan Carlos",
  "apellidos": "Pérez González",
  "email": "juan.perez@example.com",
  "tipo": "Vendedor",
  "region": "Valparaíso",
  "comuna": "Viña del Mar",
  "direccion": "Av. Libertad 456",
  "fechaNac": "1990-05-15",
  "updatedAt": "2025-11-26T11:45:00"
}
```

**Validaciones:**
- Mismo que crear usuario (excepto password que es opcional)
- Si se cambia el `email` o `run`, verificar que no exista otro usuario con esos datos
- Un ADMIN no puede cambiar su propio tipo a "Cliente"

**Roles permitidos:** `ADMIN`

**Manejo de errores:**
- 404 si el usuario no existe
- 400 si email/run ya está en uso por otro usuario
- 403 si intenta cambiar su propio rol a uno inferior

---

#### **C) Eliminar Usuario**
```http
DELETE /api/v1/users/{id}
Authorization: Bearer {JWT_TOKEN}

Response 204 No Content
```

**Validaciones:**
- Verificar que el usuario existe
- NO permitir que un admin se elimine a sí mismo
- Soft delete preferiblemente (marcar como inactivo)

**Roles permitidos:** `ADMIN`

**Manejo de errores:**
- 404 si el usuario no existe
- 403 si intenta eliminarse a sí mismo
- 409 si el usuario tiene pedidos pendientes (opcional)

---

### 3. 📋 **ACTUALIZACIÓN DE ESTADO DE PEDIDOS**

#### **Cambiar Estado de Pedido**
```http
PUT /api/v1/orders/{orderId}/status
Content-Type: application/json
Authorization: Bearer {JWT_TOKEN}

Request Body:
{
  "status": "ENVIADO"
}

Response 200 OK:
{
  "id": "ORD-2025-001",
  "status": "ENVIADO",
  "cliente": {
    "email": "cliente@example.com",
    "nombre": "María González"
  },
  "items": [...],
  "total": 15990,
  "fechaCreacion": "2025-11-20T14:30:00",
  "fechaActualizacion": "2025-11-26T10:30:00"
}
```

**Valores permitidos para status:**
- `PENDIENTE` (inicial)
- `CONFIRMADO`
- `ENVIADO`
- `ENTREGADO`
- `CANCELADO`

**Validaciones:**
- El pedido debe existir
- Transiciones de estado permitidas:
  - PENDIENTE → CONFIRMADO, CANCELADO
  - CONFIRMADO → ENVIADO, CANCELADO
  - ENVIADO → ENTREGADO
  - ENTREGADO → (no se puede cambiar)
  - CANCELADO → (no se puede cambiar)

**Roles permitidos:** `ADMIN`, `VENDEDOR`

**Notas adicionales:**
- Registrar historial de cambios de estado (opcional pero recomendado)
- Enviar notificación al cliente cuando cambie el estado (opcional)
- Al CANCELAR: considerar devolver stock de productos

**Manejo de errores:**
- 404 si el pedido no existe
- 400 si la transición de estado no es válida
- 400 si el estado proporcionado no es válido

---

## 🔒 SEGURIDAD Y AUTENTICACIÓN

### Requisitos para TODOS los endpoints:

1. **JWT Token requerido:**
   - Todos los endpoints (excepto login/register) deben validar JWT
   - Header: `Authorization: Bearer {token}`
   - Token debe contener: `userId`, `email`, `role`

2. **Control de Roles:**
   - **ADMIN**: Acceso total a todos los endpoints
   - **VENDEDOR**: Solo puede cambiar estado de pedidos
   - **CLIENTE**: Solo acceso a sus propios datos

3. **Validación de Token:**
   - Verificar que el token no esté expirado
   - Verificar firma del token
   - Verificar que el usuario aún existe y está activo

4. **Respuestas de Error Estándar:**
```json
// 401 Unauthorized
{
  "message": "Token no válido o expirado",
  "timestamp": "2025-11-26T10:30:00",
  "status": 401
}

// 403 Forbidden
{
  "message": "No tienes permisos para realizar esta acción",
  "timestamp": "2025-11-26T10:30:00",
  "status": 403
}

// 400 Bad Request
{
  "message": "Datos de entrada inválidos",
  "errors": {
    "email": "El email ya está registrado",
    "codigo": "El código de producto debe ser único"
  },
  "timestamp": "2025-11-26T10:30:00",
  "status": 400
}

// 404 Not Found
{
  "message": "Recurso no encontrado",
  "timestamp": "2025-11-26T10:30:00",
  "status": 404
}

// 500 Internal Server Error
{
  "message": "Error interno del servidor",
  "timestamp": "2025-11-26T10:30:00",
  "status": 500
}
```

---

## 🗄️ MODELOS DE DATOS

### Producto (Product)
```java
@Entity
@Table(name = "productos")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String codigo;
    
    @Column(nullable = false, length = 100)
    private String nombre;
    
    @Column(length = 500)
    private String desc;
    
    @Column(nullable = false)
    private Integer precio;
    
    @Column(nullable = false)
    private Integer stock;
    
    @Column(name = "stock_critico")
    private Integer stockCritico = 10;
    
    private String categoria;
    
    private String img;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
}
```

### Usuario (User)
```java
@Entity
@Table(name = "usuarios")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String run;
    
    @Column(nullable = false)
    private String nombre;
    
    @Column(nullable = false)
    private String apellidos;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password; // BCrypt hashed
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserType tipo; // CLIENTE, ADMINISTRADOR, VENDEDOR
    
    private String region;
    private String comuna;
    private String direccion;
    
    @Column(name = "fecha_nac")
    private LocalDate fechaNac;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
}
```

### Pedido (Order)
```java
@Entity
@Table(name = "pedidos")
public class Order {
    @Id
    private String id; // ORD-2025-001
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User cliente;
    
    @Enumerated(EnumType.STRING)
    private OrderStatus status; // PENDIENTE, CONFIRMADO, ENVIADO, ENTREGADO, CANCELADO
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items;
    
    private Integer total;
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
    
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;
    
    // Datos de envío
    private String direccionEnvio;
    private String comunaEnvio;
    private String regionEnvio;
    private String notasEnvio;
}
```

---

## 🧪 PRUEBAS REQUERIDAS

Para cada endpoint implementado, proporcionar:

1. **Unit Tests:**
   - Casos exitosos
   - Casos de error (400, 404, 403, 401)
   - Validaciones de datos

2. **Integration Tests:**
   - Flujo completo CRUD
   - Verificar transacciones
   - Verificar rollback en errores

3. **Ejemplos de cURL:**
```bash
# Crear producto
curl -X POST http://52.2.172.54:8080/api/v1/products \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "VH-004",
    "nombre": "Espinaca Orgánica",
    "precio": 1990,
    "stock": 50
  }'

# Actualizar usuario
curl -X PUT http://52.2.172.54:8080/api/v1/users/123 \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Carlos",
    "tipo": "Vendedor"
  }'

# Cambiar estado de pedido
curl -X PUT http://52.2.172.54:8080/api/v1/orders/ORD-2025-001/status \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"status": "ENVIADO"}'
```

---

## 📝 CONFIGURACIÓN CORS

Asegurar que el backend permita requests desde:
- `http://app-react-huerto-s3.s3-website-us-east-1.amazonaws.com` (producción)
- `http://localhost:5173` (desarrollo)

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins(
                        "http://app-react-huerto-s3.s3-website-us-east-1.amazonaws.com",
                        "http://localhost:5173"
                    )
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true)
                    .maxAge(3600);
            }
        };
    }
}
```

---

## 🚀 PRIORIDAD DE IMPLEMENTACIÓN

### ALTA PRIORIDAD (Funcionalidad crítica):
1. ✅ PUT/POST /api/v1/products - CRUD Productos
2. ✅ PUT /api/v1/orders/{id}/status - Cambiar estado pedidos
3. ✅ POST /api/v1/users - Crear usuario desde admin

### MEDIA PRIORIDAD:
4. ✅ PUT /api/v1/users/{id} - Actualizar usuarios
5. ✅ DELETE /api/v1/products/{id} - Eliminar productos

### BAJA PRIORIDAD (Puede dejarse para después):
6. ⭕ DELETE /api/v1/users/{id} - Eliminar usuarios

---

## 📊 VERIFICACIÓN DE INTEGRACIÓN

Una vez implementados los endpoints, verificar desde el frontend React:

### Panel de Productos:
- [x] Listar productos existentes
- [ ] Crear nuevo producto
- [ ] Editar producto existente
- [ ] Eliminar producto
- [ ] Ver badge de stock crítico

### Panel de Usuarios:
- [x] Listar usuarios
- [ ] Crear nuevo usuario
- [ ] Editar usuario
- [ ] Eliminar usuario
- [ ] Ver tipos de usuario

### Panel de Pedidos:
- [x] Listar pedidos
- [ ] Cambiar estado de pedido
- [ ] Ver historial de cambios
- [ ] Ver badges de estado con colores

---

## 🔍 LOGS Y MONITOREO

Implementar logs para:
- Todas las operaciones CRUD (INFO)
- Errores de validación (WARN)
- Errores de servidor (ERROR)
- Cambios de estado de pedidos (INFO)
- Intentos de acceso no autorizado (WARN)

Ejemplo:
```
[INFO] 2025-11-26 10:30:00 - Usuario admin@huertohogar.cl creó producto VH-004
[WARN] 2025-11-26 10:31:00 - Intento de crear producto con código duplicado: VH-001
[ERROR] 2025-11-26 10:32:00 - Error al conectar con S3: AccessDenied
[INFO] 2025-11-26 10:33:00 - Pedido ORD-2025-001 cambió de PENDIENTE a CONFIRMADO
```

---

## ✅ CHECKLIST FINAL

Antes de dar por completada la implementación, verificar:

- [ ] Todos los endpoints CRUD están implementados
- [ ] Validaciones de datos funcionando correctamente
- [ ] JWT y roles verificándose en cada endpoint
- [ ] Mensajes de error estándar y descriptivos
- [ ] CORS configurado correctamente
- [ ] Unit tests pasando (>80% cobertura)
- [ ] Integration tests pasando
- [ ] Documentación Swagger/OpenAPI actualizada
- [ ] Logs implementados
- [ ] Probado desde frontend React
- [ ] Desplegado en EC2 (http://52.2.172.54:8080)

---

## 📞 CONTACTO Y SOPORTE

Si tienes dudas sobre algún endpoint o necesitas aclarar algo:
- Frontend desplegado en: `http://app-react-huerto-s3.s3-website-us-east-1.amazonaws.com`
- Backend debe estar en: `http://52.2.172.54:8080`
- Base URL API: `http://52.2.172.54:8080/api`

**Nota:** El frontend ya está completamente implementado y desplegado. Solo falta que el backend implemente los endpoints descritos aquí para que todo funcione end-to-end.

---

**Fecha de creación:** 26 de noviembre de 2025  
**Versión:** 1.0  
**Autor:** Agente Frontend - HuertoHogar
