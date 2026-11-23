package com.bizcochos.huila_bizcochos.controller;

import com.bizcochos.huila_bizcochos.model.PuntoVenta;
import com.bizcochos.huila_bizcochos.repository.PuntoVentaRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para la gestión de puntos de venta (CRUD).
 */
@RestController
@RequestMapping("/api/puntos-venta")
@Tag(name = "Puntos de venta", description = "Lugares donde se comercializan los productos")
public class PuntoVentaController {

    private final PuntoVentaRepository repo;

    /**
     * Crea el controlador con su repositorio.
     *
     * @param repo repositorio de puntos de venta
     */
    public PuntoVentaController(PuntoVentaRepository repo) {
        this.repo = repo;
    }

    /**
     * Lista todos los puntos de venta.
     *
     * @return lista de puntos de venta
     */
    @GetMapping
    @Operation(summary = "Listar puntos de venta")
    public List<PuntoVenta> listar() {
        return repo.findAll();
    }

    /**
     * Busca un punto de venta por su identificador.
     *
     * @param id identificador
     * @return un punto de venta, o 404 si no existe
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener un punto de venta por id")
    public ResponseEntity<PuntoVenta> obtener(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Crea un nuevo punto de venta.
     *
     * @param x datos a crear
     * @return el registro creado con código 201
     */
    @PostMapping
    @Operation(summary = "Crear un punto de venta")
    public ResponseEntity<PuntoVenta> crear(@Valid @RequestBody PuntoVenta x) {
        x.setId(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(x));
    }

    /**
     * Actualiza un punto de venta existente.
     *
     * @param id identificador
     * @param x  nuevos datos
     * @return el registro actualizado, o 404 si no existe
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un punto de venta")
    public ResponseEntity<PuntoVenta> actualizar(@PathVariable Long id, @Valid @RequestBody PuntoVenta x) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        x.setId(id);
        return ResponseEntity.ok(repo.save(x));
    }

    /**
     * Elimina un punto de venta.
     *
     * @param id identificador
     * @return 204 si se eliminó, 404 si no existe
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un punto de venta")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
