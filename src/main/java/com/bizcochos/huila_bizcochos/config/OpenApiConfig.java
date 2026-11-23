package com.bizcochos.huila_bizcochos.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración de la documentación Swagger (OpenAPI) de la plataforma.
 */
@Configuration
public class OpenApiConfig {

    /**
     * Define la información general de Swagger UI y el esquema de seguridad JWT.
     *
     * @return objeto OpenAPI con título, versión, descripción y autenticación Bearer
     */
    @Bean
    public OpenAPI apiInfo() {
        return new OpenAPI()
                .info(new Info()
                        .title("API Bizcochos del Huila")
                        .version("1.0")
                        .description("Servicios REST de la plataforma web para promocionar y gestionar "
                                + "bizcochos tradicionales del Huila: productos, categorías, "
                                + "puntos de venta y contenido cultural."))
                .components(new Components().addSecuritySchemes("bearerAuth",
                        new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
    }
}