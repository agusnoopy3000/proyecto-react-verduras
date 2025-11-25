package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "correo_electronico", unique = true, nullable = false, length = 100)
    private String correoElectronico;

    @Column(nullable = false)
    private String contrasena;

    @Column(length = 50)
    private String nombres;

    @Column(length = 100)
    private String apellidos;

    @Column(length = 300)
    private String direccion;

    @Column(length = 20)
    private String telefono;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol;
}