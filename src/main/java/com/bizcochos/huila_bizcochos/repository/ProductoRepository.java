package com.bizcochos.huila_bizcochos.repository;

import com.bizcochos.huila_bizcochos.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * Repositorio de productos del catálogo.
 */
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    /**
     * Lista los productos visibles en el catálogo.
     *
     * @return productos activos
     */
    List<Producto> findByActivoTrue();
}