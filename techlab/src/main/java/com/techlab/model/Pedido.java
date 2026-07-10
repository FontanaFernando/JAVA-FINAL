package com.techlab.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<LineaPedido> lineas = new ArrayList<>();

    private double total;
    private String estado = "PENDIENTE";

    public Pedido() {
    }

    public Integer getId() { return id; }
    public List<LineaPedido> getLines() { return lineas; }
    public double getTotal() { return total; }
    public String getEstado() { return estado; }

    public void setEstado(String estado) { this.estado = estado; }
    public void setTotal(double total) { this.total = total; }

    public void agregarLinea(LineaPedido linea) {
        lineas.add(linea);
        linea.setPedido(this);
        this.total += linea.getSubtotal();
    }
}