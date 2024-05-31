import 'dart:async';
import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:uloginazure/models/api_services_model.dart';
import 'package:uloginazure/models/profesor_model.dart';

class ProfesorProvider {
  // Listas de profesores y aforos
  final List<Profesor> _profesores = [];
  final List<Aforo> _aforo = [];

  // Controladores de Stream
  final _profesoresStreamController =
      StreamController<List<Profesor>>.broadcast();
  final _aforoStreamController = StreamController<List<Aforo>>.broadcast();

  // Sink para agregar datos a los Stream
  Function(List<Profesor>) get profesoresSink =>
      _profesoresStreamController.sink.add;
  Function(List<Aforo>) get aforoSink => _aforoStreamController.sink.add;

  // Streams que emiten las listas de profesores y aforos
  Stream<List<Profesor>> get profesorStream =>
      _profesoresStreamController.stream;
  Stream<List<Aforo>> get aforoStream => _aforoStreamController.stream;

  // Método para liberar recursos
  void dispose() {
    _profesoresStreamController.close();
    _aforoStreamController.close();
  }

  // Método para obtener las reservas de profesores
  Future<List<Profesor>> getReservasAprobar(BuildContext context) async {
    try {
      final reservas = await ApiService.fetchTodoList<Profesor>(
        context,
        url: 'https://coral-app-up4fv.ondigitalocean.app/profe/reserva_profe',
        method: 'get',
        fromJson: (json) => Profesor.fromJson(json),
      );

      _profesores.clear();
      _profesores.addAll(reservas);

      profesoresSink(_profesores);
      notifyListeners();

      return _profesores;
    } catch (e) {
      log('Error fetching profesor: $e');
      rethrow;
    }
  }

  // Método para obtener los aforos
  Future<List<Aforo>> getAforo(BuildContext context) async {
    try {
      final aforoJson = await ApiService.fetchTodoList<Aforo>(
        context,
        url: 'https://sire-utb-x2ifq.ondigitalocean.app/form/getAll',
        method: 'get',
        fromJson: (json) => Aforo.fromJson(json),
      );
      _aforo.clear();
      _aforo.addAll(aforoJson);

      aforoSink(_aforo);

      notifyListeners();

      return _aforo;
    } catch (e) {
      log('Error fetching aforo: $e');
      rethrow;
    }
  }

  void notifyListeners() {
    _profesoresStreamController.add(_profesores);
    _aforoStreamController.add(_aforo);
  }

  // Método privado para actualizar el estado de la reserva
  Future<Map<String, dynamic>> _updateReservaEstado(
      BuildContext context, String reservaId, String estado) async {
    final url =
        'https://coral-app-up4fv.ondigitalocean.app/profe/estado_reserva/$reservaId';
    final body = {'Estado': estado};

    try {
      final responseList = await ApiService.fetchPatch<dynamic>(
        context,
        url: url,
        method: 'PATCH',
        body: body,
        fromJson: (json) => json,
      );
      return responseList;
    } catch (e) {
      log('Error updating reserva estado: $e');
      rethrow;
    }
  }

  // Método para aprobar una reserva
  Future<Object> aprobarReserva(BuildContext context, String reservaId) async {
    final response = await _updateReservaEstado(context, reservaId, 'Aprobada');
    return response;
  }

  // Método para rechazar una reserva
  Future<Object> rechazarReserva(BuildContext context, String reservaId) async {
    final response =
        await _updateReservaEstado(context, reservaId, 'Rechazada');
    return response;
  }
}
