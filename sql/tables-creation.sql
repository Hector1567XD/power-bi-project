CREATE TABLE paises (
    paises_id SERIAL PRIMARY KEY,
    continente TEXT NOT NULL,
    nombre TEXT NOT NULL,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE persona (
    persona_id SERIAL PRIMARY KEY,
    cedula TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    genero TEXT NOT NULL,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE empleado (
    empleado_id SERIAL PRIMARY KEY,
    persona_id INT UNIQUE,
    CONSTRAINT fk_persona_id FOREIGN KEY (persona_id) REFERENCES persona(persona_id)
);

CREATE TABLE huesped (
    huesped_id SERIAL PRIMARY KEY,
    persona_id INT UNIQUE,
    CONSTRAINT fk_persona_id FOREIGN KEY (persona_id) REFERENCES persona(persona_id)
);

CREATE TABLE sucursal (
    sucursal_id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    paises_id INT,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ciudad TEXT NOT NULL,
    CONSTRAINT fk_pais_id FOREIGN KEY (paises_id) REFERENCES paises(paises_id)
);

CREATE TABLE planes (
    plan_id SERIAL PRIMARY KEY,
    nombre_plan TEXT NOT NULL,
    precio_por_noche FLOAT NOT NULL,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sucursal_id INT,
    CONSTRAINT fk_sucursal_id FOREIGN KEY (sucursal_id) REFERENCES sucursal(sucursal_id),
    CONSTRAINT unique_plan_sucursal UNIQUE (nombre_plan, sucursal_id)
);

CREATE TABLE servicio (
    servicio_id SERIAL PRIMARY KEY,
    nombre_servicio TEXT NOT NULL,
    precio FLOAT NOT NULL,
    sucursal_id INT,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_sucursal_id FOREIGN KEY (sucursal_id) REFERENCES sucursal(sucursal_id)
);

CREATE TABLE habitacion (
    habitacion_id SERIAL PRIMARY KEY,
    tipo_habitacion TEXT NOT NULL,
    numero_max_huespedes INT NOT NULL,
    sucursal_id INT,
    CONSTRAINT fk_sucursal_id FOREIGN KEY (sucursal_id) REFERENCES sucursal(sucursal_id)
);

CREATE TABLE reserva (
    reserva_id SERIAL PRIMARY KEY,
    numero_huespedes INT NOT NULL,
    precio_de_plan FLOAT NOT NULL,
    cantidad_noches INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_final DATE NOT NULL,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    habitacion_id INT,
    huesped_id INT,
    plan_id INT,
    CONSTRAINT fk_habitacion_id FOREIGN KEY (habitacion_id) REFERENCES habitacion(habitacion_id),
    CONSTRAINT fk_huesped_id FOREIGN KEY (huesped_id) REFERENCES huesped(huesped_id),
    CONSTRAINT fk_plan_id FOREIGN KEY (plan_id) REFERENCES planes(plan_id)
);

CREATE TABLE reserva_servicio (
    reserva_servicio_id SERIAL PRIMARY KEY,
    reserva_id INT NOT NULL,
    servicio_id INT NOT NULL,
    price FLOAT NOT NULL,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_reserva_id FOREIGN KEY (reserva_id) REFERENCES reserva(reserva_id),
    CONSTRAINT fk_servicio_id FOREIGN KEY (servicio_id) REFERENCES servicio(servicio_id)
);
