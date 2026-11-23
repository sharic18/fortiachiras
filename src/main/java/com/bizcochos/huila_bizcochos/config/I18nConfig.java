package com.bizcochos.huila_bizcochos.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;
import org.springframework.web.servlet.i18n.SessionLocaleResolver;

import java.util.Locale;

/**
 * Configuración nativa de internacionalización (i18n) de Spring.
 * <ul>
 *   <li><b>Locale</b>: el idioma activo (es, en o fr).</li>
 *   <li><b>Interceptor</b>: cambia el idioma cuando la petición trae el parámetro {@code ?lang=}.</li>
 *   <li><b>Properties</b>: los mensajes de cada idioma están en {@code messages_xx.properties}.</li>
 * </ul>
 */
@Configuration
public class I18nConfig implements WebMvcConfigurer {

    /**
     * Guarda el idioma elegido por el visitante. El idioma por defecto es español.
     *
     * @return el resolvedor de idioma
     */
    @Bean
    public LocaleResolver localeResolver() {
        SessionLocaleResolver resolver = new SessionLocaleResolver();
        resolver.setDefaultLocale(Locale.forLanguageTag("es"));
        return resolver;
    }

    /**
     * Interceptor que lee el parámetro {@code lang} y cambia el idioma de la petición.
     *
     * @return el interceptor de cambio de idioma
     */
    @Bean
    public LocaleChangeInterceptor localeChangeInterceptor() {
        LocaleChangeInterceptor interceptor = new LocaleChangeInterceptor();
        interceptor.setParamName("lang");
        return interceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(localeChangeInterceptor());
    }
}
