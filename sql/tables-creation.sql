CREATE TABLE paises (
    paises_id SERIAL PRIMARY KEY,
    continente TEXT NOT NULL,
    nombre TEXT NOT NULL,
    fechaCreacion TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE persona (
    persona_id SERIAL PRIMARY KEY,
    cedula TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    fechaNacimiento DATE NOT NULL,
    genero TEXT NOT NULL,
    fechaCreacion TIMESTAMPTZ NOT NULL DEFAULT NOW()
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
    fechaCreacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_pais_id FOREIGN KEY (paises_id) REFERENCES paises(paises_id)
);

CREATE TABLE planes (
    plan_id SERIAL PRIMARY KEY,
    tipoDePlan TEXT NOT NULL,
    precioPorNoche FLOAT NOT NULL,
    fechaCreacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sucursal_id INT,
    CONSTRAINT fk_sucursal_id FOREIGN KEY (sucursal_id) REFERENCES sucursal(sucursal_id),
    CONSTRAINT unique_plan_sucursal UNIQUE (tipoDePlan, sucursal_id)
);

CREATE TABLE servicio (
    servicio_id SERIAL PRIMARY KEY,
    tipoDeServicio TEXT NOT NULL,
    precio FLOAT NOT NULL,
    sucursal_id INT,
    fechaCreacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_sucursal_id FOREIGN KEY (sucursal_id) REFERENCES sucursal(sucursal_id)
);

CREATE TABLE habitacion (
    habitacion_id SERIAL PRIMARY KEY,
    tipoDeHabitacion TEXT NOT NULL,
    numeroMaxHuespedes INT NOT NULL,
    sucursal_id INT,
    CONSTRAINT fk_sucursal_id FOREIGN KEY (sucursal_id) REFERENCES sucursal(sucursal_id),
    CONSTRAINT unique_habitacion_sucursal UNIQUE (tipoDeHabitacion, sucursal_id)
);

CREATE TABLE reserva (
    reserva_id SERIAL PRIMARY KEY,
    numeroHuespedes INT NOT NULL,
    precioDePlan FLOAT NOT NULL,
    cantidadNoches INT NOT NULL,
    fechaInicio DATE NOT NULL,
    fechaFinal DATE NOT NULL,
    fechaCreacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    habitacion_id INT,
    huesped_id INT,
    plan_id INT,
    servicio_id INT,
    CONSTRAINT fk_habitacion_id FOREIGN KEY (habitacion_id) REFERENCES habitacion(habitacion_id),
    CONSTRAINT fk_huesped_id FOREIGN KEY (huesped_id) REFERENCES huesped(huesped_id),
    CONSTRAINT fk_plan_id FOREIGN KEY (plan_id) REFERENCES planes(plan_id),
    CONSTRAINT fk_servicio_id FOREIGN KEY (servicio_id) REFERENCES servicio(servicio_id)
);
