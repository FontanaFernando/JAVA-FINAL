# 📂 TechLab - Sistema de Gestión de Intendencia Táctica y Electrónica (API REST)

Este proyecto es una **API RESTful** completa desarrollada en **Java con Spring Boot** y **MySQL** como base de datos relacional. Está diseñado para gestionar el catálogo de productos y el procesamiento de pedidos de un e-commerce especializado en insumos electrónicos y equipamiento táctico.

El sistema representa la evolución de una aplicación de consola hacia una arquitectura profesional en capas lista para integrarse con aplicaciones Frontend.

## 🚀 Requerimientos Técnicos Implementados

* **Arquitectura en Capas:** Organización limpia del código dividida en Controladores (REST), Servicios (Lógica de Negocio), Repositorios (Persistencia), DTOs (Transferencia de Datos) y Modelos.
* **Persistencia con Spring Data JPA:** Configuración y mapeo de entidades directamente hacia tablas de MySQL, automatizando la creación del esquema.
* **POO Avanzada y Polimorfismo:** Implementación de una clase abstracta base (`Producto`) y subclases específicas (`InsumoElectronico` y `Equipamiento`) utilizando la estrategia de herencia de tabla única (`SINGLE_TABLE`).
* **Relaciones Relacionales:** Mapeo de relaciones `@OneToMany` y `@ManyToOne` entre las entidades `Pedido`, `LineaPedido` y `Producto`.
* **Manejo Global de Excepciones HTTP:** Lanzamiento de excepciones personalizadas como `StockInsuficienteException`, devolviendo códigos nativos de la web como `400 Bad Request`.
* **Transaccionalidad:** Uso de la anotación `@Transactional` para garantizar la atomicidad en la creación de pedidos (si un producto falla por stock, nada se guarda a medias).

## 🛠️ Tecnologías Utilizadas

* **Java 21 / 24** (Java SE Runtime)
* **Spring Boot 3.x** (Spring Web, Spring Data JPA)
* **MySQL Server 8.x** (Base de datos)
* **Maven** (Gestor de dependencias)
* **Postman** (Pruebas de endpoints)

## 🔗 Endpoints de la API REST

### 📦 Gestión de Productos
* `GET /api/productos` - Lista el catálogo completo disponible.
* `GET /api/productos/{id}` - Obtiene los detalles de un producto específico.
* `POST /api/productos` - Agrega un nuevo producto al inventario.
* `PUT /api/productos/{id}` - Actualiza el precio o el stock de un producto.
* `DELETE /api/productos/{id}` - Elimina un producto por su ID.

### 🛒 Gestión de Pedidos
* `POST /api/pedidos` - Procesa un nuevo pedido desde el carrito, valida y descuenta el stock de manera automática.
* `GET /api/usuarios/{id}/pedidos` - Recupera el historial completo de pedidos del sistema.

## ⚙️ Configuración y Ejecución

1.  Asegúrate de tener el servicio de **MySQL iniciado** en tu sistema.
2.  Crea la base de datos vacía ejecutando en tu terminal o Workbench:
    ```sql
    CREATE DATABASE techlab_db;
    ```
3.  Configura tus credenciales locales en el archivo `src/main/resources/application.properties`.
4.  Ejecuta la aplicación desde la terminal de tu IDE con el comando:
    ```bash
    mvn spring-boot:run
    ```
5.  La API estará disponible en: `http://localhost:8080`