package com.bizcochos.huila_bizcochos.controller;

import com.bizcochos.huila_bizcochos.model.Producto;
import com.bizcochos.huila_bizcochos.repository.ProductoRepository;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

/**
 * Controlador REST que genera los reportes de la plataforma en PDF (rol ADMIN).
 */
@RestController
@RequestMapping("/api/reportes")
@Tag(name = "Reportes", description = "Reportes descargables en PDF")
public class ReporteController {

    private static final Color ROJO = new Color(215, 20, 26);
    private static final Color OSCURO = new Color(43, 27, 18);
    private static final Color CLARO = new Color(255, 241, 184);

    private final ProductoRepository productos;

    /**
     * Crea el controlador con su repositorio.
     *
     * @param productos repositorio de productos
     */
    public ReporteController(ProductoRepository productos) {
        this.productos = productos;
    }

    /**
     * Genera un reporte en PDF con el catálogo de productos agrupado por categoría,
     * junto con un resumen general.
     *
     * @return el archivo PDF para descargar
     * @throws Exception si ocurre un error al generar el documento
     */
    @GetMapping("/productos")
    @Operation(summary = "Reporte PDF del catálogo de productos por categoría")
    public ResponseEntity<byte[]> reporteProductos() throws Exception {
        List<Producto> lista = productos.findAll();
        Map<String, List<Producto>> porCategoria = lista.stream().collect(Collectors.groupingBy(
                p -> p.getCategoria() != null ? p.getCategoria().getNombre() : "Sin categoría",
                TreeMap::new, Collectors.toList()));

        NumberFormat dinero = NumberFormat.getCurrencyInstance(Locale.forLanguageTag("es-CO"));
        dinero.setMaximumFractionDigits(0);
        dinero.setMinimumFractionDigits(0);

        Font titulo = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, ROJO);
        Font subtitulo = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.DARK_GRAY);
        Font seccion = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 13, OSCURO);
        Font cabecera = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.WHITE);
        Font normal = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);
        Font negrita = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.BLACK);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document doc = new Document(PageSize.A4, 40, 40, 50, 50);
        PdfWriter.getInstance(doc, out);
        doc.open();

        doc.add(new Paragraph("Fortiachiras", titulo));
        doc.add(new Paragraph("Reporte de productos del catálogo", seccion));
        doc.add(new Paragraph("Generado el "
                + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")), subtitulo));
        doc.add(new Paragraph(" "));

        long visibles = lista.stream().filter(Producto::isActivo).count();
        double promedio = lista.stream().mapToDouble(p -> p.getPrecio().doubleValue()).average().orElse(0);

        PdfPTable resumen = new PdfPTable(new float[]{3f, 2f});
        resumen.setWidthPercentage(60);
        resumen.setHorizontalAlignment(Element.ALIGN_LEFT);
        agregarFilaResumen(resumen, "Total de productos", String.valueOf(lista.size()), negrita, normal);
        agregarFilaResumen(resumen, "Visibles en el catálogo", String.valueOf(visibles), negrita, normal);
        agregarFilaResumen(resumen, "Ocultos", String.valueOf(lista.size() - visibles), negrita, normal);
        agregarFilaResumen(resumen, "Categorías", String.valueOf(porCategoria.size()), negrita, normal);
        agregarFilaResumen(resumen, "Precio promedio", dinero.format(promedio), negrita, normal);
        doc.add(resumen);
        doc.add(new Paragraph(" "));

        for (Map.Entry<String, List<Producto>> e : porCategoria.entrySet()) {
            Paragraph p = new Paragraph(e.getKey() + "  (" + e.getValue().size() + " productos)", seccion);
            p.setSpacingBefore(6);
            p.setSpacingAfter(4);
            doc.add(p);

            PdfPTable t = new PdfPTable(new float[]{5f, 2f, 1.5f});
            t.setWidthPercentage(100);
            t.setHeaderRows(1);
            for (String h : new String[]{"Producto", "Precio", "Visible"}) {
                PdfPCell c = new PdfPCell(new Phrase(h, cabecera));
                c.setBackgroundColor(OSCURO);
                c.setPadding(5);
                t.addCell(c);
            }
            boolean alterna = false;
            for (Producto pr : e.getValue()) {
                String[] celdas = {pr.getNombre(), dinero.format(pr.getPrecio()), pr.isActivo() ? "Sí" : "No"};
                for (String texto : celdas) {
                    PdfPCell c = new PdfPCell(new Phrase(texto, normal));
                    c.setPadding(5);
                    if (alterna) c.setBackgroundColor(CLARO);
                    t.addCell(c);
                }
                alterna = !alterna;
            }
            doc.add(t);
        }

        doc.close();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment().filename("reporte-productos.pdf").build());
        return new ResponseEntity<>(out.toByteArray(), headers, HttpStatus.OK);
    }

    private void agregarFilaResumen(PdfPTable t, String etiqueta, String valor, Font f1, Font f2) {
        PdfPCell a = new PdfPCell(new Phrase(etiqueta, f1));
        PdfPCell b = new PdfPCell(new Phrase(valor, f2));
        a.setPadding(4);
        b.setPadding(4);
        t.addCell(a);
        t.addCell(b);
    }
}