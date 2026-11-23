package com.bizcochos.huila_bizcochos.repository;

import com.bizcochos.huila_bizcochos.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio de categorías de productos.
 */
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
}