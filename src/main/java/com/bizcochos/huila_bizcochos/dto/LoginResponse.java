package com.bizcochos.huila_bizcochos.dto;

/**
 * Respuesta del inicio de sesión.
 *
 * @param token  token JWT
 * @param tipo   tipo de token (Bearer)
 * @param nombre nombre del usuario
 * @param correo correo del usuario
 * @param rol    rol del usuario
 */
public record LoginResponse(String token, String tipo, String nombre, String correo, String rol) {
}