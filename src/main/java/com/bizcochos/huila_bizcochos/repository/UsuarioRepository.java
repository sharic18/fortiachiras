package com.bizcochos.huila_bizcochos.repository;

import com.bizcochos.huila_bizcochos.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * Repositorio de usuarios.
 */
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /**
     * Busca un usuario por su correo.
     *
     * @param correo correo del usuario
     * @return el usuario, si existe
     */
    Optional<Usuario> findByCorreo(String correo);
}