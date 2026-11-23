package com.bizcochos.huila_bizcochos.repository;

import com.bizcochos.huila_bizcochos.model.PuntoVenta;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio de puntos de venta.
 */
public interface PuntoVentaRepository extends JpaRepository<PuntoVenta, Long> {
}