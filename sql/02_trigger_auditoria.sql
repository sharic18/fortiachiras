-- TRIGGER DE AUDITORÍA DE PRODUCTOS 
-- Registra quién y cuándo crea, modifica o elimina un producto, con el nombre y el precio

CREATE TABLE IF NOT EXISTS auditoria_producto (
    id               BIGSERIAL PRIMARY KEY,
    producto_id      BIGINT,
    accion           VARCHAR(10) NOT NULL,
    usuario_bd       VARCHAR(60) DEFAULT current_user,
    fecha            TIMESTAMP   DEFAULT now(),
    nombre_anterior  VARCHAR(120),
    nombre_nuevo     VARCHAR(120),
    precio_anterior  NUMERIC(10,2),
    precio_nuevo     NUMERIC(10,2)
);

CREATE OR REPLACE FUNCTION fn_auditar_producto() RETURNS trigger AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO auditoria_producto (producto_id, accion, nombre_nuevo, precio_nuevo)
        VALUES (NEW.id, 'INSERT', NEW.nombre, NEW.precio);
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        -- Solo se registra cuando cambia el nombre, el precio o la visibilidad
        IF (OLD.nombre IS DISTINCT FROM NEW.nombre
            OR OLD.precio IS DISTINCT FROM NEW.precio
            OR OLD.activo IS DISTINCT FROM NEW.activo) THEN
            INSERT INTO auditoria_producto (producto_id, accion, nombre_anterior, nombre_nuevo, precio_anterior, precio_nuevo)
            VALUES (NEW.id, 'UPDATE', OLD.nombre, NEW.nombre, OLD.precio, NEW.precio);
        END IF;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO auditoria_producto (producto_id, accion, nombre_anterior, precio_anterior)
        VALUES (OLD.id, 'DELETE', OLD.nombre, OLD.precio);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_auditar_producto ON producto;
CREATE TRIGGER trg_auditar_producto
    AFTER INSERT OR UPDATE OR DELETE ON producto
    FOR EACH ROW EXECUTE FUNCTION fn_auditar_producto();
