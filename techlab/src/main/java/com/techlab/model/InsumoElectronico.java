package com.techlab.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("ELECTRONICA")
public class InsumoElectronico extends Producto {
    
    private String protocoloComunicacion;

    public InsumoElectronico() {
        super();
    }

    public InsumoElectronico(String nombre, double precio, int stock, String protocolo) {
        super(nombre, precio, stock);
        this.protocoloComunicacion = protocolo;
    }

    public InsumoElectronico(int id, String nombre, double precio, int stock, String protocolo) {
        super(id, nombre, precio, stock);
        this.protocoloComunicacion = protocolo;
    }

    public String getProtocoloComunicacion() { return protocoloComunicacion; }
    public void setProtocoloComunicacion(String protocolo) { this.protocoloComunicacion = protocolo; }

    @Override
    public void mostrarDetalle() {
        System.out.println("[ELECTRÓNICA] " + super.toString() + " | Protocolo: " + protocoloComunicacion);
    }
}