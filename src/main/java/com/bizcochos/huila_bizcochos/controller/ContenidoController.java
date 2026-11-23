package com.bizcochos.huila_bizcochos.controller;

import com.bizcochos.huila_bizcochos.model.Contenido;
import com.bizcochos.huila_bizcochos.model.TipoContenido;
import com.bizcochos.huila_bizcochos.repository.ContenidoRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para la gestión de contenidos (CRUD).
 */
@RestController
@RequestMapping("/api/contenidos")
@Tag(name = "Contenido", description = "Textos sobre cultura del Huila y proceso de fabricación")
public class ContenidoController {

    private final ContenidoRepository repo;

    /**
     * Crea el controlador con su repositorio.
     *
     * @param repo repositorio de contenidos
     */
    public ContenidoController(ContenidoRepository repo) {
        this.repo = repo;
    }

    /**
     * Lista los contenidos, con filtro opcional por tipo.
     *
     * @param tipo CULTURA o PROCESO (opcional)
     * @return lista de contenidos
     */
    @GetMapping
    @Operation(summary = "Listar contenidos (filtro opcional por tipo)")
    public List<Contenido> listar(@RequestParam(required = false) TipoContenido tipo) {
        return (tipo == null) ? repo.findAll() : repo.findByTipo(tipo);
    }

    /**
     * Busca un contenido por su identificador.
     *
     * @param id identificador
     * @return un contenido, o 404 si no existe
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener un contenido por id")
    public ResponseEntity<Contenido> obtener(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Crea un nuevo contenido.
     *
     * @param x datos a crear
     * @return el registro creado con código 201
     */
    @PostMapping
    @Operation(summary = "Crear un contenido")
    public ResponseEntity<Contenido> crear(@Valid @RequestBody Contenido x) {
        x.setId(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(x));
    }

    /**
     * Actualiza un contenido existente.
     *
     * @param id identificador
     * @param x  nuevos datos
     * @return el registro actualizado, o 404 si no existe
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un contenido")
    public ResponseEntity<Contenido> actualizar(@PathVariable Long id, @Valid @RequestBody Contenido x) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        x.setId(id);
        return ResponseEntity.ok(repo.save(x));
    }

    /**
     * Elimina un contenido.
     *
     * @param id identificador
     * @return 204 si se eliminó, 404 si no existe
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un contenido")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
