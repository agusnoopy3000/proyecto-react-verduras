package com.example.demo.controller;

import com.example.demo.dto.SolicitudPedido;
import com.example.demo.model.*;
import com.example.demo.repository.PedidoRepositorio;
import com.example.demo.repository.ProductoRepositorio;
import com.example.demo.repository.UsuarioRepositorio;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Pedidos", description = "Gestión de pedidos de clientes")
public class PedidoController {

    private final PedidoRepositorio pedidoRepositorio;
    private final UsuarioRepositorio usuarioRepositorio;
    private final ProductoRepositorio productoRepositorio;

    @Operation(summary = "Crear un nuevo pedido (CLIENTE)")
    @PreAuthorize("hasRole('CLIENTE')")
    @PostMapping
    public ResponseEntity<?> crearPedido(@RequestBody SolicitudPedido solicitud,
                                         Authentication auth) {

        Usuario cliente = usuarioRepositorio.findByCorreoElectronico(auth.getName())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        List<DetallePedido> items = solicitud.getItems().stream().map(i -> {
            Producto producto = productoRepositorio.findById(i.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
            return DetallePedido.builder()
                    .producto(producto)
                    .cantidad(i.getCantidad())
                    .precioUnitario(producto.getPrecio())
                    .build();
        }).collect(Collectors.toList());

        double total = items.stream()
                .mapToDouble(x -> x.getCantidad() * x.getPrecioUnitario())
                .sum();

        Pedido pedido = Pedido.builder()
                .cliente(cliente)
                .fechaCreacion(LocalDateTime.now())
                .direccionEntrega(solicitud.getDireccionEntrega())
                .estado(EstadoPedido.CREADO)
                .total(total)
                .build();

        items.forEach(i -> i.setPedido(pedido));
        pedido.setItems(items);

        pedidoRepositorio.save(pedido);

        return ResponseEntity.ok(pedido);
    }

    @Operation(summary = "Listar pedidos del cliente autenticado (CLIENTE)")
    @PreAuthorize("hasRole('CLIENTE')")
    @GetMapping("/mios")
    public List<Pedido> misPedidos(Authentication auth) {
        Usuario cliente = usuarioRepositorio.findByCorreoElectronico(auth.getName())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        return pedidoRepositorio.findByCliente(cliente);
    }

    @Operation(summary = "Listar todos los pedidos (ADMIN o VENDEDOR)")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VENDEDOR')")
    @GetMapping
    public List<Pedido> listarTodos() {
        return pedidoRepositorio.findAll();
    }

    @Operation(summary = "Actualizar el estado de un pedido (ADMIN o VENDEDOR)")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VENDEDOR')")
    @PutMapping("/{id}/estado")
    public ResponseEntity<Pedido> actualizarEstado(@PathVariable Long id,
                                                   @RequestParam("estado") EstadoPedido estado) {
        return pedidoRepositorio.findById(id)
                .map(p -> {
                    p.setEstado(estado);
                    return ResponseEntity.ok(pedidoRepositorio.save(p));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}