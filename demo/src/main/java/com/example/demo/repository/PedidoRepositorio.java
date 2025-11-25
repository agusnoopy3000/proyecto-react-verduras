package com.example.demo.repository;

import com.example.demo.model.Pedido;
import com.example.demo.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PedidoRepositorio extends JpaRepository<Pedido, Long> {

    List<Pedido> findByCliente(Usuario cliente);
}