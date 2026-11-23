
-- Categorías
UPDATE categoria SET nombre_fr = 'Biscuits d''achira'        WHERE nombre = 'Bizcochos de achira';
UPDATE categoria SET nombre_fr = 'Bizcochos traditionnels'   WHERE nombre = 'Bizcochos tradicionales';
UPDATE categoria SET nombre_fr = 'Gâteaux traditionnels'     WHERE nombre = 'Tortas tradicionales';
UPDATE categoria SET nombre_fr = 'Douceurs traditionnelles'  WHERE nombre = 'Dulces tradicionales';
UPDATE categoria SET nombre_fr = 'Boissons'                  WHERE nombre = 'Bebidas';
UPDATE categoria SET nombre_fr = 'Spiritueux'                WHERE nombre = 'Licores';

-- Nombres de productos
UPDATE producto SET nombre_fr = 'Bizcocho d''achira x 35 g'  WHERE nombre ILIKE 'Bizcocho de achira x 35%';
UPDATE producto SET nombre_fr = 'Bizcocho d''achira x 72 g'  WHERE nombre ILIKE 'Bizcocho de achira x 72%';
UPDATE producto SET nombre_fr = 'Bizcocho d''achira x 120 g' WHERE nombre ILIKE 'Bizcocho de achira x 120%';
UPDATE producto SET nombre_fr = 'Bizcocho de maïs'           WHERE nombre ILIKE 'Bizcocho de ma%';
UPDATE producto SET nombre_fr = 'Pandero'                    WHERE nombre ILIKE 'Pandero%';
UPDATE producto SET nombre_fr = 'Manteco'                    WHERE nombre ILIKE 'Manteco%';
UPDATE producto SET nombre_fr = 'Cuca (gâteau traditionnel)' WHERE nombre ILIKE 'Cuca%';
UPDATE producto SET nombre_fr = 'Alfandoque (confiserie traditionnelle)' WHERE nombre ILIKE 'Alfandoque%';
UPDATE producto SET nombre_fr = 'Soda Kóndor'                WHERE nombre ILIKE 'Gaseosa%';
UPDATE producto SET nombre_fr = 'Aguardiente (liqueur d''anis)' WHERE nombre ILIKE 'Aguardiente%';
UPDATE producto SET nombre_fr = 'Arequipe (dulce de leche)'  WHERE nombre ILIKE 'Arequipe%';
UPDATE producto SET nombre_fr = 'Chocolat'                   WHERE nombre ILIKE 'Chocolate%';
UPDATE producto SET nombre_fr = 'Eau'                        WHERE nombre ILIKE 'Agua%';
UPDATE producto SET nombre_fr = 'Bizcochuelo'                WHERE nombre ILIKE 'Bizcochuelo%';
UPDATE producto SET nombre_fr = 'Masato'                     WHERE nombre ILIKE 'Masato%';

-- Descripciones de productos (según su categoría)
UPDATE producto p SET descripcion_fr = 'Recette familiale transmise depuis des générations, préparée avec de l''achira du Huila.' FROM categoria c WHERE p.categoria_id = c.id AND c.nombre = 'Bizcochos de achira';
UPDATE producto p SET descripcion_fr = 'Bizcocho traditionnel du Huila.'      FROM categoria c WHERE p.categoria_id = c.id AND c.nombre = 'Bizcochos tradicionales';
UPDATE producto p SET descripcion_fr = 'Gâteau traditionnel de la région.'     FROM categoria c WHERE p.categoria_id = c.id AND c.nombre = 'Tortas tradicionales';
UPDATE producto p SET descripcion_fr = 'Douceur traditionnelle.'              FROM categoria c WHERE p.categoria_id = c.id AND c.nombre = 'Dulces tradicionales';
UPDATE producto p SET descripcion_fr = 'Une boisson pour accompagner.'         FROM categoria c WHERE p.categoria_id = c.id AND c.nombre = 'Bebidas';
UPDATE producto p SET descripcion_fr = 'Liqueur traditionnelle. Vente réservée aux personnes majeures.' FROM categoria c WHERE p.categoria_id = c.id AND c.nombre = 'Licores';

-- Contenido de Cultura y Proceso
UPDATE contenido SET
  titulo_fr = 'Soixante-dix ans de tradition familiale',
  texto_fr  = E'Depuis soixante-dix ans, notre usine est située dans le corregimiento de Fortalecillas, dans le Huila. C''est là que notre arrière-grand-mère María Cristina a commencé à préparer des bizcochos, une tradition qui reste vivante dans notre famille.\nFortiachiras est né grâce à notre grand-mère, María Elcy Olaya, qui vendait les bizcochos dans des paniers sur la place centrale de Neiva. Peu à peu, elle a fait grandir et amélioré l''usine, et a transmis le métier à ses enfants.\nAujourd''hui, ils poursuivent l''entreprise : ils ont industrialisé et amélioré l''usine pour produire davantage, sans perdre la recette d''origine, et ils apportent nos bizcochos dans tout le Huila et dans d''autres régions de Colombie.'
WHERE titulo = 'Setenta años de tradición familiar';

UPDATE contenido SET
  titulo_fr = 'Le bizcocho sur la table du Huila',
  texto_fr  = E'Dans le Huila, le bizcocho accompagne les meilleurs moments de la journée. C''est le complément parfait pour le goûter avec un Kola Cóndor bien frais, pour l''associer à l''arequipe, ou pour un bon petit-déjeuner avec du chocolat bien chaud ou de l''aguapanela.\nIl est aussi essentiel dans le célèbre petit-déjeuner appelé el migao.\nChaque bizcocho Fortiachiras apporte cette saveur sur votre table.'
WHERE titulo = 'El bizcocho en la mesa huilense';

UPDATE contenido SET
  titulo_fr = 'Comment nous fabriquons nos bizcochos d''achira',
  texto_fr  = E'Notre bizcocho d''achira est le bizcocho traditionnel, celui par lequel tout a commencé. Il est préparé de façon artisanale, étape par étape :\n1. Préparer les ingrédients : fromage, farine de sagú, œufs, panela, sel, colorant et beurre.\n2. Presser le fromage : on en extrait le plus de petit-lait possible, jusqu''à le déshydrater.\n3. Mélanger les ingrédients.\n4. Moudre le mélange jusqu''à obtenir une pâte homogène.\n5. Pétrir.\n6. Façonner à la main (rosqueado) : chaque bizcocho est modelé à la main.\n7. Disposer les bizcochos sur des plaques.\n8. Cuire : ils sont cuits dans un four en terre.\n9. Griller : c''est la dernière étape de fabrication ; elle laisse le bizcocho prêt à être consommé.\n10. Emballer : il est prêt à être commercialisé.'
WHERE titulo LIKE 'Así hacemos nuestros bizcochos%';

SELECT nombre, nombre_fr FROM producto WHERE nombre_fr IS NULL;
SELECT nombre, nombre_fr FROM categoria WHERE nombre_fr IS NULL;
SELECT titulo, titulo_fr FROM contenido WHERE titulo_fr IS NULL;
