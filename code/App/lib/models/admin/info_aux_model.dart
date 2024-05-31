class Usuario {
  final String idUser;
  final String nombre;
  final String estado;
  final List<Asignacion> asignaciones;

  Usuario({
    required this.idUser,
    required this.nombre,
    required this.estado,
    required this.asignaciones,
  });

  factory Usuario.fromJson(Map<String, dynamic> json) {
    List<Asignacion> asignaciones = [];
    if (json['Asignaciones'] != null) {
      final List<dynamic> asignacionesData = json['Asignaciones'];
      asignaciones =
          asignacionesData.map((data) => Asignacion.fromJson(data)).toList();
    }
    return Usuario(
      idUser: json['ID_User'] ?? '',
      nombre: json['Nombre'] ?? '',
      estado: json['Estado'] ?? '',
      asignaciones: asignaciones,
    );
  }
}

class Asignacion {
  final String bloque;
  final List<Horario> horarios;

  Asignacion({
    required this.bloque,
    required this.horarios,
  });

  factory Asignacion.fromJson(Map<String, dynamic> json) {
    List<Horario> horarios = [];
    if (json['Horarios'] != null) {
      final Map<String, dynamic> horariosData = json['Horarios'];
      final List<Horario> horariosList = horariosData.entries
          .map((entry) => Horario(dia: entry.key, horario: entry.value))
          .toList();
      horarios.addAll(horariosList);
    }
    return Asignacion(
      bloque: json['Bloque'] ?? '',
      horarios: horarios,
    );
  }
}

class Horario {
  final String dia;
  final String horario;

  Horario({
    required this.dia,
    required this.horario,
  });

  factory Horario.fromJson(Map<String, dynamic> json) {
    return Horario(
      dia: json['dia'] ?? '',
      horario: json['horario'] ?? '',
    );
  }
}
