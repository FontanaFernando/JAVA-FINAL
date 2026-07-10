package com.techlab.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("EQUIPAMIENTO")
public class Equipamiento extends Producto {
    
    private String material;

    public Equipamiento() {
        super();
    }

    public Equipamiento(String nombre, double precio, int stock, String material) {
        super(nombre, precio, stock);
        this.material = material;
    }

    public Equipamiento(int id, String nombre, double precio, int stock, String material) {
        super(id, nombre, precio, stock);
        this.material = material;
    }

    public String getMaterial() { return material; }
    public void setMaterial(String material) { this.material = material; }

    @Override
    public void mostrarDetalle() {
        System.out.println("[EQUIPAMIENTO] " + super.toString() + " | Material: " + material);
    }
}