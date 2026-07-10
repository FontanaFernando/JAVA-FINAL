package com.techlab.dto;

public class LineaPedidoDTO {
    private Integer productoId;
    private int cantidad;

    public LineaPedidoDTO() {}

    public Integer getProductoId() { return productoId; }
    public void setProductoId(Integer productoId) { this.productoId = productoId; }

    public int getCantidad() { return cantidad; }
    public void setCantidad(int cantidad) { this.cantidad = cantidad; }
}