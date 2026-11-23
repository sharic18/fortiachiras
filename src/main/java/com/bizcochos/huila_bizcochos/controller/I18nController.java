package com.bizcochos.huila_bizcochos.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.support.EncodedResource;
import org.springframework.core.io.support.PropertiesLoaderUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.Map;
import java.util.Properties;
import java.util.TreeMap;

/**
 * Controlador REST que entrega los textos de la interfaz en el idioma activo.
 * El idioma se cambia con el parámetro {@code ?lang=es|en|fr} (ver {@code I18nConfig}).
 */
@RestController
@RequestMapping("/api/i18n")
@Tag(name = "Internacionalización", description = "Textos de la interfaz en español, inglés y francés")
public class I18nController {

    private final MessageSource messageSource;

    /**
     * Crea el controlador con el origen de mensajes de Spring.
     *
     * @param messageSource origen de mensajes (archivos messages_xx.properties)
     */
    public I18nController(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    /**
     * Devuelve todos los mensajes de la interfaz en el idioma activo.
     *
     * @return mapa clave → texto traducido
     * @throws IOException si no se puede leer el archivo de mensajes base
     */
    @GetMapping("/mensajes")
    @Operation(summary = "Mensajes de la interfaz en el idioma activo (parámetro lang)")
    public Map<String, String> mensajes() throws IOException {
        Locale locale = LocaleContextHolder.getLocale();
        Properties base = PropertiesLoaderUtils.loadProperties(
                new EncodedResource(new ClassPathResource("messages.properties"), StandardCharsets.UTF_8));
        Map<String, String> salida = new TreeMap<>();
        for (String clave : base.stringPropertyNames()) {
            salida.put(clave, messageSource.getMessage(clave, null, clave, locale));
        }
        return salida;
    }
}
