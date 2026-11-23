-- VERIFICACION FINAL en pgAdmin (Query Tool sobre la base bizcochos_huila).

-- 1) Cantidad de registros por tabla 
SELECT 'categoria' AS tabla, count(*) AS filas FROM categoria
UNION ALL SELECT 'producto', count(*) FROM producto
UNION ALL SELECT 'punto_venta', count(*) FROM punto_venta
UNION ALL SELECT 'contenido', count(*) FROM contenido
UNION ALL SELECT 'usuario', count(*) FROM usuario
UNION ALL SELECT 'auditoria_producto', count(*) FROM auditoria_producto;

-- 2) El usuario administrador debe existir y su clave debe empezar por $2a$ 
SELECT correo, rol, left(password, 4) AS inicio_hash FROM usuario;

-- 3) Traducciones
SELECT nombre FROM producto  WHERE nombre_fr IS NULL;
SELECT nombre FROM categoria WHERE nombre_fr IS NULL;
SELECT titulo FROM contenido WHERE titulo_fr IS NULL;

-- 4) El trigger de auditoria 
SELECT tgname AS trigger_activo FROM pg_trigger
WHERE tgrelid = 'producto'::regclass AND NOT tgisinternal;

-- 5) Ultimos movimientos registrados por el trigger
SELECT * FROM auditoria_producto ORDER BY id DESC LIMIT 20;
