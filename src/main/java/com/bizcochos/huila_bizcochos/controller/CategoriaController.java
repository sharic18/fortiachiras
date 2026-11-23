package com.bizcochos.huila_bizcochos.controller;

import com.bizcochos.huila_bizcochos.model.Categoria;
import com.bizcochos.huila_bizcochos.repository.CategoriaRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para la gestión de categorías (CRUD).
 */
@RestController
@RequestMapping("/api/categorias")
@Tag(name = "Categorías", description = "Clasificación de los productos")
public class CategoriaController {

    private final CategoriaRepository repo;

    /**
     * Crea el controlador con su repositorio.
     *
     * @param repo repositorio de categorías
     */
    public CategoriaController(CategoriaRepository repo) {
        this.repo = repo;
    }

    /**
     * Lista todas las categorías.
     *
     * @return lista de categorías
     */
    @GetMapping
    @Operation(summary = "Listar categorías")
    public List<Categoria> listar() {
        return repo.findAll();
    }

    /**
     * Busca una categoría por su identificador.
     *
     * @param id identificador
     * @return una categoría, o 404 si no existe
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener una categoría por id")
    public ResponseEntity<Categoria> obtener(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Crea una nueva categoría.
     *
     * @param x datos a crear
     * @return el registro creado con código 201
     */
    @PostMapping
    @Operation(summary = "Crear una categoría")
    public ResponseEntity<Categoria> crear(@Valid @RequestBody Categoria x) {
        x.setId(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(x));
    }

    /**
     * Actualiza una categoría existente.
     *
     * @param id identificador
     * @param x  nuevos datos
     * @return el registro actualizado, o 404 si no existe
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar una categoría")
    public ResponseEntity<Categoria> actualizar(@PathVariable Long id, @Valid @RequestBody Categoria x) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        x.setId(id);
        return ResponseEntity.ok(repo.save(x));
    }

    /**
     * Elimina una categoría.
     *
     * @param id identificador
     * @return 204 si se eliminó, 404 si no existe, o 409 si está en uso por otros registros
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar una categoría")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        try {
            repo.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        return ResponseEntity.noContent().build();
    }
}
