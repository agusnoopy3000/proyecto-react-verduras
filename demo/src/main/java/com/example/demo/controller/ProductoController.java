package com.example.demo.controller;

import com.example.demo.model.Categoria;
import com.example.demo.model.Producto;
import com.example.demo.repository.CategoriaRepositorio;
import com.example.demo.repository.ProductoRepositorio;
import com.example.demo.service.S3Service;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Productos", description = "Operaciones sobre productos de la tienda")
public class ProductoController {

    private final ProductoRepositorio productoRepositorio;
    private final CategoriaRepositorio categoriaRepositorio;
    private final S3Service s3Service;

    @Operation(summary = "Listar todos los productos")
    @GetMapping
    public List<Producto> listarTodos() {
        return productoRepositorio.findAll();
    }

    @Operation(summary = "Obtener el detalle de un producto por su id")
    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerPorId(@PathVariable Long id) {
        return productoRepositorio.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Listar productos por código de categoría")
    @GetMapping("/categoria/{codigo}")
    public ResponseEntity<List<Producto>> listarPorCategoria(@PathVariable String codigo) {
        Categoria categoria = categoriaRepositorio.findByCodigo(codigo).orElse(null);
        if (categoria == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(productoRepositorio.findByCategoria(categoria));
    }

    @Operation(summary = "Listar productos en oferta")
    @GetMapping("/ofertas")
    public List<Producto> listarOfertas() {
        return productoRepositorio.findByEnOfertaTrue();
    }

    @Operation(summary = "Crear un nuevo producto (ADMIN o VENDEDOR)")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VENDEDOR')")
    @PostMapping
    public Producto crearProducto(@RequestBody Producto producto) {
        return productoRepositorio.save(producto);
    }

    @Operation(summary = "Actualizar un producto existente (ADMIN o VENDEDOR)")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VENDEDOR')")
    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizarProducto(@PathVariable Long id,
                                                       @RequestBody Producto datos) {
        return productoRepositorio.findById(id)
                .map(p -> {
                    p.setNombre(datos.getNombre());
                    p.setDescripcion(datos.getDescripcion());
                    p.setPrecio(datos.getPrecio());
                    p.setStock(datos.getStock());
                    p.setStockCritico(datos.getStockCritico());
                    p.setEnOferta(datos.getEnOferta());
                    p.setCategoria(datos.getCategoria());
                    return ResponseEntity.ok(productoRepositorio.save(p));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Eliminar un producto (ADMIN o VENDEDOR)")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VENDEDOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        if (!productoRepositorio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productoRepositorio.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Subir una imagen de producto a S3 (ADMIN o VENDEDOR)")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VENDEDOR')")
    @PostMapping("/{id}/imagen")
    public ResponseEntity<Producto> subirImagen(@PathVariable Long id,
                                                @RequestParam("archivo") MultipartFile archivo) throws Exception {
        Producto p = productoRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        String url = s3Service.subirArchivo(archivo);
        p.setUrlImagen(url);
        productoRepositorio.save(p);

        return ResponseEntity.ok(p);
    }
}