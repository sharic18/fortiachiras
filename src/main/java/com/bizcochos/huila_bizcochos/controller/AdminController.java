package com.bizcochos.huila_bizcochos.controller;

import com.bizcochos.huila_bizcochos.model.Producto;
import com.bizcochos.huila_bizcochos.repository.ProductoRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controlador REST con consultas exclusivas del panel administrativo (rol ADMIN).
 */
@RestController
@RequestMapping("/api/admin")
@Tag(name = "Administración", description = "Consultas exclusivas del panel administrativo")
public class AdminController {

    private final ProductoRepository productos;

    /**
     * Crea el controlador con su repositorio.
     *
     * @param productos repositorio de productos
     */
    public AdminController(ProductoRepository productos) {
        this.productos = productos;
    }

    /**
     * Lista todos los productos, activos e inactivos.
     *
     * @return lista completa de productos
     */
    @GetMapping("/productos")
    @Operation(summary = "Listar todos los productos (activos e inactivos)")
    public List<Producto> listarProductos() {
        return productos.findAll();
    }
}
