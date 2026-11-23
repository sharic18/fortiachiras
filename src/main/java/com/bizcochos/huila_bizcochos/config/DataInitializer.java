package com.bizcochos.huila_bizcochos.config;

import com.bizcochos.huila_bizcochos.model.Rol;
import com.bizcochos.huila_bizcochos.model.Usuario;
import com.bizcochos.huila_bizcochos.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Crea el usuario administrador inicial si no existe.
 */
@Configuration
public class DataInitializer {

    /**
     * Inserta el administrador inicial al arrancar la aplicación.
     *
     * @param repo    repositorio de usuarios
     * @param encoder codificador de contraseñas
     * @return tarea que se ejecuta al iniciar
     */
    @Bean
    public CommandLineRunner crearAdmin(UsuarioRepository repo, PasswordEncoder encoder) {
        return args -> {
            if (repo.findByCorreo("admin@bizcochos.com").isEmpty()) {
                Usuario u = new Usuario();
                u.setNombre("Administrador");
                u.setCorreo("admin@bizcochos.com");
                u.setPassword(encoder.encode("Admin2026*"));
                u.setRol(Rol.ADMIN);
                repo.save(u);
            }
        };
    }
}