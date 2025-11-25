package com.example.demo.dto;

import lombok.Data;

import java.util.List;

@Data
public class SolicitudPedido {

    private String direccionEntrega;

    private List<ItemPedido> items;

    @Data
    public static class ItemPedido {
        private Long productoId;
        private Integer cantidad;
    }
}