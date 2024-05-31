import 'package:flutter/material.dart';

class Evento {
  late int id;
  late IconData icono;
  late String aula;
  late DateTime horaInicio;
  late DateTime horaFin;
  late String nombrePersona;
  late String descripcionEvento;
  late DateTime fechaReserva;

  Evento({
    required this.id,
    required this.icono,
    required this.aula,
    required this.horaInicio,
    required this.horaFin,
    required this.nombrePersona,
    required this.descripcionEvento,
    required this.fechaReserva,
  });
}
