package com.bizcochos.huila_bizcochos.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Datos que se envían para iniciar sesión.
 *
 * @param correo   correo del usuario
 * @param password contraseña del usuario
 */
public record LoginRequest(@NotBlank String correo, @NotBlank String password) {
}