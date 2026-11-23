package com.bizcochos.huila_bizcochos.repository;

import com.bizcochos.huila_bizcochos.model.Contenido;
import com.bizcochos.huila_bizcochos.model.TipoContenido;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * Repositorio de contenidos de cultura y proceso de fabricación.
 */
public interface ContenidoRepository extends JpaRepository<Contenido, Long> {
    /**
     * Lista los contenidos de un tipo.
     *
     * @param tipo CULTURA o PROCESO
     * @return contenidos del tipo indicado
     */
    List<Contenido> findByTipo(TipoContenido tipo);
}