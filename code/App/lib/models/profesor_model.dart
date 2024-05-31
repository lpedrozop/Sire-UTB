class Profesor {
  final String idReserva;
  final String aula;
  final String estado;
  final int tipoReserva;
  final String motivo;
  final String estudiante;
  final String materia;

  Profesor({
    required this.idReserva,
    required this.aula,
    required this.estado,
    required this.tipoReserva,
    required this.motivo,
    required this.estudiante,
    required this.materia,
  });

  factory Profesor.fromJson(Map<String, dynamic> json) {
    return Profesor(
      idReserva: json['ID_Reserva'],
      aula: json['Aula'],
      estado: json['Estado'],
      tipoReserva: json['Tipo de reserva'],
      motivo: json['Motivo'],
      estudiante: json['Estudiante'],
      materia: json['Materia'],
    );
  }
}

class Aforo {
  final int aforo;
  final String aprDoc;
  final String estado;
  final DateTime fhFin;
  final DateTime fhIni;
  final String idEspacio;
  final String? idProfMat;
  final String idReserva;
  final String idUser;
  final String motivo;
  final int tipoRes;

  Aforo({
    required this.aforo,
    required this.aprDoc,
    required this.estado,
    required this.fhFin,
    required this.fhIni,
    required this.idEspacio,
    this.idProfMat,
    required this.idReserva,
    required this.idUser,
    required this.motivo,
    required this.tipoRes,
  });

  factory Aforo.fromJson(Map<String, dynamic> json) {
    return Aforo(
      aforo: json['Aforo'],
      aprDoc: json['Apr_Doc'],
      estado: json['Estado'],
      fhFin: DateTime.parse(json['Fh_Fin']),
      fhIni: DateTime.parse(json['Fh_Ini']),
      idEspacio: json['ID_Espacio'],
      idProfMat: json['ID_Prof_Mat'] ?? '',
      idReserva: json['ID_Reserva'],
      idUser: json['ID_User'],
      motivo: json['Motivo'],
      tipoRes: json['Tipo_Res'],
    );
  }
}
