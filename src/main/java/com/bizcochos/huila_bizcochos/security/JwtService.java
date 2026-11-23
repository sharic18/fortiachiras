package com.bizcochos.huila_bizcochos.security;

import com.bizcochos.huila_bizcochos.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Servicio que genera y valida los tokens JWT de la plataforma.
 */
@Service
public class JwtService {

    private final SecretKey key;
    private final long expirationMs;

    /**
     * Crea el servicio con la clave y la duración configuradas.
     *
     * @param secret       clave de firma (mínimo 32 caracteres)
     * @param expirationMs duración del token en milisegundos
     */
    public JwtService(@Value("${app.jwt.secret}") String secret,
                      @Value("${app.jwt.expiration-ms}") long expirationMs) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    /**
     * Genera un token firmado para un usuario.
     *
     * @param u usuario autenticado
     * @return token JWT
     */
    public String generarToken(Usuario u) {
        Date ahora = new Date();
        return Jwts.builder()
                .subject(u.getCorreo())
                .claim("rol", u.getRol().name())
                .issuedAt(ahora)
                .expiration(new Date(ahora.getTime() + expirationMs))
                .signWith(key)
                .compact();
    }

    /**
     * Lee y valida un token.
     *
     * @param token token JWT
     * @return los datos (claims) del token
     * @throws JwtException si el token es inválido o expiró
     */
    public Claims leerToken(String token) throws JwtException {
        return Jwts.parser().verifyWith(key).build()
                .parseSignedClaims(token).getPayload();
    }

    /**
     * Indica si un token es válido y no ha expirado.
     *
     * @param token token JWT
     * @return true si es válido
     */
    public boolean esValido(String token) {
        try {
            leerToken(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}