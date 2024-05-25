CREATE SCHEMA `sire_utb` ;


CREATE TABLE `Usuario` (
  ID_User VARCHAR(50) NOT NULL,
  Nombre VARCHAR(300) DEFAULT NULL,
  Correo VARCHAR(200) DEFAULT NULL,
  Rol VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (ID_User)
);

CREATE TABLE `Espacio` (
  ID_Espacio VARCHAR(50) NOT NULL,
  Bloque VARCHAR(50) NOT NULL,
  Salon VARCHAR(50) NOT NULL,
  Campus VARCHAR(150) NOT NULL,
  Tipo VARCHAR(50) NOT NULL,
  Capacidad INT NOT NULL,
  Disponibilidad TINYINT(1) NOT NULL,
  Equipos_Tec VARCHAR(500) DEFAULT NULL,
  PRIMARY KEY (ID_Espacio)
);

CREATE TABLE `Materia` (
  ID_Materia VARCHAR(45) NOT NULL,
  Nom_Materia VARCHAR(70) NOT NULL,
  PRIMARY KEY (ID_Materia)
);

CREATE TABLE `AsignacionesMaterias` (
  ID_Asignacion VARCHAR(45) NOT NULL,
  ID_Materia VARCHAR(45) NOT NULL,
  ID_User VARCHAR(45) NOT NULL,
  PRIMARY KEY (ID_Asignacion),
  KEY fk_User_Asig_idx (ID_User),
  KEY fk_Mater_Asig_idx (ID_Materia),
  CONSTRAINT fk_Mater_Asig FOREIGN KEY (ID_Materia) REFERENCES Materia (ID_Materia),
  CONSTRAINT fk_User_Asig FOREIGN KEY (ID_User) REFERENCES Usuario (ID_User)
);

CREATE TABLE `Horario_Clases` (
  ID_Horario VARCHAR(45) NOT NULL,
  ID_Asignacion VARCHAR(45) DEFAULT NULL,
  Lunes VARCHAR(255) DEFAULT NULL,
  Martes VARCHAR(255) DEFAULT NULL,
  Miércoles VARCHAR(255) DEFAULT NULL,
  Jueves VARCHAR(255) DEFAULT NULL,
  Viernes VARCHAR(255) DEFAULT NULL,
  Sábado VARCHAR(255) DEFAULT NULL,
  Domingo VARCHAR(255) DEFAULT NULL,
  Fecha_inicio DATE NOT NULL,
  Fecha_fin DATE NOT NULL,
  ID_Espacio VARCHAR(45) DEFAULT NULL,
  ID_User VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (ID_Horario),
  KEY fk_Horario_Asignacion_idx (ID_Asignacion),
  KEY fk_Horario_Espacio_idx (ID_Espacio),
  KEY fk_Horario_UserMonitor_idx (ID_User),
  CONSTRAINT fk_Horario_Asignacion FOREIGN KEY (ID_Asignacion) REFERENCES AsignacionesMaterias (ID_Asignacion),
  CONSTRAINT fk_Horario_Espacio FOREIGN KEY (ID_Espacio) REFERENCES Espacio (ID_Espacio),
  CONSTRAINT fk_Horario_UserMonitor FOREIGN KEY (ID_User) REFERENCES Usuario (ID_User)
);

CREATE TABLE `Reserva` (
  ID_Reserva VARCHAR(50) NOT NULL,
  ID_User VARCHAR(50) NOT NULL,
  ID_Espacio VARCHAR(50) NOT NULL,
  Tipo_Res TINYINT NOT NULL,
  Fh_Ini DATETIME NOT NULL,
  Fh_Fin DATETIME NOT NULL,
  Estado VARCHAR(50) NOT NULL,
  Apr_Doc VARCHAR(50) NOT NULL,
  Motivo TEXT,
  Aforo INT NOT NULL,
  ID_Prof_Mat VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (ID_Reserva),
  KEY Reserva_ibfk_1 (ID_User),
  KEY Reserva_ibfk_2 (ID_Espacio),
  KEY Reserva_ibfk_3_idx (ID_Prof_Mat),
  CONSTRAINT Reserva_ibfk_1 FOREIGN KEY (ID_User) REFERENCES Usuario (ID_User),
  CONSTRAINT Reserva_ibfk_2 FOREIGN KEY (ID_Espacio) REFERENCES Espacio (ID_Espacio),
  CONSTRAINT Reserva_ibfk_3 FOREIGN KEY (ID_Prof_Mat) REFERENCES AsignacionesMaterias (ID_Asignacion)
);

CREATE TABLE `AsignacionesBloques` (
  ID_Asignacion_Bloque VARCHAR(255) NOT NULL,
  ID_User VARCHAR(45) NOT NULL,
  Bloque_L_V VARCHAR(255) DEFAULT NULL,
  Bloque_S VARCHAR(255) DEFAULT NULL,
  Lunes VARCHAR(255) DEFAULT NULL,
  Martes VARCHAR(255) DEFAULT NULL,
  Miércoles VARCHAR(255) DEFAULT NULL,
  Jueves VARCHAR(255) DEFAULT NULL,
  Viernes VARCHAR(255) DEFAULT NULL,
  Sábado VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (ID_Asignacion_Bloque),
  KEY Fk_Bloques_Aux_idx (ID_User),
  CONSTRAINT Fk_Bloques_Aux FOREIGN KEY (ID_User) REFERENCES Usuario (ID_User)
);

CREATE TABLE `Reporte` (
  ID_Reporte VARCHAR(255) NOT NULL,
  ID_User VARCHAR(50) NOT NULL,
  ID_Reserva VARCHAR(50) DEFAULT NULL,
  ID_Horario VARCHAR(45) DEFAULT NULL,
  Fh_Reporte DATETIME NOT NULL,
  Pre_Reporte TINYINT NOT NULL,
  Descripcion VARCHAR(500) DEFAULT NULL,
  PRIMARY KEY (ID_Reporte),
  KEY Fk_Reporte_Usuario_idx (ID_User),
  KEY Fk_Reporte_Reserva_idx (ID_Reserva),
  KEY Fk_Reporte_Horario_idx (ID_Horario),
  CONSTRAINT Fk_Reporte_Horario FOREIGN KEY (ID_Horario) REFERENCES Horario_Clases (ID_Horario),
  CONSTRAINT Fk_Reporte_Reserva FOREIGN KEY (ID_Reserva) REFERENCES Reserva (ID_Reserva),
  CONSTRAINT Fk_Reporte_Usuario FOREIGN KEY (ID_User) REFERENCES Usuario (ID_User)
);



