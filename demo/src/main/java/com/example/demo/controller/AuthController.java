package com.example.demo.controller;

import com.example.demo.dto.SolicitudAutenticacion;
import com.example.demo.dto.RespuestaAutenticacion;
import com.example.demo.model.Rol;
import com.example.demo.model.Usuario;
import com.example.demo.repository.UsuarioRepositorio;
import com.example.demo.security.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Autenticación", description = "Registro e inicio de sesión de usuarios")
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final UsuarioRepositorio usuarioRepositorio;
    private final PasswordEncoder passwordEncoder;

    @Operation(summary = "Registrar un nuevo usuario (rol CLIENTE por defecto)")
    @PostMapping("/registrar")
    public ResponseEntity<?> registrar(@Valid @RequestBody SolicitudAutenticacion req) {
        if (usuarioRepositorio.existsByCorreoElectronico(req.getCorreoElectronico())) {
            return ResponseEntity.badRequest().body("El correo ya se encuentra registrado");
        }

        Usuario u = Usuario.builder()
                .correoElectronico(req.getCorreoElectronico())
                .contrasena(passwordEncoder.encode(req.getContrasena()))
                .nombres("Nombre")
                .apellidos("Apellidos")
                .rol(Rol.CLIENTE)
                .build();

        usuarioRepositorio.save(u);

        String token = jwtUtil.generarToken(u.getCorreoElectronico(), u.getRol().name());
        return ResponseEntity.ok(new RespuestaAutenticacion(token));
    }

    @Operation(summary = "Iniciar sesión y obtener un token JWT")
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody SolicitudAutenticacion req) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getCorreoElectronico(), req.getContrasena())
        );

        String rol = auth.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
        String token = jwtUtil.generarToken(req.getCorreoElectronico(), rol);

        return ResponseEntity.ok(new RespuestaAutenticacion(token));
    }
}