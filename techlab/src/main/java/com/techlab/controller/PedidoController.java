package com.techlab.controller;

import com.techlab.dto.PedidoDTO;
import com.techlab.model.Pedido;
import com.techlab.service.PedidoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping("/pedidos")
    public ResponseEntity<Pedido> realizarPedido(@RequestBody PedidoDTO pedidoDTO) {
        Pedido nuevoPedido = pedidoService.crearPedido(pedidoDTO);
        return new ResponseEntity<>(nuevoPedido, HttpStatus.CREATED);
    }

    @GetMapping("/usuarios/{id}/pedidos")
    public ResponseEntity<List<Pedido>> obtenerHistorialPedidos(@PathVariable Integer id) {
        return ResponseEntity.ok(pedidoService.listarHistorial());
    }
}