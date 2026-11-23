package com.bizcochos.huila_bizcochos.controller;

import com.bizcochos.huila_bizcochos.dto.LoginRequest;
import com.bizcochos.huila_bizcochos.dto.LoginResponse;
import com.bizcochos.huila_bizcochos.model.Usuario;
import com.bizcochos.huila_bizcochos.repository.UsuarioRepository;
import com.bizcochos.huila_bizcochos.security.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

/**
 * Controlador REST para el inicio de sesión y la emisión de tokens JWT.
 */
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticación", description = "Inicio de sesión y emisión de token JWT")
public class AuthController {

    private final UsuarioRepository repo;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    private final MessageSource messages;

    /**
     * Crea el controlador con sus dependencias.
     *
     * @param repo     repositorio de usuarios
     * @param encoder  codificador de contraseñas
     * @param jwt      servicio de tokens
     * @param messages origen de mensajes internacionalizados
     */
    public AuthController(UsuarioRepository repo, PasswordEncoder encoder, JwtService jwt, MessageSource messages) {
        this.repo = repo;
        this.encoder = encoder;
        this.jwt = jwt;
        this.messages = messages;
    }

    /**
     * Valida las credenciales y entrega un token JWT.
     *
     * @param req correo y contraseña
     * @return el token con los datos del usuario, o 401 si las credenciales son incorrectas
     *         (el mensaje se entrega en el idioma activo)
     */
    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión y obtener el token JWT")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        Optional<Usuario> u = repo.findByCorreo(req.correo());
        if (u.isEmpty() || !encoder.matches(req.password(), u.get().getPassword())) {
            String texto = messages.getMessage("auth_error", null, LocaleContextHolder.getLocale());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("mensaje", texto));
        }
        Usuario usuario = u.get();
        return ResponseEntity.ok(new LoginResponse(
                jwt.generarToken(usuario), "Bearer",
                usuario.getNombre(), usuario.getCorreo(), usuario.getRol().name()));
    }
}
