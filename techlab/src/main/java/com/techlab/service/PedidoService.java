package com.techlab.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.techlab.dto.LineaPedidoDTO;
import com.techlab.dto.PedidoDTO;
import com.techlab.exception.StockInsuficienteException;
import com.techlab.model.LineaPedido;
import com.techlab.model.Pedido;
import com.techlab.model.Producto;
import com.techlab.repository.PedidoRepository;
import com.techlab.repository.ProductoRepository;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ProductoRepository productoRepository;

    public PedidoService(PedidoRepository pedidoRepository, ProductoRepository productoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.productoRepository = productoRepository;
    }

    @Transactional
    public Pedido crearPedido(PedidoDTO pedidoDTO) {
        Pedido nuevoPedido = new Pedido();
        
        for (LineaPedidoDTO itemDTO : pedidoDTO.getLines()) {
            Producto producto = productoRepository.findById(itemDTO.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto ID " + itemDTO.getProductoId() + " no existe."));

            if (itemDTO.getCantidad() > producto.getStock()) {
                throw new StockInsuficienteException("Stock insuficiente para: " + producto.getNombre() + 
                        ". Disponible: " + producto.getStock() + ", Solicitado: " + itemDTO.getCantidad());
            }

            producto.reducirStock(itemDTO.getCantidad());
            productoRepository.save(producto);

            LineaPedido linea = new LineaPedido(producto, itemDTO.getCantidad());
            nuevoPedido.agregarLinea(linea);
        }

        return pedidoRepository.save(nuevoPedido);
    }

    public List<Pedido> listarHistorial() {
        return pedidoRepository.findAll();
    }
}