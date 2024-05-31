class Reserva {
  String nombre;
  String idReserva;
  String idUser;
  String idEspacio;
  int tipoRes;
  String fechaInicio;
  String fechaFin;

  Reserva({
    required this.nombre,
    required this.idReserva,
    required this.idUser,
    required this.idEspacio,
    required this.tipoRes,
    required this.fechaInicio,
    required this.fechaFin,
  });

  factory Reserva.fromJson(Map<String, dynamic> json) {
    return Reserva(
      nombre: json['Nombre'] ?? '',
      idReserva: json['ID_Reserva'] ?? '',
      idUser: json['ID_User'] ?? '',
      idEspacio: json['ID_Espacio'] ?? '',
      tipoRes:
          json['Tipo_Res'] != null ? int.parse(json['Tipo_Res'].toString()) : 0,
      fechaInicio: json['Fh_Ini'] ?? '',
      fechaFin: json['Fh_Fin'] ?? '',
    );
  }
}

class ClaseRegular {
  String nombre;
  String idEspacio;
  String horas;
  String idHorario;

  ClaseRegular({
    required this.nombre,
    required this.idEspacio,
    required this.horas,
    required this.idHorario,
  });

  factory ClaseRegular.fromJson(Map<String, dynamic> json) {
    return ClaseRegular(
      nombre: json['Nombre'] ?? '',
      idEspacio: json['ID_Espacio'] ?? '',
      horas: json['Horas'] ?? '',
      idHorario: json['ID_Horario'] ?? '',
    );
  }
}

class Auxiliar {
  List<Reserva> reservas;
  List<ClaseRegular> clasesRegulares;

  Auxiliar({
    required this.reservas,
    required this.clasesRegulares,
  });

  factory Auxiliar.fromJson(Map<String, dynamic> json) {
    if (json['Reservas'] != null && json['Clases_regulares'] != null) {
      List<dynamic> reservasJson = json['Reservas'];
      List<dynamic> clasesRegularesJson = json['Clases_regulares'];

      List<Reserva> reservas =
          reservasJson.map((item) => Reserva.fromJson(item)).toList();
      List<ClaseRegular> clasesRegulares = clasesRegularesJson
          .map((item) => ClaseRegular.fromJson(item))
          .toList();

      return Auxiliar(reservas: reservas, clasesRegulares: clasesRegulares);
    } else {
      throw Exception('Invalid JSON format for Auxiliar');
    }
  }

  List<Reserva> obtenerReservas() {
    return reservas;
  }
}
