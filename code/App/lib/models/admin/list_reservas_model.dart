class ReservaAdmin {
  final String idReserva;
  final String nombre;
  final String? nombreDocente;
  final String espacio;
  final String fechaInicio;
  final String fechaFin;
  final String estado;
  final String? aprobacionDocente;
  final String? motivo;
  final int aforo;

  ReservaAdmin({
    required this.idReserva,
    required this.nombre,
    this.nombreDocente,
    required this.espacio,
    required this.fechaInicio,
    required this.fechaFin,
    required this.estado,
    this.aprobacionDocente,
    this.motivo,
    required this.aforo,
  });

  factory ReservaAdmin.fromJson(Map<String, dynamic> json) {
    return ReservaAdmin(
      idReserva: json['ID_Reserva'],
      nombre: json['Nombre'],
      nombreDocente: json['Nombre_Docente'],
      espacio: json['Espacio'],
      fechaInicio: json['Fecha_Inicio'],
      fechaFin: json['Fecha_Fin'],
      estado: json['Estado'],
      aprobacionDocente: json['Aprobación_Docente'],
      motivo: json['Motivo'],
      aforo: json['Aforo'],
    );
  }
}

class ReservasAca {
  final List<ReservaAdmin> reservasAca;

  ReservasAca({required this.reservasAca});

  factory ReservasAca.fromJson(Map<String, dynamic> json) {
    var reservasList = json['Reservas_Aca'] as List;
    List<ReservaAdmin> reservasAca = reservasList
        .map((reservaJson) => ReservaAdmin.fromJson(reservaJson))
        .toList();

    return ReservasAca(reservasAca: reservasAca);
  }
}

class ReservasNAca {
  final List<ReservaAdmin> reservasNAca;

  ReservasNAca({required this.reservasNAca});

  factory ReservasNAca.fromJson(Map<String, dynamic> json) {
    var reservasList = json['Reservas_NAca'] as List;
    List<ReservaAdmin> reservasNAca = reservasList
        .map((reservaJson) => ReservaAdmin.fromJson(reservaJson))
        .toList();

    return ReservasNAca(reservasNAca: reservasNAca);
  }
}
