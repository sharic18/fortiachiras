package com.bizcochos.huila_bizcochos.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Entidad que representa un texto de cultura o de proceso de fabricación.
 */
@Entity
@Table(name = "contenido")
public class Contenido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoContenido tipo;

    @NotBlank
    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(name = "titulo_en", length = 150)
    private String tituloEn;

    @Column(name = "titulo_fr", length = 150)
    private String tituloFr;

    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String texto;

    @Column(name = "texto_en", columnDefinition = "TEXT")
    private String textoEn;

    @Column(name = "texto_fr", columnDefinition = "TEXT")
    private String textoFr;

    @Column(name = "imagen_url", length = 255)
    private String imagenUrl;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public TipoContenido getTipo() { return tipo; }
    public void setTipo(TipoContenido tipo) { this.tipo = tipo; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getTituloEn() { return tituloEn; }
    public void setTituloEn(String tituloEn) { this.tituloEn = tituloEn; }
    public String getTituloFr() { return tituloFr; }
    public void setTituloFr(String tituloFr) { this.tituloFr = tituloFr; }
    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }
    public String getTextoEn() { return textoEn; }
    public void setTextoEn(String textoEn) { this.textoEn = textoEn; }
    public String getTextoFr() { return textoFr; }
    public void setTextoFr(String textoFr) { this.textoFr = textoFr; }
    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }
}
