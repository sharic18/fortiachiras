package com.bizcochos.huila_bizcochos.controller;

import com.bizcochos.huila_bizcochos.model.Producto;
import com.bizcochos.huila_bizcochos.repository.ProductoRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Controlador REST para la gestión del catálogo de productos (CRUD).
 */
@RestController
@RequestMapping("/api/productos")
@Tag(name = "Productos", description = "Catálogo de bizcochos y productos de la fábrica")
public class ProductoController {

    private final ProductoRepository repo;

    /**
     * Crea el controlador con su repositorio.
     *
     * @param repo repositorio de productos
     */
    public ProductoController(ProductoRepository repo) {
        this.repo = repo;
    }

    /**
     * Lista los productos activos.
     *
     * @return lista de productos activos
     */
    @GetMapping
    @Operation(summary = "Listar productos activos")
    public List<Producto> listar() {
        return repo.findByActivoTrue();
    }

    /**
     * Busca un producto por su identificador.
     *
     * @param id identificador del producto
     * @return el producto, o 404 si no existe
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener un producto por id")
    public ResponseEntity<Producto> obtener(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Crea un nuevo producto.
     *
     * @param p datos del producto a crear
     * @return el producto creado con código 201
     */
    @PostMapping
    @Operation(summary = "Crear un producto")
    public ResponseEntity<Producto> crear(@Valid @RequestBody Producto p) {
        p.setId(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(p));
    }

    /**
     * Actualiza un producto existente.
     *
     * @param id identificador del producto
     * @param p  nuevos datos del producto
     * @return el producto actualizado, o 404 si no existe
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un producto")
    public ResponseEntity<Producto> actualizar(@PathVariable Long id, @Valid @RequestBody Producto p) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        p.setId(id);
        return ResponseEntity.ok(repo.save(p));
    }

    /**
     * Elimina un producto.
     *
     * @param id identificador del producto
     * @return 204 si se eliminó, o 404 si no existe
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un producto")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}