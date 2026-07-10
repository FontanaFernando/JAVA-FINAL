const API_URL = "http://localhost:8080/api";
let carrito = [];

/**
 * Consume GET /api/productos para listar el inventario en tiempo real
 */
function cargarProductos() {
    fetch(`${API_URL}/productos`)
        .then(res => res.json())
        .then(productos => {
            const container = document.getElementById("productos-container");
            container.innerHTML = "";
            productos.forEach(p => {
                const esElect = p.protocoloComunicacion ? true : false;
                container.innerHTML += `
                    <div class="card">
                        <div>
                            <span class="badge ${esElect ? 'badge-elec' : 'badge-equip'}">${esElect ? 'Electrónica' : 'Equipamiento'}</span>
                            <h3>${p.nombre}</h3>
                            <p style="font-size:0.8rem; color:var(--text-muted); margin:0 0 10px 0;">
                                ${esElect ? 'Protocolo: ' + p.protocoloComunicacion : 'Material: ' + p.material}
                            </p>
                        </div>
                        <div>
                            <div class="price">$${p.precio.toFixed(2)}</div>
                            <div class="stock">Disponibles: ${p.stock} u.</div>
                            <button style="width: 100%;" onclick="agregarAlCarrito(${p.id}, '${p.nombre}', ${p.precio}, ${p.stock})">Agregar al Pedido</button>
                        </div>
                    </div>
                `;
            });
        })
        .catch(err => console.error("Error al conectar con la API de productos:", err));
        
    cargarHistorial();
}

/**
 * Controla de forma dinámica las etiquetas de los inputs según la herencia de POO
 */
function alternarCamposEspecificos() {
    const tipo = document.getElementById("prod-tipo").value;
    const label = document.getElementById("label-especifico");
    label.innerText = tipo === "ELECTRONICA" ? "Protocolo de Comunicación (ej: WiFi/LoRa)" : "Material de Fabricación (ej: Metal/TPU)";
}

/**
 * Añade un elemento al estado del carrito local antes de procesarlo
 */
function agregarAlCarrito(id, nombre, precio, maxStock) {
    const itemExistente = carrito.find(item => item.productoId === id);
    if (itemExistente) {
        if (itemExistente.cantidad >= maxStock) {
            alert("Operación cancelada: No puedes solicitar más unidades que el stock disponible en bodega.");
            return;
        }
        itemExistente.cantidad++;
    } else {
        carrito.push({ productoId: id, nombre: nombre, precio: precio, cantidad: 1 });
    }
    renderizarCarrito();
}

/**
 * Renderiza los elementos del carrito en el panel lateral
 */
function renderizarCarrito() {
    const container = document.getElementById("carrito-items");
    const totalVal = document.getElementById("cart-total-val");
    
    if (carrito.length === 0) {
        container.innerHTML = `<p class="text-center muted">El carrito está vacío.</p>`;
        totalVal.innerText = "0.00";
        return;
    }
    
    container.innerHTML = "";
    let total = 0;
    carrito.forEach((item, index) => {
        total += item.precio * item.cantidad;
        container.innerHTML += `
            <div class="cart-item">
                <div>
                    <div><strong>${item.nombre}</strong></div>
                    <div style="font-size:0.85rem; color:var(--text-muted);">${item.cantidad}x $${item.precio.toFixed(2)}</div>
                </div>
                <button class="btn-danger" onclick="eliminarDelCarrito(${index})">X</button>
            </div>
        `;
    });
    totalVal.innerText = total.toFixed(2);
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    renderizarCarrito();
}

/**
 * Envía el JSON con el DTO estructurado mediante POST /api/pedidos
 * Maneja de forma global el error 400 provisto por StockInsuficienteException
 */
function realizarPedido() {
    if (carrito.length === 0) {
        alert("El carrito se encuentra vacío.");
        return;
    }

    const pedidoDTO = {
        lines: carrito.map(item => ({ productoId: item.productoId, cantidad: item.cantidad }))
    };

    fetch(`${API_URL}/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedidoDTO)
    })
    .then(async response => {
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error del servidor al procesar la transacción.");
        }
        return response.json();
    })
    .then(pedidoCreado => {
        alert(`¡ÉXITO OPERACIONAL! Pedido #${pedidoCreado.id} registrado por un total de $${pedidoCreado.total}`);
        carrito = [];
        renderizarCarrito();
        cargarProductos(); // Refresca stocks en pantalla inmediatamente
    })
    .catch(err => {
        alert(`RECHAZADO POR SISTEMA: ${err.message}`);
    });
}

/**
 * Registra un nuevo producto polimórfico mediante POST /api/productos
 */
function crearProducto() {
    const nombre = document.getElementById("prod-nombre").value;
    const tipo = document.getElementById("prod-tipo").value;
    const precio = parseFloat(document.getElementById("prod-precio").value);
    const stock = parseInt(document.getElementById("prod-stock").value);
    const valorEspecifico = document.getElementById("prod-especifico").value;

    if (!nombre || isNaN(precio) || isNaN(stock)) {
        alert("Por favor, complete todos los campos mandatorios.");
        return;
    }

    const nuevoProducto = { nombre, precio, stock };

    if (tipo === "ELECTRONICA") {
        nuevoProducto.protocoloComunicacion = valorEspecifico;
    } else {
        nuevoProducto.material = valorEspecifico;
    }

    fetch(`${API_URL}/productos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoProducto)
    })
    .then(res => {
        if (res.ok) {
            alert("Registro exitoso: Producto persistido en MySQL.");
            document.getElementById("producto-form").reset();
            alternarCamposEspecificos();
            cargarProductos();
        } else {
            alert("Error al intentar guardar el producto.");
        }
    })
    .catch(err => console.error("Error en la inserción de producto:", err));
}

/**
 * Consulta el historial de compras general solicitado en las consignas
 */
function cargarHistorial() {
    fetch(`${API_URL}/usuarios/1/pedidos`)
        .then(res => res.json())
        .then(pedidos => {
            const container = document.getElementById("historial-pedidos");
            if (pedidos.length === 0) {
                container.innerHTML = "<p class='muted'>No hay registros en el historial operacional.</p>";
                return;
            }
            container.innerHTML = "";
            pedidos.reverse().forEach(p => {
                container.innerHTML += `
                    <div style="border-left: 3px solid var(--neon-green); padding-left: 8px; margin-bottom: 10px;">
                        <strong>Pedido #${p.id}</strong> - <span style="color:var(--neon-green)">$${p.total}</span><br>
                        <span style="font-size:0.75rem; color:var(--text-muted)">Estado de Despacho: ${p.estado}</span>
                    </div>
                `;
            });
        })
        .catch(err => console.error("Error al traer historial de pedidos:", err));
}

// Inicialización de la aplicación al cargar la vista del DOM
window.onload = cargarProductos;