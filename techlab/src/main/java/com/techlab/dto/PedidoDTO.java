package com.techlab.dto;

import java.util.List;

public class PedidoDTO {
    private List<LineaPedidoDTO> lineas;

    public PedidoDTO() {}

    public List<LineaPedidoDTO> getLines() { return lineas; }
    public void setLines(List<LineaPedidoDTO> lineas) { this.lineas = lineas; }
}